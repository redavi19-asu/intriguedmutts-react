import { useNavigate } from "react-router-dom";
const linkBase =
  "px-3 py-2 text-sm uppercase tracking-widest text-gray-300 hover:text-white transition";
const linkActive = "text-white";

export default function Navbar() {
  const navigate = useNavigate();
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <button onClick={() => navigate("/home")}
          className="hover:opacity-80 transition"
        >
          <img src={`intrigued-mutts-society-transparent.png`} className="h-10" />
        </button>

        <div className="flex items-center gap-2">
          <button onClick={() => navigate("/home#society")}
            className="hover:opacity-80 transition"
          >
            Society
          </button>
          <button onClick={() => navigate("/home#merch")}
            className="hover:opacity-80 transition"
          >
            Merch
          </button>
          <button onClick={() => navigate("/stocks-gate")}
            className="hover:opacity-80 transition"
          >
            Stocks
          </button>
          <button onClick={() => navigate("/home#nfts")}
            className="hover:opacity-80 transition"
          >
            NFTs
          </button>
        </div>
      </div>
    </nav>
  );
}
