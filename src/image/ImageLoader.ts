import Svg from './Svg';

export class ImageLoader {
    requests: { [src: string]: XMLHttpRequest } = {};
    errors: { [src: string]: string } = {};
    svgs: { [src: string]: Svg } = {};
    renderedImages: { [src: string]: HTMLElement } = {};

    private isReady: boolean = false;
    private requestCount: number = 0;
    private requestsDone: number = 0;
    private errorCount: number = 0;
    private rendered: number = 0;

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
        this.isReady = false;

        if (src.indexOf('svg') > -1) {
            this.loadSvg(src, callback);
        } else {
            this.renderImage(src);
        }
    }

    private loadSvg(src: string, callback?: () => void): void {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', src);
        xhr.onreadystatechange = this.onXhrComplete.bind(this, src, callback);

        this.requestCount++;
        this.requests[src] = xhr;

        xhr.send();
    }

    private renderImage(src: string, callback?: () => void): void {
        const image = new Image();
        image.src = src;
        image.addEventListener('load', () => {
            this.rendered++;
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

            this.errorCount++;
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

        this.isReady = true;

        if (typeof callback === 'function') {
            callback();
        }
    }
}
