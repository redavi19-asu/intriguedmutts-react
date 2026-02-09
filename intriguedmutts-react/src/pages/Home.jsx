import Layout from "../components/Layout"
import Hero from "../components/Hero"
import { motion } from "framer-motion"

export default function Home() {
  return (
    <Layout>

      <Hero />

      <div className="h-[200vh] bg-blue-900/10"></div>


      {/* Society */}
      <motion.section
        className="min-h-screen flex items-center justify-center bg-red-900/20"
      >
        <div className="max-w-3xl text-center px-8">
          <h2 className="text-5xl font-black mb-6">THE SOCIETY</h2>
          <p className="text-gray-400 text-lg">
            Intrigued Mutts is a collective of curious canines living between
            chaos and culture. Every drop unlocks art, apparel, and access.
          </p>
        </div>
      </motion.section>


      {/* NFTs */}
      <motion.section
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-150px" }}
        transition={{ duration: 0.9 }}
        className="min-h-screen flex items-center justify-center"
      >
        <div className="max-w-3xl text-center px-8">
          <h2 className="text-5xl font-black mb-6">NFT DROPS</h2>
          <p className="text-gray-400 text-lg">
            Limited collections. Hand-drawn energy. Members-only releases.
          </p>
        </div>
      </motion.section>


      {/* Merch */}
      <motion.section
        initial={{ opacity: 0, y: 80 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-150px" }}
        transition={{ duration: 0.9 }}
        className="min-h-screen flex items-center justify-center"
      >
        <div className="max-w-3xl text-center px-8">
          <h2 className="text-5xl font-black mb-6">MERCH</h2>
          <p className="text-gray-400 text-lg">
            Wear the pack. Limited-run prints, hoodies, and accessories.
          </p>
        </div>
      </motion.section>

    </Layout>
  )
}
