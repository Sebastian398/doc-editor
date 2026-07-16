import { prisma } from '@/lib/db'
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib'

export async function GET(
  req: Request,
  { params }: { params: Promise<{ roomId: string }> }
) {

  const { roomId } = await params

  const certificate =
    await prisma.completionCertificate.findUnique({
      where: {
        roomId,
      },
      include: {
        room: {
          include: {
            document: true,
          },
        },
      },
    })

  if (!certificate) {

    return new Response(
      'Certificate not found',
      {
        status: 404,
      }
    )

  }

  const pdf =
    await PDFDocument.create()

  const page =
    pdf.addPage([595, 842])

  const font =
    await pdf.embedFont(
      StandardFonts.Helvetica
    )

  let y = 790

const draw = (
  text: string,
  size = 12,
  x = 50
) => {

  page.drawText(text, {
    x,
    y,
    size,
    font,
  })

  y -= size + 8
}

const browser =
  certificate.userAgent?.includes('Edg')
    ? 'Microsoft Edge'
    : certificate.userAgent?.includes('Chrome')
    ? 'Google Chrome'
    : 'Unknown Browser'

/* ===================================
   HEADER
=================================== */

page.drawText(
  'CERTIFICATE OF COMPLETION',
  {
    x: 50,
    y,
    size: 22,
    font,
  }
)

page.drawText(
  'SIGNED',
  {
    x: 470,
    y: 792,
    size: 14,
    font,
    color: rgb(0, 0.6, 0),
  }
)

y -= 26

page.drawText(
  'Digital Document Verification Certificate',
  {
    x: 50,
    y,
    size: 11,
    font,
    color: rgb(0.4, 0.4, 0.4),
  }
)

y -= 20

page.drawLine({
  start: { x: 50, y },
  end: { x: 545, y },
  thickness: 1,
  color: rgb(0.8, 0.8, 0.8),
})

y -= 25

/* ===================================
   GENERAL INFO
=================================== */

draw('GENERAL INFORMATION', 14)

draw(
  `Certificate ID: ${certificate.id}`
)

draw(
  `Document: ${certificate.room.document.name}`
)

draw(
  `Generated: ${new Date(
    certificate.createdAt
  ).toLocaleString('es-CO')}`
)

draw(
  `Signed: ${new Date(
    certificate.signedAt
  ).toLocaleString('es-CO')}`
)

y -= 10

/* ===================================
   SIGNER
=================================== */

draw('SIGNER INFORMATION', 14)

draw(
  `Signer: ${
    certificate.signerName ??
    'Anonymous Signer'
  }`
)

draw(
  `Email: ${
    certificate.signerEmail ??
    'Not Available'
  }`
)

y -= 10

/* ===================================
   AUTHENTICATION
=================================== */

draw('AUTHENTICATION EVIDENCE', 14)

draw(
  `IP Address: ${certificate.ipAddress}`
)

draw(
  `Browser: ${browser}`
)

y -= 10

/* ===================================
   STATUS
=================================== */

draw('DOCUMENT STATUS', 14)

page.drawRectangle({
  x: 50,
  y: y - 5,
  width: 120,
  height: 22,
  color: rgb(0.90, 0.98, 0.90),
})

page.drawText(
  'VALID',
  {
    x: 88,
    y,
    size: 12,
    font,
    color: rgb(0, 0.6, 0),
  }
)

y -= 35

/* ===================================
   HASHES
=================================== */

draw('DOCUMENT INTEGRITY', 14)

draw(
  `Document SHA-256: ${certificate.documentHash.slice(
    0,
    32
  )}...`
)

draw(
  `Response SHA-256: ${certificate.responseHash.slice(
    0,
    32
  )}...`
)

y -= 10

/* ===================================
   VERIFICATION
=================================== */

draw('CERTIFICATE VERIFICATION', 14)

draw(
  `Certificate ID: ${certificate.id}`
)

draw(
  `Verification Status: VALID`
)

draw(
  `Verification Endpoint:`
)

draw(
  `/verify/${certificate.roomId}`,
  10
)

y -= 15

/* ===================================
   LEGAL
=================================== */

draw('LEGAL NOTICE', 14)

const legalText = [

  'This certificate confirms that the',

  'document was completed and recorded',

  'within the platform.',

  '',

  'Document integrity is protected',

  'through SHA-256 cryptographic hashes.',

  '',

  'Any modification to the document',

  'or submitted responses will invalidate',

  'verification.'
]

for (const line of legalText) {
  draw(line, 10)
}

y -= 10

page.drawLine({
  start: { x: 50, y },
  end: { x: 545, y },
  thickness: 1,
  color: rgb(0.85, 0.85, 0.85),
})

y -= 18

page.drawText(
  `Generated automatically by Doc-Editor`,
  {
    x: 50,
    y,
    size: 10,
    font,
    color: rgb(0.45, 0.45, 0.45),
  }
)
const bytes = await pdf.save()

return new Response(
  new Uint8Array(bytes),
  {
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition':
        `attachment; filename="Certificate-${roomId}.pdf"`,
    },
  }
)}
