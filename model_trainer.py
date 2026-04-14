"""
model_trainer.py
Trains a Random Forest model on synthetic energy data.
Saves the model so Flask can reload it without retraining every restart.
"""

import os
import numpy as np
import pandas as pd
import joblib
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score

from data_generator import generate_energy_data

# Feature columns used for training
FEATURES = ['temperature', 'humidity', 'hour', 'day_of_week',
            'is_weekend', 'day_of_year', 'month']
TARGET = 'energy_kwh'
MODEL_PATH = os.path.join(os.path.dirname(__file__), 'saved_model.joblib')


def train_and_save():
    """Train the model from scratch and save it to disk."""
    print("⚡ Generating synthetic energy data (2 years)...")
    df = generate_energy_data(days=730)

    X = df[FEATURES]
    y = df[TARGET]

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, shuffle=False
    )

    print("🤖 Training Random Forest Regressor...")
    model = RandomForestRegressor(
        n_estimators=150,
        max_depth=15,
        random_state=42,
        n_jobs=-1
    )
    model.fit(X_train, y_train)

    y_pred = model.predict(X_test)
    rmse = float(np.sqrt(mean_squared_error(y_test, y_pred)))
    r2   = float(r2_score(y_test, y_pred))

    print(f"✅ RMSE : {rmse:.2f} kWh")
    print(f"✅ R²   : {r2:.4f}  ({r2*100:.1f}% accuracy)")

    joblib.dump({'model': model, 'rmse': rmse, 'r2': r2}, MODEL_PATH)
    print(f"💾 Model saved → {MODEL_PATH}")

    return model, rmse, r2, df


def load_or_train():
    """
    Load model from disk if it exists, otherwise train a new one.
    Returns (model, rmse, r2, full_dataframe).
    """
    df = generate_energy_data(days=730)          # always regenerate data

    if os.path.exists(MODEL_PATH):
        print("📂 Loading pre-trained model from disk...")
        bundle = joblib.load(MODEL_PATH)
        model, rmse, r2 = bundle['model'], bundle['rmse'], bundle['r2']
        print(f"✅ Model loaded  |  RMSE={rmse:.2f}  R²={r2:.4f}")
        return model, rmse, r2, df

    # First run – train
    model, rmse, r2, df = train_and_save()
    return model, rmse, r2, df
