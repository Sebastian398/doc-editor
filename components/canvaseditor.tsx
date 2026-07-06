'use client'

import { useEffect, useRef } from 'react'
import * as fabric from 'fabric'
import type { TPointerEventInfo, TPointerEvent } from 'fabric'

type FieldFromDB = {
  x: number
  y: number
  width: number
  height: number
  type?: 'text' | 'signature'
}

type FabricRectWithType = fabric.Rect & {
  fieldType?: 'text' | 'signature'
}

type Props = {
  documentId: string
  tool: 'text' | 'signature'
  mode: 'edit' | 'preview'
  onReady: (saveFn: () => void) => void
}

export default function CanvasEditor({
  documentId,
  tool,
  mode,
  onReady,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const fabricRef = useRef<fabric.Canvas | null>(null)

  const toolRef = useRef(tool)
  const modeRef = useRef(mode)

  useEffect(() => {
    toolRef.current = tool
    updateVisibility()
  }, [tool])

  useEffect(() => {
    modeRef.current = mode
    updateVisibility()
  }, [mode])

  // VISIBILIDAD
  function updateVisibility() {
    const canvas = fabricRef.current
    if (!canvas) return

    canvas.getObjects().forEach((obj) => {
      const o = obj as FabricRectWithType

      if (modeRef.current === 'preview') {
        o.visible = true
        o.selectable = false
        o.evented = false
      } else {
        const match = o.fieldType === toolRef.current
        o.visible = match
        o.selectable = match
        o.evented = match
      }
    })

    canvas.renderAll()
  }

  // CREAR CAMPO
  function createRect(
    x: number,
    y: number,
    w: number,
    h: number,
    type: 'text' | 'signature'
  ) {
    const rect = new fabric.Rect({
      left: x,
      top: y,
      width: w,
      height: h,
      scaleX: 1,
      scaleY: 1,
      fill: 'transparent',
      stroke: type === 'signature' ? '#e11d48' : '#2563eb',
      strokeWidth: 2,
      cornerSize: 8,
      transparentCorners: false,
      cornerColor: '#6366f1',
    }) as FabricRectWithType

    rect.fieldType = type
    rect.setControlsVisibility({ mtr: false })

    return rect
  }

  // CARGAR CAMPOS
  async function loadFields(canvas: fabric.Canvas) {
    const res = await fetch(`/api/documents/${documentId}`)
    if (!res.ok) return

    const data: { fields: FieldFromDB[] } = await res.json()

    data.fields.forEach((f) => {
      const rect = createRect(
        f.x,
        f.y,
        f.width,
        f.height,
        f.type || 'text'
      )
      canvas.add(rect)
    })

    updateVisibility()
  }

  // GUARDAR
  async function saveFields() {
    const canvas = fabricRef.current
    if (!canvas) return

    const canvasWidth = canvas.getWidth()
    const canvasHeight = canvas.getHeight()
    const fields = canvas.getObjects().map((obj) => {
      const o = obj as FabricRectWithType

      const realWidth = (o.width ?? 0) * (o.scaleX ?? 1)
      const realHeight = (o.height ?? 0) * (o.scaleY ?? 1)
console.log({
  left: o.left,
  top: o.top,
  width: realWidth,
  height: realHeight,
});const bounds = o.getBoundingRect()
      return {
        
x: bounds.left,
  y: bounds.top,

  width: bounds.width,
  height: bounds.height,

        
xRatio: bounds.left / canvasWidth,
  yRatio: bounds.top / canvasHeight,

  widthRatio: bounds.width / canvasWidth,
  heightRatio: bounds.height / canvasHeight,

  page: 1,

  type: o.fieldType || 'text',
}

    })

    await fetch('/api/fields', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentId, fields }),
    })

    alert('Campos guardados ✅')
  }

  useEffect(() => {
    if (!canvasRef.current) return

    const container = document.getElementById('pdf-container')
    if (!container) return

    const canvas = new fabric.Canvas(canvasRef.current, {
      width: container.clientWidth,
      height: container.clientHeight,
    })
    
    setTimeout(() => {
      console.log('CONTAINER WIDTH', container.offsetWidth)
      console.log('CONTAINER HEIGHT', container.offsetHeight)

      console.log(
        'FABRIC WIDTH',
        canvas.getWidth()
      )

      console.log(
        'FABRIC HEIGHT',
        canvas.getHeight()
      )
    }, 1500)

    canvas.allowTouchScrolling = true
    fabricRef.current = canvas

    loadFields(canvas)

    // CLICK
    canvas.on('mouse:down', (opt: TPointerEventInfo<TPointerEvent>) => {
      if (modeRef.current === 'preview') return
      if (!opt.e) return
      if (opt.target) return

      const event = opt.e as PointerEvent
      const rectBounds = canvas.upperCanvasEl.getBoundingClientRect()

      const scaleX = canvas.getWidth() / rectBounds.width
      const scaleY = canvas.getHeight() / rectBounds.height

      const x = (event.clientX - rectBounds.left) * scaleX
      const y = (event.clientY - rectBounds.top) * scaleY

      const newRect = createRect(
        x,
        y,
        toolRef.current === 'signature' ? 200 : 150,
        toolRef.current === 'signature' ? 70 : 30,
        toolRef.current
      )

      canvas.add(newRect)
      canvas.setActiveObject(newRect)
    })

    // DELETE
    const handleDelete = (e: KeyboardEvent) => {
      if (e.key === 'Backspace') {
        const active = canvas.getActiveObject()
        if (active) {
          canvas.remove(active)
          canvas.discardActiveObject()
          canvas.requestRenderAll()
        }
      }
    }

    window.addEventListener('keydown', handleDelete)

    // RESIZE
    const observer = new ResizeObserver(() => {
      canvas.setDimensions({
        width: container.clientWidth,
        height: container.clientHeight,
      })

      canvas.renderAll()
    })

    observer.observe(container)

    setTimeout(() => {
      console.log('PDF CONTAINER', container)

      const pageElement =
        document.querySelector('.react-pdf__Page')

      console.log(
        'PDF PAGE',
        pageElement?.clientWidth,
        pageElement?.clientHeight
      )
    }, 1000)

    requestAnimationFrame(() => {
      onReady(saveFields)
    })

    return () => {
      observer.disconnect()
      window.removeEventListener('keydown', handleDelete)
      canvas.dispose()
    }
  }, [documentId])

  return (
    <div className="absolute top-0 left-0 w-full h-full z-20 pointer-events-none">
      <canvas ref={canvasRef} className="pointer-events-auto" />
    </div>
  )
}
