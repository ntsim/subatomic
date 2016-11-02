import MovementSetting = SubatomicConfig.MovementSetting;

export class Velocity {
    /**
     * Generate a particle Velocity from the provided MovementSetting in the SubatomicConfig.
     *
     * @param movement
     * @returns {Velocity}
     */
    static fromConfig(movement: MovementSetting): Velocity {
        if (!movement) {
            return new Velocity(0, 0);
        }

        let baseX: number;
        let baseY: number;

        switch (movement.direction) {
            case 'top':
                baseX = 0;
                baseY = -1;
                break;
            case 'top-right':
                baseX = 1;
                baseY = -1;
                break;
            case 'right':
                baseX = 1;
                baseY = 0;
                break;
            case 'bottom-right':
                baseX = 1;
                baseY = 1;
                break;
            case 'bottom':
                baseX = 0;
                baseY = 1;
                break;
            case 'bottom-left':
                baseX = -1;
                baseY = 1;
                break;
            case 'left':
                baseX = -1;
                baseY = 0;
                break;
            case 'top-left':
                baseX = -1;
                baseY = -1;
                break;
            default:
                baseX = 0;
                baseY = 0;
                break;
        }

        if (movement.type === 'random') {
            baseX = baseX + (2 * Math.random()) - 1;
            baseY = baseY + (2 * Math.random()) - 1;
        }

        return new Velocity(baseX * movement.speed, baseY * movement.speed);
    }

    constructor(public x: number, public y: number) {}
}
