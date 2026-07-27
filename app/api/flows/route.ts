import { prisma } from '@/lib/db'
import { emitFlowUpdated } from '@/lib/socket-emitter'
import crypto from 'crypto'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return Response.json(
      {error: 'No autorizado,'},
      {status:401,}
    )
  }
  const flows = await prisma.flow.findMany({
    where: {
      ownerId: session.user.id,
    },
    include: {
      rooms: true,
      items: {
        include: {
          room: {
            include: {
              document: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return Response.json(flows)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return Response.json(
      {error: 'No autorizado,'},
      {status:401,}
    )
  }
  
  const body = await req.json()

  const flow = await prisma.flow.create({
    data: {
      name: body.name,

      ownerId: session.user.id,

      items: {
        create: body.roomIds.map(
          (roomId: string) => ({
            roomId,
          })
        ),
      },
      rooms: {
        create: {
          link: crypto.randomUUID(),
        },
      },
    },
    include: {
      rooms: true,
    },
  })
  emitFlowUpdated()
  return Response.json(flow)
}