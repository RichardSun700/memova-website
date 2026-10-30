import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { Check, CheckCircle, Cloud, Sparkle } from "@phosphor-icons/react";
import "./CloudProcessingDemo.css";

const isBusy = (phase) => phase === "moving" || phase === "processing";
const translated = (value, lang, fallback = "") =>
  typeof value === "string" ? value : value?.[lang] || value?.zh || value?.en || fallback;

function CloudSymbol({ size = 23 }) {
  return (
    <span className="cloud-processing-symbol" aria-hidden="true">
      <Cloud size={size} weight="regular" />
      <Sparkle size={Math.round(size * 0.5)} weight="fill" />
    </span>
  );
}

export function CloudProcessingDemo({
  lang = "zh",
  copy = {},
  quotes = [],
  introRef,
  onPhaseChange,
}) {
  const language = lang === "en" ? "en" : "zh";
  const L = (zh, en) => language === "zh" ? zh : en;
  const [selected, setSelected] = useState([]);
  const [phase, setPhase] = useState("selecting");
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const phaseRef = useRef("selecting");
  const timers = useRef([]);
  const run = useRef(0);
  const phaseCallback = useRef(onPhaseChange);
  const sourcePanel = useRef(null);
  const beforeLayout = useRef(null);
  const layoutAnimations = useRef([]);
  const busy = isBusy(phase);
  const ready = phase === "ready";
  const selectedCount = quotes.filter((item) => selected.includes(item.id)).length;

  useEffect(() => { phaseCallback.current = onPhaseChange; }, [onPhaseChange]);
  const cancelTimers = useCallback(() => {
    run.current += 1;
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  }, []);
  const changePhase = useCallback((next) => {
    if (phaseRef.current === next) return;
    if (next === "moving" || next === "selecting") {
      // Read the currently visible positions before the parent repartitions the grid.
      beforeLayout.current = [introRef?.current, sourcePanel.current].filter(Boolean).map((node) => ({
        node, rect: node.getBoundingClientRect(),
      }));
      layoutAnimations.current.forEach((animation) => animation.cancel());
      layoutAnimations.current = [];
    }
    phaseRef.current = next;
    setPhase(next);
    phaseCallback.current?.(next);
  }, [introRef]);

  useLayoutEffect(() => {
    if (reduced) {
      layoutAnimations.current.forEach((animation) => animation.cancel());
      layoutAnimations.current = [];
    }
    const previous = beforeLayout.current;
    beforeLayout.current = null;
    if (!previous || reduced) return;
    layoutAnimations.current = previous.flatMap(({ node, rect }) => {
      const next = node.getBoundingClientRect();
      if (!next.width || !next.height || typeof node.animate !== "function") return [];
      return [node.animate([
        { transformOrigin: "top left", transform: `translate(${rect.left - next.left}px, ${rect.top - next.top}px) scale(${rect.width / next.width}, ${rect.height / next.height})` },
        { transformOrigin: "top left", transform: "none" },
      ], { duration: 760, easing: "cubic-bezier(.22,1,.36,1)" })];
    });
  }, [phase, reduced]);
  useEffect(() => () => layoutAnimations.current.forEach((animation) => animation.cancel()), []);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(motion.matches);
    update();
    motion.addEventListener("change", update);
    return () => {
      motion.removeEventListener("change", update);
      cancelTimers();
    };
  }, [cancelTimers]);
  useEffect(() => {
    if (reduced && isBusy(phaseRef.current)) {
      cancelTimers();
      changePhase("ready");
    }
  }, [reduced, cancelTimers, changePhase]);

  function changeSelection(update) {
    if (isBusy(phaseRef.current)) return;
    cancelTimers();
    changePhase("selecting");
    setSelected(update);
  }
  function toggle(id) {
    changeSelection((current) => current.includes(id)
      ? current.filter((value) => value !== id)
      : [...current, id]);
  }
  function reset() {
    cancelTimers();
    setSelected([]);
    changePhase("selecting");
  }
  function process() {
    if (phaseRef.current !== "selecting" || !selectedCount) return;
    cancelTimers();
    if (reduced) {
      changePhase("ready");
      return;
    }
    const currentRun = run.current;
    // Synchronous notification lets the parent move its whole source panel.
    changePhase("moving");
    timers.current = [
      window.setTimeout(() => {
        if (run.current === currentRun) changePhase("processing");
      }, 650),
      window.setTimeout(() => {
        if (run.current === currentRun) {
          timers.current = [];
          changePhase("ready");
        }
      }, 1600),
    ];
  }

  const selectionText = typeof copy.privacySelection === "function"
    ? copy.privacySelection(selectedCount)
    : L(`已选择 ${selectedCount} 段对话`, `${selectedCount} conversations selected`);
  const feedback = phase === "moving"
    ? L(`正在准备 ${selectedCount} 段所选对话…`, `Preparing ${selectedCount} selected conversations…`)
    : phase === "processing"
      ? L("正在演示云端处理…", "Demonstrating cloud processing…")
      : ready
        ? L(`${selectedCount} 个示例封面已就绪。`, `${selectedCount} example covers are ready.`)
        : "\u00a0";

  return (
    <div className="cloud-processing-demo" data-phase={phase} data-reduced={reduced}>
      <div ref={sourcePanel} className={`lower-choice-panel cloud-source-panel${ready ? " is-prepared" : ""}`}>
        <div className="lower-choice-heading">
          <CloudSymbol />
          <div>
            <h3>{copy.privacyMode || L("使用云端处理以下内容", "Use cloud processing for these conversations")}</h3>
            <p>{copy.privacyModeDescription || L("本地演示，不会上传内容。", "A local demonstration. Nothing is uploaded.")}</p>
          </div>
        </div>
        <div className="lower-choice-list" aria-busy={busy}>
          {quotes.map((item, index) => {
            const chosen = selected.includes(item.id);
            return (
              <label
                className={`lower-choice-row${chosen ? " is-selected" : ""}${busy ? " is-busy" : ""}`}
                key={item.id}
                style={{ "--cloud-order": index }}
              >
                <input
                  type="checkbox"
                  checked={chosen}
                  disabled={busy}
                  onChange={() => toggle(item.id)}
                  aria-label={translated(item.source, language)}
                />
                <span className="lower-choice-content">
                  <span className="lower-choice-source">
                    {translated(item.source, language)}
                    <span>{item.speaker}</span>
                  </span>
                  <q lang="en">{item.quote}</q>
                </span>
                {chosen && (
                  <span className="cloud-ghost-chip" aria-hidden="true">
                    <span>{item.speaker}</span><i /><i />
                  </span>
                )}
              </label>
            );
          })}
        </div>
        <div className="lower-choice-summary">
          <span>
            {ready ? <CheckCircle size={18} aria-hidden="true" /> : <CloudSymbol size={18} />}
            {ready ? L("示例成果已就绪", "Example outcomes ready") : selectionText}
          </span>
          <small>{typeof copy.privacyRemaining === "function"
            ? copy.privacyRemaining(quotes.length - selectedCount)
            : L("仅处理所选内容", "Only selected content is included")}</small>
        </div>
        <div className="lower-choice-actions">
          <button
            className="lower-button lower-choice-confirm"
            type="button"
            disabled={!selectedCount || phase !== "selecting"}
            onClick={process}
          >
            {ready ? <Check size={17} aria-hidden="true" /> : <CloudSymbol size={17} />}
            {ready ? L("示例成果已就绪", "Example outcomes ready")
              : busy ? L("演示处理中…", "Processing demo…")
                : copy.privacyChoose || L("处理所选", "Process selected")}
          </button>
          <button className="lower-text-button" type="button" onClick={reset}
            disabled={!selectedCount && phase === "selecting"}>
            {copy.privacyReset || L("重新选择", "Choose again")}
          </button>
          <button className="lower-text-button cloud-select-all" type="button" disabled={busy || !quotes.length}
            onClick={() => changeSelection(selectedCount === quotes.length ? [] : quotes.map((item) => item.id))}>
            {selectedCount === quotes.length && quotes.length
              ? L("取消全选", "Clear selection") : L("全选", "Select all")}
          </button>
        </div>
        <p className="lower-choice-feedback" role="status" aria-live="polite" aria-atomic="true">{feedback}</p>
      </div>
      <div className="cloud-process-node" aria-hidden="true">
        {ready ? <CheckCircle size={24} weight="light" /> : <CloudSymbol size={25} />}
      </div>
      <aside className="cloud-result-region" aria-hidden={phase === "selecting"} aria-busy={busy}>
        <div className="cloud-result-stack">
          <p className="cloud-results-heading">{L("示例成果", "EXAMPLE OUTCOMES")}</p>
          {quotes.map((item, index) => {
            const result = item.result || {};
            const chosen = selected.includes(item.id);
            const available = ready && chosen;
            const title = translated(result.title, language, translated(item.source, language));
            return (
              <article
                className={`cloud-result-card${chosen ? " is-selected" : " is-unselected"}${available ? " is-ready" : ""}`}
                data-result={result.key}
                style={{ "--cloud-order": index }}
                key={item.id}
                aria-label={available ? L(`示例封面：${title}`, `Example cover: ${title}`)
                  : `${title} · ${chosen ? L("等待示例成果", "Waiting for example outcome") : L("未选择", "Not selected")}`}
              >
                <span className="cloud-result-image">
                  {result.image && <img src={result.image} alt={translated(result.alt, language)} loading="lazy" />}
                </span>
                <span className="cloud-result-copy">
                  <span className="cloud-result-label">{translated(result.label, language)}</span>
                  <strong>{title}</strong>
                  <span className="cloud-result-status">
                    {chosen ? ready ? L("示例成果", "Example outcome") : L("演示处理中", "Processing demo") : L("未选择", "Not selected")}
                  </span>
                </span>
              </article>
            );
          })}
        </div>
      </aside>
    </div>
  );
}
