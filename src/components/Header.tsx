import React, { useRef } from 'react'
import { PREMIUM_ENABLED } from '../utils'

type Props = {
  onOpenStats: () => void
  onExport?: () => void
  onImport?: (file: File) => void
}

export default function Header({ onOpenStats, onExport, onImport }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const triggerImport = () => {
    if (!onImport) return
    fileInputRef.current?.click()
  }

  const onFileChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const f = e.target.files?.[0]
    if (f && onImport) onImport(f)
    // reset to allow re-selecting the same file name later
    if (fileInputRef.current) fileInputRef.current.value = ''
  }
  return (
    <header className="sticky top-0 z-20 glass border-b border-slate-200">
      <div className="mx-auto max-w-screen-md px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🇪🇸</span>
          <div>
            <h1 className="font-semibold text-slate-900 leading-tight">CCSE 2025 • Práctica</h1>
          </div>
        </div>
        {PREMIUM_ENABLED && (
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenStats}
              className="rounded-xl px-3 py-2 text-sm font-medium bg-slate-900 text-white hover:bg-slate-800 active:scale-95 transition"
              aria-label="Abrir estadísticas"
            >
              Estadísticas
            </button>
            {!!onExport && (
              <button
                onClick={onExport}
                className="rounded-xl px-3 py-2 text-sm font-medium border border-slate-300 bg-white hover:bg-slate-50 active:scale-95 transition"
              >
                Exportar
              </button>
            )}
            {!!onImport && (
              <>
                <button
                  onClick={triggerImport}
                  className="rounded-xl px-3 py-2 text-sm font-medium border border-slate-300 bg-white hover:bg-slate-50 active:scale-95 transition"
                >
                  Importar
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/json"
                  className="hidden"
                  onChange={onFileChange}
                />
              </>
            )}
          </div>
        )}
      </div>
    </header>
  )
}
