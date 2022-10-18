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

export function setRenderer(game: Mutate) {
    // game.renderer.setNote('tap', drawTap);
    // game.renderer.setNote('drag', drawDrag);
    // game.renderer.setNote('hold', drawHold);
    game.renderer.setBase(drawBase);
    game.chart.camera.setGlobalEffects(globalEffect);
}

export function drawInfo(e: RenderEvent<'after'>) {
    const t = e.target as Renderer;
    const ctx = e.ctx;
    const game = t.game;
    const canvas = ctx.canvas;
    ctx.save();
    ctx.textBaseline = 'top';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'right';
    ctx.font = '100 32px normal';
    ctx.fillText(
        game.getScore().toString().padStart(7, '0'),
        canvas.width - 20,
        15
    );
    const combo = game.chart.judger.combo;
    if (combo < 3 && !t.game.chart.judger.auto) return;
    ctx.textAlign = 'center';
    ctx.font = '100 48px normal';
    ctx.fillText(`${combo}`, canvas.width / 2, 10);
    ctx.font = '100 32px normal';
    if (t.game.chart.judger.auto)
        ctx.fillText(`autoplay`, canvas.width / 2, 50);
    else ctx.fillText(`combo`, canvas.width / 2, 50);
    ctx.restore();
}

function drawTap(this: Renderer, note: BaseNote<'tap'>) {
    if (
        utils.has(note.noteTime) &&
        this.game.time > note.noteTime + note.missTime
    )
        return;
    if (note.played) return;
    if (!note.inited) return;

    const [x, y, d] = note.calPosition();
    if (isNaN(x)) return;
    if (!this.inGame(x, y, this.game.drawWidth / 2)) return;

    const rad = note.rad + (note.angle * Math.PI) / 180;
    const ctx = this.game.ctx;
    const hw = this.game.halfWidth;
    const htw = this.game.halfTopWidth;
    const hh = this.game.halfHeight;
    const alpha = note.custom.opacity;

    ctx.save();
    ctx.translate(x * this.game.scale, y * this.game.scale);
    ctx.rotate(rad + Math.PI / 2);
    ctx.filter = note.ctxFilter;
    // 绘制
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4 * this.game.drawScale;
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

function drawDrag(note: BaseNote<'drag'>) {}

function drawHold(note: BaseNote<'hold'>) {}

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
    ctx.rotate(rad + Math.PI);
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
    ctx.translate(dx, dy);
    ctx.rotate((camera.angle * Math.PI) / 180);
    ctx.scale(camera.size, camera.size);
    ctx.translate(-dx, -dy);
    ctx.translate(-x, -y);

    ctx.shadowBlur = 4;
    ctx.shadowColor = 'black';
}
