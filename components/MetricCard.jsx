/**
 * MetricCard.jsx  ─  Top-row KPI card with icon, value, label, and trend colour
 */

export default function MetricCard({ icon, label, value, unit, sub, color = 'blue' }) {
  const colors = {
    blue:   { bg: 'bg-blue-500/10',   border: 'border-blue-500/30',   text: 'text-blue-400'  },
    green:  { bg: 'bg-green-500/10',  border: 'border-green-500/30',  text: 'text-green-400' },
    yellow: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/30', text: 'text-yellow-400'},
    purple: { bg: 'bg-purple-500/10', border: 'border-purple-500/30', text: 'text-purple-400'},
  }
  const c = colors[color] || colors.blue

  return (
    <div className={`card-glow rounded-xl border ${c.border} ${c.bg} p-5 flex flex-col gap-3`}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-slate-400">{label}</span>
        <span className={`text-2xl ${c.text}`}>{icon}</span>
      </div>
      <div>
        <span className={`text-3xl font-bold ${c.text}`}>{value}</span>
        {unit && <span className="ml-1 text-sm text-slate-400">{unit}</span>}
      </div>
      {sub && <p className="text-xs text-slate-500">{sub}</p>}
    </div>
  )
}
