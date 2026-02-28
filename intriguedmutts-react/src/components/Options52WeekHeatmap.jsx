
import React, { useEffect, useState } from "react";
import { getOptionsHeatmap } from "../lib/stocksApi";
import TradingViewPanel from "./TradingViewPanel";

export default function Options52WeekHeatmap({ setSelectedSymbol, selectedSymbol }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Pass raw ticker to TradingView (no exchange prefix)
  const getTvSymbol = (symbol) => symbol;

  useEffect(() => {
    setLoading(true);
    setError(null);
    getOptionsHeatmap()
      .then((optionsHeatmap) => {
        setData(optionsHeatmap || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch options heatmap.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading options 52-week heatmap…</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <>
      <div>
        <h2>Options 52-week heatmap</h2>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 18,
            marginTop: 18,
          }}
        >
          {data.map((item) => {
            // ...existing code...
            return (
              <div
                key={item.symbol}
                style={{
                  borderRadius: 18,
                  background: "rgba(0,0,0,0.55)",
                  padding: 18,
                  border: item.nearLow52
                    ? "2px solid #4f0"
                    : "1px solid rgba(255,255,255,0.12)",
                  boxShadow: item.nearLow52
                    ? "0 0 16px 2px #4f0"
                    : "none",
                  minHeight: 120,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                  cursor: "pointer",
                }}
                onClick={() => setSelectedSymbol(item.symbol)}
                tabIndex={0}
                role="button"
                aria-label={`Open chart for ${item.symbol}`}
              >
                <div style={{ fontWeight: 600, fontSize: 22 }}>{item.symbol}</div>
                <div style={{ fontSize: 18 }}>${item.current}</div>
                <div style={{ fontSize: 14, marginTop: 4 }}>
                  {item.pctFromLow52}% from 52w low
                </div>
                <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>
                  Day: {item.dayLow}–{item.dayHigh}
                </div>
                <div style={{ fontSize: 13, opacity: 0.8, marginTop: 2 }}>
                  52w: {item.low52}–{item.high52}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      {/* Bottom-docked TradingView panel */}
      <TradingViewPanel
        symbol={selectedSymbol ? getTvSymbol(selectedSymbol) : null}
        onClose={() => setSelectedSymbol(null)}
      />
    </>
  );
}