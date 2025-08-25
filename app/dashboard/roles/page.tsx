import { RolesList } from "@/components/roles/roles-list"
import { CreateRoleButton } from "@/components/roles/create-role-button"

export default function RolesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Roles</h1>
          <p className="text-muted-foreground mt-2">Crea y administra las posiciones abiertas en tu empresa</p>
        </div>
        <CreateRoleButton />
      </div>

      <RolesList />
    </div>
  )
}
