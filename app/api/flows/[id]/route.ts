import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { emitFlowUpdated } from '@/lib/socket-emitter'

export async function DELETE(
  req: Request,
  { params }: {
    params: Promise<{ id: string }>
  }
) {

  const session =
    await getServerSession(
      authOptions
    )

  if (
    !session?.user ||
    (
      session.user.role !== 'ADMIN' &&
      session.user.role !== 'MANAGER'
    )
  ) {

    return Response.json(
      {
        error: 'No autorizado',
      },
      {
        status: 403,
      }
    )

  }

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