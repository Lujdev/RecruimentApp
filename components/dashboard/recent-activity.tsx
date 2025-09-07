"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { apiClient } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface Activity {
  id: string
  type: string
  title: string
  description: string
  time: string
  score?: number
}

export function RecentActivity() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchActivity()
  }, [])

  const fetchActivity = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.getDashboardActivity({ limit: 10 })
      
      if (response.success && response.data.activities) {
        setActivities(response.data.activities)
      } else {
        setActivities([])
      }
    } catch (error) {
      console.error("Error fetching activity:", error)
      toast({
        title: "Error",
        description: "No se pudo cargar la actividad reciente",
        variant: "destructive",
      })
      
      // Fallback to mock data on error
      setActivities([
        {
          id: "1",
          type: "application",
          title: "Nueva aplicación",
          description: "María García aplicó para Desarrollador Frontend",
          time: "Hace 2 horas",
          score: 8.5,
        },
        {
          id: "2",
          type: "evaluation",
          title: "Evaluación completada",
          description: "CV de Juan Pérez procesado automáticamente",
          time: "Hace 4 horas",
          score: 7.2,
        },
        {
          id: "3",
          type: "role_created",
          title: "Nuevo rol creado",
          description: "Diseñador UX/UI Senior publicado",
          time: "Hace 1 día",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

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
        {isLoading ? (
          // Loading skeleton
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="flex items-start space-x-3">
              <div className="h-8 w-8 rounded-full bg-muted animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-muted rounded animate-pulse" />
                <div className="h-3 bg-muted rounded w-3/4 animate-pulse" />
                <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
              </div>
            </div>
          ))
        ) : activities.length > 0 ? (
          activities.map((activity) => (
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
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No hay actividad reciente</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
