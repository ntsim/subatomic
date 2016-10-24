import {
    Particle,
    Star,
    Polygon,
    Triangle,
    Square,
    Circle,
    ImageParticle,
} from './particle';
import { Canvas } from './Canvas';
import { CanvasPosition, RGBAColour, OpacityAnimation, SizeAnimation, Velocity } from './common';
import { ImageLoader } from './image';

import ShapeSetting = SubatomicConfig.ShapeSetting;
import PolygonSetting = SubatomicConfig.PolygonSetting;
import ImageSetting = SubatomicConfig.ImageSetting;

export class ParticleGenerator {
    constructor(
        private config: SubatomicConfig.Root,
        private canvas: Canvas,
        private imageLoader: ImageLoader
    ) {
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
            case 'image':
                factory = () => this.generateImage(shapeSetting);
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
            CanvasPosition.randomFrom2d(this.canvas.width, this.canvas.height, size),
            size,
            RGBAColour.fromHex(colour, opacity),
            Velocity.fromConfig(this.config.movement)
        );
    }

    private generateTriangle(size: number, colour: string, opacity: number): Triangle {
        return new Triangle(
            CanvasPosition.randomFrom2d(this.canvas.width, this.canvas.height, size),
            size,
            RGBAColour.fromHex(colour, opacity),
            Velocity.fromConfig(this.config.movement)
        );
    }

    private generateSquare(size: number, colour: string, opacity: number): Square {
        return new Square(
            CanvasPosition.randomFrom2d(this.canvas.width, this.canvas.height, size),
            size,
            RGBAColour.fromHex(colour, opacity),
            Velocity.fromConfig(this.config.movement)
        );
    }

    private generatePolygon(shape: ShapeSetting): Polygon {
        const polygon = <PolygonSetting> shape;

        return new Polygon(
            CanvasPosition.randomFrom2d(this.canvas.width, this.canvas.height, shape.size),
            shape.size,
            RGBAColour.fromHex(shape.colour, shape.opacity),
            polygon.sides,
            Velocity.fromConfig(this.config.movement),
        );
    }

    private generateStar(size: number, colour: string, opacity: number): Star {
        return new Star(
            CanvasPosition.randomFrom2d(this.canvas.width, this.canvas.height, size),
            size,
            RGBAColour.fromHex(colour, opacity),
            Velocity.fromConfig(this.config.movement)
        );
    }

    private generateImage(shape: ShapeSetting): ImageParticle {
        const imageSetting = <ImageSetting> shape;
        const { src, size, opacity } = imageSetting;

        const colour = RGBAColour.fromHex(imageSetting.colour, opacity);
        let image: HTMLImageElement;

        if (imageSetting.src.indexOf('.svg') > -1) {
            image = this.imageLoader.renderSvg(src, colour);
        } else {
            image = this.imageLoader.getImage(src);
        }

        return new ImageParticle(
            CanvasPosition.randomFrom2d(this.canvas.width, this.canvas.height, size),
            size,
            colour,
            image,
            Velocity.fromConfig(this.config.movement)
        );
    }
}
