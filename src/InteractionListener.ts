import { CanvasPosition } from './common';
import { Canvas } from './Canvas';

export class InteractionListener {
    clickTime: number;
    hoverPosition: CanvasPosition;
    clickPosition: CanvasPosition;

    private listeningOnMouse: boolean = false;

    constructor(private canvas: Canvas, private clickCallbacks: { (clickPos: CanvasPosition): void }[] = []) {}

    setMouseListeners(): void {
        if (this.listeningOnMouse) {
            return;
        }

        this.listeningOnMouse = true;
        this.canvas.element.addEventListener('mousemove', this.onMouseMove.bind(this));
        this.canvas.element.addEventListener('mouseenter', this.onMouseEnter.bind(this));
        this.canvas.element.addEventListener('mouseleave', this.onMouseLeave.bind(this));
        this.canvas.element.addEventListener('click', this.onClick.bind(this));
    }

    unsetMouseListeners(): void {
        this.listeningOnMouse = false;
        this.clickTime = null;
        this.hoverPosition = null;
        this.clickPosition = null;
        this.canvas.element.removeEventListener('mousemove', this.onMouseMove);
        this.canvas.element.removeEventListener('click', this.onClick);
    }

    private onMouseMove(e: MouseEvent): void {
        this.hoverPosition.x = (e.offsetX || e.clientX) * window.devicePixelRatio / this.canvas.width;
        this.hoverPosition.y = (e.offsetY || e.clientY) * window.devicePixelRatio / this.canvas.height;
    }

    private onMouseEnter(e: MouseEvent): void {
        const x = (e.offsetX || e.clientX) * window.devicePixelRatio / this.canvas.width;
        const y = (e.offsetY || e.clientY) * window.devicePixelRatio / this.canvas.height;

        if (!this.hoverPosition) {
            this.hoverPosition = new CanvasPosition(x, y);
        } else {
            this.hoverPosition.changeCoordinate(x, y);
        }
    }

    private onMouseLeave(e: MouseEvent): void {
        this.hoverPosition = null;
    }

    private onClick(e: MouseEvent): void {
        this.clickTime = Date.now();

        const x = (e.offsetX || e.clientX) * window.devicePixelRatio / this.canvas.width;
        const y = (e.offsetY || e.clientY) * window.devicePixelRatio / this.canvas.height;

        this.clickPosition = new CanvasPosition(x, y);
        this.clickCallbacks.forEach(callback => callback(this.clickPosition));
    }
}
