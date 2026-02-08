
import { motion } from "framer-motion"

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-black overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-center px-6"
      >
        <h1 className="text-6xl md:text-8xl font-black tracking-tight">
          INTRIGUED MUTTS
        </h1>

        <p className="mt-6 max-w-xl mx-auto text-gray-400 text-lg">
          A society of curious dogs.  
          Digital art. Physical drops. Controlled chaos.
        </p>

        <button className="mt-10 px-8 py-4 border border-white uppercase tracking-widest hover:bg-white hover:text-black transition">
          Enter the Pack
        </button>
      </motion.div>
    </section>
  )
}
