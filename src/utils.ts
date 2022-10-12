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