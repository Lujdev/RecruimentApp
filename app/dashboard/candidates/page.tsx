import { AllCandidatesList } from "@/components/candidates/all-candidates-list"

export default function CandidatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Todos los Candidatos</h1>
        <p className="text-muted-foreground mt-2">Revisa y gestiona todos los candidatos de tu empresa</p>
      </div>

      <AllCandidatesList />
    </div>
  )
}
