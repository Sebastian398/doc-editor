'use client'

import { useEffect, useRef } from 'react'
import { signOut } from 'next-auth/react'
import Swal from 'sweetalert2'

export default function SessionTimeout() {

  const timer = useRef<NodeJS.Timeout | null>(null)

  const resetTimer = () => {

    if (timer.current) {
      clearTimeout(timer.current)
    }

    timer.current = setTimeout(async () => {

      await Swal.fire({
        icon: 'warning',
        iconColor: '#f59e0b',
        title: 'Sesión expirada',
        text:
          'La sesión se cerró por inactividad.',
        confirmButtonColor: '#3b82f6',
      })

      signOut({
        callbackUrl: '/login',
      })

    }, 3 * 60 * 1000)

  }

  useEffect(() => {

    const events = [
      'mousemove',
      'mousedown',
      'keydown',
      'scroll',
      'touchstart',
    ]

    events.forEach(event =>
      window.addEventListener(
        event,
        resetTimer
      )
    )

    resetTimer()

    return () => {

      events.forEach(event =>
        window.removeEventListener(
          event,
          resetTimer
        )
      )

      if (timer.current) {
        clearTimeout(timer.current)
      }

    }

  }, [])

  return null
}