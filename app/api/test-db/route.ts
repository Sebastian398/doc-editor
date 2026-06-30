import { prisma } from '@/lib/db'

export async function GET() {
  const docs = await prisma.document.findMany()
  return Response.json(docs)
}
