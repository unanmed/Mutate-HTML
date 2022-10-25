<template>
    <div id="offset">
        <span
            id="hint"
            :style="{
                'font-size': isMobile() ? '2.5vh' : '3vw'
            }"
            >调整滑动条使在第三个节拍打击时恰好在标准线处{{
                isMobile() ? '（手机端不可拖动滑动条）' : ''
            }}</span
        >
        <canvas id="offset-canvas"></canvas>
        <div id="slider">
            <span :style="{ 'font-size': isMobile() ? '2vh' : '2vw' }">
                打击延迟&nbsp;&nbsp;&nbsp;&nbsp;{{
                    hitOffset > 0 ? `+${hitOffset}` : hitOffset
                }}ms
            </span>
            <span :style="{ 'font-size': isMobile() ? '2vh' : '2vw' }"
                >{{ offset > 0 ? `+${offset}` : offset }}ms</span
            >
            <div id="slider-main">
                <minus-outlined
                    style="font-size: 3vw; cursor: pointer"
                    @click="offset < -300 ? (offset = -300) : (offset -= 5)"
                />
                <a-slider
                    v-model:value="offset"
                    id="slider-slider"
                    :step="5"
                    :tip-formatter="null"
                    :min="-300"
                    :max="300"
                    :included="false"
                    :marks="{
                        '-300': '-300ms',
                        '-200': '-200ms',
                        '-100': '-100ms',
                        '0': '0',
                        '100': '+100ms',
                        '200': '+200ms',
                        '300': '+300ms'
                    }"
                    ><template #mark="{ label, point }">
                        <template v-if="point === 0">
                            <strong
                                :style="{
                                    'font-size': isMobile() ? '1.4vh' : '1.4vw'
                                }"
                                >{{ label }}</strong
                            >
                        </template>
                        <template v-else
                            ><p
                                :style="{
                                    'font-size': isMobile() ? '1.4vh' : '1.4vw'
                                }"
                            >
                                {{ label }}
                            </p></template
                        >
                    </template></a-slider
                >
                <plus-outlined
                    style="font-size: 3vw; cursor: pointer"
                    @click="offset > 300 ? (offset = 300) : (offset += 5)"
                />
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { Ticker, utils } from 'mutate-game';
import { onMounted, onUnmounted, ref, watch } from 'vue';
import { isMobile } from '../utils';
import { MinusOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { ac, play } from '../audio';

const offset = ref(0);
const hitOffset = ref(0);
const ticker = new Ticker();

watch(offset, n => {
    localStorage.setItem('@mutate:offset', n.toString());
});

const initOffset = localStorage.getItem('@mutate:offset');
if (!utils.has(initOffset)) {
    localStorage.setItem('@mutate:offset', '0');
    offset.value = 0;
} else {
    offset.value = parseInt(initOffset);
}

async function drawOffset() {
    const canvas = document.getElementById(
        'offset-canvas'
    ) as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
    const style = getComputedStyle(canvas);

    canvas.width = parseFloat(style.width);
    canvas.height = parseFloat(style.height);
    const w = canvas.width;
    const h = canvas.height;

    const start = ac.currentTime;
    let lastPlay = 0;
    let hitPos = 0;
    let hitTime = 1000;
    // 开始绘制
    ticker.add(async () => {
        ctx.clearRect(0, 0, w, h);
        const now = ac.currentTime;
        const time = ((now - start) * 1000) % 2400;

        ctx.save();
        // 先绘制
        const lineX = (w * 3) / 4 + (offset.value / 2400) * w;
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(lineX, 0);
        ctx.lineTo(lineX, h);
        ctx.stroke();
        // note
        const x = (time / 2400) * w;
        ctx.beginPath();
        ctx.moveTo(x, h / 4);
        ctx.lineTo(x + 7, h / 4 + 7);
        ctx.lineTo(x + 7, (h * 3) / 4 - 7);
        ctx.lineTo(x, (h * 3) / 4);
        ctx.lineTo(x - 7, (h * 3) / 4 - 7);
        ctx.lineTo(x - 7, h / 4 + 7);
        ctx.closePath();
        ctx.fillStyle = '#00d2eb';
        ctx.lineWidth = 4;
        ctx.fill();
        ctx.stroke();
        // 打击线
        hitTime += 16.7;
        let a = 2 - hitTime / 500;
        if (a < 0) a = 0;
        ctx.globalAlpha = a;
        ctx.strokeStyle = '#5f9';
        ctx.beginPath();
        ctx.moveTo(hitPos, 0);
        ctx.lineTo(hitPos, h);
        ctx.stroke();
        ctx.restore();

        // 音效
        const c = Math.floor(time / 600) % 4;
        if ((c === 1 || c === 2) && lastPlay !== c) {
            lastPlay = c;
            await play(`${import.meta.env.BASE_URL}se/drag.wav`);
        } else if (c === 3 && lastPlay !== c) {
            lastPlay = c;
            await play(`${import.meta.env.BASE_URL}se/tap.wav`);
        }
    });

    // 监听打击
    let holding: number[] = [];
    document.addEventListener('keydown', e => {
        if (!holding.includes(e.keyCode)) {
            holding.push(e.keyCode);
            const time = ((ac.currentTime - start) * 1000) % 2400;
            hitPos = (time / 2400) * w;
            hitTime = 0;
            hitOffset.value = Math.round(time - 1800 - offset.value);
        }
    });
    document.addEventListener('keyup', e => {
        const i = holding.findIndex(v => v === e.keyCode);
        if (i === -1) return;
        holding.splice(i, 1);
    });
    let cnt = 0;
    canvas.addEventListener('touchstart', e => {
        const origin = cnt;
        if (e.touches.length > origin) {
            const time = ((ac.currentTime - start) * 1000) % 2400;
            hitPos = (time / 2400) * w;
            hitTime = 0;
            hitOffset.value = Math.round(time - 1800 - offset.value);
        }
        cnt = e.touches.length;
    });
    canvas.addEventListener('touchend', e => {
        cnt = e.touches.length;
    });
}

onMounted(() => {
    drawOffset();
});

onUnmounted(() => {
    ticker.destroy();
});
</script>

<style lang="less" scoped>
#offset {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    font-family: normal;
    justify-content: space-between;
    align-items: center;
    justify-items: center;
    padding-top: 5%;
    padding-bottom: 5%;
    background-color: #111;

    #hint {
        max-width: 100%;
        white-space: nowrap;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        line-height: 0.9;
    }

    #slider {
        width: 80%;
        display: flex;
        flex-direction: column;

        span {
            align-self: center;
        }

        #slider-main {
            display: flex;
            flex-direction: row;
            width: 100%;
            justify-content: space-between;
            align-items: center;

            #slider-slider {
                width: 80%;
            }
        }
    }

    #offset-canvas {
        width: 100%;
        height: 50%;
        background-color: #222;
    }
}
</style>
