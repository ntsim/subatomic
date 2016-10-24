export function calculateSideLength(circumRadius: number, sides: number): number {
    let sideLength = 2 * circumRadius * Math.sin(Math.PI / sides);

    return Math.round(sideLength);
}
