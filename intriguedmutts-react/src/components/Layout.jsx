import Navbar from "./Navbar";
import Footer from "./Footer";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen w-full bg-black text-white overflow-x-hidden">
      <Navbar />

      {/* subtle background glow */}
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.10),transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom,rgba(255,255,255,0.06),transparent_55%)]" />
      </div>

      {/* pt keeps content from hiding behind fixed navbar */}
      <main className="pt-20 w-full flex justify-center">
        <div className="w-full max-w-7xl px-6">{children}</div>
      </main>

      <Footer />
    </div>
  );
}
