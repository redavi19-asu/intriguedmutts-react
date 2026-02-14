import { useEffect, useRef, useState } from "react";

export default function EnterGate() {
  const vref = useRef(null);
  const [needsTap, setNeedsTap] = useState(false);

  useEffect(() => {
    const v = vref.current;
    if (!v) return;
    v.muted = true;        // key for iPad autoplay
    v.playsInline = true;  // key for iPad inline playback

    v.play().then(
      () => setNeedsTap(false),
      () => setNeedsTap(true)
    );
  }, []);

  const tapToPlay = async () => {
    const v = vref.current;
    if (!v) return;
    v.muted = true;
    v.playsInline = true;
    try { await v.play(); setNeedsTap(false); } catch {}
  };

  return (
    <div style={{ position: "relative" }}>
      <video
        ref={vref}
        src="/videos/ENTER.mp4"
        muted
        playsInline
        preload="auto"
        autoPlay
      />

      {needsTap && (
        <button
          onClick={tapToPlay}
          style={{
            position: "absolute", inset: 0,
            fontSize: 22, fontWeight: 700
          }}
        >
          Tap to enter
        </button>
      )}
    </div>
  );
}