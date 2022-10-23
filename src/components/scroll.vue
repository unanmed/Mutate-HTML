<template>
    <canvas :id="`scroll-${props.id}`" class="scroll"></canvas>
</template>

<script lang="ts" setup>
import { onMounted, onUpdated } from 'vue';

const props = defineProps<{
    total: number;
    scroll: number;
    id: string;
}>();

let ctx: CanvasRenderingContext2D;

let mouseDown = false;

let now = props.scroll;

/** 绘制 */
function draw(y: number = props.scroll) {
    now = y;
    const total = props.total;
    if (total === 0) return;
    if (now > total) {
        console.warn('当前滚动条位置大于了总长度');
        now = total;
    }
    const length = Math.min(ctx.canvas.height / total, 1) * ctx.canvas.height;
    const py = (now / total) * ctx.canvas.height;

    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    ctx.beginPath();
    ctx.moveTo(20, Math.max(py + 5, 5));
    ctx.lineTo(20, Math.min(py + length - 5, ctx.canvas.height - 5));
    ctx.lineCap = 'round';
    ctx.lineWidth = 6;
    ctx.strokeStyle = '#fff';
    ctx.stroke();
}

onUpdated(() => {
    draw();
});

onMounted(() => {
    const canvas = document.getElementById(
        `scroll-${props.id}`
    ) as HTMLCanvasElement;
    ctx = canvas.getContext('2d') as CanvasRenderingContext2D;

    const style = getComputedStyle(canvas);
    canvas.width = 40;
    canvas.height = parseFloat(style.height);

    draw();

    canvas.addEventListener('mousedown', e => {
        mouseDown = true;
    });

    document.addEventListener('mouseup', e => {
        mouseDown = false;
        if (canvas.height < props.total) emits('update:scroll', now);
    });

    document.addEventListener('mousemove', e => {
        if (!mouseDown) return;
        const dy = e.movementY;
        if (canvas.height < props.total) {
            draw(dy + now);
            emits('update:scroll', now + dy);
        }
    });
});

defineExpose({ draw });

const emits = defineEmits<{
    (e: 'update:scroll', dy: number): void;
}>();
</script>

<style lang="less" scoped>
.scroll {
    opacity: 0.2;
    width: 40px;
    height: 98%;
    margin-top: 1%;
    margin-bottom: 1%;
    transition: opacity 0.2s linear;
}

.scroll:hover {
    opacity: 0.4;
}

.scroll:active {
    opacity: 0.6;
}
</style>
