import { RGBAColour } from './common';

export class ImageLoader {
    private requests: { [src: string]: XMLHttpRequest } = {};
    private svgs: { [src: string]: string } = {};
    private renderedImages: { [src: string]: HTMLImageElement } = {};

    private ready: boolean = false;
    private requestCount: number = 0;
    private requestsDone: number = 0;

    constructor(srcs: string[] = []) {
        this.loadImages(srcs);
    }

    /**
     * @param srcs to obtain the images
     * @param callback for after all images have been loaded
     */
    loadImages(srcs: string[], callback?: () => void): void {
        srcs.forEach(src =>
            this.loadImage(src, () => this.onImageLoaded(callback))
        );
    }

    /**
     * @param src URL to obtain the image
     * @param callback for after the image has been loaded
     */
    loadImage(src: string, callback?: () => void): void {
        this.ready = false;
        this.requestCount++;

        if (src.indexOf('.svg') > -1) {
            this.loadSvg(src, callback);
        } else {
            this.renderImage(src, callback);
        }
    }

    get svgCount(): number {
        return Object.keys(this.svgs).length;
    }

    get renderedCount(): number {
        return Object.keys(this.renderedImages).length;
    }

    getSvg(src: string): string {
        if (this.svgs[src] === undefined) {
             throw new Error(`SVG with src '${src}' has not been loaded yet.`);
        }

        return this.svgs[src];
    }

    getImage(src: string): HTMLImageElement {
        if (this.renderedImages[src] === undefined) {
            throw new Error(`Image with src '${src}' has not been rendered yet.`);
        }

        return this.renderedImages[src];
    }

    renderSvg(src: string, colour: RGBAColour): HTMLImageElement {
        if (this.renderedImages[src] !== undefined) {
            return this.renderedImages[src];
        }

        this.requestCount++;

        const colouredXml = this.getSvg(src)
            .replace(/#([0-9A-F]{3,6})/gi, (m, r, g, b) => colour.toString());

        const blob = new Blob([colouredXml], { type: 'image/svg+xml;charset=utf-8' });
        const URL = window.URL;
        const svgUrl = URL.createObjectURL(blob);

        // Rendering of the SVG image is blocking to make our lives easier
        // TODO: Make this async if possible.
        const image = new Image();
        image.src = svgUrl;
        image.addEventListener('load', () => URL.revokeObjectURL(svgUrl));

        this.requestsDone++;
        this.renderedImages[src] = image;

        return image;
    }

    private loadSvg(src: string, callback?: () => void): void {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', src);
        xhr.onreadystatechange = this.onXhrComplete.bind(this, src, callback);

        this.requests[src] = xhr;

        xhr.send();
    }

    private renderImage(src: string, callback?: () => void): void {
        const image = new Image();
        image.addEventListener('load', () => {
            this.requestsDone++;
            this.renderedImages[src] = image;

            if (typeof callback === 'function') {
                callback();
            }
        });
        image.src = src;
    }

    private onXhrComplete(src: string, callback?: () => void): void {
        const xhr = this.requests[src];

        if (xhr.readyState !== 4) {
            return;
        }

        this.requestsDone++;

        if (xhr.status !== 200) {
            throw new Error(`Error loading image from src: ${src}`);
        }

        this.svgs[src] = xhr.responseText;

        if (typeof callback === 'function') {
            callback();
        }
    }

    private onImageLoaded(callback?: () => void): void {
        if (this.requestCount !== this.requestsDone) {
            return;
        }

        this.ready = true;

        if (typeof callback === 'function') {
            callback();
        }
    }
}
