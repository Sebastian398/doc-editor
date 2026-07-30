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
  
  if (name.trim().length < 3) {
    return Response.json(
      {
        error:
          'El nombre debe tener mínimo 3 caracteres'
      },
      {
        status: 400
      }
    )
  }

  if (name.length > 100) {
    return Response.json(
      {
        error:
          'Nombre demasiado largo'
      },
      {
        status: 400
      }
    )
  }

  const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/

  if (!nameRegex.test(name.trim())) {
    return Response.json(
      {
        error:
          'El nombre solo puede contener letras'
      },
      {
        status: 400
      }
    )
  }
    
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

  if (!emailRegex.test(email)) {

    return Response.json(
      {
        error: 'Correo electrónico inválido'
      },
      {
        status: 400
      }
    )
  }
    
  const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>]).{6,}$/

  if (!passwordRegex.test(password)) {

    return Response.json(
      {
        error:
          'La contraseña debe tener mínimo 6 caracteres, una mayúscula y un carácter especial'
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

  const normalizedEmail = email.trim().toLowerCase()

  const hashedPassword = await bcrypt.hash(password, 10)

  const user =
    await prisma.user.create({

      data: {

        name: name.trim(),

        email: normalizedEmail,

        password: hashedPassword,

        role: 'USER',
      },
    })

  return Response.json({
    ok: true,
    userId: user.id,
  })
}