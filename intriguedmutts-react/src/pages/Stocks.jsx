import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import WatchlistTiles from "../components/WatchlistTiles";
import StockQuoteTest from "../components/StockQuoteTest";

const TABS = [
  { key: "watchlist", title: "Watchlist", desc: "Saved tickers + alerts" },
  { key: "heatmap", title: "52-week heatmap", desc: "Closest to the lows" },
  { key: "packs", title: "Pack picks", desc: "Notes + conviction list" },
];

export default function Stocks() {
  const [tab, setTab] = useState("watchlist");

  // Optional: allow /stocks#heatmap deep links
  useEffect(() => {
    const h = (window.location.hash || "").replace("#", "");
    if (h && TABS.some((t) => t.key === h)) setTab(h);
  }, []);

  useEffect(() => {
    window.location.hash = tab;
  }, [tab]);

  return (
    <div style={{ padding: 24 }}>
      <Link
        to="/home"
        style={{
          display: "inline-block",
          marginBottom: 14,
          padding: "10px 14px",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.18)",
          background: "rgba(255,255,255,0.05)",
          textDecoration: "none",
          color: "inherit",
          fontWeight: 700,
          cursor: "pointer",
        }}
      >
        ← Back Home
      </Link>
      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 12, letterSpacing: 3, opacity: 0.7 }}>
          COMING SOON
        </div>
        <h1 style={{ fontSize: 44, margin: "6px 0 6px", fontWeight: 900 }}>
          INTRIGUED STOCKS
        </h1>
        <p style={{ opacity: 0.8, marginTop: 0 }}>
          Watchlist, 52-week lows, scanners, and pack picks — powered by your Worker.
        </p>
      </div>

      {/* Clickable cards */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 14,
          margin: "18px 0 26px",
        }}
      >
        {TABS.map((t) => {
          const active = tab === t.key;
          return (
            <div
              key={t.key}
              role="button"
              tabIndex={0}
              onClick={() => setTab(t.key)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") setTab(t.key);
              }}
              style={{
                textAlign: "left",
                cursor: "pointer",
                padding: 16,
                borderRadius: 14,
                userSelect: "none",
                border: active
                  ? "2px solid rgba(255,255,255,0.55)"
                  : "1px solid rgba(255,255,255,0.18)",
                background: active
                  ? "rgba(255,255,255,0.10)"
                  : "rgba(255,255,255,0.04)",
              }}
            >
              <div style={{ fontWeight: 800, fontSize: 16 }}>{t.title}</div>
              <div style={{ opacity: 0.8, marginTop: 6, fontSize: 13 }}>{t.desc}</div>
            </div>
          );
        })}
      </div>

      {/* View switch */}
      {tab === "watchlist" && (
        <div>
          <StockQuoteTest symbol="AAPL" />
          <WatchlistTiles />
        </div>
      )}

      {tab === "heatmap" && (
        <div style={{ padding: 16, border: "1px solid rgba(255,255,255,0.15)", borderRadius: 14 }}>
          <h2 style={{ marginTop: 0 }}>52-week heatmap</h2>
          <p style={{ opacity: 0.8, marginBottom: 0 }}>
            Next step: we’ll add a Worker endpoint that returns 52-week high/low + “distance to low”
            for your watchlist, then render it here as a heatmap/sorted list.
          </p>
        </div>
      )}

      {tab === "packs" && (
        <div style={{ padding: 16, border: "1px solid rgba(255,255,255,0.15)", borderRadius: 14 }}>
          <h2 style={{ marginTop: 0 }}>Pack picks</h2>
          <p style={{ opacity: 0.8, marginBottom: 0 }}>
            Next step: we’ll store pack notes (and your conviction list) in KV/D1 and render it here.
          </p>
        </div>
      )}
    </div>
  );
}
