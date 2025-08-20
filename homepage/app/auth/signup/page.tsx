"use client"

import { useState } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Checkbox } from "@/components/ui/checkbox"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useLanguage } from "@/contexts/language-context"
import { Loader2, User, Video, AlertCircle, ArrowLeft } from "lucide-react"
import { cn } from "@/lib/utils"

const translations = {
  title: {
    en: "Create Your Account",
    fr: "Créez votre compte",
    ht: "Kreye kont ou"
  },
  subtitle: {
    en: "Join the Ann Pale community",
    fr: "Rejoignez la communauté Ann Pale",
    ht: "Antre nan kominote Ann Pale"
  },
  name: {
    en: "Full Name",
    fr: "Nom complet",
    ht: "Non konplè"
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
  confirmPassword: {
    en: "Confirm Password",
    fr: "Confirmer le mot de passe",
    ht: "Konfime modpas"
  },
  accountType: {
    en: "Account Type",
    fr: "Type de compte",
    ht: "Kalite kont"
  },
  fan: {
    en: "Fan",
    fr: "Fan",
    ht: "Fanatik"
  },
  fanDesc: {
    en: "Request personalized videos from creators",
    fr: "Demander des vidéos personnalisées aux créateurs",
    ht: "Mande videyo pèsonalize nan men kreyatè"
  },
  creator: {
    en: "Creator",
    fr: "Créateur",
    ht: "Kreyatè"
  },
  creatorDesc: {
    en: "Create videos and earn money",
    fr: "Créer des vidéos et gagner de l'argent",
    ht: "Kreye videyo epi fè lajan"
  },
  terms: {
    en: "I agree to the Terms of Service and Privacy Policy",
    fr: "J'accepte les conditions d'utilisation et la politique de confidentialité",
    ht: "Mwen dakò ak kondisyon sèvis ak politik konfidansyalite"
  },
  signUp: {
    en: "Sign Up",
    fr: "S'inscrire",
    ht: "Enskri"
  },
  signingUp: {
    en: "Creating account...",
    fr: "Création du compte...",
    ht: "Ap kreye kont..."
  },
  alreadyHaveAccount: {
    en: "Already have an account?",
    fr: "Vous avez déjà un compte?",
    ht: "Ou gen yon kont deja?"
  },
  signIn: {
    en: "Sign In",
    fr: "Se connecter",
    ht: "Konekte"
  },
  passwordRequirements: {
    en: "Password must be at least 8 characters",
    fr: "Le mot de passe doit contenir au moins 8 caractères",
    ht: "Modpas la dwe gen omwen 8 karaktè"
  },
  passwordMismatch: {
    en: "Passwords do not match",
    fr: "Les mots de passe ne correspondent pas",
    ht: "Modpas yo pa menm"
  },
  backToHome: {
    en: "Back to Home",
    fr: "Retour à l'accueil",
    ht: "Retounen lakay"
  }
}

export default function SignUpPage() {
  const { signup } = useAuth()
  const { language } = useLanguage()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "fan" as "fan" | "creator",
    agreeToTerms: false
  })

  const t = (key: keyof typeof translations) => {
    return translations[key]?.[language] || translations[key]?.en || key
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    // Validation
    if (formData.password.length < 8) {
      setError(t("passwordRequirements"))
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError(t("passwordMismatch"))
      return
    }

    if (!formData.agreeToTerms) {
      setError("Please agree to the terms and conditions")
      return
    }

    setIsLoading(true)

    try {
      await signup(
        formData.email,
        formData.password,
        formData.name,
        formData.accountType
      )
    } catch (err) {
      setError(err instanceof Error ? err.message : "Signup failed")
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
                <Label htmlFor="name">{t("name")}</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>

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
                <Label htmlFor="password">{t("password")}</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={isLoading}
                />
                <p className="text-xs text-gray-600 dark:text-gray-400">
                  {t("passwordRequirements")}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-3">
                <Label>{t("accountType")}</Label>
                <RadioGroup
                  value={formData.accountType}
                  onValueChange={(value: "fan" | "creator") => 
                    setFormData({ ...formData, accountType: value })
                  }
                  disabled={isLoading}
                >
                  <div className={cn(
                    "flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                    formData.accountType === "fan" 
                      ? "border-purple-600 bg-purple-50" 
                      : "border-gray-200 hover:border-gray-300"
                  )}>
                    <RadioGroupItem value="fan" id="fan" />
                    <Label htmlFor="fan" className="cursor-pointer flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <User className="w-4 h-4" />
                        <span className="font-medium">{t("fan")}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t("fanDesc")}
                      </p>
                    </Label>
                  </div>

                  <div className={cn(
                    "flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-all",
                    formData.accountType === "creator" 
                      ? "border-purple-600 bg-purple-50" 
                      : "border-gray-200 hover:border-gray-300"
                  )}>
                    <RadioGroupItem value="creator" id="creator" />
                    <Label htmlFor="creator" className="cursor-pointer flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Video className="w-4 h-4" />
                        <span className="font-medium">{t("creator")}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {t("creatorDesc")}
                      </p>
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) => 
                    setFormData({ ...formData, agreeToTerms: checked as boolean })
                  }
                  disabled={isLoading}
                />
                <Label
                  htmlFor="terms"
                  className="text-sm text-gray-600 dark:text-gray-400 cursor-pointer"
                >
                  {t("terms")}
                </Label>
              </div>
            </CardContent>

            <CardFooter className="flex flex-col space-y-4">
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700"
                disabled={isLoading || !formData.agreeToTerms}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("signingUp")}
                  </>
                ) : (
                  t("signUp")
                )}
              </Button>

              <p className="text-sm text-center text-gray-600 dark:text-gray-400">
                {t("alreadyHaveAccount")}{" "}
                <Link
                  href="/auth/login"
                  className="text-purple-600 hover:text-purple-700 font-medium"
                >
                  {t("signIn")}
                </Link>
              </p>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}