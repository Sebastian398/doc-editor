'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { FileText, ExternalLink, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type FlowRoomData = {
    flow: {
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

                responses: {
                    id: string  
                }[]

                document: {
                    name: string

                    fields: {
                    id:string
                    }[]
                }
            }
        }[]
    }
}

export default function FlowRoomPage() {
  const [data, setData] = useState<FlowRoomData | null>(null)
  const [error, setError] = useState('')
  const params = useParams()
  const link = params.link as string
  const { data: session } = useSession()
    useEffect(() => {

        async function loadFlow() {

            try {

            const res = await fetch(`/api/flow-room/${link}`)

            if (!res.ok) {
                throw new Error()
            }

            const data = await res.json()

            setData(data)

            } catch {

            setError('No fue posible cargar el Flow.')

            }

        }

        if (!link) return

        loadFlow()

    }, [link])

  
    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-xl shadow text-center">

                <h2 className="text-xl font-bold text-gray-800 mb-2">
                Error
                </h2>

                <p className="text-gray-500">
                {error}
                </p>

            </div>
            </div>
        )
    }  
  
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
    const totalRooms = data.flow.items.length
    const completedRooms = data.flow.items.filter(item => {
    const totalFields = item.room.document.fields.length
    const responses = item.room.responses.length

    return (
        totalFields > 0 &&
        responses >= totalFields
    )
    }).length

    const progress = totalRooms === 0 ? 0 : Math.round(
        (completedRooms / totalRooms) * 100
    )
    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-white border-b shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <div className="flex items-center gap-3">
                        {(session?.user?.role === 'ADMIN' || session?.user?.role === 'MANAGER') && (

                        <Link href="/flows" 
                        className="flex
                        items-center
                        justify-center
                        w-10
                        h-10
                        rounded-full
                        text-gray-600
                        hover:text-gray-900
                        transition"
                        >
                            <ArrowLeft size={20} />
                        </Link>

                        )}
                        <h1 className="text-xl font-bold text-gray-800">
                            {data.flow.name}
                        </h1>
                        <p className="mt-2 text-gray-600">
                            Completa todas las salas para finalizar el proceso.
                        </p>
                    </div>
                </div>
            </header><br></br>
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">

                    <span className="font-semibold text-gray-700">
                    Progreso general  
                    </span>

                    <div
                        className="
                            relative
                            w-full
                            h-5
                            bg-gray-200
                            rounded-full
                            overflow-hidden
                        "
                    >

                    <div
                        className="
                            h-5
                            bg-cyan-500
                            rounded-full
                            transition-all
                            duration-500
                        "
                        style={{width: `${progress}%`}}
                    />

                    <div
                        className="
                            absolute
                            inset-0
                            flex
                            items-center
                            justify-center
                            text-m
                            font-bold
                            text-white
                        "
                    >
                        {progress}%
                    </div>

                    </div>
                    <p className="text-sm text-gray-500 mt-3">
                        {completedRooms} de {totalRooms} salas completadas
                    </p>
                </div>    
            </div>
            <div className="max-w-6xl mx-auto px-6">
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    {data.flow.items.map((item) => {
                        const totalFields = item.room.document.fields.length
                        const responses = item.room.responses.length
                        let status = 'Sin iniciar'
                        let statusClass = 'bg-red-100 text-red-600'
                        if (responses > 0) {
                            status = 'Pendiente'
                            statusClass = 'bg-yellow-100 text-yellow-600'
                        }
                        if (totalFields > 0 && responses >= totalFields
                        ) {
                            status = 'Completada'
                            statusClass = 'bg-green-100 text-green-600'
                        }
                        return(
                            <div key={item.room.id}
                                className="border rounded-xl shadow-sm p-5 bg-white"
                            >
                                <div className="flex items-start gap-3">
                                    <FileText size={20} className= "text-blue-500"/>
                                    <div className="flex-1">
                                        <h2 className="font-semibold text-gray-800">
                                            {item.room.document.name}
                                        </h2>

                                        <p className="text-xs text-gray-500 mt-1">
                                            Sala:{' '}
                                            {item.room.link.slice(0,40)}
                                        </p>
                                        <span className={`inline-flex mt-3 px-3 py-1 rounded-full text-xs font-medium ${statusClass}`}>
                                            {status}
                                        </span>
                                        <Link href={`/room/${item.room.link}`} className="mt-4 w-full flex items-center justify-center gap-2 bg-blue-100 text-blue-700 py-2 rounded-lg hover:bg-blue-200 transition">
                                            <ExternalLink size={16} />
                                            Abrir documento
                                        </Link>
                                    </div>    
                                </div> 
                            </div>
                        )
                    })}
                </div>
            </div>    
        </div>
    )
}