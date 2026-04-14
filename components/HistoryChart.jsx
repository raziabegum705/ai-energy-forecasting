/**
 * HistoryChart.jsx  ─  Recharts line chart for historical hourly energy data
 */

import {
  LineChart, Line, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend,
} from 'recharts'

// Format "2024-06-15 14:00" → "Jun 15 14h"
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
    <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 text-sm shadow-xl">
      <p className="text-slate-400 mb-1">{fmtLabel(label)}</p>
      {payload.map((p) => (
        <p key={p.dataKey} style={{ color: p.color }}>
          {p.name}: <strong>{p.value}</strong>
          {p.dataKey === 'energy_kwh' ? ' kWh' : p.dataKey === 'temperature' ? ' °C' : ' %'}
        </p>
      ))}
    </div>
  )
}

export default function HistoryChart({ data = [], days }) {
  // Sample: keep every Nth point so the chart isn't over-crowded
  const step = Math.max(1, Math.floor(data.length / 200))
  const sampled = data.filter((_, i) => i % step === 0)

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
      <h2 className="text-lg font-semibold text-slate-200 mb-4">
        📈 Historical Energy Consumption — Last {days} Days
      </h2>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={sampled} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
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
          <Line
            yAxisId="energy"
            type="monotone"
            dataKey="energy_kwh"
            name="Energy (kWh)"
            stroke="#3b82f6"
            strokeWidth={1.5}
            dot={false}
          />
          <Line
            yAxisId="temp"
            type="monotone"
            dataKey="temperature"
            name="Temp (°C)"
            stroke="#f59e0b"
            strokeWidth={1}
            dot={false}
            strokeDasharray="4 2"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
