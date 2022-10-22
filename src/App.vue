<template>
    <div id="game" @click="start">
        <span v-if="!acted" id="start-tip">点击以加载游戏</span>
        <Start v-if="startPage"></Start>
        <Select v-if="select" @start="play" @setting="openSetting"></Select>
        <Play v-if="playing" :chart="chart" :music="music" :auto="auto"></Play>
        <Setting v-if="setting" @exit="exitSetting"></Setting>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, provide, ref, watch } from 'vue';
import Start from './components/start.vue';
import Select from './components/select.vue';
import { animate } from 'mutate-game';
import { info, MusicHard } from './constants';
import Play from './components/play.vue';
import Setting from './components/setting.vue';

interface StartInfo {
    music: string;
    hard: keyof MusicHard;
    auto: boolean;
}

/** 是否在开始界面 */
const startPage = ref(false);

/** 是否与页面交互过 */
const acted = ref(false);

const started = ref(false);
const select = ref(false);
const setting = ref(false);

const music = ref('');
const chart = ref('');
const playing = ref(false);
const auto = ref(false);

watch(started, async n => {
    await animate.sleep(200);
    started.value = n;
    const game = document.getElementById('game') as HTMLDivElement;
    game.style.border = '1px solid #fff';
});

watch(select, n => {
    if (n === true) {
        startPage.value = false;
    }
});

provide('select', select);

onMounted(() => {
    const div = document.getElementById('game') as HTMLDivElement;
    const span = document.getElementById('start-tip') as HTMLSpanElement;
    if (window.innerHeight > window.innerWidth) {
        // 手机端，旋转90度
        div.style.transform = 'rotate(90deg)';
        div.style.width = `95vh`;
        div.style.height = `95vw`;
    }
    span.style.opacity = '1';
    div.addEventListener('touchmove', e => e.preventDefault());
});

function start() {
    if (acted.value) return;
    const span = document.getElementById('start-tip') as HTMLSpanElement;
    span.style.opacity = '0';
    span.addEventListener('transitionend', () => {
        startPage.value = true;
        acted.value = true;
    });
}

/**
 * 开始游戏
 */
function play(data: StartInfo) {
    const { music: song, hard } = data;
    const m = info[song].file.music;
    const c = info[song].file.chart[hard] as string;
    music.value = m;
    chart.value = c;
    playing.value = true;
    select.value = false;
    auto.value = data.auto;
}

/**
 * 打开设置界面
 */
function openSetting() {
    select.value = false;
    setting.value = true;
}

/**
 * 退出设置界面
 */
function exitSetting() {
    setting.value = false;
    select.value = true;
}
</script>

<style lang="less" scoped>
#game {
    width: 95vw;
    height: 95vh;
    display: flex;
    justify-content: center;
    justify-items: center;
    align-items: center;
    transition: border 0.6s linear;
    user-select: none;
}

#start-tip {
    opacity: 0;
    font-size: 6em;
    font-family: 微软雅黑;
    transition: opacity 0.5s linear;
    color: white;
    animation: start 4s ease-in-out 0s infinite alternate;
    user-select: none;
}

@keyframes start {
    0% {
        transform: scale(100%);
    }

    50% {
        transform: scale(110%);
    }

    100% {
        transform: scale(100%);
    }
}
</style>
