import fs from 'node:fs';
import { runInNewContext } from 'node:vm';
import { parseHTML } from 'linkedom';
import { describe, expect, it, vi } from 'vitest';

const source = fs.readFileSync('client/public/scatter-relations.js', 'utf8');

function fixture() {
  const cards = ['page-01', 'explainer-01', 'page-02', 'explainer-02', 'page-03', 'explainer-03', 'page-04', 'explainer-04'];
  const { document, window } = parseHTML(`<html><body><section class="homepage-kb-hero" data-scroll-progress="0"><div class="memova-pair-scatter__stage">${cards.map(id => `<figure data-scatter-card="${id}"><img data-src="/${id}.webp" data-srcset="/${id}-small.webp 640w, /${id}.webp 1280w"></figure>`).join('')}</div></section></body></html>`);
  const hero = document.querySelector('.homepage-kb-hero');
  const stage = document.querySelector('.memova-pair-scatter__stage');
  let stageTop = 0;
  stage.getBoundingClientRect = () => ({ left: 0, top: stageTop, width: 390, height: 844, bottom: stageTop + 844 });
  const rectReads = vi.fn(() => ({ left: 0, top: 0, width: 180, height: 120 }));
  stage.querySelectorAll('figure').forEach(card => { card.getBoundingClientRect = rectReads; });
  stage.setPointerCapture = vi.fn();
  window.innerHeight = 844;
  window.matchMedia = () => ({ matches: false, addEventListener() {} });
  const frames = new Map();
  let frameId = 0;
  runInNewContext(source, {
    document, window, MutationObserver: window.MutationObserver,
    ResizeObserver: class { observe() {} },
    requestAnimationFrame: callback => { frames.set(++frameId, callback); return frameId; },
  });
  const svg = stage.querySelector('svg');
  svg.pauseAnimations = vi.fn();
  svg.unpauseAnimations = vi.fn();
  const flushFrames = () => {
    const pending = [...frames.values()];
    frames.clear();
    pending.forEach(callback => callback());
  };
  const commit = async value => {
    hero.dataset.scrollProgress = String(value);
    await new Promise(resolve => setImmediate(resolve));
    flushFrames();
  };
  return { document, window, hero, stage, svg, rectReads, flushFrames, commit, moveOffscreen: () => { stageTop = -1000; } };
}

describe('homepage scroll-driven astronaut', () => {
  it('reveals the astronaut after a late progress commit without another swipe', async () => {
    const f = fixture();
    f.flushFrames();
    // Safari can finish dispatching scroll before the component commits its new progress.
    f.window.dispatchEvent(new f.window.Event('scroll'));
    f.flushFrames();
    expect(f.document.querySelector('.memova-crew-manual').style.opacity).toBe('0.000');
    await f.commit(0.8);
    expect(f.document.querySelector('.memova-crew-manual').style.opacity).toBe('1.000');
    expect(f.stage.dataset.crewPhase).toBe('active');
    expect(f.document.querySelector('[data-astronaut]').getAttribute('aria-pressed')).toBe('false');
    await f.commit(0.4);
    expect(f.document.querySelector('.memova-crew-manual').style.opacity).toBe('0.000');
  });

  it('defers scene images and pauses invisible SVG work, then batches geometry reads', async () => {
    const f = fixture();
    f.flushFrames();
    expect(f.stage.querySelectorAll('img[src]')).toHaveLength(0);
    expect(f.rectReads).not.toHaveBeenCalled();
    expect(f.svg.pauseAnimations).toHaveBeenCalled();
    await f.commit(0.15);
    expect(f.stage.querySelectorAll('img[data-src]')).toHaveLength(0);
    expect(f.stage.querySelectorAll('img[src]')).toHaveLength(9);
    expect(f.rectReads).not.toHaveBeenCalled();
    await f.commit(0.4);
    expect(f.rectReads).toHaveBeenCalledTimes(8);
    f.moveOffscreen();
    f.window.dispatchEvent(new f.window.Event('scroll'));
    f.flushFrames();
    expect(f.stage.dataset.scatterActive).toBe('false');
    expect(f.rectReads).toHaveBeenCalledTimes(8);
  });

  it('leaves touch gestures available for native vertical scrolling', () => {
    const f = fixture();
    const event = new f.window.Event('pointerdown', { bubbles: true, cancelable: true });
    Object.assign(event, { pointerType: 'touch', pointerId: 1, button: 0, clientX: 200, clientY: 500 });
    f.stage.dispatchEvent(event);
    expect(f.stage.setPointerCapture).not.toHaveBeenCalled();
    expect(f.stage.classList.contains('is-tracing-relations')).toBe(false);
    expect(event.defaultPrevented).toBe(false);
  });
});
