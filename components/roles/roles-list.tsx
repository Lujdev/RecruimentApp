"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, Trash2, Users } from "lucide-react"
import Link from "next/link"

interface Role {
  id: number
  title: string
  description: string
  requirements: string
  candidatesCount: number
  createdAt: string
  status: "active" | "paused" | "closed"
}

export function RolesList() {
  const [roles, setRoles] = useState<Role[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchRoles()
  }, [])

  const fetchRoles = async () => {
    try {
      // Mock data - in production, fetch from API
      setTimeout(() => {
        setRoles([
          {
            id: 1,
            title: "Desarrollador Frontend Senior",
            description: "Buscamos un desarrollador frontend con experiencia en React y TypeScript",
            requirements: "3+ años de experiencia, React, TypeScript, Next.js",
            candidatesCount: 12,
            createdAt: "2024-01-15",
            status: "active",
          },
          {
            id: 2,
            title: "Diseñador UX/UI",
            description: "Diseñador creativo para mejorar la experiencia de usuario",
            requirements: "Portfolio sólido, Figma, experiencia en investigación UX",
            candidatesCount: 8,
            createdAt: "2024-01-10",
            status: "active",
          },
          {
            id: 3,
            title: "Backend Developer",
            description: "Desarrollador backend para APIs y microservicios",
            requirements: "Node.js, Python, bases de datos, Docker",
            candidatesCount: 15,
            createdAt: "2024-01-05",
            status: "paused",
          },
        ])
        setIsLoading(false)
      }, 1000)
    } catch (error) {
      console.error("Error fetching roles:", error)
      setIsLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const variants = {
      active: "default",
      paused: "secondary",
      closed: "destructive",
    } as const

    const labels = {
      active: "Activo",
      paused: "Pausado",
      closed: "Cerrado",
    }

    return <Badge variant={variants[status as keyof typeof variants]}>{labels[status as keyof typeof labels]}</Badge>
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="animate-pulse">
            <CardHeader>
              <div className="h-4 bg-muted rounded w-3/4"></div>
              <div className="h-3 bg-muted rounded w-1/2"></div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="h-3 bg-muted rounded"></div>
                <div className="h-3 bg-muted rounded w-5/6"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {roles.map((role) => (
        <Card key={role.id} className="hover:shadow-md transition-shadow">
          <CardHeader>
            <div className="flex items-start justify-between">
              <CardTitle className="text-lg">{role.title}</CardTitle>
              {getStatusBadge(role.status)}
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{role.description}</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center text-sm text-muted-foreground">
                <Users className="mr-2 h-4 w-4" />
                {role.candidatesCount} candidatos
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">
                  Creado: {new Date(role.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className="flex space-x-2">
                <Link href={`/dashboard/roles/${role.id}`} className="flex-1">
                  <Button variant="outline" size="sm" className="w-full bg-transparent">
                    <Eye className="mr-2 h-4 w-4" />
                    Ver
                  </Button>
                </Link>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
