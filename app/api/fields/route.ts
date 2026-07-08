import { prisma } from '@/lib/db'

type FieldInput = {
  x: number
  y: number
  width: number
  height: number
  xRatio?: number 
  yRatio?: number
  widthRatio?: number
  heightRatio?: number
  page?: number
  pageWidth?: number
  pageHeight?: number
  type?: 'text' | 'signature'
}

export async function POST(req: Request) {
  try {
    const body: {
      documentId: string
      fields: FieldInput[]
    } = await req.json()

    const { documentId, fields } = body

    // validar documentId
    if (!documentId) {
      return new Response('Falta documentId', { status: 400 })
    }

    // validar fields
    if (!fields || !Array.isArray(fields)) {
      return new Response('Fields inválidos ❌', { status: 400 })
    }

    // limpiar campos vacíos o inválidos
    const cleanFields = fields.filter((f) => {
      return (
        typeof f.x === 'number' &&
        typeof f.y === 'number' &&
        typeof f.width === 'number' &&
        typeof f.height === 'number' &&
        f.width > 0 &&
        f.height > 0
      )
    })

    await prisma.field.deleteMany({
      where: { documentId },
    })

    // guardar nuevos
    await prisma.field.createMany({
      data: cleanFields.map((f) => ({
        documentId,
        x: f.x,
        y: f.y,
        width: f.width,
        height: f.height,   
        xRatio: f.xRatio,
        yRatio: f.yRatio,
        widthRatio: f.widthRatio,
        heightRatio: f.heightRatio,
        page: f.page || 1,
        pageWidth: f.pageWidth,
        pageHeight: f.pageHeight,
        type: f.type ?? 'text',
      })),
    })

    return Response.json({ ok: true })
  } catch (error) {
    console.error('ERROR FIELDS:', error)

    return new Response('Error guardando campos ❌', {
      status: 500,
    })
  }
}