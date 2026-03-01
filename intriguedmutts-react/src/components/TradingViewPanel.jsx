

import React from "react";
import TradingViewAdvancedChart from "./TradingViewAdvancedChart";

export default function TradingViewPanel({ symbol, onClose }) {
  if (!symbol) return null;
  return (
    <div
      style={{
        position: "fixed",
        left: 0,
        right: 0,
        top: 0,
        height: "100vh",
        background: "rgba(0, 0, 0, 0.8)",
        zIndex: 1000,
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        backdropFilter: "blur(2px)",
        overflow: "hidden",
      }}
    >
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 16,
        background: "linear-gradient(to bottom, rgba(24, 24, 24, 0.95), rgba(24, 24, 24, 0.7))",
        borderBottom: "1px solid rgba(255,255,255,0.1)",
      }}>
        <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>
          {symbol} Chart
        </div>
        <button
          onClick={onClose}
          style={{
            background: "rgba(255,255,255,0.12)",
            color: "#fff",
            border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 6,
            padding: "8px 16px",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: 14,
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "rgba(255,255,255,0.22)";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "rgba(255,255,255,0.12)";
          }}
        >
          ✕ Close
        </button>
      </div>
      <div style={{ flex: 1, minHeight: 0, overflow: "auto", background: "#181818" }}>
        <TradingViewAdvancedChart symbol={symbol} />
      </div>
    </div>
  );
}
