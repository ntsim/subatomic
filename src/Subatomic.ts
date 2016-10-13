import { Canvas } from './Canvas';
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

    readonly config: SubatomicConfig.Root;

    constructor(
        id: string = 'subatomic-container',
        config: SubatomicConfig.Root,
        imageLoader: ImageLoader
    ) {
        this.id = id;
        this.rootEl = document.getElementById(id);
        this.canvas = new Canvas('100%', '100%', 'subatomic-canvas');
        this.config = config;
        this.imageLoader = imageLoader;

        this.init();
    }

    private init(): void {
        this.rootEl.appendChild(this.canvas.element);

        const srcs = this.config.shapes
            .filter(shape => shape.type === 'image')
            .map(shape => {
                const image = <ImageSetting> shape;
                return image.src;
            });

        if (srcs.length === 0) {
            this.beginRender();

            return;
        }

        // Render the canvas after images have loaded
        this.imageLoader.loadImages(srcs, this.beginRender.bind(this));
    }

    private beginRender() {
        this.canvas.clear();
        this.canvas.paint();

        this.config.shapes.forEach((shape) => {
            const particles = ParticleGenerator.generateForShape(shape, this.canvas);

            console.log('GENERATED PARTICLES => ', particles);

            this.particles.concat(particles);
        });
    }
}
