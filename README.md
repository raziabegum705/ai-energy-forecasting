# ⚡ AI-Powered Energy Consumption Forecasting System

A full-stack machine learning project that predicts future electricity usage using a **Random Forest** model trained on 2 years of synthetic hourly energy data.

Built with **Python + Flask** (backend) and **React + Recharts** (frontend).

---

## 🖥️ Live Demo Screenshots

| Dashboard Overview | Forecast Tab | Analytics Tab |
|---|---|---|
| KPI cards + historical chart | ML-predicted area chart | Feature importance + model metrics |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Language | Python 3.11 |
| ML Model | Random Forest Regressor (scikit-learn) |
| Backend API | Flask + Flask-CORS |
| Data Processing | Pandas, NumPy |
| Frontend | React 18 + Vite |
| Charts | Recharts |
| Styling | Tailwind CSS |

---

## 📁 Folder Structure

```
ai-energy-forecasting/
│
├── backend/
│   ├── app.py               ← Flask REST API (6 endpoints)
│   ├── model_trainer.py     ← ML model train + save/load
│   ├── data_generator.py    ← Synthetic hourly energy data
│   └── requirements.txt     ← Python dependencies
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx          ← Main dashboard (4 tabs)
│       ├── api.js           ← Axios API calls
│       ├── index.css
│       └── components/
│           ├── MetricCard.jsx
│           ├── HistoryChart.jsx
│           ├── ForecastChart.jsx
│           ├── DailyChart.jsx
│           └── HourlyPatternChart.jsx
│
├── .gitignore
└── README.md
```

---

## 🚀 How to Run (VS Code)

### Prerequisites
- Python 3.9 or higher → https://python.org/downloads
- Node.js 18 or higher → https://nodejs.org

### Step 1 — Open the project in VS Code

```
File → Open Folder → select ai-energy-forecasting
```

---

### Step 2 — Start the Backend (Flask)

Open a **new terminal** in VS Code (`Ctrl + `` ` ```)

```bash
cd backend
```

**Create a virtual environment:**

```bash
# Windows
python -m venv venv
venv\Scripts\activate

# Mac / Linux
python3 -m venv venv
source venv/bin/activate
```

**Install dependencies:**

```bash
pip install -r requirements.txt
```

**Run the Flask server:**

```bash
python app.py
```

You should see:
```
⚡ AI-Powered Energy Consumption Forecasting System
Generating synthetic energy data (2 years)...
Training Random Forest Regressor...
✅ RMSE : 9.xx kWh
✅ R²   : 0.9x  (9x.x% accuracy)
Model saved → saved_model.joblib
Running on http://127.0.0.1:5000
```

> The model trains once and saves to `saved_model.joblib`.
> Future restarts load it from disk (much faster).

---

### Step 3 — Start the Frontend (React)

Open a **second terminal** in VS Code (`Ctrl + `` ` `` → click the `+` icon`)

```bash
cd frontend
npm install
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms
➜  Local:   http://localhost:5173/
```

---

### Step 4 — Open in browser

Go to: **http://localhost:5173**

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/health` | Server health check |
| GET | `/api/historical?days=7` | Historical hourly data |
| GET | `/api/forecast?days=7` | ML-predicted future energy |
| GET | `/api/metrics` | Model metrics + feature importance |
| GET | `/api/daily-summary?days=30` | Daily aggregated totals |
| GET | `/api/hourly-pattern` | Avg energy by hour-of-day |

---

## 🧠 How the ML Model Works

1. **Data Generation** — 2 years of synthetic hourly readings with realistic patterns:
   - Morning and evening peaks
   - Temperature-dependent AC usage
   - Weekend vs weekday difference
   - Seasonal variation (Indian climate)

2. **Features Used**:
   - `temperature`, `humidity`
   - `hour`, `day_of_week`, `is_weekend`
   - `day_of_year`, `month`

3. **Model** — `RandomForestRegressor(n_estimators=150)` from scikit-learn

4. **Evaluation** — 80/20 train-test split, RMSE and R² metrics

5. **Forecasting** — Model predicts future values by generating feature rows for upcoming timestamps

---

## 📊 Dashboard Features

| Tab | What you see |
|---|---|
| 🏠 Overview | 4 KPI cards, historical chart, forecast chart, daily bar chart |
| 📈 History | Adjustable history window (3/7/14/30 days), hourly pattern, raw data table |
| 🔮 Forecast | Adjustable forecast horizon (1/3/7/14 days), forecast data table |
| 🧠 Analytics | R², RMSE, feature importance bars, tech stack |

---

## 🐙 Push to GitHub

```bash
# Inside the ai-energy-forecasting folder
git init
git add .
git commit -m "feat: AI Energy Forecasting System - Flask + React + Random Forest"
git remote add origin https://github.com/YOUR_USERNAME/ai-energy-forecasting.git
git push -u origin main
```

---

## 👩‍💻 Author

**Razia** — B.Tech CSE, Gates Institute of Technology  
🎯 Target: Cisco | Google | Product-Based Companies  
🔗 LinkedIn · GitHub

---

## 📜 License

MIT — free to use for portfolio, internships, and placement interviews.
