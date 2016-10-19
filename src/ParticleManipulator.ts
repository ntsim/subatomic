import { Particle } from './particle';
import { Canvas } from './Canvas';

export class ParticleManipulator {
    constructor(public canvas: Canvas) {}

    moveParticle(particle: Particle, deltaTime: number, canBounce: boolean): void {
        let nextX = particle.position.x + (particle.velocity.x * deltaTime);
        let nextY = particle.position.y + (particle.velocity.y * deltaTime);

        // Keep track of if an edge was hit so that we can
        // swap the direction of the particle accordingly
        let xWasHit = false;
        let yWasHit = false;

        const sizeRelativeX = particle.size / this.canvas.width;
        const sizeRelativeY = particle.size / this.canvas.height;

        // We define the edges of the canvas as being +/- the particle radius so that
        // we either see the entire particle move off the canvas (for no bounce)
        // or see none of the particle move off the edge (for a bounce)
        const maxEdgeX =
            canBounce ? 1 - sizeRelativeX : 1 + sizeRelativeX;
        const minEdgeX =
            canBounce ? sizeRelativeX : 0 - sizeRelativeX;
        const maxEdgeY =
            canBounce ? 1 - sizeRelativeY : 1 + sizeRelativeY;
        const minEdgeY =
            canBounce ? sizeRelativeY : 0 - sizeRelativeY;

        if (nextX > maxEdgeX) {
            nextX = canBounce ? maxEdgeX : minEdgeX;
            xWasHit = true;
        } else if (nextX < minEdgeX) {
            nextX = canBounce ? minEdgeX : maxEdgeX;
            xWasHit = true;
        }

        if (nextY > maxEdgeY) {
            nextY = canBounce ? maxEdgeY : minEdgeY;
            yWasHit = true;
        } else if (nextY < minEdgeY) {
            nextY = canBounce ? minEdgeY : maxEdgeY;
            yWasHit = true;
        }

        if (xWasHit) {
            particle.velocity.x = canBounce ? -particle.velocity.x : particle.velocity.x;
        }

        if (yWasHit) {
            particle.velocity.y = canBounce ? -particle.velocity.y : particle.velocity.y;
        }

        particle.position.x = nextX;
        particle.position.y = nextY;
    }

    animateParticleOpacity(particle: Particle, deltaTime: number): void {
        const { speed, min, max, reverse } = particle.opacityAnimation;

        if (particle.colour.a <= min) {
            particle.opacityAnimation.reverse = true;
        } else if (particle.colour.a >= max) {
            particle.opacityAnimation.reverse = false;
        }

        particle.colour.a =
            reverse ? particle.colour.a + (speed * deltaTime) : particle.colour.a - (speed * deltaTime);

        if (particle.colour.a < 0) {
            particle.colour.a = 0;
        }
    }
}
