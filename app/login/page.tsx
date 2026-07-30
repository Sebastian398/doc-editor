'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import Swal from 'sweetalert2'

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
    if (!email.trim() || !password.trim()) {

      await Swal.fire({
        icon: 'warning',
        iconColor: '#f59e0b',
        title: 'Campos incompletos',
        text: 'Debes ingresar correo y contraseña.',
        confirmButtonColor: '#3b82f6',
      })

      return
    }

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

      await Swal.fire({
        icon: 'error',
        iconColor: '#ef4444',
        title: 'Acceso denegado',
        text: 'Correo o contraseña incorrectos.',
        confirmButtonColor: '#3b82f6',
      })

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
          disabled={loading}
          className="
            bg-blue-500
            text-white
            p-3
            rounded
            w-full
            transition
            disabled:bg-gray-400
            disabled:cursor-not-allowed
          "
        >
          {
            loading
            ? 'Ingresando...'
            : 'Ingresar'
          }
        </button>
        <div className="mt-6 text-center">

  <span className="text-sm text-gray-500">
    ¿No tienes cuenta?
  </span>

  <button
    type="button"
    onClick={() => router.push('/registro')}
    className="
      ml-1
      text-sm
      font-semibold
      text-blue-600
      hover:text-blue-700
      hover:underline
    "
  >
    Regístrate aquí
  </button>

</div>


      </form>

    </div>
  )
}