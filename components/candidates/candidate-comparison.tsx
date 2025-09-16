"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertCircle, Star, X, Users, Trophy, FileText } from "lucide-react"

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

interface CandidateComparisonProps {
  candidates: Candidate[]
  onRemoveCandidate: (candidateId: string) => void
  comparisonResult?: ComparisonResult | null
}

export function CandidateComparison({ candidates, onRemoveCandidate, comparisonResult }: CandidateComparisonProps) {
  if (candidates.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Users className="h-12 w-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">Sin candidatos para comparar</h3>
          <p className="text-muted-foreground text-center">
            Selecciona candidatos desde la lista para compararlos aquí
          </p>
        </CardContent>
      </Card>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-50 border-green-200"
    if (score >= 60) return "text-yellow-600 bg-yellow-50 border-yellow-200"
    return "text-red-600 bg-red-50 border-red-200"
  }

  const getScoreStars = (score: number) => {
    const stars = Math.round(score / 20)
    return Array.from({ length: 5 }, (_, i) => (
      <Star key={i} className={`h-4 w-4 ${i < stars ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
    ))
  }

  const bestCandidate = candidates.reduce((best, current) => (current.score > best.score ? current : best))
  const isBestCandidate = (candidate: Candidate) => {
    return comparisonResult ? candidate.name === comparisonResult.best_candidate_name : candidate.id === bestCandidate.id
  }

  return (
    <div className="space-y-6">
      {/* Comparison Grid - Matching the image design */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {candidates.map((candidate) => (
          <Card
            key={candidate.id}
            className={`relative bg-blue-50 border-blue-200 shadow-sm hover:shadow-md transition-shadow ${
              isBestCandidate(candidate) && candidates.length > 1 ? "ring-2 ring-green-500" : ""
            }`}
          >
            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3 min-w-0 flex-1 pr-2">
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
                    <CardDescription className="text-blue-600 truncate">{candidate.email}</CardDescription>
                  </div>
                </div>
                <div className="flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveCandidate(candidate.id)}
                    className="text-muted-foreground hover:text-destructive h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Score Section */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-blue-800">Puntuación</span>
                  <Badge className={`${getScoreColor(candidate.score)} border text-xs`}>
                    {candidate.score}/100
                  </Badge>
                </div>
                <Progress value={candidate.score} className="h-2 bg-blue-100" />
                <div className="flex items-center gap-1">{getScoreStars(candidate.score)}</div>
              </div>

              {/* Role Section */}
              <div>
                <span className="text-sm font-medium text-blue-800">Puesto:</span>
                <p className="text-sm text-blue-700">{candidate.roleTitle}</p>
              </div>

              {/* Evaluation Section */}
              {candidate.evaluation && (
                <div>
                  <span className="text-sm font-medium text-blue-800">Evaluación:</span>
                  <p className="text-sm text-blue-700 mt-1 line-clamp-2">{candidate.evaluation}</p>
                </div>
              )}

              {/* Strengths Section */}
              <div>
                <h4 className="text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  Fortalezas
                </h4>
                <div className="space-y-1">
                  {candidate.strengths.slice(0, 2).map((strength, index) => (
                    <div key={index} className="text-xs bg-green-50 text-green-800 p-2 rounded border border-green-200 line-clamp-2">
                      {strength}
                    </div>
                  ))}
                </div>
              </div>

              {/* Weaknesses Section */}
              <div>
                <h4 className="text-sm font-medium text-orange-700 mb-2 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  Áreas de Mejora
                </h4>
                <div className="space-y-1">
                  {candidate.weaknesses.slice(0, 2).map((weakness, index) => (
                    <div
                      key={index}
                      className="text-xs bg-orange-50 text-orange-800 p-2 rounded border border-orange-200 line-clamp-2"
                    >
                      {weakness}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Comparison Summary - Professional display of API response */}
      {comparisonResult && (
        <div className="space-y-6">
          {/* Best Candidate Highlight */}
          <Card className="border-green-200 bg-green-50/50">
            <CardHeader>
              <CardTitle className="text-green-800 flex items-center gap-2">
                <Trophy className="h-5 w-5 fill-green-600 text-green-600" />
                Candidato Recomendado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-green-100 p-3 rounded-full">
                    <Trophy className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-green-800 text-lg">{comparisonResult.best_candidate_name}</h3>
                    <p className="text-green-600">Ha sido seleccionado como el mejor candidato para este puesto</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border border-green-200">
                  <h4 className="font-medium text-green-800 mb-2 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Justificación
                  </h4>
                  <p className="text-sm text-gray-700 leading-relaxed">{comparisonResult.justification}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Analysis */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Análisis Detallado por Candidato
              </CardTitle>
              <CardDescription>
                Evaluación individual de cada candidato en el contexto del puesto
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {comparisonResult.comparison_summary.map((summary, index) => {
                  const candidate = candidates.find(c => c.name === summary.candidate_name)
                  const isBest = summary.candidate_name === comparisonResult.best_candidate_name
                  
                  return (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border ${
                        isBest 
                          ? "bg-green-50 border-green-200" 
                          : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarFallback className={`${
                            isBest ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                          } font-medium`}>
                            {summary.candidate_name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-medium text-gray-900">{summary.candidate_name}</h4>
                            {isBest && (
                              <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                                Recomendado
                              </Badge>
                            )}
                            {candidate && (
                              <Badge className={`${getScoreColor(candidate.score)} border text-xs`}>
                                {candidate.score}/100
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-700 leading-relaxed">{summary.analysis}</p>
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Summary Statistics */}
          <Card>
            <CardHeader>
              <CardTitle>Resumen Estadístico</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {Math.max(...candidates.map((c) => c.score))}
                  </div>
                  <p className="text-sm text-muted-foreground">Puntuación más alta</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {Math.round(candidates.reduce((sum, c) => sum + c.score, 0) / candidates.length)}
                  </div>
                  <p className="text-sm text-muted-foreground">Puntuación promedio</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {Math.max(...candidates.map((c) => c.score)) - Math.min(...candidates.map((c) => c.score))}
                  </div>
                  <p className="text-sm text-muted-foreground">Diferencia de puntos</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}