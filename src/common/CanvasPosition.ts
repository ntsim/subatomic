export class CanvasPosition {
    /**
     * Generate a particle Position from a provided 2d space (i.e. a canvas). A particle
     * radius can be added to avoid a collision with the walls of the 2d space.
     *
     * @param width
     * @param height
     * @param particleSize if Position should have a
     * @returns {Position}
     */
    static randomFrom2d(width: number, height: number, particleSize?: number) {
        const maxWidth = width - particleSize;
        const maxHeight = height - particleSize;

        // Generate a random coordinate
        let x = Math.random() * width;
        let y = Math.random() * height;

        if (particleSize) {
            // Make sure that the coordinate does not make an edge of any
            // particle fall outside of the actual canvas
            x = (x + particleSize) > maxWidth ? x - particleSize : x;
            y = (y + particleSize) > maxHeight ? y - particleSize : y;

            x = (x - particleSize) < 0 ? x + particleSize : x;
            y = (y - particleSize) < 0 ? y + particleSize : y;
        }

        return new CanvasPosition(x, y);
    }

    constructor(public x: number, public y: number) {}

    changeCoordinate(x: number, y: number): void {
        this.x = x;
        this.y = y;
    }

    distanceTo(otherPosition: CanvasPosition): number {
        const diffX = this.x - otherPosition.x;
        const diffY = this.y - otherPosition.y;

        // Use Pythagoras theorem to get the distance
        return Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
    }
}
