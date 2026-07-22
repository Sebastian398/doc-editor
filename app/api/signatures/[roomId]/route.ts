import { prisma } from '@/lib/db'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {
  const { roomId } = await params

  const signatures =
    await prisma.signatureRecord.findMany({
      where: {
        roomId,
      },
      orderBy: {
        signedAt: 'asc',
      },
    })

  return Response.json(signatures)
}