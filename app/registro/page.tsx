'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Swal from 'sweetalert2'

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
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/

    if (!passwordRegex.test(password)) {

      Swal.fire({
        icon: 'warning',
        iconColor: '#f59e0b',
        title: 'Contraseña inválida',
        text: 'Debe tener mínimo 6 caracteres, una mayúscula y un carácter especial.',
        confirmButtonColor: '#3b82f6',
      })

      return
    }

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

      await Swal.fire({
        icon: 'error',
        iconColor: '#ef4444',
        title: 'Error',
        text: data.error,
        confirmButtonColor: '#3b82f6',
      })

      return
    }

    await Swal.fire({
      icon: 'success',
      iconColor: '#22c55e',
      title: 'Usuario creado',
      text: 'La cuenta fue creada correctamente.',
      timer: 1800,
      showConfirmButton: false,
    })

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
            text-gray-600
          "
        />
        <p className="text-xs text-gray-500 mb-5">
          Mínimo 6 caracteres, una mayúscula y un carácter especial.
        </p>

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
