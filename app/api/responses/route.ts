import { prisma } from '@/lib/db'
import { sha256 } from '@/lib/crypto'
import { headers } from 'next/headers'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { generateSignerToken } from '@/lib/token'
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

  const room = await prisma.room.findUnique({
    where: {
      id: roomId,
    },
  })

  const headersList = await headers()

  const userAgent = headersList.get('user-agent')

  const forwardedFor = headersList.get('x-forwarded-for')

  const ipAddress = forwardedFor ?? 'unknown'
  
  const session = await getServerSession(authOptions)

  const signerName = session?.user?.name ?? null

  const signerEmail = session?.user?.email ?? null


  const signerToken = generateSignerToken()
  if (
    room?.documentHash &&
    room?.responseHash &&
    room?.signedAt
  ) {
    await prisma.completionCertificate.upsert({

      where: {
        roomId,
      },

      update: {
        signerToken,
        signerName,
        signerEmail,
        documentHash: room.documentHash,
        responseHash: room.responseHash,
        ipAddress,
        userAgent,
        signedAt: room.signedAt,
      },

      create: {
        roomId,
        signerToken,
        signerName,
        signerEmail,
        documentHash: room.documentHash,
        responseHash: room.responseHash,
        ipAddress,
        userAgent,
        signedAt: room.signedAt,
      },
    })
    await prisma.signatureRecord.create({
      data: {
        roomId,

        signerToken,

        signerName,

        signerEmail,

        ipAddress,

        userAgent,

        signedAt: room.signedAt,
      },
    })
  }
  
  emitDashboardUpdated()
  emitRoomUpdated()
  emitFlowUpdated()

  return Response.json({ ok: true })
}