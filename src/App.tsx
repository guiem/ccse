import React, { useEffect, useMemo, useState } from 'react'
import type { Mode, QAItem, Stats } from './types'
import Header from './components/Header'
import Controls from './components/Controls'
import QuestionCard from './components/QuestionCard'
import StatsModal from './components/StatsModal'
import { PREMIUM_ENABLED, groupByTask, loadStats, saveStats, recordAnswer, shuffleInPlace } from './utils'

export default function App() {
  const [items, setItems] = useState<QAItem[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<Mode>({ kind: 'all', order: 'random' })
  const [index, setIndex] = useState(0)
  const [queue, setQueue] = useState<QAItem[]>([])
  const [stats, setStats] = useState<Stats>(() => loadStats())
  const [statsOpen, setStatsOpen] = useState(false)

  useEffect(() => {
    fetch('/data/data-25.json')
      .then(res => res.json())
      .then((data: QAItem[]) => {
        setItems(data)
      })
      .catch(err => setError('No se pudo cargar el archivo data-25.json. Asegúrate de colocarlo en /public/data/'))
  }, [])

  // Build queue depending on mode
  useEffect(() => {
    if (!items) return

    let base: QAItem[] = []
    if (mode.kind === 'all') {
      base = [...items]
    } else {
      const byTask = groupByTask(items)
      base = [...byTask[mode.task]]
    }

    if (mode.order === 'random') {
      shuffleInPlace(base)
    } else {
      base.sort((a,b) => Number(a.task_id) - Number(b.task_id))
    }

    setQueue(base)
    setIndex(0)
  }, [items, mode])

  const current = useMemo(() => queue[index], [queue, index])

  const next = () => {
    setIndex(i => (i + 1) % (queue.length || 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const prev = () => {
    setIndex(i => (i - 1 + (queue.length || 1)) % (queue.length || 1))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const onAnswered = (correct: boolean) => {
    if (!current) return
    const newStats = { ...stats, wrongCountById: { ...stats.wrongCountById } }
    recordAnswer(newStats, current, correct)
    setStats(newStats)
    saveStats(newStats)
  }

  if (error) {
    return (
      <div className="p-6 max-w-screen-md mx-auto">
        <p className="text-rose-700 font-medium">{error}</p>
        <p className="text-sm mt-2">Ruta esperada: <code>/public/data/data-25.json</code></p>
      </div>
    )
  }

  if (!items || queue.length === 0) {
    return (
      <div>
        <Header onOpenStats={() => setStatsOpen(true)} />
        <div className="p-6 max-w-screen-md mx-auto">
          <p>Cargando…</p>
        </div>
      </div>
    )
  }

  const uniqueTasks = Array.from(new Set(items.map(i => i.task))) as QAItem['task'][]

  return (
    <div>
      <Header onOpenStats={() => setStatsOpen(true)} />
      <Controls mode={mode} setMode={setMode} availableTasks={uniqueTasks} />

      <div className="mt-2 space-y-4">
        <QuestionCard item={current} onAnswer={onAnswered} />

        <div className="mx-auto max-w-[var(--card-max-w)] px-4">
          <div className="grid grid-cols-2 gap-3">
            <button onClick={prev} className="rounded-xl border border-slate-300 bg-white px-4 py-2">Anterior</button>
            <button onClick={next} className="rounded-xl border border-slate-900 bg-slate-900 text-white px-4 py-2">Siguiente</button>
          </div>
          <div className="mt-3 text-center text-xs text-slate-600">
            {index + 1} / {queue.length}
          </div>
        </div>
      </div>

      {PREMIUM_ENABLED && (
        <StatsModal open={statsOpen} onClose={() => setStatsOpen(false)} stats={stats} items={items} />
      )}
    </div>
  )
}