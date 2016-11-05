import { CanvasPosition } from './common';
import { Canvas } from './Canvas';

export class InteractionListener {
    clickTime: number;
    hoverPosition: CanvasPosition;
    clickPosition: CanvasPosition;

    private listeningOnMouse: boolean = false;

    constructor(private canvas: Canvas, private window: Window) {}

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
        const x = (e.offsetX || e.clientX) * this.window.devicePixelRatio;
        const y = (e.offsetY || e.clientY) * this.window.devicePixelRatio;

        if (!this.hoverPosition) {
            this.hoverPosition = new CanvasPosition(x, y);
        } else {
            this.hoverPosition.changeCoordinate(x, y);
        }
    }

    private onMouseEnter(e: MouseEvent): void {
        const x = (e.offsetX || e.clientX) * this.window.devicePixelRatio;
        const y = (e.offsetY || e.clientY) * this.window.devicePixelRatio;

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

        const x = (e.offsetX || e.clientX) * this.window.devicePixelRatio;
        const y = (e.offsetY || e.clientY) * this.window.devicePixelRatio;

        this.clickPosition = new CanvasPosition(x, y);
    }
}
