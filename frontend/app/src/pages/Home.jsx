import { Link } from "react-router-dom";
import Cards from "../components/Cards";
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-white">
      {/* Header
      <header className="bg-gray-900 py-4 shadow-md">
        <div className="container mx-auto flex justify-between items-center px-6">
          <h1 className="text-2xl font-bold text-white-400">Malware Detector</h1>
          <nav>
            <ul className="flex space-x-6">
              <li><Link to="/" className="hover:text-gray-400">Home</Link></li>
              <li><Link to="/upload" className="hover:text-gray-400">Upload File</Link></li>
              <li><Link to="/about" className="hover:text-gray-400">About</Link></li>
            </ul>
          </nav>
        </div>
      </header> */}

      {/* Main Content */}
      <main className="flex flex-1 flex-col items-center justify-center text-center px-6">
        <h2 className="text-4xl font-extrabold text-purple-500 mb-4">
          Secure Your System with AI-powered Malware Detection
        </h2>
        <p className="text-lg text-gray-300 max-w-2xl">
          Upload your files and let our advanced machine learning model analyze them 
          for potential threats. Stay protected from malicious software.
        </p>
        <Link to="/upload">
          <button className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold text-lg hover:bg-green-800 transition duration-300">
            Scan a File Now
          </button>
        </Link>
      </main>
        <Cards />

    </div>
  );
}
