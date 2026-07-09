import { prisma } from '@/lib/db'

export async function GET() {
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