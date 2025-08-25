import { type NextRequest, NextResponse } from "next/server"

// Mock user database - in production, use a real database
const users = [
  {
    id: 1,
    email: "admin@recruitai.com",
    password: "admin123",
    name: "Administrador",
    company: "RecruitAI",
  },
]

export async function POST(request: NextRequest) {
  try {
    const { name, email, password, company } = await request.json()

    // Check if user already exists
    const existingUser = users.find((u) => u.email === email)
    if (existingUser) {
      return NextResponse.json({ message: "El usuario ya existe" }, { status: 400 })
    }

    // Create new user
    const newUser = {
      id: users.length + 1,
      email,
      password, // In production, hash the password
      name,
      company,
    }

    users.push(newUser)

    return NextResponse.json({
      message: "Usuario creado exitosamente",
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
        company: newUser.company,
      },
    })
  } catch (error) {
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}
