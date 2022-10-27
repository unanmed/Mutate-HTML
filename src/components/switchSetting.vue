<template>
    <div id="switch">
        <span id="name" :style="{ 'font-size': isMobile() ? '2vh' : '2vw' }"
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
import { message } from 'ant-design-vue';
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
    if (props.storage === '@mutate:autoUpload') {
        if (n === true && !location.host.includes('h5mota.com')) {
            message.warn({
                content: '当前不在h5mota.com，无法开启此功能',
                class: 'auto-upload-yellow'
            });
            checked.value = false;
        }
    }
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
