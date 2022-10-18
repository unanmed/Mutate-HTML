interface ImageMap {
    [x: string]: HTMLImageElement;
}

export const image: ImageMap = {};

export async function loadImage(url: string, on: (e: ProgressEvent) => void) {
    const img = new Image();
    img.src = url;
    img.addEventListener('progress', on);
    await new Promise(res => {
        img.addEventListener('load', e => res('success'));
    });
    image[url.split('/').at(-1) as string] = img;
    return img;
}
