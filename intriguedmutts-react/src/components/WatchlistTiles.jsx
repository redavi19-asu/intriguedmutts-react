
import { useEffect, useState } from "react";
import { getWatchlist } from "../lib/stocksApi";

// Helper functions for sign and formatting
const signClass = (n) => (n > 0 ? "pos" : n < 0 ? "neg" : "flat");
const fmtSigned = (n, digits = 2) => {
  if (n === null || n === undefined || Number.isNaN(n)) return "--";
  const v = Number(n);
  const s = v > 0 ? "+" : v < 0 ? "" : "";
  return `${s}${v.toFixed(digits)}`;
};

export default function WatchlistTiles({ setSelectedSymbol }) {
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

  const entries = Object.entries(data.watchlist || {});

  return (
    <div style={{ padding: 16 }}>
      <h2 style={{ marginBottom: 12 }}>Watchlist</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: 12,
        }}
      >
        {entries.map(([symbol, q]) => {
          // ...existing code...
          const price = Number(q?.current ?? q?.price ?? q?.last ?? 0);
          const prevClose = Number(q?.prevClose ?? q?.pc ?? 0);
          const change =
            q?.change !== undefined ? Number(q.change) :
            (prevClose ? price - prevClose : 0);
          const changePct =
            q?.changePercent !== undefined ? Number(q.changePercent) :
            (prevClose ? (change / prevClose) * 100 : 0);
          const cls = signClass(change);
          return (
            <div
              key={symbol}
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
              }}
              onClick={() => setSelectedSymbol(symbol)}
              tabIndex={0}
              role="button"
              aria-label={`Open chart for ${symbol}`}
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
