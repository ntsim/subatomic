import { Canvas } from './Canvas';
import { ConfigResolver } from './ConfigResolver';
import { ImageLoader } from './image/ImageLoader';
import { Particle, Position } from './particle/Particle';
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
        this.particleGenerator = new ParticleGenerator(this.config, this.canvas);

        console.log('THE CONFIG => ', this.config);

        this.init();
    }

    start(): void {
        this.currentFrame = window.requestAnimationFrame(this.performRender.bind(this));
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
        this.particles = this.particleGenerator.generateParticles();
        this.performRender();
    }

    private performRender(): void {
        this.canvas.clear();

        this.particles.forEach((particle) => {
            if (this.config.movement.enabled) {
                this.moveParticle(particle);
            }

            particle.drawToCanvas(this.canvas);
        });

        this.start();

        if (!this.config.movement.enabled) {
            this.halt();
        }
    }

    private moveParticle(particle: Particle): void {
        const canBounce = this.config.movement.bounce;

        let nextX = particle.position.x + particle.velocity.dX;
        let nextY = particle.position.y + particle.velocity.dY;

        // Keep track of if an edge was hit so that we can
        // swap the direction of the particle accordingly
        let xWasHit = false,
            yWasHit = false;

        if (nextX > 1) {
            nextX = canBounce ? 1 : 0;
            xWasHit = true;
        } else if (nextX < 0) {
            nextX = canBounce ? 0 : 1;
            xWasHit = true;
        }

        if (nextY > 1) {
            nextY = canBounce ? 1 : 0;
            yWasHit = true;
        } else if (nextY < 0) {
            nextY = canBounce ? 0 : 1;
            yWasHit = true;
        }

        if (xWasHit) {
            particle.velocity.dX = canBounce ? -particle.velocity.dX : particle.velocity.dX;
        }

        if (yWasHit) {
            particle.velocity.dY = canBounce ? -particle.velocity.dY : particle.velocity.dY;
        }

        particle.position.x = nextX;
        particle.position.y = nextY;
    }
}