<template>
    <canvas id="cover"></canvas>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import * as mutate from 'mutate-game';
import { getSize } from '../utils';

interface Ball {
    x: number
    y: number
    r: number
    sx: number
    sy: number
    color: string
}

onMounted(async () => {
    await mutate.animate.sleep(500);

    const cover = document.getElementById('cover') as HTMLCanvasElement;
    const ctx = cover.getContext('2d') as CanvasRenderingContext2D;
    const ticker = new mutate.ticker.Ticker();

    const { w, h } = getSize();

    cover.width = w;
    cover.height = h;

    // 背景移动速度
    let speed = 110;
    // 字体大小
    let fSize = 1.5;
    // 背景的球
    const balls: Ball[] = [];

    const generate = (num: number) => {
        for (let i = 0; i < num; i++) {
            let x, y;
            const loc = i % 4;
            let dir;
            if (loc === 1) { // 左
                x = 0;
                y = Math.random() * h;
                dir = (Math.random() - 0.5) * Math.PI * 0.6;
            } else if (loc === 2) {
                x = w;
                y = Math.random() * h;
                dir = (Math.random() + 0.5) * Math.PI;
            } else if (loc === 3) {
                y = 0;
                x = Math.random() * w;
                dir = (Math.random() + 1) * Math.PI;
            } else {
                y = h;
                x = Math.random() * w;
                dir = ((Math.random() - 0.5) * 0.6 + 0.5) * Math.PI;
            }
            const vx = Math.cos(dir) * 1.5;
            const vy = Math.sin(dir) * 1.5;
        }
    }

    ticker.add((time) => {
        if (!mutate.utils.has(time)) return;
        if (time < 1000) {
            cover.style.filter = `blur(${5 - time / 200}px)`;
            speed = 110 - time / 10;
            fSize = 1.5 - time / 2000;
        } else {
            speed = 10;
            fSize = 1;
        }
        if (time / 1000 + 30 > balls.length) {
            generate(1);
        }
    })
})
</script>

<style scoped lang="less">

</style>