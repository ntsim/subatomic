import { Canvas } from '../Canvas';
import { CanvasPosition, RGBAColour, OpacityAnimation, SizeAnimation, Velocity } from '../common';

export abstract class Particle {
    constructor(
        public position: CanvasPosition,
        public size: number,
        public colour: RGBAColour,
        public velocity?: Velocity,
        public opacityAnimation?: OpacityAnimation,
        public sizeAnimation?: SizeAnimation
    ) {
    }

    abstract drawToCanvas(canvas: Canvas): void;
}
