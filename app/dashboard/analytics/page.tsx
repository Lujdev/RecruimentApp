import { AnalyticsDashboard } from "@/components/dashboard/analytics-dashboard"

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Análisis y Métricas</h1>
        <p className="text-muted-foreground">Visualiza el rendimiento de tu proceso de reclutamiento</p>
      </div>

      <AnalyticsDashboard />
    </div>
  )
}
