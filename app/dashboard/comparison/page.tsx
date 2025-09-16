"use client"

import { useState, useEffect } from "react"
import { CandidateComparison } from "@/components/candidates/candidate-comparison"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Users, Briefcase, CheckCircle, AlertCircle, Star, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { apiClient } from "@/lib/api"

interface Role {
  id: string
  title: string
  description: string
  requirements: string
  department?: string
  location?: string
  employmentType?: string
  candidatesCount: number
  createdAt: string
  status: "active" | "paused" | "closed"
}

interface Candidate {
  id: string
  name: string
  email: string
  score: number
  strengths: string[]
  weaknesses: string[]
  evaluation: string
  roleTitle: string
  phone?: string
  cvUrl?: string
  appliedAt: string
  status: string
}

interface ComparisonResult {
  best_candidate_name: string
  justification: string
  comparison_summary: Array<{
    candidate_name: string
    analysis: string
  }>
}

export default function ComparisonPage() {
  const [selectedRole, setSelectedRole] = useState<Role | null>(null)
  const [roles, setRoles] = useState<Role[]>([])
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [selectedCandidates, setSelectedCandidates] = useState<Candidate[]>([])
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null)
  const [loading, setLoading] = useState(true)
  const [candidatesLoading, setCandidatesLoading] = useState(false)
  const [comparing, setComparing] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchRoles()
  }, [])

  const fetchRoles = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getRoles({
        page: 1,
        limit: 50,
        status: "active"
      })
      
      if (response.roles && Array.isArray(response.roles)) {
        const transformedRoles: Role[] = response.roles.map(role => ({
          id: role.id,
          title: role.title,
          description: role.description,
          requirements: role.requirements,
          department: role.department,
          location: role.location,
          employmentType: role.employment_type,
          candidatesCount: parseInt(role.applications_count) || 0,
          createdAt: role.created_at,
          status: role.status as "active" | "paused" | "closed"
        }))
        setRoles(transformedRoles)
      } else {
        setRoles([])
      }
    } catch (error) {
      console.error("Error fetching roles:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los roles",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchCandidatesForRole = async (roleId: string) => {
    try {
      setCandidatesLoading(true)
      const response = await apiClient.getRoleCandidates(roleId)
      
      if (response.candidates && Array.isArray(response.candidates)) {
        const transformedCandidates: Candidate[] = response.candidates.map(candidate => ({
          id: candidate.id,
          name: candidate.name,
          email: candidate.email,
          score: candidate.score,
          strengths: candidate.strengths,
          weaknesses: candidate.weaknesses,
          evaluation: candidate.evaluation,
          roleTitle: selectedRole?.title || "",
          phone: "",
          cvUrl: candidate.cvUrl,
          appliedAt: candidate.evaluation_date,
          status: "evaluated"
        }))
        setCandidates(transformedCandidates)
      } else {
        setCandidates([])
      }
    } catch (error) {
      console.error("Error fetching candidates:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los candidatos para este rol",
        variant: "destructive",
      })
      setCandidates([])
    } finally {
      setCandidatesLoading(false)
    }
  }

  const handleRoleSelect = (roleId: string) => {
    const role = roles.find(r => r.id === roleId)
    if (role) {
      setSelectedRole(role)
      setSelectedCandidates([])
      setComparisonResult(null)
      fetchCandidatesForRole(roleId)
    }
  }

  const addCandidateToComparison = (candidate: Candidate) => {
    if (selectedCandidates.length >= 3) {
      toast({
        title: "Límite alcanzado",
        description: "Solo puedes comparar hasta 3 candidatos a la vez",
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

  const removeCandidateFromComparison = (candidateId: string) => {
    setSelectedCandidates((prev) => prev.filter((c) => c.id !== candidateId))
    setComparisonResult(null) // Clear comparison result when removing candidates
    toast({
      title: "Candidato removido",
      description: "El candidato ha sido removido de la comparación",
    })
  }

  const handleCompareCandidates = async () => {
    if (selectedCandidates.length < 2) {
      toast({
        title: "Selecciona más candidatos",
        description: "Necesitas al menos 2 candidatos para comparar",
        variant: "destructive",
      })
      return
    }

    if (!selectedRole) {
      toast({
        title: "Selecciona un rol",
        description: "Necesitas seleccionar un rol para comparar candidatos",
        variant: "destructive",
      })
      return
    }

    try {
      setComparing(true)
      const response = await apiClient.compareCandidates({
        roleId: selectedRole.id,
        candidateIds: selectedCandidates.map(c => c.id)
      })

      if (response.success) {
        setComparisonResult(response.data)
        toast({
          title: "Comparación completada",
          description: "La comparación de candidatos se ha realizado exitosamente",
        })
      } else {
        throw new Error("Error en la comparación")
      }
    } catch (error) {
      console.error("Error comparing candidates:", error)
      toast({
        title: "Error",
        description: "No se pudo realizar la comparación de candidatos",
        variant: "destructive",
      })
    } finally {
      setComparing(false)
    }
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
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Comparación de Candidatos</h1>
        <p className="text-muted-foreground">Selecciona un rol y compara candidatos lado a lado</p>
      </div>

      {/* Role Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Seleccionar Rol de Trabajo
          </CardTitle>
          <CardDescription>Elige el puesto para el cual quieres comparar candidatos</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Select onValueChange={handleRoleSelect} value={selectedRole?.id || ""}>
              <SelectTrigger className="w-full max-w-md">
                <SelectValue placeholder="Selecciona un rol de trabajo..." />
              </SelectTrigger>
              <SelectContent>
                {roles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    <div className="flex items-center justify-between w-full">
                      <span>{role.title}</span>
                      <Badge variant="secondary" className="ml-2">
                        {role.candidatesCount} candidatos
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {selectedRole && (
              <div className="text-sm text-muted-foreground">
                <p><strong>Departamento:</strong> {selectedRole.department || "No especificado"}</p>
                <p><strong>Ubicación:</strong> {selectedRole.location || "No especificada"}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Candidates Selection */}
      {selectedRole && (
        <Card className="bg-blue-50/30 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-900">
              <Users className="h-5 w-5" />
              Candidatos para {selectedRole.title}
            </CardTitle>
            <CardDescription className="text-blue-700">
              Selecciona hasta 3 candidatos para comparar (seleccionados: {selectedCandidates.length}/3)
            </CardDescription>
          </CardHeader>
          <CardContent>
            {candidatesLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader>
                      <div className="h-4 bg-muted rounded w-3/4"></div>
                      <div className="h-3 bg-muted rounded w-1/2"></div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            ) : candidates.length === 0 ? (
              <div className="text-center py-8">
                <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay candidatos</h3>
                <p className="text-muted-foreground">No se encontraron candidatos para este rol</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {candidates.map((candidate) => {
                  const isSelected = selectedCandidates.find((c) => c.id === candidate.id) !== undefined
                  return (
                    <Card 
                      key={candidate.id} 
                      className={`relative bg-blue-50 border-blue-200 shadow-sm hover:shadow-md transition-shadow ${
                        isSelected ? "ring-2 ring-blue-500" : ""
                      }`}
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-3 min-w-0 flex-1">
                            <Avatar className="h-12 w-12 flex-shrink-0">
                              <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                                {candidate.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")
                                  .toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="min-w-0 flex-1">
                              <CardTitle className="text-lg text-blue-900 truncate">{candidate.name}</CardTitle>
                            </div>
                          </div>
                          <div className="flex-shrink-0">
                            <Button
                              size="sm"
                              onClick={() => addCandidateToComparison(candidate)}
                              disabled={isSelected}
                              className={`text-xs px-2 py-1 h-7 whitespace-nowrap ${isSelected ? "bg-green-100 text-green-800 border-green-200 hover:bg-green-100" : ""}`}
                            >
                              <Plus className="h-3 w-3 mr-1" />
                              {isSelected ? "Añadido" : "Añadir"}
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-3">
                        {/* Score Section */}
                        <div className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-blue-800">Puntuación</span>
                            <Badge className={`${getScoreColor(candidate.score)} border text-xs`}>
                              {candidate.score}/100
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Comparison Section */}
      {selectedCandidates.length > 0 && (
        <Card className="bg-blue-50/30 border-blue-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-blue-900 flex items-center gap-2">
                  <Users className="h-6 w-6" />
                  Comparación de Candidatos
                </CardTitle>
                <CardDescription className="text-blue-700">
                  {selectedCandidates.length} candidato{selectedCandidates.length > 1 ? 's' : ''} seleccionado{selectedCandidates.length > 1 ? 's' : ''}
                </CardDescription>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleCompareCandidates}
                  disabled={selectedCandidates.length < 2 || comparing}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {comparing ? "Comparando..." : "Comparar Candidatos"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedCandidates([])
                    setComparisonResult(null)
                  }}
                  className="border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  Limpiar Selección
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CandidateComparison 
              candidates={selectedCandidates} 
              onRemoveCandidate={removeCandidateFromComparison}
              comparisonResult={comparisonResult}
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}