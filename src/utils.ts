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
    if (score < 860000) return 'C';
    if (score < 900000) return 'B';
    if (score < 950000) return 'A';
    if (score < 1000000) return 'S';
    return 'AP';
}

/**
 * a 是否高于 b
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
