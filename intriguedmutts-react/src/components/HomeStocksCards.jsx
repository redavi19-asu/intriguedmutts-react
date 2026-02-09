import { useEffect, useState } from "react";
import { getWatchlist } from "../lib/stocksApi";
import { Link } from "react-router-dom";

export default function HomeStocksCards() {
  const [data, setData] = useState(null);

  useEffect(() => {
    let mounted = true;
    getWatchlist().then((d) => mounted && setData(d)).catch(() => {});
    return () => (mounted = false);
  }, []);

  const w = data?.watchlist || {};
  const entries = Object.entries(w);

  const lastTime =
    entries[0]?.[1]?.time ? new Date(entries[0][1].time).toLocaleTimeString() : "—";

  // show a couple tickers as proof-of-life
  const sample = ["JEPQ", "MO", "GAIN"]
    .filter((s) => w[s])
    .map((s) => `${s}: $${Number(w[s].current).toFixed(2)}`)
    .join(" • ");

  const cardStyle = {
    padding: 16,
    borderRadius: 14,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(255,255,255,0.04)",
    cursor: "pointer",
  };

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: 14,
      }}
    >
      <Link to="/stocks-gate?tab=watchlist" style={{ textDecoration: "none", color: "inherit" }}>
        <div style={cardStyle}>
          <div style={{ fontWeight: 900 }}>Watchlist</div>
          <div style={{ opacity: 0.8, marginTop: 6, fontSize: 13 }}>
            {data ? `${entries.length} tickers • updated ${lastTime}` : "Loading…"}
          </div>
          <div style={{ opacity: 0.85, marginTop: 10, fontSize: 12 }}>
            {data ? sample : "—"}
          </div>
        </div>
      </Link>

      <Link to="/stocks-gate#heatmap" style={{ textDecoration: "none", color: "inherit" }}>
        <div style={cardStyle}>
          <div style={{ fontWeight: 900 }}>52-week heatmap</div>
          <div style={{ opacity: 0.8, marginTop: 6, fontSize: 13 }}>
            Live soon: closest-to-low ranking
          </div>
          <div style={{ opacity: 0.6, marginTop: 10, fontSize: 12 }}>
            (Next step adds /basic endpoint)
          </div>
        </div>
      </Link>

      <Link to="/stocks-gate#packs" style={{ textDecoration: "none", color: "inherit" }}>
        <div style={cardStyle}>
          <div style={{ fontWeight: 900 }}>Pack picks</div>
          <div style={{ opacity: 0.8, marginTop: 6, fontSize: 13 }}>
            Notes + conviction list (members later)
          </div>
          <div style={{ opacity: 0.6, marginTop: 10, fontSize: 12 }}>
            (Next step stores picks in KV/D1)
          </div>
        </div>
      </Link>
    </div>
  );
}
