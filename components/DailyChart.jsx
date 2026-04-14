/**
 * DailyChart.jsx  ─  Bar chart showing total daily energy for last N days
 */

import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Cell,
} from 'recharts'

function fmtDate(dateStr) {
  if (!dateStr) return ''
  const [, m, d] = dateStr.split('-')
  const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  return `${months[+m - 1]} ${d}`
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-slate-800 border border-slate-600 rounded-lg p-3 text-sm shadow-xl">
      <p className="text-slate-400 mb-1">{fmtDate(label)}</p>
      <p className="text-violet-400">Total: <strong>{payload[0]?.value?.toFixed(0)} kWh</strong></p>
      {payload[1] && <p className="text-orange-400">Peak: <strong>{payload[1]?.value?.toFixed(1)} kWh</strong></p>}
    </div>
  )
}

export default function DailyChart({ data = [] }) {
  // Colour bars by total energy level
  const max = Math.max(...data.map(d => d.total_energy), 1)

  return (
    <div className="bg-slate-800/60 border border-slate-700 rounded-xl p-5">
      <h2 className="text-lg font-semibold text-slate-200 mb-4">
        📊 Daily Energy Consumption — Last 30 Days
      </h2>
      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={fmtDate}
            tick={{ fill: '#94a3b8', fontSize: 10 }}
            interval={Math.floor(data.length / 8)}
          />
          <YAxis
            tick={{ fill: '#94a3b8', fontSize: 11 }}
            label={{ value: 'kWh', angle: -90, position: 'insideLeft', fill: '#64748b', fontSize: 11 }}
          />
          <Tooltip content={<CustomTooltip />} />
          <Bar dataKey="total_energy" name="Total Energy" radius={[3, 3, 0, 0]}>
            {data.map((entry, i) => {
              const ratio = entry.total_energy / max
              const r = Math.round(100 + ratio * 55)
              const g = Math.round(180 - ratio * 130)
              const b = Math.round(250 - ratio * 100)
              return <Cell key={i} fill={`rgb(${r},${g},${b})`} />
            })}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
