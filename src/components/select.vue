<template>
    <div
        id="select"
        :style="{
            'background-color': `${color}22`
        }"
    >
        <div id="leftbar">
            <div id="song-selector">
                <div id="song-menu">
                    <a-menu
                        mode="inline"
                        theme="dark"
                        v-model:openKeys="openKeys"
                        v-model:selectedKeys="selectedKeys"
                        style="font-size: 1.5em"
                    >
                        <a-sub-menu
                            v-for="(arr, key) of musics"
                            :key="key"
                            @titleClick="calLength(300)"
                        >
                            <template #title>{{ key }}</template>
                            <a-menu-item
                                v-for="(song, i) of arr"
                                :key="song"
                                style="font-size: 1.5em"
                            >
                                {{ song }}&nbsp;-&nbsp;{{ info[song].author }}
                            </a-menu-item>
                        </a-sub-menu>
                    </a-menu>
                </div>
            </div>
            <Scroll
                :id="'select'"
                :now="now"
                :total="total"
                ref="scroll"
                @scroll="scrollList"
            ></Scroll>
            <a-divider
                style="
                    border-color: #ddd4;
                    height: 96%;
                    top: 2%;
                    margin: 0;
                    margin-right: 8px;
                "
                type="vertical"
                dashed
            ></a-divider>
        </div>
        <div id="rightbar">
            <img
                :src="getImgSrc(info[selectedKeys[0]].file.image)"
                id="image"
            />
            <a-divider
                style="border-color: #ddd4; height: 100%"
                type="vertical"
                dashed
            ></a-divider>
            <div id="info">
                <div id="hard">
                    <a-button
                        v-for="(h, key) of info[selectedKeys[0]].hard"
                        :key="key"
                        :type="key === hard ? 'primary' : 'default'"
                        size="large"
                        :style="{
                            height: isMobile() ? '50%' : '100%',
                            margin: '1%',
                            'font-size': isMobile()
                                ? `${width / 1000}em`
                                : `${width / 550}em`,
                            'text-align': 'center',
                            'vertical-align': 'middle',
                            'line-height': '100%',
                            'background-color': `${
                                hard === key ? color : 'transparent'
                            }`
                        }"
                        @click="selectHard(key)"
                        >{{ key }}&nbsp;-&nbsp;{{ h }}</a-button
                    >
                </div>
                <a-divider
                    style="border-color: #ddd4; margin-bottom: 1%"
                    dashed
                ></a-divider>
                <div id="song-info">
                    <span id="music"
                        >曲师&nbsp;&nbsp;&nbsp;&nbsp;{{
                            info[selectedKeys[0]].author
                        }}</span
                    >
                    <span id="chart"
                        >谱师&nbsp;&nbsp;&nbsp;&nbsp;{{
                            info[selectedKeys[0]].chart
                        }}</span
                    >
                    <span id="chart"
                        >时长&nbsp;&nbsp;&nbsp;&nbsp;{{
                            formatTime(info[selectedKeys[0]].duration)
                        }}</span
                    >
                </div>
                <a-divider
                    style="border-color: #ddd4; margin: 1%"
                    dashed
                ></a-divider>
                <div id="score">
                    <span id="score-num"
                        >成绩&nbsp;&nbsp;&nbsp;&nbsp;{{
                            getScore().slice(0, -1)
                        }}</span
                    >
                    <span id="rank">{{
                        hasPlayed() ? getScore().slice(-1) : ''
                    }}</span>
                </div>
                <a-divider
                    style="border-color: #ddd4; margin: 1%"
                    dashed
                ></a-divider>
                <div id="start">
                    <a-button
                        style="width: 50%; height: 80%; background-color: #ccc"
                        ><caret-right-outlined
                            :style="{
                                transform: `scale(${width / 4}%)`,
                                color: `#000`
                            }"
                    /></a-button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { animate } from 'mutate-game';
import { computed, onMounted, ref, watch } from 'vue';
import { musics, info, MusicHard } from '../constants';
import { isMobile } from '../utils';
import Scroll from './scroll.vue';
import { CaretRightOutlined } from '@ant-design/icons-vue';

let song = localStorage.getItem('@mutate:select');

if (!song) {
    localStorage.setItem('@mutate:select', '单曲@@灵@@0');
    song = '单曲@@灵@@0';
}

/** 打开游戏时的选择信息 */
const initSelect = song.split('@@');

/** 展开的合集 */
const openKeys = ref<string[]>(initSelect[0].split(','));

/** 选择的曲目 */
const selectedKeys = ref<string[]>([initSelect[1]]);

/** 选择的难度 */
const hard = ref<keyof MusicHard>('easy');

// 滚动条
const now = ref(parseFloat(initSelect[2]));

const total = ref(0);

const scroll = ref(Scroll);

const width = isMobile() ? window.innerHeight : window.innerWidth;

// 元素
let menu: HTMLDivElement;
let div: HTMLDivElement;
let songs: HTMLDivElement;
let right: HTMLDivElement;
let songinfo: HTMLDivElement;

const color = computed(() => getColor(hard.value));

watch(selectedKeys, n => {
    localStorage.setItem(
        '@mutate:select',
        `${openKeys.value.join(',')}@@${n[0]}@@${now.value}`
    );
});

function draw() {
    requestAnimationFrame(() => scroll.value.draw());
}

