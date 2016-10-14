import { Particle, Position } from '../Particle';
import { Canvas } from '../../Canvas';

export class Circle extends Particle {

    drawToCanvas(canvas: Canvas): void {
        canvas.changeFillColour(this.colour.toRgb());
        canvas.drawArc(
            this.position.x,
            this.position.y,
            this.size,
            0,
            Math.PI * 2
        );
    }
}