import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState } from "react";
import { ArrowLeft, Check, CheckCircle, Cloud, Sparkle, X } from "@phosphor-icons/react";
import { useCompactLayout } from "./useCompactLayout";
import { CloudOutcomeCover } from "./CloudOutcomeCover";
import "./CloudProcessingDemo.css";

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
  const phaseCallback = useRef(onPhaseChange);
  const sourcePanel = useRef(null);
  const outcomesDialog = useRef(null);
  const outcomesTitleId = useId();
  const compact = useCompactLayout();
  const beforeLayout = useRef(null);
  const layoutAnimations = useRef([]);
  const ready = phase === "ready";
  const mobileResultsOpen = compact && ready;
  const selectedCount = quotes.filter((item) => selected.includes(item.id)).length;

  useLayoutEffect(() => {
    const dialog = outcomesDialog.current;
    if (!mobileResultsOpen || !dialog) return;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
      document.body.style.overflow = previousOverflow;
      const returnTarget = previousFocus?.isConnected && !previousFocus.disabled && previousFocus !== document.body
        ? previousFocus : sourcePanel.current?.querySelector(".cloud-select-all");
      returnTarget?.focus({ preventScroll: true });
    };
  }, [mobileResultsOpen]);

  useEffect(() => { phaseCallback.current = onPhaseChange; }, [onPhaseChange]);
  const changePhase = useCallback((next) => {
    if (phaseRef.current === next) return;
    // Capture the source layout before switching directly between selection and results.
    beforeLayout.current = [introRef?.current, sourcePanel.current].filter(Boolean).map((node) => ({
      node, rect: node.getBoundingClientRect(),
    }));
    layoutAnimations.current.forEach((animation) => animation.cancel());
    layoutAnimations.current = [];
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
    return () => motion.removeEventListener("change", update);
  }, []);

  function changeSelection(update) {
    changePhase("selecting");
    setSelected(update);
  }
  function toggle(id) {
    changeSelection((current) => current.includes(id)
      ? current.filter((value) => value !== id)
      : [...current, id]);
  }
  function reset() {
    setSelected([]);
    changePhase("selecting");
  }
  function process() {
    if (phaseRef.current !== "selecting" || !selectedCount) return;
    changePhase("ready");
  }

  const selectionText = typeof copy.privacySelection === "function"
    ? copy.privacySelection(selectedCount)
    : L(`已选择 ${selectedCount} 段对话`, `${selectedCount} conversations selected`);
  const feedback = ready
    ? L(`${selectedCount} 个示例封面已就绪。`, `${selectedCount} example ${selectedCount === 1 ? "cover is" : "covers are"} ready.`)
    : "\u00a0";

  function resultCards(mobile = false) {
    return quotes.map((item, index) => {
      const result = item.result || {};
      const chosen = selected.includes(item.id);
      const available = ready && chosen;
      const title = translated(result.title, language, translated(item.source, language));
      return (
        <article
          className={`cloud-result-card${chosen ? " is-selected" : " is-unselected"}${available ? " is-ready" : ""}${result.preview ? " has-outcome-preview" : ""}`}
          data-result={result.key}
          style={{ "--cloud-order": index }}
          key={item.id}
          aria-label={available ? L(`示例封面：${title}`, `Example cover: ${title}`)
            : chosen ? title : `${title} · ${L("未选择", "Not selected")}`}
        >
          {result.preview ? (
            <CloudOutcomeCover preview={result.preview} lang={language} image={result.image} alt={translated(result.alt, language)} loading={mobile ? "eager" : "lazy"} />
          ) : (
            <span className="cloud-result-image">
              {result.image && <img src={result.image} alt={translated(result.alt, language)} loading={mobile ? "eager" : "lazy"} />}
            </span>
          )}
          <span className="cloud-result-copy">
            <span className="cloud-result-label">{translated(result.label, language)}</span>
            <strong>{title}</strong>
            <span className="cloud-result-status">
              {chosen ? L("示例成果", "Example outcome") : L("未选择", "Not selected")}
            </span>
          </span>
        </article>
      );
    });
  }

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
        <div className="lower-choice-list">
          {quotes.map((item, index) => {
            const chosen = selected.includes(item.id);
            return (
              <label
                className={`lower-choice-row${chosen ? " is-selected" : ""}`}
                key={item.id}
                style={{ "--cloud-order": index }}
              >
                <input
                  type="checkbox"
                  checked={chosen}
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
              : copy.privacyChoose || L("处理所选", "Process selected")}
          </button>
          <button className="lower-text-button" type="button" onClick={reset}
            disabled={!selectedCount && phase === "selecting"}>
            {copy.privacyReset || L("重新选择", "Choose again")}
          </button>
          <button className="lower-text-button cloud-select-all" type="button" disabled={!quotes.length}
            onClick={() => changeSelection(selectedCount === quotes.length ? [] : quotes.map((item) => item.id))}>
            {selectedCount === quotes.length && quotes.length
              ? L("取消全选", "Clear selection") : L("全选", "Select all")}
          </button>
        </div>
        <p className="lower-choice-feedback" role="status" aria-live="polite" aria-atomic="true">{feedback}</p>
      </div>
      {!compact && <aside className="cloud-result-region" aria-hidden={!ready}>
        <div className="cloud-result-stack">
          <p className="cloud-results-heading">{L("示例成果", "EXAMPLE OUTCOMES")}</p>
          {resultCards()}
        </div>
      </aside>}
      {mobileResultsOpen && (
        <dialog
          ref={outcomesDialog}
          className="cloud-mobile-outcomes"
          aria-labelledby={outcomesTitleId}
          onCancel={(event) => { event.preventDefault(); reset(); }}
        >
          <header className="cloud-mobile-outcomes-header">
            <div>
              <span className="cloud-mobile-outcomes-eyebrow"><CloudSymbol size={16} />{L("所选对话 → 示例网页", "SELECTED WORDS → EXAMPLE PAGES")}</span>
              <h3 id={outcomesTitleId}>{L("你的示例成果", "Your example pages")}</h3>
              <p role="status" aria-live="polite" aria-atomic="true">{feedback}</p>
            </div>
            <button type="button" className="cloud-mobile-outcomes-close" onClick={reset} aria-label={L("关闭成果，重新选择", "Close outcomes and choose again")}><X size={19} /></button>
          </header>
          <div className="cloud-result-stack">
            {resultCards(true)}
          </div>
          <footer className="cloud-mobile-outcomes-footer">
            <button type="button" className="cloud-mobile-outcomes-back" onClick={reset}><ArrowLeft size={16} />{copy.privacyReset || L("重新选择", "Choose again")}</button>
            <p>{L("仅为示例演示，不上传内容。", "Demo only. Nothing is uploaded.")}</p>
          </footer>
        </dialog>
      )}
    </div>
  );
}
