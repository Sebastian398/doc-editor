'use client'

import { useRef, useState } from 'react'
import SignatureCanvas from 'react-signature-canvas'
import { Pencil, Upload, Type, Trash2 } from 'lucide-react'

type Mode = 'draw' | 'upload' | 'type'

export default function SignatureModal({
  onSave,
  onClose,
}: {
  onSave: (data: string) => void
  onClose: () => void
}) {
  const sigRef = useRef<SignatureCanvas>(null)

  const [mode, setMode] = useState<Mode>('draw')
  const [image, setImage] = useState<string | null>(null)
  const [typedName, setTypedName] = useState('')

  function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()

    reader.onload = (ev: ProgressEvent<FileReader>) => {
      const result = ev.target?.result
      if (typeof result === 'string') {
        setImage(result)
        setMode('upload')
      }
    }

    reader.readAsDataURL(file)
  }

  function handleSave() {
    if (mode === 'draw') {
      const data = sigRef.current?.toDataURL()
      if (data) onSave(data)
    }

    if (mode === 'upload' && image) {
      onSave(image)
    }

    if (mode === 'type' && typedName.trim()) {
      const canvas = document.createElement('canvas')
      canvas.width = 400
      canvas.height = 150

      const ctx = canvas.getContext('2d')
      if (!ctx) return

      ctx.fillStyle = '#fff'
      ctx.fillRect(0, 0, canvas.width, canvas.height)

      ctx.fillStyle = '#000'
      ctx.font = '40px "Dancing Script", cursive'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'

      ctx.fillText(typedName, canvas.width / 2, canvas.height / 2)

      onSave(canvas.toDataURL())
    }
  }

  function handleClear() {
    sigRef.current?.clear()
    setImage(null)
    setTypedName('')
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">

      <div className="bg-white w-[560px] rounded-2xl shadow-xl p-6 flex flex-col gap-4">

        {/* HEADER */}
        <h2 className="text-lg font-semibold text-gray-800">
          Agregar firma
        </h2>

        {/* TABS */}
        <div className="grid grid-cols-3 gap-2">

          <button
            onClick={() => setMode('draw')}
            className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm transition ${
              mode === 'draw'
                ? 'bg-blue-600 text-white shadow'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Pencil size={16} />
            Dibujar
          </button>

          <button
            onClick={() => setMode('type')}
            className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm transition ${
              mode === 'type'
                ? 'bg-blue-600 text-white shadow'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Type size={16} />
            Escribir
          </button>

          <label
            className={`flex items-center justify-center gap-2 py-2 rounded-lg text-sm cursor-pointer transition ${
              mode === 'upload'
                ? 'bg-blue-600 text-white shadow'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            <Upload size={16} />
            Subir
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
          </label>

        </div>

        {/* AREA */}
        <div className="border rounded-xl h-[180px] bg-gray-50 flex items-center justify-center overflow-hidden">

          {mode === 'draw' && (
            <SignatureCanvas
              ref={sigRef}
              canvasProps={{
                className: 'w-full h-full',
              }}
            />
          )}

          {mode === 'upload' && image && (
            <img src={image} className="max-h-full max-w-full" />
          )}

          {mode === 'type' && (
            <div className="w-full h-full flex items-center justify-center px-4">
              <input
                value={typedName}
                onChange={(e) => setTypedName(e.target.value)}
                placeholder="Escribe tu firma"
                className="w-full text-center text-4xl border-b outline-none bg-transparent text-black"
                style={{
                  fontFamily: '"Dancing Script", cursive',
                }}
              />
            </div>
          )}

        </div>

        {/* FOOTER */}
        <div className="flex justify-between items-center mt-2">

          <button
            onClick={handleClear}
            className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-200"
          >
            <Trash2 size={14} />
            Borrar
          </button>

          <div className="flex gap-2">

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Cancelar
            </button>

            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 shadow"
            >
              Guardar
            </button>

          </div>

        </div>

      </div>
    </div>
  )
}