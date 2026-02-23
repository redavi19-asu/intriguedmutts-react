import { motion } from "framer-motion"

export default function Hero() {
  return (
    <section className="relative h-[85vh] w-full overflow-hidden">
      <video
        className="absolute inset-0 h-full w-full object-contain bg-black"
        src={`videos/interactive.mp4`}
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <img
          src="/intrigued-mutts-society-transparent.png"
          alt="Intrigued Mutts Society"
          className="w-[320px] sm:w-[420px] md:w-[520px]"
        />
        <p className="mt-6 text-white/75 max-w-xl">
          Welcome to the Society.
        </p>
        <div className="scrollArrow heroScrollArrow" aria-hidden="true">
          <svg viewBox="0 0 24 24">
            <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
      </div>
    </section>
  );
}
