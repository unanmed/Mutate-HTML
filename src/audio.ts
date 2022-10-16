import axios from "axios";
import * as mutate from "mutate-game";

/** 音频资源节点 */
const audioList: Record<number, AudioBufferSourceNode> = {};

/** 音频缓存 */
const bufferCache: Record<string, AudioBuffer> = {};

/** 音频id自增变量 */
let cnt = 0;

/** 音频处理模块 */
export const ac = new AudioContext();

/**
 * 加载音频但不播放
 * @param url 音频地址
 */
export async function loadAudio(url: string): Promise<void> {
    const data = await axios.get(url, { responseType: 'arraybuffer' });
    const buffer = await ac.decodeAudioData(data.data);
    bufferCache[url] = buffer;
}

/**
 * 播放一个音频
 * @param url 音频的地址
 * @param loop 是否循环
 * @returns 该音频的数字id
 */
export async function play(url: string, loop: boolean = false): Promise<number> {
    const gain = ac.createGain();
    const source = ac.createBufferSource();
    // 检查缓存
    if (mutate.utils.has(bufferCache[url])) source.buffer = bufferCache[url];
    else {
        const data = await axios.get(url, { responseType: 'arraybuffer' });
        const buffer = await ac.decodeAudioData(data.data);
        bufferCache[url] = buffer;
        source.buffer = buffer;
    }
    source.loop = loop;
    audioList[cnt] = source;
    source.connect(gain);
    gain.connect(ac.destination);
    source.start();
    return cnt++;
}

/**
 * 获得指定数字对应的音频资源节点
 */
export function getAudio(num: number): AudioBufferSourceNode {
    const node = audioList[num];
    if (!mutate.utils.has(node)) throw new ReferenceError(`You are trying to get a nonexistent audio.`);
    return node;
}