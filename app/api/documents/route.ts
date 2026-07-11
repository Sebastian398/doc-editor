import { prisma } from '@/lib/db'
import { emitDashboardUpdated } from '@/lib/socket-emitter'

export async function POST(req: Request) {
  const { name, fileUrl } = await req.json()

  const doc = await prisma.document.create({
    data: {
      name,
      fileUrl,
    },
  })
  
  emitDashboardUpdated()

  return Response.json(doc)
}

export async function GET() {
  const docs = await prisma.document.findMany()
  return Response.json(docs)
}