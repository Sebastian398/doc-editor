import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'

export async function GET() {
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
  
  const rooms = await prisma.room.findMany({
    include: {
      document: true,
      flowItems: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return Response.json(
    rooms.map(room => ({
      id: room.id,
      link: room.link,
      documentName: room.document.name,

      occupied:
        room.flowItems.length > 0,
    }))
  )
}