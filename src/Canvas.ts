export class Canvas {
    private _element: HTMLCanvasElement;
    private _context: CanvasRenderingContext2D;

    constructor(width: string, height: string, className: string) {
        this._element = document.createElement('canvas');
        this._element.style.width = width;
        this._element.style.height = height;
        this._element.className = className;
        this._context = this._element.getContext('2d');
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

    paint(): void {
        this.context.fillRect(0, 0, this.width, this.height);
    }

    clear(): void {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    get context(): CanvasRenderingContext2D {
        return this._context;
    }
}
