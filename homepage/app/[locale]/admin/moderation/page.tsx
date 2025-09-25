"use client"

import { AdminLayout } from "@/components/admin/admin-layout"
import { ContentModeration } from "@/components/admin/content-moderation"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function AdminModerationPage() {
  return (
    <AuthGuard requireAuth requireRole="admin">
      <AdminLayout>
        <ContentModeration />
      </AdminLayout>
    </AuthGuard>
  )
}