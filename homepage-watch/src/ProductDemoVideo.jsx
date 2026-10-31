import { forwardRef, useEffect, useId, useImperativeHandle, useRef, useState } from "react";
import { ArrowCounterClockwise, ArrowsOutSimple, ListBullets, Pause, Play, SpeakerSlash } from "@phosphor-icons/react";
import { JOURNEY_LANDSCAPE_QUERY, JOURNEY_WIDE_QUERY } from "./useExperienceJourney";

/** Observe the stationary deck, because its cards move through clipped layers. */
export const ProductDemoVideo = forwardRef(function ProductDemoVideo({
  lang, active = true, suspended = false, kind, src, poster, description,
  caption, chapters = [], children,
}, ref) {
  const video = useRef(null);
  const film = useRef(null);
  const stepMenu = useRef(null);
  const pendingSeek = useRef(null);
  const descriptionId = useId();
  const [mediaReady, setMediaReady] = useState(false);
  const [visible, setVisible] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [manualPause, setManualPause] = useState(false);
  const [requestedPlay, setRequestedPlay] = useState(false);
  const [phase, setPhase] = useState(0);
  const [failed, setFailed] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [canExpand, setCanExpand] = useState(() =>
    typeof document !== "undefined" && Boolean(document.fullscreenEnabled || document.createElement("video").webkitEnterFullscreen),
  );
  const [reduced, setReduced] = useState(() =>
    typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches,
  );
  const L = (zh, en) => lang === "zh" ? zh : en;

  useEffect(() => {
    const update = () => setFullscreen(document.fullscreenElement === film.current);
    document.addEventListener("fullscreenchange", update);
    return () => document.removeEventListener("fullscreenchange", update);
  }, []);

  async function expand() {
    setMediaReady(true);
    try {
      if (document.fullscreenElement === film.current) await document.exitFullscreen();
      else if (document.fullscreenEnabled && film.current.requestFullscreen) await film.current.requestFullscreen();
      // iOS requires metadata and a fresh user gesture for native fullscreen.
      // The first tap may only start loading; retain the control for a retry.
      else if (video.current.readyState >= 1) video.current.webkitEnterFullscreen?.();
    } catch {
      setCanExpand(false);
    }
  }

  useEffect(() => {
    // Observe the stationary deck rather than a transformed/hidden chapter.
    // Once requested, keep media mounted so tab changes do not download it again.
    const target = film.current.closest(".journey-sticky") || film.current;
    const observer = new IntersectionObserver((entries) => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      setMediaReady(true);
      observer.disconnect();
    }, { rootMargin: "400px 0px", threshold: 0 });
    observer.observe(target);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const wide = matchMedia(JOURNEY_WIDE_QUERY);
    const landscape = matchMedia(JOURNEY_LANDSCAPE_QUERY);
    let observer;
    let observation = 0;
    const update = () => {
      const generation = ++observation;
      setReduced(preference.matches);
      observer?.disconnect();
      setVisible(false);
      const node = video.current;
      const scrollDriven = wide.matches && !landscape.matches && !preference.matches;
      const target = scrollDriven
        ? node.closest(".journey-sticky") || node
        : node.closest(".product-demo-picture") || node;
      observer = new IntersectionObserver(([entry]) => {
        if (generation === observation)
          setVisible(entry.isIntersecting && (scrollDriven || entry.intersectionRatio >= .2));
      }, { threshold: .2 });
      observer.observe(target);
    };
    preference.addEventListener("change", update);
    wide.addEventListener("change", update);
    landscape.addEventListener("change", update);
    update();
    return () => {
      observation += 1;
      preference.removeEventListener("change", update);
      wide.removeEventListener("change", update);
      landscape.removeEventListener("change", update);
      observer?.disconnect();
    };
  }, []);

  useEffect(() => {
    const node = video.current;
    let cancelled = false;
    const sync = () => {
      node.muted = true;
      if (mediaReady && visible && active && !suspended && !document.hidden && !manualPause && (!reduced || requestedPlay)) {
        node.play().catch(() => { if (!cancelled) setPlaying(false); });
      } else node.pause();
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => { cancelled = true; document.removeEventListener("visibilitychange", sync); node.pause(); };
  }, [src, mediaReady, visible, active, suspended, manualPause, reduced, requestedPlay]);

  useEffect(() => { setFailed(false); setPhase(0); pendingSeek.current = null; }, [src]);
  useEffect(() => { if (!active && stepMenu.current) stepMenu.current.open = false; }, [active]);

  useImperativeHandle(ref, () => ({
    replay() { seek(0); setRequestedPlay(true); setManualPause(false); },
  }), []);

  function seek(time) {
    const next = Number(time);
    if (!Number.isFinite(next) || next < 0) return;
    setMediaReady(true);
    pendingSeek.current = next;
    applyPendingSeek();
  }

  function applyPendingSeek() {
    const node = video.current;
    if (pendingSeek.current === null || !node || node.readyState < 1) return;
    const target = Number.isFinite(node.duration)
      ? Math.min(pendingSeek.current, Math.max(0, node.duration - .01))
      : pendingSeek.current;
    try {
      node.currentTime = target;
      pendingSeek.current = null;
    } catch {
      // A few mobile browsers expose metadata before their seek range is ready.
      // Keep the request for canplay instead of dropping the user's first tap.
    }
  }

  return (
    <div ref={film} className={"search-film product-demo-film product-demo-" + kind} data-demo={kind}>
      <div className="product-demo-picture">
        <video
          ref={video} src={mediaReady ? src : undefined}
          autoPlay={mediaReady && !reduced && active && visible && !manualPause && !suspended}
          muted loop playsInline preload={mediaReady ? "metadata" : "none"} poster={mediaReady ? poster : undefined}
          width="1440" height="810" aria-label={description} aria-describedby={descriptionId}
          onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)}
          onError={() => setFailed(true)}
          onLoadedMetadata={applyPendingSeek} onCanPlay={applyPendingSeek}
          onTimeUpdate={() => {
            const time = video.current.currentTime;
            let next = chapters.reduce((current, item, index) => time >= item.time ? index : current, 0);
            chapters.forEach((item, index) => { if (item.revisitAt != null && time >= item.revisitAt) next = index; });
            setPhase(next);
          }}
        >
          {L("浏览器不支持视频播放。", "Your browser does not support video playback.")}
        </video>
        {typeof children === "function" ? children({ visible }) : children}
        {failed && <p className="product-demo-error" role="status">{L("视频暂时无法播放，可打开完整示例查看。", "The video could not load. Open the complete example instead.")}</p>}
      </div>
      <p className="sr-only" id={descriptionId}>{description}</p>
      <div className="search-film-caption">
        <span><SpeakerSlash size={14} />{caption}</span>
        <div className="product-demo-actions">
          {canExpand && <button className="search-film-toggle product-demo-expand" onClick={expand} disabled={suspended}
            aria-label={L(fullscreen ? "退出全屏演示" : "全屏查看演示", fullscreen ? "Exit fullscreen demo" : "View demo fullscreen")}>
            <ArrowsOutSimple size={14} />{L(fullscreen ? "退出全屏" : "全屏", fullscreen ? "Exit fullscreen" : "Fullscreen")}
          </button>}
          {chapters.length > 0 && (
            <details ref={stepMenu} className="product-demo-step-menu"
              onBlur={(event) => { if (!event.currentTarget.contains(event.relatedTarget)) event.currentTarget.open = false; }}
              onKeyDown={(event) => {
                if (event.key === "Escape") {
                  event.preventDefault(); event.stopPropagation();
                  event.currentTarget.open = false;
                  event.currentTarget.querySelector("summary").focus({ preventScroll: true });
                }
              }}>
              <summary className="search-film-toggle" aria-label={L("选择演示步骤", "Choose a demo step")}>
                <ListBullets size={14} />{L("步骤", "Steps")}
              </summary>
              <div className="product-demo-chapters" role="group" aria-label={L("演示步骤", "Demo steps")}>
                {chapters.map((item, i) => (
                  <button key={item.time} aria-pressed={phase === i} onClick={() => {
                    seek(item.seekTime ?? item.time);
                    stepMenu.current.open = false;
                    stepMenu.current.querySelector("summary").focus({ preventScroll: true });
                  }}>
                    <span>{String(i + 1).padStart(2, "0")}</span>{item.label}
                  </button>
                ))}
              </div>
            </details>
          )}
          <button className="search-film-toggle product-demo-replay" onClick={() => { seek(0); setRequestedPlay(true); setManualPause(false); }} aria-label={L("重播演示", "Replay demo")}>
            <ArrowCounterClockwise size={14} />{L("重播", "Replay")}
          </button>
          <button className="search-film-toggle" onClick={() => {
            if (playing) setManualPause(true);
            else { setMediaReady(true); setRequestedPlay(true); setManualPause(false); }
          }} aria-label={L(playing ? "暂停演示" : "播放演示", playing ? "Pause demo" : "Play demo")}>
            {playing ? <Pause size={13} weight="fill" /> : <Play size={13} weight="fill" />}
            {L(playing ? "暂停" : "播放", playing ? "Pause" : "Play")}
          </button>
        </div>
      </div>
    </div>
  );
});
