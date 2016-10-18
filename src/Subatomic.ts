import { Canvas } from './Canvas';
import { ConfigResolver } from './ConfigResolver';
import { ImageLoader } from './image/ImageLoader';
import { Particle } from './particle';
import { ParticleGenerator } from './ParticleGenerator';
import { ParticleManipulator } from './ParticleManipulator';

import ShapeSetting = SubatomicConfig.ShapeSetting;
import ImageSetting = SubatomicConfig.ImageSetting;

export class Subatomic {
    id: string;
    rootEl: HTMLElement;
    canvas: Canvas;
    imageLoader: ImageLoader;
    particles: Particle[] = [];
    generator: ParticleGenerator;
    manipulator: ParticleManipulator;
    currentFrame: number;
    readonly config: SubatomicConfig.Root;

    constructor(
        id: string = 'subatomic-container',
        config: SubatomicConfig.Root,
        imageLoader: ImageLoader
    ) {
        this.id = id;
        this.config = ConfigResolver.resolve(config);
        this.imageLoader = imageLoader;

        // Setup the canvas
        this.rootEl = document.getElementById(id);
        this.canvas = new Canvas(this.rootEl, '100%', '100%', 'subatomic-canvas');

        this.generator = new ParticleGenerator(this.config, this.canvas);
        this.manipulator = new ParticleManipulator(this.canvas);

        console.log('THE CONFIG => ', this.config);

        this.init();
    }

    start(): void {
        this.performRender();
        this.currentFrame = window.requestAnimationFrame(this.start.bind(this));
    }

    halt(): void {
        window.cancelAnimationFrame(this.currentFrame);
    }

    private init(): void {
        const srcs = this.config.shapes
            .filter(shape => shape.type === 'image')
            .map(shape => {
                const image = <ImageSetting> shape;
                return image.src;
            });

        if (srcs.length === 0) {
            this.prepareForRender();

            return;
        }

        // Render the canvas after images have loaded
        this.imageLoader.loadImages(srcs, this.prepareForRender.bind(this));
    }

    private prepareForRender(): void {
        this.particles = this.generator.generateParticles();

        this.start();

        if (!this.config.movement.enabled) {
            this.halt();
        }
    }

    private performRender(): void {
        this.canvas.clear();

        this.particles.forEach((particle, key) => {
            // if (key === 0) {
            //     console.log('PARTICLE ' + key);
            //     console.log('COLOUR => ', particle.colour.a);
            //     if (particle.opacityAnimation.speed > 0) {
            //         console.log('SPEED => ', particle.opacityAnimation.speed);
            //     } else {
            //         console.error('SPEED => ', particle.opacityAnimation.speed);
            //     }
            //     console.log('MIN MAX => ', particle.opacityAnimation.min, particle.opacityAnimation.max);
            // }

            if (this.config.movement.enabled) {
                this.manipulator.moveParticle(particle, this.config.movement.bounce);
            }

            if (particle.opacityAnimation !== undefined) {
                particle.animateOpacity();
            }

            particle.drawToCanvas(this.canvas);
        });
    }
}