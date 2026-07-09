'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

type DocumentType = {
  id: string
  name: string
}

export default function NewFlowPage() {
  const router = useRouter()

  const [name, setName] = useState('')
  const [docs, setDocs] = useState<DocumentType[]>([])
  const [selectedDocs, setSelectedDocs] =
    useState<string[]>([])

  useEffect(() => {
    fetch('/api/documents')
      .then(res => res.json())
      .then(setDocs)
  }, [])

  async function createFlow() {
    const res = await fetch('/api/flows', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        documentIds: selectedDocs,
      }),
    })

    if (!res.ok) {
      alert('Error creando Flow')
      return
    }

    router.push('/flows')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <div className="bg-white shadow-sm border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-600 hover:text-black">
            <ArrowLeft size={18} />
          </Link>

          <h1 className="font-semibold text-gray-800">
            Nuevo Flow
          </h1>
        </div>

        {/* BOTÓN */}
          <div className="mt-8 flex justify-end">
            <button
              onClick={createFlow}
              className="
                px-6
                py-3
                bg-blue-600
                text-white
                rounded-lg
                font-medium
                shadow-sm
                hover:bg-blue-700
                hover:shadow-md
                transition
              "
            >
              Crear Flow
            </button>
            </div>
      </div>
      <div className="max-w-5xl mx-auto p-6">

        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">

          {/* TÍTULO */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">
              Nuevo Flow
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Agrupa varios documentos en un único proceso.
            </p>
          </div>

          {/* CONTADOR */}
          <div className="mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
              {selectedDocs.length} documento(s) seleccionado(s)
            </span>
          </div>

          {/* NOMBRE */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Nombre del Flow
            </label>

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Ej: Ingreso de colaborador"
              className="
                w-full
                border
                border-gray-300
                rounded-lg
                px-4
                py-3
                text-black
                bg-white
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                focus:border-blue-500
              "
            />
          </div>

          {/* DOCUMENTOS */}
          <div>
            <h2 className="text-sm font-medium text-gray-600 mb-4">
              Selecciona los documentos
            </h2>

            <div className="grid gap-3 max-h-[420px] overflow-y-auto pr-2">

              {docs.map(doc => (
                <label
                  key={doc.id}
                  className={`
                    flex
                    items-center
                    gap-3
                    p-4
                    border
                    rounded-xl
                    cursor-pointer
                    transition
                    hover:bg-gray-50
                    hover:border-blue-300
                    ${
                      selectedDocs.includes(doc.id)
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-200 bg-white'
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    checked={selectedDocs.includes(doc.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedDocs(prev => [
                          ...prev,
                          doc.id,
                        ])
                      } else {
                        setSelectedDocs(prev =>
                          prev.filter(
                            id => id !== doc.id
                          )
                        )
                      }
                    }}
                    className="w-4 h-4 accent-blue-600"
                  />

                  <span className="text-gray-700 font-medium">
                    {doc.name}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}