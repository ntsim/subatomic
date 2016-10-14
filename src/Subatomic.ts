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
        this.canvas.clear();

        this.config.shapes.forEach((shape) => {
            const particles = ParticleGenerator.generateForShape(shape);

            this.particles = this.particles.concat(particles);
        });

        this.render();
    }

    private render(): void {
        this.particles.forEach(particle => particle.drawToCanvas(this.canvas));

        this.currentFrame = window.requestAnimationFrame(this.render.bind(this));
        window.cancelAnimationFrame(this.currentFrame);
    }
}
