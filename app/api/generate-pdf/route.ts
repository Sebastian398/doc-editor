export const runtime = 'nodejs'
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

type Field = {
  id: string

  x: number
  y: number

  width: number
  height: number

  page?: number

  type: 'text' | 'signature' | 'number'
}

type ResponseField = {
  fieldId: string
  value: string
}

export async function POST(req: Request) {
  try {
    const body = await req.json()

    const {
      fileUrl,
      fields,
      responses,
    }: {
      fileUrl: string
      fields: Field[]
      responses: ResponseField[]
    } = body

    if (!fileUrl) {
      return new Response('Falta fileUrl', {
        status: 400,
      })
    }

    if (!fields) {
      return new Response('Faltan fields', {
        status: 400,
      })
    }
console.log('GENERATE PDF INICIO')
console.log('FILE URL:', fileUrl)
    const existingPdfResponse =
      await fetch(fileUrl)

    if (!existingPdfResponse.ok) {
      return new Response(
        'Error descargando PDF base ',
        {
          status: 500,
        }
      )
    }

    const existingPdfBytes =
      await existingPdfResponse.arrayBuffer()

    const pdfDoc = await PDFDocument.load(
      existingPdfBytes
    )

    const pages = pdfDoc.getPages()

    const font = await pdfDoc.embedFont(
      StandardFonts.Helvetica
    )

    for (const field of fields) {
      const page =
        pages[(field.page ?? 1) - 1]

      if (!page) continue

      const response = responses?.find(
        (r) => r.fieldId === field.id
      )

      const value = response?.value || ''

      const { height } = page.getSize()

      const x = field.x

      const y =
        height - field.y - field.height

      // TEXTO Y NÚMERO
      if (
        field.type === 'text' ||
        field.type === 'number'
      ) {
        page.drawText(value, {
          x: x + 3,
          y: y + field.height / 2 - 4,
          size: 10,
          font,
          color: rgb(0, 0, 0),
        })
      }

      // FIRMA
      if (field.type === 'signature') {

  console.log('FIRMA DETECTADA')

  console.log(
    value?.substring(0, 100)
  )
} {
        try {
          let image

          if (
            value.startsWith(
              'data:image/png'
            )
          ) {
            const base64 =
              value.split(',')[1]

            image = await pdfDoc.embedPng(
              Buffer.from(
                base64,
                'base64'
              )
            )
          } else if (
            value.startsWith(
              'data:image/jpeg'
            )
          ) {
            const base64 =
              value.split(',')[1]

            image = await pdfDoc.embedJpg(
              Buffer.from(
                base64,
                'base64'
              )
            )
          }

          if (image) {
            page.drawImage(image, {
              x,
              y,
              width: field.width,
              height: field.height,
            })
          }
        } catch (error) {
          console.error(
            'Error insertando firma:',
            error
          )
        }
      }
    }

    const pdfBytes = await pdfDoc.save()

    return new Response(
      new Uint8Array(pdfBytes),
      {
        headers: {
          'Content-Type':
            'application/pdf',
          'Content-Disposition':
            'attachment; filename=documento-firmado.pdf',
        },
      }
    )
  } catch (error) {
    console.error(error)

    return new Response(
      'Error generando PDF',
      {
        status: 500,
      }
    )
  }
}