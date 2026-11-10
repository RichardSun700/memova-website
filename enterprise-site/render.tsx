import { renderToString } from "react-dom/server";
import { EnterpriseRouter } from "./router";
export function render(pathname = "/") {
  return renderToString(<EnterpriseRouter pathname={pathname} />);
}
