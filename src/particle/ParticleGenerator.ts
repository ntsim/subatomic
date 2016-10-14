import { Particle, Position, RGBAColour } from './Particle';
import { Star } from './shapes/Star';
import { Polygon } from './shapes/Polygon';
import { Triangle } from './shapes/Triangle';
import { Square } from './shapes/Square';
import { Circle } from './shapes/Circle';

import ShapeSetting = SubatomicConfig.ShapeSetting;
import OpacitySetting = SubatomicConfig.OpacitySetting;
import SizeSetting = SubatomicConfig.SizeSetting;
import PolygonSetting = SubatomicConfig.PolygonSetting;

export class ParticleGenerator {

    static generateForShape(shape: ShapeSetting): Particle[] {
        const { size, opacity, colour, number } = shape;

        const renderColour: RGBAColour = RGBAColour.fromHex(colour, opacity.value);

        let factory: (position: Position) => Particle;

        switch (shape.type) {
            case 'circle':
                factory = position => new Circle(position, size.value, renderColour);
                break;
            case 'square':
                factory = position => new Square(position, size.value, renderColour);
                break;
            case 'triangle':
                factory = position => new Triangle(position, size.value, renderColour);
                break;
            case 'polygon':
                const polygon = <PolygonSetting> shape;
                factory = position => new Polygon(position, size.value, renderColour, polygon.sides);
                break;
            case 'star':
                factory = position => new Star(position, size.value, renderColour);
                break;
            default:
                throw new Error(`Invalid shape.type \`${shape.type}\` was given.`);
        }

        return ParticleGenerator.generateWithRandomPositions(number, factory);
    }

    private static generateWithRandomPositions(
        number: number,
        factory: (position: Position) => Particle
    ): Particle[] {
        const particles: Particle[] = [];

        while (particles.length < number) {
            const renderPos = new Position(Math.random(), Math.random());

            particles.push(factory(renderPos));
        }

        return particles;
    }
}