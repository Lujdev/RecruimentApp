import { RegisterForm } from "@/components/auth/register-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary mb-2">RecruitAI</h1>
          <p className="text-muted-foreground">Asistente inteligente de selección de personal</p>
        </div>

        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl font-semibold">Crear Cuenta</CardTitle>
            <CardDescription>Regístrate para comenzar a usar la plataforma</CardDescription>
          </CardHeader>
          <CardContent>
            <RegisterForm />
            <div className="mt-4 text-center text-sm">
              ¿Ya tienes una cuenta?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Iniciar sesión
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
