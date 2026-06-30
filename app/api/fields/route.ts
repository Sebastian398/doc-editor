import { prisma } from '@/lib/db'

type FieldInput = {
  x: number
  y: number
  width: number
  height: number
  type?: 'text' | 'signature'
}

export async function POST(req: Request) {
  try {
    const body: {
      documentId: string
      fields: FieldInput[]
    } = await req.json()

    const { documentId, fields } = body

    // ✅ validar documentId
    if (!documentId) {
      return new Response('Falta documentId ❌', { status: 400 })
    }

    // ✅ validar fields
    if (!fields || !Array.isArray(fields)) {
      return new Response('Fields inválidos ❌', { status: 400 })
    }

    // ✅ limpiar campos vacíos o inválidos
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

    // ✅ si no hay campos válidos
    if (cleanFields.length === 0) {
      return new Response('No hay campos válidos ❌', { status: 400 })
    }

    // ✅ eliminar campos anteriores
    await prisma.field.deleteMany({
      where: { documentId },
    })

    // ✅ guardar nuevos
    await prisma.field.createMany({
      data: cleanFields.map((f) => ({
        documentId,
        x: f.x,
        y: f.y,
        width: f.width,
        height: f.height,
        type: f.type ?? 'text',
      })),
    })

    return Response.json({ ok: true })
  } catch (error) {
    console.error('🔥 ERROR FIELDS:', error)

    return new Response('Error guardando campos ❌', {
      status: 500,
    })
  }
}