"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Check, X } from "lucide-react"

interface PasswordStrengthProps {
  password: string
  showRequirements?: boolean
  onStrengthChange?: (strength: number) => void
}

interface Requirement {
  regex: RegExp
  text: string
  met: boolean
}

export function PasswordStrength({ 
  password, 
  showRequirements = true,
  onStrengthChange 
}: PasswordStrengthProps) {
  const [strength, setStrength] = useState(0)
  const [requirements, setRequirements] = useState<Requirement[]>([])

  useEffect(() => {
    const reqs: Requirement[] = [
      { 
        regex: /.{8,}/, 
        text: "At least 8 characters",
        met: false 
      },
      { 
        regex: /[A-Z]/, 
        text: "One uppercase letter",
        met: false 
      },
      { 
        regex: /[a-z]/, 
        text: "One lowercase letter",
        met: false 
      },
      { 
        regex: /[0-9]/, 
        text: "One number",
        met: false 
      },
      { 
        regex: /[^A-Za-z0-9]/, 
        text: "One special character",
        met: false 
      },
    ]

    let score = 0
    reqs.forEach(req => {
      if (req.regex.test(password)) {
        req.met = true
        score++
      }
    })

    setRequirements(reqs)
    setStrength(score)
    onStrengthChange?.(score)
  }, [password, onStrengthChange])

  const getStrengthColor = () => {
    if (strength === 0) return "bg-gray-200"
    if (strength <= 2) return "bg-red-500"
    if (strength <= 3) return "bg-yellow-500"
    if (strength <= 4) return "bg-blue-500"
    return "bg-green-500"
  }

  const getStrengthText = () => {
    if (strength === 0) return ""
    if (strength <= 2) return "Weak"
    if (strength <= 3) return "Fair"
    if (strength <= 4) return "Good"
    return "Strong"
  }

  return (
    <div className="space-y-2">
      {password && (
        <>
          {/* Strength Bar */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-gray-500">Password strength</span>
              <span className={cn(
                "font-medium",
                strength <= 2 && "text-red-500",
                strength === 3 && "text-yellow-500",
                strength === 4 && "text-blue-500",
                strength === 5 && "text-green-500"
              )}>
                {getStrengthText()}
              </span>
            </div>
            <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className={cn(
                  "h-full transition-all duration-300",
                  getStrengthColor()
                )}
                style={{ width: `${(strength / 5) * 100}%` }}
              />
            </div>
          </div>

          {/* Requirements List */}
          {showRequirements && (
            <ul className="space-y-1 text-xs">
              {requirements.map((req, index) => (
                <li
                  key={index}
                  className={cn(
                    "flex items-center gap-1.5 transition-colors",
                    req.met ? "text-green-600" : "text-gray-400"
                  )}
                >
                  {req.met ? (
                    <Check className="h-3 w-3" />
                  ) : (
                    <X className="h-3 w-3" />
                  )}
                  <span>{req.text}</span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </div>
  )
}