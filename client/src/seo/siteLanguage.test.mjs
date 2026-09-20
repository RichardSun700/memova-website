import fs from 'node:fs';
import { runInNewContext } from 'node:vm';
import { parseHTML } from 'linkedom';
import { describe, expect, it, vi } from 'vitest';

const source = fs.readFileSync('client/public/brand/site-language.js', 'utf8');
const flush = () => new Promise(resolve => setImmediate(resolve));
function fixture({ url = 'https://memova.ai/', stored, blocked = false } = {}) {
  const { document, window: domWindow } = parseHTML(`<html lang="en"><head><title>Memova</title></head><body>
    <header class="five-header"><a href="/pricing/">Pricing</a><span class="five-account-name">Free</span><memova-language-switch></memova-language-switch></header>
    <main><h1>Your context,<br>finally understood.</h1><p id="allowance">Turn speech into text as you record in Spark. Your 300-minute allowance resets each month.</p><p id="dynamic">HTML Page</p>
    <input value="My own words"><p contenteditable="true">Pricing</p><pre>Pricing</pre><iframe src="/personal-manual/neil-armstrong/"></iframe><img src="/hero.webp"></main></body></html>`);
  const window = {
    addEventListener: document.addEventListener.bind(document),
    removeEventListener: document.removeEventListener.bind(document),
    dispatchEvent: document.dispatchEvent.bind(document),
  };
  const location = new URL(url);
  const data = new Map(stored ? [['memova.site-language.v1', stored]] : []);
  const localStorage = { getItem: key => { if (blocked) throw Error('blocked'); return data.get(key) ?? null; }, setItem: (key, value) => { if (blocked) throw Error('blocked'); data.set(key, value); } };
  const history = { state: { keep: 1 }, replaceState: vi.fn((state, _, path) => { location.href = new URL(path, location).href; }) };
  runInNewContext(source, { window, document, location, history, localStorage, URL,
    HTMLElement: domWindow.HTMLElement, customElements: domWindow.customElements,
    MutationObserver: domWindow.MutationObserver, CustomEvent: domWindow.CustomEvent });
  return { document, window, location, history, data, language: window.MemovaLanguage };
}

describe('shared website language', () => {
  it('switches both ways without replacing media, input values, or authored line breaks', () => {
    const f = fixture();
    const image = f.document.querySelector('img');
    const input = f.document.querySelector('input');
    const iframe = f.document.querySelector('iframe');
    f.document.querySelector('[data-language="zh"]').click();
    expect(f.document.documentElement.lang).toBe('zh-CN');
    expect(f.document.querySelector('h1').innerHTML).toBe('你的经历与想法，<br>终于被理解。');
    expect(f.document.querySelector('#allowance').textContent).toContain('每个月重置');
    expect(f.document.querySelector('pre').textContent).toBe('Pricing');
    expect(f.document.querySelector('[contenteditable]').textContent).toBe('Pricing');
    expect(f.document.querySelector('.five-account-name').textContent).toBe('Free');
    expect(f.document.querySelector('img')).toBe(image);
    expect(f.document.querySelector('input')).toBe(input);
    expect(input.value).toBe('My own words');
    expect(f.document.querySelector('iframe')).toBe(iframe);
    f.document.querySelector('[data-language="en"]').click();
    expect(f.document.querySelector('h1').innerHTML).toBe('Your context,<br>finally understood.');
  });

  it('remembers the selected language across pages and retains unrelated query and hash state', () => {
    const f = fixture({ url: 'https://memova.ai/?manual=start#capture' });
    f.language.setLanguage('zh');
    expect(f.location.searchParams.get('manual')).toBe('start');
    expect(f.location.hash).toBe('#capture');
    expect(f.history.replaceState.mock.calls.at(-1)[0]).toEqual({ keep: 1 });
    const next = fixture({ url: 'https://memova.ai/pricing/', stored: f.data.get('memova.site-language.v1') });
    expect(next.document.documentElement.lang).toBe('zh-CN');
    expect(next.document.querySelector('header a').textContent).toBe('价格与权益');
    expect(fixture({ url: 'https://memova.ai/?lang=en', stored: 'zh' }).language.language).toBe('en');
  });

  it('translates changing tab content and correctly restores the newest source text', async () => {
    const f = fixture({ stored: 'zh' });
    const dynamic = f.document.querySelector('#dynamic');
    dynamic.textContent = "Schedule Neil's follow-up review.";
    await flush();
    expect(dynamic.textContent).toBe('为尼尔安排后续复盘。');
    f.language.setLanguage('en');
    expect(dynamic.textContent).toBe("Schedule Neil's follow-up review.");
    const dialog = f.document.createElement('dialog');
    dialog.innerHTML = '<h2>Your memory, on the go.</h2>';
    f.document.body.append(dialog);
    f.language.setLanguage('zh');
    expect(dialog.textContent).toBe('随身携带你的记忆。');
  });

  it('does no translation traversal for scroll animation attribute changes', async () => {
    const f = fixture({ stored: 'zh' });
    await flush();
    const walk = vi.spyOn(f.document, 'createTreeWalker');
    const main = f.document.querySelector('main');
    for (let i = 0; i < 30; i++) { main.style.transform = `translateX(${i}px)`; main.dataset.scrollProgress = String(i / 30); }
    await flush();
    expect(walk).not.toHaveBeenCalled();
  });

  it('keeps language selection usable when browser storage is blocked and ignores invalid languages', () => {
    const f = fixture({ blocked: true, url: 'https://memova.ai/?lang=fr' });
    expect(f.language.language).toBe('en');
    expect(() => f.language.setLanguage('zh')).not.toThrow();
    expect(f.document.documentElement.lang).toBe('zh-CN');
    f.language.setLanguage('<script>');
    expect(f.language.language).toBe('zh');
  });

  it('translates shared navigation without partially translating an English article', () => {
    const f = fixture({ stored: 'zh', url: 'https://memova.ai/journal/' });
    expect(f.document.querySelector('header a').textContent).toBe('价格与权益');
    expect(f.document.querySelector('h1').textContent).toBe('Your context,finally understood.');
    expect(f.document.documentElement.lang).toBe('en');
  });
});
