"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  ArrowRight,
  Brain,
  BarChart3,
  Users,
  GitCompare,
  Star,
  CheckCircle,
  Zap,
  Target,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  const smoothScrollTo = (elementId: string) => {
    const element = document.getElementById(elementId)
    if (element) {
      const targetPosition = element.offsetTop - 80 // Offset para el header fijo
      const startPosition = window.pageYOffset
      const distance = targetPosition - startPosition
      const duration = 1000 // 1 segundo de duración
      let start: number | null = null

      function animation(currentTime: number) {
        if (start === null) start = currentTime
        const timeElapsed = currentTime - start
        const run = easeInOutQuad(timeElapsed, startPosition, distance, duration)
        window.scrollTo(0, run)
        if (timeElapsed < duration) requestAnimationFrame(animation)
      }

      // Función de easing para suavizar la animación
      function easeInOutQuad(t: number, b: number, c: number, d: number) {
        t /= d / 2
        if (t < 1) return (c / 2) * t * t + b
        t--
        return (-c / 2) * (t * (t - 2) - 1) + b
      }

      requestAnimationFrame(animation)
    }
  }

  const scrollToTop = () => {
    const startPosition = window.pageYOffset
    const duration = 800 // Duración más corta para ir al inicio
    let start: number | null = null

    function animation(currentTime: number) {
      if (start === null) start = currentTime
      const timeElapsed = currentTime - start
      const run = easeInOutQuad(timeElapsed, startPosition, -startPosition, duration)
      window.scrollTo(0, run)
      if (timeElapsed < duration) requestAnimationFrame(animation)
    }

    function easeInOutQuad(t: number, b: number, c: number, d: number) {
      t /= d / 2
      if (t < 1) return (c / 2) * t * t + b
      t--
      return (-c / 2) * (t * (t - 2) - 1) + b
    }

    requestAnimationFrame(animation)
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <button onClick={scrollToTop} className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Brain className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-foreground">RecruitAI</span>
            </button>

            <nav className="hidden md:flex items-center space-x-10">
              <button
                onClick={() => smoothScrollTo("features")}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Funcionalidades
              </button>
              <button
                onClick={() => smoothScrollTo("analytics")}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Analytics
              </button>
              <button
                onClick={() => smoothScrollTo("testimonials")}
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              >
                Testimonios
              </button>
            </nav>

            <div className="flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link href="/auth/login">Iniciar Sesión</Link>
              </Button>
              <Button asChild>
                <Link href="/auth/register">Comenzar Gratis</Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-secondary/5" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="max-w-4xl mx-auto text-center">
            <Badge variant="secondary" className="mb-6">
              <Zap className="h-3 w-3 mr-1" />
              Reclutamiento Inteligente con IA
            </Badge>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance mb-6">
              Encuentra el <span className="text-primary">candidato perfecto</span> 4x más rápido
            </h1>

            <p className="text-xl text-muted-foreground text-balance mb-8 max-w-2xl mx-auto">
              Plataforma de reclutamiento inteligente que evalúa automáticamente candidatos, genera analytics detallados
              y optimiza tu proceso de selección.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button size="lg" asChild>
                <Link href="/auth/register">
                  Comenzar Gratis
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/auth/login">Ver Demo</Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-2xl mx-auto">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">4x</div>
                <div className="text-sm text-muted-foreground">más rápido</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">95%</div>
                <div className="text-sm text-muted-foreground">precisión en evaluación</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">100+</div>
                <div className="text-sm text-muted-foreground">empresas confían en nosotros</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-4">
              Todo lo que necesitas para reclutar mejor
            </h2>
            <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
              Herramientas inteligentes que transforman tu proceso de reclutamiento
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Evaluación Automática</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  IA avanzada evalúa candidatos automáticamente con puntuación 0-100 y análisis detallado de fortalezas
                  y debilidades.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <BarChart3 className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-lg">Analytics Avanzados</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Dashboard completo con métricas clave, gráficos interactivos y tendencias para optimizar tu proceso.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="text-lg">Gestión de Candidatos</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Lista completa con filtros avanzados, detalles de evaluación y acciones directas como contacto por
                  email.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm hover:shadow-md transition-shadow">
              <CardHeader className="pb-4">
                <div className="h-12 w-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                  <GitCompare className="h-6 w-6 text-secondary" />
                </div>
                <CardTitle className="text-lg">Comparación Inteligente</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Compara hasta 4 candidatos lado a lado con métricas detalladas para tomar decisiones informadas.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <Badge variant="outline" className="mb-4">
                <Target className="h-3 w-3 mr-1" />
                Resultados Comprobados
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-6">Recluta con precisión y velocidad</h2>
              <p className="text-lg text-muted-foreground mb-8">
                Nuestra IA analiza CVs, evalúa competencias y genera insights que te ayudan a identificar el talento
                ideal para cada posición.
              </p>

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Evaluación objetiva</div>
                    <div className="text-sm text-muted-foreground">Elimina sesgos con análisis basado en datos</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Ahorro de tiempo</div>
                    <div className="text-sm text-muted-foreground">Reduce el tiempo de screening en un 75%</div>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-medium">Decisiones informadas</div>
                    <div className="text-sm text-muted-foreground">Analytics detallados para cada candidato</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/10 to-secondary/10 p-8">
                <div className="h-full w-full rounded-xl bg-card border shadow-sm p-6 flex flex-col justify-center">
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-primary mb-2">95%</div>
                    <div className="text-sm text-muted-foreground">Precisión en evaluación</div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Análisis de CV</span>
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="w-[95%] h-full bg-primary rounded-full" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Evaluación de skills</span>
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="w-[88%] h-full bg-secondary rounded-full" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Match con rol</span>
                      <div className="w-20 h-2 bg-muted rounded-full overflow-hidden">
                        <div className="w-[92%] h-full bg-primary rounded-full" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Analytics Preview */}
      <section id="analytics" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">
              <TrendingUp className="h-3 w-3 mr-1" />
              Analytics Inteligentes
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-4">Toma decisiones basadas en datos</h2>
            <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
              Dashboard completo con métricas que importan para optimizar tu proceso de reclutamiento
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary">1,247</CardTitle>
                <CardDescription>Candidatos evaluados</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-secondary">23</CardTitle>
                <CardDescription>Roles activos</CardDescription>
              </CardHeader>
            </Card>
            <Card className="text-center">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-primary">87.5</CardTitle>
                <CardDescription>Puntuación promedio</CardDescription>
              </CardHeader>
            </Card>
          </div>

          <div className="text-center">
            <Button size="lg" asChild>
              <Link href="/auth/register">
                Ver Dashboard Completo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-4">Empresas que confían en RecruitAI</h2>
            <p className="text-xl text-muted-foreground text-balance max-w-2xl mx-auto">
              Descubre cómo hemos transformado el proceso de reclutamiento
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                  ))}
                </div>
                <CardDescription>
                  "RecruitAI ha revolucionado nuestro proceso. La evaluación automática nos ahorra horas de trabajo y
                  los candidatos seleccionados son de excelente calidad."
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="font-medium">María González</div>
                <div className="text-sm text-muted-foreground">HR Manager, TechCorp</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                  ))}
                </div>
                <CardDescription>
                  "Los analytics son increíbles. Podemos ver tendencias, comparar candidatos y tomar decisiones mucho
                  más informadas. Altamente recomendado."
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="font-medium">Carlos Ruiz</div>
                <div className="text-sm text-muted-foreground">Talent Acquisition Lead, StartupXYZ</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-sm">
              <CardHeader>
                <div className="flex items-center space-x-1 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-secondary text-secondary" />
                  ))}
                </div>
                <CardDescription>
                  "La función de comparación de candidatos es fantástica. Nos permite evaluar objetivamente y elegir el
                  mejor talento para cada posición."
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="font-medium">Ana Martínez</div>
                <div className="text-sm text-muted-foreground">Recruiting Director, InnovaCorp</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-balance mb-4">
            ¿Listo para revolucionar tu reclutamiento?
          </h2>
          <p className="text-xl opacity-90 text-balance mb-8 max-w-2xl mx-auto">
            Únete a cientos de empresas que ya están reclutando más rápido y mejor con RecruitAI
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" asChild>
              <Link href="/auth/register">
                Comenzar Gratis
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="bg-transparent border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
              asChild
            >
              <Link href="/auth/login">Iniciar Sesión</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-muted/30 py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <button onClick={scrollToTop} className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Brain className="h-5 w-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold">RecruitAI</span>
              </button>
              <p className="text-sm text-muted-foreground">
                Plataforma de reclutamiento inteligente que transforma la manera de encontrar talento.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Producto</h3>
              <div className="space-y-2 text-sm">
                <button
                  onClick={() => smoothScrollTo("features")}
                  className="text-muted-foreground hover:text-foreground block cursor-pointer"
                >
                  Funcionalidades
                </button>
                <button
                  onClick={() => smoothScrollTo("analytics")}
                  className="text-muted-foreground hover:text-foreground block cursor-pointer"
                >
                  Analytics
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Empresa</h3>
              <div className="space-y-2 text-sm">
                <button
                  onClick={() => smoothScrollTo("testimonials")}
                  className="text-muted-foreground hover:text-foreground block cursor-pointer"
                >
                  Testimonios
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Soporte</h3>
              <div className="space-y-2 text-sm">
                <Link href="/auth/login" className="text-muted-foreground hover:text-foreground block">
                  Iniciar Sesión
                </Link>
                <Link href="/auth/register" className="text-muted-foreground hover:text-foreground block">
                  Registrarse
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2025 RecruitAI. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
