"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Edit, Users, Calendar, Briefcase } from "lucide-react"
import { apiClient } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"

interface Role {
  id: string
  title: string
  description: string
  requirements: string
  candidatesCount: number
  createdAt: string
  status: "active" | "paused" | "closed"
  department?: string
  employmentType?: string
  location?: string
  salary?: string
}

interface RoleDetailsProps {
  roleId: string
}

export function RoleDetails({ roleId }: RoleDetailsProps) {
  const [role, setRole] = useState<Role | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    fetchRole()
  }, [roleId])

  const fetchRole = async () => {
    try {
      setIsLoading(true)
      const response = await apiClient.getRole(roleId)
      
      if (response.success) {
        // Transform API response to match component interface
        const roleData = response.data.role
        const transformedRole: Role = {
          id: roleData.id,
          title: roleData.title,
          description: roleData.description,
          requirements: roleData.requirements,
          candidatesCount: roleData.candidatesCount || 0,
          createdAt: roleData.createdAt,
          status: roleData.status as "active" | "paused" | "closed",
          department: roleData.department,
          employmentType: roleData.employmentType,
          location: roleData.location,
          salary: roleData.salaryRange
        }
        setRole(transformedRole)
      }
    } catch (error) {
      console.error("Error fetching role:", error)
      toast({
        title: "Error",
        description: "No se pudo cargar el rol",
        variant: "destructive",
      })
      
      // Fallback to mock data on error
      const mockRole: Role = {
        id: roleId,
        title: "Desarrollador Frontend Senior",
        description:
          "Buscamos un desarrollador frontend experimentado para unirse a nuestro equipo de desarrollo. El candidato ideal tendrá experiencia sólida en React, TypeScript y Next.js, y será responsable de crear interfaces de usuario excepcionales y experiencias web modernas.",
        requirements:
          "• 3+ años de experiencia en desarrollo frontend\n• Dominio de React y TypeScript\n• Experiencia con Next.js y frameworks modernos\n• Conocimiento de CSS moderno y preprocesadores\n• Experiencia con herramientas de testing\n• Conocimiento de Git y metodologías ágiles",
        candidatesCount: 12,
        createdAt: "2024-01-15",
        status: "active",
      }
      setRole(mockRole)
    } finally {
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
      <Card className="animate-pulse">
        <CardHeader>
          <div className="h-6 bg-muted rounded w-1/2"></div>
          <div className="h-4 bg-muted rounded w-1/4"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-5/6"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!role) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">Rol no encontrado</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <CardTitle className="text-2xl">{role.title}</CardTitle>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground">
              <div className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" />
                Creado: {new Date(role.createdAt).toLocaleDateString()}
              </div>
              <div className="flex items-center">
                <Users className="mr-1 h-4 w-4" />
                {role.candidatesCount} candidatos
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {getStatusBadge(role.status)}
            <Button variant="outline" size="sm">
              <Edit className="mr-2 h-4 w-4" />
              Editar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-semibold mb-2 flex items-center">
            <Briefcase className="mr-2 h-4 w-4" />
            Descripción del Puesto
          </h3>
          <p className="text-muted-foreground leading-relaxed">{role.description}</p>
        </div>

        <Separator />

        <div>
          <h3 className="font-semibold mb-2">Requisitos</h3>
          <div className="text-muted-foreground whitespace-pre-line leading-relaxed">{role.requirements}</div>
        </div>
      </CardContent>
    </Card>
  )
}
