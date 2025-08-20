"use client"

import React, { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export type UserRole = 'customer' | 'creator' | 'admin'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  avatar?: string
  createdAt: Date
  emailVerified?: boolean
}

// Cookie helper functions
const setCookie = (name: string, value: string, days: number = 7) => {
  const expires = new Date()
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000)
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Lax`
}

const getCookie = (name: string): string | null => {
  const nameEQ = name + "="
  const ca = document.cookie.split(';')
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i]
    while (c.charAt(0) === ' ') c = c.substring(1, c.length)
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length)
  }
  return null
}

const deleteCookie = (name: string) => {
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  signup: (email: string, password: string, name: string, role: UserRole) => Promise<void>
  logout: () => Promise<void>
  updateUser: (updates: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  // Check for existing session on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      // Check cookies first (for middleware), then localStorage
      const authCookie = getCookie('auth-token')
      if (authCookie) {
        try {
          const userData = JSON.parse(authCookie)
          setUser(userData)
        } catch {
          // If cookie exists but isn't JSON, check localStorage
          const storedUser = localStorage.getItem('annpale_user')
          if (storedUser) {
            const user = JSON.parse(storedUser)
            setUser(user)
          }
        }
      } else {
        // Fallback to localStorage
        const storedUser = localStorage.getItem('annpale_user')
        if (storedUser) {
          const user = JSON.parse(storedUser)
          setUser(user)
          // Set cookie for middleware
          setCookie('auth-token', JSON.stringify(user), 7)
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    try {
      // Mock authentication (replace with actual API call)
      // In production, this would be an API call to your backend
      
      console.log('Login attempt for:', email)
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Mock user data based on email
      let mockUser: User
      
      if (email.includes('creator')) {
        mockUser = {
          id: '1',
          email,
          name: 'Jean Baptiste',
          role: 'creator',
          avatar: '/api/placeholder/150/150',
          createdAt: new Date(),
          emailVerified: true
        }
      } else if (email.includes('admin')) {
        mockUser = {
          id: '2',
          email,
          name: 'Admin User',
          role: 'admin',
          createdAt: new Date(),
          emailVerified: true
        }
      } else {
        mockUser = {
          id: '3',
          email,
          name: 'John Doe',
          role: 'customer',
          avatar: '/api/placeholder/150/150',
          createdAt: new Date(),
          emailVerified: true
        }
      }
      
      console.log('Mock user created:', mockUser.role)
      
      // Store user in localStorage (mock persistence)
      localStorage.setItem('annpale_user', JSON.stringify(mockUser))
      // Also set auth_token and user_role for AuthGuard compatibility
      localStorage.setItem('auth_token', 'mock_token_' + mockUser.id)
      localStorage.setItem('user_role', mockUser.role)
      
      // Set cookies for middleware
      setCookie('auth-token', JSON.stringify(mockUser), 7)
      
      setUser(mockUser)
      
      // Add a small delay to ensure state is set before navigation
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Redirect based on role with explicit navigation
      const targetPath = mockUser.role === 'creator' 
        ? '/creator/dashboard'
        : mockUser.role === 'admin'
        ? '/admin/dashboard' 
        : '/fan/dashboard'
      
      console.log('Navigating to:', targetPath)
      
      // Try router.push first
      router.push(targetPath)
      
      // Fallback to window.location for hard navigation if cookies need to be read
      setTimeout(() => {
        window.location.href = targetPath
      }, 100)
      
    } catch (error) {
      console.error('Login failed:', error)
      throw new Error('Invalid email or password')
    }
  }

  const signup = async (email: string, password: string, name: string, role: UserRole) => {
    try {
      // Mock signup (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const newUser: User = {
        id: Date.now().toString(),
        email,
        name,
        role,
        createdAt: new Date(),
        emailVerified: false
      }
      
      localStorage.setItem('annpale_user', JSON.stringify(newUser))
      // Also set auth_token and user_role for AuthGuard compatibility
      localStorage.setItem('auth_token', 'mock_token_' + newUser.id)
      localStorage.setItem('user_role', newUser.role)
      
      // Set cookies for middleware
      setCookie('auth-token', JSON.stringify(newUser), 7)
      
      setUser(newUser)
      
      // Redirect to appropriate dashboard
      if (role === 'creator') {
        router.push('/creator/dashboard')
      } else if (role === 'admin') {
        router.push('/admin/dashboard')
      } else {
        router.push('/fan/dashboard')
      }
    } catch (error) {
      console.error('Signup failed:', error)
      throw new Error('Signup failed. Please try again.')
    }
  }

  const logout = async () => {
    try {
      // Clear all auth-related data
      localStorage.removeItem('annpale_user')
      localStorage.removeItem('auth_token')
      localStorage.removeItem('user_role')
      
      // Clear cookies
      deleteCookie('auth-token')
      
      setUser(null)
      router.push('/')
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  const updateUser = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates }
      setUser(updatedUser)
      localStorage.setItem('annpale_user', JSON.stringify(updatedUser))
    }
  }

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
    updateUser
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}