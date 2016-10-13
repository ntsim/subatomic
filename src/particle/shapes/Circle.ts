import { Particle, Position } from '../Particle';
import { Canvas } from '../../Canvas';

export class Circle extends Particle {

    draw(canvas: Canvas): void {
        canvas.context.arc(
            this.position.x,
            this.position.y,
            this.size,
            0,
            Math.PI * 2,
            false
        );
    }
}