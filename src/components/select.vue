<template>
    <div id="select">

    </div>
</template>

<script lang="ts" setup>
import { animate } from 'mutate-game';
import { onMounted } from 'vue';

onMounted(async () => {
    await animate.sleep(200);
    const div = document.getElementById('select') as HTMLDivElement;
    div.style.opacity = '1';
})
</script>

<style lang="less" scoped>
#select {
    opacity: 0;
    width: 100%;
    height: 100%;
    background-color: #222;
    transition: opacity 0.6s linear;
}
</style>