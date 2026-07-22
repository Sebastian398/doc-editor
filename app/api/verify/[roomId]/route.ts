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

    return Response.json(
      {
        valid: false,
        message:
          'Certificate not found',
      },
      {
        status: 404,
      }
    )
  }

  const signatures =
    await prisma.signatureRecord.findMany({
      where: {
        roomId,
      },
      orderBy: {
        signedAt: 'asc',
      },
    })

  return Response.json({
    valid: true,

    certificateId:
      certificate.id,

    documentName:
      certificate.room.document.name,

    signedAt:
      certificate.signedAt,

    documentHash:
      certificate.documentHash,

    signatures,
  })
}