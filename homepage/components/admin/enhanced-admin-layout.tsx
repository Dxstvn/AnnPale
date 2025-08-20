"use client"

import { AdminSidebar } from "./admin-sidebar"
import { AdminHeader } from "./admin-header"
import { SystemHealthSidebar } from "./system-health-sidebar"

interface EnhancedAdminLayoutProps {
  children: React.ReactNode
  user?: {
    name: string
    email: string
    avatar?: string
    role: string
    permissions?: string[]
  }
  showRightSidebar?: boolean
}

export function EnhancedAdminLayout({ 
  children, 
  user, 
  showRightSidebar = true 
}: EnhancedAdminLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Left Sidebar - Navigation */}
      <AdminSidebar 
        userRole={user?.role} 
        userPermissions={user?.permissions}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <AdminHeader user={user} />
        <main className={`flex-1 overflow-y-auto ${showRightSidebar ? 'mr-80' : ''}`}>
          <div className="container mx-auto px-6 py-8">
            {children}
          </div>
        </main>
      </div>

      {/* Right Sidebar - System Health & Quick Actions */}
      {showRightSidebar && (
        <SystemHealthSidebar />
      )}
    </div>
  )
}