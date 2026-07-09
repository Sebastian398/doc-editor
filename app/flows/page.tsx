'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, Copy, Trash2,} from 'lucide-react'

type FlowType = {
  id: string
  name: string
  rooms: {    
    id: string    
    link: string  
  }[]
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

export default function FlowsPage() {
  const [flows, setFlows] = useState<FlowType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadFlows = async () => {
      try {
        const res = await fetch('/api/flows');

        if (!res.ok) {
          throw new Error('Error al obtener los flows');
        }

        const data: FlowType[] = await res.json();
        setFlows(data);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar los flows');
      } finally {
        setLoading(false);
      }
    };

    loadFlows();
  }, []);

  const filteredFlows = flows.filter(flow =>
    flow.name
      .toLowerCase()
      .includes(search.toLowerCase())
  )

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <p>Cargando flows...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto p-6">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

async function deleteFlow(id: string) {
  const confirmDelete = confirm(
    '¿Eliminar este Flow?'
  )

  if (!confirmDelete) return

  const res = await fetch(
    `/api/flows/${id}`,
    {
      method: 'DELETE',
    }
  )

  if (!res.ok) {
    alert('Error eliminando Flow')
    return
  }

  setFlows(prev =>
    prev.filter(flow => flow.id !== id)
  )
}

async function generateLink(
  flowId: string
) {
  const res = await fetch(
    `/api/flows/${flowId}/generate-link`,
    {
      method: 'POST',
    }
  )

  const data = await res.json()

  await navigator.clipboard.writeText(
    `${window.location.origin}/flow-room/${data.link}`
  )

  alert('Link copiado')
}

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="bg-white border-b shadow-sm px-6 py-4">
        <div className="max-w-6xl mx-auto flex gap-4 items-center">
          <Link href="/" className="text-gray-600 hover:text-black">
            <ArrowLeft size={18} />
          </Link>
          <h1 className="font-bold text-2xl whitespace-nowrap text-gray-800">
            Gestor de Flows
          </h1>
          <input
            type="text"
            placeholder="Buscar flow..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            className="
              flex-1
              bg-gray-50
              border
              rounded-lg
              px-4
              py-2
              text-black
              focus:outline-none
              focus:ring-2
              focus:ring-blue-500
            "
          />
          <Link href="/flows/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
            + Nuevo Flow
          </Link>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-6">
        {flows.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <p className="text-gray-500">Crea tu primer Flow agrupando varias salas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredFlows.map((flow) => (
              <div
                key={flow.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg p-4 transition border p-5"
              >
                <div className="flex items-center justify-between gap-3 mb-4">
                <h2 className="font-semibold text-lg text-gray-800 truncate flex-1">
                  {flow.name}
                </h2>
                <span className="shrink-0 px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                  {flow.items.length} sala
                  {flow.items.length !== 1 ? 's' : ''}
                </span>
              </div>
                <div className="space-y-2 mt-3 max-h-48 overflow-auto">
                  {flow.items.slice(0, 4).map((item) => (
                    <div
                      key={item.room.id}
                      className="bg-gray-50 border rounded-lg px-3 py-2"
                    >
                      <p className="text-sm font-medium text-gray-700">
                        {item.room.document.name}
                      </p>

                      <p className="text-xs text-gray-400">
                        Sala: {item.room.link.slice(0, 36)}
                      </p>
                    </div>
                  ))}
                  {/* BOTONES */}
                  <div className="grid grid-cols-4 gap-2">
                    {/* ABRIR */}
                    <Link href={`/flow*/${flow.id}`} 
                      className="flex items-center justify-center h-10 rounded bg-purple-100 text-purple-600 hover:bg-purple-200 transition">
                      <ExternalLink size={16} />
                    </Link>
                    {/* COPIAR */}
                    <button onClick={() => navigator.clipboard.writeText(`/flow*/${flow.id}`)}
                      className="flex items-center justify-center h-10 rounded bg-blue-100 text-blue-600 hover:bg-blue-200 transition">
                      <Copy size={16} />  
                    </button>
                    {/* ELIMINAR */}
                    <button onClick={() => deleteFlow(flow.id)}
                      className="flex items-center justify-center h-10 rounded bg-red-100 text-red-600 hover:bg-red-200 transition">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
                
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}