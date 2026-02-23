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
        gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 18,
      }}
    >
      {rows.map((r) => {
        const pctFromLow52 = ((r.current - r.low52) / (r.high52 - r.low52)) * 100;
        const nearLow52 = r.nearLow52 !== undefined ? r.nearLow52 : pctFromLow52 <= 3;
        const dollars = (val) => Number(val).toFixed(2);
        const percent = (val) => Number(val).toFixed(2);
        return (
          <div
            key={r.symbol}
            style={{
              borderRadius: 18,
              background: "rgba(0,0,0,0.55)",
              padding: 18,
              border: nearLow52
                ? "2px solid #4f0"
                : "1px solid rgba(255,255,255,0.12)",
              boxShadow: nearLow52
                ? "0 0 16px 2px #4f0"
                : "none",
              minHeight: 120,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <div style={{ fontWeight: 600, fontSize: 22 }}>{r.symbol}</div>
            <div style={{ fontSize: 18 }}>${dollars(r.current)}</div>
            <div style={{ fontSize: 14, marginTop: 4 }}>
              {percent(pctFromLow52)}% from 52w low
            </div>
            <div style={{ fontSize: 13, opacity: 0.8, marginTop: 4 }}>
              Day: {dollars(r.dayLow ?? r.low)}–{dollars(r.dayHigh ?? r.high)}
            </div>
            <div style={{ fontSize: 13, opacity: 0.8, marginTop: 2 }}>
              52w: {dollars(r.low52)}–{dollars(r.high52)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
