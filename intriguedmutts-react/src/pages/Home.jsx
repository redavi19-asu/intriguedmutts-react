import { motion } from "framer-motion";
import { Link } from "react-router-dom";
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

      {/* Merch section */}
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.6 }}
      >
        <Section
          id="merch"
          kicker="Physical"
          title="MERCH DROPS"
          ctaTo="/merch"
          ctaText="Shop merch"
        >
          <p>
            Clean, wearable, limited. This is where we plug in your PayPal +
            Printful flow once the visuals are locked.
          </p>

          <div className="mt-6 grid sm:grid-cols-2 gap-4">
            <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
              <p className="font-semibold">Drop 001</p>
              <p className="text-sm text-gray-400 mt-2">
                Signature logo + “pack” pieces (hoodie / tee).
              </p>
            </div>
            <div className="p-5 rounded-2xl border border-white/10 bg-white/5">
              <p className="font-semibold">Drop 002</p>
              <p className="text-sm text-gray-400 mt-2">
                Scene-based art prints + limited color pop variants.
              </p>
            </div>
          </div>
        </Section>
      </motion.div>

      {/* Stock section (placeholder, no API) */}
      <section id="stock" className="py-24 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.35em] text-gray-400">
            Coming soon
          </p>
          <h2 className="mt-3 text-4xl md:text-5xl font-black tracking-tight">
            INTRIGUED STOCKS
          </h2>
          <p className="mt-4 text-white/70 max-w-2xl">
            This section will become our “market board” later — watchlist, 52-week lows,
            and pack picks. For now, we’re finishing the world first.
          </p>

          <div className="mt-10 grid sm:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="font-semibold">Watchlist</p>
              <p className="mt-2 text-white/70 text-sm">Saved tickers + alerts</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="font-semibold">52-week heatmap</p>
              <p className="mt-2 text-white/70 text-sm">Closest to the lows</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <p className="font-semibold">Pack picks</p>
              <p className="mt-2 text-white/70 text-sm">Notes + conviction list</p>
            </div>
          </div>
        </div>
      </section>

      {/* NFTs section (now last) */}
      <section id="nfts" className="py-24 border-t border-white/10">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-xs uppercase tracking-[0.35em] text-gray-400">
            Coming soon
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

      <footer className="py-10 text-xs text-gray-500 border-t border-white/10">
        © {new Date().getFullYear()} Intrigued Mutts
      </footer>
    </div>
  );
}
