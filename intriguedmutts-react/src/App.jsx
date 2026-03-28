import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";
import Enter from "./components/Enter";
import MerchGate from "./pages/MerchGate";
import Merch from "./pages/Merch";
import Home from "./pages/Home";
import About from "./pages/About";
import NFTs from "./pages/NFTs";
import Stocks from "./pages/Stocks.jsx";
import StocksGate from "./pages/StocksGate";
import Society from "./pages/Society";
import ScrollToTop from "./components/ScrollToTop";
import Success from "./pages/Success";
import ConsentManager from "./components/ConsentManager";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import CookiePolicy from "./pages/CookiePolicy";
import DoNotSell from "./pages/DoNotSell";

export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<Enter />} />
        <Route path="/home" element={<Layout><Home /></Layout>} />
        <Route path="/about" element={<Layout><About /></Layout>} />
        <Route path="/nfts" element={<Layout><NFTs /></Layout>} />
        <Route path="/merch" element={<Layout><Merch /></Layout>} />
        <Route path="/merch-gate" element={<MerchGate />} />
        <Route path="/stocks-gate" element={<StocksGate />} />
        <Route path="/stocks" element={<Stocks />} />
        <Route path="/society" element={<Society />} />
        <Route path="/success" element={<Success />} />
        <Route path="/privacy-policy" element={<Layout><PrivacyPolicy /></Layout>} />
        <Route path="/cookie-policy" element={<Layout><CookiePolicy /></Layout>} />
        <Route path="/do-not-sell" element={<Layout><DoNotSell /></Layout>} />
        <Route path="/watchlist" element={<Navigate to="/stocks?tab=watchlist" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <ConsentManager />
    </HashRouter>
  );
}
