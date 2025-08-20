"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { 
  Shield, 
  Users, 
  UserCheck, 
  Settings, 
  DollarSign, 
  BarChart3,
  MessageSquare,
  FileText,
  Lock,
  Unlock,
  Plus,
  Edit,
  Trash2,
  Save,
  X
} from "lucide-react"

export interface AdminRole {
  id: string
  name: string
  level: "super_admin" | "operations_admin" | "department_manager" | "specialist"
  permissions: Permission[]
  description: string
  color: string
  icon: React.ElementType
}

export interface Permission {
  id: string
  name: string
  category: string
  description: string
  critical: boolean
}

export interface AdminUser {
  id: string
  name: string
  email: string
  role: AdminRole
  avatar?: string
  department?: string
  lastActive: string
  status: "active" | "inactive" | "suspended"
}

const permissionCategories = {
  user_management: {
    name: "User Management",
    permissions: [
      { id: "user_view", name: "View Users", description: "View user profiles and details", category: "user_management", critical: false },
      { id: "user_edit", name: "Edit Users", description: "Modify user information", category: "user_management", critical: true },
      { id: "user_delete", name: "Delete Users", description: "Remove users from platform", category: "user_management", critical: true },
      { id: "user_suspend", name: "Suspend Users", description: "Temporarily disable user accounts", category: "user_management", critical: true },
    ]
  },
  creator_management: {
    name: "Creator Management",
    permissions: [
      { id: "creator_approve", name: "Approve Creators", description: "Approve new creator applications", category: "creator_management", critical: true },
      { id: "creator_verify", name: "Verify Creators", description: "Grant verification badges", category: "creator_management", critical: true },
      { id: "creator_edit", name: "Edit Creators", description: "Modify creator profiles", category: "creator_management", critical: true },
      { id: "creator_suspend", name: "Suspend Creators", description: "Suspend creator accounts", category: "creator_management", critical: true },
    ]
  },
  content_moderation: {
    name: "Content Moderation",
    permissions: [
      { id: "content_review", name: "Review Content", description: "Review flagged content", category: "content_moderation", critical: false },
      { id: "content_remove", name: "Remove Content", description: "Delete inappropriate content", category: "content_moderation", critical: true },
      { id: "content_flag", name: "Flag Content", description: "Mark content for review", category: "content_moderation", critical: false },
    ]
  },
  financial: {
    name: "Financial Management",
    permissions: [
      { id: "payment_view", name: "View Payments", description: "View transaction history", category: "financial", critical: false },
      { id: "payment_process", name: "Process Payments", description: "Handle payouts and refunds", category: "financial", critical: true },
      { id: "financial_reports", name: "Financial Reports", description: "Access financial analytics", category: "financial", critical: true },
    ]
  },
  platform: {
    name: "Platform Settings",
    permissions: [
      { id: "settings_view", name: "View Settings", description: "View platform configuration", category: "platform", critical: false },
      { id: "settings_edit", name: "Edit Settings", description: "Modify platform settings", category: "platform", critical: true },
      { id: "analytics_full", name: "Full Analytics", description: "Access all platform metrics", category: "platform", critical: true },
    ]
  }
}

const defaultRoles: AdminRole[] = [
  {
    id: "super_admin",
    name: "Super Admin",
    level: "super_admin",
    description: "Full system access with all permissions",
    color: "bg-red-500",
    icon: Shield,
    permissions: Object.values(permissionCategories).flatMap(cat => cat.permissions)
  },
  {
    id: "operations_admin",
    name: "Operations Admin",
    level: "operations_admin",
    description: "Day-to-day platform management",
    color: "bg-blue-500",
    icon: Settings,
    permissions: [
      ...permissionCategories.user_management.permissions,
      ...permissionCategories.creator_management.permissions,
      ...permissionCategories.content_moderation.permissions,
      { id: "payment_view", name: "View Payments", description: "View transaction history", category: "financial", critical: false },
      { id: "analytics_full", name: "Full Analytics", description: "Access all platform metrics", category: "platform", critical: true },
    ]
  },
  {
    id: "content_moderator",
    name: "Content Moderator",
    level: "specialist",
    description: "Content review and moderation",
    color: "bg-yellow-500",
    icon: FileText,
    permissions: permissionCategories.content_moderation.permissions
  },
  {
    id: "support_specialist",
    name: "Support Specialist",
    level: "specialist",
    description: "Customer support and assistance",
    color: "bg-green-500",
    icon: MessageSquare,
    permissions: [
      { id: "user_view", name: "View Users", description: "View user profiles and details", category: "user_management", critical: false },
      { id: "content_review", name: "Review Content", description: "Review flagged content", category: "content_moderation", critical: false },
      { id: "payment_view", name: "View Payments", description: "View transaction history", category: "financial", critical: false },
    ]
  },
  {
    id: "finance_manager",
    name: "Finance Manager",
    level: "department_manager",
    description: "Financial oversight and management",
    color: "bg-purple-500",
    icon: DollarSign,
    permissions: permissionCategories.financial.permissions
  }
]

