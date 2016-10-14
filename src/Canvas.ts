export class Canvas {
    private _element: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;

    constructor(mountElement: HTMLElement, width: string, height: string, className: string) {
        this._element = document.createElement('canvas');
        this._element.style.width = width;
        this._element.style.height = height;
        this._element.className = className;

        mountElement.appendChild(this.element);

        this.element.height = this.element.offsetHeight * window.devicePixelRatio;
        this.element.width = this.element.offsetWidth * window.devicePixelRatio;

        this.context = this._element.getContext('2d');
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
    ): void {
        this.context.beginPath();

        this.context.arc(x * this.width, y * this.height, size, startAngle, endAngle, antiClockwise);

        this.context.closePath();
        this.context.fill();
    }
}
