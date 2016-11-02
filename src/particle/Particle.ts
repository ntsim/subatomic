import { Canvas } from '../Canvas';
import { CanvasPosition, RGBAColour, OpacityAnimation, SizeAnimation, Velocity } from '../common';

export abstract class Particle {

    private readonly startingVelocity?: Velocity;
    private targetPosition: CanvasPosition;
    private targetCallback: (p: Particle) => void;
    private targetDistance: number;

    constructor(
        public position: CanvasPosition,
        public size: number,
        public colour: RGBAColour,
        public velocity?: Velocity,
        public opacityAnimation?: OpacityAnimation,
        public sizeAnimation?: SizeAnimation
    ) {
        this.startingVelocity = Object.assign({}, velocity);
    }

    abstract drawToCanvas(canvas: Canvas): void;

    /**
     * Move the particle to a position at a certain speed. The default particle speed (100%) during this
     * movement is defined as the 'distance between the two positions (1 unit vector) per second'.
     *
     * This method should be invoked once before subsequent calls to {@link #checkMoveToPosition}
     * are performed to determine if the particle has reached the target destination.
     *
     * @param position
     * @param speed is a percentage number
     * @param callback
     */
    moveToPosition(position: CanvasPosition, speed: number = 100, callback?: (p: Particle) => void): void {
        this.targetPosition = position;
        this.targetCallback = callback;

        const diffX = position.x - this.position.x;
        const diffY = position.y - this.position.y;

        this.targetDistance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
        this.velocity = new Velocity(diffX * speed / 100, diffY * speed / 100);
    }

    /**
     * Invoke this method to perform a check on the particle's current position relative
     * to a target position that it is moving towards.
     *
     * Once the particle is determined to have reached the destination, it is reset.
     */
    checkMoveToPosition(): void {
        if (!this.targetPosition) {
            return;
        }

        const diffX = this.targetPosition.x - this.position.x;
        const diffY = this.targetPosition.y - this.position.y;

        this.targetDistance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));

        // A bit arbitrary, but basically says that if the distance between the positions is
        // within 0.1% of the canvas, it is considered to have reached it's destination.
        // Feels a bit messy and probably should be improved (although not trivial
        // due to the way velocity is currently modelled).
        // TODO: Consider improving this further to get a more accurate movement.
        if (this.targetDistance < 1) {
            this.targetPosition = null;
            this.targetDistance = null;

            if (this.targetCallback) {
                this.targetCallback(this);
                this.targetCallback = null;
            }
        }
    }

    /**
     * Reset the particle's velocity back to the velocity provided when it was first generated.
     */
    resetVelocity(): void {
        this.velocity = Object.assign({}, this.startingVelocity);
    }
}
