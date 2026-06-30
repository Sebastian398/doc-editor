import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  const { documentId } = await req.json()

  // usa UUID como link
  const link = crypto.randomUUID()

  const room = await prisma.room.create({
    data: {
      documentId,
      link,
    },
  })

  return new Response(JSON.stringify(room))
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ documentId: string }> }
) {
  const { documentId } = await params

  const rooms = await prisma.room.findMany({
    where: { documentId },
    select: {
      id: true,
      link: true, 
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return new Response(JSON.stringify(rooms), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

