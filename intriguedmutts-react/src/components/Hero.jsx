import { motion } from "framer-motion"

export default function Hero() {
  return (
    <section className="relative h-[85vh] w-full overflow-hidden">
      {/* Background video */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        src="/videos/interactive.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/50" />

      {/* logo/content must be above the video */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <img
          src="/intrigued-mutts-society-transparent.png"
          alt="Intrigued Mutts Society"
          className="mx-auto w-[320px] sm:w-[420px] md:w-[520px] drop-shadow-[0_20px_60px_rgba(0,0,0,0.7)] mb-6"
        />
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-4xl mx-auto"
        >
          <p className="mt-6 max-w-xl mx-auto text-gray-400 text-lg">
            A society of curious dogs.  
            Digital art. Physical drops. Controlled chaos.
          </p>

          <button className="mt-10 px-8 py-4 border border-white uppercase tracking-widest hover:bg-white hover:text-black transition">
            Enter the Pack
          </button>
        </motion.div>
      </div>
    </section>
  )
}
