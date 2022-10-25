import axios from 'axios';
import { MusicHard } from './constants';
import { postRoute } from './replay';

export type Rank = 'F' | 'D' | 'C' | 'B' | 'A' | 'S' | 'FC' | 'AP';

const mobile = window.innerWidth <= window.innerHeight;

/** 评级列表 */
const rankList: Rank[] = ['F', 'D', 'C', 'B', 'A', 'S', 'FC', 'AP'];

/**
 * 获得游戏界面的尺寸
 */
export function getSize() {
    if (!isMobile()) {
        return {
            w: window.innerWidth * 0.95,
            h: window.innerHeight * 0.95
        };
    } else {
        return {
            w: window.innerHeight * 0.95,
            h: window.innerWidth * 0.95
        };
    }
}

/**
 * 是否是移动设备
 */
export function isMobile() {
    return mobile;
}

/**
 * 格式化大小
 */
export function formatSize(size: number): string {
    if (size < 1024) return `${size}B`;
    else if (size < 1024 ** 2) return `${(size / 1024).toFixed(2)}KB`;
    else if (size < 1024 ** 3) return `${(size / 1024 ** 2).toFixed(2)}MB`;
    else if (size < 1024 ** 4) return `${(size / 1024 ** 3).toFixed(2)}GB`;
    return `${size}B`;
}

/**
 * 格式化时间
 */
export function formatTime(time: number): string {
    return `${Math.floor(time / 60)}:${(time % 60)
        .toString()
        .padStart(2, '0')}`;
}

export function getRank(score: number): Rank {
    if (score < 700000) return 'F';
    if (score < 800000) return 'D';
    if (score < 850000) return 'C';
    if (score < 900000) return 'B';
    if (score < 950000) return 'A';
    if (score < 1000000) return 'S';
    return 'AP';
}

/**
 * 评级 a 是否高于 b
 */
export function isHigherRank(a: Rank, b: Rank): boolean {
    return rankList.indexOf(a) > rankList.indexOf(b);
}

export function getColor(rank: Rank | 'AUTO') {
    if (rank === 'F') return '#aaa';
    if (rank === 'AP') return 'transparent';
    if (rank === 'FC') return '#66e9ff';
    if (rank === 'AUTO') return '#fc66ff';
    return '#fff';
}

export function getRankFromScore(score: string): Rank {
    return score.match(/(F|D|C|B|A|S|FC|AP)$/)![0] as Rank;
}

export async function uploadScore(
    song: string,
    hard: keyof MusicHard,
    score: number,
    username: string
): Promise<void> {
    const formData = new FormData();
    formData.append('type', 'score');
    formData.append('name', 'Mutate');
    formData.append('version', 'v0.1');
    formData.append('platform', getPlatform());
    formData.append('hard', encodeBase64(hard));
    formData.append('username', encodeBase64(username));
    formData.append('ending', encodeBase64(song));
    formData.append('lv', '0');
    formData.append('hp', score.toString());
    formData.append('atk', '0');
    formData.append('def', '0');
    formData.append('mdef', '0');
    formData.append('money', '0');
    formData.append('experience', '0');
    formData.append('steps', '0');
    formData.append('norank', '0');
    formData.append('seed', '0');
    formData.append('totalTime', '0');
    formData.append('base64', '1');
    postRoute(formData);

    return await axios.post('/games/upload.php', formData);
}

export function getPlatform(): string {
    const platforms = [
        'Android',
        'iPhone',
        'SymbianOS',
        'Windows Phone',
        'iPad',
        'iPod'
    ];
    for (const t of platforms) {
        if (navigator.userAgent.indexOf(t) >= 0) {
            if (t == 'iPhone' || t == 'iPad' || t == 'iPod') return 'IOS';
            if (t == 'Android') return 'Android';
            return 'PC';
        }
    }
    return '';
}

export function encodeBase64(str: string): string {
    return btoa(
        encodeURIComponent(str).replace(/%([0-9A-F]{2})/g, (match, p1) => {
            return String.fromCharCode(parseInt(p1, 16));
        })
    );
}

export function getHardCode(hard: keyof MusicHard): string {
    if (hard === 'easy') return '0';
    if (hard === 'normal') return '1';
    if (hard === 'hard') return '2';
    if (hard === 'master') return '3';
    return '0';
}

export function uploadStart(hard: keyof MusicHard) {
    const formData = new FormData();
    formData.append('type', 'people');
    formData.append('name', 'Mutate');
    formData.append('version', 'v0.1');
    formData.append('platform', getPlatform());
    formData.append('hard', hard);
    formData.append('hardCode', getHardCode(hard));
    formData.append('base64', '1');

    axios.post('/games/upload.php', formData);
}

export async function recoverFromSubmit(): Promise<boolean> {
    return true;
}
