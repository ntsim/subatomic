import { Particle } from './Particle';
import { CanvasPosition, Velocity, RGBAColour } from '../common';
import { Canvas } from '../Canvas';

export class ImageParticle extends Particle {
    constructor(
        public position: CanvasPosition,
        public size: number,
        public colour: RGBAColour,
        public imageElement: HTMLImageElement,
        public velocity?: Velocity
    ) {
        super(position, size, colour, velocity);
    }

    drawToCanvas(canvas: Canvas): void {
        const width = this.imageElement.width * this.size / 100;
        const height = this.imageElement.height * this.size / 100;

        canvas
            .saveContext()
            .changeAlpha(this.colour.a)
            .drawImage(this.position.x, this.position.y, this.imageElement, width, height)
            .restoreContext();
    }
}
