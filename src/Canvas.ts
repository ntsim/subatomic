/**
 * Wrapper for HTMLCanvasElement. Must be mounted (appended) to an existing HTMLElement.
 */
export class Canvas {
    private _element: HTMLCanvasElement;
    context: CanvasRenderingContext2D;

    constructor(mountElement: HTMLElement, width: string, height: string, className: string) {
        this._element = document.createElement('canvas');

        this.element.style.width = width;
        this.element.style.height = height;
        this.element.className = className;

        mountElement.appendChild(this.element);

        this.element.height = this.element.offsetHeight * window.devicePixelRatio;
        this.element.width = this.element.offsetWidth * window.devicePixelRatio;

        this.context = this._element.getContext('2d');
    }

    paint(): void {
        this.context.fillRect(0, 0, this.width, this.height);
    }

    clear(): void {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    changeFillColour(colour: string): this {
        this.context.fillStyle = colour;
        return this;
    }

    drawArc(
        x: number,
        y: number,
        size: number,
        startAngle: number,
        endAngle: number,
        antiClockwise: boolean = false
    ): this {
        return this.draw(() => {
            this.context.arc(this.normalX(x), this.normalY(y), size, startAngle, endAngle, antiClockwise);
        });
    }

    drawRectangle(
        x: number,
        y: number,
        width: number,
        height: number,
    ): this {
        return this.draw(() => this.context.rect(this.normalX(x), this.normalY(y), width, height));
    }

    drawShape(
        x: number,
        y: number,
        size: number,
        sides: number,
        interiorAngle?: number
    ): this {
        const canvasX = this.normalX(x);
        const canvasY = this.normalY(y);

        let radius = size / (2 * Math.sin(Math.PI / sides));
        radius = Math.round(radius);

        this.context.save();

        // const theta = interiorAngle !== undefined ? interiorAngle : (180 - (360 / sides)) * Math.PI / 180;
        const theta = ((Math.PI * 2) / sides);

        this.draw(() => {
            this.context.translate(canvasX, canvasY);
            this.context.moveTo(radius, 0);

            for (let i = 1; i < sides; i++) {
                this.context.lineTo(radius * Math.cos(theta * i), radius * Math.sin(radius * i));
            }
        });

        this.context.restore();

        return this;
    }

    get element(): HTMLCanvasElement {
        return this._element;
    }

    get height(): number {
        return this._element.offsetHeight;
    }

    set height(value: number) {
        this._element.height = value;
    }

    get width(): number {
        return this._element.offsetWidth;
    }

    set width(value: number) {
        this._element.width = value;
    }

    private draw(callback: () => void): this {
        this.context.beginPath();

        callback();

        this.context.closePath();
        this.context.fill();

        return this;
    }

    private normalX(x: number) {
        return Math.round(x * this.width);
    }

    private normalY(y: number) {
        return Math.round(y * this.height);
    }
}
