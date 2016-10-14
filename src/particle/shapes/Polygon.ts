import { Particle, Position, RGBAColour } from '../Particle';
import { Canvas } from '../../Canvas';

export class Polygon extends Particle {

    constructor(
        public position: Position,
        public size: number,
        public colour: RGBAColour,
        public sides: number,
    ) {
        super(position, size, colour);
    }

    drawToCanvas(canvas: Canvas): void {
        canvas
            .changeFillColour(this.colour.toString())
            .drawShape(
                this.position.x,
                this.position.y,
                this.size,
                this.sides
            );
    }
}