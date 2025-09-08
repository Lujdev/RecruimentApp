"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Eye, Download, Mail, Star, Users } from "lucide-react"
import { CandidateDetailModal } from "./candidate-detail-modal"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api"
import { useAppContext } from "@/contexts/AppContext"

interface Candidate {
  id: string
  name: string
  email: string
  roleTitle: string
  score: number | null
  appliedAt: string
  status: string
  roleId: string
}

export function AllCandidatesList() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null)
  const { toast } = useToast()
  const { state } = useAppContext()

  const fetchAllCandidates = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.getCandidates()
      
      if (response.data.candidates) {
        setCandidates(response.data.candidates)
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
  }, [toast])

  useEffect(() => {
    fetchAllCandidates()
  }, [fetchAllCandidates])

  useEffect(() => {
    if (state.refreshTrigger > 0) {
      fetchAllCandidates()
    }
  }, [state.refreshTrigger, fetchAllCandidates])

  const getScoreBadge = (score: number | null) => {
    if (score === null || score === 0) {
      return <Badge variant="secondary">No calificada</Badge>
    }
    const variant = score >= 80 ? "default" : score >= 60 ? "secondary" : "destructive"
    return (
      <Badge variant={variant}>
        <Star className="h-3 w-3 mr-1" />
        {score.toFixed(1)}
      </Badge>
    )
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { variant: "secondary" as const, label: "Pendiente" },
      reviewed: { variant: "default" as const, label: "Revisado" },
      accepted: { variant: "default" as const, label: "Aceptado" },
      rejected: { variant: "destructive" as const, label: "Rechazado" },
    }
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
    return <Badge variant={config.variant}>{config.label}</Badge>
  }

  const getInitials = (name: string) => {
    if (!name) return "??"
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2)
  }

  const handleCandidateDetails = (candidate: Candidate) => {
    setSelectedCandidate(candidate)
  }

  const handleDownloadCV = (cvUrl: string, candidateName: string) => {
    window.open(cvUrl, "_blank")
  }

  const handleContactCandidate = (email: string) => {
    window.open(`mailto:${email}`, "_blank")
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-start space-x-4">
              <div className="h-12 w-12 rounded-full bg-muted animate-pulse" />
              <div className="flex-1 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="h-5 bg-muted rounded w-1/3 animate-pulse" />
                  <div className="h-6 bg-muted rounded w-16 animate-pulse" />
                </div>
                <div className="h-4 bg-muted rounded w-1/2 animate-pulse" />
                <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
                <div className="flex space-x-2">
                  <div className="h-8 bg-muted rounded w-20 animate-pulse" />
                  <div className="h-8 bg-muted rounded w-20 animate-pulse" />
                  <div className="h-8 bg-muted rounded w-20 animate-pulse" />
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    )
  }

  if (candidates.length === 0) {
    return (
      <Card className="p-12">
        <div className="text-center">
          <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">No hay candidatos</h3>
          <p className="text-muted-foreground">Aún no se han recibido aplicaciones.</p>
        </div>
      </Card>
    )
  }

  return (
    <>
      <div className="space-y-4">
        {candidates.map((candidate) => (
          <Card key={candidate.id} className="p-6 hover:shadow-md transition-shadow">
            <div className="flex items-start space-x-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {getInitials(candidate.name)}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="text-lg font-semibold text-foreground">
                      {candidate.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{candidate.email}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getScoreBadge(candidate.score)}
                    {getStatusBadge(candidate.status)}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="font-medium">Rol:</span>
                    <span className="ml-2">{candidate.roleTitle}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-muted-foreground">
                    <span className="font-medium">Aplicó:</span>
                    <span className="ml-2">
                      {new Date(candidate.appliedAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                
                <div className="flex space-x-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCandidateDetails(candidate)}
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Ver Detalles
                  </Button>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleContactCandidate(candidate.email)}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Contactar
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {selectedCandidate && (
        <CandidateDetailModal
          candidateId={selectedCandidate.id}
          isOpen={!!selectedCandidate}
          onClose={() => setSelectedCandidate(null)}
        />
      )}
    </>
  )
}
