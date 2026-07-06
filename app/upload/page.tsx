'use client'

import { useState } from 'react'
import { Upload, FileText, AlertCircle } from 'lucide-react'
import Link from 'next/link'
import dynamic from 'next/dynamic'

// PDF Viewer dinámico
const PDFViewer = dynamic(() => import('@/components/PDFViewer'), {
  ssr: false,
})

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // VALIDAR PDF
  function validateFile(selectedFile: File) {
    const isPDF =
      selectedFile.type === 'application/pdf' ||
      selectedFile.name.toLowerCase().endsWith('.pdf')

    if (!isPDF) {
      setError('Solo se permiten archivos PDF')
      setFile(null)
      setPreviewUrl(null)
      return false
    }

    setError(null)
    setPreviewUrl(URL.createObjectURL(selectedFile)) // preview local
    return true
  }

  // SUBIR DOCUMENTO
  async function handleUpload() {
    if (!file) return

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const uploadRes = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!uploadRes.ok) throw new Error()

      const uploadData = await uploadRes.json()

      const saveRes = await fetch('/api/documents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: file.name,
          fileUrl: uploadData.url,
        }),
      })

      if (!saveRes.ok) throw new Error()

      alert('Documento subido correctamente ✅')

      // limpiar estado
      setFile(null)
      setPreviewUrl(null)

    } catch {
      alert('Error subiendo documento ❌')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">

      <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md">

        {/* VOLVER */}
        <Link href="/" className="text-sm text-blue-600 mb-4 inline-block">
          ← Volver al dashboard
        </Link>

        <h1 className="text-xl font-bold text-gray-800 mb-6 text-center">
          Subir documento PDF
        </h1>

        {/* DROP AREA */}
        <label
          className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg p-6 cursor-pointer hover:border-blue-400 transition text-center overflow-hidden"
          onDrop={(e) => {
            e.preventDefault()
            const droppedFile = e.dataTransfer.files[0]

            if (droppedFile && validateFile(droppedFile)) {
              setFile(droppedFile)
            }
          }}
          onDragOver={(e) => e.preventDefault()}
        >
          
          {/* CONTENIDO DINÁMICO */}
          {previewUrl ? (

            <>
              {/* 📄 PREVIEW */}
              <div className="w-full h-52 overflow-hidden bg-gray-50 rounded-md mb-3">
                <div className="scale-[0.4] origin-top-left pointer-events-none">
                  <PDFViewer file={previewUrl} preview/>
                </div>
              </div>

              {/* 📄 NOMBRE */}
              <div className="flex flex-col items-center">
                <FileText size={18} className="text-blue-500 mb-1" />
                <span className="text-sm font-medium text-gray-700">
                  {file?.name}
                </span>
              </div>
            </>

          ) : (

            <>
              <Upload size={35} className="text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">
                Arrastra tu archivo o haz clic para seleccionar
              </span>
            </>

          )}

          <input
            type="file"
            hidden
            accept=".pdf"
            onChange={(e) => {
              const selected = e.target.files?.[0]

              if (selected && validateFile(selected)) {
                setFile(selected)
              }
            }}
          />
        </label>

        {/* ERROR */}
        {error && (
          <div className="flex items-center gap-2 text-red-600 text-sm mt-3">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* INFO */}
        <p className="text-xs text-gray-400 mt-2 text-center">
          Formato admitido: PDF
        </p>

        {/* BOTÓN */}
        <button
          onClick={handleUpload}
          disabled={!file || loading}
          className="mt-6 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
        >
          {loading ? 'Subiendo...' : 'Subir documento'}
        </button>

      </div>
    </div>
  )
}