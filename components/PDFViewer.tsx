'use client'

import { Document, Page, pdfjs } from 'react-pdf'
import { useState } from 'react'

// Worker
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString()

type Props = {
  file: string
  preview?: boolean
  onLoad?: (canvas: HTMLCanvasElement) => void

  onPagesRendered?: (
    pages: {
      pageNumber: number
      width: number
      height: number
    }[]
  ) => void
}

export default function PDFViewer({
  file,
  preview = false,
  onLoad,
  onPagesRendered,
}: Props) {
  const [numPages, setNumPages] = useState(0)
  const [pagesInfo, setPagesInfo] = useState<
  { pageNumber: number; width: number; height: number }[]
>([])
  function onDocumentLoadSuccess({
    numPages,
  }: {
    numPages: number
  }) {
    setNumPages(numPages)
  }

  return (
    <Document file={file} onLoadSuccess={onDocumentLoadSuccess}>
      {preview ? (
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
              onLoad(canvas)
            }
          }}
        />
      ) : (
        Array.from({ length: numPages }, (_, index) => (
        <Page
          key={`page_${index + 1}`}
          pageNumber={index + 1}
          width={800}
          renderAnnotationLayer={false}
          renderTextLayer={false}
          onRenderSuccess={(page) => {
            setPagesInfo(prev => {
              const exists = prev.find(
                p => p.pageNumber === index + 1
              )

              if (exists) return prev

              const updated = [
                ...prev,
                {
                  pageNumber: index + 1,
                  width: page.width,
                  height: page.height,
                },
              ]

              onPagesRendered?.(updated)

              return updated
            })
          }}
        />
        ))
      )}
    </Document>
  )
}