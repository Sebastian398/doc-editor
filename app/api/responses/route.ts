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
  const session = await getServerSession(authOptions)
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

  const body: { responses: ResponseInput[] } = await req.json()
  if (
    !body.responses ||
    body.responses.length === 0
  ) {
    return Response.json(
      {
        error: 'No se recibieron respuestas',
      },
      {
        status: 400,
      }
    )
  }

  const roomId = body.responses[0]?.roomId
  if (!roomId) {

    return Response.json(
      {
        error:
          'roomId inválido',
      },
      {
        status: 400,
      }
    )

  }

  for (const response of body.responses) {

    const existing =
      await prisma.response.findFirst({

        where: {
          roomId: response.roomId,
          fieldId: response.fieldId,
        },

      })

    if (existing) {

      return Response.json(
        {
          error:'Uno o más campos ya fueron diligenciados',
        },
        {
          status: 409,
        }
      )

    }

  }

  await prisma.response.createMany({
    data: body.responses,
  })

  // GENERAR HASH DE RESPUESTAS
  const responseHash = sha256(JSON.stringify(body.responses))

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