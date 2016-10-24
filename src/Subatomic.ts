import { Canvas } from './Canvas';
import { ConfigResolver } from './ConfigResolver';
import { ImageLoader } from './image/ImageLoader';
import { Particle } from './particle';
import { ParticleGenerator } from './ParticleGenerator';
import { ParticleManipulator } from './ParticleManipulator';
import { InteractionListener } from './InteractionListener';

import ImageSetting = SubatomicConfig.ImageSetting;

export class Subatomic {
    id: string;
    rootEl: HTMLElement;
    canvas: Canvas;
    imageLoader: ImageLoader;
    particles: Particle[] = [];
    currentFrame: number;
    currentFrameStart: number;
    lastFrameStart: number;

    readonly config: SubatomicConfig.Root;

    private generator: ParticleGenerator;
    private manipulator: ParticleManipulator;
    private interactionListener: InteractionListener;

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
        this.interactionListener = new InteractionListener(this.canvas);

        this.init();
    }

    start(): void {
        this.currentFrameStart = Date.now();
        this.renderFrame();
        this.currentFrame = window.requestAnimationFrame(this.start.bind(this));
        this.lastFrameStart = this.currentFrameStart;
    }

    halt(): void {
        // Reset record of when the last frame was rendered (as this will
        // throw off any time-dependent calculations)
        this.lastFrameStart = 0;
        window.cancelAnimationFrame(this.currentFrame);
    }

    private init(): void {
        this.checkForInteractivity();

        // Stop animating whenever the user isn't actually looking at this page
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.halt();
            } else {
                this.start();
            }
        });

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
    }

    private renderFrame(): void {
        this.canvas.clear();

        // Calculate the time difference between the current frame and the last
        // frame so we can perform time-dependent changes more consistently
        // (otherwise we might be working off any arbitrary scale).
        const deltaTime = this.lastFrameStart > 0 ? ((this.currentFrameStart - this.lastFrameStart) / 1000) : 0;

        this.particles.forEach((particle, key) => {
            if (this.config.movement.enabled) {
                this.manipulator.moveParticle(particle, deltaTime, this.config.movement.bounce);
            }

            if (this.interactionListener.hoverPosition) {
                const hoverPos = this.interactionListener.hoverPosition;

                if (this.config.onHover.repulse) {
                    const distance = this.config.onHover.repulse.distance;
                    this.manipulator.repulseParticle(particle, hoverPos, distance);
                }

                if (this.config.onHover.bubble) {
                    const { distance, size } = this.config.onHover.bubble;
                    this.manipulator.bubbleParticle(particle, hoverPos, distance, size);
                }

                if (this.config.onHover.attract) {
                    const distance = this.config.onHover.attract.distance;

                    // Change the position to some arbitrary so that all of the
                    // attracted particles are released upon clicking
                    if (this.currentFrameStart - this.interactionListener.clickTime < 1000) {
                        this.interactionListener.hoverPosition.changeCoordinate(-1 , -1);
                    }

                    this.manipulator.attractParticle(particle, hoverPos, distance);
                }

                if (this.config.onHover.link) {
                    const { distance, colour, thickness, opacity } = this.config.onHover.link;
                    this.manipulator.linkParticle(particle, hoverPos, distance, thickness, colour, opacity);
                }
            }

            if (particle.opacityAnimation !== undefined) {
                this.manipulator.animateParticleOpacity(particle, deltaTime);
            }

            if (particle.sizeAnimation !== undefined) {
                this.manipulator.animateParticleSize(particle, deltaTime);
            }

            particle.drawToCanvas(this.canvas);
        });
    }

    private checkForInteractivity(): void {
        let hasInteractivity = false;

        if (Object.keys(this.config.onHover).length > 0) {
            hasInteractivity = true;
        }

        if (hasInteractivity) {
            this.interactionListener.setMouseListeners();
        }
    }
}
