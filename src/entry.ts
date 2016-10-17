import * as raf from 'raf';
import * as assign from 'object.assign';

import { Subatomic } from './Subatomic';
import { SubatomicDOM } from './SubatomicDOM';
import { ImageLoader } from './image/ImageLoader';

raf.polyfill();
assign.getPolyfill();

const subatomicDOM = new SubatomicDOM();
const imageLoader = new ImageLoader();

window.subatomic = (selector: string, config?: SubatomicConfig.Root): Subatomic => {
    const instance = new Subatomic(selector, config, imageLoader);

    subatomicDOM.add(instance);

    return instance;
};

window.subatomicDOM = () => {
    return subatomicDOM;
};