import fs from 'node:fs';
import path from 'node:path';
import { runInNewContext } from 'node:vm';
import { parseHTML } from 'linkedom';
import { describe, expect, it, vi } from 'vitest';

function fixture() {
  const { document, window: domWindow } = parseHTML(`<html data-site-language="zh"><body>
    <section id="social-distribution">
      <div class="memova-social-rail__inner">
        <header class="memova-social-rail__copy"></header>
        <div data-original-editor-parent>
          <div data-share-prototype><select data-share-format><option value="image">Image</option></select></div>
        </div>
        <div class="memova-social-rail__viewport"></div>
      </div>
    </section>
  </body></html>`);
  const queries: Record<string, any> = {};
  const mediaListeners: Record<string, (() => void)[]> = {};
  const languageListeners: (() => void)[] = [];
  const play = vi.fn(() => Promise.resolve());
  const pause = vi.fn();
  const selectPrototype = Object.getPrototypeOf(document.createElement('select'));
  if (!Object.getOwnPropertyDescriptor(selectPrototype, 'value')?.set) {
    // Linkedom omits the native select value setter used by the real browser.
    Object.defineProperty(selectPrototype, 'value', {
      configurable: true,
      get(this: Element) { return (this.querySelector('option[selected]') || this.querySelector('option'))?.getAttribute('value') || ''; },
      set(this: Element, value: string) {
        this.querySelectorAll('option').forEach(option => option.toggleAttribute('selected', option.getAttribute('value') === value));
      },
    });
  }
  // Linkedom parses media as generic elements and has no media playback API.
  const elementPrototype = Object.getPrototypeOf(document.createElement('div'));
  elementPrototype.getBoundingClientRect = () => ({ height: 100, width: 350, top: 0 });
  elementPrototype.play = play;
  elementPrototype.pause = pause;
  elementPrototype.paused = true;
  Object.defineProperty(elementPrototype, 'src', {
    configurable: true,
    get(this: Element) { return this.getAttribute('src') || ''; },
    set(this: Element, value: string) { this.setAttribute('src', value); },
  });
  const window = {
    location: { hash: '' },
    matchMedia: (query: string) => queries[query] ||= {
      matches: query.includes('max-width'),
      addEventListener: (_event: string, callback: () => void) => (mediaListeners[query] ||= []).push(callback),
    },
    addEventListener: vi.fn((event: string, callback: () => void) => {
      if (event === 'memova:languagechange') languageListeners.push(callback);
    }),
  };
  runInNewContext(fs.readFileSync(path.resolve('client/public/social-context-showcase.js'), 'utf8'), {
    document, window,
    IntersectionObserver: class { observe() {} },
    ResizeObserver: class { observe() {} },
    requestAnimationFrame: () => 1,
  });
  const click = (selector: string) => (document.querySelector(selector) as any).click();
  const change = (selector: string, value: string) => {
    const select = document.querySelector(selector) as any;
    select.value = value;
    select.dispatchEvent(new domWindow.Event('change', { bubbles: true }));
  };
  const setMedia = (query: string, matches: boolean) => {
    queries[query].matches = matches;
    mediaListeners[query].forEach(callback => callback());
  };
  const setLanguage = (language: 'en' | 'zh') => {
    document.documentElement.dataset.siteLanguage = language;
    languageListeners.forEach(callback => callback());
  };
  return { document, click, change, setMedia, setLanguage, play, pause };
}

