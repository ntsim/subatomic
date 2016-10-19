import { Position } from './particle';
import { Canvas } from './Canvas';

export class InteractionListener {
    clickTime: number;
    hoverPosition: Position;
    clickPosition: Position;

    private listeningOnMouse: boolean = false;

    constructor(private canvas: Canvas) {}

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
        this.canvas.element.removeEventListener('mousemove', this.onMouseMove);
        this.canvas.element.removeEventListener('click', this.onClick);
    }

    private onMouseMove(e: MouseEvent): void {
        this.hoverPosition.x = (e.offsetX || e.clientX) / this.canvas.width;
        this.hoverPosition.y = (e.offsetY || e.clientY) / this.canvas.height;
    }

    private onMouseEnter(e: MouseEvent): void {
        const x = (e.offsetX || e.clientX) / this.canvas.width;
        const y = (e.offsetY || e.clientY) / this.canvas.height;

        this.hoverPosition = new Position(x, y);
    }

    private onMouseLeave(e: MouseEvent): void {
        this.hoverPosition = null;
        this.clickPosition = null;
    }

    private onClick(e: MouseEvent): void {
        this.clickTime = Date.now();

        const x = (e.offsetX || e.clientX) / this.canvas.width;
        const y = (e.offsetY || e.clientY) / this.canvas.height;

        this.clickPosition = new Position(x, y);
    }
}
