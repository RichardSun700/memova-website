import fs from 'node:fs';
import path from 'node:path';
import { runInNewContext } from 'node:vm';
import { parseHTML } from 'linkedom';
import { describe, expect, it, vi } from 'vitest';

function fixture(initialPhone = true) {
  const { document } = parseHTML('<html data-site-language="zh"><body><section id="share"></section><section id="waitlist"></section></body></html>');
  const listeners: Record<string, ((event: any) => void)[]> = {};
  const mediaListeners: (() => void)[] = [];
  const phone = { matches: initialPhone, addEventListener: (_event: string, callback: () => void) => mediaListeners.push(callback) };
  const network = { fetch: vi.fn(), XMLHttpRequest: vi.fn(), sendBeacon: vi.fn() };
  const localStorage = { getItem: vi.fn(() => null), setItem: vi.fn(), removeItem: vi.fn() };
  const focus = vi.fn();
  Object.getPrototypeOf(document.createElement('button')).focus = focus;
  const window = {
    innerHeight: 844,
    matchMedia: (query: string) => query.includes('max-width') ? phone : { matches: false, addEventListener: vi.fn() },
    addEventListener: (event: string, callback: (event: any) => void) => (listeners[event] ||= []).push(callback),
    localStorage, fetch: network.fetch, XMLHttpRequest: network.XMLHttpRequest, navigator: { sendBeacon: network.sendBeacon },
  };
  runInNewContext(fs.readFileSync(path.resolve('client/public/context-return-integration.js'), 'utf8'), {
    document, window, localStorage, fetch: network.fetch, XMLHttpRequest: network.XMLHttpRequest,
    requestAnimationFrame: vi.fn(() => 1), setTimeout: vi.fn(),
    MutationObserver: class { observe() {} disconnect() {} },
  });
  const mobile = document.querySelector('[data-return-mobile]')!;
  const click = (action: string) => (mobile.querySelector(`[data-feedback-${action}]`) as any).click();
  const emit = (event: string, detail?: any) => (listeners[event] || []).forEach(callback => callback({ detail }));
  const setDesktop = () => { phone.matches = false; mediaListeners.forEach(callback => callback()); };
  const setPhone = () => { phone.matches = true; mediaListeners.forEach(callback => callback()); };
  const expectNoPersistence = () => {
    Object.values(network).forEach(call => expect(call).not.toHaveBeenCalled());
    expect(localStorage.setItem).not.toHaveBeenCalled();
    expect(localStorage.removeItem).not.toHaveBeenCalled();
  };
  return { document, mobile, click, emit, setDesktop, setPhone, expectNoPersistence, focus };
}

