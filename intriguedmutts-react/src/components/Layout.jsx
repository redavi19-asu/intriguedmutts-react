import Navbar from "./Navbar"

export default function Layout({ children }) {
  return (
    <div className="bg-black text-white min-h-screen">
      <Navbar />

      <main className="pt-28 flex justify-center">
        <div className="w-full max-w-7xl">
          {children}
        </div>
      </main>
    </div>
  )
}
