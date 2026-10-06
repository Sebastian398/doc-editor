'use client'

import { useEffect, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

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

  const [data, setData] = useState<VerificationData | null>(null)

  const [loading, setLoading] = useState(true)

  const [roomId, setRoomId] = useState('')
  
  useEffect(() => {

    async function load() {

      try {

        const resolved = await params

        setRoomId(resolved.roomId)

        const response = await fetch(
            `/api/verify/${resolved.roomId}`
          )

        if (!response.ok) {throw new Error()}

        const result = await response.json()

        setData(result)

      } catch {

        setData({
          valid: false,
          certificateId: '',
          documentName: '',
          signedAt: '',
          documentHash: '',
          signatures: [],
        })

      } finally {

        setLoading(false)

      }

    }

    load()

  }, [params])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 flex-col">
        <p className="text-gray-600 mb-3 font-medium">
          Verificando documento...
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

  if (!data?.valid) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">

        <div
          className="
            bg-white
            rounded-2xl
            shadow-sm
            border
            p-12
            text-center
            max-w-lg
          "
        >

          <div className="text-6xl mb-4">
            ❌
          </div>

          <h2 className="text-2xl font-bold text-gray-800 mb-2">
            Certificado no encontrado
          </h2>

          <p className="text-gray-500">
            El certificado solicitado no existe
            o ya no está disponible.
          </p>

        </div>

      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-8">

        <div className="flex items-start gap-4 mb-4">

          <Link
            href={`/certificate/${roomId}`}
            className="
              flex
              items-center
              justify-center
              w-10
              h-10
              rounded-lg
              bg-gray-100
              text-gray-600
              hover:text-gray-900">
            <ArrowLeft size={35}/>
          </Link>
          <h1 className="text-4xl font-bold mb-4 text-black">
                Verificación de documento
          </h1>
        </div>

        <div className="mb-6 flex items-center gap-3">

          <div className="
            inline-flex
            items-center
            gap-2
            bg-green-100
            text-green-700
            px-4
            py-2
            rounded-lg
            font-semibold
          ">
            VERIFICADO DIGITALMENTE
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
            text-xs
            overflow-x-auto
          ">
            {data.documentHash}
          </code>

        </div>

        <hr className="my-8 text-gray-700" />

        <h2 className="text-2xl font-semibold mb-4 text-black">
          Firmas guardadas
        </h2>

        <div className="space-y-4">

          {data.signatures.length === 0 && (

            <div
              className="
                border
                rounded-xl
                p-6
                text-center
                bg-gray-50
              "
            >

              <p className="text-gray-500">
                No existen firmas registradas.
              </p>

            </div>

          )}

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
                      'Firmante anónimo'
                    }
                  </p>

                  <p>
                    <strong>
                      Correo:
                    </strong>{' '}
                    {
                      signature.signerEmail ??
                      'No disponible'
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