import { Particle, Position, RGBAColour, Velocity } from '../Particle';
import { Canvas } from '../../Canvas';

export class Polygon extends Particle {

    constructor(
        public position: Position,
        public size: number,
        public colour: RGBAColour,
        public sides: number,
        public velocity: Velocity
    ) {
        super(position, size, colour,velocity);
    }

    drawToCanvas(canvas: Canvas): void {
        canvas
            .changeFillColour(this.colour.toString())
            .drawPolygon(
                this.position.x,
                this.position.y,
                this.size,
                this.sides,
            );
    }
}