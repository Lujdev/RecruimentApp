"use client"

import { useState, useEffect } from "react"
import { CandidateComparison } from "@/components/candidates/candidate-comparison"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Plus, Users } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Candidate {
  id: number
  name: string
  email: string
  score: number
  strengths: string[]
  weaknesses: string[]
  evaluation: string
  roleTitle: string
}

export default function ComparisonPage() {
  const [selectedCandidates, setSelectedCandidates] = useState<Candidate[]>([])
  const [availableCandidates, setAvailableCandidates] = useState<Candidate[]>([])
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchCandidates()
  }, [])

  const fetchCandidates = async () => {
    try {
      // Mock data - API pendiente de implementar (ver BACKEND_PENDIENTES.md)
      const mockCandidates: Candidate[] = [
        {
          id: 1,
          name: "Ana García",
          email: "ana@email.com",
          score: 94,
          strengths: ["Excelente experiencia en React", "Liderazgo demostrado"],
          weaknesses: ["Poca experiencia en testing", "Necesita mejorar en backend"],
          evaluation: "Candidata excepcional con sólida experiencia técnica",
          roleTitle: "Frontend Developer",
        },
        {
          id: 2,
          name: "Carlos López",
          email: "carlos@email.com",
          score: 91,
          strengths: ["Arquitectura de sistemas", "Experiencia en microservicios"],
          weaknesses: ["Comunicación técnica", "Documentación de código"],
          evaluation: "Excelente perfil técnico para roles senior",
          roleTitle: "Backend Developer",
        },
        {
          id: 3,
          name: "María Rodríguez",
          email: "maria@email.com",
          score: 88,
          strengths: ["Diseño centrado en usuario", "Prototipado rápido"],
          weaknesses: ["Herramientas de desarrollo", "Conocimiento técnico limitado"],
          evaluation: "Gran capacidad de diseño y experiencia de usuario",
          roleTitle: "UX Designer",
        },
        {
          id: 4,
          name: "Juan Martínez",
          email: "juan@email.com",
          score: 85,
          strengths: ["Machine Learning", "Análisis estadístico avanzado"],
          weaknesses: ["Experiencia en producción", "Habilidades de presentación"],
          evaluation: "Sólido conocimiento en ciencia de datos",
          roleTitle: "Data Scientist",
        },
      ]

      setTimeout(() => {
        setAvailableCandidates(mockCandidates)
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error fetching candidates:", error)
      setLoading(false)
    }
  }

  const addCandidateToComparison = (candidate: Candidate) => {
    if (selectedCandidates.length >= 4) {
      toast({
        title: "Límite alcanzado",
        description: "Solo puedes comparar hasta 4 candidatos a la vez",
        variant: "destructive",
      })
      return
    }

    if (selectedCandidates.find((c) => c.id === candidate.id)) {
      toast({
        title: "Candidato ya seleccionado",
        description: "Este candidato ya está en la comparación",
        variant: "destructive",
      })
      return
    }

    setSelectedCandidates((prev) => [...prev, candidate])
    toast({
      title: "Candidato añadido",
      description: `${candidate.name} ha sido añadido a la comparación`,
    })
  }

  const removeCandidateFromComparison = (candidateId: number) => {
    setSelectedCandidates((prev) => prev.filter((c) => c.id !== candidateId))
    toast({
      title: "Candidato removido",
      description: "El candidato ha sido removido de la comparación",
    })
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200"
    if (score >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200"
    return "text-red-600 bg-red-50 border-red-200"
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-muted rounded w-1/3 mb-2"></div>
          <div className="h-4 bg-muted rounded w-1/2"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Comparación de Candidatos</h1>
        <p className="text-muted-foreground">Selecciona candidatos para compararlos lado a lado</p>
      </div>

      {/* Available Candidates */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Candidatos Disponibles
          </CardTitle>
          <CardDescription>Haz clic en "Añadir" para incluir candidatos en la comparación (máximo 4)</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {availableCandidates.map((candidate) => (
              <div key={candidate.id} className="flex items-center justify-between p-4 border rounded-lg bg-card">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {candidate.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium">{candidate.name}</h3>
                    <p className="text-sm text-muted-foreground">{candidate.roleTitle}</p>
                    <Badge className={`${getScoreColor(candidate.score)} border text-xs mt-1`}>
                      {candidate.score}/100
                    </Badge>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => addCandidateToComparison(candidate)}
                  disabled={selectedCandidates.find((c) => c.id === candidate.id) !== undefined}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  {selectedCandidates.find((c) => c.id === candidate.id) ? "Añadido" : "Añadir"}
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Comparison Section */}
      <CandidateComparison candidates={selectedCandidates} onRemoveCandidate={removeCandidateFromComparison} />
    </div>
  )
}
