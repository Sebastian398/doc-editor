import { prisma } from '@/lib/db'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    const doc = await prisma.document.findUnique({
      where: { id },
      include: { fields: true },
    })

    if (!doc) {
      return new Response(JSON.stringify({ error: 'Not found' }), {
        status: 404,
      })
    }

    return new Response(JSON.stringify(doc), { status: 200 })
  } catch (error) {
    console.error(error)

    return new Response(JSON.stringify({ error: 'Server error' }), {
      status: 500,
    })
  }
}
// DELETE DOCUMENTO
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = await params

    console.log('Deleting document:', id)

    // obtener rooms relacionadas
    const rooms = await prisma.room.findMany({
      where: { documentId: id },
      select: { id: true },
    })

    const roomIds = rooms.map((r) => r.id)

    // eliminar responses si existen
    if (roomIds.length > 0) {
      await prisma.response.deleteMany({
        where: {
          roomId: { in: roomIds },
        },
      })
    }

    // eliminar fields
    await prisma.field.deleteMany({
      where: { documentId: id },
    })

    // eliminar rooms
    await prisma.room.deleteMany({
      where: { documentId: id },
    })

    // eliminar documento
    await prisma.document.delete({
      where: { id },
    })

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200 }
    )

  } catch (error) {
    console.error('DELETE ERROR:', error)

    return new Response(
      JSON.stringify({ error: 'Delete failed' }),
      { status: 500 }
    )
  }
}
