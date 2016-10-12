import Svg from './Svg';

export default class ImageLoader {
    requests: { [src: string]: XMLHttpRequest } = {};
    errors: { [src: string]: string } = {};
    svgs: { [src: string]: Svg } = {};
    renderedImages: { [src: string]: HTMLElement } = {};

    private _requestCount = 0;
    private _requestsDone = 0;
    private _errorCount = 0;
    private _rendered = 0;

    constructor(srcs: string[] = []) {
        srcs.forEach(this.loadImage);
    }

    loadImage(src: string): void {
        if (src.indexOf('svg') > -1) {
            this.loadSvg(src);
        } else {
            this.renderImage(src);
        }
    }

    get requestCount() {
        return this._requestCount;
    }

    get requestsDone() {
        return this._requestsDone;
    }

    get errorCount() {
        return this._errorCount;
    }

    private loadSvg(src: string): void {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', src);
        xhr.onreadystatechange = this.onSvgLoaded.bind(this, src);

        this._requestCount++;
        this.requests[src] = xhr;

        xhr.send();
    }

    private renderImage(src: string): void {
        const image = new Image();
        image.src = src;
        image.addEventListener('load', () => {
            this._rendered++;
            this.renderedImages[src] = image;
        });
    }

    private onSvgLoaded(src: string) {
        const xhr = this.requests[src];

        if (xhr.readyState !== 4) {
            return;
        }

        this._requestsDone++;

        if (xhr.status !== 200) {
            console.log(`Error loading image from src: ${src}`);

            this._errorCount++;
            this.errors[src] = xhr.statusText;

            return;
        }

        this.svgs[src] = new Svg(xhr.responseText);
    }
}
