import { NavLink } from "react-router-dom";

const linkBase =
  "px-3 py-2 text-sm uppercase tracking-widest text-gray-300 hover:text-white transition";
const linkActive = "text-white";

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <NavLink to="/" className="font-black tracking-tight text-xl">
          INTRIGUED MUTTS
        </NavLink>

        <div className="flex items-center gap-2">
          <NavLink
            to="/society"
            className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}
          >
            Society
          </NavLink>
          <NavLink
            to="/nfts"
            className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}
          >
            NFTs
          </NavLink>
          <NavLink
            to="/merch"
            className={({ isActive }) => `${linkBase} ${isActive ? linkActive : ""}`}
          >
            Merch
          </NavLink>
        </div>
      </div>
    </nav>
  );
}
