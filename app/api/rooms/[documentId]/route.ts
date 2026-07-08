import { prisma } from '@/lib/db'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ documentId: string }> }
) {
  const { documentId } = await params

  const roomsDb = await prisma.room.findMany({
    where: { documentId },
    include: {
      responses: true,
      document: {
        include: {
          fields: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })
  
  const rooms = roomsDb.map(room => {
  const totalFields =
    room.document.fields.length

  const answeredFields =
    room.responses.filter(
      r =>
        r.value &&
        r.value.trim() !== ''
    ).length

  let status:
    | 'not_started'
    | 'pending'
    | 'completed'

  if (answeredFields === 0) {
    status = 'not_started'
  } else if (
    answeredFields >= totalFields &&
    totalFields > 0
  ) {
    status = 'completed'
  } else {
    status = 'pending'
  }

  return {
    id: room.id,
    link: room.link,
    status,
    totalFields,
    answeredFields,
  }
})

  return new Response(JSON.stringify(rooms), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}