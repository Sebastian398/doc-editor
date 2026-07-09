'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react'

type FlowType = {
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

export default function FlowsPage() {
  const [flows, setFlows] = useState<FlowType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  return (
    <div className="min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="bg-white border-b shadow-sm px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-gray-600 hover:text-black">
              <ArrowLeft size={18} />
            </Link>
            <h1 className="font-semibold text-gray-800">
              Flows
            </h1>
          </div>

          {/* BOTÓN */}
          <Link href="/flows/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">
              Nuevo Flow
          </Link>
        </div>
      </header>
      <main className="max-w-6xl mx-auto p-6">
        <div className="mb-6 flex gap-3">
          <div className="bg-white shadow rounded-xl px-4 py-3">
            <p className="text-sm text-gray-500">
              Total Flows
            </p>

            <p className="text-2xl font-bold text-gray-800">
              {flows.length}
            </p>
          </div>
        </div>
        {flows.length === 0 ? (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <p className="text-gray-500">Crea tu primer Flow agrupando varias salas.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {flows.map((flow) => (
              <div
                key={flow.id}
                className="bg-white rounded-xl shadow-md hover:shadow-lg p-4 transition border p-5"
              >
                <h2 className="font-semibold text-lg text-gray-800 mb-3 truncate">{flow.name}</h2>
                <div className="mb-4">
                  <span className=" px-2 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                    {flow.items.length} sala
                    {flow.items.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="space-y-2 mt-3">
                  {flow.items.slice(0, 4).map((item) => (
                    <div
                      key={item.room.id}
                      className="
                        bg-gray-50
                        border
                        rounded-lg
                        px-3
                        py-2
                      "
                    >
                      <p className="text-sm font-medium text-gray-700">
                        {item.room.document.name}
                      </p>

                      <p className="text-xs text-gray-400">
                        Sala: {item.room.link.slice(0, 36)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}