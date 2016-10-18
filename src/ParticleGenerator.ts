import {
    Particle,
    Position,
    RGBAColour,
    OpacityAnimation,
    Velocity,
    Star,
    Polygon,
    Triangle,
    Square,
    Circle
} from './particle';
import { Canvas } from './Canvas';

import ShapeSetting = SubatomicConfig.ShapeSetting;
import OpacitySetting = SubatomicConfig.OpacitySetting;
import SizeSetting = SubatomicConfig.SizeSetting;
import PolygonSetting = SubatomicConfig.PolygonSetting;
import MovementSetting = SubatomicConfig.MovementSetting;

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
                factory = () => this.generateCircle(size.value, colour, opacity.value);
                break;
            case 'square':
                factory = () => this.generateSquare(size.value, colour, opacity.value);
                break;
            case 'triangle':
                factory = () => this.generateTriangle(size.value, colour, opacity.value);
                break;
            case 'polygon':
                factory = () => this.generatePolygon(shapeSetting);
                break;
            case 'star':
                factory = () => this.generateStar(size.value, colour, opacity.value);
                break;
            default:
                throw new Error(`Invalid shape.type \`${type}\` was given.`);
        }

        const particles: Particle[] = [];

        while (particles.length < number) {
            const particle = factory();

            // Handle the opacity animation
            if (opacity.animation !== undefined) {
                let { speed, min, synced } = opacity.animation;

                if (!synced) {
                    speed *= Math.random();
                }

                particle.opacityAnimation = new OpacityAnimation(
                    speed / 100,
                    min,
                    opacity.value
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
            Position.randomFrom2d(this.canvas.width, this.canvas.height, shape.size.value),
            shape.size.value,
            RGBAColour.fromHex(shape.colour, shape.opacity.value),
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