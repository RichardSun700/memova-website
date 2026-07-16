import { useEffect } from "react";
import { useLocation } from "wouter";
import { trackAnalyticsPageView } from "./events";

export default function AnalyticsTracker() {
  const [location] = useLocation();

  useEffect(() => {
    const timer = window.setTimeout(trackAnalyticsPageView, 0);
    return () => window.clearTimeout(timer);
  }, [location]);

  return null;
}
