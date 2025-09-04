import React, { useRef } from 'react'

type Props = {
  open: boolean
  onClose: () => void
  isPremium: boolean
  onExport?: () => void
  onImport?: (file: File) => void
}

export default function InfoModal({ open, onClose, isPremium, onExport, onImport }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  if (!open) return null

  const triggerImport = () => fileRef.current?.click()

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/30">
      <div className="w-full sm:max-w-lg sm:rounded-2xl sm:shadow-xl sm:glass bg-white p-5 animate-popin max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Información</h2>
          <button onClick={onClose} className="rounded-full px-3 py-1 text-sm bg-slate-900 text-white">Cerrar</button>
        </div>

        <section className="space-y-2">
          <p className="text-sm text-slate-700">
            Esta app ayuda a preparar la prueba CCSE. La app oficial del Instituto Cervantes no permite recorrer las 300 preguntas
            de forma secuencial, por lo que es difícil saber si has estudiado todo el material al responder preguntas aleatorias.
            Aquí puedes estudiar secuencialmente y controlar tu progreso.
          </p>
        </section>

        <section className="mt-4">
          <h3 className="text-sm font-medium mb-2">Funciones premium (1 €)</h3>
          <ul className="list-disc pl-5 space-y-1 text-sm text-slate-700">
            <li>Recorrer preguntas en secuencia y recordar la última visitada.</li>
            <li>Revisar Errores: repasa solo las que has fallado.</li>
            <li>Revisar Guardadas: repasa tus preguntas marcadas.</li>
            <li>Marcadores por pregunta (guardar/retirar).</li>
            <li>Exportar/Importar tus datos entre dispositivos.</li>
          </ul>
        </section>

        {!isPremium && (
          <section className="mt-4 text-sm text-slate-700">
            Para activar las funciones premium por 1 €, utiliza el botón “Donar” (próximamente) y recibirás el acceso.
          </section>
        )}
      </div>
    </div>
  )
}
