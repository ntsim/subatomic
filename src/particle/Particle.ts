import { Canvas } from '../Canvas';
import MovementSetting = SubatomicConfig.MovementSetting;

export abstract class Particle {
    constructor(
        public position: Position,
        public size: number,
        public colour: RGBAColour,
        public velocity?: Velocity,
        public opacityAnimation?: OpacityAnimation
    ) {}

    abstract drawToCanvas(canvas: Canvas): void;
}

export class Position {
    constructor(public x: number, public y: number) {}

    /**
     * Generate a particle Position from a provided 2d space (i.e. a canvas). A particle
     * radius can be added to avoid a collision with the walls of the 2d space.
     *
     * @param width
     * @param height
     * @param particleSize if Position should have a
     * @returns {Position}
     */
    static randomFrom2d(width: number, height: number, particleSize?: number) {
        const maxWidth = width - particleSize;
        const maxHeight = height - particleSize;
        const relativeWidthSize = particleSize / width;
        const relativeHeightSize = particleSize / height;

        // Generate a random coordinate
        let x = Math.random();
        let y = Math.random();

        const normalX = Math.round(x * maxWidth);
        const normalY = Math.round(y * maxHeight);

        if (particleSize) {
            // Make sure that the coordinate does not make an edge of any
            // particle fall outside of the actual canvas
            x = (normalX + particleSize) > maxWidth ? x - relativeWidthSize : x;
            y = (normalY + particleSize) > maxHeight ? y - relativeHeightSize : y;

            x = (normalX - particleSize) < 0 ? x + relativeWidthSize : x;
            y = (normalY - particleSize) < 0 ? y + relativeHeightSize : y;
        }

        return new Position(x, y);
    }
}

export class Velocity {
    constructor(public dX: number, public dY: number) {}

    /**
     * Generate a particle Velocity from the provided MovementSetting in the SubatomicConfig.
     *
     * @param movement
     * @returns {Velocity}
     */
    static fromConfig(movement: MovementSetting): Velocity {
        if (!movement.enabled) {
            return new Velocity(0, 0);
        }

        let baseX: number,
            baseY: number;

        switch (movement.direction) {
            case 'top':
                baseX = 0;
                baseY = -1;
                break;
            case 'top-right':
                baseX = 1;
                baseY = -1;
                break;
            case 'right':
                baseX = 1;
                baseY = 0;
                break;
            case 'bottom-right':
                baseX = 1;
                baseY = 1;
                break;
            case 'bottom':
                baseX = 0;
                baseY = 1;
                break;
            case 'bottom-left':
                baseX = -1;
                baseY = 1;
                break;
            case 'left':
                baseX = -1;
                baseY = 0;
                break;
            case 'top-left':
                baseX = -1;
                baseY = -1;
                break;
            default:
                baseX = 0;
                baseY = 0;
                break;
        }

        if (movement.type === 'random') {
            baseX = baseX + (2 * Math.random()) - 1;
            baseY = baseY + (2 * Math.random()) - 1;
        }

        return new Velocity(baseX * movement.speed, baseY * movement.speed);
    }
}

export class OpacityAnimation {
    public readonly speed: number;
    public readonly min: number;
    public readonly max: number;

    constructor(
        speed: number,
        min: number = 0,
        max: number = 1,
        public reverse: boolean = false
    ) {
        // Speed is a percentage (per frame) of the opacity animation range
        this.speed = (max - min) * speed;
        this.min = min;
        this.max = max;
    }
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

    /**
     * Generate an RGBA colour from the provided hex colour and an opacity.
     *
     * @param hexColour
     * @param opacity
     * @returns {RGBAColour}
     */
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
