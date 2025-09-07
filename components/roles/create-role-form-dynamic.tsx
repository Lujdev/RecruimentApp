'use client'

import dynamic from 'next/dynamic'

export const CreateRoleFormDynamic = dynamic(
  () => import('./create-role-form').then((mod) => mod.CreateRoleForm),
  { ssr: false }
)
