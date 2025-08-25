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
import { UploadCVForm } from "./upload-cv-form"
import { Upload } from "lucide-react"

interface UploadCVButtonProps {
  roleId: string
}

export function UploadCVButton({ roleId }: UploadCVButtonProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Upload className="mr-2 h-4 w-4" />
          Subir CV
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Subir CV de Candidato</DialogTitle>
          <DialogDescription>
            Sube el CV en formato PDF para que nuestro asistente IA lo evalúe automáticamente
          </DialogDescription>
        </DialogHeader>
        <UploadCVForm roleId={roleId} onSuccess={() => setIsOpen(false)} />
      </DialogContent>
    </Dialog>
  )
}
