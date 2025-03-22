import React from "react";

const Cards = () => {
  return (
    <section className="bg-blue-gray-900 ">
      <h3 className="text-2xl font-bold text-center text-white">Workflow</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 px-2">
        
        {/* Step 1: File Upload */}
        <div className="bg-blue-gray-800 p-2 rounded-lg text-center space-y-1 shadow-md">
          <span className="text-blue-400 text-2xl">📤</span>
          <h4 className="text-base font-semibold text-white">Upload File</h4>
          <p className="text-xs text-gray-300">
            Users upload a file for malware analysis.
          </p>
        </div>

        {/* Step 2: Preprocessing */}
        <div className="bg-blue-gray-800 p-2 rounded-lg text-center space-y-1 shadow-md">
          <span className="text-green-400 text-2xl">⚙️</span>
          <h4 className="text-base font-semibold text-white">Preprocessing</h4>
          <p className="text-xs text-gray-300">
            The system extracts key features from the uploaded file.
          </p>
        </div>

        {/* Step 3: Malware Detection */}
        <div className="bg-blue-gray-800 p-2 rounded-lg text-center space-y-1 shadow-md">
          <span className="text-red-400 text-2xl">🛡️</span>
          <h4 className="text-base font-semibold text-white">Malware Analysis</h4>
          <p className="text-xs text-gray-300">
            A machine learning model predicts whether the file is malicious.
          </p>
        </div>

        {/* Step 4: Result Display */}
        <div className="bg-blue-gray-800 p-2 rounded-lg text-center space-y-1 shadow-md">
          <span className="text-yellow-400 text-2xl">✅</span>
          <h4 className="text-base font-semibold text-white">Detection Result</h4>
          <p className="text-xs text-gray-300">
            The system provides an alert if malware is detected.
          </p>
        </div>

      </div>
    </section>
  );
};

export default Cards;
