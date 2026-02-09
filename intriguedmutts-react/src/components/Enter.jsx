import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import FadeOverlay from "../components/FadeOverlay";
export default function Enter() {
  const navigate = useNavigate();
  const enterRef = useRef(null);
  const [entering, setEntering] = useState(false);
  const [isFading, setIsFading] = useState(false);

  // ONLY entrance clip
  const enterClip = "/videos/thewalktodoor.mp4";

  useEffect(() => {
    if (!entering || !enterRef.current) return;

    const v = enterRef.current;
    v.currentTime = 0;

    const p = v.play();
    if (p?.catch) p.catch(() => {});
  }, [entering]);

  return (
    <div className="min-h-screen w-full bg-black text-white overflow-hidden relative">
      {/* STATIC GATE */}
      {!entering && (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
          <img
            src="/intrigued-mutts-society-transparent.png"
            alt="Intrigued Mutts Society"
            className="w-[320px] sm:w-[420px] md:w-[520px]"
          />
          <p className="mt-6 text-white/75 max-w-xl">
            Press enter to step into the clubhouse.
          </p>
          <button
            onClick={() => setEntering(true)}
            className="mt-10 px-7 py-3 rounded-xl bg-white text-black font-semibold hover:opacity-90 transition"
          >
            ENTER
          </button>
        </div>
      )}

      {/* ENTER OVERLAY — plays ONCE, then routes */}
      {entering && (
        <div className="absolute inset-0 z-50 bg-black">
          <video
            ref={enterRef}
            className="h-full w-full object-contain bg-black"
            src={enterClip}
            muted
            playsInline
            preload="auto"
            onEnded={() => setIsFading(true)}
          />
          <FadeOverlay
            show={isFading}
            duration={600}
            onFadeEnd={() => navigate("/home", { replace: true })}
          />
        </div>
      )}
    </div>
  );
}
