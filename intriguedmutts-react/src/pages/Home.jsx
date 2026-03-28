import { Link, useNavigate } from "react-router-dom";
import HomeStocksCards from "../components/HomeStocksCards";
import { useEffect } from "react";
import { motion } from "framer-motion";
import Hero from "../components/Hero";
import { useConsent } from "../context/ConsentContext";

function Section({ title, kicker, children, ctaTo, ctaText, id }) {
  return (
    <section id={id} className="py-24 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6">
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
                className="inline-block mt-8 px-6 py-3 border-4 border-blue-300 hover:border-blue-400 hover:bg-white hover:text-black transition uppercase tracking-widest text-sm"
                style={{
                  borderColor: 'rgba(125, 211, 252, 0.95)',
                  boxShadow: '0 0 36px 8px rgba(125, 211, 252, 0.45), 0 0 0 2px rgba(125, 211, 252, 0.25)'
                }}
              >
                {ctaText}
              </Link>
            )}
          </div>

          <div className="text-gray-300 leading-relaxed">{children}</div>
        </div>
      </div>
    </section>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { openPreferences } = useConsent();
  useEffect(() => {
    // any time Home loads, allow the intro again
    sessionStorage.removeItem("stocks_gate_passed");
  }, []);

  useEffect(() => {
    sessionStorage.setItem("entered", "1");
  }, []);

  // Scroll-based background shift effect
  useEffect(() => {
    const el = document.querySelector(".homeBg");
    if (!el) return;

    const onScroll = () => {
      // small negative shift makes bg feel more "fixed"
      const shift = Math.round(window.scrollY * -0.25);
      el.style.setProperty("--bgShift", `${shift}px`);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      className="w-full min-h-screen"
      style={{
        backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.85), rgba(0,0,0,0.60), rgba(0,0,0,0.90)), url(${import.meta.env.BASE_URL}bg-home.png)`,
        backgroundAttachment: "fixed",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center bottom",
        backgroundSize: "cover",
        backgroundColor: "black",
      }}
    >
      <Hero />

      {/* Intro summary + arrows */}
      <section className="introWrap">
        <div className="introCopy">
          <p className="introLead introLeadBig">Intrigued Mutts Society is a finance + fashion lifestyle lab — a place to learn the game and stay fresh doing it.</p>
          <p className="introLead introLeadBig">Track dividend stocks, watchlist moves, and simple ideas that help you build steady cash flow over time.</p>
          <p className="introLead introLeadBig">Then step into the merch vault: clean streetwear inspired by the pack and the mindset.</p>
          <p className="introLead introLeadBig">Use the menu to choose your path, or scroll down to enter the world.</p>
        </div>

      {/* Arrow pointing down under the intro */}
      <div className="scrollArrow" aria-hidden="true">
        <svg viewBox="0 0 24 24">
          <path d="M12 2 L12 16 M6 10 L12 18 L18 10" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      </section>

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
                className="rounded-2xl border border-white/10 bg-white/5 p-6 merch-card"
              >
                <img
                  src={`${import.meta.env.BASE_URL}vault/vault${i}.png`}
                  alt={[
                    "Society Logo Tee (Black)",
                    "Doodle Scene Tee",
                    "Doodle Scene Hoodie",
                  ][i - 1] || `Vault Item #${i}`}
                  className="aspect-square w-full rounded-xl mb-4 object-cover bg-white/10"
                />
                <p className="font-semibold">
  {[
    "Society Logo Tee (Black)",
    "Doodle Scene Tee",
    "Doodle Scene Hoodie",
  ][i - 1] || `Vault Item #${i}`}
</p>

                <p className="text-sm text-white/60">Locked</p>
              </div>
            ))}
          </div>
          {/* ENTER BUTTON */}
          <div className="mt-16">
            <button
              onClick={() => navigate("/merch-gate")}
              className="group relative px-10 py-4 rounded-xl merchVaultPulse transition text-sm tracking-[0.3em]"
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
            and options picks. For now, we’re finishing the world first.
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
          {/* Removed smaller white COMING SOON text */}
          <p className="mt-3 text-base font-bold uppercase tracking-[0.35em] text-red-500">
            Coming soon
          </p>

          <div className="mt-10 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 nft-card">
              <p className="font-semibold">Collection overview</p>
              <p className="mt-2 text-white/70 text-sm">
                Supply, tiers, and how the Society ties in.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 nft-card">
              <p className="font-semibold">Traits + rarity</p>
              <p className="mt-2 text-white/70 text-sm">
                Visual traits, rarity distribution, and filters.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 nft-card">
              <p className="font-semibold">Mint & access</p>
              <p className="mt-2 text-white/70 text-sm">
                Wallet connect, allowlist, and mint mechanics.
              </p>
            </div>
          </div>

          {/* Removed Notify Me bar/card at bottom of NFT Vault section */}
        </div>
      </section>

      <div style={{ opacity: 0.6, fontSize: 12, textAlign: 'center', marginTop: 24 }}>
        Build: 2026-02-11 03:58
      </div>
      <footer className="py-10 text-xs text-gray-500 border-t border-white/10 flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 text-[11px] text-white/60">
          <Link className="hover:text-white transition" to="/privacy-policy">Privacy Policy</Link>
          <Link className="hover:text-white transition" to="/cookie-policy">Cookie Policy</Link>
          <Link className="hover:text-white transition" to="/do-not-sell">Do Not Sell or Share</Link>
          <button className="hover:text-white transition" type="button" onClick={openPreferences}>
            Manage Preferences
          </button>
        </div>
        <span>© {new Date().getFullYear()} Intrigued Mutts</span>
      </footer>
    </div>
  );
}
