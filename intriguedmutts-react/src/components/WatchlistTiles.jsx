
import { useEffect, useState } from "react";
import { getWatchlist } from "../lib/stocksApi";
import dividendInfo from "../lib/dividendInfo";
import TradingViewAdvancedChart from "./TradingViewAdvancedChart";

// Helper functions for sign and formatting
const signClass = (n) => (n > 0 ? "pos" : n < 0 ? "neg" : "flat");
const fmtSigned = (n, digits = 2) => {
  if (n === null || n === undefined || Number.isNaN(n)) return "--";
  const v = Number(n);
  const s = v > 0 ? "+" : v < 0 ? "" : "";
  return `${s}${v.toFixed(digits)}`;
};

export default function WatchlistTiles({ setSelectedSymbol, activeSymbol, isMobile = false }) {
  const [data, setData] = useState(null);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    getWatchlist()
      .then((d) => mounted && setData(d))
      .catch((e) => mounted && setErr(e.message));
    return () => (mounted = false);
  }, []);

  if (err) return <pre style={{ padding: 16 }}>{err}</pre>;
  if (!data) return <p style={{ padding: 16 }}>Loading watchlist…</p>;

  // Remove MFAD from the watchlist
  const entries = Object.entries(data.watchlist || {}).filter(([symbol]) => symbol !== "MFAD");

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ marginBottom: 12 }}>Watchlist</h2>

      <div
        className="stockTileScroller"
        style={{
          "--stock-card-min": "220px",
          gap: 12,
        }}
      >
        {entries.map(([symbol, q]) => {
          const price = Number(q?.current ?? q?.price ?? q?.last ?? 0);
          const prevClose = Number(q?.prevClose ?? q?.pc ?? 0);
          const change =
            q?.change !== undefined ? Number(q.change) :
            (prevClose ? price - prevClose : 0);
          const changePct =
            q?.changePercent !== undefined ? Number(q.changePercent) :
            (prevClose ? (change / prevClose) * 100 : 0);
          const cls = signClass(change);
          const divInfo = dividendInfo[symbol];
          return (
            <div
              key={symbol}
              className="stockTileCard"
              style={{
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 12,
                padding: 12,
                background: "rgba(0,0,0,0.55)",
                minHeight: 120,
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                cursor: "pointer",
                marginBottom: 4,
                position: "relative",
                isolation: "isolate",
                overflow: "hidden",
              }}
              onClick={() => setSelectedSymbol(symbol)}
              tabIndex={0}
              role="button"
              aria-label={`Open chart for ${symbol}`}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  setSelectedSymbol(symbol);
                }
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", width: "100%" }}>
                <strong style={{ fontWeight: 600, fontSize: 22 }}>{symbol}</strong>
                <span style={{ fontSize: 12 }}>{q.time ? new Date(q.time).toLocaleTimeString() : ""}</span>
              </div>

              <div style={{ fontSize: 26, marginTop: 8, color: "#fff" }}>
                ${Number(price).toFixed(2)}
              </div>

              <div style={{ marginTop: 6, fontWeight: 700, display: "flex", gap: 8, alignItems: "baseline" }}>
                <span style={{ fontSize: 12, opacity: 0.95, color: cls === "pos" ? "#35ff6a" : cls === "neg" ? "#ff3b3b" : "#4aa3ff" }}>
                  {change > 0 ? "▲" : change < 0 ? "▼" : "•"}
                </span>
                <span style={{ fontSize: 14, color: cls === "pos" ? "#35ff6a" : cls === "neg" ? "#ff3b3b" : "#4aa3ff" }}>{fmtSigned(change, 2)}</span>
                <span style={{ fontSize: 14, color: cls === "pos" ? "#35ff6a" : cls === "neg" ? "#ff3b3b" : "#4aa3ff" }}>({fmtSigned(changePct, 2)}%)</span>
              </div>

              <div style={{ marginTop: 10, fontSize: 12, opacity: 0.85 }}>
                H: {q.high} • L: {q.low} • O: {q.open} • PC: {q.prevClose}
              </div>

              {/* Dividend info if available */}
              {divInfo && (
                <div style={{
                  marginTop: 10,
                  fontSize: 13,
                  color: "#ffe082",
                  background: "rgba(250,204,21,0.08)",
                  borderRadius: 8,
                  padding: "6px 10px 5px 10px",
                  fontWeight: 500,
                  lineHeight: 1.5,
                  letterSpacing: 0.1,
                  boxShadow: "0 0 8px 0 rgba(250,204,21,0.10)",
                  border: "1px solid rgba(250,204,21,0.18)",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "flex-start",
                }}>
                  <span>Dividend: <b>${divInfo.annualDividend}</b> / yr</span>
                  <span>Yield: <b>{divInfo.yield}%</b></span>
                  <span>Frequency: <b>{divInfo.frequency}</b></span>
                </div>
              )}

              {isMobile && activeSymbol === symbol && (
                <div className="stockInlineChartPanel stockInlineChartPanelOpen">
                  <div className="stockInlineChartHeader">
                    <span>{symbol} chart</span>
                    <button
                      type="button"
                      className="stockInlineChartClose"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedSymbol(symbol);
                      }}
                    >
                      Close
                    </button>
                  </div>
                  <div className="stockInlineChartBody">
                    <TradingViewAdvancedChart symbol={symbol} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
