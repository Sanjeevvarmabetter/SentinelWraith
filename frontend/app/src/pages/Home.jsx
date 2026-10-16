import React from "react";
import { Link, useNavigate } from "react-router-dom";
import Cards from "../components/Cards";
import { Shield, Sparkles, Terminal, ArrowRight, Zap, GitCompare } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();

  const handleLaunchSample = (sampleId) => {
    navigate(`/upload?sample=${sampleId}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-[#05070c] cyber-grid relative overflow-hidden">
      
      {/* Decorative ambient glowing orbs */}
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-cyan-500/10 blur-[130px] rounded-full pointer-events-none -z-10"></div>
      <div className="absolute top-96 right-10 w-[400px] h-[300px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

      {/* Hero Section */}
      <section className="pt-20 pb-16 px-6 text-center max-w-5xl mx-auto flex flex-col items-center">
        
        {/* Top Tag Pill */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full text-xs font-mono bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 mb-6 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>ADVANCED MACHINE LEARNING CYBERSECURITY</span>
          <span className="w-1 h-1 rounded-full bg-cyan-400"></span>
          <span className="text-gray-400">v2.1</span>
        </div>

        {/* Hero Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-[1.15]">
          Autonomous <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-purple-400 bg-clip-text text-transparent">PE Malware Detection</span> via Stacked Ensembles
        </h1>

        {/* Hero Subtitle */}
        <p className="mt-6 text-base sm:text-lg text-gray-300 max-w-2xl leading-relaxed">
          Sentinel Wraith dissects Windows Portable Executable binaries at machine speed.
          Combining <span className="text-cyan-400 font-semibold">PE header analysis</span>, <span className="text-purple-400 font-semibold">Shannon entropy scanning</span>, and a <span className="text-emerald-400 font-semibold">4-model ML voting ensemble</span> to uncover obfuscated zero-day threats.
        </p>

        {/* CTA Button Group */}
        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <Link
            to="/upload"
            className="w-full sm:w-auto flex items-center justify-center space-x-2.5 px-7 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-cyan-500 via-cyan-400 to-blue-500 text-black hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 shadow-[0_0_30px_rgba(6,182,212,0.4)] hover:shadow-[0_0_40px_rgba(6,182,212,0.6)] hover:scale-[1.02]"
          >
            <Shield className="w-4 h-4 text-black" />
            <span>Launch Deep Scanner</span>
            <ArrowRight className="w-4 h-4 text-black" />
          </Link>

          <Link
            to="/compare"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl font-medium text-sm glass-panel text-cyan-300 hover:text-white hover:border-cyan-500/50 transition-all duration-300"
          >
            <GitCompare className="w-4 h-4 text-cyan-400" />
            <span>Side-by-Side Diff Tool</span>
          </Link>

          <Link
            to="/about"
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3.5 rounded-xl font-medium text-sm glass-panel text-gray-300 hover:text-white hover:border-gray-700 transition-all duration-300"
          >
            <Terminal className="w-4 h-4 text-gray-400" />
            <span>Architecture & Research</span>
          </Link>
        </div>

        {/* Recruiter 1-Click Demo Sandbox */}
        <div className="mt-12 w-full glass-panel rounded-2xl p-5 border border-cyan-500/20 text-left">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 mb-4 border-b border-gray-800 gap-2">
            <div>
              <div className="flex items-center space-x-2">
                <Zap className="w-4 h-4 text-amber-400" />
                <h4 className="text-sm font-bold text-white">Recruiter 1-Click Interactive Test Sandbox</h4>
              </div>
              <p className="text-xs text-gray-400 mt-0.5">
                Don't have a Windows .exe binary on hand? Click any pre-loaded binary to run instant live telemetry:
              </p>
            </div>
            <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded border border-cyan-800/40 self-start sm:self-auto">
              Ready for Instant Scan
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <button
              onClick={() => handleLaunchSample("wildfire-test")}
              className="p-3 rounded-xl bg-gray-900/80 border border-red-500/30 hover:border-red-400/70 hover:bg-red-950/20 transition-all text-left group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-400 group-hover:text-red-300">WildFire Threat PE</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-red-950 text-red-300 border border-red-800/50">Malware Sim</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">
                Palo Alto WildFire test binary with packed entropy & registry hooks.
              </p>
            </button>

            <button
              onClick={() => handleLaunchSample("7zip-installer")}
              className="p-3 rounded-xl bg-gray-900/80 border border-emerald-500/30 hover:border-emerald-400/70 hover:bg-emerald-950/20 transition-all text-left group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-400 group-hover:text-emerald-300">7-Zip Installer</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/50">Benign</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">
                Authentic official 7-Zip installation package with clean structure.
              </p>
            </button>

            <button
              onClick={() => handleLaunchSample("greenshot-installer")}
              className="p-3 rounded-xl bg-gray-900/80 border border-cyan-500/30 hover:border-cyan-400/70 hover:bg-cyan-950/20 transition-all text-left group"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-400 group-hover:text-cyan-300">Greenshot Setup</span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800/50">Utility</span>
              </div>
              <p className="text-[11px] text-gray-400 mt-1 line-clamp-2">
                Open-source screenshot utility exhibiting typical installer runtime unpacking.
              </p>
            </button>
          </div>
        </div>

        {/* Stats Matrix Grid */}
        <div className="mt-14 w-full grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="glass-panel rounded-xl p-4 border border-gray-800">
            <div className="text-2xl sm:text-3xl font-extrabold text-cyan-400 font-mono">4</div>
            <div className="text-xs text-gray-400 mt-1">Ensemble Classifiers</div>
            <div className="text-[10px] text-gray-500 mt-0.5">DT, RF, XGB, LGBM</div>
          </div>

          <div className="glass-panel rounded-xl p-4 border border-gray-800">
            <div className="text-2xl sm:text-3xl font-extrabold text-purple-400 font-mono">19,600+</div>
            <div className="text-xs text-gray-400 mt-1">Dataset Binaries</div>
            <div className="text-[10px] text-gray-500 mt-0.5">BODMAS & VirusShare</div>
          </div>

          <div className="glass-panel rounded-xl p-4 border border-gray-800">
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-400 font-mono">&lt; 250ms</div>
            <div className="text-xs text-gray-400 mt-1">Static Latency</div>
            <div className="text-[10px] text-gray-500 mt-0.5">Zero-Execution Sandbox</div>
          </div>

          <div className="glass-panel rounded-xl p-4 border border-gray-800">
            <div className="text-2xl sm:text-3xl font-extrabold text-amber-400 font-mono">0-Day</div>
            <div className="text-xs text-gray-400 mt-1">Entropy & Heuristics</div>
            <div className="text-[10px] text-gray-500 mt-0.5">Packer & API Detection</div>
          </div>
        </div>

      </section>

      {/* Interactive Workflow Cards */}
      <Cards />

    </div>
  );
}
