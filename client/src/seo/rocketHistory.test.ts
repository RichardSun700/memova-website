import fs from 'node:fs';
import path from 'node:path';
import { runInNewContext } from 'node:vm';
import { parseHTML } from 'linkedom';
import { describe, expect, it, vi } from 'vitest';

const rocketSources = [
  'mercury-redstone', 'mercury-atlas', 'gemini-titan', 'saturn-ib',
  'saturn-v', 'space-shuttle', 'falcon9-crew-dragon', 'sls',
].map(name => `./final-history-assets/rocket-${name}-real-cutout.png`);

function fixture(supportsObserver = true, startsOnPhone = true) {
  const artwork = (phone: boolean) => rocketSources.map(src => `<figure><img ${phone ? 'data-rocket-src' : 'src'}="${src}" loading="lazy" decoding="async" alt=""></figure>`).join('');
  const { document } = parseHTML(`<html><body><article class="five-history-arc">${artwork(startsOnPhone)}</article></body></html>`);
  const arc = document.querySelector('.five-history-arc')!;
  const images = [...arc.querySelectorAll('img')];
  const srcWrites = vi.fn();
  const trackImages = (images: Element[]) => images.forEach(image => {
    const originalSetAttribute = image.setAttribute.bind(image);
    image.setAttribute = (name: string, value: string) => {
      if (name === 'src') srcWrites(value);
      originalSetAttribute(name, value);
    };
    Object.defineProperty(image, 'src', {
      configurable: true,
      get: () => image.getAttribute('src') || '',
      set: (value: string) => image.setAttribute('src', value),
    });
  });
  trackImages(images);
  const observers: any[] = [];
  class IntersectionObserver {
    constructor(public callback: (entries: any[], observer: any) => void, public options: any) { observers.push(this); }
    observe = vi.fn();
    unobserve = vi.fn();
    disconnect = vi.fn();
  }
  const windowListeners: Record<string, (() => void)[]> = {};
  const mediaListeners: (() => void)[] = [];
  const frames: (() => void)[] = [];
  const phoneQuery = {
    matches: startsOnPhone,
    addEventListener: (_event: string, callback: () => void) => mediaListeners.push(callback),
  };
  const window: any = {
    document,
    matchMedia: () => phoneQuery,
    addEventListener: (event: string, callback: () => void) => (windowListeners[event] ||= []).push(callback),
  };
  if (supportsObserver) window.IntersectionObserver = IntersectionObserver;
  runInNewContext(fs.readFileSync(path.resolve('client/public/final-history-arc.js'), 'utf8'), {
    document, window, IntersectionObserver: supportsObserver ? IntersectionObserver : undefined,
    requestAnimationFrame: (callback: () => void) => frames.push(callback),
  });
  return {
    arc, images, srcWrites, observers, windowListeners,
    setPhone(matches: boolean) {
      phoneQuery.matches = matches;
      mediaListeners.forEach(callback => callback());
    },
    flushFrames() { frames.splice(0).forEach(callback => callback()); },
    replaceArc(phone: boolean) {
      const replacement = document.createElement('article');
      replacement.className = 'five-history-arc';
      replacement.innerHTML = artwork(phone);
      const replacementImages = [...replacement.querySelectorAll('img')];
      trackImages(replacementImages);
      document.querySelector('.five-history-arc')!.replaceWith(replacement);
      return { arc: replacement, images: replacementImages };
    },
  };
}

