// Capable of checking all 32,768 possible energy levels in less than 7 seconds
function confirm(r0: number, r1: number, r7: number): number {
    // Similar to Ackermann function (https://en.wikipedia.org/wiki/Ackermann_function)
    if (r0 === 0) {
        // Observed by disassembling
        return (r1 + 1) % 32768;
    } else if (r0 === 1) {
        // Discovered myself (trivial)
        return (r7 + r1 + 1) % 32768;
    } else if (r0 === 2) {
        // Credit: AxlLind (https://github.com/AxlLind/synacor_challenge/blob/master/src/bin/teleporter_setting.rs)
        return (r1 * (r7 + 1) + 2 * r7 + 1) % 32768;
    } else { // r0 > 2
        // Credit: encse (https://github.com/encse/synacor-challenge/blob/master/src/puzzles/teleporter.ts)
        // encse worked out how the value for any r0 `row` can be looked up from the r0 - 1 `prevRow` -- amazing!
        let prevrow = new Uint16Array(32768);
        let row = new Uint16Array(32768);
        for (let r0T = 2; r0T <= r0; r0T++) {
            for (let r1T = 0; r1T < 32768; r1T++) {
                if (r0T == 2) {
                    row[r1T] = (r1T * (r7 + 1) + 2 * r7 + 1) % 32768; // Combined AxlLind + encse to start directly from r0 === 2
                } else if (r1T == 0) {
                    row[r1T] = prevrow[r7];
                } else {
                    row[r1T] = prevrow[row[r1T - 1]];
                }

                if (r0T == r0 && r1T == r1) {
                    return row[r1];
                }
            }
            const t = prevrow;
            prevrow = row;
            row = t;
        }
        throw new Error('');
    }
}

export function getEnergyLevel() {
    let r7 = 1, v = 0;
    for (; r7 < 32768; r7++) {
        v = confirm(4, 1, r7);
        if (v === 6) break;
    }
    return r7;
}

if (require.main === module) {
    console.log(`The correct energy level is: ${getEnergyLevel()}`);
}

// This was my personal best for finding the energy level, which took approximately 10 minutes to run
// after optimizing to use memoization and converting from recursion to iteration to avoid exceeding
// the max stack depth.

// function confirm(r0: number, r1: number, r7: number) {
//     const cache: Array<number[]> = Array.from({ length: 5 }, () => new Array(32768));
//     let lvl = 0, rule = 0, result = -1;
//     const q: number[][] = [];
//     const stack = [[r0, r1, lvl, rule]];
//     while (stack.length > 0) {
//         [r0, r1, lvl, rule] = stack.pop()!;
//         if (cache[r0][r1] !== undefined) {
//             result = cache[r0][r1];
//             while (q.length > 0 && q[q.length - 1][2] === lvl) {
//                 const [_r0, _r1] = q.pop()!;
//                 cache[_r0][_r1] = result;
//             }
//         } else {
//             if (rule === 0) {
//                 if (r0 === 0) {
//                     result = (r1 + 1) % 32768;
//                     cache[r0][r1] = result;
//                     while (q.length > 0 && q[q.length - 1][2] === lvl) {
//                         const [_r0, _r1] = q.pop()!;
//                         cache[_r0][_r1] = result;
//                     }
//                 } else if (r0 === 2) {
//                     result = (r1 * (r7 + 1) + 2 * r7 + 1) % 32768;
//                 } else if (r1 === 0) {
//                     stack.push([r0 - 1, r7, lvl, 0]);
//                     q.push([r0, r1, lvl]);
//                 } else {
//                     stack.push([r0, r1, lvl, 1]);
//                     stack.push([r0, r1 - 1, lvl + 1, 0]);
//                     q.push([r0, r1, lvl]);
//                 }
//             } else {
//                 stack.push([r0 - 1, result, lvl, 0]);
//             }
//         }
//     }
//     return result;
// }
