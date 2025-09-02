import React from 'react'
import type { QAItem, Stats } from '../types'
import { getTopFailed, TASK_LABELS, TASK_COLORS } from '../utils'

type Props = {
  open: boolean
  onClose: () => void
  stats: Stats
  items: QAItem[]
}

export default function StatsModal({ open, onClose, stats, items }: Props) {
  if (!open) return null
  const top = getTopFailed(stats, items, 10)

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30">
      <div className="w-full sm:max-w-lg sm:rounded-2xl sm:shadow-xl sm:overflow-hidden sm:glass bg-white p-5 animate-popin">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-semibold">Estadísticas</h2>
          <button onClick={onClose} className="rounded-full px-3 py-1 text-sm bg-slate-900 text-white">Cerrar</button>
        </div>
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="rounded-xl border p-3">
            <div className="text-xs text-slate-600">Intentos</div>
            <div className="text-2xl font-semibold">{stats.attempts}</div>
          </div>
          <div className="rounded-xl border p-3">
            <div className="text-xs text-slate-600">Aciertos</div>
            <div className="text-2xl font-semibold">{stats.correct}</div>
          </div>
          <div className="rounded-xl border p-3">
            <div className="text-xs text-slate-600">Fallos</div>
            <div className="text-2xl font-semibold">{stats.wrong}</div>
          </div>
        </div>
        <h3 className="text-sm font-medium mb-2">Preguntas más falladas</h3>
        {top.length === 0 ? (
          <p className="text-sm text-slate-600">Aún no hay fallos registrados.</p>
        ) : (
          <ul className="space-y-2">
            {top.map(({ item, wrong }) => (
              <li key={item.task_id} className="rounded-xl border p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">
                    <span className="inline-flex items-center gap-2">
                      <span
                        className="inline-block w-2 h-2 rounded-full"
                        style={{ backgroundColor: TASK_COLORS[item.task] }}
                        aria-hidden
                      />
                      {item.task_id} · {item.question}
                    </span>
                  </span>
                  <span className="text-xs text-slate-600">{wrong} fallos</span>
                </div>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-4 text-xs text-slate-500">Actualizado: {new Date(stats.lastUpdated).toLocaleString()}</p>
      </div>
    </div>
  )
}