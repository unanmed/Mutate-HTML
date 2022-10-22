<template>
    <div id="mutate-div">
        <div id="mutate-core">
            <canvas id="mutate-game" style="width: 100%; height: 100%"></canvas>
            <a-progress
                :percent="parseFloat(rate[0])"
                :style="{
                    position: 'absolute',
                    bottom: '7%',
                    width: '50%',
                    left: '7%',
                    opacity,
                    transition: 'opacity 0.6s linear'
                }"
            ></a-progress>
            <a-progress
                :percent="parseFloat(rate[1])"
                :style="{
                    position: 'absolute',
                    bottom: '17%',
                    width: '50%',
                    left: '7%',
                    opacity,
                    transition: 'opacity 0.6s linear'
                }"
            ></a-progress>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { animate, create, Ticker } from 'mutate-game';
import { onMounted, ref, watch } from 'vue';
import { drawInfo, setRenderer } from '../render';
import { formatSize, getSize, isMobile } from '../utils';

const props = defineProps<{
    chart: string;
    music: string;
    auto: boolean;
}>();

const loaded = ref([0, 0]);
const all = ref([0, 0]);
const rate = ref(['0', '0']);
const opacity = ref(0);
const offset = parseFloat(localStorage.getItem('@mutate:offset') ?? '0');

onMounted(async () => {
    const div = document.getElementById('mutate-core') as HTMLDivElement;
    const canvas = document.getElementById('mutate-game') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    let { w, h } = getSize();
    w -= 10;
    h -= 10;
    if (w / h > 16 / 9) {
        const width = (h * 16) / 9;
        canvas.height = h;
        canvas.width = width;
        div.style.width = `${width}px`;
        div.style.height = `${h}px`;
    } else {
        const height = (w * 9) / 16;
        canvas.height = height;
        canvas.width = w;
        div.style.width = `${w}px`;
        div.style.height = `${height}px`;
    }

    await animate.sleep(600);
    const game = create(canvas);
    const base = import.meta.env.BASE_URL;
    canvas.style.opacity = '1';
    opacity.value = 1;
    // 加载动画
    const ticker = new Ticker();
    ticker.add(time => {
        const start = (Math.PI * (time as number)) / 700;
        const w = canvas.width;
        const h = canvas.height;
        const hw = w / 2;
        const hh = (h / 5) * 2;
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
        // 加载大小
        const ms = formatSize(loaded.value[0]);
        const ma = formatSize(all.value[0]);
        ctx.textAlign = 'left';
        ctx.font = `normal ${(24 * canvas.width) / 1920}px Verdana`;
        ctx.fillText(
            `音乐加载进度    ${ms} / ${ma}`,
            canvas.width / 11,
            canvas.height * (1 - 0.11)
        );
        const cs = formatSize(loaded.value[1]);
        const ca = formatSize(all.value[1]);
        ctx.fillText(
            `谱面加载进度    ${cs} / ${ca}`,
            canvas.width / 11,
            canvas.height * (1 - 0.21)
        );
        rate.value = [
            ((loaded.value[0] / all.value[0]) * 100).toFixed(2),
            ((loaded.value[1] / all.value[1]) * 100).toFixed(2)
        ];
    });

    await game.load(
        `${base}music/${props.music}`,
        `${base}chart/${props.chart}`,
        e => {
            loaded.value[0] = e.loaded;
            all.value[0] = e.total;
        },
        e => {
            loaded.value[1] = e.loaded;
            all.value[1] = e.total;
        }
    );
    // 加载完成
    canvas.style.opacity = '0';
    opacity.value = 0;
    await animate.sleep(600);
    ticker.destroy();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.style.opacity = '1';
    canvas.style.transition = '';
    game.setOffset(-offset);
    setRenderer(game);
    game.start();
    game.setSound('tap', `${import.meta.env.BASE_URL}se/tap.wav`);
    game.setSound('drag', `${import.meta.env.BASE_URL}se/drag.wav`);
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

#mutate-core {
    position: relative;
}
</style>
