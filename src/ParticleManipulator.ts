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