import React, { useCallback, useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { WindChimes } from "./WindChimes";

const requestedLang = new URLSearchParams(window.location.search).get("lang");
const lang = requestedLang === "en" ? "en" : "zh";
document.documentElement.lang = lang;
document.title = lang === "en" ? "Memova Wind Chimes" : "Memova 风铃";

function WindChimeWidget() {
  const viewport = useRef(null);
  const [visible, setVisible] = useState(document.visibilityState !== "hidden");
  const [intersecting, setIntersecting] = useState(true);

  const reportNote = useCallback((open) => {
    window.parent.postMessage(
      { type: "memova-wind-chime-size", height: open ? 480 : 204 },
      window.location.origin,
    );
  }, []);

  useEffect(() => {
    reportNote(false);
    const updateVisibility = () => {
      setVisible(document.visibilityState !== "hidden");
    };
    document.addEventListener("visibilitychange", updateVisibility);
    const observer = new IntersectionObserver(([entry]) => {
      setIntersecting(entry.isIntersecting);
    });
    observer.observe(viewport.current);
    return () => {
      document.removeEventListener("visibilitychange", updateVisibility);
      observer.disconnect();
    };
  }, [reportNote]);

  return (
    <div ref={viewport} style={{ width: "100%", height: "100%" }}>
      <WindChimes
        lang={lang}
        active={visible && intersecting}
        variant="floating"
        onNoteChange={reportNote}
      />
    </div>
  );
}

createRoot(document.getElementById("root")).render(<WindChimeWidget />);
