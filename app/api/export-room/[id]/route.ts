export const runtime = 'nodejs'

console.log('EXPORT ROUTE CARGADO')

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
    console.log('==============================')
    console.log('1 - INICIO EXPORTACION')
    console.log('==============================')

    const { id } = await params

    console.log('2 - ROOM ID:', id)

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

    console.log('3 - PRISMA OK')

    if (!room) {
      console.log('ROOM NO EXISTE')

      return new Response(
        'Sala no encontrada',
        {
          status: 404,
        }
      )
    }

    console.log('4 - ROOM ENCONTRADA')
    console.log('ROOM:', room.id)
    console.log('DOC:', room.document.name)
    console.log('PDF URL DB:', room.document.fileUrl)

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      'http://localhost:3000'

    console.log('5 - BASE URL:', baseUrl)

    const pdfUrl =
      `${baseUrl}${room.document.fileUrl}`

    console.log('6 - PDF URL FINAL:')
    console.log(pdfUrl)

    const pdfResponse =
      await fetch(pdfUrl)

    console.log(
      '7 - PDF RESPONSE:',
      pdfResponse.status
    )

    if (!pdfResponse.ok) {
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
      '8 - PDF BYTES:',
      pdfBytes.byteLength
    )

    const pdfDoc =
      await PDFDocument.load(pdfBytes)

    console.log('9 - PDF CARGADO')

    const pages =
      pdfDoc.getPages()

    console.log(
      '10 - PAGINAS:',
      pages.length
    )

    const font =
      await pdfDoc.embedFont(
        StandardFonts.Helvetica
      )

    console.log('11 - FUENTE OK')

    console.log('==============================')
    console.log('12 - RECORRIENDO CAMPOS')
    console.log('==============================')

    for (const field of room.document.fields) {
      const response =
        room.responses.find(
          r => r.fieldId === field.id
        )

      const value =
        response?.value || ''

      console.log({
        fieldId: field.id,
        type: field.type,
        valuePreview:
          value?.substring(0, 50),
      })

      const page =
        pages[(field.page ?? 1) - 1]

      if (!page) {
        console.log(
          'PAGINA NO EXISTE PARA',
          field.id
        )
        continue
      }

      const { height } =
        page.getSize()

      const x = field.x

      const y =
        height -
        field.y -
        field.height

      // =====================
      // TEXTO
      // =====================

      if (
        field.type === 'text' ||
        field.type === 'number'
      ) {
        page.drawText(value, {
          x: x + 2,
          y: y + 2,
          size: 10,
          font,
          color: rgb(0, 0, 0),
        })

        console.log(
          'TEXT OK:',
          field.id
        )

        continue
      }

      // =====================
      // FIRMA
      // =====================

      if (
        field.type === 'signature'
      ) {
        console.log(
          'FIRMA ENCONTRADA'
        )

        console.log(
          'LONGITUD:',
          value?.length
        )

        console.log(
          'PREVIEW:',
          value?.substring(0, 100)
        )

        if (!value) {
          console.log(
            'FIRMA VACIA'
          )
          continue
        }

        if (
          !value.startsWith(
            'data:image'
          )
        ) {
          console.log(
            'NO ES BASE64'
          )
          continue
        }

        try {
          const mimeType =
            value.substring(
              5,
              value.indexOf(';')
            )

          console.log(
            'MIME:',
            mimeType
          )

          const base64 =
            value.split(',')[1]

          let image

          if (
            mimeType.includes(
              'png'
            )
          ) {
            image =
              await pdfDoc.embedPng(
                Buffer.from(
                  base64,
                  'base64'
                )
              )

            console.log(
              'PNG EMBEBIDO'
            )
          } else if (
            mimeType.includes(
              'jpg'
            ) ||
            mimeType.includes(
              'jpeg'
            )
          ) {
            image =
              await pdfDoc.embedJpg(
                Buffer.from(
                  base64,
                  'base64'
                )
              )

            console.log(
              'JPG EMBEBIDO'
            )
          } else {
            console.log(
              'FORMATO NO SOPORTADO:',
              mimeType
            )
          }

          if (image) {
            page.drawImage(image, {
              x,
              y,
              width: field.width,
              height: field.height,
            })

            console.log(
              'FIRMA DIBUJADA:',
              field.id
            )

            console.log({
              x,
              y,
              width:
                field.width,
              height:
                field.height,
            })
          }
        } catch (error) {
          console.error(
            'ERROR DIBUJANDO FIRMA',
            error
          )
        }
      }
    }

    console.log(
      '13 - CREANDO PDF FINAL'
    )

    const finalPdf =
      await pdfDoc.save()

    console.log(
      '14 - PDF FINAL OK:',
      finalPdf.length
    )

    return new Response(
      new Uint8Array(finalPdf),
      {
        headers: {
          'Content-Type':
            'application/pdf',
          'Content-Disposition':
            `attachment; filename="${room.document.name}.pdf"`,
        },
      }
    )
  } catch (error) {
    console.error(
      'ERROR GENERAL:',
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