describe('mobile meeting-to-social showcase', () => {
  it('adapts the selected highlight to each platform and requests video only after play', async () => {
    const f = fixture();
    const panels = [...f.document.querySelectorAll('[data-showcase-panel]')];
    const visible = () => panels.filter(panel => !panel.hasAttribute('hidden'));
    const video = f.document.querySelector('[data-showcase-video]')!;
    expect(visible().map(panel => panel.getAttribute('data-showcase-panel'))).toEqual(['x']);
    expect(video.hasAttribute('src')).toBe(false);
    expect(video.getAttribute('preload')).toBe('none');
    expect(f.play).not.toHaveBeenCalled();

    const highlightSelect = f.document.querySelector('[data-mobile-highlight]') as any;
    expect(highlightSelect.value).toBe('training');
    f.change('[data-mobile-highlight]', 'teamwork');
    expect(f.document.querySelector('[data-showcase-copy="quote"]')?.textContent).toContain('协作才真正开始');
    expect(f.document.querySelector('[data-meeting-time]')?.textContent).toBe('08:05');
    f.click('[data-meeting-quote="decisions"]');
    expect(highlightSelect.value).toBe('decisions');
    expect(f.document.querySelector('[data-showcase-copy="quote"]')?.textContent).toContain('每一个判断');
    expect(f.document.querySelector('[data-meeting-time]')?.textContent).toBe('06:38');
    expect(f.document.querySelector('[data-meeting-quote="decisions"]')?.getAttribute('aria-pressed')).toBe('true');
    expect(f.document.querySelector('[data-showcase-copy="xCopy"]')?.textContent).toContain('脚印照片');
    expect(f.document.querySelector('[data-showcase-copy="linkedinCopy"]')?.textContent).toContain('决策过程');
    expect(f.document.querySelector('[data-showcase-copy="otherCopy"]')?.textContent).toContain('POV');

    f.click('[data-showcase-tab="linkedin"]');
    expect(visible().map(panel => panel.getAttribute('data-showcase-panel'))).toEqual(['linkedin']);
    expect(f.document.querySelector('[data-meeting-review]')?.getAttribute('data-showcase-open')).toBe('linkedin');
    f.click('[data-showcase-tab="other"]');
    expect(visible()[0].getAttribute('aria-labelledby')).toBe('social-showcase-tab-other');
    expect(video.hasAttribute('src')).toBe(false);
    f.click('[data-showcase-play]');
    await Promise.resolve();
    expect(video.getAttribute('src')).toContain('apollo-launch-short.mp4');
    expect(f.play).toHaveBeenCalledOnce();
    f.pause.mockClear();
    f.click('[data-showcase-tab="x"]');
    expect(f.pause).toHaveBeenCalled();
  });

  it('keeps disclosures and sources in closed details and restores the desktop layout without duplicate controls', () => {
    const f = fixture();
    const details = f.document.querySelector('.social-context-showcase__mobile-details')!;
    const review = f.document.querySelector('[data-meeting-review]')!;
    const result = f.document.querySelector('[data-meeting-result]')!;
    expect(details).not.toBeNull();
    expect(details.hasAttribute('open')).toBe(false);
    expect(details.textContent).toContain('并非尼尔');
    expect(details.textContent).toContain('NASA');
    expect(details.querySelector('.meeting-social-demo__transcript a')?.getAttribute('href')).toBe('./sources/');
    expect(f.document.querySelector('.social-context-showcase__disclosure > strong')?.textContent).toContain('非尼尔本人的社媒');
    expect(f.document.querySelector('.social-context-showcase__mobile-purpose')?.textContent).toContain('Memova');
    expect(review.closest('[data-mobile-review]')).not.toBeNull();
    expect(result.closest('[data-mobile-review]')).not.toBeNull();

    f.setMedia('(max-width: 760px)', false);
    f.setMedia('(min-width: 1000px)', true);
    expect(review.closest('.meeting-social-demo__actions')).not.toBeNull();
    expect(result.closest('.meeting-social-demo__actions')).not.toBeNull();
    expect(f.document.querySelector('.meeting-social-demo__context > .meeting-social-demo__transcript')).not.toBeNull();
    expect(f.document.querySelector('.social-context-showcase__disclosure > [data-showcase-copy="demoDisclosure"]')).not.toBeNull();
    expect(f.document.querySelectorAll('[data-meeting-review]')).toHaveLength(1);
    expect(f.document.querySelectorAll('[data-meeting-result]')).toHaveLength(1);
    expect([...f.document.querySelectorAll('[data-showcase-panel]')].every(panel => !panel.hasAttribute('hidden'))).toBe(true);
  });

  it('uses shorter first-person drafts only on phones and restores complete desktop copy across topics and languages', () => {
    const f = fixture();
    const copy = (key: string) => f.document.querySelector(`[data-showcase-copy="${key}"]`)!.textContent;
    const keys = ['xCopy', 'linkedinCopy', 'otherCopy'];
    let desktopCharacters = 0;
    let phoneCharacters = 0;
    for (const language of ['en', 'zh'] as const) {
      f.setLanguage(language);
      for (const topic of ['training', 'decisions', 'teamwork']) {
        f.change('[data-mobile-highlight]', topic);
        f.setMedia('(max-width: 760px)', false);
        f.setMedia('(min-width: 1000px)', true);
        const desktopDrafts = keys.map(copy);
        const desktopIntro = copy('intro');
        const desktopQuote = copy('quote');

        f.setMedia('(min-width: 1000px)', false);
        f.setMedia('(max-width: 760px)', true);
        expect(copy('intro')).toBe(language === 'en'
          ? 'Memova captures meeting highlights. Review a draft, then publish.'
          : 'Memova 自动提取会议金句，审核后一键发布。');
        expect(copy('quote')).toBe(desktopQuote);
        keys.forEach((key, index) => {
          const phoneDraft = copy(key);
          expect(phoneDraft.length).toBeLessThan(desktopDrafts[index].length);
          expect(phoneDraft).toMatch(language === 'en' ? /\b(?:I|my|I’m)\b/i : /我/);
          expect(phoneDraft).toContain('#Apollo11 #Memova');
          desktopCharacters += desktopDrafts[index].length;
          phoneCharacters += phoneDraft.length;
        });
        expect(copy('otherCopy')).toMatch(/^POV[:：]/);
        expect(copy('linkedinCopy')).toMatch(language === 'en' ? /debrief/ : /复盘/);
        expect(copy('avatarName')).toMatch(language === 'en' ? /Fictional/ : /假想/);
        expect(copy('xHandle')).toMatch(language === 'en' ? /Not his account/ : /非本人账号/);

        f.setMedia('(max-width: 760px)', false);
        f.setMedia('(min-width: 1000px)', true);
        expect(keys.map(copy)).toEqual(desktopDrafts);
        expect(copy('intro')).toBe(desktopIntro);
        expect(copy('quote')).toBe(desktopQuote);
      }
    }
    expect(phoneCharacters).toBeLessThan(desktopCharacters * 0.75);
  });
});
