'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { FileText } from 'lucide-react'

type FlowRoomData = {
  flow: {
    id: string
    name: string

    items: {
      room: {
        id: string
        link: string

        document: {
          name: string
        }
      }
    }[]
  }
}

export default function FlowRoomPage() {
  const [data, setData] = useState<FlowRoomData | null>(null)
  const params = useParams()
  const link = params.link as string
  useEffect(() => {
    if (!link) return

    fetch(`/api/flow-room/${link}`)
        .then(res => res.json())
        .then(setData)
  }, [link])

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 flex-col">
        <p className="text-gray-600 mb-3 font-medium">
          Cargando documento
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

  return (
    <div className="min-h-screen bg-gray-100">

      <div className="max-w-5xl mx-auto p-6  py-4">

        <div className="bg-white rounded-xl shadow p-6">

          <h1 className="text-2xl font-bold mb-2">
            {data.flow.name}
          </h1>

          <p className="text-gray-500 mb-6">
            Salas asociadas
          </p>

          <div className="space-y-4">

            {data.flow.items.map(
              (item) => (
                <div
                  key={item.room.id}
                  className="
                    border
                    rounded-lg
                    p-4
                    bg-gray-50
                  "
                >
                  <h2 className="font-medium">
                    {
                      item.room.document.name
                    }
                  </h2>

                  <p className="text-xs text-gray-500 mt-1">
                    Sala:
                    {' '}
                    {item.room.link}
                  </p>
                </div>
              )
            )}

          </div>

        </div>

      </div>

    </div>
  )
}