"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { AnalyticsDashboard } from "@/components/admin/analytics-dashboard"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function AdminAnalyticsPage() {
  return (
    <AuthGuard requireAuth requireRole="admin">
      <AdminLayout>
        <AnalyticsDashboard />
      </AdminLayout>
    </AuthGuard>
  )
}