describe('rocket history deferred artwork', () => {
  it('waits until near the footer, loads all eight originals once, and reveals separately', () => {
    const f = fixture();
    const near = f.observers.find(observer => observer.options.rootMargin === '240px 0px');
    const visible = f.observers.find(observer => observer.options.threshold === 0.28);
    expect(f.images).toHaveLength(8);
    expect(f.images.every(image => !image.hasAttribute('src'))).toBe(true);
    expect(f.srcWrites).not.toHaveBeenCalled();
    expect(f.arc.classList.contains('is-visible')).toBe(false);
    expect(near.observe).toHaveBeenCalledWith(f.arc);
    near.callback([{ target: f.arc, isIntersecting: false }], near);
    expect(f.srcWrites).not.toHaveBeenCalled();

    near.callback([{ target: f.arc, isIntersecting: true }], near);
    expect(f.images.map(image => image.getAttribute('src'))).toEqual(rocketSources);
    expect(f.images.every(image => image.getAttribute('loading') === 'lazy' && image.getAttribute('decoding') === 'async')).toBe(true);
    expect(f.srcWrites).toHaveBeenCalledTimes(8);
    expect(f.arc.classList.contains('is-visible')).toBe(false);
    // An already queued observer callback must not reattach the same sources.
    near.callback([{ target: f.arc, isIntersecting: true }], near);
    expect(f.srcWrites).toHaveBeenCalledTimes(8);
    expect(near.disconnect).toHaveBeenCalled();

    visible.callback([{ target: f.arc, isIntersecting: true }], visible);
    expect(f.arc.classList.contains('is-visible')).toBe(true);
    expect(visible.unobserve).toHaveBeenCalledWith(f.arc);
    expect(visible.disconnect).toHaveBeenCalled();
    expect(f.srcWrites).toHaveBeenCalledTimes(8);
  });

  it('loads and shows the original timeline immediately when observation is unavailable', () => {
    const f = fixture(false);
    expect(f.observers).toHaveLength(0);
    expect(f.images.map(image => image.getAttribute('src'))).toEqual(rocketSources);
    expect(f.arc.classList.contains('is-visible')).toBe(true);
    expect(f.srcWrites).toHaveBeenCalledTimes(8);
    (f.windowListeners.load || []).forEach(callback => callback());
    expect(f.srcWrites).toHaveBeenCalledTimes(8);
  });

  it('binds replacement phone footers after each breakpoint and ignores callbacks for removed footers', () => {
    const f = fixture(true, false);
    const originalDesktopReveal = f.observers[0];
    expect(f.observers).toHaveLength(1);
    expect(originalDesktopReveal.options.threshold).toBe(0.28);

    f.setPhone(true);
    const firstPhone = f.replaceArc(true);
    expect(f.observers).toHaveLength(1);
    f.flushFrames();
    expect(originalDesktopReveal.disconnect).toHaveBeenCalledOnce();
    const firstPhoneNear = f.observers[1];
    const firstPhoneReveal = f.observers[2];
    expect(firstPhoneNear.observe).toHaveBeenCalledWith(firstPhone.arc);
    expect(firstPhoneReveal.observe).toHaveBeenCalledWith(firstPhone.arc);
    expect(firstPhone.images.every(image => !image.hasAttribute('src'))).toBe(true);
    firstPhoneNear.callback([{ target: firstPhone.arc, isIntersecting: true }], firstPhoneNear);
    expect(firstPhone.images.map(image => image.getAttribute('src'))).toEqual(rocketSources);
    expect(f.srcWrites).toHaveBeenCalledTimes(8);

    f.setPhone(false);
    const desktop = f.replaceArc(false);
    f.flushFrames();
    expect(firstPhoneNear.disconnect).toHaveBeenCalledTimes(2);
    expect(firstPhoneReveal.disconnect).toHaveBeenCalledOnce();
    const desktopReveal = f.observers[3];
    expect(desktopReveal.observe).toHaveBeenCalledWith(desktop.arc);
    expect(f.observers).toHaveLength(4);
    firstPhoneReveal.callback([{ target: firstPhone.arc, isIntersecting: true }], firstPhoneReveal);
    expect(firstPhone.arc.classList.contains('is-visible')).toBe(false);
    expect(f.srcWrites).toHaveBeenCalledTimes(8);

    f.setPhone(true);
    const secondPhone = f.replaceArc(true);
    f.flushFrames();
    expect(desktopReveal.disconnect).toHaveBeenCalledOnce();
    const secondPhoneNear = f.observers[4];
    const secondPhoneReveal = f.observers[5];
    expect(secondPhoneNear.observe).toHaveBeenCalledWith(secondPhone.arc);
    expect(secondPhone.images.every(image => !image.hasAttribute('src'))).toBe(true);
    firstPhoneNear.callback([{ target: firstPhone.arc, isIntersecting: true }], firstPhoneNear);
    expect(f.srcWrites).toHaveBeenCalledTimes(8);
    secondPhoneNear.callback([{ target: secondPhone.arc, isIntersecting: true }], secondPhoneNear);
    secondPhoneReveal.callback([{ target: secondPhone.arc, isIntersecting: true }], secondPhoneReveal);
    expect(secondPhone.images.map(image => image.getAttribute('src'))).toEqual(rocketSources);
    expect(secondPhone.arc.classList.contains('is-visible')).toBe(true);
    expect(f.srcWrites).toHaveBeenCalledTimes(16);
    (f.windowListeners.load || []).forEach(callback => callback());
    expect(f.observers).toHaveLength(6);
    expect(f.srcWrites).toHaveBeenCalledTimes(16);
  });
});
