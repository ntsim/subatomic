import { Particle, Position, RGBAColour, Velocity, Star, Polygon, Triangle, Square, Circle } from './particle';
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

    generateForShape(shape: ShapeSetting): Particle[] {
        const { size, opacity, colour, number } = shape;

        const renderColour: RGBAColour = RGBAColour.fromHex(colour, opacity.value);

        let factory: () => Particle;

        switch (shape.type) {
            case 'circle':
                factory = () => new Circle(
                    this.generateRandomPosition(shape.size.value),
                    size.value,
                    renderColour,
                    this.calculateVelocity()
                );
                break;
            case 'square':
                factory = () => new Square(
                    this.generateRandomPosition(shape.size.value),
                    size.value,
                    renderColour,
                    this.calculateVelocity()
                );
                break;
            case 'triangle':
                factory = () => new Triangle(
                    this.generateRandomPosition(shape.size.value),
                    size.value,
                    renderColour,
                    this.calculateVelocity()
                );
                break;
            case 'polygon':
                factory = () => {
                    const polygon = <PolygonSetting> shape;

                    return new Polygon(
                        this.generateRandomPosition(shape.size.value),
                        size.value,
                        renderColour,
                        polygon.sides,
                        this.calculateVelocity()
                    );
                };
                break;
            case 'star':
                factory = () => new Star(
                    this.generateRandomPosition(shape.size.value),
                    size.value,
                    renderColour,
                    this.calculateVelocity()
                );
                break;
            default:
                throw new Error(`Invalid shape.type \`${shape.type}\` was given.`);
        }

        const particles: Particle[] = [];

        while (particles.length < number) {
            particles.push(factory());
        }

        return particles;
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

        if (movement.type === 'random') {
            baseX = baseX + (2 * Math.random()) - 1;
            baseY = baseY + (2 * Math.random()) - 1;
        }
        
        return new Velocity(baseX * movement.speed, baseY * movement.speed);
    }

    private generateRandomPosition(size: number): Position {
        const canvasMaxWidth = this.canvas.width - size;
        const canvasMaxHeight = this.canvas.height - size;
        const relativeWidthSize = size / this.canvas.width;
        const relativeHeightSize = size / this.canvas.height;

        // Generate a random coordinate
        let x = Math.random();
        let y = Math.random();

        const normalX = this.canvas.normalizeX(x);
        const normalY = this.canvas.normalizeY(y);

        // Make sure that the coordinate does not make an edge of any
        // particle fall outside of the actual canvas
        x = (normalX + size) > canvasMaxWidth ? x - relativeWidthSize : x;
        y = (normalY + size) > canvasMaxHeight ? y - relativeHeightSize : y;

        x = (normalX - size) < 0 ? x + relativeWidthSize : x;
        y = (normalY - size) < 0 ? y + relativeHeightSize : y;

        return new Position(x, y);
    }
}