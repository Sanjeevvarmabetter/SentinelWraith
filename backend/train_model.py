import pandas as pd
import numpy as np
import pickle
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler

# Load dataset
df = pd.read_csv("malware_dataset.csv")

# Drop non-numeric and unnecessary columns
df.drop(columns=["Name"], inplace=True)  # Drop 'Name' column

# Handle missing values (replace with 0)
df.fillna(0, inplace=True)

# Extract features and target variable
X = df.drop(columns=["Malware"])  # Features
y = df["Malware"]                 # Target variable (1 = Malware, 0 = Safe)

# Normalize feature values
scaler = StandardScaler()
X_scaled = scaler.fit_transform(X)

# Split dataset
X_train, X_test, y_train, y_test = train_test_split(X_scaled, y, test_size=0.2, random_state=42)

# Train Random Forest Model
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# Save Model and Scaler
pickle.dump(model, open("model.pkl", "wb"))
pickle.dump(scaler, open("scaler.pkl", "wb"))

print("✅ Model training complete. Model and scaler saved!")
