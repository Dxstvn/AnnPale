"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { SocialLogin } from "./social-login"
import { useToast } from "@/components/ui/use-toast"
import { useTranslations } from "next-intl"
import { Loader2, Mail, Lock, AlertCircle, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"

interface EnhancedLoginFormProps {
  className?: string
  onSuccess?: () => void
}

export function EnhancedLoginForm({ className, onSuccess }: EnhancedLoginFormProps) {
  const router = useRouter()
  const { toast } = useToast()
  const t = useTranslations('auth')
  const tCommon = useTranslations('common')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const [fieldErrors, setFieldErrors] = useState({
    email: "",
    password: "",
  })

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      return t('errors.emailRequired')
    }
    if (!emailRegex.test(email)) {
      return t('errors.invalidEmail')
    }
    return ""
  }

  const validatePassword = (password: string) => {
    if (!password) {
      return t('errors.passwordRequired')
    }
    if (password.length < 6) {
      return t('errors.passwordTooShort')
    }
    return ""
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    
    // Validate fields
    const emailError = validateEmail(formData.email)
    const passwordError = validatePassword(formData.password)
    
    setFieldErrors({
      email: emailError,
      password: passwordError,
    })

    if (emailError || passwordError) {
      return
    }

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
          title: t('login.success'),
          description: t(`login.role.${account.role}`),
        })
        
        // Store auth state
        if (formData.rememberMe) {
          localStorage.setItem("rememberMe", "true")
        }
        
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
        setError(t('login.errors.invalidCredentials'))
      }
    } catch (err) {
      setError(t('errors.generic'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={cn("w-full", className)}>
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">
          {t('login.title')}
        </h1>
        <p className="text-gray-600">
          {t('login.subtitle')}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Error Alert */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 p-4 text-sm text-red-600 bg-red-50 rounded-lg"
            >
              <AlertCircle className="h-4 w-4 flex-shrink-0" />
              <span>{error}</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Email Field with proper spacing */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            {t('login.email')}
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder={t('login.emailPlaceholder')}
              value={formData.email}
              onChange={(e) => {
                setFormData({ ...formData, email: e.target.value })
                setFieldErrors({ ...fieldErrors, email: "" })
              }}
              className={cn(
                "pl-10 h-12 py-3", // Added py-3 padding as required
                fieldErrors.email && "border-red-500 focus:ring-red-500"
              )}
              disabled={loading}
            />
          </div>
          {fieldErrors.email && (
            <p className="text-xs text-red-500 mt-1">{fieldErrors.email}</p>
          )}
        </div>

        {/* Password Field with proper spacing */}
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">
            {t('login.password')}
          </Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder={t('login.passwordPlaceholder')}
              value={formData.password}
              onChange={(e) => {
                setFormData({ ...formData, password: e.target.value })
                setFieldErrors({ ...fieldErrors, password: "" })
              }}
              className={cn(
                "pl-10 pr-10 h-12 py-3", // Added py-3 padding as required
                fieldErrors.password && "border-red-500 focus:ring-red-500"
              )}
              disabled={loading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="text-xs text-red-500 mt-1">{fieldErrors.password}</p>
          )}
        </div>

        {/* Remember Me & Forgot Password with mb-6 spacing */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Checkbox
              id="remember"
              checked={formData.rememberMe}
              onCheckedChange={(checked) => 
                setFormData({ ...formData, rememberMe: checked as boolean })
              }
              disabled={loading}
            />
            <Label htmlFor="remember" className="text-sm cursor-pointer">
              {t('login.rememberMe')}
            </Label>
          </div>
          <Link
            href="/auth/reset-password"
            className="text-sm text-purple-600 hover:text-purple-700 transition"
          >
            {t('login.forgotPassword')}
          </Link>
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full h-12 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-medium"
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {tCommon('loading')}
            </>
          ) : (
            t('login.submit')
          )}
        </Button>

        {/* Social Login with mb-6 spacing */}
        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-white text-gray-500">
              {t('login.orContinueWith')}
            </span>
          </div>
        </div>

        <SocialLogin loading={loading} />

        {/* Sign Up Link */}
        <div className="text-center text-sm">
          <span className="text-gray-600">
            {t('login.noAccount')}{" "}
          </span>
          <Link
            href="/auth/signup"
            className="text-purple-600 hover:text-purple-700 font-medium transition"
          >
            {t('login.signupLink')}
          </Link>
        </div>
      </form>

      {/* Demo Accounts Info */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 p-4 bg-purple-50 rounded-lg"
      >
        <p className="text-xs text-purple-700 font-medium mb-2">
          {t('demo.title')}:
        </p>
        <div className="space-y-1 text-xs text-purple-600">
          <p>Customer: customer@annpale.com / demo123</p>
          <p>Creator: creator@annpale.com / demo123</p>
          <p>Admin: admin@annpale.com / demo123</p>
        </div>
      </motion.div>
    </div>
  )
}