import React from 'react'
import type { Mode, QAItem } from '../types'
import { TASK_LABELS } from '../utils'

type Props = {
  mode: Mode
  setMode: (m: Mode) => void
  availableTasks: QAItem['task'][]
}

export default function Controls({ mode, setMode, availableTasks }: Props) {
  const orderSelect = (
    <select
      className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2"
      value={mode.order}
      onChange={e => setMode({ ...(mode as any), order: e.target.value as 'random' | 'sequential' })}
    >
      <option value="random">Aleatorio</option>
      <option value="sequential">Secuencial</option>
    </select>
  )

  return (
    <section className="mx-auto max-w-screen-md px-4 pt-4 pb-3 grid grid-cols-2 gap-3">
      <div className="col-span-2">
        <label className="text-xs font-medium text-slate-600">Modo</label>
        <div className="mt-1 grid grid-cols-2 gap-3">
          <button
            className={`rounded-xl border px-3 py-2 text-sm ${mode.kind === 'all' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 bg-white'}`}
            onClick={() => setMode({ kind: 'all', order: mode.order })}
          >
            Todas las preguntas
          </button>
          <button
            className={`rounded-xl border px-3 py-2 text-sm ${mode.kind === 'task' ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-300 bg-white'}`}
            onClick={() => setMode({ kind: 'task', task: 'tarea_1', order: mode.order })}
          >
            Por tarea
          </button>
        </div>
      </div>

      {mode.kind === 'task' && (
        <div className="col-span-2">
          <label className="text-xs font-medium text-slate-600">Selecciona tarea</label>
          <select
            className="w-full mt-1 rounded-xl border border-slate-300 bg-white px-3 py-2"
            value={mode.task}
            onChange={e => setMode({ kind: 'task', task: e.target.value as QAItem['task'], order: mode.order })}
          >
            {availableTasks.map(t => (
              <option key={t} value={t}>{TASK_LABELS[t]}</option>
            ))}
          </select>
        </div>
      )}

      <div className="col-span-2 sm:col-span-1">
        <label className="text-xs font-medium text-slate-600">Orden</label>
        <div className="mt-1">{orderSelect}</div>
      </div>
    </section>
  )
}