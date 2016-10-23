import { toRadians } from './util';

/**
 * Wrapper for HTMLCanvasElement. Must be mounted (appended) to an existing HTMLElement.
 */
export class Canvas {
    readonly context: CanvasRenderingContext2D;
    private _element: HTMLCanvasElement;

    constructor(mountElement: HTMLElement, width: string, height: string, className: string) {
        this._element = document.createElement('canvas');

        this.element.style.width = width;
        this.element.style.height = height;
        this.element.className = className;

        mountElement.appendChild(this.element);

        this.height = this.element.offsetHeight * window.devicePixelRatio;
        this.width = this.element.offsetWidth * window.devicePixelRatio;

        this.context = this._element.getContext('2d');

        window.addEventListener('resize', this.onResize.bind(this));
    }

    clear(): void {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    changeFillColour(colour: string): this {
        this.context.fillStyle = colour;
        return this;
    }

    changeStrokeColour(colour: string): this {
        this.context.strokeStyle = colour;
        return this;
    }

    /**
     * @param x coordinate
     * @param y coordinate
     * @param radius
     * @param startAngle (degrees)
     * @param endAngle (degrees)
     * @param antiClockwise
     * @returns {Canvas}
     */
    drawArc(
        x: number,
        y: number,
        radius: number,
        startAngle: number,
        endAngle: number,
        antiClockwise: boolean = false
    ): this {
        return this.draw(() => {
            this.context.arc(
                this.normalizeX(x),
                this.normalizeY(y),
                radius,
                toRadians(startAngle),
                toRadians(endAngle),
                antiClockwise
            );
        });
    }

    /**
     * @param x coordinate
     * @param y coordinate
     * @param width
     * @param height
     * @returns {Canvas}
     */
    drawRectangle(
        x: number,
        y: number,
        width: number,
        height: number,
    ): this {
        return this.draw(() => this.context.rect(this.normalizeX(x), this.normalizeY(y), width, height));
    }

    /**
     * @param x1
     * @param y1
     * @param x2
     * @param y2
     * @param thickness
     * @returns {Canvas}
     */
    drawLine(x1: number, y1: number, x2: number, y2: number, thickness: number): this {
        this.context.lineWidth = thickness;

        return this.draw(() => {
            this.context.moveTo(this.normalizeX(x1), this.normalizeY(y1));
            this.context.lineTo(this.normalizeX(x2), this.normalizeY(y2));
            this.context.stroke();
        });
    }

    /**
     * @param x coordinate
     * @param y coordinate
     * @param radius
     * @param sides
     * @param rotationAngle (degrees)
     * @param vertexAngle (degrees) for advanced manipulation (e.g. for generating stars)
     * @returns {Canvas}
     */
    drawPolygon(
        x: number,
        y: number,
        radius: number,
        sides: number,
        rotationAngle: number = 0,
        vertexAngle: number = -360 / sides,
    ) {
        if (sides < 3) {
            throw new Error('Cannot draw a shape with less than 3 sides.');
        }

        const canvasX = this.normalizeX(x);
        const canvasY = this.normalizeY(y);

        this.context.beginPath();
        this.context.arc(canvasX, canvasY, 3, 0, 2 * Math.PI);
        this.context.closePath();
        this.context.fill();

        let sideLength = 2 * radius * Math.sin(Math.PI / sides);
        sideLength = Math.round(sideLength);

        const vertexRotation = toRadians(vertexAngle);

        this.context.save();
        this.context.rotate(toRadians(rotationAngle));

        this.draw(() => {
            this.context.translate(canvasX, canvasY);
            this.context.moveTo(0, 0);

            for (let i = 1; i < sides; i++) {
                this.context.lineTo(sideLength, 0);
                this.context.translate(sideLength, 0);
                this.context.rotate(vertexRotation);
            }
        });

        this.context.restore();

        return this;
    }

    get element(): HTMLCanvasElement {
        return this._element;
    }

    get height(): number {
        return this._element.height;
    }

    set height(value: number) {
        this._element.height = value;
    }

    get width(): number {
        return this._element.width;
    }

    set width(value: number) {
        this._element.width = value;
    }

    normalizeX(x: number): number {
        return Math.round(x * this.width);
    }

    normalizeY(y: number): number {
        return Math.round(y * this.height);
    }

    private draw(callback: () => void): this {
        this.context.beginPath();

        callback();

        this.context.closePath();
        this.context.fill();

        return this;
    }

    private onResize(event: Event): void {
        this.height = this.element.offsetHeight * window.devicePixelRatio;
        this.width = this.element.offsetWidth * window.devicePixelRatio;
    }
}
