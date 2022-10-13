<template>
    <div v-if="!loaded" id="start-load">
        <canvas id="loading"></canvas>
        <a-progress :percent="progress"></a-progress>
    </div>
    <div v-if="loaded" id="start-page">
        <Cover></Cover>
    </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { loadAudio } from '../audio';
import * as mutate from 'mutate-game';
import Cover from './cover.vue';

const loaded = ref(false);

const progress = ref(0);

let allTask = 0;

let loadedCnt = ref(0);

const base = import.meta.env.BASE_URL

/**
 * 加载所有内容
 */
async function load() {
    const tasks = [
        loadAudio(`${base}/music/mutate.mp3`).then(() => loadedCnt.value++),
        loadAudio(`${base}/se/tap.wav`).then(() => loadedCnt.value++),
        loadAudio(`${base}/se/drag.wav`).then(() => loadedCnt.value++)
    ]
    allTask = tasks.length;
    await Promise.all(tasks);
}

// 监听加载过程
watch(loadedCnt, v => {
    loadedCnt.value = v;
    progress.value = Math.round(v / allTask * 100);
})

onMounted(async () => {
    // 加载的动画
    const ticker = new mutate.ticker.Ticker();
    const canvas = document.getElementById('loading') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    setTimeout(() => {
        canvas.style.opacity = '1';
        canvas.style.width = '80%';
        canvas.style.height = '80%';
        canvas.style.filter = 'none';
    }, 100);
    if (window.innerWidth >= window.innerHeight) {
        canvas.width = window.innerWidth * 0.95;
        canvas.height = window.innerHeight * 0.95;
    } else {
        canvas.width = window.innerHeight * 0.95;
        canvas.height = window.innerWidth * 0.95;
    }
    ctx.strokeStyle = '#eee';
    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ticker.add((time) => {
        const start = Math.PI * (time as number) / 700;
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
        ctx.fillText(`loading${'.'.repeat(Math.floor((time as number) / 800) % 4)}`, hw, hh + hh / 2);
    })

    // 执行加载
    await load();
    // 加载完毕，隐藏加载动画和加载进度条
    canvas.style.opacity = '0';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    canvas.style.filter = 'blur(5px)';
    canvas.addEventListener('transitionend', async () => {
        if (loaded.value) return;
        loaded.value = true;
        ticker.destroy();
    });
})

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