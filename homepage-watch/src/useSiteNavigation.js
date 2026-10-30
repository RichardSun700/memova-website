import { useEffect, useRef, useState } from "react";

const chapters = [
  ["top", null],
  ["watch-demo", "experience"],
  ["privacy", "privacy"],
  ["experience", "experience"],
  ["possibilities", "pro"],
  ["pro", "pro"],
];

export function useSiteNavigation() {
  const headerRef = useRef(null);
  const [activeNav, setActiveNav] = useState(null);

  useEffect(() => {
    let frame = null;
    let mounted = true;
    const update = () => {
      frame = null;
      if (!mounted || !headerRef.current) return;
      const header = headerRef.current;
      const marker = header.offsetHeight + Math.min(180, window.innerHeight * 0.22);
      let next = null;
      for (const [id, nav] of chapters) {
        const node = document.getElementById(id);
        if (node && node.getBoundingClientRect().top <= marker) next = nav;
      }
      const travel = document.documentElement.scrollHeight - window.innerHeight;
      const progress = travel > 0 ? Math.max(0, Math.min(1, window.scrollY / travel)) : 0;
      header.style.setProperty("--page-progress", progress.toFixed(4));
      header.dataset.scrolled = String(window.scrollY > 12);
      setActiveNav(previous => previous === next ? previous : next);
    };
    const schedule = () => {
      if (mounted && frame === null) frame = requestAnimationFrame(update);
    };
    const observer = new ResizeObserver(schedule);
    observer.observe(document.body);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
    document.fonts.ready.then(schedule);
    schedule();
    return () => {
      mounted = false;
      if (frame !== null) cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  return { headerRef, activeNav };
}
