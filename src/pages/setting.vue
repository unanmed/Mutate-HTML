<template>
    <div id="settings">
        <a-layout
            :style="{
                width: isMobile() ? '95vh' : '95vw',
                height: isMobile() ? '95vw' : '95vh'
            }"
        >
            <a-layout-header>
                <div
                    id="back-div"
                    style="
                        display: flex;
                        justify-content: center;
                        align-items: center;
                        justify-items: center;
                    "
                >
                    <left-outlined
                        @click="exit"
                        id="back"
                        style="
                            font-size: 24px;
                            cursor: pointer;
                            transition: all 0.2s linear;
                        "
                    />
                </div>
                <a-menu
                    v-model:selectedKeys="setting"
                    theme="dark"
                    mode="horizontal"
                    :style="{
                        'font-size': '28px',
                        'font-family': 'normal'
                    }"
                >
                    <a-menu-item key="offset" style="margin: 0 2% 0 2%"
                        >校准</a-menu-item
                    >
                    <a-menu-item key="option" style="margin: 0 2% 0 2%"
                        >设置</a-menu-item
                    >
                    <a-menu-item key="about" style="margin: 0 2% 0 2%"
                        >关于</a-menu-item
                    >
                </a-menu>
            </a-layout-header>
            <a-layout-content style="background-color: #111">
                <SettingOffset v-if="setting[0] === 'offset'" />
                <SettingOption v-if="setting[0] === 'option'" />
                <SettingAbout v-if="setting[0] === 'about'" />
            </a-layout-content>
        </a-layout>
    </div>
</template>

<script lang="ts" setup>
import { animate } from 'mutate-game';
import { onMounted, ref } from 'vue';
import { play } from '../audio';
import { LeftOutlined } from '@ant-design/icons-vue';
import { isMobile } from '../utils';
import SettingOption from '../panels/setting-option.vue';
import SettingOffset from '../panels/setting-offset.vue';
import SettingAbout from '../panels/setting-about.vue';

type Settings = 'offset' | 'option' | 'about';

const emits = defineEmits<{
    (e: 'exit'): void;
}>();

const setting = ref<[Settings]>(['offset']);

onMounted(async () => {
    await animate.sleep(200);
    const div = document.getElementById('settings') as HTMLDivElement;
    div.style.opacity = '1';
});

async function exit() {
    const div = document.getElementById('settings') as HTMLDivElement;
    div.style.opacity = '0';
    await animate.sleep(600);
    play(`${import.meta.env.BASE_URL}music/mutate.mp3`, true);
    emits('exit');
}
</script>

<style lang="less" scoped>
#settings {
    opacity: 0;
    transition: opacity 0.6s linear;
}

#back:hover {
    color: rgb(43, 177, 255);
}

#back-div {
    float: left;
    width: 32px;
    height: 32px;
    margin: 16px 24px 16px 0;
}
</style>
