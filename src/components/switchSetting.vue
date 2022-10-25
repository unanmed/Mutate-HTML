<template>
    <div id="switch">
        <span id="name" :style="{ 'font-size': isMobile() ? '1.5vh' : '1.5vw' }"
            ><slot></slot
        ></span>
        <a-switch
            id="switch"
            v-model:checked="checked"
            checked-children="on"
            un-checked-children="off"
        ></a-switch>
    </div>
</template>

<script lang="ts" setup>
import { utils } from 'mutate-game';
import { ref, watch } from 'vue';
import { isMobile } from '../utils';

const props = defineProps<{
    defaultOn: boolean;
    storage: string;
}>();

const checked = ref(props.defaultOn);
const s = localStorage.getItem(props.storage);
if (utils.has(s)) {
    checked.value = s === 'true' ? true : false;
} else {
    localStorage.setItem(props.storage, `${props.defaultOn}`);
}

watch(checked, n => {
    localStorage.setItem(props.storage, `${checked.value}`);
});
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

    #switch[aria-checked='false'] {
        background-color: #666;
    }
}
</style>