describe('mobile feedback approval demo', () => {
  it('requests the phone illustration only at the phone breakpoint without resetting feedback approval', () => {
    const f = fixture(false);
    const icon = f.mobile.querySelector('img[data-feedback-mobile-src]')!;
    expect(icon.hasAttribute('src')).toBe(false);
    expect(icon.getAttribute('width')).toBe('40');
    expect(icon.getAttribute('height')).toBe('40');
    expect(icon.getAttribute('alt')).toBe('');

    f.setPhone();
    expect(icon.getAttribute('src')).toBe('/demo/icons/memova-book.svg');
    f.click('keep');
    f.setDesktop();
    expect(icon.hasAttribute('src')).toBe(false);
    f.setPhone();
    expect(icon.getAttribute('src')).toBe('/demo/icons/memova-book.svg');
    expect(f.mobile.querySelectorAll('img[data-feedback-mobile-src]')).toHaveLength(1);
    expect(f.mobile.getAttribute('data-feedback-state')).toBe('saved');
    f.expectNoPersistence();
  });

  it('requires a deliberate save and lets the user skip or retry without persisting data', () => {
    const f = fixture();
    const note = () => f.mobile.querySelector('[data-feedback-note]')!.textContent;
    const status = () => f.mobile.querySelector('[data-feedback-status]')!.textContent;
    expect(f.mobile.getAttribute('data-feedback-state')).toBe('pending');
    expect(note()).toContain('等待你确认');
    expect(status()).toContain('尚未保存');
    expect(note()).not.toContain('纳入下一次训练复盘');
    expect(f.mobile.querySelector('[data-feedback-reset]')!.hasAttribute('hidden')).toBe(true);
    expect(f.mobile.querySelector('.return-mobile-disclosure')!.textContent).toContain('非真实回复');
    expect(f.mobile.querySelector('.return-mobile-sources')!.hasAttribute('open')).toBe(false);
    expect(f.mobile.querySelector('.return-mobile-sources a[href="/demo/note-overview/#source"]')).not.toBeNull();

    f.click('keep');
    expect(f.mobile.getAttribute('data-feedback-state')).toBe('saved');
    expect(note()).toContain('纳入下一次训练复盘');
    expect(status()).toContain('示例已保存');
    expect(f.mobile.querySelector('[data-feedback-keep]')!.hasAttribute('hidden')).toBe(true);
    expect(f.mobile.querySelector('[data-feedback-reset]')!.hasAttribute('hidden')).toBe(false);
    expect(f.focus).toHaveBeenCalled();

    f.click('reset');
    expect(f.mobile.getAttribute('data-feedback-state')).toBe('pending');
    f.click('dismiss');
    expect(f.mobile.getAttribute('data-feedback-state')).toBe('dismissed');
    expect(status()).toContain('知识库没有变化');
    expect(note()).toContain('等待你确认');
    f.click('reset');
    expect(f.mobile.getAttribute('data-feedback-state')).toBe('pending');
    expect(status()).toContain('尚未保存');
    f.expectNoPersistence();
  });

  it('requires fresh approval when the source topic or platform changes', () => {
    const f = fixture();
    f.click('keep');
    f.emit('memova:socialexamplechange', { topic: 'training', platform: 'x' });
    expect(f.mobile.getAttribute('data-feedback-state')).toBe('saved');
    f.emit('memova:socialexamplechange', { topic: 'decisions', platform: 'x' });
    expect(f.mobile.getAttribute('data-feedback-state')).toBe('pending');
    expect(f.mobile.querySelector('[data-feedback-quote]')!.textContent).toContain('判断背后的依据');
    expect(f.mobile.querySelector('[data-feedback-note]')!.textContent).toContain('等待你确认');
    f.click('keep');
    f.emit('memova:socialexamplechange', { topic: 'decisions', platform: 'other' });
    expect(f.mobile.getAttribute('data-feedback-state')).toBe('pending');
    expect(f.mobile.querySelector('[data-feedback-source]')!.textContent).toContain('来自视频帖');
    expect(f.mobile.querySelector('[data-feedback-keep]')!.hasAttribute('hidden')).toBe(false);
    f.expectNoPersistence();
  });

  it('updates language without resetting the chosen topic, platform or approval', () => {
    const f = fixture();
    f.emit('memova:socialexamplechange', { topic: 'teamwork', platform: 'linkedin' });
    f.click('keep');
    f.document.documentElement.dataset.siteLanguage = 'en';
    f.emit('memova:languagechange');
    expect(f.mobile.getAttribute('data-feedback-state')).toBe('saved');
    expect(f.mobile.querySelector('[data-feedback-post]')!.textContent).toBe('A footprint on the Moon. A whole team behind it.');
    expect(f.mobile.querySelector('[data-feedback-source] .mobile-copy-en')!.textContent).toBe('From the LinkedIn link post');
    expect(f.mobile.querySelector('[data-feedback-note] .mobile-copy-en')!.textContent).toContain('team handoff lessons');
    f.document.documentElement.dataset.siteLanguage = 'zh';
    f.emit('memova:languagechange');
    expect(f.mobile.getAttribute('data-feedback-state')).toBe('saved');
    expect(f.mobile.querySelector('[data-feedback-post]')!.textContent).toContain('背后是一整个团队');
    expect(f.mobile.querySelector('[data-feedback-note] .mobile-copy-zh')!.textContent).toContain('团队的交接经验');
    f.expectNoPersistence();
  });

  it('restores the original desktop title, three chapters and deferred artwork at the breakpoint', () => {
    const f = fixture();
    const section = f.document.getElementById('return')!;
    const desktopTitle = f.document.getElementById('memova-return-title')!;
    const images = [...section.querySelectorAll('.memova-return-story__layout img')];
    const originalSources = images.map(image => image.getAttribute('data-return-desktop-src'));
    expect(section.getAttribute('aria-labelledby')).toBe('memova-return-mobile-title');
    expect(images).toHaveLength(4);
    expect(originalSources.every(Boolean)).toBe(true);
    expect(images.every(image => !image.hasAttribute('src'))).toBe(true);
    expect(desktopTitle.textContent).toContain('What comes back');

    f.setDesktop();
    expect(section.getAttribute('aria-labelledby')).toBe('memova-return-title');
    expect(f.document.getElementById('memova-return-title')).toBe(desktopTitle);
    const chapters = [...section.querySelectorAll('[data-return-chapter]')];
    expect(chapters).toHaveLength(3);
    expect(chapters.every(chapter => !chapter.hasAttribute('hidden'))).toBe(true);
    expect(images.map(image => image.getAttribute('src'))).toEqual(originalSources);
    expect(section.querySelectorAll('[data-return-step]')).toHaveLength(3);
    f.expectNoPersistence();
  });
});
