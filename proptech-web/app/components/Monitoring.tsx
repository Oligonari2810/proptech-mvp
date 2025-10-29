"use client";
import { useEffect } from "react";

type FrontendMetricType = "page_load" | "error" | "click";

interface FrontendMetric {
  type: FrontendMetricType;
  duration?: number; // ms
  path: string;
  component?: string;
}

export function FrontendMonitoring() {
  useEffect(() => {
    // Performance (navigation) observer
    const perfObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === "navigation") {
          const metric: FrontendMetric = {
            type: "page_load",
            duration: (entry as PerformanceNavigationTiming).duration,
            path: window.location.pathname,
          };
          sendFrontendMetric(metric);
        }
      }
    });
    try {
      perfObserver.observe({ entryTypes: ["navigation"] });
    } catch {}

    // JS error tracking
    const onError = () => {
      const metric: FrontendMetric = {
        type: "error",
        path: window.location.pathname,
        component: "global",
      };
      sendFrontendMetric(metric);
    };
    window.addEventListener("error", onError);

    return () => {
      try { perfObserver.disconnect(); } catch {}
      window.removeEventListener("error", onError);
    };
  }, []);

  async function sendFrontendMetric(metric: FrontendMetric) {
    try {
      await fetch("/api/metrics/frontend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(metric),
        keepalive: true,
      });
    } catch {
      // silencioso
    }
  }

  return null;
}


