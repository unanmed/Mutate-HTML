<template>
    <div id="mutate-div">
        <canvas id="mutate-game"></canvas>
    </div>
</template>

<script lang="ts" setup>
import { animate, create, Ticker } from 'mutate-game';
import { onMounted, ref } from 'vue';
import { drawInfo, setRenderer } from '../render';
import { formatSize, getSize, isMobile } from '../utils';

const props = defineProps<{
    chart: string;
    music: string;
    auto: boolean;
}>();

onMounted(async () => {
    const canvas = document.getElementById('mutate-game') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    let { w, h } = getSize();
    w -= 10;
    h -= 10;
    if (w / h > 16 / 9) {
        const width = (h * 16) / 9;
        canvas.height = h;
        canvas.width = width;
        canvas.style.width = `${width}px`;
        canvas.style.height = `${h}px`;
    } else {
        const height = (w * 9) / 16;
        canvas.height = height;
        canvas.width = w;
        canvas.style.width = `${w}px`;
        canvas.style.height = `${height}px`;
    }

    await animate.sleep(600);
    const game = create(canvas);
    const base = import.meta.env.BASE_URL;
    canvas.style.opacity = '1';
    // 加载动画
    const ticker = new Ticker();
    ticker.add(time => {
        const start = (Math.PI * (time as number)) / 700;
        const w = canvas.width;
        const h = canvas.height;
        const hw = w / 2;
        const hh = h / 2;
        ctx.lineWidth = 5;
        ctx.lineCap = 'round';
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
    });

    await game.load(
        `${base}music/${props.music}`,
        `${base}chart/${props.chart}`
    );
    // 加载完成
    canvas.style.opacity = '0';
    await animate.sleep(600);
    ticker.destroy();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.opacity = '1';
    canvas.style.transition = '';
    // game.setOffset(-100);
    setRenderer(game);
    game.start();
    if (props.auto) game.chart.judger.auto = true;

    game.renderer.on('after', drawInfo);
});
</script>

<style lang="less" scoped>
#mutate-game {
    opacity: 0;
    transition: opacity 0.6s linear;
}

#mutate-div {
    width: 100%;
    height: 100%;
    display: flex;
    justify-items: center;
    align-items: center;
    justify-content: center;
}
</style>
