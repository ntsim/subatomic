import { Particle } from './particle';
import { Canvas } from './Canvas';

export class ParticleManipulator {
    constructor(public canvas: Canvas) {}

    moveParticle(particle: Particle, canBounce: boolean): void {
        let nextX = particle.position.x + particle.velocity.dX;
        let nextY = particle.position.y + particle.velocity.dY;

        // Keep track of if an edge was hit so that we can
        // swap the direction of the particle accordingly
        let xWasHit = false,
            yWasHit = false;

        const sizeRelativeX = particle.size / this.canvas.width;
        const sizeRelativeY = particle.size / this.canvas.height;

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
            particle.velocity.dX = canBounce ? -particle.velocity.dX : particle.velocity.dX;
        }

        if (yWasHit) {
            particle.velocity.dY = canBounce ? -particle.velocity.dY : particle.velocity.dY;
        }

        particle.position.x = nextX;
        particle.position.y = nextY;
    }

    animateParticleOpacity(particle: Particle): void {
        const { speed, min, max, reverse } = particle.opacityAnimation;

        if (particle.colour.a <= min) {
            particle.opacityAnimation.reverse = true;
        } else if (particle.colour.a >= max) {
            particle.opacityAnimation.reverse = false;
        }

        particle.colour.a = reverse ? particle.colour.a + speed : particle.colour.a - speed;

        if (particle.colour.a < 0) {
            particle.colour.a = 0;
        }
    }
}