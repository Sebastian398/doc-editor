import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

import { AuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'

export const authOptions: AuthOptions = {

  session: {
    strategy: 'jwt',
    maxAge: 60 * 60 * 2,
  },

  providers: [

    CredentialsProvider({

      name: 'credentials',

      credentials: {

        email: {
          label: 'Email',
          type: 'email',
        },

        password: {
          label: 'Password',
          type: 'password',
        },

      },

      async authorize(credentials) {

        if (
          !credentials?.email ||
          !credentials?.password
        ) {
          return null
        }

        const user =
          await prisma.user.findUnique({
            where: {
              email:
                credentials.email,
            },
          })

        if (!user) {
          return null
        }

        const passwordMatch =
          await bcrypt.compare(
            credentials.password,
            user.password
          )

        if (!passwordMatch) {
          return null
        }

        return {

          id: user.id,

          name: user.name,

          email: user.email,

          role: user.role,
        }
      },
    }),
  ],

  callbacks: {
    async jwt({
      token,
      user,
    }) {

      if (user) {

        token.id =
          user.id

        token.role =
          user.role
      }

      return token
    },

    async session({
      session,
      token,
    }) {

      session.user.id =
        token.id

      session.user.role =
        token.role

      return session
    },
  }
}