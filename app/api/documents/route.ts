import { prisma } from '@/lib/db'
import { emitDashboardUpdated } from '@/lib/socket-emitter'

import { getServerSession }
  from 'next-auth'

import { authOptions }
  from '@/lib/auth'

export async function POST(
  req: Request
) {

  const session =
    await getServerSession(
      authOptions
    )

  if (!session?.user) {

    return Response.json(
      {
        error:
          'No autorizado',
      },
      {
        status: 401,
      }
    )
  }

  const {
    name,
    fileUrl,
  } =
    await req.json()

  const doc =
    await prisma.document.create({

      data: {

        name,

        fileUrl,

        ownerId:
          session.user.id,
      },
    })

  emitDashboardUpdated()

  return Response.json(doc)
}

export async function GET() {

  const docs =
    await prisma.document.findMany()

  return Response.json(docs)
}
