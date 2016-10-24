import { Particle } from './Particle';
import { Canvas } from '../Canvas';
import { RGBAColour, Velocity, CanvasPosition } from '../common';

export class Polygon extends Particle {

    static calculateSideLength(circumRadius: number, sides: number) {
        let sideLength = 2 * circumRadius * Math.sin(Math.PI / sides);

        return Math.round(sideLength);
    }

    public sideLength: number;
    private _size: number;

    constructor(
        public position: CanvasPosition,
        size: number,
        public colour: RGBAColour,
        public sides: number,
        public velocity?: Velocity
    ) {
        super(position, size, colour, velocity);

        if (this.sides < 3) {
            throw new Error('Cannot draw a shape with less than 3 sides.');
        }
    }

    drawToCanvas(canvas: Canvas): void {
        canvas
            .changeFillColour(this.colour.toString())
            .drawPolygon(
                this.position.x,
                this.position.y,
                this.size,
                this.sideLength,
                this.sides,
            );
    }

    set size(size: number) {
        this._size = size;
        this.sideLength = Polygon.calculateSideLength(this.size, this.sides);
    }

    get size(): number {
        return this._size;
    }
}
