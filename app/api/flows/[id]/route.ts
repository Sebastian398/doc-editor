import { prisma } from '@/lib/db'
import { emitFlowUpdated } from '@/lib/socket-emitter'

export async function DELETE(
  req: Request,
  { params }: {
    params: Promise<{ id: string }>
  }
) {
  const { id } = await params

  await prisma.flow.delete({
    where: {
      id,
    },
  })
  emitFlowUpdated()

  return Response.json({
    success: true,
  })
}