import { Canvas } from './Canvas';
import { ConfigResolver } from './ConfigResolver';
import { ImageLoader } from './image/ImageLoader';
import { Particle } from './particle/Particle';
import { ParticleGenerator } from './particle/ParticleGenerator';

import ShapeSetting = SubatomicConfig.ShapeSetting;
import ImageSetting = SubatomicConfig.ImageSetting;

export class Subatomic {
    id: string;
    rootEl: HTMLElement;
    canvas: Canvas;
    imageLoader: ImageLoader;
    particles: Particle[] = [];
    particleGenerator: ParticleGenerator;
    currentFrame: number;
    readonly config: SubatomicConfig.Root;

    constructor(
        id: string = 'subatomic-container',
        config: SubatomicConfig.Root,
        imageLoader: ImageLoader
    ) {
        this.id = id;
        this.rootEl = document.getElementById(id);
        this.canvas = new Canvas(this.rootEl, '100%', '100%', 'subatomic-canvas');
        this.config = ConfigResolver.resolve(config);
        this.imageLoader = imageLoader;
        this.particleGenerator = new ParticleGenerator(this.config);

        console.log('THE CONFIG => ', this.config);

        this.init();
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
        this.particles = this.particleGenerator.generateParticles();
        this.render();
    }

    private render(): void {
        this.canvas.clear();

        this.particles.forEach((particle) => {
            if (this.config.movement.enabled) {
                particle.move();
            }

            particle.drawToCanvas(this.canvas);
        });

        this.currentFrame = window.requestAnimationFrame(this.render.bind(this));

        if (!this.config.movement.enabled) {
            window.cancelAnimationFrame(this.currentFrame);
        }
    }
}