/** 滚动 */
function scrollList(y: number) {
    if (parseFloat(getComputedStyle(div).height) >= total.value) return;
    const h = parseFloat(getComputedStyle(div).height);
    if (y + h >= total.value) {
        now.value = total.value - h;
        menu.style.top = `${-now.value}px`;
    } else if (y <= 0) {
        now.value = 0;
        menu.style.top = '0px';
    } else {
        now.value = y;
        menu.style.top = `${-y}px`;
    }
    draw();
}

/** 计算滚动条的总高度 */
async function calLength(time: number = 0) {
    await animate.sleep(time);
    const style = getComputedStyle(menu);
    const s = getComputedStyle(songs);
    total.value = parseFloat(style.height) + 2 * parseFloat(s.padding);
}

function selectHard(h: keyof MusicHard) {
    hard.value = h;
}

/** 获得难度的颜色 */
function getColor(hard: keyof MusicHard) {
    if (hard === 'easy') return '#348f00';
    else if (hard === 'normal') return '#b8b400';
    else if (hard === 'hard') return '#7a0003';
    else return '#8f008a';
}

function formatTime(s: number) {
    const second = s % 60;
    const minute = Math.floor(s / 60);
    return `${minute}m${second}s`;
}

function getScore() {
    let score = localStorage.getItem(
        `@mutate:score-${selectedKeys.value[0]}-${hard.value}`
    );
    if (!score) score = '0F';
    return score.padStart(7, '0');
}

function hasPlayed() {
    return (
        localStorage.getItem(
            `@mutate:score-${selectedKeys.value[0]}-${hard.value}`
        ) !== null
    );
}

function getImgSrc(name: string) {
    return `${import.meta.env.BASE_URL}image/${name}`;
}

onMounted(async () => {
    await animate.sleep(200);
    div = document.getElementById('select') as HTMLDivElement;
    songs = document.getElementById('leftbar') as HTMLDivElement;
    menu = document.getElementById('song-menu') as HTMLDivElement;
    right = document.getElementById('rightbar') as HTMLDivElement;
    songinfo = document.getElementById('song-info') as HTMLDivElement;

    calLength();

    songs.addEventListener('wheel', e => {
        if (parseFloat(getComputedStyle(div).height) >= total.value) return;
        const d = Math.sign(e.deltaY) * 100;
        now.value += d;
        scrollList(now.value);
    });

    let last = 0;
    songs.addEventListener('touchstart', e => {
        const d = e.touches[0];
        last = isMobile() ? d.clientX : d.clientY;
    });

    songs.addEventListener('touchmove', e => {
        e.preventDefault();
        if (parseFloat(getComputedStyle(div).height) >= total.value) return;
        const d = e.touches[0];
        const y = isMobile() ? d.clientX : d.clientY;
        now.value += y - last;
        scrollList(now.value);
        last = y;
    });

    if (isMobile()) {
        songs.style.width = 'calc(30% + 48px)';
        right.style.width = 'calc(70% - 48px)';
        right.style.paddingTop = '0';
        right.style.paddingBottom = '0';
    }
    songinfo.style.fontSize = isMobile()
        ? `${width / 1000}em`
        : `${width / 900}em`;
    div.style.opacity = '1';

    const aspect = isMobile()
        ? window.innerHeight / window.innerWidth
        : window.innerWidth / window.innerHeight;
    if (aspect > 16 / 9) {
        const target = (window.innerHeight * 16) / 9;
        const width = parseFloat(getComputedStyle(div).width);
        const d = (width - target) / 2;
        div.style.paddingLeft = `${d}px`;
        div.style.paddingRight = `${d}px`;
    }
    if (aspect < 16 / 9) {
        const target = (window.innerWidth * 9) / 16;
        const height = parseFloat(getComputedStyle(div).height);
        const d = (height - target) / 2;
        div.style.paddingTop = `${d}px`;
        div.style.paddingBottom = `${d}px`;
    }

    await animate.sleep(200);
    scrollList(now.value);
});
</script>

<style lang="less" scoped>
#select {
    opacity: 0;
    width: 100%;
    height: 100%;
    background-color: #111;
    transition: opacity 0.6s linear;
    font-family: normal;
    text-align: center;
    color: #fff;
    font-size: 1.5em;
    display: flex;
    flex-direction: row;
    user-select: none;
    justify-content: space-between;
    transition: background-color 0.3s linear;
}

#song-menu {
    position: relative;
}

#leftbar {
    width: calc(20% + 48px);
    height: 100%;
    padding: 0.5%;
    display: flex;
    flex-direction: row;
}

#song-selector {
    width: 100%;
    padding-right: 0;
    overflow: hidden;
}

#rightbar {
    display: flex;
    flex-direction: row;
    width: calc(80% - 48px);
    padding-right: 2%;
    padding-top: 7%;
    padding-bottom: 7%;

    #info {
        width: 100%;
        display: flex;
        flex-direction: column;

        #hard {
            display: flex;
            flex-direction: column;
            height: 40%;
        }

        #song-info {
            display: flex;
            flex-direction: column;
            justify-content: start;
            text-align: left;
            font-size: 1.5em;

            span {
                width: 100%;
                display: block;
                white-space: nowrap;
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }

        #score {
            display: flex;
            padding-left: 20%;
            padding-right: 20%;
            justify-content: space-between;
            align-items: center;
            height: 10%;

            #score-num {
                font-size: 1.5em;
            }

            #rank {
                font-size: 2em;
            }
        }

        #start {
            display: flex;
            justify-content: end;
            height: 100%;
            align-items: center;
        }
    }

    #image {
        position: relative;
        height: 100%;
    }
}
</style>
