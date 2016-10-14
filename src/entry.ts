import * as raf from 'raf';

import { Subatomic } from './Subatomic';
import { SubatomicDOM } from './SubatomicDOM';
import { ImageLoader } from './image/ImageLoader';

raf.polyfill();

const subatomicDOM = new SubatomicDOM();
const imageLoader = new ImageLoader();

window.subatomic = (selector: string, config?: SubatomicConfig.Root): SubatomicDOM => {
    const instance = new Subatomic(selector, config, imageLoader);

    subatomicDOM.add(instance);

    return subatomicDOM;
};
