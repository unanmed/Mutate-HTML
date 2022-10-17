<template>
    <div id="select">
        <div id="song-selector">
            <div id="song-menu">
                <a-menu
                    mode="inline"
                    theme="dark"
                    v-model:openKeys="openKeys"
                    v-model:selectedKeys="selectedKeys"
                    style="font-size: 1em"
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
                            style="font-size: 1.2em"
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
</template>

<script lang="ts" setup>
import { animate } from 'mutate-game';
import { onMounted, ref, watch } from 'vue';
import { musics, info, MusicHard } from '../constants';
import { isMobile } from '../utils';
import Scroll from './scroll.vue';

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

// 元素
let menu: HTMLDivElement;
let div: HTMLDivElement;
let songs: HTMLDivElement;

watch(selectedKeys, n => {
    localStorage.setItem(
        '@mutate:select',
        `${openKeys.value.join(',')}@@${selectedKeys.value[0]}@@${now.value}`
    );
});

watch(now, n => {
    now.value = n;
    draw();
});

watch(total, n => {
    total.value = n;
    draw();
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
        draw();
    } else if (y <= 0) {
        now.value = 0;
        menu.style.top = '0px';
        draw();
    } else {
        now.value = y;
        menu.style.top = `${-y}px`;
        draw();
    }
}

/** 计算滚动条的总高度 */
async function calLength(time: number = 0) {
    await animate.sleep(time);
    const style = getComputedStyle(menu);
    const s = getComputedStyle(songs);
    total.value = parseFloat(style.height) + 2 * parseFloat(s.padding);
}

onMounted(async () => {
    await animate.sleep(200);
    songs = document.getElementById('song-selector') as HTMLDivElement;
    div = document.getElementById('select') as HTMLDivElement;
    menu = document.getElementById('song-menu') as HTMLDivElement;

    calLength();

    songs.addEventListener('wheel', e => {
        if (parseFloat(getComputedStyle(div).height) >= total.value) return;
        const d = Math.sign(e.deltaY) * 100;
        now.value += d;
        scrollList(now.value);
    });

    let last = -1;
    songs.addEventListener('touchmove', e => {
        e.preventDefault();
        if (parseFloat(getComputedStyle(div).height) >= total.value) return;
        const d = e.touches[0];
        if (last === -1) last = d.clientY;
        now.value -= d.clientY - last;
        scrollList(now.value);
        last = d.clientY;
    });

    if (isMobile()) songs.style.width = '30%';
    div.style.opacity = '1';

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
}

#song-menu {
    position: relative;
}

#song-selector {
    width: 20%;
    height: 100%;
    padding: 0.5%;
    padding-right: 0;
    overflow: hidden;
}
</style>
