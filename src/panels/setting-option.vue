<template>
    <div id="option">
        <div id="option-main">
            <div id="left">
                <SettingOne :default-value="50" :storage="'@mutate:seVolume'"
                    >音效音量</SettingOne
                >
                <SwitchSetting
                    :default-on="true"
                    :storage="'@mutate:autoUpload'"
                    >通关后自动上传成绩</SwitchSetting
                >
            </div>
            <a-divider type="vertical" dashed id="option-divider"></a-divider>
            <div id="right">
                <SettingOne
                    :default-value="100"
                    :storage="'@mutate:musicVolume'"
                    >音乐音量</SettingOne
                >
                <div id="functions">
                    <SettingButton @click="recover">恢复数据</SettingButton>
                    <SettingButton @click="clear" :danger="true"
                        >清除数据</SettingButton
                    >
                    <a-modal
                        v-model:visible="alertBox"
                        title="警告"
                        style="font-family: normal"
                        ><template #footer>
                            <a-button
                                class="alert"
                                key="cancel"
                                @click="alertBox = false"
                                >取消</a-button
                            >
                            <a-button
                                class="alert"
                                key="confirm"
                                :danger="true"
                                @click="confirm"
                                >确定</a-button
                            >
                        </template>
                        <p style="font-family: normal; font-size: 1.4vw">
                            {{ alertText }}
                        </p></a-modal
                    >
                </div>
            </div>
            <Scroll
                :total="optionTotal"
                v-model:scroll="optionScroll"
                :id="'option'"
            ></Scroll>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { onMounted, ref, watch } from 'vue';
import Scroll from '../components/scroll.vue';
import SettingButton from '../components/settingButton.vue';
import SettingOne from '../components/settingOne.vue';
import SwitchSetting from '../components/switchSetting.vue';
import { recoverFromSubmit } from '../utils';

// 清除数据与恢复数据的确认框
const alertBox = ref(false);
const alertText = ref('');
const alertType = ref<'recover' | 'clear'>('recover');

// 滚动条
const optionScroll = ref(0);
const optionTotal = ref(0);

watch(optionScroll, n => scrollOption(n));

function scrollOption(y: number) {
    const div = document.getElementById('option-main') as HTMLDivElement;
    if (parseFloat(getComputedStyle(div).height) >= optionTotal.value) return;
    const h = parseFloat(getComputedStyle(div).height);
    if (y + h >= optionTotal.value) {
        optionScroll.value = optionTotal.value - h;
        div.style.top = `${-optionScroll.value}px`;
    } else if (y <= 0) {
        optionScroll.value = 0;
        div.style.top = '0px';
    } else {
        optionScroll.value = y;
        div.style.top = `${-y}px`;
    }
}

function recover() {
    alertBox.value = true;
    alertText.value =
        '此操作将尝试从你上传的录像通过的成绩中恢复你的存档，此操作将会覆盖当前存档，请在存档丢失后使用该功能';
    alertType.value = 'recover';
}

function clear() {
    alertBox.value = true;
    alertText.value =
        '此操作将会删除你的此游戏的所有存档，及除偏移外的设置信息，请慎重操作！！';
    alertType.value = 'clear';
}

async function confirm() {
    if (alertType.value === 'recover') {
        const success = await recoverFromSubmit();
        if (success) alert('恢复成功！');
        else alert('恢复失败！');
        alertBox.value = false;
    }
    if (alertType.value === 'clear') {
        try {
            const offset = localStorage.getItem('@mutate:offset');
            localStorage.clear();
            localStorage.setItem('@mutate:played', 'true');
            localStorage.setItem('@mutate:offset', offset ?? '0');
            alert('清除成功！');
        } catch {
            alert('清除失败！');
        }
        alertBox.value = false;
    }
}

onMounted(() => {
    const option = document.getElementById('option-main') as HTMLDivElement;
    const style = getComputedStyle(option);

    optionTotal.value = parseFloat(style.top);
    optionScroll.value = 0;
});
</script>

<style lang="less" scoped>
#option {
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #111;
    display: flex;
    flex-direction: row;
    justify-content: stretch;

    #option-main {
        display: flex;
        flex-direction: row;
        width: 100%;
        overflow: hidden;
        padding: 2%;

        #left {
            width: 100%;
        }

        #right {
            width: 100%;
        }

        #option-divider {
            height: 100%;
            margin: 0 2% 0 2%;
        }
    }
}
.alert {
    font-family: normal;
    font-size: 1.4vw;
    height: 100%;
    line-height: 1.1;
}

#functions {
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    margin-top: 10%;
    font-family: normal;
    height: 9%;

    * {
        // background-color: cornflowerblue;
        line-height: 0.9;
        height: 100%;
        width: 35%;
    }
}
</style>
