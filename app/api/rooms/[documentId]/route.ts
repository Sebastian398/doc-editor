import { prisma } from '@/lib/db'

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