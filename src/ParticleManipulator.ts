import { Particle } from './particle';
import { Canvas } from './Canvas';
import { CanvasPosition, RGBAColour } from './common';

export class ParticleManipulator {
    constructor(public canvas: Canvas) {}

    moveParticle(particle: Particle, deltaTime: number, canBounce: boolean): void {
        const { size, position, velocity } = particle;

        let nextX = position.x + (velocity.x * deltaTime);
        let nextY = position.y + (velocity.y * deltaTime);

        // Keep track of if an edge was hit so that we can
        // swap the direction of the particle accordingly
        let xWasHit = false;
        let yWasHit = false;

        const { width, height } = this.canvas;

        // We define the edges of the canvas as being +/- the particle radius so that
        // we either see the entire particle move off the canvas (for no bounce)
        // or see none of the particle move off the edge (for a bounce)
        const maxEdgeX =
            canBounce ? width - size : width + size;
        const minEdgeX =
            canBounce ? size : 0 - size;
        const maxEdgeY =
            canBounce ? height - size : height + size;
        const minEdgeY =
            canBounce ? size : 0 - size;

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
            velocity.x = canBounce ? -velocity.x : velocity.x;
        }

        if (yWasHit) {
            velocity.y = canBounce ? -velocity.y : velocity.y;
        }

        position.changeCoordinate(nextX, nextY);
    }

    repulseParticle(particle: Particle, repulsePosition: CanvasPosition, repulseDistance: number): void {
        const { x, y } = particle.position;

        const diffX = x - repulsePosition.x;
        const diffY = y - repulsePosition.y;

        // Use Pythagoras theorem to get the distance
        const positionDistance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));

        if (positionDistance <= repulseDistance) {
            // Get the relative scale (so we can know the distance) we need to push particles
            // by to get them to the edge of the repulsion zone
            const scale = repulseDistance / positionDistance;

            // Scale up the x and y distances and add them to the repulsion position
            particle.position.x = repulsePosition.x + (diffX * scale);
            particle.position.y = repulsePosition.y + (diffY * scale);
        }
    }

    clickRepulseParticle(particle: Particle, repulsePosition: CanvasPosition, repulseDistance: number): void {
        const diffX = particle.position.x - repulsePosition.x;
        const diffY = particle.position.y - repulsePosition.y;
        const positionDistance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));

        if (positionDistance < repulseDistance) {
            const scale = repulseDistance / positionDistance;
            // Final positions at the end of the repulsion animation
            const finalX = repulsePosition.x + (diffX * scale);
            const finalY = repulsePosition.y + (diffY * scale);
            const finalPos = new CanvasPosition(finalX, finalY);

            particle.moveToPosition(finalPos, 300, (p: Particle) => p.resetVelocity());
        }
    }

    bubbleParticle(
        particle: Particle,
        bubblePosition: CanvasPosition,
        bubbleDistance: number,
        bubbleSize: number
    ): void {
        const positionDistance = particle.position.distanceTo(bubblePosition);

        if (positionDistance <= bubbleDistance) {
            const ratio = 1 - (positionDistance / bubbleDistance);

            particle.size = bubbleSize * ratio;
        }
    }

    attractParticle(particle: Particle, attractPosition: CanvasPosition, bubbleDistance: number): void {
        const { x, y } = particle.position;

        const diffX = x - attractPosition.x;
        const diffY = y - attractPosition.y;

        // Use Pythagoras theorem to get the distance
        const positionDistance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));

        if (positionDistance <= bubbleDistance) {
            // Allow the attracted particles to jiggle a bit
            particle.position.x = attractPosition.x + (diffX * Math.random() / 2);
            particle.position.y = attractPosition.y + (diffY * Math.random() / 2);
        }
    }

    linkParticle(
        particle: Particle,
        linkPosition: CanvasPosition,
        linkDistance: number,
        thickness: number,
        colourHex: string,
        opacity: number
    ): void {
        const { x, y } = particle.position;

        const diffX = x - linkPosition.x;
        const diffY = y - linkPosition.y;

        // Use Pythagoras theorem to get the distance
        const positionDistance = Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));

        if (positionDistance <= linkDistance) {
            const ratio = 1 - positionDistance / linkDistance;
            const lineColour = RGBAColour.fromHex(colourHex, ratio * opacity);

            this.canvas
                .changeStrokeColour(lineColour.toString())
                .drawLine(
                    particle.position.x,
                    particle.position.y,
                    linkPosition.x,
                    linkPosition.y,
                    thickness,
                );
        }
    }

    animateParticleSize(particle: Particle, deltaTime: number): void {
        const { speed, min, max, reverse } = particle.sizeAnimation;

        if (particle.size <= min) {
            particle.sizeAnimation.reverse = true;
        } else if (particle.size >= max) {
            particle.sizeAnimation.reverse = false;
        }

        particle.size =
            reverse ? particle.size + (speed * deltaTime) : particle.size - (speed * deltaTime);

        if (particle.size < 0) {
            particle.size = 0;
        }
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
