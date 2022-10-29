import { TimingFn, PathFn } from 'mutate-game';

/**
 * 圆形轨迹
 * @param r 半径大小
 * @param n 旋转的圈数
 * @param timing 半径变化函数，1表示原长，0表示半径为0
 * @param inverse 是否翻转timing函数
 */
export function circle(
    r: number,
    n: number = 1,
    center: [number, number] = [0, 0],
    start: number = 0,
    timing: TimingFn = x => 1,
    inverse: boolean = false
): PathFn {
    return input => {
        const a = n * input * Math.PI * 2 + (start * Math.PI) / 180;
        const cos = Math.cos(a);
        const sin = Math.sin(a);
        const radius = r * timing(inverse ? timing(1 - input) : timing(input));
        return [radius * cos + center[0], radius * sin + center[1]];
    };
}
