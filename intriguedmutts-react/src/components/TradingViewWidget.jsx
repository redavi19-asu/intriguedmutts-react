import React, { useEffect, useRef } from "react";

export default function TradingViewWidget({ symbol }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!symbol || !containerRef.current) return;
    // Clear previous widget
    containerRef.current.innerHTML = "";
    // Create script
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.type = "text/javascript";
    script.async = true;
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol,
      interval: "D",
      theme: "dark",
      style: "1",
      locale: "en",
      allow_symbol_change: true,
      hide_side_toolbar: false,
      container_id: "tv-advanced-chart-container",
    });
    containerRef.current.appendChild(script);
    // Cleanup
    return () => {
      containerRef.current.innerHTML = "";
    };
  }, [symbol]);

  return (
    <div
      ref={containerRef}
      id="tv-advanced-chart-container"
      style={{ width: "100%", height: "100%" }}
    />
  );
}
