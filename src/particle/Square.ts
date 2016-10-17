import { Particle, Position } from './Particle';
import { Canvas } from '../Canvas';

export class Square extends Particle {

    drawToCanvas(canvas: Canvas): void {
        canvas
            .changeFillColour(this.colour.toString())
            .drawRectangle(
                this.position.x,
                this.position.y,
                this.size,
                this.size
            );
    }
}