import fs from 'node:fs';
import path from 'node:path';
import { runInNewContext } from 'node:vm';
import { parseHTML } from 'linkedom';
import { describe, expect, it, vi } from 'vitest';

const publicDir = path.resolve('client/public');
function fixture(phone: boolean, body = "<section id='act'></section>") {
  const { document } = parseHTML(`<html><body>${body}</body></html>`);
  const observers: any[] = [];
  const mediaListeners: Record<string, (() => void)[]> = {};
  const queries: Record<string, any> = {};
  const decode = vi.fn(() => Promise.resolve());
  Object.getPrototypeOf(document.createElement('img')).decode = decode;
  const window = {
    innerHeight: 844,
    matchMedia: (query: string) => queries[query] ||= {
      matches: query.includes('max-width') && phone,
      addEventListener: (_event: string, callback: () => void) => (mediaListeners[query] ||= []).push(callback),
    },
    addEventListener: vi.fn(), cancelAnimationFrame: vi.fn(), requestAnimationFrame: vi.fn(() => 1),
  };
  class IntersectionObserver {
    constructor(public callback: (entries: any[]) => void, public options: any) { observers.push(this); }
    observe = vi.fn(); disconnect = vi.fn();
  }
  const execute = (file: string) => runInNewContext(fs.readFileSync(path.join(publicDir, file), 'utf8'), {
    document, window, IntersectionObserver, requestAnimationFrame: window.requestAnimationFrame,
  });
  return { document, window, observers, decode, execute, queries, mediaListeners };
}

describe('mobile reading and loading flow', () => {
  it('defers desktop action artwork until the chapter is near, and loads only the selected output', async () => {
    const f = fixture(false); f.execute('action-connect-integration.js');
    expect(f.decode).not.toHaveBeenCalled();
    expect([...f.document.querySelectorAll('[data-ac-ui],[data-ac-background],[data-ac-cutout]')].every(e => !e.hasAttribute('src'))).toBe(true);
    const near = f.observers.find(o => o.options.rootMargin === '240px 0px');
    near.callback([{isIntersecting:true}]);
    await Promise.resolve();
    expect(f.decode).toHaveBeenCalledTimes(3);
    expect(f.document.querySelector('[data-ac-ui]')?.getAttribute('src')).toContain('html-action-prd');
    (f.document.querySelector('[data-output="email"]') as any).click();
    expect(f.document.querySelector('[data-ac-ui]')?.getAttribute('src')).toContain('email-action-prd');
  });
  it('requests only the product screen on phones, with an explicit full-size link', () => {
    const f = fixture(true); f.execute('action-connect-integration.js');
    expect(f.document.querySelector('.ac-meeting-focus,.ac-stage-background,.ac-input-output-marker')).toBeNull();
    expect(f.decode).not.toHaveBeenCalled();
    f.observers.find(o => o.options.rootMargin === '240px 0px').callback([{isIntersecting:true}]);
    expect(f.decode).toHaveBeenCalledTimes(1);
    expect(f.document.querySelector('[data-ac-open-preview]')?.getAttribute('href')).toContain('html-action-prd');
  });
  it('shows one feedback view on phones, switches explicitly, and restores all chapters on desktop', () => {
    const f = fixture(true,"<section id='share'></section><section id='waitlist'></section>");
    f.execute('context-return-integration.js');
    const chapters = [...f.document.querySelectorAll('[data-return-chapter]')];
    expect(chapters.map(e => e.hasAttribute('hidden'))).toEqual([false,true,true]);
    expect(f.window.requestAnimationFrame).not.toHaveBeenCalled();
    (f.document.querySelector('[data-return-step="1"]') as any).click();
    expect(chapters.map(e => e.hasAttribute('hidden'))).toEqual([true,false,true]);
    (f.document.querySelector('[data-return-keep]') as any).click();
    expect(chapters.map(e => e.hasAttribute('hidden'))).toEqual([true,true,false]);
    f.queries['(max-width: 760px)'].matches = false;
    f.mediaListeners['(max-width: 760px)'][0]();
    expect(chapters.every(e => !e.hasAttribute('hidden'))).toBe(true);
  });
  it('ships the actual phone hero with readable copy before the interaction bundle', () => {
    const { document } = parseHTML(fs.readFileSync(path.resolve('dist/public/index.html'),'utf8'));
    const hero = document.querySelector('#memova-static-snapshot .mobile-knowledge-intro')!;
    expect(hero.querySelector('h1')).not.toBeNull();
    expect(hero.querySelector('.mobile-copy-zh')?.textContent).toBe('理解 Context · 搭建知识库 · 公开构建');
    expect(hero.querySelector('.mobile-intro-manual-link')?.getAttribute('href')).toBe('#social-distribution');
    expect(hero.querySelector('video,iframe')).toBeNull();
    expect(hero.querySelectorAll('img')).toHaveLength(1);
    expect(hero.querySelector('.mobile-intro-art')?.getAttribute('aria-hidden')).toBe('true');
    expect(document.querySelector('link[as="image"]')?.getAttribute('media')).toBe('(min-width: 761px)');
    expect(document.querySelector('script[data-critical-language]')).not.toBeNull();
  });
});
