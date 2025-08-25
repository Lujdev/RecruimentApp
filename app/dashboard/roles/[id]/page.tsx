import { RoleDetails } from "@/components/roles/role-details"
import { CandidatesList } from "@/components/candidates/candidates-list"
import { UploadCVButton } from "@/components/candidates/upload-cv-button"

interface RolePageProps {
  params: {
    id: string
  }
}

export default function RolePage({ params }: RolePageProps) {
  return (
    <div className="space-y-6">
      <RoleDetails roleId={params.id} />

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold">Candidatos</h2>
        <UploadCVButton roleId={params.id} />
      </div>

      <CandidatesList roleId={params.id} />
    </div>
  )
}
