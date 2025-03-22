import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import MalwareUpload from "./components/MalwareUpload";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Cards from "./components/Cards";
import About from "./components/About";
export default function App() {
  return (
    <Router>
      <div className="bg-black text-white min-h-screen flex flex-col">
        {/* Global Header */}
        <Header />

        {/* Page Routes */}
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/upload" element={<MalwareUpload />} />
            <Route path="/About" element={<About />} />
          </Routes>
        </div>
      {/* <Cards /> */}
        {/* Global Footer */}
        <Footer />
      </div>
    </Router>
  );
}
