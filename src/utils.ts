/**
 * 获得游戏界面的尺寸
 */
export function getSize() {
    if (window.innerWidth >= window.innerHeight) {
        return {
            w: window.innerWidth * 0.95,
            h: window.innerHeight * 0.95
        }
    } else {
        return {
            w: window.innerHeight * 0.95,
            h: window.innerWidth * 0.95
        }
    }
}

/**
 * 格式化大小
 */
export function formatSize(size: number): string {
    if (size < 1024) return `${size.toFixed(2)}B`;
    else if (size < 1024 ** 2) return `${(size / 1024).toFixed(2)}KB`;
    else if (size < 1024 ** 3) return `${(size / 1024 ** 2).toFixed(2)}MB`;
    else if (size < 1024 ** 4) return `${(size / 1024 ** 3).toFixed(2)}GB`;
    return `${size}B`;
}