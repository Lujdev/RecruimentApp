"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2 } from "lucide-react"
import { apiClient } from "@/lib/api"

interface CreateRoleFormProps {
  onSuccess: () => void
}

export function CreateRoleForm({ onSuccess }: CreateRoleFormProps) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    department: "",
    location: "",
    employmentType: "",
    salaryRange: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      const response = await apiClient.createRole({
        title: formData.title,
        description: formData.description,
        requirements: formData.requirements,
        department: formData.department,
        location: formData.location,
        employmentType: formData.employmentType,
        salaryRange: formData.salaryRange || undefined,
      })

      if (response.message) {
        onSuccess()
        // Reset form
        setFormData({
          title: "",
          description: "",
          requirements: "",
          department: "",
          location: "",
          employmentType: "",
          salaryRange: "",
        })
      }
    } catch (error: any) {
      setError(error.message || "Error de conexión. Intenta nuevamente.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-2">
        <Label htmlFor="title">Título del Puesto</Label>
        <Input
          id="title"
          name="title"
          placeholder="ej. Desarrollador Frontend Senior"
          value={formData.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="department">Departamento</Label>
          <Select onValueChange={(value) => handleSelectChange("department", value)} required>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona departamento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Tecnología">Tecnología</SelectItem>
              <SelectItem value="Marketing">Marketing</SelectItem>
              <SelectItem value="Ventas">Ventas</SelectItem>
              <SelectItem value="Recursos Humanos">Recursos Humanos</SelectItem>
              <SelectItem value="Finanzas">Finanzas</SelectItem>
              <SelectItem value="Operaciones">Operaciones</SelectItem>
              <SelectItem value="Diseño">Diseño</SelectItem>
              <SelectItem value="Producto">Producto</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="employmentType">Tipo de Empleo</Label>
          <Select onValueChange={(value) => handleSelectChange("employmentType", value)} required>
            <SelectTrigger>
              <SelectValue placeholder="Selecciona tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Tiempo Completo</SelectItem>
              <SelectItem value="part-time">Tiempo Parcial</SelectItem>
              <SelectItem value="contract">Contrato</SelectItem>
              <SelectItem value="internship">Prácticas</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="location">Ubicación</Label>
          <Input
            id="location"
            name="location"
            placeholder="ej. Madrid, España"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="salaryRange">Rango Salarial (Opcional)</Label>
          <Input
            id="salaryRange"
            name="salaryRange"
            placeholder="ej. 40.000€ - 55.000€"
            value={formData.salaryRange}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descripción</Label>
        <Textarea
          id="description"
          name="description"
          placeholder="Describe las responsabilidades y el perfil ideal..."
          rows={4}
          value={formData.description}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="requirements">Requisitos</Label>
        <Textarea
          id="requirements"
          name="requirements"
          placeholder="Lista los requisitos técnicos y de experiencia..."
          rows={3}
          value={formData.requirements}
          onChange={handleChange}
          required
        />
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onSuccess}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Crear Rol
        </Button>
      </div>
    </form>
  )
}
