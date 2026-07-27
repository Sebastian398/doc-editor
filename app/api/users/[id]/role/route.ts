import { prisma } from '@/lib/db'

import { getServerSession }
from 'next-auth'

import { authOptions }
from '@/lib/auth'

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string
    }>
  }
) {

  const session =
    await getServerSession(
      authOptions
    )

  if (
    !session?.user ||
    session.user.role !== 'ADMIN'
  ) {
    return Response.json(
      {
        error: 'No autorizado'
      },
      {
        status: 403
      }
    )
  }

  const { role } =
    await req.json()

  const { id } =
    await params

  const user =
    await prisma.user.update({

      where: {
        id,
      },

      data: {
        role,
      },
    })

  return Response.json(
    user
  )
}