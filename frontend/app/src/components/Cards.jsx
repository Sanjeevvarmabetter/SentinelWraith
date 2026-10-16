import React from "react";
import { UploadCloud, Cpu, ShieldAlert, Binary, Activity } from "lucide-react";

const workflowSteps = [
  {
    step: "01",
    tag: "PE INGESTION",
    title: "Binary Stream Ingestion",
    description: "Accepts raw Portable Executable (.exe, .dll) binaries in-memory with zero disk persistence for maximum confidentiality.",
    icon: UploadCloud,
    accent: "from-cyan-500/20 to-blue-500/10",
    border: "border-cyan-500/30",
    iconColor: "text-cyan-400",
    metric: "< 50ms read"
  },
  {
    step: "02",
    tag: "STATIC FEATURE EXTRACTION",
    title: "Header & Entropy Analysis",
    description: "Extracts DOS headers, section tables, and calculates Shannon entropy (0-8) to identify obfuscated and packed payloads (UPX, Themida).",
    icon: Binary,
    accent: "from-purple-500/20 to-pink-500/10",
    border: "border-purple-500/30",
    iconColor: "text-purple-400",
    metric: "78 Features"
  },
  {
    step: "03",
    tag: "AI ENSEMBLE CONSENSUS",
    title: "Multi-Model Inference",
    description: "Concurrent evaluation across Decision Trees, Random Forests, XGBoost, and LightGBM using Bagging + Hard Voting aggregation.",
    icon: Cpu,
    accent: "from-blue-500/20 to-indigo-500/10",
    border: "border-blue-500/30",
    iconColor: "text-blue-400",
    metric: "4 Classifiers"
  },
  {
    step: "04",
    tag: "THREAT TELEMETRY",
    title: "Risk Scoring & Insights",
    description: "Generates an explainable 0-100 Threat Score with MITRE ATT&CK categorized API mapping (process injection, keylogging, evasion).",
    icon: ShieldAlert,
    accent: "from-emerald-500/20 to-cyan-500/10",
    border: "border-emerald-500/30",
    iconColor: "text-emerald-400",
    metric: "Instant Verdict"
  }
];

const Cards = () => {
  return (
    <section className="py-16 px-6 max-w-6xl mx-auto w-full">
      <div className="text-center mb-12">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-mono bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-3">
          <Activity className="w-3.5 h-3.5 animate-pulse" />
          <span>REAL-TIME STATIC ANALYSIS PIPELINE</span>
        </div>
        <h3 className="text-3xl font-extrabold text-white tracking-tight sm:text-4xl">
          Engineered for <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Zero-Day Detection</span>
        </h3>
        <p className="mt-3 text-sm text-gray-400 max-w-2xl mx-auto">
          Unlike signature-based antiviruses that require prior infections, Sentinel Wraith analyzes structural anomalies and ML patterns to intercept novel threats.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {workflowSteps.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={index}
              className={`relative glass-panel rounded-2xl p-6 border ${item.border} hover:border-cyan-400/60 transition-all duration-300 hover:-translate-y-1 group hover:shadow-[0_10px_30px_-10px_rgba(6,182,212,0.25)] flex flex-col justify-between`}
            >
              {/* Top Row: Step badge and metric */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-gray-800 text-gray-300 border border-gray-700">
                    STEP {item.step}
                  </span>
                  <span className="font-mono text-[11px] text-cyan-400/90 font-semibold bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/40">
                    {item.metric}
                  </span>
                </div>

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${item.accent} border border-white/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 ${item.iconColor}`} />
                </div>

                <span className="block text-[10px] font-mono tracking-wider uppercase text-cyan-400/80 mb-1">
                  {item.tag}
                </span>
                <h4 className="text-base font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
                  {item.title}
                </h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              {/* Progress indicator at bottom */}
              <div className="mt-6 pt-4 border-t border-gray-800/60 flex items-center justify-between text-[11px] text-gray-500 font-mono">
                <span>Phase {item.step} of 04</span>
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 group-hover:animate-ping"></span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default Cards;
