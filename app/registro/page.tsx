'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {

  const router =
    useRouter()

  const [name, setName] =
    useState('')

  const [email, setEmail] =
    useState('')

  const [password, setPassword] =
    useState('')

  const [loading, setLoading] =
    useState(false)

  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault()

    setLoading(true)

    const res =
      await fetch(
        '/api/auth/register',
        {
          method: 'POST',
          headers: {
            'Content-Type':
              'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      )

    const data =
      await res.json()

    setLoading(false)

    if (!res.ok) {

      alert(
        data.error
      )

      return
    }

    alert(
      'Usuario creado correctamente'
    )

    router.push('/login')
  }

  return (

    <div className="
      min-h-screen
      flex
      items-center
      justify-center
      bg-gray-100
    ">

      <form
        onSubmit={handleSubmit}
        className="
          bg-white
          p-8
          rounded-xl
          shadow
          w-full
          max-w-md
        "
      >

        <h1 className="
          text-2xl
          font-bold
          mb-6
          text-black
        ">
          Crear Cuenta
        </h1>

        <input
          type="text"
          placeholder="Nombre"
          value={name}
          onChange={(e) =>
            setName(
              e.target.value
            )
          }
          className="
            border
            w-full
            p-3
            rounded
            mb-4
            text-gray-600
          "
        />

        <input
          type="email"
          placeholder="Correo"
          value={email}
          onChange={(e) =>
            setEmail(
              e.target.value
            )
          }
          className="
            border
            w-full
            p-3
            rounded
            mb-4
            text-gray-600
          "
        />

        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) =>
            setPassword(
              e.target.value
            )
          }
          className="
            border
            w-full
            p-3
            rounded
            mb-6
            text-gray-600
          "
        />

        <button
          type="submit"
          disabled={loading}
          className="
            bg-blue-500
            text-white
            w-full
            p-3
            rounded
          "
        >
          {
            loading
              ? 'Creando...'
              : 'Crear Cuenta'
          }
        </button>

      </form>

    </div>
  )
}
