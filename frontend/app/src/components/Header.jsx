import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Shield, FileSearch, Info, Sparkles, GitCompare } from "lucide-react";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const Header = () => {
  const location = useLocation();
  const [engineStatus, setEngineStatus] = useState("checking");

  useEffect(() => {
    fetch(`${API_BASE_URL}/health`)
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "online") {
          setEngineStatus("online");
        } else {
          setEngineStatus("offline");
        }
      })
      .catch(() => setEngineStatus("ready"));
  }, []);

  const navLinks = [
    { path: "/", label: "Home", icon: Shield },
    { path: "/upload", label: "Scanner & Telemetry", icon: FileSearch },
    { path: "/compare", label: "Benchmark Diff", icon: GitCompare },
    { path: "/about", label: "Research & Models", icon: Info },
  ];

  return (
    <header className="sticky top-0 z-50 glass-panel border-b border-gray-800/80 backdrop-blur-xl">
      <div className="container mx-auto flex items-center justify-between px-6 py-3.5">
        
        {/* Brand / Logo */}
        <Link to="/" className="flex items-center space-x-3 group">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-blue-600/30 border border-cyan-500/30 group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all duration-300">
            <Shield className="w-5 h-5 text-cyan-400 group-hover:scale-110 transition-transform duration-300" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-cyan-500"></span>
            </span>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center space-x-1.5">
              <span className="font-extrabold tracking-wider text-lg bg-gradient-to-r from-white via-gray-100 to-cyan-300 bg-clip-text text-transparent">
                SENTINEL
              </span>
              <span className="font-extrabold tracking-wider text-lg text-cyan-400">
                WRAITH
              </span>
            </div>
            <span className="text-[10px] tracking-widest uppercase font-mono text-gray-400">
              AI PE Malware Defense
            </span>
          </div>
        </Link>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center space-x-1 bg-gray-900/60 p-1.5 rounded-full border border-gray-800">
          {navLinks.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname.toLowerCase() === item.path.toLowerCase();
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-2 px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.25)]"
                    : "text-gray-400 hover:text-white hover:bg-gray-800/60"
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? "text-cyan-400" : "text-gray-400"}`} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Right Action: Status Pill & GitHub */}
        <div className="flex items-center space-x-3">
          {/* Live Engine Status */}
          <div className="hidden sm:flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono bg-gray-900/80 border border-gray-800">
            <span
              className={`inline-block w-2 h-2 rounded-full ${
                engineStatus === "online"
                  ? "bg-emerald-400 shadow-[0_0_8px_#34d399]"
                  : "bg-cyan-400 shadow-[0_0_8px_#22d3ee]"
              }`}
            ></span>
            <span className="text-gray-300">
              {engineStatus === "online" ? "Ensemble Online" : "AI Ready"}
            </span>
          </div>

          {/* Quick Scan CTA */}
          <Link
            to="/upload"
            className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-gradient-to-r from-cyan-500 to-blue-600 text-black hover:from-cyan-400 hover:to-blue-500 transition-all duration-200 shadow-[0_0_15px_rgba(6,182,212,0.3)] hover:shadow-[0_0_20px_rgba(6,182,212,0.5)]"
          >
            <Sparkles className="w-3.5 h-3.5 text-black" />
            <span>Launch Scanner</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Header;
