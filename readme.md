# 🛡️ Malware Detection using Advanced Stacked Ensemble

This project presents a **machine learning-based malware detection system** using an advanced stacked ensemble model. It extracts features from PE (Portable Executable) files and uses multiple classifiers (XGBoost, LightGBM, CatBoost, and XGBoost-DART) to predict if a given file is malicious. The model is deployed using a Flask API backend and a React-based frontend.

---

## 📁 Project Structure

```
├── backend/
│   ├── app.py                # Flask server
│   ├── bagging_voting_ensemble.joblib  # Trained ensemble model
│   └── uploads/              # Temp folder for uploaded files
│
├── frontend/
│   ├── public/
│   └── src/
│       └── App.js            # React code to send files for prediction
│
├── ensemble/
│   └── advanced_stacked_ensemble.py  # Model training script
│
└── README.md

---

## 🚀 Features

- 🔬 **Feature Extraction**: Extracts 7 critical fields from PE file headers.
- 🤖 **Advanced Ensemble Model**: Combines predictions from:
  - XGBoost
  - LightGBM
  - CatBoost
  - XGBoost-DART
- 🧠 **Meta Learner**: Uses LightGBM as a meta-classifier.
- 🌐 **Web Deployment**: Flask backend and React frontend for file upload and real-time malware prediction.
- 🔐 **Cross-Origin Support**: Configured with Flask-CORS for seamless frontend-backend integration.

---

## 📦 Dependencies

Install Python dependencies via:

```bash
pip install -r requirements.txt
```

Sample `requirements.txt`:

```
flask
flask-cors
pefile
joblib
xgboost
lightgbm
catboost
scikit-learn
pandas
numpy
```

Frontend (React):

```bash
npm install
```

---

## 🛠️ Usage

### 1. 🧠 Train the Ensemble Model

Navigate to the `ensemble/` directory and run:


python advanced_stacked_ensemble.py


Make sure your training dataset (`X_train`, `y_train`) is loaded inside the script.

### 2. ⚙️ Start the Backend (Flask API)

```bash
cd backend
python app.py
```

The Flask server will run on `http://localhost:5000`.

### 3. 🌍 Start the Frontend (React App)

```bash
cd frontend
npm start
```

This will open the React app on `http://localhost:3000`.

---

## 📤 API Endpoint

**POST** `/predict`

| Field | Type | Description |
|-------|------|-------------|
| file  | File | PE (.exe) file to analyze |

**Response**

```json
{
  "prediction": 1   // 1: Malware, 0: Benign
}
```

---

## 📈 Model Evaluation

The ensemble model is evaluated using cross-validation on:

- Accuracy
- Precision
- Recall
- F1-score
- ROC AUC

The stacked architecture helps reduce overfitting and improve generalization.

---

## 👨‍💻 Author

**Sanjeev Varma**  
Blockchain & Security Enthusiast  

**Santosh Vardhan**
Cybersecurity Engineer


---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
