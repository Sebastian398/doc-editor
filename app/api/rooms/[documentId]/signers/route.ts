import { prisma } from '@/lib/db'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ documentId: string }> }
) {

  const { documentId } =
    await params

  const body =
    await req.json()

  const {
    userId,
    position,
  } = body

  if (
    !userId ||
    !position
  ) {

    return Response.json(
      {
        error:
          'userId y position son requeridos',
      },
      {
        status: 400,
      }
    )
  }

  const signer =
    await prisma.roomSigner.create({

      data: {

        roomId: documentId,

        userId,

        position,
      },
    })

  return Response.json(
    signer
  )
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ documentId: string }> }
) {

  const { documentId } =
    await params

  const signers =
    await prisma.roomSigner.findMany({

      where: {
        roomId: documentId,
      },

      include: {
        user: true,
      },

      orderBy: {
        position: 'asc',
      },
    })

  return Response.json(
    signers
  )
}