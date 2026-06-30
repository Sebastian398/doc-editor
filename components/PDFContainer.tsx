'use client'

import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'

const PDFViewer = dynamic(() => import('./PDFViewer'), {
  ssr: false,
})


export default function PDFContainer({
  file,
  children,
  onSize,
}: {
  file: string
  children?: React.ReactNode | ((size: { width: number; height: number }) => React.ReactNode)
  onSize?: (size: { width: number; height: number }) => void
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [size, setSize] = useState({ width: 0, height: 0 })

  useEffect(() => {
    if (!ref.current) return

    const update = () => {
      const rect = ref.current!.getBoundingClientRect()

      const newSize = {
        width: rect.width,
        height: rect.height,
      }

      setSize(newSize)
      onSize?.(newSize)
    }

    update()

    const observer = new ResizeObserver(update)
    observer.observe(ref.current)

    return () => observer.disconnect()
  }, [])

  return (
    <div ref={ref} className="relative w-fit">
      <PDFViewer file={file} />

      {/* overlay único */}
      <div className="absolute top-0 left-0 w-full h-full">
        {typeof children === 'function'
            ? (children as (size: { width: number; height: number }) => React.ReactNode)(size)
            : children}
      </div>
    </div>
  )
}