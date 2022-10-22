<template>
    <canvas id="cover" @click="startGame"></canvas>
</template>

<script setup lang="ts">
import { inject, onMounted, Ref } from 'vue';
import * as mutate from 'mutate-game';
import { getSize } from '../utils';
import { play, ac, main } from '../audio';

interface Ball {
    x: number;
    y: number;
    r: number;
    vx: number;
    vy: number;
    color: string;
}

const select = inject('select') as Ref<boolean>;

let ticker = new mutate.Ticker();

/**
 * 真正的开始游戏
 */
function startGame() {
    const cover = document.getElementById('cover') as HTMLCanvasElement;
    cover.style.opacity = '0';
    cover.addEventListener('transitionend', e => {
        select.value = true;
        ticker.destroy();
    });
}

onMounted(async () => {
    await mutate.animate.sleep(500);

    const cover = document.getElementById('cover') as HTMLCanvasElement;
    const ctx = cover.getContext('2d') as CanvasRenderingContext2D;

    main.value = await play(
        `${import.meta.env.BASE_URL}music/mutate.mp3`,
        true
    );
    const start = ac.currentTime;

    cover.style.border = '1px solid #fff';
    cover.style.opacity = '1';

    const { w, h } = getSize();

    cover.width = w;
    cover.height = h;

    // 背景的球的移动速度
    let speed = 110;
    // 字体大小
    let fSize = 1.5;
    // 背景的球
    const balls: Ball[] = [];

    // 生成球
    const generate = (num: number) => {
        for (let i = 0; i < num; i++) {
            let x, y;
            const loc = ~~(Math.random() * 4);
            let dir;
            if (loc === 1) {
                // 左
                x = 0;
                y = Math.random() * h;
                dir = (Math.random() - 0.5) * Math.PI * 0.6;
            } else if (loc === 2) {
                x = w;
                y = Math.random() * h;
                dir = (Math.random() + 0.5) * Math.PI * 0.6;
            } else if (loc === 3) {
                y = 0;
                x = Math.random() * w;
                dir = Math.random() * Math.PI * 0.6;
            } else {
                y = h;
                x = Math.random() * w;
                dir = (Math.random() - 1) * Math.PI * 0.6;
            }
            const vx = Math.cos(dir);
            const vy = Math.sin(dir);
            const r = Math.random() * 10 + 50;
            const color = `rgba(${~~(Math.random() * 255)}, ${~~(
                Math.random() * 255
            )}, ${~~(Math.random() * 255)}, 0.5)`;
            balls.push({ x, y, r, vx, vy, color });
        }
    };

    generate(20);

    ctx.save();

    // 绘制函数
    ticker.add(time => {
        ctx.restore();
        ctx.save();
        ctx.clearRect(0, 0, cover.width, cover.height);
        const ct = ac.currentTime * 1000;
        if (time < 1000) {
            cover.style.filter = `blur(${5 - time / 200}px)`;
            speed = 55 - time / 20;
            fSize = 1 + 2 * (time / 2000 - 0.5) ** 2;
        } else {
            speed = 3;
            fSize = 1;
        }
        if (balls.length < 30) {
            generate(1);
        }

        const dt = (~~ct - start) % 462;
        let ds = 0;
        if (dt > 362) {
            ds = (dt - 362) / 100;
        }
        if (dt < 100) {
            ds = 1 - dt / 100;
        }

        for (let i = 0; i < balls.length; i++) {
            const v = balls[i];
            v.x += v.vx * speed;
            v.y += v.vy * speed;
            if (
                v.x < 0 - v.r ||
                v.x > cover.width + v.r ||
                v.y < 0 - v.r ||
                v.y > cover.height + v.r
            ) {
                balls.splice(i, 1);
                i--;
                continue;
            }
            // 绘制
            ctx.filter = 'blur(25px)';
            ctx.fillStyle = v.color;
            ctx.beginPath();
            ctx.arc(v.x, v.y, v.r, 0, Math.PI * 2);
            ctx.closePath();
            ctx.fill();
            ctx.filter = 'none';
        }
        // 后绘制文字
        ctx.shadowColor = '#3df0ff';
        ctx.shadowBlur = 8;
        ctx.shadowOffsetX = 2;
        ctx.shadowOffsetY = 2;
        ctx.textAlign = 'center';
        ctx.fillStyle = '#f78fff';
        ctx.strokeStyle = '#3df0ff';
        ctx.font = `${fSize * 12 + ds}em normal`;
        ctx.filter = `blur(${(speed - 10) / 10}px)`;
        ctx.fillText('MUTATE', cover.width / 2, cover.height / 2);
        ctx.strokeText('MUTATE', cover.width / 2, cover.height / 2);

        ctx.fillStyle = '#fff';
        ctx.shadowBlur = 0;
        ctx.shadowColor = '';
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 0;
        ctx.font = '2em normal';
        ctx.fillText('点击开始游戏', cover.width / 2, cover.height / 2 + 40);
    });
});
</script>

<style scoped lang="less">
#cover {
    opacity: 0;
    animation: cover 10s linear 0s alternate infinite running;
    transition: opacity 0.6s ease-out;
}

@keyframes cover {
    0% {
        background-color: rgb(0, 10, 22);
    }

    25% {
        background-color: rgb(0, 25, 14);
    }

    50% {
        background-color: rgb(22, 18, 0);
    }

    75% {
        background-color: rgb(30, 0, 15);
    }

    100% {
        background-color: rgb(0, 9, 21);
    }
}
</style>
