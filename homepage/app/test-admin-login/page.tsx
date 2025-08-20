"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Shield,
  User,
  Key,
  Smartphone,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Info,
} from "lucide-react"

export default function TestAdminLogin() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    username: "admin@annpale.com",
    password: "admin123",
    role: "admin"
  })

  const handleLogin = () => {
    // Set mock authentication data in localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem("auth_token", "mock_admin_token_" + Date.now())
      localStorage.setItem("user_role", formData.role)
      localStorage.setItem("user_id", "admin_user_1")
      localStorage.setItem("user_name", "Test Admin")
      localStorage.setItem("login_timestamp", new Date().toISOString())
    }

    // Redirect based on role
    if (formData.role === "admin") {
      router.push("/admin/mobile")
    } else if (formData.role === "creator") {
      router.push("/creator/dashboard")
    } else {
      router.push("/browse")
    }
  }

  const handleQuickLogin = (role: "admin" | "creator" | "customer") => {
    setFormData(prev => ({ ...prev, role }))
    if (typeof window !== 'undefined') {
      localStorage.setItem("auth_token", "mock_token_" + Date.now())
      localStorage.setItem("user_role", role)
      localStorage.setItem("user_id", `${role}_user_1`)
      localStorage.setItem("user_name", `Test ${role.charAt(0).toUpperCase() + role.slice(1)}`)
      localStorage.setItem("login_timestamp", new Date().toISOString())
    }

    if (role === "admin") {
      router.push("/admin/mobile")
    } else if (role === "creator") {
      router.push("/creator/dashboard")
    } else {
      router.push("/browse")
    }
  }

  const clearAuth = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem("auth_token")
      localStorage.removeItem("user_role")
      localStorage.removeItem("user_id")
      localStorage.removeItem("user_name")
      localStorage.removeItem("login_timestamp")
      
      alert("Authentication cleared!")
    }
  }

  const getAuthStatus = () => {
    if (typeof window === 'undefined') {
      return { token: false, role: 'None' }
    }
    return {
      token: !!localStorage.getItem("auth_token"),
      role: localStorage.getItem("user_role") || "None"
    }
  }

  const authStatus = getAuthStatus()

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-12 w-12 text-purple-600" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Test Admin Login</h1>
          <p className="text-gray-600 mt-2">Demo authentication for testing Phase 5.1.9 & 5.1.10</p>
        </div>

        {/* Warning Notice */}
        <Card className="border-yellow-200 bg-yellow-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-yellow-800">Demo Authentication</h3>
                <p className="text-sm text-yellow-700 mt-1">
                  This is a test login page for demonstration purposes only. 
                  It sets mock authentication data in localStorage.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Access Buttons */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Access</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => handleQuickLogin("admin")}
              className="w-full justify-start bg-red-600 hover:bg-red-700"
            >
              <Shield className="h-4 w-4 mr-3" />
              <div className="text-left">
                <div>Login as Admin</div>
                <div className="text-xs opacity-80">Access mobile admin dashboard</div>
              </div>
              <ArrowRight className="h-4 w-4 ml-auto" />
            </Button>

            <Button 
              onClick={() => handleQuickLogin("creator")}
              className="w-full justify-start bg-purple-600 hover:bg-purple-700"
            >
              <User className="h-4 w-4 mr-3" />
              <div className="text-left">
                <div>Login as Creator</div>
                <div className="text-xs opacity-80">Access creator dashboard</div>
              </div>
              <ArrowRight className="h-4 w-4 ml-auto" />
            </Button>

            <Button 
              onClick={() => handleQuickLogin("customer")}
              className="w-full justify-start bg-blue-600 hover:bg-blue-700"
            >
              <Smartphone className="h-4 w-4 mr-3" />
              <div className="text-left">
                <div>Login as Customer</div>
                <div className="text-xs opacity-80">Browse creators</div>
              </div>
              <ArrowRight className="h-4 w-4 ml-auto" />
            </Button>
          </CardContent>
        </Card>

        {/* Manual Login Form */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Manual Login</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="email"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                placeholder="admin@annpale.com"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                placeholder="Enter password"
              />
            </div>

            <div>
              <Label htmlFor="role">Role</Label>
              <Select value={formData.role} onValueChange={(value) => setFormData(prev => ({ ...prev, role: value }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="creator">Creator</SelectItem>
                  <SelectItem value="customer">Customer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button onClick={handleLogin} className="w-full">
              <Key className="h-4 w-4 mr-2" />
              Login
            </Button>
          </CardContent>
        </Card>

        {/* Demo Links */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Demo Pages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Button variant="outline" asChild>
                <a href="/phase-5-1-9-demo" target="_blank" rel="noopener noreferrer">
                  Phase 5.1.9
                </a>
              </Button>
              <Button variant="outline" asChild>
                <a href="/phase-5-1-10-demo" target="_blank" rel="noopener noreferrer">
                  Phase 5.1.10
                </a>
              </Button>
            </div>
            
            <div className="text-xs text-gray-500 space-y-1">
              <div>• Phase 5.1.9: Emergency Response & Incidents</div>
              <div>• Phase 5.1.10: Mobile Admin Experience</div>
            </div>
          </CardContent>
        </Card>

        {/* Auth Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Authentication Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Auth Token:</span>
                <Badge variant={authStatus.token ? "default" : "secondary"}>
                  {authStatus.token ? "Set" : "None"}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">User Role:</span>
                <Badge variant="outline">
                  {authStatus.role}
                </Badge>
              </div>
              <Button variant="destructive" size="sm" onClick={clearAuth} className="w-full mt-3">
                Clear Authentication
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-medium text-blue-800">How to Use</h3>
                <ol className="text-sm text-blue-700 mt-1 list-decimal list-inside space-y-1">
                  <li>Click "Login as Admin" to access mobile admin</li>
                  <li>Visit /admin/mobile to see the mobile interface</li>
                  <li>Test emergency response features</li>
                  <li>Try the demo pages for full feature overview</li>
                </ol>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}