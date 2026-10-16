import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MalwareUpload from "./components/MalwareUpload";
import Compare from "./pages/Compare";
import Header from "./components/Header";
import Footer from "./components/Footer";
import About from "./components/About";

export default function App() {
  return (
    <Router>
      <div className="bg-[#05070c] text-gray-100 min-h-screen flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
        {/* Futuristic Global Header */}
        <Header />

        {/* Dynamic Page Router */}
        <main className="flex-grow flex flex-col">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<MalwareUpload />} />
            <Route path="/compare" element={<Compare />} />
            <Route path="/about" element={<About />} />
            <Route path="/About" element={<About />} />
          </Routes>
        </main>

        {/* Polished Global Footer */}
        <Footer />
      </div>
    </Router>
  );
}
