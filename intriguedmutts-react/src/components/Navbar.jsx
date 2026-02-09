import { NavLink, Link } from "react-router-dom";

const linkBase =
  "px-3 py-2 text-sm uppercase tracking-widest text-gray-300 hover:text-white transition";
const linkActive = "text-white";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <a href="#society" className="hover:opacity-80 transition">
          SOCIETY
        </a>

        <div className="flex items-center gap-2">
          <Link to="/merch-gate" className="hover:opacity-80 transition">
            MERCH
          </Link>
          <a href="#stock" className="hover:opacity-80 transition">
            STOCKS
          </a>
          <a href="#nfts" className="hover:opacity-80 transition">
            NFTS
          </a>
        </div>
      </div>
    </nav>
  );
}
