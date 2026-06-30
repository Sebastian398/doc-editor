import { prisma } from '@/lib/db'

type ResponseInput = {
  value: string
  fieldId: string
  roomId: string
}

export async function POST(req: Request) {
  const body: { responses: ResponseInput[] } = await req.json()
  const roomId = body.responses[0]?.roomId
  
  await prisma.response.deleteMany({
    where: { roomId },
  })

  await prisma.response.createMany({
    data: body.responses,
  })

  return Response.json({ ok: true })
}