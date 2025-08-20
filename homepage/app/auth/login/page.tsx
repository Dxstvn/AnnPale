"use client"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useLanguage } from "@/contexts/language-context"
import { Loader2, AlertCircle, ArrowLeft } from "lucide-react"

const translations = {
  title: {
    en: "Welcome Back",
    fr: "Bon retour",
    ht: "Byenveni ankò"
  },
  subtitle: {
    en: "Sign in to your Ann Pale account",
    fr: "Connectez-vous à votre compte Ann Pale",
    ht: "Konekte nan kont Ann Pale ou"
  },
  email: {
    en: "Email Address",
    fr: "Adresse e-mail",
    ht: "Adrès imèl"
  },
  password: {
    en: "Password",
    fr: "Mot de passe",
    ht: "Modpas"
  },
  rememberMe: {
    en: "Remember me",
    fr: "Se souvenir de moi",
    ht: "Sonje m"
  },
  forgotPassword: {
    en: "Forgot password?",
    fr: "Mot de passe oublié?",
    ht: "Ou bliye modpas?"
  },
  signIn: {
    en: "Sign In",
    fr: "Se connecter",
    ht: "Konekte"
  },
  signingIn: {
    en: "Signing in...",
    fr: "Connexion...",
    ht: "Ap konekte..."
  },
  noAccount: {
    en: "Don't have an account?",
    fr: "Vous n'avez pas de compte?",
    ht: "Ou pa gen kont?"
  },
  signUp: {
    en: "Sign Up",
    fr: "S'inscrire",
    ht: "Enskri"
  },
  backToHome: {
    en: "Back to Home",
    fr: "Retour à l'accueil",
    ht: "Retounen lakay"
  },
  continueAsGuest: {
    en: "Continue as Guest",
    fr: "Continuer en tant qu'invité",
    ht: "Kontinye kòm envite"
  },
  testCredentials: {
    en: "Test Credentials",
    fr: "Identifiants de test",
    ht: "Idantifyan tès"
  },
  customerAccount: {
    en: "Customer",
    fr: "Client",
    ht: "Kliyan"
  },
  creatorAccount: {
    en: "Creator",
    fr: "Créateur",
    ht: "Kreyatè"
  },
  adminAccount: {
    en: "Admin",
    fr: "Administrateur",
    ht: "Administratè"
  }
}

export default function LoginPage() {
  const { login } = useAuth()
  const { language } = useLanguage()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false
  })

  const from = searchParams.get('from') || '/'

  const t = (key: keyof typeof translations) => {
    return translations[key]?.[language] || translations[key]?.en || key
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    try {
      await login(formData.email, formData.password)
      // The auth context handles redirection based on role
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
      setIsLoading(false)
    }
  }

  const handleTestLogin = async (role: 'customer' | 'creator' | 'admin') => {
    setError("")
    setIsLoading(true)

    const testCredentials = {
      customer: { email: 'customer@test.com', password: 'password123' },
      creator: { email: 'creator@test.com', password: 'password123' },
      admin: { email: 'admin@test.com', password: 'password123' }
    }

    const creds = testCredentials[role]
    
    try {
      console.log(`Attempting ${role} login with:`, creds.email)
      await login(creds.email, creds.password)
      // Navigation is handled in the auth context
    } catch (err) {
      console.error('Login error:', err)
      setError(err instanceof Error ? err.message : "Login failed")
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("backToHome")}
        </Link>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-6">
            <CardTitle className="text-2xl font-bold text-center">
              {t("title")}
            </CardTitle>
            <CardDescription className="text-center">
              {t("subtitle")}
            </CardDescription>
          </CardHeader>

          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">{t("email")}</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">{t("password")}</Label>
                  <Link
                    href="/auth/forgot-password"
                    className="text-sm text-purple-600 hover:text-purple-700"
                  >
                    {t("forgotPassword")}
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="remember"
                  checked={formData.rememberMe}
                  onChange={(e) => setFormData({ ...formData, rememberMe: e.target.checked })}
                  disabled={isLoading}
                  className="rounded border-gray-300 text-purple-600 focus:ring-purple-500"
                />
                <Label
                  htmlFor="remember"
                  className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
                >
                  {t("rememberMe")}
                </Label>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("signingIn")}
                  </>
                ) : (
                  t("signIn")
                )}
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-white px-2 text-gray-500">Or</span>
                </div>
              </div>

              <Link href="/browse" className="w-full">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  disabled={isLoading}
                >
                  {t("continueAsGuest")}
                </Button>
              </Link>

              <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                {t("noAccount")}{" "}
                <Link
                  href="/auth/signup"
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  {t("signUp")}
                </Link>
              </p>
            </CardFooter>
          </form>

          {/* Test Credentials Section - Only for development */}
          <div className="border-t p-4 bg-gray-50">
            <p className="text-xs text-gray-600 dark:text-gray-400 text-center mb-3">
              {t("testCredentials")} (Dev Only)
            </p>
            <div className="flex gap-2 justify-center">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleTestLogin('customer')}
                disabled={isLoading}
              >
                {t("customerAccount")}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleTestLogin('creator')}
                disabled={isLoading}
              >
                {t("creatorAccount")}
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleTestLogin('admin')}
                disabled={isLoading}
              >
                {t("adminAccount")}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}