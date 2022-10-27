<template>
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
        <a-divider style="border-color: #ddd4; margin: 1%" dashed></a-divider>
        <div id="score">
            <span id="score-num"
                >成绩&nbsp;&nbsp;&nbsp;&nbsp;{{
                    getScore().match(/^[0-9]+/)![0]
                }}</span
            >
            <span
                id="rank"
                :style="{
                    color: getRankColor(
                        hasPlayed() ? getRankFromScore(getScore()) : 'F'
                    ),
                    background:
                        getRankFromScore(getScore()) === 'AP'
                            ? 'linear-gradient(0.25turn, #3f87a6, #ebf8e1, gold, #3f87a6)'
                            : '',
                    'background-clip':
                        getRankFromScore(getScore()) === 'AP' ? 'text' : '',
                    WebkitBackgroundClip:
                        getRankFromScore(getScore()) === 'AP' ? 'text' : ''
                }"
                >{{ hasPlayed() ? getRankFromScore(getScore()) : '' }}</span
            >
        </div>
        <a-divider style="border-color: #ddd4; margin: 1%" dashed></a-divider>
        <div id="start">
            <a-checkbox
                v-model:checked="auto"
                :style="{
                    'font-size': isMobile()
                        ? `${width / 3000}em`
                        : `${width / 1500}em`,
                    'margin-left': '3%'
                }"
                >自动播放</a-checkbox
            >
            <a-button
                style="width: 50%; height: 80%; background-color: #ccc"
                @click="play"
                ><caret-right-outlined
                    :style="{
                        transform: `scale(${width / 4}%)`,
                        color: `#000`
                    }"
            /></a-button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { CaretRightOutlined } from '@ant-design/icons-vue';
import { computed, onUpdated, ref, watch } from 'vue';
import { MusicHard, info } from '../constants';
import {
    isMobile,
    getRankFromScore,
    getColor as getRankColor,
    formatTime
} from '../utils';

interface StartInfo {
    music: string;
    hard: keyof MusicHard;
    auto: boolean;
}

const props = defineProps<{
    selectedKeys: string[];
    hard: keyof MusicHard;
}>();

const emits = defineEmits<{
    (e: 'play', info: StartInfo): void;
    (e: 'update:hard', hard: keyof MusicHard): void;
}>();

const hard = ref<keyof MusicHard>(props.hard);
const auto = ref(false);

const color = computed(() => getColor(hard.value));

const selectedKeys = ref(props.selectedKeys);

const width = isMobile() ? window.innerHeight : window.innerWidth;

function selectHard(h: keyof MusicHard) {
    hard.value = h;
}

watch(hard, n => {
    emits('update:hard', n);
});

function getScore() {
    if (selectedKeys.value[0] === '教程') {
        let score = localStorage.getItem(`@mutate:score-教程`) ?? '0F';
        return score.padStart(8, '0');
    }
    let score = localStorage.getItem(
        `@mutate:score-${selectedKeys.value[0]}-${hard.value}`
    );
    if (!score) score = '0F';
    return score.padStart(8, '0');
}

function hasPlayed() {
    if (selectedKeys.value[0] !== '教程')
        return (
            localStorage.getItem(
                `@mutate:score-${selectedKeys.value[0]}-${hard.value}`
            ) !== null
        );
    else return localStorage.getItem(`@mutate:score-教程`) !== null;
}

/** 获得难度的颜色 */
function getColor(hard: keyof MusicHard) {
    if (hard === 'easy') return '#348f00';
    else if (hard === 'normal') return '#b8b400';
    else if (hard === 'hard') return '#7a0003';
    else return '#8f008a';
}

function play() {
    emits('play', {
        music: selectedKeys.value[0],
        hard: hard.value,
        auto: auto.value
    });
}

onUpdated(() => {
    selectedKeys.value = props.selectedKeys;
});
</script>

<style lang="less" scoped>
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
        padding-left: 10%;
        padding-right: 10%;
        justify-content: space-between;
        align-items: center;
        height: 10%;

        #score-num {
            font-size: 1.5em;
        }

        #rank {
            font-size: 2em;
            animation: back 10000s linear infinite;
        }
    }

    #start {
        display: flex;
        justify-content: space-between;
        height: 100%;
        align-items: center;
    }
}

@keyframes back {
    0% {
        background-position: 0;
    }
    100% {
        background-position: 1e4vw;
    }
}
</style>
