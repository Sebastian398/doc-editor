'use client'

import { useEffect, useState } from 'react'
import CanvasEditor from '@/components/canvaseditor'
import dynamic from 'next/dynamic'
import { Plus, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import Toolbar from '@/components/toolbar'

const PDFViewer = dynamic(() => import('@/components/PDFViewer'), {
  ssr: false,
})

type DocumentType = {
  id: string
  name: string
  fileUrl: string
}

export default function EditorPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const [doc, setDoc] = useState<DocumentType | null>(null)

  // estados correctos
  const [tool, setTool] = useState<'text' | 'number' | 'signature'>('text')
  const [mode, setMode] = useState<'edit' | 'preview'>('edit')
  const [saveFn, setSaveFn] = useState<() => void>(() => () => {})
  const [pagesInfo, setPagesInfo] = useState<
    {
      pageNumber: number
      pdfWidth: number
      pdfHeight: number
      renderWidth: number
      renderHeight: number
    }[]
  >([])
  useEffect(() => {
    async function loadDoc() {
      const { id } = await params

      const res = await fetch(`/api/documents/${id}`)
      if (!res.ok) return

      const data = await res.json()
      setDoc(data)
    }

    loadDoc()
  }, [params])

  async function createRoom(docId: string) {
    const res = await fetch('/api/rooms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentId: docId }),
    })

    const data = await res.json()

    navigator.clipboard.writeText(
      `${window.location.origin}/room/${data.link}`
    )

    alert('Enlace copiado')
  }

  if (!doc) {
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

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

      {/* HEADER */}
      <div className="bg-white shadow-sm border-b px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-gray-600 hover:text-black">
            <ArrowLeft size={18} />
          </Link>

          <h1 className="font-semibold text-gray-800">
            {doc.name}
          </h1>
        </div>

        <button
          onClick={() => createRoom(doc.id)}
          className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition shadow"
        >
          <Plus size={16} />
          Crear sala
        </button>
      </div>

      {/* CONTENIDO */}
      <div className="flex flex-1 justify-center p-6">

        <div
          id="pdf-container"
          className="relative bg-white shadow-lg rounded-xl inline-block"
        >
          <PDFViewer file={doc.fileUrl} onPagesRendered={setPagesInfo}/>

          <CanvasEditor
            documentId={doc.id}
            tool={tool}
            mode={mode}
            pagesInfo={pagesInfo}
            onReady={(fn) => setSaveFn(() => fn)}
          />
        </div>

      </div>

      {/* TOOLBAR */}
      <Toolbar
        tool={tool}
        setTool={setTool}
        mode={mode}
        setMode={setMode}
        onSave={saveFn}
      />

    </div>
  )
}