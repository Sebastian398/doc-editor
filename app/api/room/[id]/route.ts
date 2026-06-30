import { prisma } from '@/lib/db'

//GET
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const room = await prisma.room.findUnique({
    where: { link: id },
    include: {
      document: {
        include: { fields: true },
      },
      responses: true,
    },
  })
  
  if (!room) {
      return new Response(
        JSON.stringify({ error: 'Room no encontrada' }),
        { status: 404 }
      )
    }

  return Response.json(room)
}

// DELETE
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    await prisma.room.delete({
      where: { id },
    })

    return Response.json({ success: true })
  } catch (error) {
    console.error(error)
    return new Response('Error eliminando sala ❌', { status: 500 })
  }
}
