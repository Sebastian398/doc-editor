'use client'

import { Document, Page, pdfjs } from 'react-pdf'
import { useState, useEffect } from 'react'

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
      pdfWidth: number
      pdfHeight: number
      renderWidth: number
      renderHeight: number
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
    {
      pageNumber: number
      pdfWidth: number
      pdfHeight: number  
      renderWidth: number
      renderHeight: number
    }[]
  >([])

  function onDocumentLoadSuccess({
    numPages,
  }: {
    numPages: number
  }) {
    setNumPages(numPages)
    setPagesInfo([])
  }

  useEffect(() => {
    if (!onPagesRendered) return

    const sortedPages = [...pagesInfo].sort(
      (a, b) => a.pageNumber - b.pageNumber
    )

    onPagesRendered(sortedPages)

  }, [pagesInfo, onPagesRendered])

  return (
    <Document
      file={file}
      onLoadSuccess={onDocumentLoadSuccess}
    >
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
        Array.from(
          { length: numPages },
          (_, index) => (
            <Page
              key={`page_${index + 1}`}
              pageNumber={index + 1}
              width={800}
              renderAnnotationLayer={false}
              renderTextLayer={false}
              onRenderSuccess={(page) => {
                const view =
                  page._pageInfo.view

                const pdfWidth =
                  view[2]

                const pdfHeight =
                  view[3]

                const pageData = {
                  pageNumber: index + 1,

                  pdfWidth,
                  pdfHeight,

                  renderWidth: page.width,
                  renderHeight: page.height,
                }
                setPagesInfo(prev => {

                  const exists =
                    prev.find(
                      p =>
                        p.pageNumber ===
                        index + 1
                    )

                  if (exists) {
                    return prev
                  }

                  return [
                    ...prev,
                    pageData,
                  ]
                })
              }}
            />
          )
        )
      )}
    </Document>
  )
}