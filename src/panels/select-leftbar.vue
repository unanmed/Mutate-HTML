<template>
    <div id="leftbar">
        <div id="song-selector">
            <div id="song-menu">
                <a-menu
                    mode="inline"
                    theme="dark"
                    v-model:openKeys="openKeys"
                    v-model:selectedKeys="selectedKeys"
                    @open-change="emits('update:openKeys', openKeys)"
                    @select="emits('update:selectedKeys', selectedKeys)"
                    :style="{
                        'font-size': isMobile() ? `1em` : `1.5em`
                    }"
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
                            :style="{
                                'font-size': isMobile() ? `1em` : `1.5em`
                            }"
                        >
                            {{ song }}&nbsp;-&nbsp;{{ info[song].author }}
                        </a-menu-item>
                    </a-sub-menu>
                </a-menu>
            </div>
        </div>
        <Scroll :id="'select'" v-model:scroll="now" :total="total"></Scroll>
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
import { onMounted, onUpdated, ref, watch } from 'vue';
import Scroll from '../components/scroll.vue';
import { isMobile } from '../utils';
import { musics, info } from '../constants';

const props = defineProps<{
    selectedKeys: string[];
    openKeys: string[];
    scroll: string;
}>();

const emits = defineEmits<{
    (e: 'update:selectedKeys', data: string[]): void;
    (e: 'update:openKeys', data: string[]): void;
}>();

let songs: HTMLDivElement;
let menu: HTMLDivElement;
let div: HTMLDivElement;

let selected = props.selectedKeys;
let opened = props.openKeys;

// 滚动条
const now = ref(parseFloat(props.scroll));

const total = ref(0);

watch(now, n => scrollList(n));

/** 计算滚动条的总高度 */
async function calLength(time: number = 0) {
    await animate.sleep(time);
    const style = getComputedStyle(menu);
    const s = getComputedStyle(songs);
    total.value = parseFloat(style.height) + 2 * parseFloat(s.padding);
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
}

onUpdated(() => {
    selected = props.selectedKeys;
    opened = props.openKeys;

    localStorage.setItem(
        '@mutate:select',
        `${opened.join(',')}@@${selected[0]}@@${now.value}`
    );
    localStorage.setItem(
        '@mutate:select',
        `${opened.join(',')}@@${selected[0]}@@${now.value}`
    );
});

onMounted(() => {
    songs = document.getElementById('leftbar') as HTMLDivElement;
    menu = document.getElementById('song-menu') as HTMLDivElement;
    div = document.getElementById('leftbar') as HTMLDivElement;

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
});
</script>

<style lang="less" scoped>
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

#song-menu {
    position: relative;
}
</style>
