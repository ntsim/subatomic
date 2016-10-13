import { Canvas } from '../Canvas';

export abstract class Particle {

    protected opacity: number;
    protected size: number;
    protected position: Position;
    protected colour: string;

    constructor(
        size: number,
        opacity: number,
        position: Position,
        colour: string,
    ) {
        this.opacity = opacity;
        this.size = size;
        this.position = position;
        this.colour = colour;
    }

    abstract draw(canvas: Canvas): void;
}

export class Position {
    x: number;
    y: number;

    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}