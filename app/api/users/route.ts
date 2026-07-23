import { prisma } from '@/lib/db'

export async function GET() {

  const users =
    await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
      orderBy: {
        name: 'asc',
      },
    })

  return Response.json(users)
}