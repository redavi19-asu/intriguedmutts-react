import { Link, useNavigate } from "react-router-dom";
import HomeStocksCards from "../components/HomeStocksCards";
import { useEffect } from "react";
import { motion } from "framer-motion";
import Hero from "../components/Hero";

function Section({ title, kicker, children, ctaTo, ctaText, id }) {
  return (
    <section id={id} className="py-24 border-t border-white/10">
      <div className="grid md:grid-cols-2 gap-10 items-start">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-gray-400">
            {kicker}
          </p>
          <h2 className="mt-3 text-4xl md:text-5xl learns font-black tracking-tight">
            {title}
          </h2>

          {ctaTo && (
            <Link
              to={ctaTo}
              className="inline-block mt-8 px-6 py-3 border border-white/30 hover:border-white hover:bg-white hover:text-black transition uppercase tracking-widest text-sm"
            >
              {ctaText}
            </Link>
          )}
        </div>

        <div className="text-gray-300 leading-relaxed">{children}</div>
      </div>
    </section>
  );
}

export default function Home() {
  const navigate = useNavigate();
  useEffect(() => {
    // any time Home loads, allow the intro again
    sessionStorage.removeItem("stocks_gate_passed");
  }, []);
  return (
    <div className="w-full">
      <Hero />

      {/* Society section */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.6 }}
      >
        <Section
          id="society"
          kicker="The story"
          title="THE SOCIETY"
          ctaTo="/society"
          ctaText="Read the lore"
        >
          <p>
            Intrigued Mutts is a collective of curious canines living between
            chaos and culture. Every drop is a moment: art, merch, and a world
            you can actually build into.
          </p>

          <ul className="mt-6 space-y-2 list-disc list-inside text-gray-400">
            <li>Limited digital art drops</li>
            <li>Physical merch with clean design rules</li>
            <li>A living world (site evolves with the pack)</li>
          </ul>
        </Section>
      </motion.div>

      {/* Merch section (full version with ENTER button) */}
      <section
        id="merch"
        className="py-28 border-t border-white/10 relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs uppercase tracking-[0.35em] text-gray-400">
            Restricted area
          </p>
          <h2 className="mt-3 text-4xl md:text-5xl font-black tracking-tight">
            MERCH VAULT
          </h2>
          <p className="mt-4 text-white/70 max-w-2xl mx-auto">
            Apparel, prints, limited drops — accessible only from inside the Society.
          </p>
          {/* teaser cards */}
          <div className="mt-16 grid sm:grid-cols-2 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl border border-white/10 bg-white/5 p-6"
              >
                <div className="aspect-square bg-white/10 rounded-xl mb-4" />
                <p className="font-semibold">Vault Item #{i}</p>
                <p className="text-sm text-white/60">Locked</p>
              </div>
            ))}
          </div>
          {/* ENTER BUTTON */}
          <div className="mt-16">
            <button
              onClick={() => navigate("/merch-gate")}
              className="group relative px-10 py-4 rounded-xl border border-white/30 hover:border-white/70 transition text-sm tracking-[0.3em]"
            >
              <span className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition bg-white/5" />
              <span className="relative">ENTER MERCH VAULT</span>
            </button>
          </div>
        </div>
      </section>

      {/* Stock section (placeholder, no API) */}
      <section id="stock" className="py-24 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6">
            {/* ...existing code... */}
          <h2 className="mt-3 text-4xl md:text-5xl font-black tracking-tight">
            INTRIGUED STOCKS
          </h2>
          <p className="mt-4 text-white/70 max-w-2xl">
            This section will become our “market board” later — watchlist, 52-week lows,
            and pack picks. For now, we’re finishing the world first.
          </p>

          <div className="mt-10">
            <HomeStocksCards />
          </div>
        </div>
      </section>

      {/* NFTs section (now last) */}
      <section id="nfts" className="py-24 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.35em] text-green-400">
            New drops weekly
          </p>

          <h2 className="mt-3 text-4xl md:text-5xl font-black tracking-tight">
            NFT VAULT
          </h2>

          <p className="mt-4 text-white/70 max-w-2xl">
            The collection will live here — supply, traits, drop schedule, and mint access.
            We’re finishing the world first, then we open the vault.
          </p>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="font-semibold">Collection overview</p>
              <p className="mt-2 text-white/70 text-sm">
                Supply, tiers, and how the Society ties in.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="font-semibold">Traits + rarity</p>
              <p className="mt-2 text-white/70 text-sm">
                Visual traits, rarity distribution, and filters.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="font-semibold">Mint & access</p>
              <p className="mt-2 text-white/70 text-sm">
                Wallet connect, allowlist, and mint mechanics.
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-2xl border border-white/10 bg-white/5 p-6 flex items-center justify-between gap-4 flex-wrap">
            <p className="text-white/70 text-sm">
              Want a “notify me” box here later? We can add email capture when you’re ready.
            </p>

            <button
              type="button"
              className="px-5 py-3 rounded-xl border border-white/25 text-white hover:border-white/60 transition"
            >
              Notify Me (Soon)
            </button>
          </div>
        </div>
      </section>

      <div style={{ opacity: 0.6, fontSize: 12, textAlign: 'center', marginTop: 24 }}>
        Build: 2026-02-11 03:58
      </div>
      <footer className="py-10 text-xs text-gray-500 border-t border-white/10">
        © {new Date().getFullYear()} Intrigued Mutts
      </footer>
    </div>
  );
}
