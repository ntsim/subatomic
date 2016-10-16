import { Particle, Position, RGBAColour, Velocity } from './Particle';
import { Star } from './shapes/Star';
import { Polygon } from './shapes/Polygon';
import { Triangle } from './shapes/Triangle';
import { Square } from './shapes/Square';
import { Circle } from './shapes/Circle';

import ShapeSetting = SubatomicConfig.ShapeSetting;
import OpacitySetting = SubatomicConfig.OpacitySetting;
import SizeSetting = SubatomicConfig.SizeSetting;
import PolygonSetting = SubatomicConfig.PolygonSetting;
import MovementSetting = SubatomicConfig.MovementSetting;

export class ParticleGenerator {
    constructor(public config: SubatomicConfig.Root) {
    }

    generateParticles(): Particle[] {
        let allParticles: Particle[] = [];

        this.config.shapes.forEach(
            (shape) => {
                const particles = this.generateForShape(shape);

                allParticles = allParticles.concat(particles);
            }
        );

        return allParticles;
    }

    generateForShape(shape: ShapeSetting): Particle[] {
        const { size, opacity, colour, number } = shape;

        const renderColour: RGBAColour = RGBAColour.fromHex(colour, opacity.value);

        let factory: (position: Position) => Particle;

        switch (shape.type) {
            case 'circle':
                factory = (position) => {
                    return new Circle(position, size.value, renderColour, this.calculateVelocity());
                };
                break;
            case 'square':
                factory = (position) => {
                    return new Square(position, size.value, renderColour, this.calculateVelocity());
                };
                break;
            case 'triangle':
                factory = (position) => {
                    return new Triangle(position, size.value, renderColour, this.calculateVelocity());
                };
                break;
            case 'polygon':
                const polygon = <PolygonSetting> shape;
                factory = (position) => {
                    return new Polygon(position, size.value, renderColour, polygon.sides, this.calculateVelocity());
                };
                break;
            case 'star':
                factory = (position) => {
                    return new Star(position, size.value, renderColour, this.calculateVelocity());
                };
                break;
            default:
                throw new Error(`Invalid shape.type \`${shape.type}\` was given.`);
        }

        return this.generateWithRandomPositions(number, factory);
    }

    private calculateVelocity(): Velocity {
        const movement = this.config.movement;

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

        if (movement.type === 'straight') {
            return new Velocity(baseX * movement.speed, baseY * movement.speed);
        }

        baseX = baseX + (2 * Math.random()) - 1;
        baseY = baseY + (2 * Math.random()) - 1;

        return new Velocity(baseX * movement.speed, baseY * movement.speed);
    }

    private generateWithRandomPositions(
        number: number,
        factory: (position: Position) => Particle
    ) {
        const particles: Particle[] = [];

        while (particles.length < number) {
            const renderPos = new Position(Math.random(), Math.random());

            particles.push(factory(renderPos));
        }

        return particles;
    }
}