"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { FinancialOversight } from "@/components/admin/financial-oversight"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function AdminFinancePage() {
  return (
    <AuthGuard requireAuth requireRole="admin">
      <AdminLayout>
        <FinancialOversight />
      </AdminLayout>
    </AuthGuard>
  )
}