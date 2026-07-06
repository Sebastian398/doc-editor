console.log('EXPORT ROUTE CARGADO')

export const runtime = 'nodejs'

import { prisma } from '@/lib/db'
import {
  PDFDocument,
  rgb,
  StandardFonts,
} from 'pdf-lib'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    console.log('1 - INICIO GET')

    const { id } = await params

    console.log('2 - ID:', id)

    const room = await prisma.room.findUnique({
      where: {
        id,
      },
      include: {
        document: {
          include: {
            fields: true,
          },
        },
        responses: true,
      },
    })

    console.log('3 - CONSULTA PRISMA TERMINADA')

    if (!room) {
      console.log('4 - ROOM NO ENCONTRADA')

      return new Response(
        'Sala no encontrada',
        {
          status: 404,
        }
      )
    }

    console.log('5 - ROOM ENCONTRADA')
    console.log('ROOM:', room.id)
    console.log('DOCUMENTO:', room.document?.name)
    console.log('FILE URL:', room.document?.fileUrl)

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      'http://localhost:3000'

    console.log('6 - BASE URL:', baseUrl)

    const pdfUrl =
      `${baseUrl}${room.document.fileUrl}`

    console.log('7 - PDF URL COMPLETA:')
    console.log(pdfUrl)

    const pdfResponse =
      await fetch(pdfUrl)

    console.log(
      '8 - PDF RESPONSE STATUS:',
      pdfResponse.status
    )

    if (!pdfResponse.ok) {
      console.log('9 - PDF RESPONSE ERROR')

      return new Response(
        'No se pudo cargar PDF base',
        {
          status: 500,
        }
      )
    }

    const pdfBytes =
      await pdfResponse.arrayBuffer()

    console.log(
      '10 - PDF BYTES:',
      pdfBytes.byteLength
    )

    const pdfDoc =
      await PDFDocument.load(pdfBytes)

    console.log('11 - PDF CARGADO')

    const pages =
      pdfDoc.getPages()

    console.log(
      '12 - PAGINAS:',
      pages.length
    )

    const font =
      await pdfDoc.embedFont(
        StandardFonts.Helvetica
      )

    console.log('13 - FUENTE CARGADA')

    for (const field of room.document.fields) {
      const page =
        pages[(field.page ?? 1) - 1]

      if (!page) continue

      const response =
        room.responses.find(
          r => r.fieldId === field.id
        )

      const value =
        response?.value || ''

      const { height } =
        page.getSize()

      const x = field.x

      const y =
        height -
        field.y -
        field.height

      if (
        field.type === 'text' ||
        field.type === 'number'
      ) {
        page.drawText(value, {
          x,
          y,
          size: 10,
          font,
          color: rgb(0, 0, 0),
        })
      }
    }

    console.log('14 - CAMPOS DIBUJADOS')

    const finalPdf =
      await pdfDoc.save()

    console.log(
      '15 - PDF FINAL',
      finalPdf.length
    )

    return new Response(
      new Uint8Array(finalPdf),
      {
        headers: {
          'Content-Type':
            'application/pdf',
          'Content-Disposition':
            'attachment; filename="documento.pdf"',
        },
      }
    )
  } catch (error) {
    console.error(
      'ERROR EXPORTANDO PDF:',
      error
    )

    return new Response(
      'Error generando PDF',
      {
        status: 500,
      }
    )
  }
}