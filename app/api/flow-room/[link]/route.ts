import { prisma } from '@/lib/db'

export async function GET(
  req: Request,
  { params }: {
    params: Promise<{ link: string }>
  }
) {
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