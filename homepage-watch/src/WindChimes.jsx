import { useCallback, useEffect, useId, useRef, useState } from "react";
import { ArrowUpRight, BookOpen, SpeakerHigh, SpeakerSlash, X } from "@phosphor-icons/react";
import { useChimeMotion } from "./useChimeMotion";
import "./WindChimes.css";

const NOTES = [
  {
    image: "/assets/chimes/breeze-chime.png",
    name: { zh: "慢一点", en: "Slow down" },
    title: { zh: "今天，先慢一点。", en: "Take today a little slower." },
    body: { zh: "先喝一口水，把肩膀放松。今天没做完的事，可以留一件到明天。", en: "Have a sip of water. Let your shoulders settle. One unfinished thing can wait until tomorrow." },
    small: { zh: "现在可以做：离开屏幕一分钟，看一眼窗外。", en: "A small next step: look away from the screen for a minute, and notice the view outside." },
  },
  {
    image: "/assets/chimes/voice-chime.png",
    name: { zh: "好好表达", en: "Find your words" },
    title: { zh: "把话说得更具体。", en: "Say what you need." },
    body: { zh: "如果一句评价让你不舒服，可以先问：“你指的是哪件事？你希望我怎么改进？”", en: "Try asking: “Which part do you mean? What would you like me to improve?”" },
    book: true,
  },
  {
    image: "/assets/chimes/memory-chime.png",
    name: { zh: "留住小事", en: "Keep a small moment" },
    title: { zh: "给今天留一件小事。", en: "Keep one small thing from today." },
    body: { zh: "想一想，今天有没有一个让你松一口气的瞬间？把它写成一句话，就够了。", en: "Was there a moment today when you could breathe a little easier? One sentence is enough to keep it." },
    small: { zh: "比如：“下班后那阵风，很舒服。”", en: "For example: “The breeze on the way home felt good.”" },
  },
];

