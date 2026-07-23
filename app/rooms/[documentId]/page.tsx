'use client'

import { useEffect, useState } from 'react'

export default function RoomPage({
  params,
}: {
  params: Promise<{
    roomId: string
  }>
}) {

  const [signers, setSigners] =
    useState<any[]>([])

  useEffect(() => {

    async function load() {

      const { roomId } =
        await params

      const res =
        await fetch(
          `/api/rooms/${roomId}/signers`
        )

      const data =
        await res.json()

      setSigners(data)
    }

    load()

  }, [params])

  return (

    <div className="min-h-screen bg-gray-100">

      <h1 className="text-3xl font-bold">
        Firmantes
      </h1>

      <div className="space-y-4">

        {signers.map(
          signer => (

            <div
              key={signer.id}
              className="
                border
                rounded-xl
                p-6
                shadow-sm
                bg-white
              "
            >

              <p>
                Posición:
                {signer.position}
              </p>

              <p>
                Nombre:
                {signer.user.name}
              </p>

              <p>
                Correo:
                {signer.user.email}
              </p>

              <p>
                Estado:
                {
                  signer.signed
                    ? '✅ Firmado'
                    : '⏳ Pendiente'
                }
              </p>

            </div>

          )
        )}

      </div>

    </div>
  )
}