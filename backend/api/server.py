import numpy as np
import pefile
import joblib  # Use joblib instead of pickle
import os

from flask import Flask, request, jsonify
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
# Load the trained model d(joblib format)
MODEL_PATH = "bagging_voting_ensemble.joblib"

try:
    model = joblib.load(MODEL_PATH)
    print("Model loaded successfully!")
except Exception as e:
    print(f"Error loading model: {e}")
    model = None


def extract_features(file_path):
    """
    Extracts only the first 7 features from the PE file.
    """
    try:
        pe = pefile.PE(file_path)
        features = []

        # DOS Header features (taking only needed fields)
        dos_header_fields = [
            "e_magic", "e_cblp", "e_cp", "e_crlc", "e_cparhdr",
            "e_minalloc", "e_maxalloc"
        ]
        features.extend([getattr(pe.DOS_HEADER, field, 0) for field in dos_header_fields])

        return np.array(features[:7]).reshape(1, -1)  # Ensure exactly 7 features
    except Exception as e:
        print(f"Feature extraction error: {e}")
        return None


@app.route('/predict', methods=['POST'])
def predict():
    """
    Endpoint to predict whether the uploaded file is malware or not.
    """
    if 'file' not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files['file']
    
    # Save the file temporarily
    file_path = f"./uploads/{file.filename}"
    os.makedirs("./uploads", exist_ok=True)
    file.save(file_path)

    # Extract features
    features = extract_features(file_path)
    
    # Remove the temporary file
    os.remove(file_path)

    if features is None:
        return jsonify({"error": "Feature extraction failed"}), 500

    if model is None:
        return jsonify({"error": "Model not loaded"}), 500

    try:
        # Predict using the trained model
        prediction = model.predict(features)[0]
        return jsonify({"prediction": int(prediction)})
    except Exception as e:
        return jsonify({"error": f"Model prediction error: {e}"}), 500


if __name__ == '__main__':
    app.run(debug=True)
