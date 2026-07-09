import { prisma } from '@/lib/db'

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

  return Response.json({
    success: true,
  })
}