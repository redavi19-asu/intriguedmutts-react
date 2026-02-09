
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"

import Home from "./pages/Home"
import NFTs from "./pages/NFTs"
import Merch from "./pages/Merch"
import About from "./pages/About"

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Home />} />
        <Route path="/nfts" element={<NFTs />} />
        <Route path="/merch" element={<Merch />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AnimatedRoutes />
    </BrowserRouter>
  )
}
