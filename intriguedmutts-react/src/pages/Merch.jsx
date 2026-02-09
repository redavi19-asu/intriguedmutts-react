export default function Merch() {
  return (
    <section className="min-h-screen py-32">
      <div className="max-w-7xl mx-auto px-6 text-center">
        <h1 className="text-5xl font-black">MERCH DROP</h1>
        <p className="mt-4 text-white/70">
          Apparel. Prints. Limited runs.
        </p>

        <div className="mt-16 grid sm:grid-cols-2 md:grid-cols-3 gap-8">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <div className="aspect-square bg-white/10 rounded-xl mb-4" />
              <p className="font-semibold">Drop Item #{i}</p>
              <p className="text-sm text-white/60">$—</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
