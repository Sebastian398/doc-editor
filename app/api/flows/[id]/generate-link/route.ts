import crypto from 'crypto'
import { prisma } from '@/lib/db'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  const existing =
    await prisma.flowRoom.findFirst({
      where: {
        flowId: id,
      },
    })

  if (existing) {
    return Response.json(existing)
  }

  const flowRoom =
    await prisma.flowRoom.create({
      data: {
        flowId: id,
        link: crypto.randomUUID(),
      },
    })

  return Response.json(flowRoom)
}