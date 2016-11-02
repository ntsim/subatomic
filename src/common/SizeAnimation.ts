export class SizeAnimation {
    readonly speed: number;
    readonly min: number;
    readonly max: number;

    constructor(
        speed: number,
        min: number = 0,
        max: number = 1,
        public reverse: boolean = false
    ) {
        // Speed is a percentage (per frame) of the size animation range
        this.speed = (max - min) * speed / 100;
        this.min = min;
        this.max = max;
    }
}
