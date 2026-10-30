import { ProductDemoVideo } from "./ProductDemoVideo";

export function SearchVideo({ lang, active = true }) {
  return (
    <ProductDemoVideo
      lang={lang} active={active} kind="search"
      src="/assets/video/search-demo-en-v5.mp4?v=bab920de"
      poster="/assets/video/search-demo-en-v5-poster.jpg"
      description={lang === "zh"
        ? "纯英文字幕离线搜索演示：输入记得的词，找到结果，再回到 Cades Cove 原话。"
        : "Offline search with English captions: search remembered words, find a result, and return to the original Cades Cove conversation."}
      caption="From a remembered word to the original conversation."
    />
  );
}
