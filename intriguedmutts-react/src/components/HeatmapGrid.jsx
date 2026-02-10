import { useEffect, useState } from "react";
import { fetchHeatmap } from "../lib/stocksApi";

export default function HeatmapGrid() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHeatmap()
      .then((d) => setRows(d.heatmap || []))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Loading heatmap…</div>;

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))",
        gap: 14,
      }}
    >
      {rows.map((r) => {
        const pctFromLow =
          ((r.current - r.low52) / (r.high52 - r.low52)) * 100;

        const heat =
          pctFromLow < 25
            ? "rgba(57,255,20,0.25)"
            : pctFromLow < 60
            ? "rgba(255,215,0,0.25)"
            : "rgba(255,80,80,0.25)";

        return (
          <div
            key={r.symbol}
            style={{
              padding: 16,
              borderRadius: 16,
              background: heat,
              border: "1px solid rgba(255,255,255,0.18)",
            }}
          >
            <div style={{ fontWeight: 900 }}>{r.symbol}</div>
            <div>${r.current}</div>
            <div style={{ fontSize: 12, opacity: 0.8 }}>
              Low: {r.low52} — High: {r.high52}
            </div>
            <div style={{ fontSize: 12 }}>
              {pctFromLow.toFixed(1)}% from range
            </div>
          </div>
        );
      })}
    </div>
  );
}
