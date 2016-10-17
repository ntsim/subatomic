import { Particle, Position } from './Particle';
import { Canvas } from '../Canvas';

export class Star extends Particle {

    drawToCanvas(canvas: Canvas): void {
        canvas
            .changeFillColour(this.colour.toString())
            .drawPolygon(
                this.position.x,
                this.position.y,
                this.size,
                5,
                0,
                144,
            );
    }
}