import { renderToStaticMarkup } from "react-dom/server";
import { AuthProvider } from "../client/src/contexts/AuthContext";
import Journal from "../client/src/pages/Journal";
import JournalArticle from "../client/src/pages/JournalArticle";

// Build the first paint from the same components that take over in the browser.
// This runs in Node, so no user's stored session or account data can enter HTML.
export function renderJournalSnapshot(pathname: string) {
  return renderToStaticMarkup(
    <AuthProvider>
      {pathname === "/journal" ? (
        <Journal />
      ) : (
        <JournalArticle slug={pathname.slice("/journal/".length)} />
      )}
    </AuthProvider>
  );
}
