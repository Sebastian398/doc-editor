'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react'

type FlowType = {
  id: string;
  name: string;
  documents: {
    document: {
      name: string;
    };
  }[];
};

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

      {flows.length === 0 ? (
        <div className="bg-white p-4 rounded shadow">
          <p className="text-gray-500">No hay flows disponibles.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {flows.map((flow) => (
            <div
              key={flow.id}
              className="bg-white p-4 rounded shadow border"
            >
              <h2 className="font-semibold text-lg">{flow.name}</h2>

              <p className="text-sm text-gray-500">
                {flow.documents.length} documento
                {flow.documents.length !== 1 ? 's' : ''}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}