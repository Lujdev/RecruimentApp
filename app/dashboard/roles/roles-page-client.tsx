'use client'

import { useState } from "react"
import { RolesList } from "@/components/roles/roles-list"
import { CreateRoleButton } from "@/components/roles/create-role-button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { CreateRoleForm } from "@/components/roles/create-role-form"

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

export default function RolesPageClient() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingRole, setEditingRole] = useState<Role | null>(null)

  const handleOpenModal = () => {
    setEditingRole(null)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setEditingRole(null)
  }

  const handleEdit = (role: Role) => {
    setEditingRole(role)
    setIsModalOpen(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Gestión de Roles</h1>
          <p className="text-muted-foreground mt-2">Crea y administra las posiciones abiertas en tu empresa</p>
        </div>
        <CreateRoleButton onClick={handleOpenModal} />
      </div>

      <RolesList onEdit={handleEdit} />

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingRole ? "Editar Rol" : "Crear Nuevo Rol"}</DialogTitle>
            <DialogDescription>
              {editingRole ? "Actualiza los detalles de este rol." : "Define los detalles del puesto que quieres publicar"}
            </DialogDescription>
          </DialogHeader>
          <CreateRoleForm onSuccess={handleCloseModal} role={editingRole} />
        </DialogContent>
      </Dialog>
    </div>
  )
}
