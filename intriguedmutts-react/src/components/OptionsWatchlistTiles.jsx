import React, { useEffect, useState } from "react";
import { getQuote } from "../lib/stocksApi";

const SYMBOLS = [
  "F","T","CMCSA","UBER","PFE","NVO","PYPL","CCL","ZM","HIMS","HOOD"
];

export default function OptionsWatchlistTiles() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);
    Promise.all(SYMBOLS.map((s) => getQuote(s)))
      .then((results) => {
        const mapped = SYMBOLS.map((symbol, i) => {
          const q = results[i]?.quote;
          return [
            symbol,
            q && {
              current: q?.current,
              change: q?.change,
              changePercent: q?.changePercent,
              high: q?.high,
              low: q?.low,
              open: q?.open,
              prevClose: q?.prevClose,
              time: q?.time,
            },
          ];
        });
        setEntries(mapped);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message || "Failed to fetch quotes.");
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading options watchlist…</div>;
  if (error) return <div style={{ color: "red" }}>{error}</div>;

  return (
    <div>
      <h2>Options Watchlist</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 18,
          marginTop: 18,
        }}
      >
        {entries.map(([symbol, quote]) => (
          <div
            key={symbol}
            style={{
              borderRadius: 18,
              background: "rgba(0,0,0,0.55)",
              padding: 18,
              border: "1px solid rgba(255,255,255,0.12)",
              minHeight: 120,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            <div style={{ fontWeight: 600, fontSize: 22 }}>{symbol}</div>
            {quote ? (
              <>
                <div style={{ fontSize: 18 }}>
                  ${quote.current} <span style={{ color: quote.change > 0 ? "#4f0" : quote.change < 0 ? "#f44" : "#fff" }}>
                    {quote.change > 0 ? "+" : ""}{quote.change} ({quote.changePercent}%)
                  </span>
                </div>
                <div style={{ fontSize: 12, opacity: 0.6, marginTop: 4 }}>
                  Updated: {quote.time ? new Date(quote.time).toLocaleString() : "—"}
                </div>
              </>
            ) : (
              <div style={{ fontSize: 14, opacity: 0.7 }}>No data</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
