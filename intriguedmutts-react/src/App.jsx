import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";

import Home from "./pages/Home";
import About from "./pages/About";
import NFTs from "./pages/NFTs";
import Merch from "./pages/Merch";

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/society" element={<About />} />
          <Route path="/nfts" element={<NFTs />} />
          <Route path="/merch" element={<Merch />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}
