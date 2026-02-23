

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
        bottom: 0,
        height: "40vh",
        background: "#181818",
        zIndex: 1000,
        borderTop: "2px solid #222",
        boxShadow: "0 -2px 24px rgba(0,0,0,0.45)",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
      }}
    >
      <div style={{ display: "flex", justifyContent: "flex-end", padding: 8 }}>
        <button
          onClick={onClose}
          style={{
            background: "#222",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "6px 14px",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: 15,
          }}
        >
          Close
        </button>
      </div>
      <div style={{ flex: 1, minHeight: 0 }}>
        <TradingViewAdvancedChart symbol={symbol} />
      </div>
    </div>
  );
}
