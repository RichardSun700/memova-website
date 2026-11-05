import { useLocation } from "wouter";
import SiteHeader from "@/components/SiteHeader";

// Keep older marketing pages on the same navigation as the current homepage.
export default function Navbar() {
  const [location] = useLocation();
  const current = location.replace(/\/$/, "") === "/mcp" ? "mcp" : "";
  return <SiteHeader current={current} />;
}
