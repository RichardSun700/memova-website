import { createRoot } from "react-dom/client";
import { EnterpriseRouter } from "./router";
import "./site.css";

createRoot(document.getElementById("root")!).render(
  <EnterpriseRouter pathname={window.location.pathname} />
);
