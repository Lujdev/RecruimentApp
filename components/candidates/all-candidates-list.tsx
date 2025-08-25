"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Eye, Download, Mail, Star, Search, Filter } from "lucide-react"
import Link from "next/link"

interface Candidate {
  id: number
  name: string
  email: string
  roleTitle: string
  score: number
  appliedAt: string
  status: "pending" | "reviewed" | "contacted"
}

export function AllCandidatesList() {
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [filteredCandidates, setFilteredCandidates] = useState<Candidate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [scoreFilter, setScoreFilter] = useState("all")

  useEffect(() => {
    fetchAllCandidates()
  }, [])

  useEffect(() => {
    filterCandidates()
  }, [candidates, searchTerm, scoreFilter])

  const fetchAllCandidates = async () => {
    try {
      // Mock data - in production, fetch from API
      setTimeout(() => {
        setCandidates([
          {
            id: 1,
            name: "María García",
            email: "maria.garcia@email.com",
            roleTitle: "Desarrollador Frontend Senior",
            score: 8.5,
            appliedAt: "2024-01-20",
            status: "pending",
          },
          {
            id: 2,
            name: "Juan Pérez",
            email: "juan.perez@email.com",
            roleTitle: "Desarrollador Frontend Senior",
            score: 7.2,
            appliedAt: "2024-01-19",
            status: "reviewed",
          },
          {
            id: 3,
            name: "Ana López",
            email: "ana.lopez@email.com",
            roleTitle: "Diseñador UX/UI",
            score: 9.1,
            appliedAt: "2024-01-18",
            status: "contacted",
          },
        ])
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error fetching candidates:", error)
      setIsLoading(false)
    }
  }

  const filterCandidates = () => {
    let filtered = candidates

    if (searchTerm) {
      filtered = filtered.filter(
        (candidate) =>
          candidate.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          candidate.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          candidate.roleTitle.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (scoreFilter !== "all") {
      switch (scoreFilter) {
        case "excellent":
          filtered = filtered.filter((candidate) => candidate.score >= 8.5)
          break
        case "good":
          filtered = filtered.filter((candidate) => candidate.score >= 7 && candidate.score < 8.5)
          break
        case "average":
          filtered = filtered.filter((candidate) => candidate.score < 7)
          break
      }
    }

    setFilteredCandidates(filtered)
  }

  const getScoreBadge = (score: number) => {
    if (score >= 8.5) return <Badge className="bg-green-500 hover:bg-green-600">Excelente</Badge>
    if (score >= 7) return <Badge variant="default">Bueno</Badge>
    return <Badge variant="secondary">Regular</Badge>
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      pending: "secondary",
      reviewed: "default",
      contacted: "outline",
    } as const

    const labels = {
      pending: "Pendiente",
      reviewed: "Revisado",
      contacted: "Contactado",
    }

    return <Badge variant={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>
  }

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
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
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nombre, email o rol..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={scoreFilter} onValueChange={setScoreFilter}>
              <SelectTrigger className="w-full sm:w-48">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Filtrar por puntuación" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las puntuaciones</SelectItem>
                <SelectItem value="excellent">Excelente (8.5+)</SelectItem>
                <SelectItem value="good">Bueno (7.0-8.4)</SelectItem>
                <SelectItem value="average">Regular (&lt;7.0)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        {filteredCandidates.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">No se encontraron candidatos con los filtros aplicados</p>
            </CardContent>
          </Card>
        ) : (
          filteredCandidates
            .sort((a, b) => b.score - a.score)
            .map((candidate) => (
              <Card key={candidate.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <Avatar className="h-12 w-12">
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(candidate.name)}
                        </AvatarFallback>
                      </Avatar>

                      <div>
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-semibold text-lg">{candidate.name}</h3>
                          {getScoreBadge(candidate.score)}
                          {getStatusBadge(candidate.status)}
                        </div>
                        <p className="text-muted-foreground text-sm">{candidate.email}</p>
                        <p className="text-sm font-medium text-primary">{candidate.roleTitle}</p>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground mt-1">
                          <div className="flex items-center">
                            <Star className="mr-1 h-4 w-4 fill-current text-yellow-500" />
                            {candidate.score.toFixed(1)}/10
                          </div>
                          <span>Aplicó: {new Date(candidate.appliedAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Link href={`/dashboard/candidates/${candidate.id}`}>
                        <Button variant="outline" size="sm">
                          <Eye className="mr-2 h-4 w-4" />
                          Ver
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm">
                        <Download className="mr-2 h-4 w-4" />
                        CV
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Mail className="mr-2 h-4 w-4" />
                        Contactar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
        )}
      </div>
    </div>
  )
}
