import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  GitCompare,
  Binary,
  RefreshCw
} from "lucide-react";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const SAMPLES = [
  { id: "7zip-installer", name: "7-Zip Setup (Benign Utility)", type: "Benign" },
  { id: "wildfire-test", name: "WildFire Threat PE (Malware Sim)", type: "Malware" },
  { id: "greenshot-installer", name: "Greenshot Setup (GUI Tool)", type: "Benign" },
  { id: "win-diagnostic", name: "Windows Diagnostic (System PE)", type: "Diagnostic" }
];

export default function Compare() {
  const [sampleA, setSampleA] = useState("7zip-installer");
  const [sampleB, setSampleB] = useState("wildfire-test");
  const [loading, setLoading] = useState(false);
  const [compareData, setCompareData] = useState(null);
  const [error, setError] = useState(null);

  const fetchComparison = async (idA, idB) => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.post(`${API_BASE_URL}/compare`, {
        sample_a: idA,
        sample_b: idB
      });
      setCompareData(res.data);
    } catch (err) {
      console.error("Comparison error:", err);
      setError("Failed to generate side-by-side comparison. Please ensure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComparison(sampleA, sampleB);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRunCompare = (e) => {
    e.preventDefault();
    fetchComparison(sampleA, sampleB);
  };

  const reportA = compareData?.sample_a?.report;
  const reportB = compareData?.sample_b?.report;

  return (
    <div className="flex-1 py-10 px-4 sm:px-6 max-w-6xl mx-auto w-full">
      
      {/* Page Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-xs font-mono bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 mb-2">
          <GitCompare className="w-3.5 h-3.5" />
          <span>SIDE-BY-SIDE FORENSIC BENCHMARKING</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          Binary Comparison & Threat Diff
        </h1>
        <p className="mt-2 text-sm text-gray-400 max-w-2xl mx-auto">
          Compare two executables side-by-side to understand how benign software and weaponized malware diverge in entropy, API heuristics, and ML consensus.
        </p>
      </div>

      {/* Selector Bar */}
      <div className="glass-panel rounded-2xl p-6 border border-gray-800 mb-8">
        <form onSubmit={handleRunCompare} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
          
          <div className="sm:col-span-5 space-y-1">
            <label className="text-xs font-mono text-cyan-400 font-semibold block">
              SAMPLE A (Baseline Binary)
            </label>
            <select
              value={sampleA}
              onChange={(e) => setSampleA(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-400"
            >
              {SAMPLES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 text-center flex justify-center items-center">
            <div className="w-9 h-9 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <GitCompare className="w-4 h-4" />
            </div>
          </div>

          <div className="sm:col-span-5 space-y-1">
            <label className="text-xs font-mono text-purple-400 font-semibold block">
              SAMPLE B (Comparison Target)
            </label>
            <select
              value={sampleB}
              onChange={(e) => setSampleB(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-purple-400"
            >
              {SAMPLES.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

        </form>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-950/60 border border-red-500/50 text-red-200 text-xs">
          {error}
        </div>
      )}

      {loading && (
        <div className="glass-panel rounded-2xl p-12 border border-gray-800 text-center flex flex-col items-center justify-center">
          <RefreshCw className="w-8 h-8 text-cyan-400 animate-spin mb-3" />
          <p className="text-sm font-mono text-gray-300">Generating forensic comparison matrix...</p>
        </div>
      )}

      {/* Comparison Diff Table */}
      {!loading && reportA && reportB && (
        <div className="space-y-6">

          {/* High-Level Verdict Diff Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Card A */}
            <div className={`glass-panel rounded-2xl p-6 border ${
              reportA.threat_level === "CRITICAL"
                ? "border-red-500/50 bg-red-950/20"
                : reportA.threat_level === "ELEVATED"
                ? "border-amber-500/50 bg-amber-950/20"
                : "border-emerald-500/50 bg-emerald-950/20"
            }`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 px-2 py-0.5 rounded bg-cyan-950 border border-cyan-800/40">
                  SAMPLE A
                </span>
                <span className="text-xs font-mono text-gray-400">{reportA.filename}</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-xl font-extrabold ${
                    reportA.threat_level === "CRITICAL"
                      ? "text-red-400"
                      : reportA.threat_level === "ELEVATED"
                      ? "text-amber-400"
                      : "text-emerald-400"
                  }`}>
                    {reportA.verdict}
                  </h3>
                  <span className="text-xs text-gray-400 font-mono">Severity: {reportA.threat_level}</span>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-extrabold font-mono text-white">
                    {reportA.threat_score}
                  </span>
                  <span className="text-xs text-gray-500 font-mono">/100</span>
                </div>
              </div>
            </div>

            {/* Card B */}
            <div className={`glass-panel rounded-2xl p-6 border ${
              reportB.threat_level === "CRITICAL"
                ? "border-red-500/50 bg-red-950/20"
                : reportB.threat_level === "ELEVATED"
                ? "border-amber-500/50 bg-amber-950/20"
                : "border-emerald-500/50 bg-emerald-950/20"
            }`}>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[10px] font-mono uppercase tracking-wider text-purple-400 px-2 py-0.5 rounded bg-purple-950 border border-purple-800/40">
                  SAMPLE B
                </span>
                <span className="text-xs font-mono text-gray-400">{reportB.filename}</span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className={`text-xl font-extrabold ${
                    reportB.threat_level === "CRITICAL"
                      ? "text-red-400"
                      : reportB.threat_level === "ELEVATED"
                      ? "text-amber-400"
                      : "text-emerald-400"
                  }`}>
                    {reportB.verdict}
                  </h3>
                  <span className="text-xs text-gray-400 font-mono">Severity: {reportB.threat_level}</span>
                </div>
                <div className="text-right">
                  <span className="text-3xl font-extrabold font-mono text-white">
                    {reportB.threat_score}
                  </span>
                  <span className="text-xs text-gray-500 font-mono">/100</span>
                </div>
              </div>
            </div>

          </div>

          {/* Detailed Metric Diff Grid */}
          <div className="glass-panel rounded-2xl p-6 border border-gray-800">
            <h3 className="text-base font-bold text-white mb-4 pb-3 border-b border-gray-800 flex items-center space-x-2">
              <Binary className="w-4 h-4 text-cyan-400" />
              <span>Side-by-Side Security Comparison Matrix</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400">
                    <th className="pb-3 w-1/3">Security Property</th>
                    <th className="pb-3 w-1/3 text-cyan-300">Sample A ({reportA.filename})</th>
                    <th className="pb-3 w-1/3 text-purple-300">Sample B ({reportB.filename})</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800/60">
                  
                  <tr>
                    <td className="py-3 text-gray-400 font-medium">Authenticode Digital Signature</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] ${
                        reportA.security_profile?.digital_signature === "Signed"
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                          : "bg-gray-800 text-gray-300"
                      }`}>
                        {reportA.security_profile?.digital_signature || "Unsigned"}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] ${
                        reportB.security_profile?.digital_signature === "Signed"
                          ? "bg-emerald-950 text-emerald-300 border border-emerald-800"
                          : "bg-gray-800 text-gray-300"
                      }`}>
                        {reportB.security_profile?.digital_signature || "Unsigned"}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3 text-gray-400 font-medium">W^X Memory Protection</td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] ${
                        reportA.metadata?.has_rwx_sections
                          ? "bg-red-950 text-red-300 border border-red-800"
                          : "bg-emerald-950 text-emerald-300 border border-emerald-800"
                      }`}>
                        {reportA.metadata?.has_rwx_sections ? "VIOLATED (RWX sections)" : "ENFORCED (Compliant)"}
                      </span>
                    </td>
                    <td className="py-3">
                      <span className={`px-2 py-0.5 rounded text-[11px] ${
                        reportB.metadata?.has_rwx_sections
                          ? "bg-red-950 text-red-300 border border-red-800"
                          : "bg-emerald-950 text-emerald-300 border border-emerald-800"
                      }`}>
                        {reportB.metadata?.has_rwx_sections ? "VIOLATED (RWX sections)" : "ENFORCED (Compliant)"}
                      </span>
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3 text-gray-400 font-medium">Peak Shannon Entropy</td>
                    <td className="py-3 text-white font-bold">
                      {reportA.metadata?.max_entropy} / 8.0
                    </td>
                    <td className="py-3 text-white font-bold">
                      {reportB.metadata?.max_entropy} / 8.0
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3 text-gray-400 font-medium">MITRE ATT&CK Techniques</td>
                    <td className="py-3 text-cyan-300">
                      {reportA.mitre_attack?.length || 0} mapped techniques
                    </td>
                    <td className="py-3 text-purple-300">
                      {reportB.mitre_attack?.length || 0} mapped techniques
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3 text-gray-400 font-medium">AI Ensemble Agreement</td>
                    <td className="py-3">
                      {reportA.ml_analysis?.consensus_percentage}% ({reportA.ml_analysis?.prediction === 1 ? "Malicious" : "Clean"})
                    </td>
                    <td className="py-3">
                      {reportB.ml_analysis?.consensus_percentage}% ({reportB.ml_analysis?.prediction === 1 ? "Malicious" : "Clean"})
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3 text-gray-400 font-medium">Total PE Sections</td>
                    <td className="py-3 text-gray-300">
                      {reportA.metadata?.number_of_sections} sections
                    </td>
                    <td className="py-3 text-gray-300">
                      {reportB.metadata?.number_of_sections} sections
                    </td>
                  </tr>

                  <tr>
                    <td className="py-3 text-gray-400 font-medium">Compilation Timestamp</td>
                    <td className="py-3 text-gray-400 text-[11px]">
                      {reportA.metadata?.compile_time}
                    </td>
                    <td className="py-3 text-gray-400 text-[11px]">
                      {reportB.metadata?.compile_time}
                    </td>
                  </tr>

                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
}
