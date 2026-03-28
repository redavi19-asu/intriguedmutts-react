import { useEffect, useRef } from "react";
import { canUsePreferences } from "../lib/consent";

export default function TradingViewAdvancedChart({ symbol }) {
  const ref = useRef(null);
  const canLoadWidget = canUsePreferences();

  useEffect(() => {
    if (!ref.current || !symbol || !canLoadWidget) return;

    // clear old widget
    ref.current.innerHTML = "";

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;

    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol,
      interval: "D",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      allow_symbol_change: true,
      support_host: "https://www.tradingview.com",
    });

    ref.current.appendChild(script);
  }, [symbol, canLoadWidget]);

  if (!canLoadWidget) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "grid",
          placeItems: "center",
          color: "rgba(255,255,255,0.75)",
          textAlign: "center",
          padding: 18,
        }}
      >
        Enable Preferences Cookies to load the live TradingView widget.
      </div>
    );
  }

  return <div ref={ref} style={{ width: "100%", height: "100%" }} />;
}
