import { Particle } from './Particle';
import { Position } from './Position';
import { Canvas } from '../Canvas';

import { Shape } from './shapes/Shape';
import { Star } from './shapes/Star';
import { Polygon } from './shapes/Polygon';
import { Triangle } from './shapes/Triangle';
import { Edge } from './shapes/Edge';
import { Circle } from './shapes/Circle';
import { Image } from './shapes/Image';

import ShapeSetting = SubatomicConfig.ShapeSetting;
import OpacitySetting = SubatomicConfig.OpacitySetting;
import SizeSetting = SubatomicConfig.SizeSetting;

const RANDOM_LIMIT = 20;
const DEFAULTS = {
    opacity: {
        value: 1
    },
    size: {
        value: 1
    }
};

export class ParticleGenerator {
    /**
     * @param canvas
     * @param type
     * @param number
     * @param opacity
     * @param size
     * @param position
     * @param colour
     * @param src
     * @returns {Array}
     */
    static generateForNumber(
        canvas: Canvas,
        type: string,
        number: number,
        opacity: OpacitySetting,
        size: SizeSetting,
        position?: Position,
        colour?: string,
        src?: string,
    ): Particle[] {
        const particles: Particle[] = [];

        while (particles.length < number) {
            const renderPos = position !== undefined ?
                position : new Position(
                Math.random() * canvas.width,
                Math.random() * canvas.height
            );

            let shape: Shape;

            switch (type) {
                case 'circle':
                    shape = new Circle();
                    break;
                case 'edge':
                    shape = new Edge();
                    break;
                case 'triangle':
                    shape = new Triangle();
                    break;
                case 'polygon':
                    shape = new Polygon();
                    break;
                case 'star':
                    shape = new Star();
                    break;
                case 'image': {
                    if (src === undefined) {
                        throw new Error('Cannot generate an image particle without a src URL.');
                    }

                    shape = new Image(src);
                    break;
                }
                default:
                    throw new Error(`Invalid shape.type \`${type}\` was given.`);
            }

            particles.push(new Particle(
                shape,
                opacity.value !== undefined ? opacity.value : DEFAULTS.opacity.value,
                size.value !== undefined ? size.value : DEFAULTS.size.value,
                renderPos,
                colour
            ));
        }

        return particles;
    }

    /**
     * @param shape
     * @param canvas
     * @returns {Particle[]}
     */
    static generateForShape(shape: ShapeSetting, canvas: Canvas): Particle[] {
        const particleNumber = shape.number !== undefined ?
            shape.number : Math.floor(Math.random() * RANDOM_LIMIT);

        return ParticleGenerator.generateForNumber(
            canvas,
            shape.type,
            particleNumber,
            shape.opacity !== undefined ? shape.opacity : DEFAULTS.opacity,
            shape.size !== undefined ? shape.size : DEFAULTS.size,
        );
    }
}