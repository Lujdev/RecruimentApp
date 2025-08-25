import { DashboardStats } from "@/components/dashboard/dashboard-stats"
import { RecentActivity } from "@/components/dashboard/recent-activity"
import { QuickActions } from "@/components/dashboard/quick-actions"

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Panel de Control</h1>
        <p className="text-muted-foreground mt-2">Bienvenido a tu asistente inteligente de selección de personal</p>
      </div>

      <DashboardStats />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <QuickActions />
        <RecentActivity />
      </div>
    </div>
  )
}
