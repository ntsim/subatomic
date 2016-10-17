import { Canvas } from '../Canvas';

export abstract class Particle {
    constructor(
        public position: Position,
        public size: number,
        public colour: RGBAColour,
        public velocity?: Velocity,
        public opacityAnimation?: OpacityAnimation
    ) {}

    abstract drawToCanvas(canvas: Canvas): void;

    animateOpacity(): void {
        const { speed, min, max } = this.opacityAnimation;
        const relativeSpeed = speed / 100;
        const colourChange = this.colour.a - relativeSpeed;

        if (colourChange <= min) {
            this.opacityAnimation.speed = -this.opacityAnimation.speed;
            // this.colour.a = min;
        } else if (colourChange >= max) {
            this.opacityAnimation.speed = -this.opacityAnimation.speed;
            // this.colour.a = max;
        }

        this.colour.a = colourChange;
    }
}

export class Position {
    constructor(public x: number, public y: number) {
    }
}

export class Velocity {
    constructor(public dX: number, public dY: number) {}
}

export class OpacityAnimation {
    constructor(public speed: number, public min: number = 0, public max: number = 1) {}
}

export class RGBAColour {
    constructor(
        public r: number = 0,
        public g: number = 0,
        public b: number = 0,
        public a: number = 1
    ) {}

    toString(): string {
        return `rgba(${this.r}, ${this.g}, ${this.b}, ${this.a})`;
    }

    static fromHex(hexColour: string, opacity: number = 1.0): RGBAColour {
        if (opacity > 1 || opacity < 0) {
            throw new Error('Opacity cannot be greater than 1 or less than 0.');
        }

        const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        const hex = hexColour.replace(shorthandRegex, (m, r, g, b) => {
            return r + r + g + g + b + b;
        });

        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);

        if (!result) {
            throw new Error('Invalid hex colour was provided.');
        }

        return new RGBAColour(
            parseInt(result[1], 16),
            parseInt(result[2], 16),
            parseInt(result[3], 16),
            +opacity,
        );
    }
}