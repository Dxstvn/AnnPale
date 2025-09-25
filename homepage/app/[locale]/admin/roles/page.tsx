"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { RoleManagement } from "@/components/admin/role-management"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function AdminRolesPage() {
  return (
    <AuthGuard requireAuth requireRole="admin">
      <AdminLayout>
        <RoleManagement />
      </AdminLayout>
    </AuthGuard>
  )
}