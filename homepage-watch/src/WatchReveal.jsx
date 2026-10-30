import React, { useEffect, useId, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowRight,
  ArrowCounterClockwise,
  Hand,
} from "@phosphor-icons/react";
import "./WatchDemo.css";

export function WatchReveal({ lang }) {
  const L = (zh, en) => (lang === "zh" ? zh : en);
  const uid = useId().replace(/:/g, "");
  const plane = useRef(null);
  const demo = useRef(null);
  const visited = useRef(new Set());
  const previous = useRef(null);
  const dragging = useRef(false);
  const lightTarget = useRef({ x: 18, y: 51 });
  const lightPosition = useRef({ x: 18, y: 51 });
  const lightFrame = useRef(null);
  const [point, setPoint] = useState({ x: 18, y: 51 });
  const [lightActive, setLightActive] = useState(true);
  const [isDragging, setDragging] = useState(false);
  const [explored, setExplored] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const [showDemo, setShowDemo] = useState(false);
  useEffect(() => () => cancelAnimationFrame(lightFrame.current), []);

  function followLight() {
    const target = lightTarget.current;
    const current = lightPosition.current;
    const next = {
      x: current.x + (target.x - current.x) * 0.34,
      y: current.y + (target.y - current.y) * 0.34,
    };
    const settled =
      Math.abs(target.x - next.x) + Math.abs(target.y - next.y) < 0.04;
    lightPosition.current = settled ? { ...target } : next;
    setPoint(lightPosition.current);
    lightFrame.current = settled ? null : requestAnimationFrame(followLight);
  }

  function move(next) {
    const p = {
      x: Math.max(5, Math.min(95, next.x)),
      y: Math.max(12, Math.min(88, next.y)),
    };
    lightTarget.current = p;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      cancelAnimationFrame(lightFrame.current);
      lightFrame.current = null;
      lightPosition.current = p;
      setPoint(p);
    } else if (lightFrame.current === null) {
      lightFrame.current = requestAnimationFrame(followLight);
    }
    setExplored(true);
    // Count the path through the word, including intermediate positions in a fast drag.
    if (p.y > 28 && p.y < 76) {
      const from =
        previous.current?.y > 28 && previous.current?.y < 76
          ? previous.current.x
          : p.x;
      for (let x = Math.min(from, p.x); x <= Math.max(from, p.x) + 1; x += 3)
        visited.current.add(Math.floor(x / 10));
      if (visited.current.size >= 6) setRevealed(true);
    }
    previous.current = p;
  }
  function pointerPosition(event) {
    const rect = plane.current.getBoundingClientRect();
    move({
      x: ((event.clientX - rect.left) / rect.width) * 100,
      y: ((event.clientY - rect.top) / rect.height) * 100,
    });
  }
  function finishPointer(event) {
    dragging.current = false;
    setDragging(false);
    if (plane.current.hasPointerCapture(event.pointerId))
      plane.current.releasePointerCapture(event.pointerId);
  }
  function openDemo() {
    setShowDemo(true);
    requestAnimationFrame(() =>
      demo.current?.scrollIntoView({
        behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
        block: "start",
      }),
    );
  }
  function reset() {
    cancelAnimationFrame(lightFrame.current);
    lightFrame.current = null;
    lightTarget.current = { x: 18, y: 51 };
    lightPosition.current = { x: 18, y: 51 };
    visited.current.clear();
    previous.current = null;
    setExplored(false);
    setRevealed(false);
    setShowAll(false);
    setShowDemo(false);
    setLightActive(true);
    setPoint({ x: 18, y: 51 });
  }
  const x = point.x * 12,
    y = point.y * 3.6;
  return (
    <section
      className="watch-discovery section-shell"
      id="already-here"
      aria-labelledby="watch-discovery-title"
    >
      <div className="watch-discovery-heading">
        <div>
          <span className="eyebrow">
            {L("无需另买录音硬件", "NO EXTRA RECORDING DEVICE")}
          </span>
          <h2 id="watch-discovery-title">
            {L(
              <>
                最好的 AI 听记产品，
                <br />
                其实就在你身边。
              </>,
              <>
                Your best AI voice recorder
                <br />
                might already be on your wrist.
              </>,
            )}
          </h2>
        </div>
        <p>
          {L(
            <>
              不用再买一台 AI 录音设备。
              <br />
              拖动光点，看看答案是哪件设备。
            </>,
            <>
              You don’t need another AI recorder.
              <br />
              Drag the light to see the device you already have.
            </>,
          )}
        </p>
      </div>
      <div
        className={
          "watch-reveal-card" +
          (revealed ? " is-revealed" : "") +
          (isDragging ? " is-dragging" : "") +
          (!lightActive ? " is-light-dim" : "") +
          (showAll ? " is-answer-visible" : "")
        }
      >
        <div className="watch-reveal-topline">
          <span>
            01 /{" "}
            {L("拖动光点，揭晓设备", "DRAG THE LIGHT TO REVEAL THE DEVICE")}
          </span>
          {revealed ? (
            <button className="watch-reveal-prototype-link" onClick={openDemo}>
              {L("体验手表原型", "Try the Watch demo")}
              <ArrowDown size={14} />
            </button>
          ) : (
            <span className="watch-reveal-gesture">
              <Hand size={14} />
              {L("按住光点，慢慢拖动", "HOLD THE LIGHT. MOVE IT AROUND.")}
            </span>
          )}
        </div>
        <div
          ref={plane}
          className="watch-light-plane"
          style={{ "--light-x": point.x + "%", "--light-y": point.y + "%" }}
          onPointerEnter={() => setLightActive(true)}
          onPointerLeave={() => {
            if (!dragging.current) setLightActive(false);
          }}
          onPointerDown={(event) => {
            if (event.button !== 0) return;
            event.preventDefault();
            dragging.current = true;
            setLightActive(true);
            setDragging(true);
            plane.current.setPointerCapture(event.pointerId);
            pointerPosition(event);
            plane.current
              .querySelector('[role="slider"]')
              ?.focus({ preventScroll: true });
          }}
          onPointerMove={(event) => {
            if (dragging.current) pointerPosition(event);
          }}
          onPointerUp={finishPointer}
          onPointerCancel={finishPointer}
          onLostPointerCapture={() => {
            dragging.current = false;
            setDragging(false);
          }}
        >
          <div className="watch-light-haze" aria-hidden="true" />
          <div className="watch-light-grid" aria-hidden="true" />
          <div className="watch-light-crosshair" aria-hidden="true" />
          <svg
            className="watch-answer-svg"
            viewBox="0 0 1200 360"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id={uid + "-metal"} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#f7fbff" />
                <stop offset=".24" stopColor="#697888" />
                <stop offset=".48" stopColor="#f5f9ff" />
                <stop offset=".56" stopColor="#4b596d" />
                <stop offset=".79" stopColor="#b7c8da" />
                <stop offset="1" stopColor="#293748" />
              </linearGradient>
              <radialGradient
                id={uid + "-spot"}
                gradientUnits="userSpaceOnUse"
                cx={x}
                cy={y}
                r="165"
                gradientTransform={`translate(${x} ${y}) scale(1 .82) translate(${-x} ${-y})`}
              >
                <stop offset="0" stopColor="white" />
                <stop offset=".22" stopColor="white" />
                <stop offset=".57" stopColor="#777" />
                <stop offset="1" stopColor="black" />
              </radialGradient>
              <mask id={uid + "-mask"}>
                <rect
                  width="1200"
                  height="360"
                  fill={showAll ? "white" : `url(#${uid}-spot)`}
                />
              </mask>
              <filter
                id={uid + "-bevel"}
                x="-5%"
                y="-30%"
                width="110%"
                height="160%"
                colorInterpolationFilters="sRGB"
              >
                <feGaussianBlur
                  in="SourceAlpha"
                  stdDeviation="1.2"
                  result="bump"
                />
                <feSpecularLighting
                  in="bump"
                  surfaceScale="7"
                  specularConstant="1.2"
                  specularExponent="28"
                  lightingColor="#e9f2ff"
                  result="specular"
                >
                  <fePointLight x={x} y={y} z="100" />
                </feSpecularLighting>
                <feComposite
                  in="specular"
                  in2="SourceAlpha"
                  operator="in"
                  result="shine"
                />
                <feComposite
                  in="SourceGraphic"
                  in2="shine"
                  operator="arithmetic"
                  k1="0"
                  k2=".32"
                  k3="1.05"
                  k4="0"
                />
              </filter>
            </defs>
            <text
              className="watch-answer-outline"
              x="600"
              y="237"
              textAnchor="middle"
              textLength="1100"
              lengthAdjust="spacingAndGlyphs"
            >
              APPLE WATCH
            </text>
            <g className="watch-answer-lit-layer" mask={`url(#${uid}-mask)`}>
              <text
                className="watch-answer-lit"
                x="600"
                y="237"
                textAnchor="middle"
                textLength="1100"
                lengthAdjust="spacingAndGlyphs"
                fill={`url(#${uid}-metal)`}
                filter={`url(#${uid}-bevel)`}
              >
                APPLE WATCH
              </text>
            </g>
          </svg>
          <div
            className="watch-light-handle"
            role="slider"
            tabIndex={0}
            aria-label={L(
              "拖动光点，探索隐藏的答案",
              "Move the light to explore the hidden answer",
            )}
            aria-describedby="watch-light-instructions"
            onFocus={() => setLightActive(true)}
            onBlur={() => setLightActive(false)}
            aria-valuemin="5"
            aria-valuemax="95"
            aria-valuenow={Math.round(point.x)}
            aria-valuetext={L(
              `光点位置 ${Math.round(point.x)}%，${revealed ? "答案是 Apple Watch" : "继续拖动寻找答案"}`,
              `Light position ${Math.round(point.x)}%. ${revealed ? "The answer is Apple Watch." : "Keep moving to find the answer."}`,
            )}
            onKeyDown={(event) => {
              setLightActive(true);
              const current = lightTarget.current;
              const step = event.shiftKey ? 15 : 5;
              const keys = {
                ArrowLeft: { x: current.x - step, y: current.y },
                ArrowRight: { x: current.x + step, y: current.y },
                ArrowUp: { x: current.x, y: current.y - step },
                ArrowDown: { x: current.x, y: current.y + step },
                Home: { x: 5, y: 51 },
                End: { x: 95, y: 51 },
              };
              if (keys[event.key]) {
                event.preventDefault();
                move(keys[event.key]);
              }
            }}
          >
            <span />
            <i />
            <b className={explored ? "is-hidden" : ""}>
              {L("拖动我", "DRAG ME")}
            </b>
          </div>
        </div>
        <div className="watch-reveal-bottomline">
          <span id="watch-light-instructions">
            {L(
              "拖动光点探索 · 也可使用方向键",
              "DRAG TO EXPLORE · OR USE THE ARROW KEYS",
            )}
          </span>
          <button
            onClick={
              revealed
                ? reset
                : () => {
                    setRevealed(true);
                    setShowAll(true);
                  }
            }
          >
            {revealed ? <ArrowCounterClockwise size={13} /> : null}
            {L(
              revealed ? "重新探索" : "直接揭晓",
              revealed ? "Explore again" : "Reveal the answer",
            )}
          </button>
        </div>
      </div>
      <div
        className={"watch-answer-footer" + (revealed ? " is-revealed" : "")}
        aria-live="polite"
      >
        <div>
          <span className="eyebrow">
            {revealed
              ? "APPLE WATCH + MEMOVA"
              : L("使用你已有的设备", "USE THE DEVICE YOU ALREADY HAVE")}
          </span>
          <p>
            {revealed
              ? L(
                  "在 Apple Watch 上安装 Memova，即可开始记录。",
                  "Install Memova on your Apple Watch to start recording.",
                )
              : L(
                  "用已经戴着的设备录音，少带一件硬件。",
                  "Record with a device you already wear. Carry one less recorder.",
                )}
          </p>
        </div>
        {revealed && (
          <button className="text-link" onClick={openDemo}>
            {L(
              showDemo ? "回到手表体验" : "试试手表上的 Memova",
              showDemo ? "Back to the Watch demo" : "Try Memova on the Watch",
            )}
            <ArrowDown size={17} />
          </button>
        )}
      </div>
      {showDemo && (
        <div ref={demo}>
          <WatchDemo lang={lang} embedded />
        </div>
      )}
    </section>
  );
}

