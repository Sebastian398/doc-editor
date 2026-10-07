'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { ArrowLeft } from 'lucide-react'
import Swal from 'sweetalert2'
import Link from 'next/link'

type RoomType = {
  id: string
  link: string
  documentName: string
  occupied: boolean
}

export default function NewFlowPage() {
  const router = useRouter()
  const {data: session, status,} = useSession()
  const [name, setName] = useState('')
  const [rooms, setRooms] = useState<RoomType[]>([])
  const [selectedRooms, setSelectedRooms] = useState<string[]>([])

  useEffect(() => {

    if (status === 'loading') {
      return
    }

    if (!session) {

      router.push(
        `/login?redirect=${encodeURIComponent(
          window.location.pathname
        )}`
      )

      return

    }

    if (
      session.user.role !== 'ADMIN' &&
      session.user.role !== 'MANAGER'
    ) {

      router.push('/unauthorized')

      return

    }

  }, [
    session,
    status,
    router,
  ])
  
  useEffect(() => {

    if (status !== 'authenticated') {
      return
    }

    if (
      session?.user.role !== 'ADMIN' &&
      session?.user.role !== 'MANAGER'
    ) {
      return
    }

    async function loadRooms() {

      try {

        const res =
          await fetch(
            '/api/rooms/all'
          )

        if (!res.ok) {

          throw new Error(
            'Error cargando salas'
          )

        }

        const data =
          await res.json()

        setRooms(data)

      } catch (error) {

        console.error(error)

      }

    }

    loadRooms()

  }, [
    session,
    status,
  ])

  async function createFlow() {
    if (!name.trim()) {

      await Swal.fire({
        icon: 'warning',
        iconColor: '#f59e0b',
        title: 'Nombre requerido',
        text: 'Ingresa un nombre para el Flow.',
        confirmButtonColor: '#3b82f6',
      })

      return
    }

    if (name.trim().length < 4) {

      await Swal.fire({
        icon: 'warning',
        iconColor: '#f59e0b',
        title: 'Nombre muy corto',
        text: 'El nombre debe tener al menos 4 caracteres.',
        confirmButtonColor: '#3b82f6',
      })

      return
    }

    if (selectedRooms.length === 0) {

      await Swal.fire({
        icon: 'warning',
        iconColor: '#f59e0b',
        title: 'Sin salas',
        text: 'Debes seleccionar al menos una sala.',
        confirmButtonColor: '#3b82f6',
      })

      return
    }
    const res = await fetch('/api/flows', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        roomIds: selectedRooms,
      }),
    })

    if (!res.ok) {

      const data = await res.json()
      await Swal.fire({
        icon: 'error',
        iconColor: '#ef4444',
        title: 'Error',
        text: data.error || 'No fue posible crear el Flow.',
        confirmButtonColor: '#3b82f6',
      })

      return
    }

    await Swal.fire({
      icon: 'success',
      iconColor: '#22c55e',
      title: 'Flow creado',
      text: 'El Flow fue creado correctamente.',
      timer: 1500,
      showConfirmButton: false,
    })
    router.push('/flows')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="bg-white border-b shadow-sm px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/flows/" className="text-gray-600 hover:text-black">
              <ArrowLeft size={35} />
            </Link>
            <h1 className="font-semibold text-gray-800">
              Nuevo Flow
            </h1>
          </div>

          {/* BOTÓN */}
          <button
            onClick={createFlow}
            className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition shadow"
          >
            Crear Flow
          </button>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-6">

        <div className="bg-white rounded-xl shadow-md border border-gray-100 p-8">

          {/* TÍTULO */}
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-gray-800">
              Nuevo Flow
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              Agrupa varias salas en un único proceso.
            </p>
          </div>

          {/* CONTADOR */}
          <div className="mb-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
              {selectedRooms.length} sala(s) seleccionada(s)
            </span>
            <p className="text-sm text-gray-500 mt-2">
              {
                rooms.filter(
                  room => !room.occupied
                ).length
              } salas disponibles
            </p>
          </div>

          {/* NOMBRE */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-600 mb-2">
              Nombre del Flow
            </label>

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Ej: Ingreso de colaborador"
              className="
                w-full
                border
                border-gray-300
                rounded-lg
                px-4
                py-3
                text-black
                bg-white
                focus:outline-none
                focus:ring-2
                focus:ring-blue-500
                focus:border-blue-500
              "
            />
          </div>

          {/* DOCUMENTOS */}
          <div>
            <h2 className="text-sm font-medium text-gray-600 mb-4">
              Selecciona las salas
            </h2>

            <div className="grid gap-3 max-h-[420px] overflow-y-auto pr-2">
              {rooms.length === 0 && (

                <div
                  className="
                    bg-gray-50
                    border
                    rounded-xl
                    p-10
                    text-center
                  "
                >

                  <h3 className="text-lg font-semibold text-gray-800">
                    No hay salas disponibles
                  </h3>

                  <p className="text-gray-500 mt-2">
                    Debes crear al menos una sala antes de crear un Flow.
                  </p>

                </div>

              )}
              {rooms.map(room => (
                <label
                  key={room.id}
                  className={`
                    flex
                    items-center
                    gap-3
                    p-4
                    border
                    rounded-xl
                    cursor-pointer
                    transition
                    hover:bg-gray-50
                    hover:border-blue-300
                    ${
                      room.occupied      
                      ? 'opacity-60 cursor-not-allowed bg-gray-50 border-gray-200'      
                      : 'cursor-pointer hover:bg-gray-50 hover:border-blue-300'
                    }
                    ${
                      selectedRooms.includes(room.id)
                        ? 'border-blue-400 bg-blue-50'
                        : 'border-gray-200 bg-white'
                    }
                  `}
                >
                  <input
                    type="checkbox"
                    disabled={room.occupied}
                    checked={selectedRooms.includes(room.id)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedRooms(prev => [
                          ...prev,
                          room.id,
                        ])
                      } else {
                        setSelectedRooms(prev =>
                          prev.filter(
                            id => id !== room.id
                          )
                        )
                      }
                    }}
                    className="w-4 h-4 accent-blue-600"
                  />

                  <div className="flex flex-col flex-1">
                    <span className="text-gray-700 font-medium">
                      {room.documentName}
                    </span>

                    <span className="text-xs text-gray-400">
                      Sala: {room.link.slice(0, 10)}...
                    </span>
                  </div>

                  {room.occupied ? (
                    <span
                      className="
                        px-2
                        py-1
                        rounded-full
                        bg-red-100
                        text-red-600
                        text-xs
                        font-medium
                      "
                    >
                      Ocupada
                    </span>
                  ) : (
                    <span
                      className="
                        px-2
                        py-1
                        rounded-full
                        bg-green-100
                        text-green-600
                        text-xs
                        font-medium
                      "
                    >
                      Libre
                    </span>
                  )}
                </label>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}