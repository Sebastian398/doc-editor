'use client'

import { SessionProvider } from 'next-auth/react'
import SessionTimeout from '@/components/sessiontimeout'

export default function AuthProvider({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider refetchInterval={15}>
      <SessionTimeout />
      {children}
    </SessionProvider>
  )
}