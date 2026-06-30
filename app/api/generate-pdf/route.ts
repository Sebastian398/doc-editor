import { PDFDocument, rgb } from 'pdf-lib'

type Field = {
  x: number
  y: number
  width: number
  height: number
  type: 'text' | 'signature'
  pageIndex?: number
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    console.log('BODY:', body)

    const { fileUrl, fields }: {
      fileUrl: string
      fields: Field[]
    } = body

    if (!fileUrl) {
      return new Response('Falta fileUrl ❌', { status: 400 })
    }

    if (!fields) {
      return new Response('Faltan fields ❌', { status: 400 })
    }

    console.log('📄 Cargando PDF:', fileUrl)

    const existingPdfResponse = await fetch(fileUrl)

    if (!existingPdfResponse.ok) {
      console.error('❌ ERROR descargando PDF base')
      return new Response('Error descargando PDF base ❌', { status: 500 })
    }

    const existingPdfBytes = await existingPdfResponse.arrayBuffer()

    const pdfDoc = await PDFDocument.load(existingPdfBytes)
    const pages = pdfDoc.getPages()

    console.log('✅ PDF cargado, páginas:', pages.length)

    fields.forEach((field) => {
      const page = pages[field.pageIndex ?? 0]
      if (!page) return

      const { height } = page.getSize()

      const x = field.x
      const y = height - field.y - field.height

      if (field.type === 'text') {
        page.drawRectangle({
          x,
          y,
          width: field.width,
          height: field.height,
          borderColor: rgb(0.2, 0.2, 1),
          borderWidth: 1,
        })

        page.drawText('Texto', {
          x: x + 5,
          y: y + field.height / 2,
          size: 10,
        })
      }

      if (field.type === 'signature') {
        page.drawRectangle({
          x,
          y,
          width: field.width,
          height: field.height,
          borderColor: rgb(1, 0.2, 0.2),
          borderWidth: 1,
        })

        page.drawText('Firma', {
          x: x + 5,
          y: y + field.height / 2,
          size: 10,
        })
      }
    })

    const pdfBytes = await pdfDoc.save()

    console.log('✅ PDF generado correctamente')

    return new Response(new Uint8Array(pdfBytes), {
      headers: {
        'Content-Type': 'application/pdf',
      },
    })

  } catch (error) {
    console.error('ERROR:', error)
    return new Response('Error interno generando PDF ❌', { status: 500 })
  }
}