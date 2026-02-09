import { useEffect, useState } from "react";
import { getWatchlist } from "../lib/stocksApi";

export default function WatchlistTiles() {
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
          const up = (q.change ?? 0) >= 0;
          return (
            <div
              key={symbol}
              style={{
                border: "1px solid rgba(255,255,255,0.15)",
                borderRadius: 12,
                padding: 12,
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>{symbol}</strong>
                <span>{q.time ? new Date(q.time).toLocaleTimeString() : ""}</span>
              </div>

              <div style={{ fontSize: 26, marginTop: 8 }}>
                ${Number(q.current).toFixed(2)}
              </div>

              <div style={{ marginTop: 6 }}>
                <span style={{ fontWeight: 600 }}>
                  {up ? "▲" : "▼"} {Number(q.change).toFixed(2)}
                </span>{" "}
                <span>
                  ({Number(q.changePercent).toFixed(2)}%)
                </span>
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
