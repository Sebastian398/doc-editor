import { prisma } from '@/lib/db'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {

  const { roomId } = await params

  const certificate =
    await prisma.completionCertificate.findUnique({
      where: {
        roomId,
      },
      include: {
        room: {
          include: {
            document: true,
          },
        },
      },
    })

  if (!certificate) {
    return new Response(
      JSON.stringify({
        error: 'Certificate not found',
      }),
      {
        status: 404,
      }
    )
  }

  return Response.json({

    roomId:
      certificate.roomId,

    documentName:
      certificate.room.document.name,

    documentHash:
      certificate.documentHash,

    responseHash:
      certificate.responseHash,

    signedAt:
      certificate.signedAt,

    ipAddress:
      certificate.ipAddress,

    userAgent:
      certificate.userAgent,

    signerName:
      certificate.signerName,

    signerEmail:
      certificate.signerEmail,

    valid: true,
  })
}