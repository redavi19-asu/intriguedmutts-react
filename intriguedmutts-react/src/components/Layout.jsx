import Navbar from "./Navbar";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen w-full bg-black text-white overflow-x-hidden">
      <Navbar />

      {/* pt keeps content from hiding behind fixed navbar */}
      <main className="pt-20 w-full flex justify-center">
        <div className="w-full max-w-7xl px-6">{children}</div>
      </main>
    </div>
  );
}
