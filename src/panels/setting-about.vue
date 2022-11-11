<template>
    <div id="info" :style="{ 'font-size': isMobile() ? '1.7vh' : '1.7vw' }">
        <span class="desc">游戏作者</span>
        <span>古祠</span>
        <span class="desc">游戏版本</span>
        <span>v0.1</span>
        <span class="desc">引擎开源地址</span>
        <a href="https://github.com/unanmed/Mutate" target="_blank"
            >https://github.com/unanmed/Mutate</a
        >
        <span class="desc">游戏开源地址</span>
        <a href="https://github.com/unanmed/Mutate-HTML" target="_blank"
            >https://github.com/unanmed/Mutate-HTML</a
        >
        <span class="desc">曲师</span>
        <span>弱鸡绿毛怪&nbsp;&nbsp;古祠&nbsp;&nbsp;真理絵・霜月はるか</span>
        <span class="desc">谱师</span>
        <span>古祠&nbsp;&nbsp;再顶</span>
        <span class="desc">特别鸣谢</span>
        <span>灵梦&nbsp;&nbsp;阿尔法</span>
    </div>
</template>

<script lang="ts" setup>
import { isMobile } from '../utils';
</script>

<style lang="less" scoped>
#info {
    font-family: normal;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    user-select: text;

    .desc {
        margin-top: 1%;
    }
}
</style>
