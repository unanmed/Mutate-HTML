<template>
    <div id="settle">
        <img id="settle-img" :src="getImgSrc(info[song].file.image)" />
        <div
            id="settle-right"
            :style="{
                'font-size': isMobile() ? '2.5vh' : '2.5vw'
            }"
        >
            <div id="song-name">
                <span id="name">{{ song }}</span>
                <span
                    >{{ hard }}&nbsp;&nbsp;&nbsp;&nbsp;Lv.&nbsp;{{
                        info[song].hard[hard]
                    }}</span
                >
            </div>
            <a-divider dashed style="width: 100%; margin: 0"></a-divider>
            <div
                id="song-score"
                :style="{
                    'font-size': isMobile() ? '4vh' : '4vw'
                }"
            >
                <span>{{ score.toString().padStart(6, '0') }}</span>
                <span
                    id="rank"
                    :style="{
                        color: getColor(auto ? 'AUTO' : rank),
                        background:
                            rank === 'AP'
                                ? 'linear-gradient(0.25turn, #3f87a6, #ebf8e1, gold, #3f87a6)'
                                : '',
                        'background-clip': rank === 'AP' ? 'text' : '',
                        WebkitBackgroundClip: rank === 'AP' ? 'text' : ''
                    }"
                    >{{ auto ? 'AUTO' : rank }}</span
                >
            </div>
            <a-divider dashed style="width: 100%; margin: 0"></a-divider>
            <div id="song-detail">
                <div id="detail-left">
                    <span
                        >{{ detail.perfect }}&nbsp;&nbsp;&nbsp;&nbsp;完美</span
                    >
                    <span>{{ detail.good }}&nbsp;&nbsp;&nbsp;&nbsp;良好</span>
                    <span>{{ detail.miss }}&nbsp;&nbsp;&nbsp;&nbsp;错过</span>
                </div>
                <a-divider
                    type="vertical"
                    dashed
                    style="height: 100%; border-color: #ddd4"
                ></a-divider>
                <div id="detail-right">
                    <span>提前&nbsp;&nbsp;&nbsp;&nbsp;{{ detail.early }}</span>
                    <span>过晚&nbsp;&nbsp;&nbsp;&nbsp;{{ detail.late }}</span>
                    <span>最大连击&nbsp;&nbsp;&nbsp;&nbsp;{{ maxCombo }}</span>
                </div>
            </div>
            <a-divider
                dashed
                style="width: 100%; margin: 0 0 10% 0"
            ></a-divider>
            <div id="buttons">
                <a-button
                    id="upload"
                    :style="{
                        'font-size': isMobile() ? '2vh' : '2vw'
                    }"
                    :loading="uploading"
                    :disabled="uploaded"
                    @click="upload(false)"
                >
                    <upload-outlined />
                    <span>{{ uploadText }}</span>
                </a-button>
                <a-button
                    id="confirm"
                    :style="{
                        'font-size': isMobile() ? '3vh' : '3vw'
                    }"
                    @click="exit"
                >
                    <check-outlined />
                </a-button>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { animate, MutateDetail, utils } from 'mutate-game';
import { onMounted, ref } from 'vue';
import { play } from '../audio';
import { info, MusicHard } from '../constants';
import {
    getRank,
    isHigherRank,
    isMobile,
    Rank,
    getColor,
    uploadScore
} from '../utils';
import { CheckOutlined, UploadOutlined } from '@ant-design/icons-vue';
import { message } from 'ant-design-vue';

const props = defineProps<{
    auto: boolean;
    hard: keyof MusicHard;
    song: string;
    score: number;
    detail: MutateDetail;
    maxCombo: number;
}>();

const uploading = ref(false);
const uploaded = ref(false);
const uploadText = ref(props.auto ? '自动播放' : '上传成绩');
const autoUpload =
    localStorage.getItem('@mutate:autoUpload') === 'true' ? true : false;

const emits = defineEmits<{
    (e: 'exit'): void;
}>();

