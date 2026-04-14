"""
data_generator.py
Generates synthetic hourly energy consumption data
with realistic patterns (temperature, time-of-day, weekends, seasons)
"""

import pandas as pd
import numpy as np
from datetime import datetime, timedelta


def generate_energy_data(days=730):
    """
    Generate 2 years of synthetic hourly energy data.
    Includes: temperature, humidity, hour, weekday, season effects.
    """
    np.random.seed(42)

    start_date = datetime(2023, 1, 1)
    timestamps = pd.date_range(start=start_date, periods=days * 24, freq='H')
    n = len(timestamps)

    day_of_year = np.array([t.day_of_year for t in timestamps])
    hour = np.array([t.hour for t in timestamps])
    month = np.array([t.month for t in timestamps])
    day_of_week = np.array([t.dayofweek for t in timestamps])

    # --- Temperature (India-like: peaks in summer May-June) ---
    temp_seasonal = 28 + 12 * np.sin(2 * np.pi * (day_of_year - 80) / 365)
    temp_daily = 4 * np.sin(2 * np.pi * (hour - 6) / 24)
    temperature = temp_seasonal + temp_daily + np.random.normal(0, 1.5, n)

    # --- Humidity ---
    humidity = 65 + 20 * np.sin(2 * np.pi * (day_of_year - 150) / 365)
    humidity = np.clip(humidity + np.random.normal(0, 5, n), 20, 100)

    # --- Weekend flag ---
    is_weekend = (day_of_week >= 5).astype(int)

    # --- Energy consumption model ---
    # Base: day-night cycle
    base = 120 + 60 * np.sin(2 * np.pi * (hour - 7) / 24)

    # Peak morning (8-10 AM) and evening (6-9 PM)
    morning_peak = 20 * np.exp(-0.5 * ((hour - 9) / 1.5) ** 2)
    evening_peak = 30 * np.exp(-0.5 * ((hour - 20) / 1.5) ** 2)

    # AC effect when hot
    ac_effect = 3 * np.maximum(temperature - 26, 0)

    # Weekend: lower industrial load
    weekend_drop = -25 * is_weekend

    # Seasonal office effect
    seasonal = 8 * np.sin(2 * np.pi * day_of_year / 365)

    # Random noise
    noise = np.random.normal(0, 8, n)

    energy = base + morning_peak + evening_peak + ac_effect + weekend_drop + seasonal + noise
    energy = np.round(np.maximum(energy, 20), 2)   # never go below 20 kWh

    df = pd.DataFrame({
        'timestamp':   timestamps,
        'energy_kwh':  energy,
        'temperature': np.round(temperature, 1),
        'humidity':    np.round(humidity, 1),
        'hour':        hour,
        'day_of_week': day_of_week,
        'is_weekend':  is_weekend,
        'day_of_year': day_of_year,
        'month':       month,
    })

    return df
