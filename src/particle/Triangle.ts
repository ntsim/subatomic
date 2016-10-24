import { Polygon } from './Polygon';
import { Canvas } from '../Canvas';
import { CanvasPosition, RGBAColour, Velocity } from '../common';

export class Triangle extends Polygon {

    public sideLength: number;

    constructor(
        public position: CanvasPosition,
        public size: number,
        public colour: RGBAColour,
        public velocity: Velocity,
    ) {
        super(position, size, colour, 3, velocity);
    }

    drawToCanvas(canvas: Canvas): void {
        canvas
            .changeFillColour(this.colour.toString())
            .drawPolygon(this.position.x, this.position.y, this.size, this.sideLength, 3);
    }
}
