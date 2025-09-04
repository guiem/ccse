import React, { useRef } from 'react'

type Props = {
  open: boolean
  onClose: () => void
  isPremium: boolean
  onOpenInfo: () => void
  onOpenStats?: () => void
  onExport?: () => void
  onImport?: (file: File) => void
}

export default function MenuModal({ open, onClose, isPremium, onOpenInfo, onOpenStats, onExport, onImport }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  if (!open) return null

  const handleImportClick = () => fileRef.current?.click()

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/30"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <aside
        className="h-full w-72 sm:w-80 bg-white shadow-xl border-l border-slate-200 p-4 overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold">Menú</h2>
          <button
            onClick={onClose}
            aria-label="Cerrar menú"
            className="rounded-lg border border-slate-300 px-2 py-1 text-sm hover:bg-slate-50"
          >
            ✕
          </button>
        </div>
        <div className="grid gap-2">
          <button
            className="rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-left hover:bg-slate-50"
            onClick={() => { onClose(); onOpenInfo(); }}
          >
            ℹ️ Información
          </button>
          {isPremium && (
            <>
              {!!onOpenStats && (
                <button
                  className="rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-left hover:bg-slate-50"
                  onClick={() => { onClose(); onOpenStats(); }}
                >
                  📊 Estadísticas
                </button>
              )}
              {!!onExport && (
                <button
                  className="rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-left hover:bg-slate-50"
                  onClick={() => { onClose(); onExport(); }}
                >
                  ⬇️ Exportar datos
                </button>
              )}
              {!!onImport && (
                <>
                  <button
                    className="rounded-xl border border-slate-300 bg-white px-3 py-3 text-sm text-left hover:bg-slate-50"
                    onClick={() => { handleImportClick() }}
                  >
                    ⬆️ Importar datos
                  </button>
                  <input
                    ref={fileRef}
                    type="file"
                    accept="application/json"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0]
                      if (f && onImport) onImport(f)
                      if (fileRef.current) fileRef.current.value = ''
                      onClose()
                    }}
                  />
                </>
              )}
            </>
          )}
        </div>
      </aside>
    </div>
  )
}
