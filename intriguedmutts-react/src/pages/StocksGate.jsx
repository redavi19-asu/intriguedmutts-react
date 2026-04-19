import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import VideoGate from "../components/VideoGate";

export default function StocksGate() {
  const nav = useNavigate();
  const loc = useLocation();
  const params = new URLSearchParams(loc.search);
  const tab = params.get("tab") || "watchlist";
  const [showGate, setShowGate] = useState(true);
  const videoSrc = `videos/intriguedstock.mp4`;

  function handleSkip() {
    setShowGate(false);
    nav(`/stocks?tab=${tab}`, { replace: true });
  }

  return (
    <>
      {showGate ? (
        <VideoGate
          src={videoSrc}
          onEnd={handleSkip}
          onError={handleSkip}
          onSkip={handleSkip}
          skipLabel="Skip"
          videoClass="h-full w-full object-contain bg-black"
          overlay={
            <div
              style={{
                position: "absolute",
                inset: 0,
                zIndex: 10,
                display: "grid",
                placeItems: "center",
                pointerEvents: "none",
              }}
            >
              <div>
                <div
                  style={{
                    letterSpacing: 3,
                    opacity: 0.9,
                    marginBottom: 10,
                    color: "hotpink",
                    textShadow: "0 0 18px rgba(255,105,180,0.45)",
                  }}
                >
                  INTRIGUED MUTTS
                </div>
                <h1
                  style={{
                    fontSize: 52,
                    margin: 0,
                    fontWeight: 900,
                    color: "hotpink",
                    textShadow: "0 0 22px rgba(255,105,180,0.55)",
                  }}
                >
                  STOCKS
                </h1>
                <div
                  style={{
                    marginTop: 10,
                    fontSize: 12,
                    opacity: 0.85,
                    color: "hotpink",
                    textShadow: "0 0 14px rgba(255,105,180,0.35)",
                  }}
                >
                  loading…
                </div>
              </div>
            </div>
          }
        />
      ) : null}
    </>
  );
}
