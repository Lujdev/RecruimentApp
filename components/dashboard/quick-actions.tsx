import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Upload, Users, BarChart3 } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const actions = [
    {
      title: "Crear Nuevo Rol",
      description: "Añade una nueva posición a tu empresa",
      icon: Plus,
      href: "/dashboard/roles?create=true",
      variant: "default" as const,
    },
    {
      title: "Subir CV",
      description: "Procesa un nuevo candidato",
      icon: Upload,
      href: "/dashboard/roles",
      variant: "outline" as const,
    },
    {
      title: "Ver Candidatos",
      description: "Revisa todos los candidatos",
      icon: Users,
      href: "/dashboard/candidates",
      variant: "outline" as const,
    },
    {
      title: "Reportes",
      description: "Analiza métricas de reclutamiento",
      icon: BarChart3,
      href: "/dashboard/reports",
      variant: "outline" as const,
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Acciones Rápidas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {actions.map((action, index) => (
          <Link key={index} href={action.href}>
            <Button variant={action.variant} className="w-full justify-start h-auto p-4">
              <action.icon className="mr-3 h-5 w-5" />
              <div className="text-left">
                <div className="font-medium">{action.title}</div>
                <div className="text-sm text-muted-foreground">{action.description}</div>
              </div>
            </Button>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
