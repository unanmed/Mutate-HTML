<template>
    <div id="game">
        <Start v-if="startPage"></Start>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue';
import Start from './components/start.vue';

const startPage = ref(true);

onMounted(() => {
    const div = document.getElementById('game') as HTMLDivElement;
    if (window.innerHeight > window.innerWidth) {
        // 手机端，旋转90度
        div.style.transform = 'rotate(90deg)';
        div.style.width = `95vh`;
        div.style.height = `95vw`;
    }
})
</script>

<style lang="less" scoped>
html,
body {
    padding: 0;
}

#game {
    width: 95vw;
    height: 95vh;
    display: flex;
    justify-content: center;
    justify-items: center;
    align-items: center;
}
</style>