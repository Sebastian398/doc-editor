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
      <div className="p-10">
        Cargando certificado...
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

          Certificate Of Completion

        </h1>
        <div className="flex gap-3 mb-6">

          <a
            href={`/api/certificate.roomId}`}>
            Descargar PDF
          </a>

          <a
            href={`/verify
            className="
              bg-green-600
              text-white
              px-4
              py-2
              rounded
            "`}
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
              Signed At
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
              IP Address
            </h2>

            <p>
              {certificate.ipAddress}
            </p>
          </div>

          <div>
            <h2 className="font-bold">
              Status
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
              Document Hash
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
              Response Hash
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
              User Agent
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