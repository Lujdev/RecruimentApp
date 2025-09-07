"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { CheckCircle, AlertCircle, FileText, Mail, Calendar, Star } from "lucide-react"
import { useToast, toast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api"

interface Candidate {
  id: string
  name: string
  email: string
  phone: string | null
  cvFilePath: string
  status: string
  evaluation: {
    score: number
    strengths: string[]
    weaknesses: string[]
    summary: string
    evaluationDate: string
  } | null
}

interface CandidateDetailModalProps {
  candidateId: string | null
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
      const response = await apiClient.getCandidate(candidateId)
      setCandidate(response.data)
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

  const formatEvaluationDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleContactCandidate = (email: string, name: string) => {
    const subject = encodeURIComponent(`Oportunidad laboral - ${name}`)
    const body = encodeURIComponent(
      `Estimado/a ${name},\n\n` +
      `Esperamos que se encuentre bien. Nos complace informarle que hemos revisado su perfil y consideramos que podría ser un excelente candidato/a para una oportunidad en nuestra empresa.\n\n` +
      `Nos gustaría programar una entrevista para conocer más sobre su experiencia y discutir cómo puede contribuir a nuestro equipo.\n\n` +
      `Por favor, responda a este correo con su disponibilidad para los próximos días.\n\n` +
      `Saludos cordiales,\n` +
      `Equipo de Recursos Humanos`
    )
    
    window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank')
    
    toast({
      title: "Email preparado",
      description: `Se ha abierto su cliente de correo para contactar a ${name}`,
    })
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
                {candidate.evaluation && (
                  <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                    <Calendar className="h-4 w-4" />
                    Evaluado el {formatEvaluationDate(candidate.evaluation.evaluationDate)}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <p className="text-sm text-muted-foreground">
                    Estado: <Badge variant={candidate.status === 'pending' ? 'secondary' : 'default'}>
                      {candidate.status === 'pending' ? 'Pendiente' : candidate.status}
                    </Badge>
                  </p>
                </div>
              </div>
            </div>

            {/* Score */}
            {candidate.evaluation && (
              <div className="bg-muted/30 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold">Puntuación de Compatibilidad</h3>
                  <Badge className={`${getScoreColor(candidate.evaluation.score)} border-0`}>{candidate.evaluation.score}/100</Badge>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex">{getScoreStars(candidate.evaluation.score)}</div>
                  <span className="text-sm text-muted-foreground">
                    ({candidate.evaluation.score >= 80 ? "Excelente" : candidate.evaluation.score >= 60 ? "Bueno" : "Regular"} compatibilidad)
                  </span>
                </div>
              </div>
            )}

            {/* Evaluation */}
            {candidate.evaluation && candidate.evaluation.summary && (
              <div>
                <h3 className="font-semibold mb-2">Evaluación General</h3>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">{candidate.evaluation.summary}</p>
                </div>
              </div>
            )}

            {/* Strengths and Weaknesses */}
            {candidate.evaluation && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-green-700 mb-3 flex items-center gap-2">
                    <CheckCircle className="h-5 w-5" />
                    Fortalezas
                  </h3>
                  <div className="space-y-2">
                    {candidate.evaluation.strengths.map((strength, index) => (
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
                    {candidate.evaluation.weaknesses.map((weakness, index) => (
                      <div key={index} className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                        <p className="text-sm text-orange-800">{weakness}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t">
              <Button asChild className="flex-1">
                <a href={candidate.cvFilePath} target="_blank" rel="noopener noreferrer">
                  <FileText className="h-4 w-4 mr-2" />
                  Descargar CV
                </a>
              </Button>
              <Button 
                variant="outline" 
                className="flex-1 bg-transparent"
                onClick={() => handleContactCandidate(candidate.email, candidate.name)}
              >
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