function getImgSrc(name: string) {
    return `${import.meta.env.BASE_URL}image/${name}`;
}

// 设置本地存储，记录分数和评级
const rank = ref<Rank>('D');
if (props.detail.miss > 0) rank.value = getRank(props.score);
else if (props.detail.good > 0) rank.value = 'FC';
else rank.value = 'AP';

// 自动肯定不能计成绩
if (!props.auto) {
    let sto =
        localStorage.getItem(`@mutate:score-${props.song}-${props.hard}`) ??
        '0F';
    if (props.song === '教程')
        sto = localStorage.getItem('@mutate:score-教程') ?? '0F';

    const initScore = parseFloat(sto.match(/^[0-9]+/)![0]);
    const initRank = sto.match(/(F|D|C|B|A|S|AP|FC)$/)![0] as Rank;
    const toScore = props.score > initScore ? props.score : initScore;
    const toRank = isHigherRank(rank.value, initRank) ? rank.value : initRank;
    if (props.song === '教程') {
        localStorage.setItem(`@mutate:score-教程`, `${toScore}${toRank}`);
    } else {
        localStorage.setItem(
            `@mutate:score-${props.song}-${props.hard}`,
            `${toScore}${toRank}`
        );
    }
}

async function exit() {
    const div = document.getElementById('settle') as HTMLDivElement;
    div.style.opacity = '0';
    await animate.sleep(600);
    emits('exit');
}

async function upload(noAlert: boolean = false) {
    if (props.auto && !noAlert) {
        uploadText.value = '自动播放';
        uploaded.value = true;
        return message.error('自动播放不能上传成绩！');
    }
    const match = document.cookie.match(new RegExp('(^| )id=([^;]+)'));
    if (!utils.has(match) || match[2] === '') {
        localStorage.setItem('@mutate:autoUpload', 'false');
        uploaded.value = true;
        return message.error(
            '用户未登录，已关闭自动上传成绩的功能！登录后可以上传成绩，并体验恢复存档功能！'
        );
    }
    uploading.value = true;
    uploadText.value = '成绩上传中';
    await uploadScore(props.song, props.hard, props.score, match[2]);
    if (autoUpload) {
        uploadText.value = '已自动上传成绩';
    } else {
        uploadText.value = '成绩已上传';
    }
    uploading.value = false;
    uploaded.value = true;
}

onMounted(async () => {
    await animate.sleep(200);
    const div = document.getElementById('settle') as HTMLDivElement;

    play(`${import.meta.env.BASE_URL}music/mutate.mp3`, true);
    div.style.opacity = '1';
    div.style.filter = 'none';
    if (autoUpload) upload(true);
});
</script>

<style lang="less" scoped>
#settle {
    opacity: 0;
    transition: opacity 0.2s linear, filter 0.6s ease-out;
    display: flex;
    flex-direction: row;
    justify-content: center;
    width: 80%;
    filter: blur(10px);
    font-family: normal;
}

#settle-img {
    width: 50%;
    border: 1px solid #aaa;
}

#settle-right {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: 50%;
    margin-left: 3%;

    #song-name {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        width: 100%;

        #name {
            margin-left: 10%;
        }
    }

    #song-score {
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        width: 90%;

        #rank {
            animation: back 10000s linear infinite;
        }
    }

    #song-detail {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        width: 100%;

        #detail-left {
            display: flex;
            flex-direction: column;
            text-align: right;
        }

        #detail-right {
            display: flex;
            flex-direction: column;
        }
    }

    #buttons {
        display: flex;
        flex-direction: row;
        height: 10%;
        justify-content: space-around;
        width: 100%;

        #confirm,
        #upload {
            width: 40%;
            height: 100%;
            background-color: #ddd;
            line-height: 1.1;
            color: #111;
        }
    }
}

@keyframes back {
    0% {
        background-position: 0;
    }
    100% {
        background-position: 1e4vw;
    }
}
</style>
