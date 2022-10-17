import { Base, BaseNote, Mutate } from 'mutate-game';

export function setRenderer(game: Mutate) {
    game.renderer.setNote('tap', drawTap);
    game.renderer.setNote('drag', drawDrag);
    game.renderer.setNote('hold', drawHold);
    game.renderer.setBase(drawBase);
}

function drawTap(note: BaseNote<'tap'>) {}

function drawDrag(note: BaseNote<'drag'>) {}

function drawHold(note: BaseNote<'hold'>) {}

function drawBase(base: Base) {}
