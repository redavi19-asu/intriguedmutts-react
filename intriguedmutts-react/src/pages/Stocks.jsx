const darkCard = {
  background: "rgba(0,0,0,0.65)",
  border: "1px solid rgba(255,255,255,0.12)",
  borderRadius: 18,
  boxShadow: "0 0 22px rgba(0,0,0,0.55)",
  backdropFilter: "blur(6px)",
};

import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import WatchlistTiles from "../components/WatchlistTiles";
import HeatmapGrid from "../components/HeatmapGrid";

const TABS = [
  { key: "watchlist", title: "Watchlist", desc: "Saved tickers + quick pulse" },
  { key: "heatmap", title: "52-week heatmap", desc: "Closest to the lows (next)" },
  {
    key: "packs",
    title: "Options Picks",
    desc: "Income + directional contracts (next)",
  },
];

export default function Stocks() {
  const loc = useLocation();
  const nav = useNavigate();

  const tabFromUrl = useMemo(() => {
    return new URLSearchParams(loc.search).get("tab") || "watchlist";
  }, [loc.search]);

  const [tab, setTab] = useState(tabFromUrl);

  // Only update state when the URL actually changes (prevents infinite loops)
  useEffect(() => {
    if (tab !== tabFromUrl) setTab(tabFromUrl);
  }, [tabFromUrl]); // <-- IMPORTANT: only depends on tabFromUrl

  const setTabAndUrl = (next) => {
    setTab(next);

    const params = new URLSearchParams(loc.search);
    params.set("tab", next);

    const nextSearch = params.toString();
    const currentSearch = loc.search.replace(/^\?/, "");

    if (currentSearch !== nextSearch) {
      nav({ pathname: loc.pathname, search: `?${nextSearch}` }, { replace: true });
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `linear-gradient(rgba(0,0,0,0.82), rgba(0,0,0,0.9)), url(${import.meta.env.BASE_URL}stockbackground.png)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        padding: 24,
        color: "#f8f8f8",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          backdropFilter: "blur(2px)",
        }}
      >
      <Link
        to="/home"
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 14,
          padding: "10px 14px",
          borderRadius: 12,
          border: "1px solid rgba(255,255,255,0.18)",
          background: "rgba(255,255,255,0.05)",
          textDecoration: "none",
          color: "inherit",
          fontWeight: 800,
          cursor: "pointer",
        }}
      >
        ← Back Home
      </Link>
      {/* HERO */}
      <div
        style={{
          ...darkCard,
          padding: 22,
          marginBottom: 18,
          color: "#f8f8f8",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <img
            src={`intrigued-mutts-society-transparent.png`}
            alt="Intrigued Mutts Society"
            style={{
              width: 64,
              height: 64,
              objectFit: "contain",
              filter: "drop-shadow(0 0 18px rgba(255,105,180,0.30))",
            }}
          />

          <div>
            <div style={{ fontSize: 12, letterSpacing: 3, opacity: 0.75 }}>
              INTRIGUED MUTTS
            </div>
            <div style={{ fontSize: 40, fontWeight: 950, marginTop: 2, color: "#fff" }}>
              Stocks Dashboard
            </div>
            <div style={{ color: "#bdbdbd", marginTop: 6, maxWidth: 760 }}>
              Live watchlist tiles now. Heatmap + Options Picks next (KV/D1 + scanners).
            </div>
          </div>
        </div>
      </div>

      {/* STRATEGY ACCORDION */}
      <details
        style={{
          ...darkCard,
          border: "1px solid rgba(255,255,255,0.18)",
          marginBottom: 18,
          overflow: "hidden",
        }}
      >
        <summary
          style={{
            cursor: "pointer",
            listStyle: "none",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 14,
            padding: "18px 18px",
            fontWeight: 950,
            fontSize: 18, // bigger
            userSelect: "none",
            letterSpacing: 0.2,
          }}
        >
          <span style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                width: 10,
                height: 10,
                borderRadius: 999,
                background: "hotpink",
                boxShadow: "0 0 16px rgba(255,105,180,0.55)",
              }}
            />
            Why I track these 8 dividend stocks
          </span>

          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              fontSize: 13,
              opacity: 0.85,
              padding: "8px 12px",
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,0.18)",
              background: "rgba(255,255,255,0.03)",
            }}
          >
            Click to expand
            <span style={{ fontSize: 16, lineHeight: 1 }}>▾</span>
          </span>
        </summary>

        <div
          style={{
            padding: "0 18px 18px",
            borderTop: "1px solid rgba(255,255,255,0.10)",
            lineHeight: 1.55,
            opacity: 0.92,
          }}
        >
          <div
            style={{
              padding: 14,
              borderRadius: 14,
              border: "1px solid rgba(57,255,20,0.22)",
              background: "rgba(57,255,20,0.06)",
              marginBottom: 14,
              fontWeight: 800,
            }}
          >
            Strategy: <span style={{ color: "rgba(57,255,20,0.95)" }}>
              Income-first. Track the cash flow. Buy only when value makes sense. Stay consistent.
            </span>
          </div>

          <h3 style={{ margin: "12px 0 6px" }}>Why I watch these 8</h3>
          <p style={{ marginTop: 0 }}>
            I track these eight holdings because they fit a simple goal:
            <strong> steady cash flow (dividends) + long-term compounding</strong>, without having to guess short-term price moves.
            This watchlist is built around income and consistency, not hype.
            I’m not watching these because they’re “guaranteed” or because they always go up —
            I’m watching them because they help me practice an income-first approach and understand how cash flow behaves over time.
          </p>

          <h3 style={{ margin: "14px 0 6px" }}>The watchlist (8 tickers)</h3>
          <ul style={{ marginTop: 6, paddingLeft: 18 }}>
            <li><strong>JEPQ</strong> and <strong>QYLD</strong> — income tools that aim to generate higher distributions.</li>
            <li><strong>O</strong> and <strong>EPR</strong> — real-estate style cash-flow businesses (income-oriented).</li>
            <li><strong>MO</strong> — a high-yield payer (income focused, higher risk).</li>
            <li><strong>AGNC</strong> — mortgage REIT style income (rate-sensitive, can be volatile).</li>
            <li><strong>GLAD</strong> and <strong>GAIN</strong> — BDCs that are often income-focused.</li>
          </ul>

          <h3 style={{ margin: "14px 0 6px" }}>What dividend stocks are (plain English)</h3>
          <p style={{ marginTop: 0 }}>
            A <strong>dividend</strong> is money a company or fund pays out to shareholders.
            If you own shares, you may get paid <strong>monthly</strong> or <strong>quarterly</strong> depending on the stock/fund —
            either as cash you can withdraw or automatically reinvested into more shares (DRIP), depending on your broker settings.
          </p>

          <h3 style={{ margin: "14px 0 6px" }}>Why dividends can be powerful</h3>
          <ul style={{ marginTop: 6, paddingLeft: 18 }}>
            <li><strong>Cash flow:</strong> you can get paid without selling shares.</li>
            <li><strong>Compounding:</strong> reinvesting dividends can grow share count over time.</li>
            <li><strong>Discipline:</strong> it encourages consistency and a long-term mindset instead of chasing noise.</li>
          </ul>

          <h3 style={{ margin: "14px 0 6px" }}>Compounding (simple)</h3>
          <p style={{ marginTop: 0 }}>
            If dividends get reinvested, you slowly increase your share count…
            which can increase your next dividend payment…
            which can buy more shares… and so on. That’s the long game.
          </p>

          <h3 style={{ margin: "14px 0 6px" }}>Why I built this dashboard</h3>
          <ol style={{ marginTop: 6, paddingLeft: 18 }}>
            <li><strong>What’s paying and how often?</strong></li>
            <li><strong>What’s closest to its lows right now?</strong> (value/entry awareness)</li>
            <li><strong>What’s moving today?</strong> (risk awareness — not panic)</li>
            <li><strong>What’s my conviction list?</strong> (notes + consistency)</li>
          </ol>
          <p style={{ marginTop: 0 }}>
            The goal isn’t day trading — it’s staying informed and making calm decisions.
          </p>

          <h3 style={{ margin: "14px 0 6px" }}>Risks and reality check</h3>
          <p style={{ marginTop: 0 }}>
            Dividends are not guaranteed. Companies and funds can cut dividends/distributions,
            change payout amounts, and prices can drop (sometimes hard).
            Higher yield often comes with higher risk — especially rate-sensitive or credit-sensitive investments.
          </p>

          <h3 style={{ margin: "14px 0 6px" }}>Disclaimer</h3>
          <p style={{ marginTop: 0, opacity: 0.9 }}>
            <strong>Disclaimer:</strong> This dashboard is for educational and informational purposes only and reflects a personal watchlist strategy.
            It is not financial advice, investment advice, or a recommendation to buy or sell any security.
            Markets involve risk, including loss of principal. Always do your own research and consider speaking with a qualified financial professional
            before making investment decisions.
          </p>
        </div>
      </details>

      {/* CLICKABLE CARDS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 14,
          marginBottom: 18,
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
                cursor: "pointer",
                padding: 16,
                borderRadius: 16,
                userSelect: "none",
                background: active
                  ? "rgba(255,255,255,0.08)"
                  : "rgba(0,0,0,0.6)",
                border: "1px solid rgba(255,255,255,0.18)",
              }}
            >
              <div style={{ fontWeight: 900, fontSize: 16 }}>{t.title}</div>
              <div style={{ opacity: 0.8, marginTop: 6, fontSize: 13 }}>
                {t.desc}
              </div>
              <div style={{ opacity: 0.55, marginTop: 10, fontSize: 12 }}>
                {active ? "ACTIVE" : "CLICK TO OPEN"}
              </div>
            </div>
          );
        })}
      </div>

      {/* CONTENT */}
      {tab === "watchlist" && (
        <div
          style={{
            borderRadius: 18,
            padding: 14,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(0,0,0,0.55)",
          }}
        >
          <WatchlistTiles />
        </div>
      )}

      {tab === "heatmap" && (
        <div
          style={{
            borderRadius: 18,
            padding: 18,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(0,0,0,0.55)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>52-week heatmap</h2>
          <HeatmapGrid />
        </div>
      )}

      {tab === "packs" && (
        <div
          style={{
            borderRadius: 18,
            padding: 18,
            border: "1px solid rgba(255,255,255,0.12)",
            background: "rgba(0,0,0,0.55)",
          }}
        >
          <h2 style={{ marginTop: 0 }}>Options Picks</h2>
          <p style={{ opacity: 0.8, marginBottom: 0 }}>
            Next step: store picks + notes in KV/D1 and show them here (members later).
          </p>
        </div>
      )}
      </div>
    </div>
  );
}
