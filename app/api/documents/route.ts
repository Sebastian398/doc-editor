import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  const { name, fileUrl } = await req.json()

  const doc = await prisma.document.create({
    data: {
      name,
      fileUrl,
    },
  })

  return Response.json(doc)
}

export async function GET() {
  const docs = await prisma.document.findMany()
  return Response.json(docs)
}