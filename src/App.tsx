// src/App.tsx
import React, { useEffect, useMemo, useState } from 'react'
import type { Mode, QAItem, Stats } from './types'
import Header from './components/Header'
import Controls from './components/Controls'
import QuestionCard from './components/QuestionCard'
import StatsModal from './components/StatsModal'
import { PREMIUM_ENABLED, groupByTask, loadStats, saveStats, recordAnswer, shuffleInPlace, clamp, loadBookmarks, saveBookmarks } from './utils'

export default function App() {
  const [items, setItems] = useState<QAItem[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [mode, setMode] = useState<Mode>({ kind: 'all', order: 'sequential' })

  const [index, setIndex] = useState(0)
  const [queue, setQueue] = useState<QAItem[]>([])

  const [stats, setStats] = useState<Stats>(() => loadStats())
  const [statsOpen, setStatsOpen] = useState(false)
  const [bookmarks, setBookmarks] = useState<Set<string>>(() => new Set(loadBookmarks()))
  const [pendingClearFailed, setPendingClearFailed] = useState<Set<string>>(() => new Set())

  // ✅ NEW: 1-based input value for sequential starting point
  const [startAt, setStartAt] = useState<number>(1)

  useEffect(() => {
    fetch('/data/data-25.json')
      .then(res => res.json())
      .then((data: QAItem[]) => {
        setItems(data)
      })
      .catch(() => setError('No se pudo cargar el archivo data-25.json. Asegúrate de colocarlo en /public/data/'))
  }, [])

  // persist bookmarks when changed
  useEffect(() => {
    saveBookmarks(Array.from(bookmarks))
  }, [bookmarks])

  // Build queue depending on mode
  useEffect(() => {
    if (!items) return

    let base: QAItem[] = []
    if (mode.kind === 'all') {
      base = [...items]
    } else if (mode.kind === 'task') {
      const byTask = groupByTask(items)
      base = [...byTask[mode.task]]
    } else if (mode.kind === 'failed') {
      base = items.filter(it => (stats.wrongCountById[it.task_id] ?? 0) > 0)
    } else if (mode.kind === 'bookmarked') {
      base = items.filter(it => bookmarks.has(it.task_id))
    }

    if (mode.order === 'random') {
      shuffleInPlace(base)
      setQueue(base)
      setIndex(0)
      // hide/ignore startAt when random
      setStartAt(1)
      return
    }

    // Sequential
    base.sort((a,b) => Number(a.task_id) - Number(b.task_id))
    setQueue(base)

    // ✅ Prepopulate start from stats if premium
    let initialIdxZero = 0
    if (PREMIUM_ENABLED) {
      if (mode.kind === 'all') {
        initialIdxZero = stats.lastSeqAll ?? 0
      } else if (mode.kind === 'task') {
        initialIdxZero = stats.lastSeqByTask?.[mode.task] ?? 0
      }
    }

    // If user already typed something in the Start At field, prefer it
    // (1-based in UI → convert to 0-based index)
    if (startAt && startAt > 1) {
      initialIdxZero = startAt - 1
    }

    initialIdxZero = clamp(initialIdxZero, 0, Math.max(0, base.length - 1))
    setIndex(initialIdxZero)
    setStartAt(initialIdxZero + 1) // reflect clamped value in the input
  }, [items, mode]) // eslint-disable-line react-hooks/exhaustive-deps

  // ✅ When user edits "Start At" while in sequential mode, jump there
  useEffect(() => {
    if (mode.order !== 'sequential' || queue.length === 0) return
    const idxZero = clamp(startAt - 1, 0, queue.length - 1)
    setIndex(idxZero)
  }, [startAt]) // eslint-disable-line react-hooks/exhaustive-deps

  const current = useMemo(() => queue[index], [queue, index])

  const next = () => {
    if (!current) return
    if (mode.kind === 'failed' && pendingClearFailed.has(current.task_id)) {
      // Remove from stats and queue now
      const newStats: Stats = { ...stats, wrongCountById: { ...stats.wrongCountById } }
      delete newStats.wrongCountById[current.task_id]
      setStats(newStats)
      saveStats(newStats)

      const newQueue = queue.filter(q => q.task_id !== current.task_id)
      setQueue(newQueue)
      setPendingClearFailed(prev => {
        const n = new Set(prev); n.delete(current.task_id); return n
      })
      if (newQueue.length === 0) {
        setIndex(0)
      } else {
        // keep same index to move to what was next
        setIndex(i => Math.min(i, newQueue.length - 1))
      }
    } else {
      setIndex(i => (i + 1) % (queue.length || 1))
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const prev = () => {
    if (!current) return
    if (mode.kind === 'failed' && pendingClearFailed.has(current.task_id)) {
      // Remove from stats and queue now
      const newStats: Stats = { ...stats, wrongCountById: { ...stats.wrongCountById } }
      delete newStats.wrongCountById[current.task_id]
      setStats(newStats)
      saveStats(newStats)

      const idxBefore = index
      const newQueue = queue.filter(q => q.task_id !== current.task_id)
      setQueue(newQueue)
      setPendingClearFailed(prev => {
        const n = new Set(prev); n.delete(current.task_id); return n
      })
      if (newQueue.length === 0) {
        setIndex(0)
      } else {
        // go to previous relative to old position
        setIndex(() => (idxBefore - 1 + newQueue.length) % newQueue.length)
      }
    } else {
      setIndex(i => (i - 1 + (queue.length || 1)) % (queue.length || 1))
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const onAnswered = (correct: boolean) => {
    if (!current) return
    const newStats = { ...stats, wrongCountById: { ...stats.wrongCountById } }
    recordAnswer(newStats, current, correct)
    // In failed mode, defer removal until navigation to let animations play
    if (correct && (mode.kind === 'failed')) {
      setPendingClearFailed(prev => new Set(prev).add(current.task_id))
    }
    setStats(newStats)
    saveStats(newStats)
  }

  const toggleBookmark = (item: QAItem) => {
    setBookmarks(prev => {
      const next = new Set(prev)
      if (next.has(item.task_id)) next.delete(item.task_id)
      else next.add(item.task_id)
      return next
    })
  }

  // ✅ Persist “last visited” whenever visible index changes in sequential mode
  useEffect(() => {
    if (!PREMIUM_ENABLED) return
    if (mode.order !== 'sequential') return
    if (queue.length === 0) return

    const newStats: Stats = {
      ...stats,
      lastSeqByTask: { ...(stats.lastSeqByTask ?? {}) }
    }

    if (mode.kind === 'all') {
      newStats.lastSeqAll = index
    } else if (mode.kind === 'task') {
      newStats.lastSeqByTask![mode.task] = index
    }
    setStats(newStats)
    saveStats(newStats)
  }, [index]) // eslint-disable-line react-hooks/exhaustive-deps

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
      <Controls
        mode={mode}
        setMode={setMode}
        availableTasks={uniqueTasks}
        // ✅ pass start-at UI state
        startAt={startAt}
        setStartAt={setStartAt}
        maxStart={queue.length}
      />

      <div className="mt-2 space-y-4">
        <QuestionCard
          key={current.task_id}
          item={current}
          onAnswer={onAnswered}
          {...(PREMIUM_ENABLED ? {
            isBookmarked: bookmarks.has(current.task_id),
            onToggleBookmark: () => toggleBookmark(current)
          } : {})}
        />

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
