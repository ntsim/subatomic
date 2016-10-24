import { Polygon } from './Polygon';
import { Canvas } from '../Canvas';
import { RGBAColour, Velocity, CanvasPosition } from '../common';

export class Star extends Polygon {

    public sideLength: number;

    constructor(position: CanvasPosition, size: number, colour: RGBAColour, velocity: Velocity) {
        super(position, size, colour, velocity, 5);
    }

    drawToCanvas(canvas: Canvas): void {
        canvas
            .changeFillColour(this.colour.toString())
            .drawPolygon(
                this.position.x,
                this.position.y,
                this.sideLength / 2,
                this.sideLength,
                5,
                0,
                144,
            );
    }
}
