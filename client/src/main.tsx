import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

installAnalytics();

createRoot(document.getElementById("root")!).render(<App />);

function installAnalytics() {
  const endpoint = import.meta.env.VITE_ANALYTICS_ENDPOINT;
  const websiteId = import.meta.env.VITE_ANALYTICS_WEBSITE_ID;
  if (!endpoint || !websiteId) return;

  const script = document.createElement("script");
  script.defer = true;
  script.src = `${String(endpoint).replace(/\/+$/, "")}/umami`;
  script.dataset.websiteId = websiteId;
  document.head.appendChild(script);
}
