<template>
    <div id="setting">
        <div id="setting-info">
            <span><slot></slot></span>
            <span style="margin-right: 3%">{{ value }}</span>
        </div>
        <div id="setting-slider">
            <minus-outlined
                style="cursor: pointer"
                @click="emits('update:value', value - (step ?? 5)), update()"
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
                @click="emits('update:value', value + (step ?? 5)), update()"
            />
        </div>
    </div>
</template>

<script lang="ts" setup>
import { MinusOutlined, PlusOutlined } from '@ant-design/icons-vue';
import { isMobile } from '../utils';

const props = defineProps<{
    value: number;
    storage: string;
    min?: number;
    max?: number;
    step?: number;
}>();

const emits = defineEmits<{
    (e: 'update:value', v: number): void;
}>();

function update() {
    localStorage.setItem(props.storage, props.value.toString());
}
</script>

<style lang="less" scoped>
#setting {
    width: 100%;
    font-size: 2.4vw;
    font-family: normal;
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
