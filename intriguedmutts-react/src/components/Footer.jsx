export default function Footer() {
  return (
    <footer className="border-t border-white/10 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-10 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
        <div>
          <p className="text-sm font-semibold">Intrigued Mutts Society</p>
          <p className="mt-1 text-xs text-white/60">
            Chaos • Culture • Curiosity
          </p>
        </div>

        <div className="flex gap-4 text-xs text-white/60">
          <a className="hover:text-white transition" href="#society">Society</a>
          <a className="hover:text-white transition" href="#merch">Merch</a>
          <a className="hover:text-white transition" href="#stock">Stocks</a>
          <a className="hover:text-white transition" href="#nfts">NFTs</a>
        </div>

        <p className="text-xs text-white/50">
          © {new Date().getFullYear()} Intrigued Mutts
        </p>
      </div>
    </footer>
  );
}
