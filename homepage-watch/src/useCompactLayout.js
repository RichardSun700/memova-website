import { useEffect, useState } from "react";

export const COMPACT_LAYOUT_QUERY = "(max-width:849px), (max-width:1000px) and (max-height:500px)";

export function useCompactLayout() {
  const [compact, setCompact] = useState(() =>
    typeof matchMedia !== "undefined" && matchMedia(COMPACT_LAYOUT_QUERY).matches,
  );
  useEffect(() => {
    const media = matchMedia(COMPACT_LAYOUT_QUERY);
    const update = () => setCompact(media.matches);
    update();
    media.addEventListener("change", update);
    return () => media.removeEventListener("change", update);
  }, []);
  return compact;
}
