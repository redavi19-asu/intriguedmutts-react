import { useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export default function StocksGate() {
  const nav = useNavigate();
  const loc = useLocation();
  const hash = loc.hash || "#watchlist";
  const vidRef = useRef(null);

  const go = () => {
    nav(`/stocks${hash}`, { replace: true });
  };

  return (
    <div style={{ position: "relative", minHeight: "100vh", overflow: "hidden" }}>
      <video
        ref={vidRef}
        autoPlay
        muted
        playsInline
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "contain",
          objectPosition: "center",
          transform: "scale(0.9)",
          filter: "brightness(0.7)",
        }}
        onEnded={go}
        onError={go}     // if video fails, don’t trap the user
      >
        <source src="/videos/intriguedstock.mp4" type="video/mp4" />
      </video>

      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at center, rgba(0,0,0,0.15), rgba(0,0,0,0.65))",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "grid",
          placeItems: "center",
          minHeight: "100vh",
          padding: 24,
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        <div>
          <div style={{ letterSpacing: 3, opacity: 0.85, marginBottom: 10 }}>
            INTRIGUED MUTTS
          </div>
          <h1 style={{ fontSize: 52, margin: 0, fontWeight: 900 }}>STOCKS</h1>
          <div style={{ marginTop: 10, fontSize: 12, opacity: 0.7 }}>
            loading…
          </div>
        </div>
      </div>
    </div>
  );
}
