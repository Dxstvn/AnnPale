"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { UserManagement } from "@/components/admin/user-management"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function AdminUsersPage() {
  return (
    <AuthGuard requireAuth requireRole="admin">
      <AdminLayout>
        <UserManagement />
      </AdminLayout>
    </AuthGuard>
  )
}