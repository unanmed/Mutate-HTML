<template>
    <div id="mutate-div">
        <div v-if="!ended && !exited" id="mutate-core">
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
            <pause-outlined
                :style="{
                    position: 'absolute',
                    left: '10px',
                    top: '10px',
                    'font-size': '32px',
                    'font-weight': '900',
                    cursor: 'pointer',
                    opacity: pauseOpacity,
                    transition: 'all 0.6s linear'
                }"
                @click="pause"
            />
        </div>
        <Settle
            v-if="ended && !exited"
            :song="song"
            :auto="auto"
            :hard="hard"
            :score="score"
            :detail="detail!"
            :max-combo="maxCombo"
            @exit="exit"
        ></Settle>
        <div
            id="pause"
            v-if="!timeBack && paused"
            :style="{
                'font-size': isMobile() ? '3vh' : '3vw'
            }"
        >
            <left-outlined style="margin: 25%" @click="exitInPlaying" />
            <reload-outlined style="margin: 25%" @click="restart" />
            <send-outlined style="margin: 25%" @click="resume" />
        </div>
        <span id="time-back" v-if="paused && timeBack">{{ time }}</span>
    </div>
</template>

<script lang="ts" setup>
import { animate, create, Mutate, MutateDetail, Ticker } from 'mutate-game';
import { onMounted, ref } from 'vue';
import { drawInfo, setRenderer } from '../render';
import { formatSize, getSize, isMobile } from '../utils';
import Settle from './settle.vue';
import { info, MusicHard } from '../constants';
import {
    LeftOutlined,
    ReloadOutlined,
    SendOutlined,
    PauseOutlined
} from '@ant-design/icons-vue';
import { play } from '../audio';
import { setTutorial } from '../tutorial';
import { createRoute, pushRoute } from '../replay';
import { circle } from '../path';

const props = defineProps<{
    auto: boolean;
    song: string;
    hard: keyof MusicHard;
}>();

const emits = defineEmits<{
    (e: 'exit'): void;
}>();

const loaded = ref([0, 0]);
const all = ref([0, 0]);
const rate = ref(['0', '0']);
const opacity = ref(0);
const offset = parseFloat(localStorage.getItem('@mutate:offset') ?? '0');
const ended = ref(false);
const score = ref(0);
const detail = ref<MutateDetail>();
const maxCombo = ref(0);
const exited = ref(false);
const paused = ref(false);
const time = ref(3);
const timeBack = ref(false);
const pauseOpacity = ref(0);

let game: Mutate;

function exit() {
    exited.value = true;
    emits('exit');
}

function pause() {
    if (paused.value || opacity.value !== 0) return;
    const div = document.getElementById('mutate-core') as HTMLDivElement;
    div.style.filter = 'blur(10px)brightness(50%)';
    game.pause();
    paused.value = true;
    play(`${import.meta.env.BASE_URL}se/pause.mp3`);
}

async function resume() {
    // 这个得有倒计时
    const div = document.getElementById('mutate-core') as HTMLDivElement;
    timeBack.value = true;
    time.value = 3;
    await animate.sleep(1000);
    time.value = 2;
    await animate.sleep(1000);
    time.value = 1;
    div.style.filter = 'none';
    await animate.sleep(1000);
    timeBack.value = false;
    paused.value = false;
    game.resume();
}

async function restart() {
    const div = document.getElementById('mutate-div') as HTMLDivElement;
    div.style.opacity = '0';
    await animate.sleep(700);
    div.style.opacity = '1';
    const core = document.getElementById('mutate-core') as HTMLDivElement;
    core.style.filter = 'none';
    game.restart(0);
    paused.value = false;
}

async function exitInPlaying() {
    const div = document.getElementById('mutate-div') as HTMLDivElement;
    div.style.opacity = '0';
    await animate.sleep(600);
    emits('exit');
    play(`${import.meta.env.BASE_URL}music/mutate.mp3`, true);
}

onMounted(async () => {
    const root = document.getElementById('mutate-div') as HTMLDivElement;
    const div = document.getElementById('mutate-core') as HTMLDivElement;
    const canvas = document.getElementById('mutate-game') as HTMLCanvasElement;
    const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

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
    game = create(canvas);
    const base = import.meta.env.BASE_URL;
    canvas.style.opacity = '1';
    opacity.value = 1;
    div.style.opacity = '1';
    root.style.opacity = '1';
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

    const music = info[props.song];
    game.chart.register('pathG', 'circle2', circle);

    await game.load(
        `${base}music/${music.file.music}`,
        `${base}chart/${music.file.chart[props.hard]}`,
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
    pauseOpacity.value = 1;
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

    // 设置音量等
    const seVolume =
        parseInt(localStorage.getItem('@mutate:seVolume') ?? '50') / 100;
    game.ac.seVolume = seVolume;
    const musicVolume =
        parseInt(localStorage.getItem('@mutate:musicVolume') ?? '100') / 100;
    game.ac.musicVolume = musicVolume;

    game.renderer.on('after', drawInfo);
    if (props.song === '教程') setTutorial(game);

    if (!props.auto) {
        game.chart.judger.on('hit', e => {
            pushRoute(game.time);
        });
        game.on('restart', e => {
            createRoute(
                props.song,
                info[props.song].file.chart[props.hard]!.slice(0, -4)
            );
        });
        createRoute(
            props.song,
            info[props.song].file.chart[props.hard]!.slice(0, -4)
        );
    }

    const fn = (e: KeyboardEvent) => {
        if (e.key === 'Escape') pause();
    };

    document.addEventListener('keydown', fn);

    game.on('end', async () => {
        div.style.opacity = '0';
        score.value = game.getScore();
        detail.value = game.getDetail();
        maxCombo.value = game.chart.judger.maxCombo;
        document.removeEventListener('keydown', fn);
        await animate.sleep(600);
        root.style.backgroundColor = '#111';
        ended.value = true;
    });
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
    transition: all 0.6s linear;
}

#mutate-core {
    position: relative;
    transition: all 0.6s linear;
}

#pause {
    position: absolute;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    font-size: 3vw;
}

#time-back {
    position: absolute;
    font-size: 6vw;
    font-family: normal;
}
</style>
