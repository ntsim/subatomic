import { Canvas } from '../Canvas';

const SPEED = 0.02;

export abstract class Particle {
    constructor(
        public position: Position,
        public size: number,
        public colour: RGBAColour,
        public velocity?: Velocity
    ) {}

    abstract drawToCanvas(canvas: Canvas): void;

    move(): void {
        let nextX = this.position.x + this.velocity.dX;
        let nextY = this.position.y + this.velocity.dY;

        if (nextX >= 1 || nextX <= -1) {
            nextX = -nextX;
        }

        if (nextY >= 1 || nextY <= -1) {
            nextY = -nextY;
        }

        this.position = new Position(nextX, nextY);
    }
}

export class Position {
    constructor(public x: number, public y: number) {
        // if (x > 1 || x < 0) {
        //     throw new Error('x-coordinate cannot be greater than 1 or less than 0.');
        // }
        //
        // if (y > 1 || y < 0) {
        //     throw new Error('y-coordinate cannot be greater than 1 or less than 0.');
        // }
    }
}

/**
 * Represents the change in position of the particle over time.
 */
export class Velocity {
    constructor(public dX: number, public dY: number) {}
}

export class RGBAColour {
    constructor(
        public r: number = 0,
        public g: number = 0,
        public b: number = 0,
        public a: number = 1
    ) {}

    toString(): string {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }

    static fromHex(hexColour: string, opacity: number = 1.0): RGBAColour {
        if (opacity > 1 || opacity < 0) {
            throw new Error('Opacity cannot be greater than 1 or less than 0.');
        }

        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        const hex = hexColour.replace(shorthandRegex, (m, r, g, b) => {
            return r + r + g + g + b + b;
        });

        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        if (!result) {
            throw new Error('Invalid hex colour was provided.');
        }

        return new RGBAColour(
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16),
            +opacity,
        );
    }
}