import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function GET() {

  try {

    const session =
      await getServerSession(
        authOptions
      )

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

    const rooms =
      await prisma.room.findMany({

        where: {

          document: {

            ownerId:
              session.user.id,
          },
        },

        include: {

          document: {

            include: {

              fields: true,
            },
          },

          responses: true,
        },
      })

    let completed = 0
    let pending = 0

    for (const room of rooms) {

      const totalFields =
        room.document.fields.length

      const answeredFields =
        room.responses.filter(
          (r) =>
            r.value &&
            r.value.trim() !== ''
        ).length

      if (
        totalFields > 0 &&
        answeredFields >= totalFields
      ) {

        completed++

      } else {

        pending++
      }
    }

    const total =
      rooms.length

    const percentage =
      total === 0
        ? 0
        : Math.round(
            (completed / total) * 100
          )

    return Response.json({

      total,

      completed,

      pending,

      percentage,
    })

  } catch (error) {

    console.error(error)

    return new Response(
      'Error cargando estadísticas',
      {
        status: 500,
      }
    )
  }
}