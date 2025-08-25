import { type NextRequest, NextResponse } from "next/server"

// Mock user database - in production, use a real database
const users = [
  {
    id: 1,
    email: "admin@recruitai.com",
    password: "admin123", // In production, use hashed passwords
    name: "Administrador",
    company: "RecruitAI",
  },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Find user
    const user = users.find((u) => u.email === email && u.password === password)

    if (!user) {
      return NextResponse.json({ message: "Credenciales inválidas" }, { status: 401 })
    }

    // In production, use JWT tokens with proper secret
    const token = btoa(
      JSON.stringify({
        id: user.id,
        email: user.email,
        name: user.name,
        company: user.company,
      }),
    )

    return NextResponse.json({
      message: "Login exitoso",
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        company: user.company,
      },
    })
  } catch (error) {
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}
