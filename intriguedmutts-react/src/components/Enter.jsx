import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import FadeOverlay from "../components/FadeOverlay";

export default function Enter() {
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("entered") === "1") {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  const enterRef = useRef(null);
  const [entering, setEntering] = useState(false);
  const [isFading, setIsFading] = useState(false);
  const [playFailed, setPlayFailed] = useState(false);

  // IMPORTANT: use absolute path so it works from any route
  const enterClip = `/videos/thewalktodoor.mp4`;

  async function handleEnter() {
    setPlayFailed(false);
    setEntering(true);

    // MUST attempt play during the tap/gesture
    const v = enterRef.current;
    if (!v) return;

    try {
      v.currentTime = 0;
      v.muted = true;
      v.playsInline = true;
      v.setAttribute("playsinline", "");
      await v.play();
    } catch (e) {
      setPlayFailed(true);
    }
  }

  async function handleTapToPlay() {
    const v = enterRef.current;
    if (!v) return;
    try {
      await v.play();
      setPlayFailed(false);
    } catch (e) {
      // still blocked
    }
  }

  return (
    <>
      <meta
        name="description"
        content="Step into the Intrigued Mutts Society clubhouse. Chaos, culture, curiosity, and more await!"
      />

      <div className="min-h-screen w-full bg-black text-white overflow-hidden relative">
        {/* Keep video mounted (ref exists), just hidden until entering */}
        <div className={entering ? "absolute inset-0 z-50 bg-black" : "hidden"}>
          <video
            ref={enterRef}
            className="h-full w-full object-contain bg-black"
            src={enterClip}
            muted
            playsInline
            preload="auto"
            aria-label="Entrance animation"
            onEnded={() => setIsFading(true)}
          />
          {playFailed && (
            <button
              onClick={handleTapToPlay}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-24 px-6 py-3 rounded-xl bg-white text-black font-semibold"
            >
              Tap to play
            </button>
          )}
          <FadeOverlay
            show={isFading}
            duration={600}
            onFadeEnd={() => {
              sessionStorage.setItem("entered", "1");
              navigate("/home", { replace: true });
            }}
          />
        </div>

        {/* STATIC GATE */}
        {!entering && (
          <div className="min-h-screen flex flex-col items-center justify-center text-center px-6">
            <link rel="preload" as="image" href="/intrigued-mutts-society-transparent.png" />
            <img
              src="/intrigued-mutts-society-transparent.png"
              alt="Intrigued Mutts Society logo"
              width="320"
              height="207"
              className="w-[320px] sm:w-[420px] md:w-[520px]"
            />
            <p className="mt-6 text-white/75 max-w-xl">
              Press enter to step into the clubhouse.
            </p>
            <button
              onClick={handleEnter}
              className="mt-10 px-7 py-3 rounded-xl bg-white text-black font-semibold hover:opacity-90 transition"
            >
              ENTER
            </button>
          </div>
        )}
      </div>
    </>
  );
}
