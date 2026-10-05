'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Swal from 'sweetalert2'

type User = {
  id: string
  name: string
  email: string
}

export default function AddSignerPage() {
    const params = useParams()

    const documentId = params.documentId as string

    const [users, setUsers] = useState<User[]>([])

    const [userId, setUserId] = useState('')

    const [position, setPosition] = useState(1)

    const [loading, setLoading] = useState(true)

    const [saving, setSaving] = useState(false)

    useEffect(() => {

        async function loadUsers() {

            try {

            const res = await fetch('/api/users')

            if (!res.ok) {throw new Error()}

            const data = await res.json()

            setUsers(data)

            } catch {

            await Swal.fire({
                icon: 'error',
                iconColor: '#ef4444',
                title: 'Error',
                text: 'No fue posible cargar los usuarios.',
                confirmButtonColor: '#3b82f6',
            })

            } finally {

            setLoading(false)

            }

        }

        loadUsers()

    }, [])

    async function handleAdd() {

        try {

            if (!userId) {

            await Swal.fire({
                icon: 'warning',
                iconColor: '#f59e0b',
                title: 'Usuario requerido',
                text: 'Debe seleccionar un usuario.',
                confirmButtonColor: '#3b82f6',
            })

            return

            }

            if (position <= 0) {

            await Swal.fire({
                icon: 'warning',
                iconColor: '#f59e0b',
                title: 'Posición inválida',
                text: 'La posición debe ser mayor que cero.',
                confirmButtonColor: '#3b82f6',
            })

            return

            }

            setSaving(true)

            const response =
            await fetch(
                `/api/rooms/${documentId}/signers`,
                {
                method: 'POST',
                headers: {
                    'Content-Type':
                    'application/json',
                },
                body: JSON.stringify({
                    userId,
                    position,
                }),
                }
            )

            const data =
            await response.json()

            if (!response.ok) {

            await Swal.fire({
                icon: 'error',
                iconColor: '#ef4444',
                title: 'Error',
                text:
                data.error ||
                'Error al agregar firmante.',
                confirmButtonColor: '#3b82f6',
            })

            return

            }

            await Swal.fire({
            icon: 'success',
            iconColor: '#22c55e',
            title: 'Firmante agregado',
            text: 'El firmante fue agregado correctamente.',
            timer: 1500,
            showConfirmButton: false,
            })

            setUserId('')
            setPosition(1)

        } catch {

            await Swal.fire({
            icon: 'error',
            iconColor: '#ef4444',
            title: 'Error',
            text: 'Ocurrió un error inesperado.',
            confirmButtonColor: '#3b82f6',
            })

        } finally {

            setSaving(false)

        }

        }


  return (

    <div className="min-h-screen bg-gray-100 py-10">

        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow p-8">

        <h1 className="text-3xl font-bold mb-2 text-black">
            Agregar Firmante
        </h1>

        <p className="text-gray-500 mb-8">
            Seleccione el usuario y
            defina el orden visual de
            aparición.
        </p>

        <div className="mb-5">

            <label className="block font-medium mb-2 text-gray-700">
            Usuario
            </label>

            <select
            value={userId}
            onChange={(e) =>setUserId(e.target.value)}
            className="
                w-full
                border
                rounded-lg
                p-3
                text-gray-700
            "
            >

            <option value="">
                Seleccione usuario
            </option>

            {users.map(
                (user) => (

                <option
                    key={user.id}
                    value={user.id}
                >
                    {user.name}
                    {' - '}
                    {user.email}
                </option>

                )
            )}

            </select>

        </div>

        <div className="mb-8">

            <label
            className="
                block
                font-medium
                mb-2
                text-gray-700
            "
            >
            Posición
            </label>

            <input
            type="number"
            min={1}
            value={position}
            onChange={(e) =>
                setPosition(
                Number(
                    e.target.value
                )
                )
            }
            className="
                w-full
                border
                rounded-lg
                p-3
                text-gray-700
            "
            />

        </div>

        <div className="
            flex
            gap-3
        ">

            <button
            onClick={handleAdd}
            className="
                bg-blue-600
                hover:bg-blue-700
                text-white
                px-6
                py-3
                rounded-lg
            "
            >
            Guardar Firmante
            </button>

        </div>

        </div>

    </div>

    )
}