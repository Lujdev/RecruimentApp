"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { CreateRoleForm } from "./create-role-form"
import { Plus } from "lucide-react"

export function CreateRoleButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Crear Rol
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Crear Nuevo Rol</DialogTitle>
          <DialogDescription>Define los detalles del puesto que quieres publicar</DialogDescription>
        </DialogHeader>
        <CreateRoleForm onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
