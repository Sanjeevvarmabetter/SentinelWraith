import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center py-10 px-6">
      <div className="max-w-3xl text-center">
        <h1 className="text-3xl font-bold text-purple-400 mb-4">About Malware Detector</h1>
        <p className="text-gray-300 mb-6">
          Malware Detector is a web-based application designed to analyze files and detect potential malware threats using advanced machine learning techniques.
          The system processes uploaded files, extracts critical features, and predicts whether a file is malicious or safe.
        </p>
        <h2 className="text-2xl font-semibold text-purple-300 mb-3">Key Features</h2>
        <ul className="text-gray-300 space-y-2 text-left list-disc list-inside">
          <li>🔍 <span className="font-semibold">File Upload:</span> Securely upload files for analysis.</li>
          <li>⚙️ <span className="font-semibold">Preprocessing:</span> Feature extraction and data transformation.</li>
          <li>🛡️ <span className="font-semibold">Malware Detection:</span> Machine learning-based classification.</li>
          <li>✅ <span className="font-semibold">Instant Results:</span> Get a quick risk assessment of your file.</li>
        </ul>
        <h2 className="text-2xl font-semibold text-purple-300 mt-6 mb-3">Technology Stack</h2>
        <ul className="text-gray-300 space-y-2 text-left list-disc list-inside">
          <li>Frontend: React</li>
          <li>Backend: Python(FLASK)</li>
          <li>Machine Learning Model: Python (Flask, Scikit-Learn, TensorFlow)</li>
          {/* <li>Database: MongoDB</li> */}
        </ul>
        <h2 className="text-2xl font-semibold text-purple-300 mt-6 mb-3">Why This Project?</h2>
        <p className="text-gray-300">
          With the increasing number of cyber threats, our goal is to provide an accessible and efficient malware detection tool that can help individuals and organizations safeguard their systems from potential attacks.
        </p>
      </div>
    </div>
  );
};

export default About;
