'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

import { signIn }
  from 'next-auth/react'

export default function LoginPage() {

  const router =
    useRouter()

  const [email, setEmail] =
    useState('')

  const [password,
    setPassword] =
    useState('')

  const [loading,
    setLoading] =
    useState(false)

  async function handleSubmit(
    e: React.FormEvent
  ) {

    e.preventDefault()

    setLoading(true)

    const result =
      await signIn(
        'credentials',
        {
          email,
          password,
          redirect: false,
        }
      )

    setLoading(false)

    if (result?.error) {

      alert(
        'Credenciales incorrectas'
      )

      return
    }

    router.push('/')
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
          Iniciar Sesión
        </h1>

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
          className="
            bg-blue-500
            text-white
            p-3
            rounded
            w-full
          "
        >
          {
            loading
            ? 'Ingresando...'
            : 'Ingresar'
          }
        </button>

      </form>

    </div>
  )
}