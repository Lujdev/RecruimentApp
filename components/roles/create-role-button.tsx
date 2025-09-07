"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

interface CreateRoleButtonProps {
  onClick: () => void
}

export function CreateRoleButton({ onClick }: CreateRoleButtonProps) {
  return (
    <Button onClick={onClick}>
      <Plus className="mr-2 h-4 w-4" />
      Crear Rol
    </Button>
  )
}