import React, { useMemo, useRef, useState, useEffect } from 'react'
import type { QAItem } from '../types'
import { TASK_COLORS, TASK_LABELS } from '../utils'

const HAPPY = ['🎉','🥳','👏','✨','😄','😎','👍','🌟','💃','🕺']
const SAD = ['😵','😖','😢','😞','💔','🙈','🫣','😬','😕','😓']

function spawnEmojiBurst(container: HTMLElement, good: boolean, x?: number, y?: number) {
  const EMOJIS = good ? HAPPY : SAD
  const rect = container.getBoundingClientRect()
  const cx = (x ?? rect.width / 2)
  const cy = (y ?? rect.height / 2)
  for (let i = 0; i < 12; i++) {
    const span = document.createElement('span')
    span.className = 'emoji animate-burst'
    span.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)]
    const angle = Math.random() * Math.PI * 2
    const dist = 50 + Math.random() * 70
    span.style.left = cx + 'px'
    span.style.top = cy + 'px'
    span.style.setProperty('--dx', `${Math.cos(angle) * dist}px`)
    span.style.setProperty('--dy', `${Math.sin(angle) * dist}px`)
    container.appendChild(span)
    setTimeout(() => span.remove(), 900)
  }
}

type Props = {
  item: QAItem
  onAnswer: (correct: boolean) => void
  isBookmarked?: boolean
  onToggleBookmark?: () => void
}

export default function QuestionCard({ item, onAnswer, isBookmarked = false, onToggleBookmark }: Props) {
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setSelectedIdx(null)
  }, [item.task_id])

  const title = TASK_LABELS[item.task]
  const color = TASK_COLORS[item.task]

  const answers = useMemo(() => item.answers.map((ans, idx) => ({
    idx, ans
  })), [item.answers])

  const handleSelect = (idx: number, e: React.MouseEvent) => {
    if (selectedIdx !== null) return // prevent double-click
    setSelectedIdx(idx)
    const isCorrect = idx === item.correct_answer
    onAnswer(isCorrect)
    const host = containerRef.current
    if (host) {
      const rect = (e.target as HTMLElement).getBoundingClientRect()
      const x = rect.left - host.getBoundingClientRect().left + rect.width / 2
      const y = rect.top - host.getBoundingClientRect().top + rect.height / 2
      spawnEmojiBurst(host, isCorrect, x, y)
    }
  }

  return (
    <div ref={containerRef} className="relative mx-auto max-w-[var(--card-max-w)] px-4">
      <article className="relative rounded-2xl shadow-sm border overflow-hidden bg-white animate-popin">
        {/* Bookmark toggle */}
        {onToggleBookmark && (
          <button
            onClick={onToggleBookmark}
            className="absolute top-2 right-2 rounded-lg bg-white/90 backdrop-blur border border-slate-200 p-2 shadow-sm hover:bg-white active:scale-95 transition"
            aria-label={isBookmarked ? 'Quitar marcador' : 'Marcar pregunta'}
            title={isBookmarked ? 'Quitar marcador' : 'Marcar pregunta'}
          >
            {/* bookmark icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill={isBookmarked ? '#f59e0b' : 'none'}
              stroke={isBookmarked ? '#f59e0b' : 'currentColor'}
              strokeWidth="1.8"
              className="h-5 w-5 text-slate-700"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3.75h10.5A.75.75 0 0 1 18 4.5v15.19a.375.375 0 0 1-.597.3L12 16.5l-5.403 3.49A.375.375 0 0 1 6 19.69V4.5a.75.75 0 0 1 .75-.75z"
              />
            </svg>
          </button>
        )}
        <div className="px-5 py-3" style={{ background: color }}>
          <div className="text-white text-sm font-semibold">
            {title}
          </div>
          <div className="text-white/90 text-xs">#{item.task_id}</div>
        </div>
        <div className="p-5">
          <h2 className="text-lg font-semibold text-slate-900">{item.question}</h2>
          <div className="mt-4 grid gap-2">
            {answers.map(({ idx, ans }) => {
              const isChosen = selectedIdx === idx
              const isCorrect = idx === item.correct_answer
              const styles = selectedIdx === null
                ? "border-slate-200 hover:border-slate-400 hover:bg-slate-50"
                : isCorrect
                  ? "border-emerald-500 bg-emerald-50"
                  : (isChosen ? "border-rose-500 bg-rose-50" : "border-slate-200 opacity-70")
              return (
                <button
                  key={idx}
                  onClick={(e) => handleSelect(idx, e)}
                  className={`text-left rounded-xl border px-4 py-3 transition ${styles}`}
                  aria-label={`Respuesta ${idx+1}`}
                >
                  <span className="text-slate-900">{ans}</span>
                </button>
              )
            })}
          </div>
          {selectedIdx !== null && (
            <div className="mt-3 text-sm">
              {selectedIdx === item.correct_answer ? (
                <span className="inline-flex items-center gap-2 text-emerald-700 font-medium">
                  ✅ ¡Correcto!
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 text-rose-700 font-medium">
                  ❌ Incorrecto
                </span>
              )}
            </div>
          )}
        </div>
      </article>
    </div>
  )
}
