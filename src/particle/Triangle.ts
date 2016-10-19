import { Particle } from './Particle';
import { Canvas } from '../Canvas';

export class Triangle extends Particle {

    drawToCanvas(canvas: Canvas): void {
        canvas
            .changeFillColour(this.colour.toString())
            .drawPolygon(this.position.x, this.position.y, this.size, 3);
    }
}
