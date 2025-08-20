"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { SocialLogin } from "./social-login"
import { useToast } from "@/components/ui/use-toast"
import { Loader2, Mail, Lock, AlertCircle } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface LoginFormProps {
  className?: string
  onSuccess?: () => void
}

export function LoginForm({ className, onSuccess }: LoginFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      // Check for demo accounts
      const demoAccounts = [
        { email: "customer@annpale.com", password: "demo123", role: "customer" },
        { email: "creator@annpale.com", password: "demo123", role: "creator" },
        { email: "admin@annpale.com", password: "demo123", role: "admin" },
      ]
      
      const account = demoAccounts.find(
        acc => acc.email === formData.email && acc.password === formData.password
      )
      
      if (account) {
        toast({
          title: "Welcome back!",
          description: `Logged in as ${account.role}`,
        })
        
        // Redirect based on role
        if (account.role === "admin") {
          router.push("/admin/dashboard")
        } else if (account.role === "creator") {
          router.push("/creator/dashboard")
        } else {
          router.push("/browse")
        }
        
        onSuccess?.()
      } else {
        setError("Invalid email or password")
      }
    } catch (err) {
      setError("An error occurred. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className={cn("w-full", className)}>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">Welcome Back</CardTitle>
        <CardDescription className="text-center">
          Sign in to your Ann Pale account
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 text-sm text-red-600 bg-red-50 rounded-lg">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              leftIcon={<Mail className="h-4 w-4" />}
              required
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              leftIcon={<Lock className="h-4 w-4" />}
              required
              disabled={loading}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="rememberMe"
                checked={formData.rememberMe}
                onCheckedChange={(checked) => 
                  setFormData({ ...formData, rememberMe: checked as boolean })
                }
                disabled={loading}
              />
              <Label 
                htmlFor="rememberMe" 
                className="text-sm font-normal cursor-pointer"
              >
                Remember me
              </Label>
            </div>
            
            <Link 
              href="/forgot-password" 
              className="text-sm text-purple-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            size="lg"
            variant="primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </Button>
        </form>

        <SocialLogin className="mt-6" />
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-4">
        <div className="text-sm text-center text-gray-600">
          Don't have an account?{" "}
          <Link href="/signup" className="text-purple-600 hover:underline font-medium">
            Sign up
          </Link>
        </div>
        
        {/* Demo Accounts Info */}
        <div className="w-full p-3 bg-gray-50 rounded-lg">
          <p className="text-xs font-medium text-gray-700 mb-2">Demo Accounts:</p>
          <div className="space-y-1 text-xs text-gray-600">
            <div>Customer: customer@annpale.com / demo123</div>
            <div>Creator: creator@annpale.com / demo123</div>
            <div>Admin: admin@annpale.com / demo123</div>
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}