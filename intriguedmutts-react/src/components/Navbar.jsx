import { Link } from "react-router-dom"

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 bg-black/70 backdrop-blur border-b border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="font-black tracking-widest">
          INTRIGUED MUTTS
        </Link>

        <div className="space-x-6 text-sm uppercase tracking-wider">
          <Link to="/nfts" className="hover:text-gray-400">NFTs</Link>
          <Link to="/merch" className="hover:text-gray-400">Merch</Link>
          <Link to="/about" className="hover:text-gray-400">Society</Link>
        </div>
      </div>
    </nav>
  )
}
