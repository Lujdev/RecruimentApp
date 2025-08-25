import { type NextRequest, NextResponse } from "next/server"

// Mock roles database
const roles = [
  {
    id: 1,
    title: "Desarrollador Frontend Senior",
    description: "Buscamos un desarrollador frontend con experiencia en React y TypeScript",
    requirements: "3+ años de experiencia, React, TypeScript, Next.js",
    candidatesCount: 12,
    createdAt: "2024-01-15",
    status: "active",
    userId: 1,
  },
  {
    id: 2,
    title: "Diseñador UX/UI",
    description: "Diseñador creativo para mejorar la experiencia de usuario",
    requirements: "Portfolio sólido, Figma, experiencia en investigación UX",
    candidatesCount: 8,
    createdAt: "2024-01-10",
    status: "active",
    userId: 1,
  },
]

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Token requerido" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const user = JSON.parse(atob(token))

    const userRoles = roles.filter((role) => role.userId === user.id)

    return NextResponse.json({ roles: userRoles })
  } catch (error) {
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Token requerido" }, { status: 401 })
    }

    const token = authHeader.split(" ")[1]
    const user = JSON.parse(atob(token))

    const { title, description, requirements } = await request.json()

    const newRole = {
      id: roles.length + 1,
      title,
      description,
      requirements,
      candidatesCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
      status: "active" as const,
      userId: user.id,
    }

    roles.push(newRole)

    return NextResponse.json({
      message: "Rol creado exitosamente",
      role: newRole,
    })
  } catch (error) {
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}
