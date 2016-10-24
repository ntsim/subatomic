import { Particle, Position, RGBAColour, Velocity } from './Particle';
import { Canvas } from '../Canvas';
import { polygon } from '../util';

export class Polygon extends Particle {

    public sideLength: number;

    constructor(
        public position: Position,
        public size: number,
        public colour: RGBAColour,
        public sides: number,
        public velocity: Velocity
    ) {
        super(position, size, colour, velocity);

        if (this.sides < 3) {
            throw new Error('Cannot draw a shape with less than 3 sides.');
        }

        this.sideLength = polygon.calculateSideLength(this.size, this.sides);
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
}
