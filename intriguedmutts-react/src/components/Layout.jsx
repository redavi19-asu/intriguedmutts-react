import Navbar from "./Navbar"

export default function Layout({ children }) {
  return (
    <div className="w-full min-h-screen bg-black text-white">
      <Navbar />

      <main className="pt-28 flex flex-col items-center w-full">
        {children}
      </main>
    </div>
  )
}
