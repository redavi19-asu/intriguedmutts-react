import { useState } from "react";
import { useNavigate } from "react-router-dom";
import FadeOverlay from "../components/FadeOverlay";
import VideoGate from "../components/VideoGate";
export default function MerchGate() {
  const navigate = useNavigate();
  const [entering, setEntering] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const enterClip = `videos/walktoclosetmerch.mp4`;

  function handleEnter() {
    setEntering(true);
  }

  function handleSkip() {
    setEntering(false);
    navigate("/merch", { replace: true });
  }

  return (
    <div className="min-h-screen w-full bg-black text-white overflow-hidden relative">
      {entering ? (
        <>
          <VideoGate
            src={enterClip}
            onEnd={() => setIsFading(true)}
            onError={() => setIsFading(true)}
            onSkip={handleSkip}
            skipLabel="Skip"
            videoClass="h-full w-full object-contain bg-black"
          />
          <FadeOverlay
            show={isFading}
            duration={600}
            onFadeEnd={handleSkip}
          />
        </>
      ) : (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
          <img
            src={`intrigued-mutts-society-transparent.png`}
            alt="Intrigued Mutts Society"
            className="w-[320px] sm:w-[420px] md:w-[520px]"
          />
          <p className="mt-6 text-white/75 max-w-xl">
            Enter the merch vault.
          </p>
          <button
            onClick={handleEnter}
            className="mt-10 px-7 py-3 rounded-xl bg-white text-black font-semibold hover:opacity-90 transition"
          >
            ENTER SHOP
          </button>
        </div>
      )}
    </div>
  );
}
