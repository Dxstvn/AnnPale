'use client'

import { useEffect } from 'react'
import { useNotificationStream } from '@/hooks/use-notification-stream'
import { useSupabaseAuth } from '@/contexts/supabase-auth-compat'

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useSupabaseAuth()

  // Initialize notification stream when authenticated
  useNotificationStream()

  return <>{children}</>
}