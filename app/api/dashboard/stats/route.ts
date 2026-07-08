import { prisma } from '@/lib/db'

export async function GET() {
  try {
    const rooms = await prisma.room.findMany({
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
          r => r.value && r.value.trim() !== ''
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

    const total = rooms.length

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