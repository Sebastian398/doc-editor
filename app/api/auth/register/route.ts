import { prisma } from '@/lib/db'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {

  const body = await req.json()

  const {
    name,
    email,
    password,
  } = body

  if (!name || !email || !password) {

    return Response.json(
      {
        error: 'Todos los campos son obligatorios'
      },
      {
        status: 400
      }
    )
  }

  const existingUser =
    await prisma.user.findUnique({
      where: {
        email,
      },
    })

  if (existingUser) {

    return Response.json(
      {
        error: 'El correo ya está registrado',
      },
      {
        status: 409,
      }
    )
  }

  const hashedPassword =
    await bcrypt.hash(password, 10)

  const user =
    await prisma.user.create({

      data: {

        name,

        email,

        password:
          hashedPassword,

        role: 'USER',
      },
    })

  return Response.json({
    ok: true,
    userId: user.id,
  })
}