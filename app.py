"""
app.py  ─  AI Energy Forecasting  ─  Flask REST API
Run:  python app.py
"""

from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
import numpy as np
from datetime import timedelta

from model_trainer import load_or_train, FEATURES
from data_generator import generate_energy_data

# ─── App init ────────────────────────────────────────────────────────────────
app = Flask(__name__)
CORS(app)   # Allow React dev-server (port 5173) to call this API

# ─── Load model & data on startup ────────────────────────────────────────────
print("\n" + "="*55)
print("  ⚡ AI-Powered Energy Consumption Forecasting System")
print("="*55)
model, RMSE, R2, hist_df = load_or_train()
print("="*55 + "\n")


# ─── Helper ──────────────────────────────────────────────────────────────────
def make_future_features(start_ts, n_hours):
    """Build feature rows for n_hours starting at start_ts (no target col)."""
    rows = []
    for i in range(n_hours):
        ts = start_ts + timedelta(hours=i)
        doy  = ts.timetuple().tm_yday
        hour = ts.hour
        temp_s = 28 + 12 * np.sin(2 * np.pi * (doy - 80) / 365)
        temp_d = 4  * np.sin(2 * np.pi * (hour - 6) / 24)
        temp   = round(temp_s + temp_d, 1)
        hum    = float(np.clip(65 + 20 * np.sin(2 * np.pi * (doy - 150) / 365), 20, 100))
        rows.append({
            'timestamp':   ts.strftime('%Y-%m-%d %H:%M'),
            'temperature': temp,
            'humidity':    round(hum, 1),
            'hour':        hour,
            'day_of_week': ts.weekday(),
            'is_weekend':  int(ts.weekday() >= 5),
            'day_of_year': doy,
            'month':       ts.month,
        })
    return rows


# ─── Routes ──────────────────────────────────────────────────────────────────

@app.route('/api/health')
def health():
    return jsonify({'status': 'ok', 'message': 'API is running 🚀'})


@app.route('/api/historical')
def historical():
    """Return hourly data for the last N days (default 7)."""
    days = max(1, int(request.args.get('days', 7)))
    end   = hist_df['timestamp'].max()
    start = end - timedelta(days=days)

    sub = hist_df[hist_df['timestamp'] >= start].copy()
    sub['timestamp'] = sub['timestamp'].dt.strftime('%Y-%m-%d %H:%M')

    return jsonify({
        'days':    days,
        'records': len(sub),
        'data':    sub[['timestamp', 'energy_kwh', 'temperature', 'humidity']].to_dict(orient='records'),
    })


@app.route('/api/forecast')
def forecast():
    """Return ML-predicted hourly values for the next N days (default 7)."""
    days    = max(1, min(30, int(request.args.get('days', 7))))
    n_hours = days * 24
    start_ts = (hist_df['timestamp'].max() + timedelta(hours=1)).to_pydatetime()

    rows = make_future_features(start_ts, n_hours)
    feat_df = pd.DataFrame(rows)[FEATURES]
    preds   = model.predict(feat_df)

    result = []
    for i, row in enumerate(rows):
        result.append({
            'timestamp':   row['timestamp'],
            'energy_kwh':  round(float(preds[i]), 2),
            'temperature': row['temperature'],
            'humidity':    row['humidity'],
        })

    return jsonify({
        'days':       days,
        'total_hours': len(result),
        'forecast':   result,
    })


@app.route('/api/metrics')
def metrics():
    """Return model performance + dataset statistics."""
    total  = float(hist_df['energy_kwh'].sum())
    daily_totals = hist_df.groupby(hist_df['timestamp'].dt.date)['energy_kwh'].sum()
    avg_daily = float(daily_totals.mean())
    peak = float(hist_df['energy_kwh'].max())

    importance = {
        feat: round(float(imp), 4)
        for feat, imp in zip(FEATURES, model.feature_importances_)
    }
    # sort descending
    importance = dict(sorted(importance.items(), key=lambda x: -x[1]))

    return jsonify({
        'model_type':       'Random Forest Regressor',
        'rmse':             round(RMSE, 2),
        'r2_score':         round(R2, 4),
        'accuracy_percent': round(R2 * 100, 2),
        'total_energy_kwh': round(total, 2),
        'avg_daily_kwh':    round(avg_daily, 2),
        'peak_load_kwh':    round(peak, 2),
        'feature_importance': importance,
    })


@app.route('/api/daily-summary')
def daily_summary():
    """Aggregate energy per day for the last N days (default 30)."""
    days  = max(1, int(request.args.get('days', 30)))
    end   = hist_df['timestamp'].max()
    start = end - timedelta(days=days)

    sub = hist_df[hist_df['timestamp'] >= start].copy()
    sub['date'] = sub['timestamp'].dt.date

    agg = sub.groupby('date').agg(
        total_energy=('energy_kwh',  'sum'),
        avg_temp    =('temperature', 'mean'),
        peak_load   =('energy_kwh',  'max'),
    ).reset_index()

    agg['date']        = agg['date'].astype(str)
    agg['total_energy'] = agg['total_energy'].round(2)
    agg['avg_temp']     = agg['avg_temp'].round(1)
    agg['peak_load']    = agg['peak_load'].round(2)

    return jsonify({'data': agg.to_dict(orient='records')})


@app.route('/api/hourly-pattern')
def hourly_pattern():
    """Average energy by hour-of-day (for pattern chart)."""
    pattern = hist_df.groupby('hour')['energy_kwh'].mean().round(2).to_dict()
    return jsonify({'pattern': [{'hour': h, 'avg_energy': v} for h, v in pattern.items()]})


# ─── Run ─────────────────────────────────────────────────────────────────────
if __name__ == '__main__':
    app.run(debug=True, port=5000)
