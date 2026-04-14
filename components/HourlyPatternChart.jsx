/**
 * HourlyPatternChart.jsx  ─  Shows average energy by hour-of-day (0–23)
 */

import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts'

const HOUR_LABELS = [
  '12am','1am','2am','3am','4am','5am','6am','7am','8am','9am','10am','11am',
  '12pm','1pm','2pm','3pm','4pm','5pm','6pm','7pm','8pm','9pm','10pm','11pm',
]

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 text-sm shadow-xl">
      <p className="text-slate-400">{HOUR_LABELS[label]}</p>
      <p className="text-cyan-400">Avg: <strong>{payload[0]?.value?.toFixed(1)} kWh</strong></p>
    </div>
  )
}

export default function HourlyPatternChart({ data = [] }) {
  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
      <h2 className="text-lg font-semibold text-slate-200 mb-1">
        🕐 Average Energy by Hour of Day
      </h2>
      <p className="text-xs text-slate-500 mb-4">Computed over 2 years of data</p>
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <defs>
            <linearGradient id="cyanGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#06b6d4" stopOpacity={0.4} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
          <XAxis
            dataKey="hour"
            tickFormatter={h => HOUR_LABELS[h]}
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            interval={3}
          />
          <YAxis
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            label={{ value: 'kWh', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="avg_energy"
            stroke="#06b6d4"
            strokeWidth={2}
            fill="url(#cyanGrad)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}
