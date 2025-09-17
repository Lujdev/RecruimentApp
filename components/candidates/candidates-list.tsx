"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Eye, Download, Mail, Star, Users, Trash2 } from "lucide-react"
import { CandidateDetailModal } from "./candidate-detail-modal"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api"
import { useAppContext } from "@/contexts/AppContext"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface Candidate {
  id: string
  name: string
  email: string
  cvUrl: string
  score: number
  strengths: string[]
  weaknesses: string[]
  evaluation: string
  appliedAt: string
  evaluation_date: string
  status: string
}

interface CandidatesListProps {
  roleId: string
}

export function CandidatesList({ roleId }: CandidatesListProps) {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCandidateId, setSelectedCandidateId] = useState<string | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [deletingCandidateId, setDeletingCandidateId] = useState<string | null>(null)
  const { toast } = useToast()
  const { state, triggerRefresh } = useAppContext()

  useEffect(() => {
    fetchCandidates()
  }, [roleId])

  // Listen for context changes to refresh candidates
  useEffect(() => {
    fetchCandidates()
  }, [state.refreshTrigger, state.lastCvUploaded])

  const fetchCandidates = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.getRoleCandidates(roleId)
      
      if (response.candidates) {
        // Transform API response to match component interface
        const transformedCandidates: Candidate[] = response.candidates.map(candidate => ({
          id: candidate.id,
          name: candidate.name,
          email: candidate.email,
          cvUrl: candidate.cvUrl,
          score: candidate.score || 0,
          strengths: Array.isArray(candidate.strengths) ? candidate.strengths : [],
          weaknesses: Array.isArray(candidate.weaknesses) ? candidate.weaknesses : [],
          evaluation: candidate.evaluation || '',
          appliedAt: candidate.evaluation_date,
          evaluation_date: candidate.evaluation_date,
          status: candidate.status
        }))
        setCandidates(transformedCandidates)
      } else {
        setCandidates([])
      }
    } catch (error) {
      console.error("Error fetching candidates:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los candidatos",
        variant: "destructive",
      })
      
      // Fallback to empty array on error
      setCandidates([])
    } finally {
      setIsLoading(false)
    }
  }

  const getScoreBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-500 hover:bg-green-600">Excelente</Badge>
    if (score >= 60) return <Badge variant="default">Bueno</Badge>
    if (score >= 40) return <Badge variant="secondary">Regular</Badge>
    return <Badge variant="destructive">Bajo</Badge>
  }

  const getInitials = (name: string) => {
    if (!name) return "??"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
  }

  const handleViewDetails = (candidateId: string) => {
    setSelectedCandidateId(candidateId)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedCandidateId(null)
  }

  const handleDownloadCV = async (cvUrl: string, candidateName: string) => {
    try {
      const response = await fetch(cvUrl)
      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `CV_${candidateName.replace(/\s+/g, "_")}.pdf`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast({
        title: "Descarga iniciada",
        description: `CV de ${candidateName} descargado exitosamente`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudo descargar el CV",
        variant: "destructive",
      })
    }
  }

  const handleContactCandidate = (email: string, name: string) => {
    const subject = encodeURIComponent(`Oportunidad laboral - Proceso de selección`)
    const body = encodeURIComponent(`Estimado/a ${name},\n\nEsperamos que se encuentre bien. Nos ponemos en contacto con usted en relación al proceso de selección en el que ha participado.\n\nNos gustaría coordinar una entrevista para conocer más sobre su perfil profesional.\n\n¿Podría indicarnos su disponibilidad para los próximos días?\n\nQuedamos atentos a su respuesta.\n\nSaludos cordiales,\nEquipo de Recursos Humanos`)
    const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`
    
    window.open(mailtoUrl, '_blank')
    
    toast({
      title: "Cliente de email abierto",
      description: `Se ha abierto el cliente de email para contactar a ${name}`,
    })
  }

  const handleDeleteCandidate = async (candidateId: string, candidateName: string) => {
    try {
      setDeletingCandidateId(candidateId)
      await apiClient.deleteCandidate(candidateId)
      
      // Remove candidate from local state
      setCandidates(prev => prev.filter(candidate => candidate.id !== candidateId))
      
      // Trigger refresh in context
      triggerRefresh()
      
      toast({
        title: "Candidato eliminado",
        description: `${candidateName} ha sido eliminado exitosamente`,
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el candidato",
        variant: "destructive",
      })
    } finally {
      setDeletingCandidateId(null)
    }
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center space-x-4">
                <div className="h-12 w-12 bg-muted rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-3 bg-muted rounded w-1/3"></div>
                </div>
                <div className="h-6 bg-muted rounded w-16"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  if (candidates.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <Users className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No hay candidatos aún</h3>
          <p className="text-muted-foreground mb-4">Sube el primer CV para comenzar a evaluar candidatos</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {candidates
          .sort((a, b) => b.score - a.score)
          .map((candidate) => (
            <Card key={candidate.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {getInitials(candidate.name)}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-lg">{candidate.name}</h3>
                        {getScoreBadge(candidate.score)}
                      </div>

                      <p className="text-muted-foreground text-sm mb-2">{candidate.email}</p>

                      <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-3">
                        <div className="flex items-center">
                          <Star className="mr-1 h-4 w-4 fill-current text-yellow-500" />
                          {candidate.score}/100
                        </div>
                        <span>Evaluado: {candidate.evaluation_date ? new Date(candidate.evaluation_date).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        }) : 'Pendiente'}</span>
                      </div>

                      {candidate.evaluation && (
                        <p className="text-sm text-muted-foreground mb-3 italic">&ldquo;{candidate.evaluation}&rdquo;</p>
                      )}

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                        <div>
                          <h4 className="font-medium text-green-700 mb-1">Fortalezas:</h4>
                          <ul className="text-muted-foreground space-y-1">
                            {candidate.strengths && candidate.strengths.length > 0 ? (
                              candidate.strengths.map((strength, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-green-500 mr-1">•</span>
                                  {strength}
                                </li>
                              ))
                            ) : (
                              <li className="text-muted-foreground italic">No disponible</li>
                            )}
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-medium text-orange-700 mb-1">Áreas de mejora:</h4>
                          <ul className="text-muted-foreground space-y-1">
                            {candidate.weaknesses && candidate.weaknesses.length > 0 ? (
                              candidate.weaknesses.map((weakness, index) => (
                                <li key={index} className="flex items-start">
                                  <span className="text-orange-500 mr-1">•</span>
                                  {weakness}
                                </li>
                              ))
                            ) : (
                              <li className="text-muted-foreground italic">No disponible</li>
                            )}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full bg-transparent"
                      onClick={() => handleViewDetails(candidate.id)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Detalles
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDownloadCV(candidate.cvUrl, candidate.name)}>
                      <Download className="mr-2 h-4 w-4" />
                      Descargar CV
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => handleContactCandidate(candidate.email, candidate.name)}>
                      <Mail className="mr-2 h-4 w-4" />
                      Contactar
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          disabled={deletingCandidateId === candidate.id}
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {deletingCandidateId === candidate.id ? "Eliminando..." : "Eliminar"}
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará permanentemente el candidato <strong>{candidate.name}</strong>, 
                            su evaluación y su CV del sistema.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDeleteCandidate(candidate.id, candidate.name)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Eliminar
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
      </div>

      <CandidateDetailModal candidateId={selectedCandidateId} isOpen={isModalOpen} onClose={handleCloseModal} />
    </>
  )
}
