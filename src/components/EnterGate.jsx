import VideoGate from "./VideoGate";
import { useState } from "react";

export default function EnterGate({ onEnd }) {
  const [show, setShow] = useState(true);
  function handleSkip() {
    setShow(false);
    if (onEnd) onEnd();
  }
  return show ? (
    <VideoGate
      src="/videos/ENTER.mp4"
      onEnd={handleSkip}
      onError={handleSkip}
      onSkip={handleSkip}
      skipLabel="Skip"
      videoClass="h-full w-full object-contain bg-black"
    />
  ) : null;
}