export function WindChimes({ lang = "zh", active = true, variant = "floating", onNoteChange }) {
  const L = (zh, en) => lang === "zh" ? zh : en;
  const [note, setNote] = useState(null);
  const [soundOn, setSoundOn] = useState(false);
  const [reduced, setReduced] = useState(() =>
    typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const [visible, setVisible] = useState(true);
  const [foreground, setForeground] = useState(() => typeof document === "undefined" || !document.hidden);
  const root = useRef(null);
  const sound = useRef(null);
  const uid = useId().replaceAll(":", "");
  const live = active && visible && foreground;

  const ring = useCallback((index) => {
    const Audio = window.AudioContext || window.webkitAudioContext;
    if (!Audio) return;
    try {
      if (!sound.current || sound.current.state === "closed") sound.current = new Audio();
      const context = sound.current;
      const play = () => {
        if (context.state !== "running") return;
        const now = context.currentTime;
        [1, 2.01, 3.98].forEach((partial, i) => {
          const oscillator = context.createOscillator(), gain = context.createGain();
          oscillator.type = "sine";
          oscillator.frequency.value = [783.99, 880, 1046.5][index] * partial;
          gain.gain.setValueAtTime(0.0001, now);
          gain.gain.exponentialRampToValueAtTime(0.018 / (i + 1) ** 2, now + 0.018);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5 - i * .22);
          oscillator.connect(gain); gain.connect(context.destination);
          oscillator.start(now); oscillator.stop(now + 1.6);
          oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
        });
      };
      if (context.state === "suspended") context.resume().then(play).catch(() => {});
      else play();
    } catch { /* The silent interaction remains available when audio is unavailable. */ }
  }, []);

  const open = useCallback((index) => {
    if (!live) return;
    setNote(index);
    if (soundOn) ring(index);
  }, [live, soundOn, ring]);
  const { refs, handlers, pluck } = useChimeMotion({ count: NOTES.length, active: live, reduced, onTap: open });

  const close = useCallback(() => {
    const previous = note;
    setNote(null);
    if (previous !== null) refs[previous].current?.focus({ preventScroll: true });
  }, [note, refs]);

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(preference.matches);
    const visibility = () => setForeground(!document.hidden);
    preference.addEventListener("change", update);
    document.addEventListener("visibilitychange", visibility);
    // The scroll deck already controls compact chimes through `active`.
    // Observing a child of its moving, clipped panels can report a stale
    // intersection after the panel comes forward and cut a pluck short.
    const observer = variant === "floating"
      ? new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting))
      : null;
    setVisible(true);
    observer?.observe(root.current);
    return () => {
      preference.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", visibility);
      observer?.disconnect();
      sound.current?.close().catch(() => {});
    };
  }, [variant]);
  useEffect(() => { onNoteChange?.(note !== null); }, [note, onNoteChange]);
  useEffect(() => { if (!active) setNote(null); }, [active]);
  useEffect(() => {
    if (live) return;
    sound.current?.suspend().catch(() => {});
  }, [live]);
  useEffect(() => {
    if (note === null) return;
    const escape = (event) => {
      if (event.key === "Escape") { event.preventDefault(); event.stopPropagation(); close(); }
    };
    const outside = (event) => { if (!root.current?.contains(event.target)) setNote(null); };
    document.addEventListener("keydown", escape, true);
    document.addEventListener("pointerdown", outside);
    return () => {
      document.removeEventListener("keydown", escape, true);
      document.removeEventListener("pointerdown", outside);
    };
  }, [note, close]);

  const paper = note === null ? null : NOTES[note];
  return (
    <section ref={root} className={`wind-chimes wind-chimes--${variant}`}
      data-open={note !== null} data-live={live} data-reduced={reduced}
      aria-label={L("My Day 的风铃与小纸条", "My Day wind chimes and little notes")}>
      <div className="wind-chimes-bank">
        {NOTES.map((item, i) => (
          <button key={item.image} ref={refs[i]} {...handlers(i)} className="wind-chime"
            style={{ "--chime-index": i }} type="button" disabled={!active}
            aria-label={L(`轻碰风铃：${item.name.zh}，打开纸条`, `Touch the ${item.name.en} chime to open its note`)}
            aria-expanded={note === i} aria-controls={note === i ? `chime-paper-${uid}` : undefined}
            onClick={(event) => { if (event.detail === 0) { pluck(i, .6); open(i); } }}>
            <img src={item.image} alt="" draggable="false" width="1024" height="1536" />
          </button>
        ))}
      </div>
      <div className="wind-chimes-guide">
        <span>{L("轻碰风铃，展开一张纸条", "Touch a chime. Unfold a little note.")}</span>
        <button type="button" className="wind-chimes-sound" aria-pressed={soundOn}
          aria-label={L(soundOn ? "关闭风铃声音" : "开启风铃声音", soundOn ? "Turn chime sound off" : "Turn chime sound on")}
          onClick={() => { setSoundOn(!soundOn); if (!soundOn) ring(0); }}>
          {soundOn ? <SpeakerHigh size={13} /> : <SpeakerSlash size={13} />}
        </button>
      </div>
      {paper && (
        <div key={note} className="wind-chime-paper" role="dialog" id={`chime-paper-${uid}`}
          aria-labelledby={`chime-title-${uid}`}>
          <button type="button" className="wind-paper-close" onClick={close} aria-label={L("把纸条放回风铃", "Put the note back in its chime")}><X size={15} /></button>
          <span className="wind-paper-eyebrow">{L("给自己的一张小纸条", "A LITTLE NOTE FOR YOU")}</span>
          <h4 id={`chime-title-${uid}`}>{paper.title[lang === "zh" ? "zh" : "en"]}</h4>
          <p>{paper.body[lang === "zh" ? "zh" : "en"]}</p>
          {paper.small && <p className="wind-paper-small">{paper.small[lang === "zh" ? "zh" : "en"]}</p>}
          {paper.book && (
            <a className="wind-paper-book" href="https://nonviolentcommunication.com/product/nvc/" target="_blank" rel="noreferrer">
              <BookOpen size={18} />
              <span><strong>{L("《非暴力沟通》", "Nonviolent Communication")}</strong>
                <small>Marshall B. Rosenberg</small>
                <em>{L("阅读书籍介绍", "Read the book introduction")} <ArrowUpRight size={11} /></em></span>
            </a>
          )}
          <button className="wind-paper-return" type="button" onClick={close}>{L("把纸条放回", "Fold the note away")}</button>
        </div>
      )}
      <span className="wind-chime-announcement" aria-live="polite">{paper ? paper.title[lang === "zh" ? "zh" : "en"] : ""}</span>
    </section>
  );
}
