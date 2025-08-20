"use client"

import { EnhancedAdminLayout } from "@/components/admin/enhanced-admin-layout"
import { AuditLogs } from "@/components/admin/audit-logs"
import { AuthGuard } from "@/components/auth/auth-guard"

export default function AdminAuditPage() {
  const mockUser = {
    name: "Sarah Chen",
    email: "sarah.chen@annpale.com", 
    avatar: "/placeholder-user.jpg",
    role: "super_admin",
    permissions: [
      "user_view", "user_edit", "user_delete", "user_suspend",
      "creator_approve", "creator_verify", "creator_edit", "creator_suspend",
      "content_review", "content_remove", "content_flag",
      "payment_view", "payment_process", "financial_reports",
      "settings_view", "settings_edit", "analytics_full"
    ]
  }

  return (
    <AuthGuard requireAuth requireRole="admin">
      <EnhancedAdminLayout user={mockUser} showRightSidebar={false}>
        <AuditLogs />
      </EnhancedAdminLayout>
    </AuthGuard>
  )
}