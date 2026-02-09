import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";

function Section({ title, kicker, children, ctaTo, ctaText }) {
  return (
    <section className="py-24 border-t border-white/10">
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

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.6 }}
      >
        <Section
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

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.6 }}
      >
        <Section
          kicker="Digital"
          title="NFT COLLECTION"
          ctaTo="/nfts"
          ctaText="View the collection"
        >
          <p>
            The collection is the “membership card” — a visual identity for the
            pack. This page will become the home for supply info, traits, and
            drop schedules.
          </p>

          <div className="mt-6 p-5 rounded-2xl border border-white/10 bg-white/5">
            <p className="text-sm text-gray-300">
              Next up: featured tiles + trait filters + drop countdown.
            </p>
          </div>
        </Section>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 18 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-120px" }}
        transition={{ duration: 0.6 }}
      >
        <Section
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

      <footer className="py-10 text-xs text-gray-500 border-t border-white/10">
        © {new Date().getFullYear()} Intrigued Mutts
      </footer>
    </div>
  );
}
