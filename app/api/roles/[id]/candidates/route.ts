import { type NextRequest, NextResponse } from "next/server"

// Mock candidates database
const candidates = [
  {
    id: 1,
    roleId: 1,
    name: "María García",
    email: "maria.garcia@email.com",
    cvUrl: "/cv/maria-garcia.pdf",
    score: 8.5,
    strengths: ["Experiencia sólida en React", "Conocimiento avanzado de TypeScript"],
    weaknesses: ["Poca experiencia con testing", "Sin experiencia en Next.js"],
    evaluation: "Candidata muy prometedora con excelente base técnica",
    appliedAt: "2024-01-20",
  },
]

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Token requerido" }, { status: 401 })
    }

    const roleId = Number.parseInt(params.id)
    const roleCandidates = candidates.filter((candidate) => candidate.roleId === roleId)

    return NextResponse.json({ candidates: roleCandidates })
  } catch (error) {
    return NextResponse.json({ message: "Error interno del servidor" }, { status: 500 })
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Token requerido" }, { status: 401 })
    }

    const roleId = Number.parseInt(params.id)
    const formData = await request.formData()

    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const cvFile = formData.get("cv") as File

    if (!name || !email || !cvFile) {
      return NextResponse.json({ message: "Todos los campos son requeridos" }, { status: 400 })
    }

    // Simulate PDF processing and AI evaluation
    const cvText = await extractTextFromPDF(cvFile)
    const evaluation = await evaluateCandidate(cvText, roleId)

    const newCandidate = {
      id: candidates.length + 1,
      roleId,
      name,
      email,
      cvUrl: `/cv/${cvFile.name}`,
      score: evaluation.score,
      strengths: evaluation.strengths,
      weaknesses: evaluation.weaknesses,
      evaluation: evaluation.summary,
      appliedAt: new Date().toISOString().split("T")[0],
    }

    candidates.push(newCandidate)

    return NextResponse.json({
      message: "CV procesado exitosamente",
      candidate: newCandidate,
    })
  } catch (error) {
    return NextResponse.json({ message: "Error procesando el CV" }, { status: 500 })
  }
}

// Mock function to extract text from PDF
async function extractTextFromPDF(file: File): Promise<string> {
  // In production, use a library like pdf-parse or pdf2pic
  return `
    Experiencia profesional:
    - 4 años como Desarrollador Frontend
    - Especializado en React y TypeScript
    - Experiencia con Next.js y Tailwind CSS
    - Conocimiento de testing con Jest
    
    Educación:
    - Ingeniería en Sistemas
    - Certificaciones en desarrollo web moderno
    
    Habilidades técnicas:
    - JavaScript, TypeScript, React, Next.js
    - HTML5, CSS3, Tailwind CSS
    - Git, GitHub, metodologías ágiles
  `
}

// Mock function to evaluate candidate with AI
async function evaluateCandidate(cvText: string, roleId: number) {
  // In production, integrate with OpenAI or similar LLM
  await new Promise((resolve) => setTimeout(resolve, 2000)) // Simulate processing time

  return {
    score: Math.random() * 3 + 7, // Random score between 7-10
    strengths: ["Experiencia sólida en tecnologías requeridas", "Conocimiento actualizado del stack moderno"],
    weaknesses: [
      "Podría beneficiarse de más experiencia en testing",
      "Sin experiencia específica en el dominio del negocio",
    ],
    summary: "Candidato con buen perfil técnico y potencial de crecimiento",
  }
}
