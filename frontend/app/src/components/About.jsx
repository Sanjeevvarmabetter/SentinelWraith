import React from "react";
import { Shield, Cpu, Binary, Award, BookOpen } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-[#05070c] py-12 px-4 sm:px-6 max-w-5xl mx-auto text-gray-200">
      
      {/* Header Banner */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full text-xs font-mono bg-purple-500/10 border border-purple-500/30 text-purple-300 mb-3">
          <BookOpen className="w-3.5 h-3.5" />
          <span>RESEARCH & ENGINEERING DOCUMENTATION</span>
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight">
          About <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Sentinel Wraith</span>
        </h1>
        <p className="mt-3 text-sm sm:text-base text-gray-400 max-w-2xl mx-auto leading-relaxed">
          An in-depth look at our ensemble machine learning architecture, PE static analysis pipeline, and heuristic threat intelligence engine.
        </p>
      </div>

      <div className="space-y-8">
        
        {/* Section 1: Motivation & Threat Landscape */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-gray-800">
          <div className="flex items-center space-x-2.5 pb-3 mb-4 border-b border-gray-800">
            <Shield className="w-5 h-5 text-cyan-400" />
            <h2 className="text-lg font-bold text-white">1. Project Motivation & Paradigm Shift</h2>
          </div>
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
            Traditional signature-based antivirus solutions (e.g. SHA-256 blacklists) fail against modern polymorphic and metamorphic malware that alters its cryptographic signature on every compile or infection. Dynamic sandboxing, while effective, suffers from significant execution latency (several minutes) and can be easily evaded using sleep timers or virtual machine detection.
          </p>
          <p className="mt-3 text-xs sm:text-sm text-gray-300 leading-relaxed">
            <strong>Sentinel Wraith</strong> addresses this challenge through zero-execution static analysis. By extracting structural, syntactic, and statistical indicators directly from the Portable Executable (PE) headers and applying trained ensemble models, it delivers sub-250ms threat determination with zero risk of host machine infection.
          </p>
        </div>

        {/* Section 2: Machine Learning Architecture */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-gray-800">
          <div className="flex items-center space-x-2.5 pb-3 mb-4 border-b border-gray-800">
            <Cpu className="w-5 h-5 text-purple-400" />
            <h2 className="text-lg font-bold text-white">2. Ensemble Machine Learning Architecture</h2>
          </div>
          
          <p className="text-xs sm:text-sm text-gray-300 leading-relaxed mb-6">
            Single classifiers often overfit on specific malware families or suffer from bias. Sentinel Wraith leverages a dual ensemble strategy combining <strong>Bagging (Bootstrap Aggregating)</strong> and <strong>Voting / Stacking Classifiers</strong>:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800">
              <span className="text-xs font-mono text-cyan-400 font-bold block mb-1">
                BASE ESTIMATORS
              </span>
              <ul className="space-y-1.5 text-xs text-gray-300">
                <li>• <strong>XGBoost:</strong> Gradient boosted decision trees with regularization to mitigate overfitting.</li>
                <li>• <strong>LightGBM:</strong> Fast histogram-based gradient boosting optimized for high-dimensional tables.</li>
                <li>• <strong>Random Forest:</strong> Bagged decision trees ensuring low model variance across binary distributions.</li>
                <li>• <strong>Decision Trees:</strong> Rapid baseline rule-induction trees.</li>
              </ul>
            </div>

            <div className="p-4 rounded-xl bg-gray-900/60 border border-gray-800">
              <span className="text-xs font-mono text-purple-400 font-bold block mb-1">
                AGGREGATION & CONSENSUS
              </span>
              <ul className="space-y-1.5 text-xs text-gray-300">
                <li>• <strong>Hard Voting Ensemble:</strong> Combines predictions using majority rule with transparent confidence scores.</li>
                <li>• <strong>Meta-Learner Stacking:</strong> Trained meta-classifier (LightGBM) using out-of-fold probability distributions as meta-features.</li>
                <li>• <strong>SMOTE Balancing:</strong> Synthetic Minority Over-sampling to prevent benign/malware class imbalance skew.</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 3: Feature Extraction & Static Analysis */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-gray-800">
          <div className="flex items-center space-x-2.5 pb-3 mb-4 border-b border-gray-800">
            <Binary className="w-5 h-5 text-emerald-400" />
            <h2 className="text-lg font-bold text-white">3. PE Static Feature Extraction Pipeline</h2>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-gray-300">
            <div>
              <h3 className="text-white font-semibold text-xs font-mono uppercase text-cyan-300">
                DOS & Optional Headers
              </h3>
              <p className="mt-1 leading-relaxed">
                Extracts fundamental execution fields: <code className="text-cyan-400 bg-gray-900 px-1 py-0.5 rounded font-mono">e_magic</code>, <code className="text-cyan-400 bg-gray-900 px-1 py-0.5 rounded font-mono">e_cblp</code>, <code className="text-cyan-400 bg-gray-900 px-1 py-0.5 rounded font-mono">e_cp</code>, <code className="text-cyan-400 bg-gray-900 px-1 py-0.5 rounded font-mono">TimeDateStamp</code>, <code className="text-cyan-400 bg-gray-900 px-1 py-0.5 rounded font-mono">AddressOfEntryPoint</code>, and Image Base.
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold text-xs font-mono uppercase text-purple-300">
                Shannon Entropy & Obfuscation Detection
              </h3>
              <p className="mt-1 leading-relaxed">
                Calculates byte randomness per PE section (.text, .data, .rdata, .rsrc). Shannon entropy values exceeding 7.0 strongly indicate encrypted payloads, compressed shellcode, or runtime packers (such as UPX, Themida, ASPack).
              </p>
            </div>

            <div>
              <h3 className="text-white font-semibold text-xs font-mono uppercase text-amber-300">
                MITRE ATT&CK Import API Mapping
              </h3>
              <p className="mt-1 leading-relaxed">
                Scans the Import Address Table (IAT) for dual-use and weaponized Windows APIs categorized by technique:
                Process Injection (<code className="font-mono text-amber-400">VirtualAllocEx</code>, <code className="font-mono text-amber-400">WriteProcessMemory</code>), Anti-Debugging (<code className="font-mono text-amber-400">IsDebuggerPresent</code>), Privilege Escalation (<code className="font-mono text-amber-400">AdjustTokenPrivileges</code>), and C2 Communication (<code className="font-mono text-amber-400">URLDownloadToFileA</code>).
              </p>
            </div>
          </div>
        </div>

        {/* Section 4: Engineering Team */}
        <div className="glass-panel rounded-2xl p-6 sm:p-8 border border-gray-800">
          <div className="flex items-center space-x-2.5 pb-3 mb-6 border-b border-gray-800">
            <Award className="w-5 h-5 text-amber-400" />
            <h2 className="text-lg font-bold text-white">4. Project Author & Portfolio Credits</h2>
          </div>

          <div className="max-w-xl">
            <div className="p-5 rounded-xl bg-gray-900/60 border border-gray-800 space-y-2">
              <span className="text-base font-bold text-white block">Sanjeev Varma</span>
              <span className="text-xs font-mono text-cyan-400 block">Lead Cybersecurity & Machine Learning Engineer</span>
              <p className="text-xs text-gray-300 leading-relaxed">
                Specializing in static malware analysis, machine learning ensemble architectures, cryptographic systems, and full-stack threat detection platforms.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default About;
