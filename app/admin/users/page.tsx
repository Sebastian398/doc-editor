'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

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
    loadUsers()
  }, [])

  async function updateRole(
    id: string,
    role: string
  ) {

    await fetch(
      `/api/users/${id}/role`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type':
            'application/json',
        },
        body: JSON.stringify({
          role,
        }),
      }
    )

    loadUsers()
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

    <div className="
      min-h-screen
      bg-gray-100
      p-8
    ">

      <div className="
        max-w-6xl
        mx-auto
      ">

        <div className="
          mb-8
        ">

          <h1 className="
            text-4xl
            font-bold
            text-black
          ">
            Administración de Usuarios
          </h1>

          <p className="
            text-gray-500
            mt-2
          ">
            Gestiona roles y acceso
            dentro de la plataforma.
          </p>

        </div>

        <div className="
          bg-white
          rounded-2xl
          shadow-sm
          p-6
          mb-8
        ">

          <div className="
            text-3xl
            font-bold
            text-blue-600
          ">
            {users.length}
          </div>

          <div className="
            text-gray-500
          ">
            Usuarios registrados
          </div>

        </div>

        <div className="
          grid
          gap-4
        ">

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

                <h2 className="
                  font-semibold
                  text-lg
                  text-black
                ">
                  {user.name}
                </h2>

                <p className="
                  text-gray-500
                ">
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
                        : 'bg-gray-100 text-gray-700'
                    }
                  `}
                >
                  {user.role}
                </span>

              </div>

              <div>

                {user.role === 'USER' && (

                  <button
                    onClick={() =>
                      updateRole(
                        user.id,
                        'MANAGER'
                      )
                    }
                    className="
                      bg-green-600
                      hover:bg-green-700
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
                      updateRole(
                        user.id,
                        'USER'
                      )
                    }
                    className="
                      bg-orange-500
                      hover:bg-orange-600
                      text-white
                      px-4
                      py-2
                      rounded-lg
                    "
                  >
                    Hacer User
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