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
    const { id } = await params
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

    if (!room) {
      return new Response(
        'Sala no encontrada',
        {
          status: 404,
        }
      )
    }

    const baseUrl =
      process.env.NEXT_PUBLIC_APP_URL ||
      'http://localhost:3000'

    const pdfUrl =
      `${baseUrl}${room.document.fileUrl}`

    const pdfResponse =
      await fetch(pdfUrl)

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

    const pdfDoc =
      await PDFDocument.load(pdfBytes)

    const pages =
      pdfDoc.getPages()

    const font =
      await pdfDoc.embedFont(
        StandardFonts.Helvetica
      )

    for (const field of room.document.fields) {
      const response =
        room.responses.find(
          r => r.fieldId === field.id
        )

      const value =
        response?.value || ''

      const page =
        pages[(field.page ?? 1) - 1]

      if (!page) {
        continue
      }

      const { height } =
        page.getSize()

      const pageWidth = page.getWidth()
      const pageHeight = page.getHeight()

      const scaleX =
        field.pageWidth
          ? pageWidth / field.pageWidth
          : 1

      const scaleY =
        field.pageHeight
          ? pageHeight / field.pageHeight
          : 1

      const width =
        field.widthRatio != null
          ? (
              field.widthRatio *
              field.pageWidth!
            ) * scaleX
          : field.width

      const heightField =
        field.heightRatio != null
          ? (
              field.heightRatio *
              field.pageHeight!
            ) * scaleY
          : field.height

      const x =
        field.xRatio != null
          ? (
              field.xRatio *
              field.pageWidth!
            ) * scaleX
          : field.x

      const y =
        field.yRatio != null
          ? pageHeight -
            (
              (
                field.yRatio *
                field.pageHeight!
              ) * scaleY
            ) -
            heightField
          : pageHeight -
            field.y -
            field.height

      // TEXTO

      if (
        field.type === 'text' ||
        field.type === 'number'
      ) {
        page.drawText(value, {
          x: x + 3,
          y: y + heightField / 2 - 5,
          size: 10,
          font,
          color: rgb(0, 0, 0),
        })
        continue
      }

      // FIRMA

      if (
        field.type === 'signature'
      ) {

        try {
          const mimeType =
            value.substring(
              5,
              value.indexOf(';')
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
          }
          if (image) {
            page.drawImage(image, {
              x,
              y,
              width,
              height: heightField,
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
    const finalPdf =
      await pdfDoc.save()

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