import { useEffect } from "react";

export default function FadeOverlay({ show, duration = 600, onFadeEnd }) {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(() => {
      if (onFadeEnd) onFadeEnd();
    }, duration);
    return () => clearTimeout(timer);
  }, [show, duration, onFadeEnd]);

  return (
    <div
      className={`fixed inset-0 z-[9999] bg-black pointer-events-none transition-opacity duration-700 ${show ? 'opacity-100' : 'opacity-0'}`}
      style={{ transitionDuration: `${duration}ms` }}
    />
  );
}
