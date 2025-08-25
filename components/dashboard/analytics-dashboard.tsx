"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Users, FileText, Star, Award } from "lucide-react"

interface AnalyticsData {
  totalCandidates: number
  totalRoles: number
  averageScore: number
  topCandidates: Array<{
    name: string
    score: number
    role: string
  }>
  scoreDistribution: Array<{
    range: string
    count: number
  }>
  roleStats: Array<{
    role: string
    candidates: number
    avgScore: number
  }>
  weeklyApplications: Array<{
    week: string
    applications: number
  }>
}

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      // Simulated data - in real app would fetch from API
      const mockData: AnalyticsData = {
        totalCandidates: 127,
        totalRoles: 8,
        averageScore: 73.5,
        topCandidates: [
          { name: "Ana García", score: 94, role: "Frontend Developer" },
          { name: "Carlos López", score: 91, role: "Backend Developer" },
          { name: "María Rodríguez", score: 88, role: "UX Designer" },
          { name: "Juan Martínez", score: 85, role: "Data Scientist" },
        ],
        scoreDistribution: [
          { range: "90-100", count: 12 },
          { range: "80-89", count: 28 },
          { range: "70-79", count: 35 },
          { range: "60-69", count: 31 },
          { range: "50-59", count: 21 },
        ],
        roleStats: [
          { role: "Frontend Developer", candidates: 32, avgScore: 76 },
          { role: "Backend Developer", candidates: 28, avgScore: 74 },
          { role: "UX Designer", candidates: 24, avgScore: 78 },
          { role: "Data Scientist", candidates: 18, avgScore: 81 },
          { role: "DevOps Engineer", candidates: 15, avgScore: 72 },
          { role: "Product Manager", candidates: 10, avgScore: 79 },
        ],
        weeklyApplications: [
          { week: "Sem 1", applications: 15 },
          { week: "Sem 2", applications: 23 },
          { week: "Sem 3", applications: 31 },
          { week: "Sem 4", applications: 28 },
          { week: "Sem 5", applications: 30 },
        ],
      }

      setTimeout(() => {
        setAnalytics(mockData)
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error fetching analytics:", error)
      setLoading(false)
    }
  }

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader className="space-y-2">
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-8 bg-muted rounded w-1/2"></div>
            </CardHeader>
          </Card>
        ))}
      </div>
    )
  }

  if (!analytics) return null

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Candidatos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalCandidates}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+12%</span> desde el mes pasado
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Roles Activos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalRoles}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-blue-600">+2</span> nuevos esta semana
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Puntuación Promedio</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.averageScore}</div>
            <p className="text-xs text-muted-foreground">
              <span className="text-green-600">+2.3</span> puntos este mes
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Candidatos Destacados</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.scoreDistribution.find((d) => d.range === "90-100")?.count || 0}
            </div>
            <p className="text-xs text-muted-foreground">Puntuación 90+</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Distribution */}
        <Card>
          <CardHeader>
            <CardTitle>Distribución de Puntuaciones</CardTitle>
            <CardDescription>Rango de puntuaciones de todos los candidatos</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Applications */}
        <Card>
          <CardHeader>
            <CardTitle>Aplicaciones Semanales</CardTitle>
            <CardDescription>Tendencia de aplicaciones en las últimas 5 semanas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.weeklyApplications}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="applications"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Role Statistics and Top Candidates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Role Statistics */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Estadísticas por Rol</CardTitle>
            <CardDescription>Candidatos y puntuación promedio por posición</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.roleStats.map((role, index) => (
                <div key={role.role} className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium">{role.role}</h4>
                      <Badge variant="secondary">{role.candidates} candidatos</Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">Puntuación promedio:</span>
                      <span className="font-medium">{role.avgScore}</span>
                      <Progress value={role.avgScore} className="flex-1 max-w-[100px]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Candidates */}
        <Card>
          <CardHeader>
            <CardTitle>Mejores Candidatos</CardTitle>
            <CardDescription>Top 4 candidatos por puntuación</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.topCandidates.map((candidate, index) => (
                <div key={candidate.name} className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold text-white ${
                      index === 0
                        ? "bg-yellow-500"
                        : index === 1
                          ? "bg-gray-400"
                          : index === 2
                            ? "bg-amber-600"
                            : "bg-blue-500"
                    }`}
                  >
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm">{candidate.name}</p>
                    <p className="text-xs text-muted-foreground">{candidate.role}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200">{candidate.score}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
