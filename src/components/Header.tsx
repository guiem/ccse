import React from 'react'
import { PREMIUM_ENABLED } from '../utils'

type Props = {
  onOpenStats: () => void
  onOpenMenu?: () => void
}

export default function Header({ onOpenStats, onOpenMenu }: Props) {
  return (
    <header className="sticky top-0 z-20 glass border-b border-slate-200">
      <div className="mx-auto max-w-screen-md px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🇪🇸</span>
          <div>
            <h1 className="font-semibold text-slate-900 leading-tight">CCSE 2025 • Práctica</h1>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenMenu}
            className="rounded-xl px-3 py-2 text-sm font-medium border border-slate-300 bg-white hover:bg-slate-50 active:scale-95 transition"
            aria-label="Abrir menú"
          >
            ☰ Menú
          </button>
        </div>
      </div>
    </header>
  )
}
