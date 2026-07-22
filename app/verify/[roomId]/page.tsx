'use client'

import { useEffect, useState } from 'react'

type Signature = {
  id: string
  signerToken: string | null
  signerName: string | null
  signerEmail: string | null
  ipAddress: string | null
  signedAt: string
}

type VerificationData = {
  valid: boolean
  certificateId: string
  documentName: string
  signedAt: string
  documentHash: string
  signatures: Signature[]
}

export default function VerifyPage({
  params,
}: {
  params: Promise<{
    roomId: string
  }>
}) {

  const [data, setData] =
    useState<VerificationData | null>(null)

  const [loading, setLoading] =
    useState(true)

  useEffect(() => {

    async function load() {

      const resolved =
        await params

      const response =
        await fetch(
          `/api/verify/${resolved.roomId}`
        )

      const result =
        await response.json()

      setData(result)
      setLoading(false)
    }

    load()

  }, [params])

  if (loading) {
    return (
      <div className="p-10">
        Verificando certificado...
      </div>
    )
  }

  if (!data?.valid) {
    return (
      <div className="p-10">
        Certificado no encontrado
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-8">

        <h1 className="text-4xl font-bold mb-4 text-black">
          Verificación de documento
        </h1>

        <div className="mb-6 flex items-center gap-3">

          <div className="
            bg-green-100
            text-green-700
            px-4
            py-2
            rounded-lg
            font-bold
          ">
            VERIFICADO
          </div>

        </div>

        <div className="space-y-3 text-gray-800">

          <p>
            <strong>Documento:</strong>{' '}
            {data.documentName}
          </p>

          <p>
            <strong>ID del Certificado :</strong>{' '}
            {data.certificateId}
          </p>

          <p>
            <strong>Firmado a la(s):</strong>{' '}
            {new Date(
              data.signedAt
            ).toLocaleString()}
          </p>

          <p>
            <strong>Hash del Documento :</strong>
          </p>

          <code className="
            block
            bg-gray-100
            p-3
            rounded
            break-all
          ">
            {data.documentHash}
          </code>

        </div>

        <hr className="my-8 text-gray-700" />

        <h2 className="text-2xl font-semibold mb-4 text-black">
          Firmas guardadas
        </h2>

        <div className="space-y-4">

          {data.signatures.map(
            (signature) => (

              <div
                key={signature.id}
                className="
                  border
                  rounded-lg
                  p-4
                  text-gray-800
                "
              >

                <div className="
                  inline-flex
                  bg-green-100
                  text-green-700
                  px-3
                  py-1
                  rounded
                  text-sm
                  font-medium
                ">
                  Firmado
                </div>

                <div className="mt-3">

                  <p>
                    <strong>
                      Firmante:
                    </strong>{' '}
                    {
                      signature.signerName ??
                      'Anonymous Signer'
                    }
                  </p>

                  <p>
                    <strong>
                      Correo:
                    </strong>{' '}
                    {
                      signature.signerEmail ??
                      'Not Available'
                    }
                  </p>

                  <p>
                    <strong>
                      Token:
                    </strong>{' '}
                    {signature.signerToken}
                  </p>

                  <p>
                    <strong>
                      IP:
                    </strong>{' '}
                    {signature.ipAddress}
                  </p>

                  <p>
                    <strong>
                      Firmado a la(s):
                    </strong>{' '}
                    {
                      new Date(
                        signature.signedAt
                      ).toLocaleString()
                    }
                  </p>

                </div>

              </div>

            )
          )}

        </div>

      </div>

    </div>
  )
}