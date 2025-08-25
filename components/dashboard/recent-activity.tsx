"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface Activity {
  id: number
  type: "application" | "role_created" | "evaluation"
  title: string
  description: string
  time: string
  score?: number
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])

  useEffect(() => {
    // Mock data - in production, fetch from API
    setActivities([
      {
        id: 1,
        type: "application",
        title: "Nueva aplicación",
        description: "María García aplicó para Desarrollador Frontend",
        time: "Hace 2 horas",
        score: 8.5,
      },
      {
        id: 2,
        type: "evaluation",
        title: "Evaluación completada",
        description: "CV de Juan Pérez procesado automáticamente",
        time: "Hace 4 horas",
        score: 7.2,
      },
      {
        id: 3,
        type: "role_created",
        title: "Nuevo rol creado",
        description: "Diseñador UX/UI Senior publicado",
        time: "Hace 1 día",
      },
      {
        id: 4,
        type: "application",
        title: "Nueva aplicación",
        description: "Carlos López aplicó para Backend Developer",
        time: "Hace 2 días",
        score: 9.1,
      },
    ])
  }, [])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "application":
        return "📄"
      case "role_created":
        return "➕"
      case "evaluation":
        return "🤖"
      default:
        return "📋"
    }
  }

  const getScoreBadge = (score?: number) => {
    if (!score) return null

    const variant = score >= 8 ? "default" : score >= 6 ? "secondary" : "destructive"
    return (
      <Badge variant={variant} className="ml-auto">
        {score.toFixed(1)}
      </Badge>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Actividad Reciente</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="text-xs">{getActivityIcon(activity.type)}</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-foreground">{activity.title}</p>
                {getScoreBadge(activity.score)}
              </div>
              <p className="text-sm text-muted-foreground">{activity.description}</p>
              <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
