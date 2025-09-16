"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import { Users, FileText, Star, Award } from "lucide-react"
import { apiClient } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

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
  temporalComparison: {
    candidatesChange: {
      current: number
      previous: number
      percentage: number
      period: string
    }
    rolesChange: {
      current: number
      previous: number
      percentage: number
      period: string
    }
    scoreChange: {
      current: number
      previous: number
      difference: number
      period: string
    }
    weeklyChange: {
      current: number
      previous: number
      percentage: number
      period: string
    }
  }
}

export function AnalyticsDashboard() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchAnalytics()
  }, [])

  const fetchAnalytics = async () => {
    try {
      setLoading(true)
      const response = await apiClient.getDashboardAnalytics()
      
      if (response.success) {
        // Transform API response to match component interface
        const transformedData: AnalyticsData = {
          totalCandidates: response.data.totalCandidates,
          totalRoles: response.data.totalRoles,
          averageScore: response.data.averageScore,
          topCandidates: response.data.topCandidates.map(candidate => ({
            name: candidate.name,
            score: candidate.score,
            role: candidate.role_title
          })),
          scoreDistribution: response.data.scoreDistribution.map(item => ({
            range: item.score_range,
            count: item.count
          })),
          roleStats: response.data.roleStats.map(role => ({
            role: role.title,
            candidates: role.applicationsCount,
            avgScore: role.avgScore
          })),
          weeklyApplications: response.data.weeklyApplications.map(week => ({
            week: week.week,
            applications: week.count
          })),
          temporalComparison: response.data.temporalComparison || {
            candidatesChange: { current: 0, previous: 0, percentage: 0, period: "mes" },
            rolesChange: { current: 0, previous: 0, percentage: 0, period: "semana" },
            scoreChange: { current: 0, previous: 0, difference: 0, period: "mes" },
            weeklyChange: { current: 0, previous: 0, percentage: 0, period: "semana" }
          }
        }
        setAnalytics(transformedData)
      }
    } catch (error) {
      console.error("Error fetching analytics:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos de análisis",
        variant: "destructive",
      })
      
      // Fallback to mock data on error
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
        temporalComparison: {
          candidatesChange: { current: 127, previous: 113, percentage: 12.4, period: "mes" },
          rolesChange: { current: 8, previous: 6, percentage: 33.3, period: "semana" },
          scoreChange: { current: 73.5, previous: 71.2, difference: 2.3, period: "mes" },
          weeklyChange: { current: 30, previous: 28, percentage: 7.1, period: "semana" }
        }
      }
      setAnalytics(mockData)
    } finally {
      setLoading(false)
    }
  }

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"]

  // Helper function to format percentage changes
  const formatChange = (percentage: number, isDifference = false) => {
    const value = isDifference ? percentage : percentage
    const sign = value > 0 ? "+" : ""
    const color = value > 0 ? "text-green-600" : "text-red-600"
    return { sign, value: value.toFixed(1), color }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Loading skeleton for metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-4 w-4 bg-muted rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="h-8 bg-muted rounded w-1/2 mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {/* Loading skeleton for charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 2 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-muted rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-muted rounded"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!analytics) return null

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Candidatos</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalCandidates.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className={formatChange(analytics.temporalComparison.candidatesChange.percentage).color}>
                {formatChange(analytics.temporalComparison.candidatesChange.percentage).sign}{formatChange(analytics.temporalComparison.candidatesChange.percentage).value}%
              </span>{" "}
              desde el {analytics.temporalComparison.candidatesChange.period} pasado
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Roles Activos</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.totalRoles}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className={formatChange(analytics.temporalComparison.rolesChange.percentage).color}>
                {formatChange(analytics.temporalComparison.rolesChange.percentage).sign}{formatChange(analytics.temporalComparison.rolesChange.percentage).value}%
              </span>{" "}
              desde la {analytics.temporalComparison.rolesChange.period} pasada
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Puntuación Promedio</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics.averageScore.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className={formatChange(analytics.temporalComparison.scoreChange.difference, true).color}>
                {formatChange(analytics.temporalComparison.scoreChange.difference, true).sign}{formatChange(analytics.temporalComparison.scoreChange.difference, true).value}
              </span>{" "}
              puntos este {analytics.temporalComparison.scoreChange.period}
            </p>
          </CardContent>
        </Card>

        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Aplicaciones Esta Semana</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analytics.temporalComparison.weeklyChange.current}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              <span className={formatChange(analytics.temporalComparison.weeklyChange.percentage).color}>
                {formatChange(analytics.temporalComparison.weeklyChange.percentage).sign}{formatChange(analytics.temporalComparison.weeklyChange.percentage).value}%
              </span>{" "}
              vs {analytics.temporalComparison.weeklyChange.period} pasada
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Score Distribution */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Distribución de Puntuaciones</CardTitle>
            <CardDescription>Rango de puntuaciones de todos los candidatos</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={analytics.scoreDistribution}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="range" 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Weekly Applications */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Aplicaciones Semanales</CardTitle>
            <CardDescription>Tendencia de aplicaciones en las últimas 5 semanas</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={analytics.weeklyApplications}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis 
                  dataKey="week" 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  className="text-xs"
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--popover))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '6px',
                    fontSize: '12px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="applications"
                  stroke="#10b981"
                  strokeWidth={3}
                  dot={{ fill: "#10b981", strokeWidth: 2, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Role Statistics and Top Candidates */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Role Statistics */}
        <Card className="xl:col-span-2 hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Estadísticas por Rol</CardTitle>
            <CardDescription>Candidatos y puntuación promedio por posición</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.roleStats.map((role, index) => (
                <div key={role.role} className="flex items-center justify-between p-4 rounded-lg bg-muted/20 hover:bg-muted/30 transition-colors">
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-sm">{role.role}</h4>
                      <Badge variant="secondary" className="text-xs">{role.candidates} candidatos</Badge>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs text-muted-foreground">Promedio:</span>
                      <span className="font-semibold text-sm">{role.avgScore.toFixed(1)}</span>
                      <Progress value={role.avgScore} className="flex-1 max-w-[120px] h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Candidates */}
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader>
            <CardTitle className="text-lg">Mejores Candidatos</CardTitle>
            <CardDescription>Top 4 candidatos por puntuación</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {analytics.topCandidates.map((candidate, index) => (
                <div key={candidate.name} className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors">
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
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{candidate.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{candidate.role}</p>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">{candidate.score}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
