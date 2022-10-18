interface ImageMap {
    [x: string]: HTMLImageElement;
}

export const image: ImageMap = {};

export async function loadImage(url: string) {
    const img = new Image();
    img.src = url;
    await new Promise(res => {
        img.addEventListener('load', e => res('success'));
    });
    image[url.split('/').at(-1) as string] = img;
    return img;
}
