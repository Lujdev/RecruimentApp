"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, TrendingUp, Clock } from "lucide-react"

interface Stats {
  totalRoles: number
  totalCandidates: number
  averageScore: number
  pendingReviews: number
}

export function DashboardStats() {
  const [stats, setStats] = useState<Stats>({
    totalRoles: 0,
    totalCandidates: 0,
    averageScore: 0,
    pendingReviews: 0,
  })

  useEffect(() => {
    // Mock data - in production, fetch from API
    setStats({
      totalRoles: 12,
      totalCandidates: 48,
      averageScore: 7.8,
      pendingReviews: 5,
    })
  }, [])

  const statCards = [
    {
      title: "Roles Activos",
      value: stats.totalRoles,
      icon: Users,
      description: "Posiciones abiertas",
    },
    {
      title: "Candidatos",
      value: stats.totalCandidates,
      icon: FileText,
      description: "CVs procesados",
    },
    {
      title: "Puntuación Promedio",
      value: stats.averageScore.toFixed(1),
      icon: TrendingUp,
      description: "De todos los candidatos",
    },
    {
      title: "Pendientes",
      value: stats.pendingReviews,
      icon: Clock,
      description: "Revisiones pendientes",
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
