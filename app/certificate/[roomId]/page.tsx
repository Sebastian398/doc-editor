'use client'

import { useEffect, useState } from 'react'

type CertificateType = {

  roomId: string

  documentName: string

  documentHash: string

  responseHash: string

  signedAt: string

  ipAddress: string

  userAgent: string

  signerName?: string

  signerEmail?: string

  valid: boolean
}

export default function CertificatePage({
  params,
}: {
  params: Promise<{
    roomId: string
  }>
}) {

  const [certificate,
    setCertificate] =
      useState<CertificateType | null>(null)

  const [loading,
    setLoading] =
      useState(true)

  useEffect(() => {

    async function load() {

      const resolved =
        await params

      const res =
        await fetch(
          `/api/certificate/${resolved.roomId}`
        )

      const data =
        await res.json()

      setCertificate(data)

      setLoading(false)
    }

    load()

  }, [params])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 flex-col">
        <p className="text-gray-600 mb-3 font-medium">
          Cargando certificado...
        </p>

        <div className="flex gap-2">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-3 h-3 bg-blue-500 rounded-full"
              style={{
                animation: 'loadingDots 1.2s infinite',
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>

        <style jsx>{`
          @keyframes loadingDots {
            0%,
            80%,
            100% {
              transform: scale(0.6);
              opacity: 0.4;
            }

            40% {
              transform: scale(1.2);
              opacity: 1;
            }
          }
        `}</style>
      </div>
    )
  }

  if (!certificate) {
    return (
      <div className="p-10">
        Certificado no encontrado
      </div>
    )
  }

  return (

    <div className="min-h-screen bg-gray-100 p-8 text-gray-800">

      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow p-8">

        <h1 className="text-4xl font-bold text-center mb-8">

          Certificado de completado

        </h1>
        <div className="flex gap-4 mb-8">

          <a
            href={`/api/certificate-pdf/${certificate.roomId}`} 
            className="
            bg-blue-400 
            hover:bg-blue-500 
            text-white 
            font-medium 
            px-4  
            py-3 
            rounded-lg 
            transition">
            Descargar PDF
          </a>

          <a
            href={`/verify/${certificate.roomId}
            `}className="
              bg-green-400
              hover:bg-green-500
              text-white
              font-medium
              px-4
              py-3
              rounded-lg
            "
          >
            Verificar Certificado
          </a>

        </div>

        <div className="space-y-6">

          <div>
            <h2 className="font-bold">
              Documento
            </h2>

            <p>
              {certificate.documentName}
            </p>
          </div>

          <div>
            <h2 className="font-bold">
              Room ID
            </h2>

            <p>
              {certificate.roomId}
            </p>
          </div>

          <div>
            <h2 className="font-bold">
              Firmado
            </h2>

            <p>
              {
                new Date(
                  certificate.signedAt
                ).toLocaleString()
              }
            </p>
          </div>

          <div>
            <h2 className="font-bold">
              Dirección IP
            </h2>

            <p>
              {certificate.ipAddress}
            </p>
          </div>

          <div>
            <h2 className="font-bold">
              Estado
            </h2>

            <span className="
              bg-green-100
              text-green-700
              px-3
              py-1
              rounded-full
            ">
              VALIDO
            </span>
          </div>

          <div>
            <h2 className="font-bold mb-2">
              Hash del documento
            </h2>

            <code className="
              break-all
              text-sm
              bg-gray-100
              p-2
              block
              rounded
            ">
              {certificate.documentHash}
            </code>
          </div>

          <div>
            <h2 className="font-bold mb-2">
              Hash de respuesta
            </h2>

            <code className="
              break-all
              text-sm
              bg-gray-100
              p-2
              block
              rounded
            ">
              {certificate.responseHash}
            </code>
          </div>

          <div>
            <h2 className="font-bold mb-2">
              Navegador
            </h2>

            <code className="
              break-all
              text-sm
              bg-gray-100
              p-2
              block
              rounded
            ">
              {certificate.userAgent}
            </code>
          </div>

        </div>

      </div>

    </div>
  )
}