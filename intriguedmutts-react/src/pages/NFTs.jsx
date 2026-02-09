
import { motion } from "framer-motion"
import Layout from "../components/Layout"

export default function NFTs() {
  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex items-center justify-center text-5xl font-black"
      >
        NFT COLLECTION
      </motion.div>
    </Layout>
  )
}
