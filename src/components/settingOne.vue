<template>
    <div id="setting">
        <div id="setting-info">
            <span><slot></slot></span>
            <span style="margin-right: 3%">{{ value }}</span>
        </div>
        <div id="setting-slider">
            <minus-outlined
                style="cursor: pointer"
                @click="update(value - (step ?? 5))"
            />
            <a-slider
                id="slider-slider"
                v-model:value="value"
                :min="min ?? 0"
                :max="max ?? 100"
                :marks="{
                    [min ?? 0]: min ?? 0,
                    [((min ?? 0) + (max ?? 100)) / 2]:
                        ((min ?? 0) + (max ?? 100)) / 2,
                    [max ?? 100]: max ?? 100
                }"
                :step="step ?? 1"
                :tip-formatter="null"
                @change="update"
                ><template #mark="{ label }">
                    <p
                        :style="{
                            'font-size': isMobile() ? '1.4vh' : '1.4vw'
                        }"
                    >
                        {{ label }}
                    </p>
                </template></a-slider
            >
            <plus-outlined
                style="cursor: pointer"
                @click="update(value + (step ?? 5))"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { MinusOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { utils } from 'mutate-game';
import { ref } from 'vue';
import { isMobile } from '../utils';

const props = defineProps<{
    defaultValue: number;
    storage: string;
    min?: number;
    max?: number;
    step?: number;
}>();

const value = ref(props.defaultValue);
const s = localStorage.getItem(props.storage);
if (utils.has(s)) {
    value.value = parseInt(s);
}

const emits = defineEmits<{
    (e: 'update:value', v: number): void;
}>();

function update(v: number) {
    emits('update:value', v);
    value.value = v;
    localStorage.setItem(props.storage, value.value.toString());
}
</script>

<style lang="less" scoped>
#setting {
    width: 100%;
    font-size: 2.4vw;
    font-family: normal;
    margin: 2% 0 2% 0;
}

#setting-info {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
}

#setting-slider {
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    #slider-slider {
        width: 80%;
    }
}
</style>
