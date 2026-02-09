
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen w-full bg-black text-white overflow-x-hidden">
        <Navbar />

        <main className="w-full flex justify-center">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
