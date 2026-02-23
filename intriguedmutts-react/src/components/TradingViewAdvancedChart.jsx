import { useEffect, useRef } from "react";

export default function TradingViewAdvancedChart({ symbol }) {
  const ref = useRef(null);

  useEffect(() => {
    if (!ref.current || !symbol) return;

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
  }, [symbol]);

  return <div ref={ref} style={{ width: "100%", height: "100%" }} />;
}
