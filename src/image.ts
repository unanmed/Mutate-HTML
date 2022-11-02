import axios, { AxiosProgressEvent } from 'axios';

interface ImageMap {
    [x: string]: HTMLImageElement;
}

// polyfill，不知为何plugin-legacy没有起作用？
if (!Array.prototype.at) {
    Array.prototype.at = function (i) {
        return i >= 0 ? this[i] : this[this.length + i];
    };
}

export const image: ImageMap = {};

export async function loadImage(
    url: string,
    on: (e: AxiosProgressEvent) => void
) {
    await axios.get(url, {
        onDownloadProgress: on
    });
    const img = new Image();
    img.src = url;
    await new Promise(res => {
        img.addEventListener('load', e => res('success'));
    });
    image[url.split('/').at(-1) as string] = img;
    return img;
}
