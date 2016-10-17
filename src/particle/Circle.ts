import { Particle, Position } from './Particle';
import { Canvas } from '../Canvas';

export class Circle extends Particle {

    drawToCanvas(canvas: Canvas): void {
        canvas
            .changeFillColour(this.colour.toString())
            .drawArc(this.position.x, this.position.y, this.size, 0, 360);
    }
}