import { prisma } from '@/lib/db'
import { emitDashboardUpdated, emitFlowUpdated, emitRoomUpdated } from '@/lib/socket-emitter'
import fs from 'fs'
import path from 'path'
import {sha256} from '@/lib/crypto'

export async function POST(req: Request) {
  const { documentId } = await req.json()

  // usa UUID como link
  const link = crypto.randomUUID()

  const document = await prisma.document.findUnique({
    where: {
      id: documentId,
    },
  })

  if (!document) {
    return new Response(
      JSON.stringify({error: 'Documento no encontrado',}),
      { status: 404 }  
    )
  }
  const filePath = path.join(
    process.cwd(),
    'public',
    document.fileUrl
  )

  const pdfBuffer = fs.readFileSync(filePath)

  const documentHash = sha256(pdfBuffer.toString('base64'))

  const room = await prisma.room.create({
    data: {
      documentId,
      link,
      documentHash,
    },
  })
  emitDashboardUpdated()
  emitRoomUpdated()
  emitFlowUpdated()
  return new Response(JSON.stringify(room))
}

export async function GET(
  req: Request,
  { params }: { params: Promise<{ documentId: string }> }
) {
  const { documentId } = await params

  const rooms = await prisma.room.findMany({
    where: { documentId },
    select: {
      id: true,
      link: true, 
    },
    orderBy: {
      createdAt: 'desc',
    },
  })

  return new Response(JSON.stringify(rooms), {
    headers: {
      'Content-Type': 'application/json',
    },
  })
}

