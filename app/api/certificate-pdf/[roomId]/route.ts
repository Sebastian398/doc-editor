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
      'Certificado no encontrado',
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
    : 'Navegador desconocido'

/* ===================================
   HEADER
=================================== */

page.drawText(
  'CERTIFICADO DE COMPLETADO',
  {
    x: 50,
    y,
    size: 22,
    font,
  }
)

page.drawText(
  'FIRMADO',
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
  'Certificado de verificación de documento digital',
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

draw('INFORMACION GENERAL', 14)

draw(
  `ID de Certificado: ${certificate.id}`
)

draw(
  `Documento: ${certificate.room.document.name}`
)

draw(
  `Generado: ${new Date(
    certificate.createdAt
  ).toLocaleString('es-CO')}`
)

draw(
  `Firmado: ${new Date(
    certificate.signedAt
  ).toLocaleString('es-CO')}`
)

y -= 10

/* ===================================
   SIGNER
=================================== */

draw('INFORMACION FIRMANTE', 14)

draw(
  `Firmante: ${
    certificate.signerName ??
    'Firmante anónimo'
  }`
)

draw(
  `Correo: ${
    certificate.signerEmail ??
    'No disponible'
  }`
)

y -= 10

/* ===================================
   AUTHENTICATION
=================================== */

draw('EVIDENCIA DE AUTENTICACION', 14)

draw(
  `Dirección IP: ${certificate.ipAddress}`
)

draw(
  `Navegador: ${browser}`
)

y -= 10

/* ===================================
   STATUS
=================================== */

draw('ESTADO DE DOCUMENTO', 14)

page.drawRectangle({
  x: 50,
  y: y - 5,
  width: 120,
  height: 22,
  color: rgb(0.90, 0.98, 0.90),
})

page.drawText(
  'VALIDO',
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

draw('INTEGRIDAD DE DOCUMENTO', 14)

draw(
  `SHA-256 del documento : ${certificate.documentHash.slice(
    0,
    35
  )}...`
)

draw(
  `SHA-256 de la respuesta: ${certificate.responseHash.slice(
    0,
    35
  )}...`
)

y -= 10

/* ===================================
   VERIFICATION
=================================== */

draw('VERIFICACION DE CERTIFICADO ', 14)

draw(`ID del certificado: ${certificate.id}`)

draw(`Estado de verificación: VALIDO`)

draw(`Endpoint de verificación: /verify/${certificate.roomId}`)

y -= 15

/* ===================================
   LEGAL
=================================== */

draw('AVISO LEGAL', 14)

const legalText = [

  'Este certificado confirma que el',

  'documento fue completado y guardado',

  'dentro de la plataforma.',

  '',

  'La integridad del documento está protegida',

  'through SHA-256 cryptographic hashes.',

  '',

  'Cualquier modificación al documento',

  'o submitted responses serán invalidas',

  'verificación.'
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
  `Generado automáticamente por Doc-Editor`,
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
