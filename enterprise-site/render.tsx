import { renderToString } from "react-dom/server";
import Enterprise from "../client/src/pages/Enterprise";
export function render() {
  return renderToString(<Enterprise />);
}
