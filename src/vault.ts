export function getPath() {

    /*

    *   8   -   1
    4   *   11  *
    +   4   -   18
    22  -   9   *

    north east east north west south east east west north north east
    */

    // Find path through maze that gives result equal to 30
    // Avoid returning to the antechamber which removes the orb from inventory and resets the puzzle
    const map: Map<number, [number, string, number, string][]> = new Map([
        [1, [[3, '-', 1, 'east east'], [10, '*', 4, 'west south'], [12, '-', 11, 'east south'], [12, '*', 11, 'south east'], [21, '*', 4, 'south south']]],
        [3, [[1, '-', 8, 'west west'], [12, '-', 11, 'west south'], [12, '*', 11, 'south west'], [23, '*', 18, 'south south']]],
        [10, [[1, '*', 8, 'north east'], [12, '*', 11, 'east east'], [21, '*', 4, 'east south'], [21, '+', 4, 'south east']]],
        [12, [[1, '-', 8, 'north west'], [1, '*', 8, 'west north'], [3, '-', 1, 'north east'], [3, '*', 1, 'east north'], [10, '*', 4, 'west west'], [21, '*', 4, 'west south'], [21, '-', 4, 'south west'], [23, '*', 18, 'east south'], [23, '-', 18, 'south east'], [32, '-', 9, 'south south']]],
        [21, [[1, '*', 8, 'north north'], [10, '*', 4, 'north west'], [10, '+', 4, 'west north'], [12, '*', 11, 'north east'], [12, '-', 11, 'east north'], [23, '-', 18, 'east east'], [32, '-', 9, 'east south']]],
        [23, [[3, '*', 1, 'north north'], [12, '*', 11, 'north west'], [12, '-', 11, 'west north'], [21, '-', 4, 'west west'], [32, '-', 9, 'west south'], [32, '*', 9, 'south west']]],
        [30, [[10, '+', 4, 'north north'], [21, '+', 4, 'north east'], [21, '-', 4, 'east north'], [32, '-', 9, 'east east']]],
        [32, [[12, '-', 11, 'north north'], [21, '-', 4, 'north west'], [23, '-', 18, 'north east'], [23, '*', 18, 'east north']]],
    ]);

    const q: [number, number, number, string][] = [[0, 30, 22, '']];
    const vs: Map<string, number> = new Map();
    while (q.length > 0) {

        const [steps, id, v, path] = q.shift()!;

        // Path found
        if (id === 3 && v === 30) {
            return path;
        }

        // Visiteds
        const key = `${id},${v}`;
        const check = vs.get(key);
        if (check !== undefined && check <= steps) continue;
        vs.set(key, steps);

        // Neighbors
        for (let [id1, op, v1, dir] of map.get(id)!) {
            if (op === '+') v1 = v + v1;
            else if (op === '-') v1 = v - v1;
            else v1 = v * v1;
            q.push([steps + 1, id1, v1, path + (path === '' ? '' : ' ') + dir]);
        }

    }

}

if (require.main === module) {
    console.log(`The path to the vault is:\n${getPath()?.replaceAll(' ', '\n')}`);
}