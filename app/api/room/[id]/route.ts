import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'
import { emitDashboardUpdated, emitRoomUpdated, emitFlowUpdated } from '@/lib/socket-emitter'

//GET
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return Response.json(
      {
        error: 'No autorizado',
      },
      {
        status: 401,
      }
    )
  }
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
    const session = await getServerSession(authOptions)
    if (
      !session?.user ||
      (
        session.user.role !== 'ADMIN' &&
        session.user.role !== 'MANAGER'
      )
    ) {
      return Response.json(
        {
          error: 'No autorizado',
        },
        {
          status: 403,
        }
      )
    }
    await prisma.room.delete({
      where: { id },
    })
    emitDashboardUpdated()
    emitRoomUpdated(id)
    emitFlowUpdated()

    return Response.json({ success: true })
  } catch (error) {
    console.error(error)
    return new Response('Error eliminando sala', { status: 500 })
  }
}
