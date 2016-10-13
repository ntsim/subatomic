import { Canvas } from './Canvas';
import ShapeSetting = SubatomicConfig.ShapeSetting;
import ImageSetting = SubatomicConfig.ImageSetting;
import { ImageLoader } from './image/ImageLoader';

export class Subatomic {
    id: string;
    rootEl: HTMLElement;
    canvas: Canvas;
    imageLoader: ImageLoader;
    readonly config: SubatomicConfig.Root;

    constructor(
        id: string = 'subatomic-container',
        config: SubatomicConfig.Root,
        imageLoader: ImageLoader
    ) {
        this.id = id;
        this.rootEl = document.getElementById(id);
        this.canvas = new Canvas('100%', '100%', 'subatomic-canvas');
        this.config = config;
        this.imageLoader = imageLoader;

        this.init();
    }

    private init(): void {
        this.rootEl.appendChild(this.canvas.element);

        const srcs = this.config.shapes
            .filter(shape => shape.type === 'image')
            .map(shape => {
                const image = <ImageSetting> shape;
                return image.src;
            });

        this.imageLoader.loadImages(srcs, this.onImagesLoaded);
    }

    private onImagesLoaded(): void {

    }
}
