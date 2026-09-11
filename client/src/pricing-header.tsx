import { createRoot } from "react-dom/client";
import SiteHeader from "@/components/SiteHeader";
import { AuthProvider } from "@/contexts/AuthContext";

// Keep the authored pricing content static while sharing the complete header.
const container = document.getElementById("site-header-root");
if (container) {
  createRoot(container).render(
    <AuthProvider>
      <SiteHeader current="pricing" />
    </AuthProvider>
  );
}
