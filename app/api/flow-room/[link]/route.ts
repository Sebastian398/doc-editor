import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { getServerSession } from 'next-auth'

export async function GET(
  req: Request,
  { params }: {
    params: Promise<{ link: string }>
  }
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

  const { link } = await params

  const flowRoom =
    await prisma.flowRoom.findUnique({
      where: { link },

      include: {
        flow: {
          include: {
            items: {
              include: {
                room: {
                  include: {
                    document: {
                      include: {
                        fields: true,
                      },
                    },
                    responses: true,  
                  },
                },
              },
            },
          },
        },
      },
    })

  if (!flowRoom) {
    return Response.json(
      { error: 'Flow no encontrado' },
      { status: 404 }
    )
  }

  return Response.json(flowRoom)
}