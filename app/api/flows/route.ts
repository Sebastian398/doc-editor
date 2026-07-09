import { prisma } from '@/lib/db'

export async function GET() {
  const flows = await prisma.flow.findMany({
    include: {
      documents: {
        include: {
          document: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return Response.json(flows)
}

export async function POST(req: Request) {
  const body = await req.json()

  const flow = await prisma.flow.create({
    data: {
      name: body.name,

      documents: {
        create: body.documentIds.map(
          (documentId: string) => ({
            documentId,
          })
        ),
      },
    },
  })

  return Response.json(flow)
}