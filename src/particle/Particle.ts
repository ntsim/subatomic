import { Position } from './Position';
import { Shape } from './shapes/Shape';

export class Particle {

    private shape: Shape;
    private opacity: number;
    private size: number;
    private position: Position;
    private colour: string;

    constructor(
        shape: Shape,
        size: number,
        opacity: number,
        position: Position,
        colour: string,
    ) {
        this.shape = shape;
        this.opacity = opacity;
        this.size = size;
        this.position = position;
        this.colour = colour;
    }


}
