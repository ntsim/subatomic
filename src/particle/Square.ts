import { Polygon } from './Polygon';
import { Canvas } from '../Canvas';
import { CanvasPosition, RGBAColour, Velocity } from '../common';

export class Square extends Polygon {
    constructor(
        public position: CanvasPosition,
        public size: number,
        public colour: RGBAColour,
        public velocity: Velocity
    ) {
        super(position, size, colour, velocity, 4);
    }

    drawToCanvas(canvas: Canvas): void {
        canvas
            .changeFillColour(this.colour.toString())
            .drawRectangle(
                this.position.x,
                this.position.y,
                this.sideLength,
                this.sideLength
            );
    }
}
