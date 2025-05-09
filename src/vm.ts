import * as fs from 'node:fs/promises';
import { createInterface } from 'node:readline/promises';

import { getEnergyLevel } from './teleporter';
import { solveVault } from './vault';
import { solveCoins } from './coins';

async function main(inputBuffer: string) {

    const buffer = await fs.readFile('./challenge.bin');
    const bin = new Uint16Array(buffer.buffer, buffer.byteOffset, buffer.length / 2);
    const memory: number[] = Array.from({ length: 2 ** 15 }, (v, k) => bin[k] ?? 0);
    const registers: number[] = Array(8).fill(0);
    const stack: number[] = [];
    let pointer = 0, line = '', readBook = false;

    function get(n: number) {
        if (n >= 0 && n <= 32767) return n;
        else if (n >= 32768 && n <= 32775) return registers[mod(n, 32768)];
        else throw new Error(`Invalid ${n}`);
    }

    const OPS = { HALT: 0, SET: 1, PUSH: 2, POP: 3, EQ: 4, GT: 5, JMP: 6, JT: 7, JF: 8, ADD: 9, MULT: 10, MOD: 11, AND: 12, OR: 13, NOT: 14, RMEM: 15, WMEM: 16, CALL: 17, RET: 18, OUT: 19, IN: 20, NOOP: 21 } as const;
    // const calls: string[] = [];
    // const memo: Map<string, [number, number, number]> = new Map();
    while (pointer < memory.length) {
        let [op, p1, p2, p3] = memory.slice(pointer, pointer + 4);

        if (pointer === 5473 && readBook) { // Checking energy level > 0
            registers[7] = 1; // Set it to any non-zero value to begin with

        } else if (pointer === 5511 && readBook) { // Checking energy level > 0
            // Solve the teleporter

            // 1. Find the energy level
            process.stdout.write(`Searching for energy level... `);
            const start = Date.now();
            registers[7] = getEnergyLevel();
            console.log(`Found ${registers[7]} after ${Date.now() - start}ms -- so much for billions of years!\n`);

            // 2. Bypass the confirmation
            pointer = 5520;
            continue;

            /*
            // This code added memoization to the built-in energy level confirmation so that it ran in ms instead of billions of years,
            // which was useful for understanding how it worked, but is now unnecessary since we bypass it.  Leaving for reference.
        } else if (pointer === 6049) { // Energy level confirmation
            const k = `${registers[0]},${registers[1]},${registers[7]}`;
            const v = memo.get(k);
            if (v === undefined) {
                calls.push(k);
            } else {
                [registers[0], registers[1], registers[7]] = v;
                op = OPS.RET;
            }
        } else if (pointer === 6056 || pointer === 6069 || pointer === 6089) { // Return statements in energy level confirmation
            memo.set(calls.pop()!, [registers[0], registers[1], registers[7]]);
            */
        }

        if (op === OPS.HALT) break;
        else if (op === OPS.SET) registers[mod(p1, 32768)] = get(p2);
        else if (op === OPS.PUSH) stack.push(get(p1));
        else if (op === OPS.POP) registers[mod(p1, 32768)] = stack.pop()!;
        else if (op === OPS.EQ) registers[mod(p1, 32768)] = get(p2) === get(p3) ? 1 : 0;
        else if (op === OPS.GT) registers[mod(p1, 32768)] = get(p2) > get(p3) ? 1 : 0;
        else if (op === OPS.JMP) pointer = get(p1);
        else if (op === OPS.JT) pointer = get(p1) !== 0 ? get(p2) : pointer + 3;
        else if (op === OPS.JF) pointer = get(p1) === 0 ? get(p2) : pointer + 3;
        else if (op === OPS.ADD) registers[mod(p1, 32768)] = mod(get(p2) + get(p3), 32768);
        else if (op === OPS.MULT) registers[mod(p1, 32768)] = mod(get(p2) * get(p3), 32768);
        else if (op === OPS.MOD) registers[mod(p1, 32768)] = mod(get(p2), get(p3));
        else if (op === OPS.AND) registers[mod(p1, 32768)] = get(p2) & get(p3);
        else if (op === OPS.OR) registers[mod(p1, 32768)] = get(p2) | get(p3);
        else if (op === OPS.NOT) registers[mod(p1, 32768)] = ~(get(p2)) & 32767;
        else if (op === OPS.RMEM) registers[mod(p1, 32768)] = memory[get(p2)];
        else if (op === OPS.WMEM) memory[get(p1)] = get(p2);
        else if (op === OPS.CALL) {
            stack.push(pointer + 2);
            pointer = get(p1);
        } else if (op === OPS.RET) pointer = stack.pop()!;
        else if (op === OPS.OUT) {
            const char = String.fromCharCode(get(p1));
            if (char === '\n') {
                if (line === 'Then, set the eighth register to this value, activate the teleporter, and') {
                    readBook = true;
                }
                line = '';
            } else {
                line += char;
            }
            process.stdout.write(char);
        } else if (op === OPS.IN) {
            if (inputBuffer === '') {
                const rl = createInterface({ input: process.stdin, output: process.stdout });
                inputBuffer = await rl.question(': ') + '\n';
                rl.close();
            }
            registers[mod(p1, 32768)] = inputBuffer.charCodeAt(0);
            inputBuffer = inputBuffer.substring(1);
        } else if (op === OPS.NOOP) { }
        pointer += [1, 3, 2, 2, 4, 4, 0, 0, 0, 4, 4, 4, 4, 4, 3, 3, 3, 0, 0, 2, 2, 1][op];
    }

    return registers[0];

}

function mod(n: number, d: number) {
    return ((n % d) + d) % d;
}

const inputBuffer = `take tablet
look tablet
use tablet
doorway
north
north
bridge
continue
down
east
take empty lantern
look empty lantern
west
west
passage
ladder
west
south
north
take can
look can
use can
look lantern
use lantern
look lit lantern
west
ladder
darkness
continue
west
west
west
west
north
take red coin
look red coin
north
west
take blue coin
look blue coin
up
take shiny coin
look shiny coin
down
east
east
take concave coin
look concave coin
down
take corroded coin
look corroded coin
up
west
` + solveCoins() + `
north
take teleporter
look teleporter
use teleporter
take business card
look business card
take strange book
look strange book
use teleporter
north
north
north
north
north
north
north
east
take journal
look journal
west
north
north
take orb
look orb
` + solveVault() + `
vault
take mirror
look mirror
use mirror
`;

main(inputBuffer);