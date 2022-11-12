import { Mutate, Renderer, RenderEvent } from 'mutate-game';
import { isMobile } from './utils';

/** 设置教程的文字说明 */
export function setTutorial(game: Mutate) {
    game.renderer.on('after', draw);
}

export function draw(e: RenderEvent<'after'>) {
    const renderer = e.target as Renderer;
    const ctx = e.ctx;
    const time = renderer.game.time;
    ctx.save();
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = `${ctx.canvas.width / 40}px normal`;
    if (time >= 1000 && time <= 5000) drawWelcome(ctx, time);
    if (time >= 6000 && time <= 10000) drawTap(ctx, time);
    if (time >= 15000 && time <= 19000) drawDrag(ctx, time);
    if (time >= 24000 && time <= 28000) drawBase(ctx, time);
    if (time >= 37000 && time <= 41000) drawBaseEffect(ctx, time);
    if (time >= 52000 && time <= 56000) drawBaseOpacity(ctx, time);
    if (time >= 73000 && time <= 77000) drawBaseMulti(ctx, time);
    if (time >= 88000 && time <= 92000) drawEnd(ctx, time);
    if (time >= 93000 && time <= 97000) drawEnd2(ctx, time);
    ctx.restore();
}

function drawText(
    ctx: CanvasRenderingContext2D,
    text: string,
    time: number,
    baseline: number
): void {
    const opacity = 2 - Math.abs(baseline - time) / 1000;
    ctx.globalAlpha = opacity;
    ctx.fillText(text, ctx.canvas.width / 2, ctx.canvas.height / 3);
}

function drawWelcome(ctx: CanvasRenderingContext2D, time: number) {
    drawText(ctx, '欢迎来到Mutate！下面你将来学习游戏的基本玩法', time, 3000);
}

function drawTap(ctx: CanvasRenderingContext2D, time: number) {
    drawText(
        ctx,
        `首先是tap音符，你只需要在它到达判定圈外圈的时刻${
            isMobile() ? '点击屏幕任意位置' : '按下任意按键'
        }即可`,
        time,
        8000
    );
}

function drawDrag(ctx: CanvasRenderingContext2D, time: number) {
    drawText(
        ctx,
        `很好！下面是drag音符，你只需要在它到达判定圈的时刻${
            isMobile() ? '有手指按在屏幕上' : '有按键被按住'
        }即可`,
        time,
        17000
    );
}

function drawBase(ctx: CanvasRenderingContext2D, time: number) {
    drawText(
        ctx,
        `这是最基础的玩法，除此之外，音符还可能从各个方向而来`,
        time,
        26000
    );
}

function drawBaseEffect(ctx: CanvasRenderingContext2D, time: number) {
    drawText(ctx, '基地的大小也可以随意改变', time, 39000);
}

function drawBaseOpacity(ctx: CanvasRenderingContext2D, time: number) {
    drawText(
        ctx,
        '基地还可以移动、透明、消失，甚至是拆分开，但本体一定是判定圈',
        time,
        54000
    );
}

function drawBaseMulti(ctx: CanvasRenderingContext2D, time: number) {
    drawText(ctx, '基地还可以是多个', time, 75000);
}

function drawEnd(ctx: CanvasRenderingContext2D, time: number) {
    drawText(ctx, '到此为止，你已经学会了这个游戏怎么游玩了!', time, 90000);
}

function drawEnd2(ctx: CanvasRenderingContext2D, time: number) {
    drawText(ctx, '在教程结束后，快去体验这个游戏吧！', time, 95000);
}
