"use client"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { CheckCircle, AlertCircle, Star, X, Users } from "lucide-react"

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

interface CandidateComparisonProps {
  candidates: Candidate[]
  onRemoveCandidate: (candidateId: number) => void
}

export function CandidateComparison({ candidates, onRemoveCandidate }: CandidateComparisonProps) {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Comparación de Candidatos</h2>
          <p className="text-muted-foreground">Compara hasta {candidates.length} candidatos lado a lado</p>
        </div>
        <Badge variant="secondary" className="bg-primary/10 text-primary">
          {candidates.length} candidatos seleccionados
        </Badge>
      </div>

      {/* Best Candidate Highlight */}
      {candidates.length > 1 && (
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader>
            <CardTitle className="text-green-800 flex items-center gap-2">
              <Star className="h-5 w-5 fill-green-600 text-green-600" />
              Mejor Candidato
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <Avatar className="h-12 w-12">
                <AvatarFallback className="bg-green-100 text-green-700 font-semibold">
                  {bestCandidate.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-green-800">{bestCandidate.name}</h3>
                <p className="text-green-600">Puntuación: {bestCandidate.score}/100</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Comparison Grid */}
      <div
        className={`grid gap-6 ${candidates.length === 1 ? "grid-cols-1 max-w-2xl mx-auto" : candidates.length === 2 ? "grid-cols-1 lg:grid-cols-2" : "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"}`}
      >
        {candidates.map((candidate) => (
          <Card
            key={candidate.id}
            className={`relative ${candidate.id === bestCandidate.id && candidates.length > 1 ? "ring-2 ring-green-500" : ""}`}
          >
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                      {candidate.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle className="text-lg">{candidate.name}</CardTitle>
                    <CardDescription>{candidate.email}</CardDescription>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onRemoveCandidate(candidate.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {candidate.id === bestCandidate.id && candidates.length > 1 && (
                <Badge className="absolute top-2 right-2 bg-green-100 text-green-800 border-green-200">Mejor</Badge>
              )}
            </CardHeader>

            <CardContent className="space-y-4">
              {/* Score */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Puntuación</span>
                  <Badge className={`${getScoreColor(candidate.score)} border`}>{candidate.score}/100</Badge>
                </div>
                <Progress value={candidate.score} className="h-2" />
                <div className="flex items-center gap-1">{getScoreStars(candidate.score)}</div>
              </div>

              {/* Role */}
              <div>
                <span className="text-sm font-medium text-muted-foreground">Puesto:</span>
                <p className="text-sm">{candidate.roleTitle}</p>
              </div>

              {/* Evaluation */}
              {candidate.evaluation && (
                <div>
                  <span className="text-sm font-medium text-muted-foreground">Evaluación:</span>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-3">{candidate.evaluation}</p>
                </div>
              )}

              {/* Strengths */}
              <div>
                <h4 className="text-sm font-medium text-green-700 mb-2 flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  Fortalezas
                </h4>
                <div className="space-y-1">
                  {candidate.strengths.slice(0, 2).map((strength, index) => (
                    <div key={index} className="text-xs bg-green-50 text-green-800 p-2 rounded border border-green-200">
                      {strength}
                    </div>
                  ))}
                </div>
              </div>

              {/* Weaknesses */}
              <div>
                <h4 className="text-sm font-medium text-orange-700 mb-2 flex items-center gap-1">
                  <AlertCircle className="h-4 w-4" />
                  Áreas de Mejora
                </h4>
                <div className="space-y-1">
                  {candidate.weaknesses.slice(0, 2).map((weakness, index) => (
                    <div
                      key={index}
                      className="text-xs bg-orange-50 text-orange-800 p-2 rounded border border-orange-200"
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

      {/* Comparison Summary */}
      {candidates.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Resumen de Comparación</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{Math.max(...candidates.map((c) => c.score))}</div>
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
      )}
    </div>
  )
}
