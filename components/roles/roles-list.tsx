"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Edit, Trash2, Users } from "lucide-react"
import Link from "next/link"
import { apiClient } from "@/lib/api"
import { useToast } from "@/hooks/use-toast"
import { format, parseISO, isValid } from "date-fns"
import { es } from "date-fns/locale"
import { useAppContext } from "@/contexts/AppContext"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"

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
}

// Función auxiliar para formatear fechas de manera segura
const formatCreatedDate = (dateString: string): string => {
  try {
    console.log('Formatting date:', dateString);
    
    // Verificar si la fecha está vacía o es null/undefined
    if (!dateString) {
      console.warn('Empty date string provided');
      return 'Fecha no disponible';
    }

    // Usar parseISO directamente para fechas ISO 8601 (como 2025-08-25T18:36:47.182Z)
    const parsedDate = parseISO(dateString);
    console.log('Parsed with parseISO:', parsedDate);

    // Verificar si la fecha es válida
    if (!isValid(parsedDate)) {
      console.warn('Invalid date after parsing:', dateString, parsedDate);
      return 'Fecha inválida';
    }

    // Formatear la fecha usando date-fns con locale español
    const formattedDate = format(parsedDate, 'dd/MM/yyyy', { locale: es });
    console.log('Formatted date:', formattedDate);
    return formattedDate;
    
  } catch (error) {
    console.error('Error formatting date:', error, 'Original string:', dateString);
    return 'Error en fecha';
  }
};

interface RolesListProps {
  onEdit: (role: Role) => void
}

export function RolesList({ onEdit }: RolesListProps) {
  const { state, notifyRoleCreated } = useAppContext()
  const [roles, setRoles] = useState<Role[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [deletingRole, setDeletingRole] = useState<Role | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchRoles()
  }, [])

  // Listen for refresh triggers from context
  useEffect(() => {
    if (state.refreshTrigger > 0) {
      fetchRoles()
    }
  }, [state.refreshTrigger])

  const fetchRoles = async () => {
    try {
      setIsLoading(true)
      console.log("[DEBUG] Fetching roles...")
      const response = await apiClient.getRoles({
        page: 1,
        limit: 50
      })
      
      console.log("[DEBUG] API Response:", response)
      console.log("[DEBUG] Response.roles:", response.roles)
      console.log("[DEBUG] Response.roles length:", response.roles?.length)
      
      if (response.roles && Array.isArray(response.roles)) {
        console.log("[DEBUG] Processing roles array with", response.roles.length, "items")
        // Transform API response to match component interface
        const transformedRoles: Role[] = response.roles.map(role => {
          console.log("[DEBUG] Processing role:", role)
          return {
            id: role.id,
            title: role.title,
            description: role.description,
            requirements: role.requirements,
            candidatesCount: parseInt(role.applications_count) || 0,
            createdAt: role.created_at,
            status: role.status as "active" | "paused" | "closed",
            department: role.department,
            employmentType: role.employment_type,
            location: role.location
          }
        })
        console.log("[DEBUG] Transformed roles:", transformedRoles)
        setRoles(transformedRoles)
      } else {
        console.log("[DEBUG] No roles found in response or roles is not an array")
        setRoles([])
      }
    } catch (error) {
      console.error("[ERROR] Error fetching roles:", error)
      toast({
        title: "Error",
        description: "No se pudieron cargar los roles",
        variant: "destructive",
      })
      
      // Fallback to mock data on error
      const mockRoles: Role[] = [
        {
          id: "mock-role-1",
          title: "Desarrollador Frontend Senior",
          description: "Buscamos un desarrollador frontend con experiencia en React y TypeScript",
          requirements: "3+ años de experiencia, React, TypeScript, Next.js",
          candidatesCount: 12,
          createdAt: "2024-01-15",
          status: "active",
        },
        {
          id: "mock-role-2",
          title: "Diseñador UX/UI",
          description: "Diseñador creativo para mejorar la experiencia de usuario",
          requirements: "Portfolio sólido, Figma, experiencia en investigación UX",
          candidatesCount: 8,
          createdAt: "2024-01-10",
          status: "active",
        },
        {
          id: "mock-role-3",
          title: "Backend Developer",
          description: "Desarrollador backend para APIs y microservicios",
          requirements: "Node.js, Python, bases de datos, Docker",
          candidatesCount: 15,
          createdAt: "2024-01-05",
          status: "paused",
        },
      ]
      setRoles(mockRoles)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = (role: Role) => {
    setDeletingRole(role)
    setIsDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!deletingRole) return

    try {
      await apiClient.deleteRole(deletingRole.id)
      toast({
        title: "Rol eliminado",
        description: `El rol "${deletingRole.title}" ha sido eliminado.`,
      })
      notifyRoleCreated('deleted-role') // Notify context that a role was deleted
    } catch (error) {
      console.error("Error deleting role:", error)
      toast({
        title: "Error",
        description: "No se pudo eliminar el rol",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setDeletingRole(null)
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
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {roles.map((role) => (
          <Card key={role.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <CardTitle className="text-lg">{role.title}</CardTitle>
                {getStatusBadge(role.status)}
              </div>
              <div className="text-sm text-muted-foreground line-clamp-2" dangerouslySetInnerHTML={{ __html: role.description }} />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Users className="mr-2 h-4 w-4" />
                  {role.candidatesCount} candidatos
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Creado: {formatCreatedDate(role.createdAt)}
                  </span>
                </div>

                <div className="flex space-x-2">
                  <Link href={`/dashboard/roles/${role.id}`} className="flex-1">
                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      <Eye className="mr-2 h-4 w-4" />
                      Ver
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => onEdit(role)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive" onClick={() => handleDelete(role)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción no se puede deshacer. Esto eliminará permanentemente el rol y todas sus aplicaciones.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
