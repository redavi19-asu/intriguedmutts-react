import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FadeOverlay from "../components/FadeOverlay";
import VideoGate from "./VideoGate";

export default function Enter() {
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionStorage.getItem("entered") === "1") {
      navigate("/home", { replace: true });
    }
  }, [navigate]);

  const [entering, setEntering] = useState(false);
  const [isFading, setIsFading] = useState(false);
  // IMPORTANT: use absolute path so it works from any route
  const enterClip = `/videos/thewalktodoor.mp4`;

  function handleEnter() {
    setEntering(true);
  }

  function handleSkip() {
    setEntering(false);
    sessionStorage.setItem("entered", "1");
    navigate("/home", { replace: true });
  }

  return (
    <>
      <meta
        name="description"
        content="Step into the Intrigued Mutts Society clubhouse. Chaos, culture, curiosity, and more await!"
      />

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
