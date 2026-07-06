'use client'

import { useEffect, useState } from 'react'
import PDFViewer from '@/components/PDFViewer'
import CanvasEditor from '@/components/canvaseditor'

type DocumentType = {
  id: string
  name: string
  fileUrl: string
}

export default function EditorPage({ params }: { params: { id: string } }) {
  const [doc, setDoc] = useState<DocumentType | null>(null)
  const [tool, setTool] = useState<'text' | 'signature'>('text')
  const [mode, setMode] = useState<'edit' | 'preview'>('edit')
  const [saveFn, setSaveFn] = useState<() => void>(() => () => {})


  useEffect(() => {
    fetch(`/api/documents/${params.id}`)
      .then(res => res.json())
      .then(setDoc)
  }, [params.id])

  if (!doc) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 flex-col">

        <p className="text-gray-600 mb-3 font-medium">
          Cargando documento
        </p>

        {/* animación puntos */}
        <div className="flex gap-2">
          <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" />
        </div>
      </div>
    )
  }

  return (
    
    <div className="relative w-fit">
      <PDFViewer file={doc.fileUrl}/>
      <CanvasEditor
        documentId={doc.id}
        tool={tool}
        mode={mode}
        pagesInfo={[]}
        onReady={(fn) => setSaveFn(() => fn)}
      />
    </div>


  )
}
