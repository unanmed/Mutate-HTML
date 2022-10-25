<!-- 急需改进，可以考虑绝对布局？ -->

<template>
    <div
        id="select"
        :style="{
            'background-color': `${color}22`
        }"
    >
        <SelectLeftbar
            v-model:selectedKeys="selectedKeys"
            v-model:openKeys="openKeys"
            :scroll="initSelect[2]"
        />
        <div id="rightbar">
            <SelectSongimage
                :selectedKeys="selectedKeys"
                @openSetting="openSetting"
            />
            <a-divider
                style="border-color: #ddd4; height: 100%"
                type="vertical"
                dashed
            ></a-divider>
            <SelectSonginfo :selectedKeys="selectedKeys" @play="play" />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { animate, Ticker } from 'mutate-game';
import { computed, onMounted, ref } from 'vue';
import { MusicHard } from '../constants';
import { getSize, isMobile, uploadStart } from '../utils';
import { getAudio, main } from '../audio';
import SelectLeftbar from '../panels/select-leftbar.vue';
import SelectSongimage from '../panels/select-songimage.vue';
import SelectSonginfo from '../panels/select-songinfo.vue';
import { message } from 'ant-design-vue';

message.config({
    top: '100px'
});

interface StartInfo {
    music: string;
    hard: keyof MusicHard;
    auto: boolean;
}

const emits = defineEmits<{
    (e: 'start', data: StartInfo): void;
    (e: 'setting'): void;
}>();

let song = localStorage.getItem('@mutate:select');

if (!song) {
    localStorage.setItem('@mutate:select', '教程@@教程@@0');
    song = '教程@@教程@@0';
}

/** 打开游戏时的选择信息 */
const initSelect = song.split('@@');

/** 展开的合集 */
const openKeys = ref<string[]>(initSelect[0].split(','));

/** 选择的曲目 */
const selectedKeys = ref<string[]>([initSelect[1]]);

/** 选择的难度 */
const hard = ref<keyof MusicHard>('easy');

const width = isMobile() ? window.innerHeight : window.innerWidth;

// 元素
let div: HTMLDivElement;
let songinfo: HTMLDivElement;
let score: HTMLSpanElement;
let rank: HTMLSpanElement;

const color = computed(() => getColor(hard.value));

/** 获得难度的颜色 */
function getColor(hard: keyof MusicHard) {
    if (hard === 'easy') return '#348f00';
    else if (hard === 'normal') return '#b8b400';
    else if (hard === 'hard') return '#7a0003';
    else return '#8f008a';
}

async function play(info: StartInfo) {
    div.style.opacity = '0';
    const ticker = new Ticker();
    const [source, gain] = getAudio(main.value);
    ticker.add(time => {
        gain.gain.value = (700 - time) / 700;
    });
    await animate.sleep(700);
    ticker.destroy();
    source.stop();
    uploadStart(hard.value);
    emits('start', info);
}

async function openSetting() {
    div.style.opacity = '0';
    const ticker = new Ticker();
    const [source, gain] = getAudio(main.value);
    ticker.add(time => {
        gain.gain.value = (700 - time) / 700;
    });
    await animate.sleep(700);
    ticker.destroy();
    source.stop();
    emits('setting');
}

onMounted(async () => {
    await animate.sleep(200);

    const autoUpload =
        localStorage.getItem('@mutate:autoUpload') === 'true' ? true : false;
    if (autoUpload) {
        message.success({
            class: 'auto-upload',
            content: '已开启自动上传成绩功能！'
        });
    } else {
        message.warn({
            content: '未开启自动上传成绩功能！',
            class: 'auto-upload'
        });
    }

    div = document.getElementById('select') as HTMLDivElement;
    songinfo = document.getElementById('song-info') as HTMLDivElement;
    score = document.getElementById('score-num') as HTMLSpanElement;
    rank = document.getElementById('rank') as HTMLSpanElement;

    const aspect = isMobile()
        ? window.innerHeight / window.innerWidth
        : window.innerWidth / window.innerHeight;

    songinfo.style.fontSize = isMobile()
        ? `${width / 1000}em`
        : `${width / 900}em`;
    div.style.opacity = '1';
    rank.style.fontSize = isMobile() ? `${width / 800}em` : `${width / 600}em`;
    score.style.fontSize = isMobile()
        ? `${width / 1000}em`
        : `${width / 800}em`;

    const { w, h } = getSize();
    if (aspect > 16 / 9) {
        const target = (h * 16) / 9;
        const width = parseFloat(getComputedStyle(div).width);
        const d = (width - target) / 2;
        div.style.paddingLeft = `${d}px`;
        div.style.paddingRight = `${d}px`;
    }
    if (aspect < 16 / 9) {
        const target = (w * 9) / 16;
        const height = parseFloat(getComputedStyle(div).height);
        const d = (height - target) / 2;
        div.style.paddingTop = `${d}px`;
        div.style.paddingBottom = `${d}px`;
    }
});
</script>

<style lang="less" scoped>
#select {
    opacity: 0;
    width: 100%;
    height: 100%;
    background-color: #111;
    font-family: normal;
    text-align: center;
    color: #fff;
    font-size: 1.5em;
    display: flex;
    flex-direction: row;
    user-select: none;
    justify-content: space-between;
    transition: background-color 0.3s linear, opacity 0.6s linear;
}

#rightbar {
    display: flex;
    flex-direction: row;
    width: calc(80% - 48px);
    padding-right: 2%;
    padding-top: 7%;
    padding-bottom: 7%;
}
</style>

<style lang="less">
.auto-upload {
    font-size: 32px;
    font-family: normal;
    color: yellow;
}
</style>
