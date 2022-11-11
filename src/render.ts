import {
    Base,
    BaseNote,
    Camera,
    Mutate,
    Renderer,
    RenderEvent,
    utils
} from 'mutate-game';
import { image } from './image';
import { formatTime } from './utils';

let highPerformance = false;

export function setRenderer(game: Mutate) {
    game.renderer.setNote('tap', drawTap);
    game.renderer.setNote('drag', drawDrag);
    game.renderer.setNote('hold', drawHold);
    game.renderer.setBase(drawBase);
    game.chart.camera.setGlobalEffects(globalEffect);
    const high = localStorage.getItem('@mutate:highPerformance');
    if (high === 'true') highPerformance = true;
    else highPerformance = false;
}

/** 游玩信息 */
export function drawInfo(e: RenderEvent<'after'>) {
    const t = e.target as Renderer;
    const ctx = e.ctx;
    const game = t.game;
    const canvas = ctx.canvas;
    ctx.save();
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'right';
    ctx.font = '100 50px normal';
    // 分数
    ctx.fillText(
        game.getScore().toString().padStart(7, '0'),
        canvas.width - 20,
        15
    );
    const combo = game.chart.judger.combo;
    // 谱面进度
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(
        (canvas.width * t.game.time) / 1000 / t.game.ac.audio.duration,
        0
    );
    ctx.lineCap = 'square';
    ctx.lineWidth = 8;
    ctx.stroke();
    // 时长
    const time = `${formatTime(Math.floor(t.game.time / 1000))} / ${formatTime(
        Math.floor(t.game.ac.audio.duration + 1)
    )}`;
    ctx.textAlign = 'left';
    ctx.font = '100 30px normal';
    ctx.fillText(time, 80, 10);
    if (combo < 3 && !t.game.chart.judger.auto) return;
    ctx.textAlign = 'center';
    ctx.font = '100 70px normal';
    // 连击数
    ctx.fillText(`${combo}`, canvas.width / 2, 10);
    ctx.font = '100 50px normal';
    if (t.game.chart.judger.auto)
        ctx.fillText(`autoplay`, canvas.width / 2, 60);
    else ctx.fillText(`combo`, canvas.width / 2, 60);
    ctx.restore();
}

function drawTap(this: Renderer, note: BaseNote<'tap'>) {
    drawNonHold.call(this, note, '#00d2eb');
}

function drawDrag(this: Renderer, note: BaseNote<'drag'>) {
    drawNonHold.call(this, note, '#f500d6');
}

function drawHold(this: Renderer, note: BaseNote<'hold'>) {}

function drawNonHold(
    this: Renderer,
    note: BaseNote<'tap' | 'drag'>,
    fillColor: string
) {
    if (note.destroyed) return;
    if (
        utils.has(note.noteTime) &&
        this.game.time > note.noteTime + note.missTime
    )
        return;
    if (!note.inited) return;

    const [x, y, d] = note.calPosition();
    if (isNaN(x)) return;
    if (!this.inGame(x, y, this.game.drawWidth / 2)) return;

    const rad = note.rad + (note.angle * Math.PI) / 180;
    const ctx = this.game.ctx;
    const hw = this.game.halfWidth;
    const htw = this.game.halfTopWidth;
    const hh = this.game.halfHeight;
    const style = this.game.multiStroke;
    const alpha = note.custom.opacity;

    ctx.save();
    ctx.translate(x * this.game.scale, y * this.game.scale);
    ctx.rotate(rad + Math.PI / 2);
    ctx.filter = note.ctxFilter;
    // 绘制
    ctx.strokeStyle = '#fff';
    ctx.fillStyle = fillColor;
    ctx.lineWidth = 4 * this.game.drawScale;
    if (note.multi) {
        ctx.shadowColor = 'gold';
        ctx.strokeStyle = style;
    }
    ctx.globalAlpha = alpha;
    if (d < note.base.custom.radius) {
        ctx.globalAlpha = (d / note.base.custom.radius) * alpha;
    }
    ctx.beginPath();
    ctx.moveTo(-hw, 0);
    ctx.lineTo(-htw, -hh);
    ctx.lineTo(htw, -hh);
    ctx.lineTo(hw, 0);
    ctx.lineTo(htw, hh);
    ctx.lineTo(-htw, hh);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // 恢复画布属性
    ctx.restore();
}

function drawBase(this: Renderer, base: Base) {
    if (!this.inGame(base.x, base.y)) return;
    if (!base.inited) return;
    const rad = base.calRad() + (base.angle * Math.PI) / 180;

    let id = '';
    if (base.id.endsWith('-j')) id = 'base1.png';
    if (base.id.endsWith('-i1')) id = 'base2.png';
    if (base.id.endsWith('-i2')) id = 'base3.png';
    const img = image[id];
    if (!img) return;

    const ctx = this.game.ctx;
    const scale = this.game.scale;
    const x = base.x * scale,
        y = base.y * scale;
    const radius = base.custom.radius * scale;
    const { a } = base.custom;

    ctx.save();
    ctx.translate(x, y);
    if (id !== 'base1.png') ctx.rotate(rad + Math.PI);
    if (base.ctxFilter.length > 0) ctx.filter = base.ctxFilter;
    ctx.globalAlpha = a;
    ctx.drawImage(img, -radius, -radius, radius * 2, radius * 2);
    ctx.restore();
}

function globalEffect(camera: Camera) {
    const ctx = camera.target;
    const scale = camera.game.scale;
    const dx = 960 * scale;
    const dy = 540 * scale;
    const x = camera.x * scale;
    const y = camera.y * scale;
    ctx.translate(-x + dx, -y + dy);
    ctx.rotate((camera.angle * Math.PI) / 180);
    ctx.scale(camera.size, camera.size);
    ctx.translate(-dx, -dy);

    if (!highPerformance) {
        ctx.shadowBlur = 4;
        ctx.shadowColor = 'black';
    }
}
