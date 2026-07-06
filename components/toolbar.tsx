'use client'

import { useState } from 'react'
import { Settings, X, Eye, Pencil } from 'lucide-react'

type Props = {
  tool: 'text' | 'signature' | 'number'
  setTool: (
    t: 'text' | 'signature' | 'number'
  ) => void
  mode: 'edit' | 'preview'
  setMode: (m: 'edit' | 'preview') => void
  onSave: () => void
}

export default function Toolbar({
  tool,
  setTool,
  mode,
  setMode,
  onSave,
}: Props) {
  const [open, setOpen] = useState(true)

  return (
    <>
      {/* BOTÓN FLOTANTE */}
      <button
        onClick={() => setOpen(!open)}
        className="
          fixed top-1/2 right-4 -translate-y-1/2 z-50
          bg-white border border-gray-200 shadow-lg
          rounded-full w-11 h-11 flex items-center justify-center
          hover:bg-gray-100 transition
        "
      >
        {open ? (
          <X size={18} className="text-gray-700" />
        ) : (
          <Settings size={18} className="text-gray-700" />
        )}
      </button>

      {/* PANEL */}
      <div
        className={`
          fixed top-24 right-6 z-40 w-64
          bg-white border border-gray-200 rounded-2xl shadow-xl
          p-5 flex flex-col gap-4
          transition-all duration-300
          ${open ? 'translate-x-0 opacity-100' : 'translate-x-[120%] opacity-0'}
        `}
      >
        {/* HEADER */}
        <div>
          <h3 className="text-sm font-semibold text-gray-800">
            Herramientas
          </h3>
          <p className="text-xs text-gray-400">
            Campos del documento
          </p>
        </div>

        {/* CAMPOS */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() => setTool('text')}
            disabled={mode === 'preview'}
            className={`
              py-2 px-3 rounded-lg text-sm text-left transition
              ${
                tool === 'text' && mode === 'edit'
                  ? 'bg-indigo-50 text-indigo-600 border border-indigo-200'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }
              ${mode === 'preview' ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            Texto
          </button>

          <button
            onClick={() => setTool('signature')}
            disabled={mode === 'preview'}
            className={`
              py-2 px-3 rounded-lg text-sm text-left transition
              ${
                tool === 'signature' && mode === 'edit'
                  ? 'bg-rose-50 text-rose-600 border border-rose-200'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }
              ${mode === 'preview' ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            Firma
          </button>
          <button
            onClick={() => setTool('number')}
            disabled={mode === 'preview'}
            className={`
              py-2 px-3 rounded-lg text-sm text-left transition
              ${
                tool === 'number' && mode === 'edit'
                  ? 'bg-amber-50 text-amber-600 border border-amber-200'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
              }
              ${mode === 'preview'
                ? 'opacity-50 cursor-not-allowed'
                : ''}
            `}
          >
            Número
          </button>
        </div>

        {/* DIVISOR */}
        <div className="h-px bg-gray-200" />

        {/* ACCIONES */}
        <div className="flex flex-col gap-2">
          <button
            onClick={() =>
              setMode(mode === 'edit' ? 'preview' : 'edit')
            }
            className="
              flex items-center justify-center gap-2
              bg-gray-100 text-gray-700
              py-2 rounded-lg text-sm
              hover:bg-gray-200 transition
            "
          >
            {mode === 'edit' ? (
              <>
                <Eye size={16} />
                Vista previa
              </>
            ) : (
              <>
                <Pencil size={16} />
                Editar
              </>
            )}
          </button>

          <button
            onClick={onSave}
            className="
              bg-emerald-500 text-white
              py-2 rounded-lg text-sm
              hover:bg-emerald-600 transition shadow-sm
            "
          >
            Guardar cambios
          </button>
        </div>
      </div>
    </>
  )
}
