'use client'

import { Document, Page, pdfjs } from 'react-pdf'
import { useState } from 'react'

// ✅ Worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

type Props = {
  file: string
  preview?: boolean
  onLoad?: (canvas: HTMLCanvasElement) => void // ✅ IMPORTANTE
}

export default function PDFViewer({ file, preview, onLoad }: Props) {
  const [numPages, setNumPages] = useState<number>(0)

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages)
  }

  return (
    <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
      <Page
        pageNumber={1}
        width={800}
        renderAnnotationLayer={false}
        renderTextLayer={false}
        onRenderSuccess={() => {
          const canvas = document.querySelector(
            '.react-pdf__Page canvas'
          ) as HTMLCanvasElement | null

          if (canvas && onLoad) {
            onLoad(canvas) // ✅ AQUÍ SE ENVÍA EL CANVAS REAL
          }
        }}
      />
    </Document>
  )
}