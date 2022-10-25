<template>
    <div id="switch">
        <span id="name" :style="{ 'font-size': isMobile() ? '1.5vh' : '1.5vw' }"
            ><slot></slot
        ></span>
        <a-switch
            v-model:checked="checked"
            checked-children="on"
            unchecked-children="off"
        ></a-switch>
    </div>
</template>

<script lang="ts" setup>
import { utils } from 'mutate-game';
import { ref } from 'vue';
import { isMobile } from '../utils';

const props = defineProps<{
    defaultOn: boolean;
    storage: string;
}>();

const checked = ref(props.defaultOn);
const s = localStorage.getItem(props.storage);
if (utils.has(s)) {
    checked.value = s === 'true' ? true : false;
}
</script>

<style lang="less" scoped>
#switch {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;

    #name {
        font-family: normal;
    }
}
</style>
