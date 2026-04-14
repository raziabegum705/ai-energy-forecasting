/**
 * ForecastChart.jsx  ─  Recharts area chart for ML-predicted future energy
 */

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

function fmtLabel(ts) {
  if (!ts) return ''
  const [date, time] = ts.split(' ')
  const [, m, d] = date.split('-')
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${months[+m - 1]} ${d} ${time?.slice(0,2)}h`
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800 border border-emerald-600/40 rounded-lg p-3 text-sm shadow-xl">
      <p className="text-slate-400 mb-1">{fmtLabel(label)}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <strong>{p.value}</strong>
          {p.dataKey === 'energy_kwh' ? ' kWh' : ' °C'}
        </p>
      ))}
    </div>
  )
}

export default function ForecastChart({ data = [], days }) {
  const step = Math.max(1, Math.floor(data.length / 200))
  const sampled = data.filter((_, i) => i % step === 0)

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
      <h2 className="text-lg font-semibold text-slate-200 mb-1">
        🔮 AI Forecast — Next {days} Days
      </h2>
      <p className="text-xs text-slate-500 mb-4">
        Predicted by Random Forest model trained on 2 years of historical data
      </p>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={sampled} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="energyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#10b981" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="tempGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#f59e0b" stopOpacity={0.2} />
              <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="timestamp"
            tickFormatter={fmtLabel}
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            interval="preserveStartEnd"
          />
          <YAxis
            yAxisId="energy"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            label={{ value: 'kWh', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }}
          />
          <YAxis
            yAxisId="temp"
            orientation="right"
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            label={{ value: '°C', angle: 90, position: 'insideRight', fill: '#64748b', fontSize: 11 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ color: '#94a3b8', fontSize: 12 }} />
          <Area
            yAxisId="energy"
            type="monotone"
            dataKey="energy_kwh"
            name="Forecast Energy (kWh)"
            stroke="#10b981"
            strokeWidth={2}
            fill="url(#energyGrad)"
          />
          <Area
            yAxisId="temp"
            type="monotone"
            dataKey="temperature"
            name="Predicted Temp (°C)"
            stroke="#f59e0b"
            strokeWidth={1}
            fill="url(#tempGrad)"
            strokeDasharray="4 2"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
