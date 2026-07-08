'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import dynamic from 'next/dynamic'
import { Download } from 'lucide-react'
import { Copy } from 'lucide-react'
import {FileText, Plus, ExternalLink, Pencil, Trash2,} from 'lucide-react'

type DocumentType = {
  id: string
  name: string
  fileUrl: string
  createdAt?: string
}

type RoomType = {
  id: string
  link: string
}

type MessageType = {
  type: 'success' | 'error'
  text: string
}

const MiniPDFViewer = dynamic(() => import('@/components/PDFViewer'), {
  ssr: false,
})

export default function Home() {
  const [docs, setDocs] = useState<DocumentType[]>([])
  const [rooms, setRooms] = useState<Record<string, RoomType[]>>({})
  const [roomsLoading, setRoomsLoading] = useState<Record<string, boolean>>({})
  const [roomsError, setRoomsError] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState<MessageType | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    percentage: 0,
  })
  useEffect(() => {
    fetch('/api/documents')
      .then((res) => res.json())
      .then((data) => {
        setDocs(data)
        setLoading(false)
      })
    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(data => setStats(data))
  }, [])

  // VER SALAS
  async function loadRooms(documentId: string) {
    setRoomsLoading(prev => ({ ...prev, [documentId]: true }))
    setRoomsError(prev => ({ ...prev, [documentId]: '' }))

    try {
      const res = await fetch(`/api/rooms/${documentId}`)

      if (!res.ok) {
        throw new Error('Error cargando salas')
      }

      const data = await res.json()

      setRooms(prev => ({
        ...prev,
        [documentId]: data,
      }))

    } catch (error) {
      setRoomsError(prev => ({
        ...prev,
        [documentId]: 'Error cargando salas ❌',
      }))
    } finally {
      setRoomsLoading(prev => ({ ...prev, [documentId]: false }))
    }
  }

  // ELIMINAR
  async function handleDelete(id: string) {
    const confirmDelete = confirm('¿Seguro que quieres eliminar este documento?')
    if (!confirmDelete) return

    try {
      const res = await fetch(`/api/documents/${id}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        setMessage({
          type: 'error',
          text: 'Error al eliminar documento ❌',
        })
        return
      }

      setDocs(prev => prev.filter(doc => doc.id !== id))

      setMessage({
        type: 'success',
        text: 'Documento eliminado correctamente',
      })

      setTimeout(() => setMessage(null), 3000)

    } catch {
      setMessage({
        type: 'error',
        text: 'Error de conexión ❌',
      })
    }
  }
  async function handleDeleteRoom(documentId: string, roomId: string) {
    const confirmDelete = confirm('¿Eliminar esta sala?')

    if (!confirmDelete) return

    try {
      const res = await fetch(`/api/room/${roomId}`, {
        method: 'DELETE',
      })

      if (!res.ok) {
        throw new Error()
      }

      // actualizar estado correctamente
      setRooms(prev => ({
        ...prev,
        [documentId]: prev[documentId].filter(r => r.id !== roomId),
      }))

      setMessage({
        type: 'success',
        text: 'Sala eliminada',
      })

      setTimeout(() => setMessage(null), 2000)

    } catch {
      setMessage({
        type: 'error',
        text: 'Error eliminando sala',
      })
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}
      <header className="bg-white border-b shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-800">Gestor de Documentos</h1>

        <Link
          href="/upload"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow"
        >
          <Plus size={18} />
          Subir documento
        </Link>
      </header>

      {/* STATS*/}
      <div className="max-w-6xl mx-auto px-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-gray-500 text-sm">
              Total documentos
            </p>

            <h2 className="text-3xl font-bold text-gray-800">
              {stats.total}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-gray-500 text-sm">
              Completados
            </p>

            <h2 className="text-3xl font-bold text-green-600">
              {stats.completed}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-gray-500 text-sm">
              Pendientes
            </p>

            <h2 className="text-3xl font-bold text-amber-500">
              {stats.pending}
            </h2>
          </div>

          <div className="bg-white rounded-xl shadow p-5">
            <p className="text-gray-500 text-sm">
              Completitud
            </p>

            <h2 className="text-3xl font-bold text-blue-600">
              {stats.percentage}%
            </h2>
          </div>

        </div>
      </div>

      {/* CONTENIDO */}
      <main className="p-6 max-w-6xl mx-auto">

        {/* MENSAJE */}
        {message && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm font-medium ${
              message.type === 'success'
                ? 'bg-green-100 text-green-700'
                : 'bg-red-100 text-red-700'
            }`}
          >
            {message.text}
          </div>
        )}

        {/* LOADING */}
        {loading && (
          <p className="text-gray-500">Cargando documentos...</p>
        )}

        {!loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

            {docs.map((doc) => (
              <div
                key={doc.id}
                className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <FileText size={20} className="text-gray-500" />
                    <h2 className="font-semibold text-gray-800 truncate">
                      {doc.name}
                    </h2>
                  </div>
                  
                <div className="w-full h-40 border rounded-lg overflow-hidden bg-gray-50">
                    <div className="scale-[0.35] origin-top-left pointer-events-none">
                      <MiniPDFViewer file={doc.fileUrl} preview/>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-2">

                  {/* EDITAR */}
                  <Link
                    href={`/editor/${doc.id}`}
                    className="flex items-center justify-center gap-2 bg-blue-100 text-blue-600 py-2 rounded"
                  >
                    <Pencil size={16} />
                    Editar
                  </Link>

                  {/* VER SALAS */}
                  <button
                    onClick={() => loadRooms(doc.id)}
                    className="flex items-center justify-center gap-2 bg-purple-100 text-purple-600 py-2 rounded hover:bg-purple-200 transition"
                  >
                    Ver salas
                  </button>

                  {/* ESTADO */}
                  {roomsLoading[doc.id] && (
                    <p className="text-xs text-gray-400 text-center">
                      Cargando salas...
                    </p>
                  )}

                  {roomsError[doc.id] && (
                    <p className="text-xs text-red-500 text-center">
                      {roomsError[doc.id]}
                    </p>
                  )}

                  {/* LISTA DE SALAS */}
                  {rooms[doc.id] && rooms[doc.id].length === 0 && !roomsLoading[doc.id] && (
                    <p className="text-xs text-gray-400 text-center">
                      No hay salas creadas
                    </p>
                  )}

                  {rooms[doc.id]?.map((room) => (
                  <div
                    key={room.id}
                    className="bg-gray-50 border rounded-lg p-3 flex flex-col gap-2"
                  >
                    {/* LINK */}
                    <p className="text-xs text-gray-500 break-all">
                      {`${window.location.origin}/room/${room.link}`}
                    </p>

                    {/* BOTONES */}
                    <div className="grid grid-cols-4 gap-2">

                      {/* ABRIR */}
                      <Link
                        href={`/room/${room.link}`}
                        className="flex items-center justify-center h-10 rounded bg-purple-100 text-purple-600 hover:bg-purple-200 transition"
                        title="Abrir sala"
                      >
                        <ExternalLink size={16} />
                      </Link>

                      {/* COPIAR */}
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(
                            `${window.location.origin}/room/${room.link}`
                          )

                          setMessage({
                            type: 'success',
                            text: 'Link copiado ✅',
                          })
                        }}
                        className="flex items-center justify-center h-10 rounded bg-blue-100 text-blue-600 hover:bg-blue-200 transition"
                        title="Copiar link"
                      >
                        <Copy size={16} />
                      </button>

                      {/* DESCARGAR */}
                      <button
                        onClick={async () => {
  
  try {
    console.log('INICIANDO DESCARGA')

    const res = await fetch(
      `/api/export-room/${room.id}`
    )

    console.log('STATUS:', res.status)

    if (!res.ok) {
      const error = await res.text()
      console.error(error)
      return
    }

    const blob = await res.blob()

    console.log('BLOB OK')

    const url = URL.createObjectURL(blob)

    const a = document.createElement('a')

    a.href = url
    a.download = `${doc.name}-firmado.pdf`

    a.click()

    URL.revokeObjectURL(url)
  } catch (error) {
    console.error(error)

    setMessage({
      type: 'error',
      text: 'Error descargando PDF ❌',
    })
  }
}}
                        className="flex items-center justify-center h-10 rounded bg-green-100 text-green-600 hover:bg-green-200 transition"
                        title="Descargar PDF"
                      >
                        <Download size={16} />
                      </button>

                      {/* ELIMINAR */}
                      <button
                        onClick={() => handleDeleteRoom(doc.id, room.id)}
                        className="flex items-center justify-center h-10 rounded bg-red-100 text-red-600 hover:bg-red-200 transition"
                        title="Eliminar sala"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
                  {/* ELIMINAR */}
                  <button
                    onClick={() => handleDelete(doc.id)}
                    className="flex items-center justify-center gap-2 bg-red-100 text-red-600 py-2 rounded hover:bg-red-200"
                  >
                    <Trash2 size={16} />
                    Eliminar
                  </button>

                </div>
              </div>
            ))}

          </div>
        )}

      </main>
    </div>
  )
}