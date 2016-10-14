import { Canvas } from '../Canvas';

export abstract class Particle {
    public colour: Colour;

    constructor(
        public size: number,
        public opacity: number,
        public position: Position,
        colour: string,
    ) {
        this.opacity = opacity;
        this.size = size;
        this.position = position;
        this.colour = new Colour(colour);
    }

    abstract drawToCanvas(canvas: Canvas): void;
}

export class Position {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        if (x > 1 || x < 0) {
            throw new Error('x-coordinate cannot be greater than 1 or less than 0.');
        }

        if (y > 1 || y < 0) {
            throw new Error('y-coordinate cannot be greater than 1 or less than 0.');
        }

        this.x = x;
        this.y = y;
    }
}

export class Colour {
    r: number = 0;
    g: number = 0;
    b: number = 0;

    constructor(hexColour: string) {
        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        const hex = hexColour.replace(shorthandRegex,(m, r, g, b) => {
            return r + r + g + g + b + b;
        });

        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        if (result) {
            this.r = parseInt(result[1], 16);
            this.g = parseInt(result[2], 16);
            this.b = parseInt(result[3], 16);
        }
    }
}