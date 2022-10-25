<template>
    <div id="song-image">
        <div id="song-top-info">
            <span
                id="song-name"
                :style="{
                    'font-size': isMobile()
                        ? `${width / 800}em`
                        : `${width / 600}em`
                }"
                >{{ selectedKeys[0] }}</span
            >
            <setting-outlined
                id="settings"
                :style="{
                    'margin-top': '2%',
                    'margin-right': '5%',
                    transform: `scale(${width / 9}%)`,
                    cursor: 'pointer',
                    transition: 'all 0.2s linear'
                }"
                @click="emits('openSetting')"
            />
        </div>
        <a-divider style="border-color: #ddd4; margin: 0" dashed></a-divider>
        <img :src="getImgSrc(info[selectedKeys[0]].file.image)" id="image" />
    </div>
</template>

<script lang="ts" setup>
import { isMobile } from '../utils';
import { info } from '../constants';
import { SettingOutlined } from '@ant-design/icons-vue';
import { onUpdated, ref } from 'vue';

const props = defineProps<{
    selectedKeys: string[];
}>();

const selectedKeys = ref(props.selectedKeys);

const emits = defineEmits<{
    (e: 'openSetting'): void;
}>();

const width = isMobile() ? window.innerHeight : window.innerWidth;

function getImgSrc(name: string) {
    return `${import.meta.env.BASE_URL}image/${name}`;
}

onUpdated(() => {
    selectedKeys.value = props.selectedKeys;
});
</script>

<style lang="less" scoped>
#song-image {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    height: 100%;

    #song-top-info {
        height: 10%;
        max-width: 100%;
        display: flex;
        justify-content: space-between;
        align-items: center;

        #song-name {
            margin-left: 7%;
        }

        #settings:hover {
            color: rgb(43, 177, 255);
        }
    }

    #image {
        height: 85%;
    }
}
</style>
