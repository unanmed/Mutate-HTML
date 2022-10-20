<template>
    <div v-if="!gameLoaded" id="start-load">
        <canvas id="loading"></canvas>
        <a-progress :percent="loaded" style="width: 90%"></a-progress>
    </div>
    <div v-if="gameLoaded" id="start-page">
        <Cover></Cover>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { loadAudio } from '../audio';
import * as mutate from 'mutate-game';
import Cover from './cover.vue';
import axios, { AxiosProgressEvent, AxiosResponse, ResponseType } from 'axios';
import { formatSize, isMobile } from '../utils';
import { loadImage } from '../image';

interface ResponseMap {
    arraybuffer: ArrayBuffer;
    blob: Blob;
    stream: any;
    text: string;
    json: object;
    document: any;
}

const gameLoaded = ref(false);

const loaded = ref(0);

// ### 总下载量
const total = 3410663;

const loadedSize = ref(0);

let loadedOne: Record<number, number> = {};

const base = import.meta.env.BASE_URL;

function calLoaded() {
    const l = Object.values(loadedOne).reduce((pre, cur) => pre + cur, 0);
    loaded.value = parseFloat(((l / total) * 100).toFixed(2));
    loadedSize.value = l;
}

/**
 * 加载所有内容
 */
async function load() {
    const tasks = [
        loadOne(`${base}music/mutate.mp3`, 0, 'arraybuffer'),
        loadOne(`${base}se/tap.wav`, 1, 'arraybuffer'),
        loadOne(`${base}se/drag.wav`, 2, 'arraybuffer'),
        loadOne(`${base}image/base1.png`, 3, 'arraybuffer'),
        loadOne(`${base}image/base2.png`, 4, 'arraybuffer'),
        loadOne(`${base}image/base3.png`, 5, 'arraybuffer'),
        (async () => {
            const data = (await loadOne(
                `${base}font/normal.ttf`,
                3,
                'arraybuffer'
            )) as AxiosResponse<ArrayBuffer>;
            const font = new FontFace('normal', data.data);

            await font.load();
            document.fonts.add(font);
        })()
    ];
    await Promise.all(tasks);
}

/**
 * 加载一个内容
 */
async function loadOne<T extends ResponseType>(
    url: string,
    i: number,
    type: T
): Promise<AxiosResponse<ResponseMap[T]> | HTMLImageElement> {
    const on = (e: AxiosProgressEvent) => {
        loadedOne[i] = e.loaded;
        calLoaded();
    };
    if (url.endsWith('.mp3') || url.endsWith('.wav')) {
        // @ts-ignore
        return await loadAudio(url, on);
    } else if (
        url.endsWith('.png') ||
        url.endsWith('.jpg') ||
        url.endsWith('.jpeg')
    ) {
        return await loadImage(url, on);
    } else {
        return await axios.get(url, {
            responseType: type,
            onDownloadProgress: on
        });
    }
}

onMounted(async () => {
    // 加载的动画
    const ticker = new mutate.Ticker();
    const canvas = document.getElementById('loading') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    setTimeout(() => {
        canvas.style.opacity = '1';
        canvas.style.width = '80%';
        canvas.style.height = '80%';
        canvas.style.filter = 'none';
    }, 50);
    if (!isMobile()) {
        canvas.width = window.innerWidth * 0.95;
        canvas.height = window.innerHeight * 0.95;
    } else {
        canvas.width = window.innerHeight * 0.95;
        canvas.height = window.innerWidth * 0.95;
    }
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ticker.add(time => {
        const start = (Math.PI * (time as number)) / 700;
        const w = canvas.width;
        const h = canvas.height;
        const hw = w / 2;
        const hh = h / 2;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.beginPath();
        ctx.arc(hw, hh, Math.min(w, h) / 16, 0, Math.PI * 2);
        ctx.strokeStyle = '#444';
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(hw, hh, Math.min(w, h) / 16, start, start + Math.PI / 2);
        ctx.strokeStyle = '#eee';
        ctx.stroke();
        ctx.closePath();
        ctx.textAlign = 'center';
        ctx.font = 'normal 4em Verdana';
        ctx.fillStyle = '#eee';
        ctx.fillText(
            `loading${'.'.repeat(Math.floor((time as number) / 800) % 4)}`,
            hw,
            hh + hh / 2
        );
        ctx.textAlign = 'right';
        ctx.font = `normal ${isMobile() ? 1 : 2}em Verdana`;
        ctx.fillText(
            `${formatSize(loadedSize.value)} / ${formatSize(total)}`,
            canvas.width - 30,
            canvas.height - 30
        );
    });

    // 执行加载
    await load();
    // 加载完毕，隐藏加载动画和加载进度条
    loaded.value = 100;
    canvas.style.opacity = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.filter = 'blur(5px)';
    calLoaded();
    canvas.addEventListener('transitionend', async () => {
        if (gameLoaded.value) return;
        gameLoaded.value = true;
        ticker.destroy();
    });
});
</script>

<style scoped lang="less">
#loading {
    opacity: 0;
    width: 100%;
    height: 100%;
    filter: blur(3px);
    transition: all 0.8s ease-out;
}

#start-load {
    display: flex;
    justify-content: center;
    justify-items: center;
    align-items: center;
    flex-direction: column;
    flex-grow: 1;
}
</style>
