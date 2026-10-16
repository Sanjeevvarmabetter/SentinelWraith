import React from "react";
import { Shield, Terminal, Lock } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-gray-800/80 bg-[#07090e]/90 text-gray-400 py-10 mt-auto">
      <div className="container mx-auto px-6 max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Col 1: Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-400">
                <Shield className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-white tracking-wider text-base">
                SENTINEL <span className="text-cyan-400">WRAITH</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
              An advanced AI-powered static malware analysis and detection framework for Windows PE binaries.
              Leveraging stacked ensemble classifiers (XGBoost, LightGBM, CatBoost) to detect zero-day threats in sub-seconds.
            </p>
            <div className="flex items-center space-x-3 pt-2 text-xs font-mono text-gray-500">
              <span className="flex items-center space-x-1">
                <Lock className="w-3.5 h-3.5 text-cyan-400" />
                <span>Zero File Retention</span>
              </span>
              <span>•</span>
              <span className="flex items-center space-x-1">
                <Terminal className="w-3.5 h-3.5 text-purple-400" />
                <span>PE Static Extraction</span>
              </span>
            </div>
          </div>

          {/* Col 2: Core Architecture */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-semibold">
              Ensemble Models
            </h4>
            <ul className="space-y-1.5 text-xs text-gray-400">
              <li className="hover:text-cyan-400 transition-colors">XGBoost & XGB-DART</li>
              <li className="hover:text-cyan-400 transition-colors">LightGBM Meta-Learner</li>
              <li className="hover:text-cyan-400 transition-colors">CatBoost Classifier</li>
              <li className="hover:text-cyan-400 transition-colors">Bagging + Hard Voting</li>
            </ul>
          </div>

          {/* Col 3: Authors & Portfolio */}
          <div className="space-y-3">
            <h4 className="text-xs font-mono uppercase tracking-wider text-white font-semibold">
              Engineered By
            </h4>
            <div className="space-y-2 text-xs">
              <div>
                <p className="text-white font-medium">Sanjeev Varma</p>
                <p className="text-cyan-400 text-[11px] font-mono">Cybersecurity & Machine Learning</p>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-gray-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Sentinel Wraith. MIT Open Source License.</p>
          <p className="mt-2 sm:mt-0 flex items-center space-x-1">
            <span>Built with React, Flask, and Machine Learning</span>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
