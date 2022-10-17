<template>
    <div id="game" @click="start">
        <span v-if="!acted" id="start-tip">点击以加载游戏</span>
        <Start v-if="startPage && acted && !started"></Start>
        <Select v-if="started"></Select>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, provide, ref, watch } from 'vue';
import Start from './components/start.vue';
import Select from './components/select.vue';
import { animate } from 'mutate-game';

/** 是否在开始界面 */
const startPage = ref(true);

/** 是否与页面交互过 */
const acted = ref(false);

const started = ref(false);

watch(started, async n => {
    await animate.sleep(200);
    started.value = n;
    const game = document.getElementById('game') as HTMLDivElement;
    game.style.border = '1px solid #fff';
});

provide('started', started);

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
});

function start() {
    if (acted.value) return;
    const span = document.getElementById('start-tip') as HTMLSpanElement;
    span.style.opacity = '0';
    span.addEventListener('transitionend', () => {
        acted.value = true;
    });
}

document.addEventListener('touchmove', e => e.preventDefault());
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
