import { prisma } from '@/lib/db'
import { sha256 } from '@/lib/crypto'
import { emitDashboardUpdated, emitRoomUpdated, emitFlowUpdated } from '@/lib/socket-emitter'

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

  // GENERAR HASH DE RESPUESTAS
  const responseHash = sha256(    
    JSON.stringify(body.responses)  
  )

  // GUARDAR HASH Y FECHA
  await prisma.room.update({
    where: {
      id: roomId,
    },
    data: {
      responseHash,
      signedAt: new Date(),
    },
  })
  
  emitDashboardUpdated()
  emitRoomUpdated()
  emitFlowUpdated()

  return Response.json({ ok: true })
}