import Svg from './Svg';

export class ImageLoader {
    requests: { [src: string]: XMLHttpRequest } = {};
    errors: { [src: string]: string } = {};
    svgs: { [src: string]: Svg } = {};
    renderedImages: { [src: string]: HTMLElement } = {};

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

        if (src.indexOf('svg') > -1) {
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

    get errorCount(): number {
        return Object.keys(this.errors).length;
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
        image.src = src;
        image.addEventListener('load', () => {
            this.requestsDone++;
            this.renderedImages[src] = image;

            if (typeof callback === 'function') {
                callback();
            }
        });
    }

    private onXhrComplete(src: string, callback?: () => void): void {
        const xhr = this.requests[src];

        if (xhr.readyState !== 4) {
            return;
        }

        this.requestsDone++;

        if (xhr.status !== 200) {
            console.log(`Error loading image from src: ${src}`);

            this.errors[src] = xhr.statusText;

            return;
        }

        this.svgs[src] = new Svg(xhr.responseText);

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
