from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import joblib
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
import os
import magic
import logging
from models import AdvancedStackedEnsemble

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Load model, scaler, PCA
MODEL_PATH = "model/advanced_stacked_ensemble.joblib"
model = joblib.load(MODEL_PATH)
scaler = StandardScaler()
pca = PCA(n_components=7)
X_train = pd.read_csv("X_train.csv")
scaler.fit(X_train)
pca.fit(scaler.transform(X_train))
logger.debug(f"X_train Mean: {X_train.mean().to_dict()}")

def extract_features(file_path):
    mime = magic.Magic(mime=True)
    file_type = mime.from_file(file_path)
    logger.debug(f"Detected MIME type: {file_type}")
    
    executable_mime_types = [
        'application/x-executable',
        'application/x-dosexec',
        'application/x-msdownload',
        'application/octet-stream',
        'application/x-pie-executable',
    ]
    
    if not any(mime_type in file_type for mime_type in executable_mime_types):
        raise ValueError(f"Only executable files are supported. Detected: {file_type}")
    
    features = {
        'size': os.path.getsize(file_path),
        'entropy': calculate_entropy(open(file_path, 'rb').read())
        # Add real feature extraction here
    }
    return pd.DataFrame([features])

def calculate_entropy(data):
    if len(data) == 0:
        return 0
    from collections import Counter
    import math
    entropy = 0
    for x in Counter(data).values():
        p_x = x / len(data)
        entropy -= p_x * math.log2(p_x)
    return entropy

def preprocess_uploaded_data(df):
    expected_columns = X_train.columns
    missing_cols = [col for col in expected_columns if col not in df.columns]
    if len(missing_cols) > len(expected_columns) * 0.5:
        raise ValueError("Insufficient features for prediction.")
    
    for col in expected_columns:
        if col not in df.columns:
            df[col] = X_train[col].mean()
    
    df = df[expected_columns]
    X_scaled = scaler.transform(df)
    X_pca = pca.transform(X_scaled)
    return X_pca

@app.route('/predict', methods=['POST'])
def predict():
    if 'file' not in request.files:
        return jsonify({'error': 'No file uploaded'}), 400
    
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No file selected'}), 400
    
    temp_path = "temp_uploaded_file"
    try:
        file.save(temp_path)
        feature_df = extract_features(temp_path)
        logger.debug(f"Extracted Features: {feature_df.to_dict()}")
        
        X_processed = preprocess_uploaded_data(feature_df)
        logger.debug(f"Processed Features (post-PCA): {X_processed.tolist()}")
        
        final_probas, base_probas = model.predict_proba(X_processed)
        predictions = 'Malware' if final_probas[0][1] > 0.7 else 'Benign'
        
        result = {
            'prediction': predictions,
            'confidence': float(final_probas[0][1]),
            'base_model_predictions': {name: float(proba[0]) for name, proba in base_probas.items()}
        }
        
        os.remove(temp_path)
        return jsonify({'result': result})
    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        return jsonify({'error': str(e)}), 500

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({'status': 'healthy'}), 200

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)