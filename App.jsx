/**
 * App.jsx  ─  Main dashboard for AI Energy Forecasting System
 */

import { useState, useEffect, useCallback } from 'react'
import { api } from './components/api.js'
import MetricCard from './components/MetricCard'
import HistoryChart from './components/HistoryChart'
import ForecastChart from './components/ForecastChart'
import DailyChart from './components/DailyChart'
import HourlyPatternChart from './components/HourlyPatternChart'

// ─── Feature importance mini-bar ─────────────────────────────────────────────
function FeatureBar({ name, value, max }) {
  const pct = ((value / max) * 100).toFixed(1)
  const labels = {
    hour: 'Hour of Day', temperature: 'Temperature', day_of_year: 'Day of Year',
    day_of_week: 'Day of Week', month: 'Month', humidity: 'Humidity', is_weekend: 'Is Weekend',
  }
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs text-slate-400 mb-1">
        <span>{labels[name] || name}</span>
        <span>{(value * 100).toFixed(1)}%</span>
      </div>
      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

// ─── Loading spinner ──────────────────────────────────────────────────────────
function Spinner({ label }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-slate-400 text-sm">{label}</p>
    </div>
  )
}

// ─── App ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [metrics, setMetrics]         = useState(null)
  const [historical, setHistorical]   = useState([])
  const [forecast, setForecast]       = useState([])
  const [daily, setDaily]             = useState([])
  const [pattern, setPattern]         = useState([])
  const [loading, setLoading]         = useState(true)
  const [error, setError]             = useState(null)
  const [histDays, setHistDays]       = useState(7)
  const [fcstDays, setFcstDays]       = useState(7)
  const [activeTab, setActiveTab]     = useState('overview')
  const [apiStatus, setApiStatus]     = useState('checking')

  // ── fetch everything ───────────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [m, h, f, d, p] = await Promise.all([
        api.metrics(),
        api.historical(histDays),
        api.forecast(fcstDays),
        api.dailySummary(30),
        api.hourlyPattern(),
      ])
      setMetrics(m.data)
      setHistorical(h.data.data)
      setForecast(f.data.forecast)
      setDaily(d.data.data)
      setPattern(p.data.pattern)
      setApiStatus('online')
    } catch (e) {
      console.error(e)
      setError('Cannot connect to Flask API. Make sure the backend is running on port 5000.')
      setApiStatus('offline')
    } finally {
      setLoading(false)
    }
  }, [histDays, fcstDays])

  useEffect(() => { fetchAll() }, [fetchAll])

  // ── tab nav config ─────────────────────────────────────────────────────────
  const tabs = [
    { id: 'overview',  label: '🏠 Overview'  },
    { id: 'history',   label: '📈 History'   },
    { id: 'forecast',  label: '🔮 Forecast'  },
    { id: 'analytics', label: '🧠 Analytics' },
  ]

  // ── top metrics data ───────────────────────────────────────────────────────
  const cards = metrics ? [
    {
      icon: '⚡', label: 'Total Energy (2 yrs)', color: 'blue',
      value: (metrics.total_energy_kwh / 1000).toFixed(1), unit: 'MWh',
      sub: `${metrics.total_energy_kwh.toLocaleString()} kWh total generated',`,
    },
    {
      icon: '🎯', label: 'Model Accuracy', color: 'green',
      value: metrics.accuracy_percent, unit: '%',
      sub: `R² = ${metrics.r2_score}  |  RMSE = ${metrics.rmse} kWh`,
    },
    {
      icon: '📅', label: 'Avg Daily Usage', color: 'yellow',
      value: metrics.avg_daily_kwh.toFixed(0), unit: 'kWh/day',
      sub: 'Average across all historical days',
    },
    {
      icon: '🔥', label: 'Peak Load', color: 'purple',
      value: metrics.peak_load_kwh.toFixed(1), unit: 'kWh',
      sub: 'Highest single-hour consumption',
    },
  ] : []

  const maxImportance = metrics
    ? Math.max(...Object.values(metrics.feature_importance))
    : 1

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-900 text-slate-200">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-10 bg-slate-900/95 backdrop-blur border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-2xl">⚡</span>
          <div>
            <h1 className="text-lg font-bold text-white leading-tight">AI Energy Forecasting</h1>
            <p className="text-xs text-slate-500">Random Forest · Python · Flask · React</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {/* API status badge */}
          <span className={`text-xs px-3 py-1 rounded-full font-medium flex items-center gap-1.5 ${
            apiStatus === 'online'   ? 'bg-green-500/15 text-green-400 border border-green-500/30' :
            apiStatus === 'offline'  ? 'bg-red-500/15 text-red-400 border border-red-500/30' :
                                       'bg-yellow-500/15 text-yellow-400 border border-yellow-500/30'
          }`}>
            <span className={`w-1.5 h-1.5 rounded-full ${
              apiStatus === 'online' ? 'bg-green-400 animate-pulse' :
              apiStatus === 'offline' ? 'bg-red-400' : 'bg-yellow-400 animate-pulse'
            }`} />
            {apiStatus === 'online' ? 'API Online' : apiStatus === 'offline' ? 'API Offline' : 'Checking...'}
          </span>
          <button
            onClick={fetchAll}
            className="text-xs px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            🔄 Refresh
          </button>
        </div>
      </header>

      {/* ── Tab bar ── */}
      <div className="border-b border-slate-800 px-6">
        <div className="flex gap-1">
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${
                activeTab === t.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Main content ── */}
      <main className="max-w-7xl mx-auto px-6 py-8">

        {/* Error banner */}
        {error && (
          <div className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-sm text-red-400">
            <strong>❌ Backend Error:</strong> {error}
            <div className="mt-2 text-xs text-slate-500">
              Fix: Open a terminal → cd into <code>backend/</code> → run <code>python app.py</code>
            </div>
          </div>
        )}

        {loading ? (
          <Spinner label="Loading data from Flask API..." />
        ) : (
          <>
            {/* ══ OVERVIEW tab ══════════════════════════════════════════ */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                {/* KPI cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
                  {cards.map((c, i) => <MetricCard key={i} {...c} />)}
                </div>

                {/* Charts row */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <HistoryChart data={historical} days={histDays} />
                  <ForecastChart data={forecast} days={fcstDays} />
                </div>

                <DailyChart data={daily} />
              </div>
            )}

            {/* ══ HISTORY tab ═══════════════════════════════════════════ */}
            {activeTab === 'history' && (
              <div className="space-y-6">
                {/* Controls */}
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-sm text-slate-400">Show last:</span>
                  {[3, 7, 14, 30].map(d => (
                    <button
                      key={d}
                      onClick={() => setHistDays(d)}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        histDays === d
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {d} days
                    </button>
                  ))}
                </div>

                <HistoryChart data={historical} days={histDays} />
                <HourlyPatternChart data={pattern} />

                {/* Data table preview */}
                <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
                  <h2 className="text-lg font-semibold text-slate-200 mb-4">
                    📋 Raw Data (last 24 records)
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-slate-500 border-b border-slate-700">
                          <th className="text-left py-2 pr-4">Timestamp</th>
                          <th className="text-right py-2 pr-4">Energy (kWh)</th>
                          <th className="text-right py-2 pr-4">Temp (°C)</th>
                          <th className="text-right py-2">Humidity (%)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {historical.slice(-24).reverse().map((row, i) => (
                          <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-700/20 transition-colors">
                            <td className="py-2 pr-4 text-slate-400 text-xs">{row.timestamp}</td>
                            <td className="py-2 pr-4 text-right text-blue-400 font-mono">{row.energy_kwh}</td>
                            <td className="py-2 pr-4 text-right text-yellow-400 font-mono">{row.temperature}</td>
                            <td className="py-2 text-right text-cyan-400 font-mono">{row.humidity?.toFixed(1)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ══ FORECAST tab ══════════════════════════════════════════ */}
            {activeTab === 'forecast' && (
              <div className="space-y-6">
                {/* Controls */}
                <div className="flex items-center gap-4 flex-wrap">
                  <span className="text-sm text-slate-400">Forecast horizon:</span>
                  {[1, 3, 7, 14].map(d => (
                    <button
                      key={d}
                      onClick={() => setFcstDays(d)}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        fcstDays === d
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                      }`}
                    >
                      {d} {d === 1 ? 'day' : 'days'}
                    </button>
                  ))}
                </div>

                <ForecastChart data={forecast} days={fcstDays} />

                {/* Forecast summary table */}
                <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
                  <h2 className="text-lg font-semibold text-slate-200 mb-4">
                    🔮 Forecast Data Preview (first 24 hours)
                  </h2>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="text-slate-500 border-b border-slate-700">
                          <th className="text-left py-2 pr-4">Timestamp</th>
                          <th className="text-right py-2 pr-4">Predicted kWh</th>
                          <th className="text-right py-2 pr-4">Temp (°C)</th>
                          <th className="text-right py-2">Humidity (%)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {forecast.slice(0, 24).map((row, i) => (
                          <tr key={i} className="border-b border-slate-800/50 hover:bg-slate-700/20 transition-colors">
                            <td className="py-2 pr-4 text-slate-400 text-xs">{row.timestamp}</td>
                            <td className="py-2 pr-4 text-right text-emerald-400 font-mono">{row.energy_kwh}</td>
                            <td className="py-2 pr-4 text-right text-yellow-400 font-mono">{row.temperature}</td>
                            <td className="py-2 text-right text-cyan-400 font-mono">{row.humidity}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* ══ ANALYTICS tab ═════════════════════════════════════════ */}
            {activeTab === 'analytics' && metrics && (
              <div className="space-y-6">

                {/* Model info card */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-slate-800/60 border border-blue-500/20 rounded-xl p-5">
                    <p className="text-xs text-slate-500 mb-1">Model Type</p>
                    <p className="text-lg font-bold text-blue-400">Random Forest</p>
                    <p className="text-xs text-slate-500 mt-1">150 decision trees · sklearn</p>
                  </div>
                  <div className="bg-slate-800/60 border border-green-500/20 rounded-xl p-5">
                    <p className="text-xs text-slate-500 mb-1">R² Score</p>
                    <p className="text-3xl font-bold text-green-400">{metrics.r2_score}</p>
                    <p className="text-xs text-slate-500 mt-1">Higher = better fit (max 1.0)</p>
                  </div>
                  <div className="bg-slate-800/60 border border-yellow-500/20 rounded-xl p-5">
                    <p className="text-xs text-slate-500 mb-1">RMSE</p>
                    <p className="text-3xl font-bold text-yellow-400">{metrics.rmse} <span className="text-sm">kWh</span></p>
                    <p className="text-xs text-slate-500 mt-1">Root Mean Squared Error</p>
                  </div>
                </div>

                {/* Feature importance */}
                <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
                  <h2 className="text-lg font-semibold text-slate-200 mb-2">🔍 Feature Importance</h2>
                  <p className="text-xs text-slate-500 mb-5">
                    Which inputs influence the model's predictions the most?
                  </p>
                  <div className="max-w-xl">
                    {Object.entries(metrics.feature_importance).map(([k, v]) => (
                      <FeatureBar key={k} name={k} value={v} max={maxImportance} />
                    ))}
                  </div>
                </div>

                {/* Daily chart + hourly pattern */}
                <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                  <DailyChart data={daily} />
                  <HourlyPatternChart data={pattern} />
                </div>

                {/* Tech stack */}
                <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
                  <h2 className="text-lg font-semibold text-slate-200 mb-4">🛠️ Tech Stack</h2>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {[
                      { name: 'Python 3.11', role: 'Language',     color: 'blue'   },
                      { name: 'Flask',       role: 'REST API',     color: 'green'  },
                      { name: 'scikit-learn',role: 'ML Model',     color: 'yellow' },
                      { name: 'Pandas',      role: 'Data',         color: 'purple' },
                      { name: 'React 18',    role: 'Frontend',     color: 'cyan'   },
                      { name: 'Recharts',    role: 'Charts',       color: 'pink'   },
                      { name: 'Tailwind',    role: 'Styling',      color: 'orange' },
                      { name: 'Vite',        role: 'Build Tool',   color: 'lime'   },
                    ].map(({ name, role, color }) => (
                      <div key={name} className="bg-slate-700/40 rounded-lg px-3 py-2 text-center">
                        <p className="text-sm font-semibold text-slate-200">{name}</p>
                        <p className="text-xs text-slate-500">{role}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="border-t border-slate-800 text-center py-4 text-xs text-slate-600">
        AI-Powered Energy Consumption Forecasting · Built with Python + React · 2024
      </footer>
    </div>
  )
}
