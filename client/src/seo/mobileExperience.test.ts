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
  it('shows readable knowledge and sources on phones without loading configuration screens', () => {
    const f = fixture(true); f.execute('action-connect-integration.js');
    expect(f.document.querySelector('.ac-granola-shell,[data-ac-ui],video,iframe')).toBeNull();
    expect(f.document.querySelectorAll('.ac-knowledge-sources li')).toHaveLength(3);
    expect(f.document.querySelector('.ac-knowledge-finding .mobile-copy-zh')?.textContent).toContain('关联后的发现');
    expect(f.document.querySelector('.ac-knowledge-finding a')?.getAttribute('href')).toBe('/demo/note-overview/#source');
    expect(f.document.querySelector('.ac-knowledge-result')?.getAttribute('href')).toBe('/demo/note-overview/');
    expect(f.document.querySelectorAll('.ac-knowledge-sources img')).toHaveLength(3);
    expect(f.decode).not.toHaveBeenCalled();
    expect(f.document.querySelector('.ac-knowledge-book')?.hasAttribute('src')).toBe(false);
    f.observers.find(o => o.options.rootMargin === '240px 0px').callback([{isIntersecting:true}]);
    expect(f.document.querySelector('.ac-knowledge-book')?.getAttribute('src')).toContain('knowledge-book-mobile.webp');
    expect(f.decode).not.toHaveBeenCalled();
    expect(f.document.querySelector('.ac-mobile-other-outputs,.ac-mobile-continuation')).toBeNull();
  });
  it('rebuilds the chapter at the breakpoint and disconnects the old media observer', () => {
    const f = fixture(true); f.execute('action-connect-integration.js');
    const mobileObserver = f.observers[0];
    f.queries['(max-width: 760px)'].matches = false;
    f.mediaListeners['(max-width: 760px)'][0]();
    expect(mobileObserver.disconnect).toHaveBeenCalledOnce();
    expect(f.document.querySelector('.ac-mobile-knowledge')).toBeNull();
    expect(f.document.querySelectorAll('.ac-output-tab')).toHaveLength(3);
    f.queries['(max-width: 760px)'].matches = true;
    f.mediaListeners['(max-width: 760px)'][0]();
    expect(f.document.querySelector('.ac-granola-shell')).toBeNull();
    expect(f.document.querySelectorAll('#capture')).toHaveLength(1);
  });
  it('ships the actual phone hero with readable copy before the interaction bundle', () => {
    const { document } = parseHTML(fs.readFileSync(path.resolve('dist/public/index.html'),'utf8'));
    const hero = document.querySelector('#memova-static-snapshot .mobile-knowledge-intro')!;
    expect(hero.querySelector('h1')).not.toBeNull();
    const intro = hero.querySelector('.mobile-intro-description .mobile-copy-zh')!.textContent;
    expect(intro).toContain('知识库与社媒内容');
    expect(intro.length).toBeLessThan(30);
    expect(hero.querySelector('.mobile-intro-download')?.getAttribute('href')).toBe('https://apps.apple.com/us/app/memova-ai/id6796284954');
    expect(hero.querySelector('.mobile-intro-steps a[href="#return"] .mobile-copy-zh')?.textContent).toBe('反馈');
    expect(hero.querySelector('video,iframe')).toBeNull();
    expect(hero.querySelectorAll('img')).toHaveLength(1);
    expect(hero.querySelector('.mobile-intro-astronaut')?.getAttribute('aria-hidden')).toBe('true');
    expect(hero.querySelector('.mobile-intro-scenario-note .mobile-copy-zh')?.textContent).toContain('假想演示');
    expect(document.querySelector('link[as="image"]')?.getAttribute('media')).toBe('(min-width: 761px)');
    expect(document.querySelector('script[data-critical-language]')).not.toBeNull();
  });
});