export function WatchDemo({ lang, embedded = false }) {
  const L = (zh, en) => (lang === "zh" ? zh : en);
  const content = (
    <div className="watch-inline-demo">
      <div className="watch-demo-device">
        <iframe
          title={L("Memova 手表交互原型", "Memova interactive Watch prototype")}
          src={"/examples/watch-prototype.html?sample=legacy&lang=" + lang}
          loading="lazy"
        />
      </div>
      <div className="watch-demo-copy">
        <span className="eyebrow">
          {L("01 · 全天记录", "01 · RECORD THROUGHOUT THE DAY")}
        </span>
        <h2 id="watch-capture-title">
          {L(
            <>
              轻点开始录音，
              <br />
              熄屏也继续。
            </>,
            <>
              Tap to record.
              <br />
              Screen off. Still recording.
            </>,
          )}
        </h2>
        <p>
          {L(
            "无需另买录音硬件。用已有的 Apple Watch 记录一天的对话；Memova 可自动识别会议，回到 iPhone 就能按时间查看原话。",
            "Use the Apple Watch you already own. Record conversations throughout your day, with automatic meeting recognition. Review the words by time on iPhone.",
          )}
        </p>
        <ol
          className="watch-demo-guide"
          aria-label={L("手表操作提示", "Watch gesture guide")}
        >
          <li>
            <span>01</span>
            {L(
              "轻点 Logo，开始记录当天对话。",
              "Tap the logo to start recording your conversations.",
            )}
          </li>
          <li>
            <span>02</span>
            {L(
              "屏幕熄灭后，录音依然继续。",
              "Turn off the screen. Recording keeps going.",
            )}
          </li>
          <li>
            <span>03</span>
            {L(
              "回到 iPhone，按时间查看原话。",
              "Come back to iPhone to read the original words.",
            )}
          </li>
        </ol>
        <div className="watch-demo-instruction">
          <span className="status-dot" />
          {L(
            "可交互产品示例 · 试试轻点表盘",
            "INTERACTIVE PRODUCT DEMO · TRY TAPPING THE WATCH",
          )}
        </div>
        <p className="watch-demo-privacy">
          {L(
            "示例演示，不采集真实音频。",
            "A demonstration. No real audio is captured.",
          )}
        </p>
        <a className="text-link" href="#experience">
          {L("查看 iPhone 上的对话记录", "See your conversations on iPhone")}
          <ArrowRight size={16} />
        </a>
      </div>
    </div>
  );

  return embedded ? (
    content
  ) : (
    <section
      className="watch-prototype-section section-shell"
      id="watch-demo"
      data-narrative-block="1"
      aria-labelledby="watch-capture-title"
    >
      {content}
    </section>
  );
}
