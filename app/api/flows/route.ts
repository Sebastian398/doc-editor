import { prisma } from '@/lib/db'
import { emitFlowUpdated } from '@/lib/socket-emitter'
import crypto from 'crypto'

export async function GET() {
  const flows = await prisma.flow.findMany({
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
  const body = await req.json()

  const flow = await prisma.flow.create({
    data: {
      name: body.name,

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