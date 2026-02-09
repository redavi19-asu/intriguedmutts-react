import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Enter from "./components/Enter";
import MerchGate from "./pages/MerchGate";
import Merch from "./pages/Merch";

import Home from "./pages/Home";
import About from "./pages/About";
import NFTs from "./pages/NFTs";
import StockQuoteTest from "./components/StockQuoteTest";

export default function App() {
  return (
    <>
      {/* Remove or move this line as needed for testing */}
      <StockQuoteTest symbol="AAPL" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Enter />} />
          <Route
            path="/home"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route path="/society" element={<About />} />
          <Route path="/nfts" element={<NFTs />} />
          <Route path="/merch-gate" element={<MerchGate />} />
          <Route
            path="/merch"
            element={
              <Layout>
                <Merch />
              </Layout>
            }
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}
