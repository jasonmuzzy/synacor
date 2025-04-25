export function solveCoins() {
    
    const coins = Object.entries({
        red: 2,
        blue: 9,
        shiny: 5,
        concave: 7,
        corroded: 3
    });

    for (let seq of permutations(coins)) {
        if (seq[0][1] + seq[1][1] * seq[2][1] ** 2 + seq[3][1] ** 3 - seq[4][1] === 399) {
            return seq.map(v => `use ${v[0]} coin`).join('\n');
        }
    }

    return '';

}

function permutations<T>(arr: T[]): T[][] {
    if (arr.length === 0) return [[]];

    const result: T[][] = [];

    for (let i = 0; i < arr.length; i++) {
        const current = arr[i];
        const rest = arr.slice(0, i).concat(arr.slice(i + 1));
        const permsOfRest = permutations(rest);

        for (const perm of permsOfRest) {
            result.push([current, ...perm]);
        }
    }

    return result;
}

if (require.main === module) {
    console.log(`The correct order to use the coins in is:\n${solveCoins()}`);
}