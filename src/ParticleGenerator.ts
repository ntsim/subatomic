import {
    Particle,
    Position,
    RGBAColour,
    OpacityAnimation,
    SizeAnimation,
    Velocity,
    Star,
    Polygon,
    Triangle,
    Square,
    Circle,
} from './particle';
import { Canvas } from './Canvas';

import ShapeSetting = SubatomicConfig.ShapeSetting;
import PolygonSetting = SubatomicConfig.PolygonSetting;

export class ParticleGenerator {
    constructor(public config: SubatomicConfig.Root, public canvas: Canvas) {
    }

    generateParticles(): Particle[] {
        let allParticles: Particle[] = [];

        this.config.shapes
            .forEach((shape) => {
                const particles = this.generateForShape(shape);

                allParticles = allParticles.concat(particles);
            });

        return allParticles;
    }

    generateForShape(shapeSetting: ShapeSetting): Particle[] {
        const { size, opacity, colour, number, type } = shapeSetting;

        let factory: () => Particle;

        switch (type) {
            case 'circle':
                factory = () => this.generateCircle(size, colour, opacity);
                break;
            case 'square':
                factory = () => this.generateSquare(size, colour, opacity);
                break;
            case 'triangle':
                factory = () => this.generateTriangle(size, colour, opacity);
                break;
            case 'polygon':
                factory = () => this.generatePolygon(shapeSetting);
                break;
            case 'star':
                factory = () => this.generateStar(size, colour, opacity);
                break;
            default:
                throw new Error(`Invalid shape.type \`${type}\` was given.`);
        }

        const particles: Particle[] = [];

        while (particles.length < number) {
            const particle = factory();

            // Handle the opacity animation
            if (shapeSetting.opacityAnimation !== undefined) {
                let { speed, min, synced } = shapeSetting.opacityAnimation;

                if (!synced) {
                    speed *= Math.random();
                }

                particle.opacityAnimation = new OpacityAnimation(
                    speed,
                    min,
                    opacity
                );
            }

            // Handle the resizing animation
            if (shapeSetting.sizeAnimation !== undefined) {
                let { speed, min, synced } = shapeSetting.sizeAnimation;

                if (!synced) {
                    speed *= Math.random();
                }

                particle.sizeAnimation = new SizeAnimation(
                    speed,
                    min,
                    size
                );
            }

            particles.push(particle);
        }

        return particles;
    }

    private generateCircle(size: number, colour: string, opacity: number): Circle {
        return new Circle(
            Position.randomFrom2d(this.canvas.width, this.canvas.height, size),
            size,
            RGBAColour.fromHex(colour, opacity),
            Velocity.fromConfig(this.config.movement)
        );
    }

    private generateTriangle(size: number, colour: string, opacity: number): Triangle {
        return new Triangle(
            Position.randomFrom2d(this.canvas.width, this.canvas.height, size),
            size,
            RGBAColour.fromHex(colour, opacity),
            Velocity.fromConfig(this.config.movement)
        );
    }

    private generateSquare(size: number, colour: string, opacity: number): Square {
        return new Square(
            Position.randomFrom2d(this.canvas.width, this.canvas.height, size),
            size,
            RGBAColour.fromHex(colour, opacity),
            Velocity.fromConfig(this.config.movement)
        );
    }

    private generatePolygon(shape: ShapeSetting): Polygon {
        const polygon = <PolygonSetting> shape;

        return new Polygon(
            Position.randomFrom2d(this.canvas.width, this.canvas.height, shape.size),
            shape.size,
            RGBAColour.fromHex(shape.colour, shape.opacity),
            polygon.sides,
            Velocity.fromConfig(this.config.movement)
        );
    }

    private generateStar(size: number, colour: string, opacity: number): Star {
        return new Star(
            Position.randomFrom2d(this.canvas.width, this.canvas.height, size),
            size,
            RGBAColour.fromHex(colour, opacity),
            Velocity.fromConfig(this.config.movement)
        );
    }
}
