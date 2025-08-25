"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CheckCircle, AlertCircle, FileText, Mail, Calendar, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Candidate {
  id: number
  name: string
  email: string
  cvUrl: string
  score: number
  strengths: string[]
  weaknesses: string[]
  evaluation: string
  roleTitle: string
  appliedAt: string
}

interface CandidateDetailModalProps {
  candidateId: number | null
  isOpen: boolean
  onClose: () => void
}

export function CandidateDetailModal({ candidateId, isOpen, onClose }: CandidateDetailModalProps) {
  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [loading, setLoading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    if (candidateId && isOpen) {
      fetchCandidateDetails()
    }
  }, [candidateId, isOpen])

  const fetchCandidateDetails = async () => {
    if (!candidateId) return

    setLoading(true)
    try {
      const response = await fetch(`/api/candidates/${candidateId}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })

      if (!response.ok) {
        throw new Error("Error al cargar detalles del candidato")
      }

      const data = await response.json()
      setCandidate(data.candidate)
    } catch (error) {
      console.error("Error fetching candidate details:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los detalles del candidato",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50"
    if (score >= 60) return "text-yellow-600 bg-yellow-50"
    return "text-red-600 bg-red-50"
  }

  const getScoreStars = (score: number) => {
    const stars = Math.round(score / 20)
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < stars ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Detalles del Candidato</DialogTitle>
        </DialogHeader>

        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : candidate ? (
          <div className="space-y-6">
            {/* Header */}
            <div className="flex items-start gap-4">
              <Avatar className="h-16 w-16">
                <AvatarFallback className="bg-primary/10 text-primary font-medium text-lg">
                  {candidate.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <h2 className="text-xl font-semibold text-foreground">{candidate.name}</h2>
                <p className="text-muted-foreground flex items-center gap-1 mt-1">
                  <Mail className="h-4 w-4" />
                  {candidate.email}
                </p>
                <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                  <Calendar className="h-4 w-4" />
                  Aplicó el {new Date(candidate.appliedAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  Puesto: <span className="font-medium">{candidate.roleTitle}</span>
                </p>
              </div>
            </div>

            {/* Score */}
            <div className="bg-muted/30 rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Puntuación de Compatibilidad</h3>
                <Badge className={`${getScoreColor(candidate.score)} border-0`}>{candidate.score}/100</Badge>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex">{getScoreStars(candidate.score)}</div>
                <span className="text-sm text-muted-foreground">
                  ({candidate.score >= 80 ? "Excelente" : candidate.score >= 60 ? "Bueno" : "Regular"} compatibilidad)
                </span>
              </div>
            </div>

            {/* Evaluation */}
            {candidate.evaluation && (
              <div>
                <h3 className="font-semibold mb-2">Evaluación General</h3>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{candidate.evaluation}</p>
                </div>
              </div>
            )}

            {/* Strengths and Weaknesses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                  <CheckCircle className="h-5 w-5" />
                  Fortalezas
                </h3>
                <div className="space-y-2">
                  {candidate.strengths.map((strength, index) => (
                    <div key={index} className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm text-green-800">{strength}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-orange-700 mb-3 flex items-center gap-2">
                  <AlertCircle className="h-5 w-5" />
                  Áreas de Mejora
                </h3>
                <div className="space-y-2">
                  {candidate.weaknesses.map((weakness, index) => (
                    <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <p className="text-sm text-orange-800">{weakness}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button asChild className="flex-1">
                <a href={candidate.cvUrl} target="_blank" rel="noopener noreferrer">
                  <FileText className="h-4 w-4 mr-2" />
                  Descargar CV
                </a>
              </Button>
              <Button variant="outline" className="flex-1 bg-transparent">
                <Mail className="h-4 w-4 mr-2" />
                Enviar Email
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">No se pudieron cargar los detalles del candidato</div>
        )}
      </DialogContent>
    </Dialog>
  )
}
