import { Particle, RGBAColour, Velocity, Position } from './Particle';
import { Canvas } from '../Canvas';
import { polygon } from '../util';

export class Triangle extends Particle {

    public sideLength: number;

    constructor(public position: Position,
                public size: number,
                public colour: RGBAColour,
                public velocity: Velocity,
    ) {
        super(position, size, colour, velocity);

        this.sideLength  = polygon.calculateSideLength(this.size, 3);

    }

    drawToCanvas(canvas: Canvas): void {
        canvas
            .changeFillColour(this.colour.toString())
            .drawPolygon(this.position.x, this.position.y, this.size, this.sideLength, 3);
    }
}
