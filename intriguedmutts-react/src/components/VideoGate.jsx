import React from "react";

export default function VideoGate({
  src,
  onEnd,
  onError,
  onSkip,
  skipLabel = "Skip",
  overlay = null,
  videoClass = "",
  containerClass = "",
  autoPlay = true,
  muted = true,
  playsInline = true,
  preload = "auto",
  ...rest
}) {
  const videoRef = React.useRef(null);
  // For mobile Safari/Chrome: ensure skip is always visible and video is interactive
  return (
    <div className={`relative w-full h-full bg-black ${containerClass}`} style={{minHeight: '100vh'}}>
      <button
        type="button"
        onClick={onSkip}
        className="absolute z-20 top-4 left-1/2 -translate-x-1/2 px-6 py-2 rounded-xl bg-black/55 text-pink-300 font-semibold text-base shadow-lg border border-pink-400/90 focus:outline-none focus:ring-2 focus:ring-pink-300 active:bg-pink-500/15 transition"
        style={{ minWidth: 88, minHeight: 44, touchAction: 'manipulation' }}
      >
        {skipLabel}
      </button>
      <video
        ref={videoRef}
        className={`block w-full h-full object-contain bg-black ${videoClass}`}
        src={src}
        autoPlay={autoPlay}
        muted={muted}
        playsInline={playsInline}
        preload={preload}
        onEnded={onEnd}
        onError={onError}
        style={{ maxHeight: '100vh' }}
        {...rest}
      />
      {overlay}
    </div>
  );
}
