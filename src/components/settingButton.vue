<template>
    <a-button
        :style="{
            'font-size': isMobile() ? '2.5vh' : '2.5vw'
        }"
        @click="emits('click')"
        ><slot></slot
    ></a-button>
</template>

<script lang="ts" setup>
import { isMobile } from '../utils';

const emits = defineEmits<{
    (e: 'click'): void;
}>();
</script>

<style lang="less" scoped></style>
