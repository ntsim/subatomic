import Canvas from './Canvas';
import ShapeSetting = SubatomicConfig.ShapeSetting;
import ImageSetting = SubatomicConfig.ImageSetting;
import ImageLoader from './image/ImageLoader';

export default class Subatomic {
    id: string;
    rootEl: HTMLElement;
    config: SubatomicConfig.Root;
    canvas: Canvas;
    imageLoader: ImageLoader;

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

    init(): void {
        this.rootEl.appendChild(this.canvas.element);

        // Make sure to load in any specified images
        this.config.shapes.forEach((shape) => {
            if (shape.type === 'image') {
                const image = <ImageSetting> shape;
                this.imageLoader.loadImage(image.src);
            }
        });
    }
}
