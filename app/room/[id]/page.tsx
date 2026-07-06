'use client'

import { useEffect, useState, useRef } from 'react'
import dynamic from 'next/dynamic'
import SignatureModal from '@/components/SignatureModal'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

const PDFViewer = dynamic(() => import('@/components/PDFViewer'), {
  ssr: false,
})

type Field = {
  id: string

  x: number
  y: number

  width: number
  height: number

  xRatio?: number
  yRatio?: number

  widthRatio?: number
  heightRatio?: number

  page?: number

  type?: 'text' | 'signature'
}

type RoomData = {
  id: string
  document: {
    fileUrl: string
    fields: Field[]
    name?: string
  }
}

export default function RoomPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [data, setData] = useState<RoomData | null>(null)
  const [values, setValues] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)

  const [activeField, setActiveField] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const [containerSize, setContainerSize] = useState({
    width: 1,
    height: 1,
  })
  useEffect(() => {
    async function load() {
      try {
        const { id } = await params

        const res = await fetch(`/api/room/${id}`)
        if (!res.ok) throw new Error('Error cargando room')

        const json = await res.json()
        setData(json)

        const initialValues: Record<string, string> = {}
        

        json.responses.forEach(
          (r: { fieldId: string; value: string }) => {
            initialValues[r.fieldId] = r.value
          }
        )

        setValues(initialValues)
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }
    setTimeout(() => {
      console.log(
        'ROOM CONTAINER',
        containerRef.current?.offsetWidth,
        containerRef.current?.offsetHeight
      )
    }, 1500)
    load()
  }, [params])

  useEffect(() => {
    if (!containerRef.current) return

    const updateSize = () => {
      setContainerSize({
        width: containerRef.current?.clientWidth || 1,
        height: containerRef.current?.clientHeight || 1,
      })
    }
    console.log(
      'ROOM SIZE',
      containerRef.current?.clientWidth,
      containerRef.current?.clientHeight
    )

    updateSize()

    const observer = new ResizeObserver(updateSize)

    observer.observe(containerRef.current)
    setTimeout(() => {
      const pageElement =
        document.querySelector('.react-pdf__Page')

      console.log(
        'ROOM PDF PAGE',
        pageElement?.clientWidth,
        pageElement?.clientHeight
      )
    }, 1000)
    return () => observer.disconnect()
  }, [data])

  function handleChange(fieldId: string, value: string) {
    setValues((prev) => ({
      ...prev,
      [fieldId]: value,
    }))
  }

  function openSignature(fieldId: string) {
    setActiveField(fieldId)
    setShowModal(true)
  }

  function handleSaveSignature(base64: string) {
    if (!activeField) return

    setValues((prev) => ({
      ...prev,
      [activeField]: base64,
    }))

    setShowModal(false)
  }

  async function handleSubmit() {
    if (!data) return

    const responses = Object.entries(values).map(
      ([fieldId, value]) => ({
        fieldId,
        value,
        roomId: data.id,
      })
    )

    await fetch('/api/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ responses }),
    })

    alert('Datos guardados ✅')
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 flex-col">
        <p className="text-gray-600 mb-3 font-medium">
          Cargando documento
        </p>

        <div className="flex gap-2">
          <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" />
          <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" />
          <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" />
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Error cargando documento
      </div>
    )
  }
  
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* HEADER */}
      <div className="bg-white shadow-sm border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-600 hover:text-black">
            <ArrowLeft size={18} />
          </Link>

          <h1 className="font-semibold text-gray-800">
            {data.document.name || 'Documento'}
          </h1>
        </div>

        <button
          onClick={handleSubmit}
          className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition shadow"
        >
          Enviar documento
        </button>
      </div>

      {/* CONTENIDO */}
      <div className="flex flex-1 justify-center p-6">
        <div ref={containerRef} className="relative bg-white shadow-lg rounded-lg w-fit">

          <PDFViewer
            file={data.document.fileUrl}
            onLoad={() => {
              setTimeout(() => {
                console.log(
                  'AFTER PDF LOAD',
                  containerRef.current?.clientWidth,
                  containerRef.current?.clientHeight
                )
              }, 500)
            }}
          />

          {data.document.fields.map((f) => {
            const isSignature = f.type === 'signature'
            console.log({
  id: f.id,
  top:
    f.yRatio != null
      ? f.yRatio * containerSize.height
      : f.y,

  left:
    f.xRatio != null
      ? f.xRatio * containerSize.width
      : f.x,
})
            return (
              <div
                key={f.id}
                style={{
                  position: 'absolute',

                  top:
                    f.yRatio != null
                      ? f.yRatio * containerSize.height
                      : f.y,

                  left:
                    f.xRatio != null
                      ? f.xRatio * containerSize.width
                      : f.x,

                  width:
                    f.widthRatio != null
                      ? f.widthRatio * containerSize.width
                      : f.width,

                  height:
                    f.heightRatio != null
                      ? f.heightRatio * containerSize.height
                      : f.height,

                  zIndex: 10,
                }}
              >
                {isSignature ? (
                  values[f.id] ? (
                    <img
                      src={values[f.id]}
                      className="w-full h-full object-contain border border-red-400"
                    />
                  ) : (
                    <button
                      onClick={() => openSignature(f.id)}
                      className="w-full h-full border-2 border-red-400 bg-gray-50 text-xs text-gray-500 rounded"
                    >
                      Firma aquí
                    </button>
                  )
                ) : (
                  <input
                    placeholder="Escribe aquí"
                    value={values[f.id] || ''}
                    onChange={(e) =>
                      handleChange(f.id, e.target.value)
                    }
                    className="w-full h-full border-2 border-blue-500 bg-white text-black rounded px-1 text-sm"
                  />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <SignatureModal
          onSave={handleSaveSignature}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  )
}