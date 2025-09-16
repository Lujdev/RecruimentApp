"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Loader2, Upload, FileText, X } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { apiClient } from "@/lib/api"
import { useAppContext } from "@/contexts/AppContext"

interface UploadCVFormProps {
  roleId: string
  onSuccess: () => void
}

export function UploadCVForm({ roleId, onSuccess }: UploadCVFormProps) {
  const { triggerRefresh, notifyCvUploaded } = useAppContext()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [progress, setProgress] = useState(0)

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file && file.type === "application/pdf") {
      setFile(file)
      setError("")
    } else {
      setError("Por favor, sube solo archivos PDF")
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!file) {
      setError("Por favor, selecciona un archivo PDF")
      return
    }

    setIsLoading(true)
    setError("")
    setProgress(0)

    try {
      const formDataToSend = new FormData()
      formDataToSend.append("cv", file)
      formDataToSend.append("jobRoleId", roleId)
      formDataToSend.append("candidateName", formData.name)
      formDataToSend.append("candidateEmail", formData.email)
      if (formData.phone) {
        formDataToSend.append("candidatePhone", formData.phone)
      }

      // Simulate progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      const response = await apiClient.createApplication(formDataToSend)

      clearInterval(progressInterval)
      setProgress(100)

      if (response.message) {
        // Notify context about CV upload
        notifyCvUploaded(response.application?.id || roleId)
        
        setTimeout(() => {
          onSuccess()
          // Reset form
          setFormData({ name: "", email: "", phone: "" })
          setFile(null)
        }, 500)
      }
    } catch (error: any) {
      setError(error.message || "Error de conexión. Intenta nuevamente.")
    } finally {
      setTimeout(() => {
        setIsLoading(false)
        setProgress(0)
      }, 500)
    }
  }

  const removeFile = () => {
    setFile(null)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre del Candidato</Label>
          <Input
            id="name"
            name="name"
            placeholder="Juan Pérez"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Correo Electrónico</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="juan@email.com"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Teléfono (Opcional)</Label>
        <Input
          id="phone"
          name="phone"
          type="tel"
          placeholder="+34 600 123 456"
          value={formData.phone}
          onChange={handleChange}
        />
      </div>

      <div className="space-y-2">
        <Label>Curriculum Vitae (PDF)</Label>
        {!file ? (
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            {isDragActive ? (
              <p className="text-primary">Suelta el archivo aquí...</p>
            ) : (
              <div>
                <p className="text-foreground font-medium mb-2">Arrastra y suelta tu CV aquí</p>
                <p className="text-muted-foreground text-sm">o haz clic para seleccionar un archivo PDF (máx. 10MB)</p>
              </div>
            )}
          </div>
        ) : (
          <div className="border rounded-lg p-4 bg-card">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-primary" />
                <div>
                  <p className="font-medium text-foreground">{file.name}</p>
                  <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              </div>
              <Button type="button" variant="ghost" size="sm" onClick={removeFile}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {isLoading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Procesando CV con IA...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      )}

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onSuccess} disabled={isLoading}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isLoading || !file}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Procesar CV
        </Button>
      </div>
    </form>
  )
}