export function RoleManagement() {
  const [roles, setRoles] = useState<AdminRole[]>(defaultRoles)
  const [selectedRole, setSelectedRole] = useState<AdminRole | null>(null)
  const [isEditingRole, setIsEditingRole] = useState(false)
  const [isCreatingRole, setIsCreatingRole] = useState(false)

  const handlePermissionToggle = (roleId: string, permissionId: string) => {
    setRoles(prev => prev.map(role => {
      if (role.id === roleId) {
        const hasPermission = role.permissions.some(p => p.id === permissionId)
        const permission = Object.values(permissionCategories)
          .flatMap(cat => cat.permissions)
          .find(p => p.id === permissionId)
        
        if (!permission) return role

        return {
          ...role,
          permissions: hasPermission
            ? role.permissions.filter(p => p.id !== permissionId)
            : [...role.permissions, permission]
        }
      }
      return role
    }))
  }

  const getRoleBadgeColor = (level: AdminRole["level"]) => {
    switch (level) {
      case "super_admin":
        return "destructive"
      case "operations_admin":
        return "default"
      case "department_manager":
        return "secondary"
      case "specialist":
        return "outline"
      default:
        return "outline"
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Role Management</CardTitle>
              <CardDescription>Define and manage admin roles and permissions</CardDescription>
            </div>
            <Button onClick={() => setIsCreatingRole(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {roles.map((role) => {
              const Icon = role.icon
              return (
                <Card key={role.id} className="cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedRole(role)}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-lg ${role.color} text-white`}>
                          <Icon className="h-5 w-5" />
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold">{role.name}</h3>
                            <Badge variant={getRoleBadgeColor(role.level)}>
                              {role.level.replace("_", " ").toUpperCase()}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{role.description}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-muted-foreground">
                              {role.permissions.length} permissions
                            </span>
                            {role.permissions.some(p => p.critical) && (
                              <Badge variant="destructive" className="text-xs">
                                Critical Access
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-2">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setSelectedRole(role)
                            setIsEditingRole(true)
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {role.level !== "super_admin" && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setRoles(prev => prev.filter(r => r.id !== role.id))
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Dialog open={!!selectedRole && !isEditingRole} onOpenChange={(open) => !open && setSelectedRole(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Role Permissions: {selectedRole?.name}</DialogTitle>
            <DialogDescription>{selectedRole?.description}</DialogDescription>
          </DialogHeader>
          {selectedRole && (
            <div className="space-y-6">
              {Object.entries(permissionCategories).map(([key, category]) => (
                <div key={key} className="space-y-3">
                  <h4 className="font-medium text-sm">{category.name}</h4>
                  <div className="space-y-2">
                    {category.permissions.map((permission) => {
                      const hasPermission = selectedRole.permissions.some(p => p.id === permission.id)
                      const isDisabled = selectedRole.level === "super_admin"
                      
                      return (
                        <div key={permission.id} className="flex items-center justify-between p-3 rounded-lg border">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <Label htmlFor={permission.id} className="font-medium cursor-pointer">
                                {permission.name}
                              </Label>
                              {permission.critical && (
                                <Badge variant="destructive" className="text-xs">Critical</Badge>
                              )}
                            </div>
                            <p className="text-sm text-muted-foreground">{permission.description}</p>
                          </div>
                          <Switch
                            id={permission.id}
                            checked={hasPermission}
                            disabled={isDisabled}
                            onCheckedChange={() => handlePermissionToggle(selectedRole.id, permission.id)}
                          />
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setSelectedRole(null)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export function AdminUserList({ adminUsers }: { adminUsers: AdminUser[] }) {
  const [users, setUsers] = useState<AdminUser[]>(adminUsers)
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null)
  const [isEditingUser, setIsEditingUser] = useState(false)

  const handleStatusChange = (userId: string, status: AdminUser["status"]) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, status } : user
    ))
  }

  const getStatusColor = (status: AdminUser["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800"
      case "inactive":
        return "bg-gray-100 text-gray-800"
      case "suspended":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Admin Users</CardTitle>
        <CardDescription>Manage administrative users and their roles</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map((user) => {
            const Icon = user.role.icon
            return (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold">{user.name}</h3>
                      <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <div className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded-full text-xs ${user.role.color} text-white`}>
                        <Icon className="h-3 w-3" />
                        <span>{user.role.name}</span>
                      </div>
                      {user.department && (
                        <span className="text-xs text-muted-foreground">• {user.department}</span>
                      )}
                      <span className="text-xs text-muted-foreground">• Last active: {user.lastActive}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {user.status === "active" ? (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleStatusChange(user.id, "suspended")}
                    >
                      <Lock className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => handleStatusChange(user.id, "active")}
                    >
                      <Unlock className="h-4 w-4" />
                    </Button>
                  )}
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => {
                      setSelectedUser(user)
                      setIsEditingUser(true)
                    }}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}