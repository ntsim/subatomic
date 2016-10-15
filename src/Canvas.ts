/**
 * Wrapper for HTMLCanvasElement. Must be mounted (appended) to an existing HTMLElement.
 */
export class Canvas {
    private _element: HTMLCanvasElement;
    readonly context: CanvasRenderingContext2D;

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

        let sideLength = 2 * radius * Math.sin(Math.PI / sides);
        sideLength = Math.round(sideLength);

        const vertexRotation = toRadians(vertexAngle);

        this.context.save();
        this.context.rotate(toRadians(rotationAngle));

        this.draw(() => {
            this.context.translate(canvasX + sideLength, canvasY);
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

    private normalizeX(x: number): number {
        return Math.round(x * this.width);
    }

    private normalizeY(y: number): number {
        return Math.round(y * this.height);
    }
}

function toRadians(degrees: number): number {
    return degrees * Math.PI / 180;
}
