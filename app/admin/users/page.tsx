'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Users } from 'lucide-react'
import Link from 'next/link'
import Swal from 'sweetalert2'

type User = {
  id: string
  name: string
  email: string
  role: string
}

export default function AdminUsersPage() {
    
    const { data: session, status } = useSession()

    const router = useRouter() 

    const [users, setUsers] = useState<User[]>([])

    const [loading, setLoading] = useState(true)

    async function loadUsers() {

        const res = await fetch('/api/users')

        const data = await res.json()

        setUsers(data)

        setLoading(false)
    }

  useEffect(() => {

    async function initialize() {

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

      if (session.user.role !== 'ADMIN') {

        router.push('/')

        return

      }

      await loadUsers()

    }

    initialize()

}, [session, status, router,])

  async function updateRole(
    id: string,
    role: string
  ) {

    const result = await Swal.fire({
      title:
        role === 'MANAGER'
          ? '¿Convertir en Manager?'
          : '¿Convertir en Usuario?',
      text:
        role === 'MANAGER'
          ? 'Este usuario obtendrá permisos ampliados.'
          : 'Este usuario perderá permisos de Manager.',
      icon: 'question',
      iconColor: '#3b82f6',
      showCancelButton: true,
      confirmButtonText: 'Confirmar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3b82f6',
      cancelButtonColor: '#64748b',
    })

    if (!result.isConfirmed) return

    try {

      const res = await fetch(
        `/api/users/${id}/role`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            role,
          }),
        }
      )

      if (!res.ok) {
        throw new Error()
      }

      await loadUsers()

      await Swal.fire({
        icon: 'success',
        iconColor: '#22c55e',
        title: 'Rol actualizado',
        text: 'El usuario fue actualizado correctamente.',
        timer: 1500,
        showConfirmButton: false,
      })

    } catch {

      await Swal.fire({
        icon: 'error',
        iconColor: '#ef4444',
        title: 'Error',
        text: 'No fue posible actualizar el usuario.',
        confirmButtonColor: '#3b82f6',
      })

    }
  }

  async function deleteUser(
    id: string,
    name: string
  ) {

    const result = await Swal.fire({
      title: '¿Eliminar usuario?',
      text: `Se eliminará el usuario ${name}.`,
      icon: 'warning',
      iconColor: '#ef4444',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
    })

    if (!result.isConfirmed) return

    try {

      const res = await fetch(
        `/api/users/${id}/role`,
        {
          method: 'DELETE',
        }
      )

      const data = await res.json()

      if (!res.ok) {
        throw new Error(
          data.error || 'Error eliminando usuario'
        )
      }

      await loadUsers()

      await Swal.fire({
        icon: 'success',
        iconColor: '#22c55e',
        title: 'Usuario eliminado',
        text: 'El usuario fue eliminado correctamente.',
        timer: 1500,
        showConfirmButton: false,
      })

    } catch (error) {

      await Swal.fire({
        icon: 'error',
        iconColor: '#ef4444',
        title: 'Error',
        text:
          error instanceof Error
            ? error.message
            : 'No fue posible eliminar el usuario.',
      })

    }

  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 flex-col">
        <p className="text-gray-600 mb-3 font-medium">
          Cargando
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

    <div className="min-h-screen bg-gray-100 p-8">

      <div className="max-w-6xl mx-auto">

        <div className="flex items-start gap-4 mb-8">
          <Link href="/" 
            className="flex
              items-center
              justify-center
              w-10
              h-10
              rounded-lg
              mt-1
              text-gray-600
              hover:text-black
            ">
            <ArrowLeft size={35} />
          </Link>
          <h1 className="text-4xl font-bold text-black">
            Administración de Usuarios
          </h1>
        
        </div>
        
          <p className="text-gray-500 mt-4">
            Gestiona roles y acceso dentro de la plataforma.
          </p><br></br>
        
        <div className="bg-white rounded-2xl shadow-sm p-6 mb-8">
          <div className="text-3xl font-bold text-blue-600">
            {users.length}
          </div>
          <div className="text-gray-500">
            Usuarios registrados
          </div>
        </div>

        {users.length === 0 && (

          <div
            className="
              bg-white
              rounded-2xl
              shadow-sm
              p-12
              text-center
            "
          >

            <div className="text-6xl mb-4">
              <Users size={64} />
            </div>

            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              No hay usuarios registrados
            </h2>

            <p className="text-gray-500">
              Todavía no existen usuarios en la plataforma.
            </p>

          </div>

        )}
        <div className="grid gap-4">

          {users.map((user) => (

            <div
              key={user.id}
              className="
                bg-white
                rounded-xl
                shadow-sm
                border
                p-6
                flex
                justify-between
                items-center
              "
            >

              <div>

                <h2 className="font-semibold text-lg text-black">
                  {user.name}
                </h2>

                <p className="text-gray-500">
                  {user.email}
                </p>

                <span
                  className={`
                    inline-block
                    mt-3
                    px-3
                    py-1
                    rounded-full
                    text-sm
                    font-medium

                    ${
                      user.role === 'ADMIN'
                        ? 'bg-purple-100 text-purple-700'
                        : user.role === 'MANAGER'
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }
                  `}
                >
                  {user.role}
                </span>

              </div>

              <div
                className="
                  flex
                  flex-col
                  items-end
                  gap-3
                "
              >

                {user.role === 'USER' && (

                  <button
                    onClick={() =>
                      updateRole(
                        user.id,
                        'MANAGER'
                      )
                    }
                    className="
                      bg-green-500
                      hover:bg-green-400
                      text-white
                      px-4
                      py-2
                      rounded-lg
                    "
                  >
                    Hacer Manager
                  </button>

                )}

                {user.role === 'MANAGER' && (

                  <button
                    onClick={() =>
                      updateRole(user.id, 'USER')
                    }
                    className="
                      bg-orange-500
                      hover:bg-orange-400
                      text-white
                      px-4
                      py-2
                      rounded-lg
                    "
                  >
                    Hacer User
                  </button>

                )}

                {user.role !== 'ADMIN' && (

                  <button
                    onClick={() =>
                      deleteUser(
                        user.id,
                        user.name
                      )
                    }
                    className="
                      bg-red-500
                      hover:bg-red-400
                      text-white
                      px-4
                      py-2
                      rounded-lg
                      flex
                      items-center
                      justify-center
                      gap-2
                    "
                  >
                    Eliminar
                  </button>

                )}

              </div>

            </div>

          ))}

        </div>

      </div>

    </div>

  )
}