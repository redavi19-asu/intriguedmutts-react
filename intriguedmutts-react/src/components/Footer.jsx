import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Footer() {
  const nav = useNavigate();
  const loc = useLocation();

  // queue scroll across route changes
  const pendingScrollId = useRef(null);

  useEffect(() => {
    if (pendingScrollId.current) {
      // wait a tick for Home to render
      const id = pendingScrollId.current;
      pendingScrollId.current = null;

      requestAnimationFrame(() => {
        setTimeout(() => scrollToId(id), 80);
      });
    }
  }, [loc.pathname]);

  const goHomeAndScroll = (id) => {
    // Home route is /home, NOT /
    if (loc.pathname !== "/home") {
      pendingScrollId.current = id;
      nav("/home");
    } else {
      scrollToId(id);
    }
  };

  return (
    <footer className="border-t border-white/10 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Intrigued Mutts Society</p>
          <p className="mt-1 text-xs text-white/60">Chaos • Culture • Curiosity</p>
        </div>

        <div className="flex gap-4 text-xs text-white/60">
          <Link className="hover:text-white transition" to="/society">Society</Link>
          <Link className="hover:text-white transition" to="/merch">Merch</Link>
          <Link className="hover:text-white transition" to="/stocks">Stocks</Link>

          {/* TEMP: scroll to NFTs section on /home */}
          <button
            className="hover:text-white transition"
            type="button"
            onClick={() => goHomeAndScroll("nfts")}
          >
            NFTs
          </button>
        </div>

        <p className="text-xs text-white/50">© {new Date().getFullYear()} Intrigued Mutts</p>
      </div>
    </footer>
  );
}
