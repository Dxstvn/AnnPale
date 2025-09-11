/**
 * Notification Service
 * Handles browser notifications, sounds, and notification preferences
 * Client-side only - for server-side use notification-service-server.ts
 */

import { createClient } from '@/lib/supabase/client'

export interface NotificationPreferences {
  browserNotifications: boolean
  soundEnabled: boolean
  emailNotifications: boolean
  volume: number
}

const DEFAULT_PREFERENCES: NotificationPreferences = {
  browserNotifications: true,
  soundEnabled: true,
  emailNotifications: false,
  volume: 0.5,
}

class NotificationService {
  private supabase = createClient()
  private audioCache: Map<string, HTMLAudioElement> = new Map()
  private preferences: NotificationPreferences = DEFAULT_PREFERENCES
  
  constructor() {
    this.loadPreferences()
    this.preloadSounds()
  }
  
  /**
   * Load user notification preferences from localStorage
   */
  private loadPreferences() {
    if (typeof window === 'undefined') return
    
    const stored = localStorage.getItem('notification-preferences')
    if (stored) {
      try {
        this.preferences = { ...DEFAULT_PREFERENCES, ...JSON.parse(stored) }
      } catch (error) {
        console.error('Failed to load notification preferences:', error)
      }
    }
  }
  
  /**
   * Save notification preferences to localStorage
   */
  public savePreferences(preferences: Partial<NotificationPreferences>) {
    this.preferences = { ...this.preferences, ...preferences }
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('notification-preferences', JSON.stringify(this.preferences))
    }
  }
  
  /**
   * Get current notification preferences
   */
  public getPreferences(): NotificationPreferences {
    return this.preferences
  }
  
  /**
   * Preload notification sounds
   */
  private preloadSounds() {
    if (typeof window === 'undefined') return
    
    const sounds = [
      { name: 'notification', url: '/sounds/notification.mp3' },
      { name: 'success', url: '/sounds/success.mp3' },
      { name: 'error', url: '/sounds/error.mp3' },
    ]
    
    sounds.forEach(({ name, url }) => {
      try {
        const audio = new Audio(url)
        audio.volume = this.preferences.volume
        this.audioCache.set(name, audio)
      } catch (error) {
        console.log(`Could not preload sound ${name}:`, error)
      }
    })
  }
  
  /**
   * Play a notification sound
   */
  public async playSound(soundName: string = 'notification'): Promise<void> {
    if (!this.preferences.soundEnabled) return
    
    try {
      let audio = this.audioCache.get(soundName)
      
      if (!audio) {
        // Create a default beep sound if file doesn't exist
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(audioContext.destination)
        
        oscillator.frequency.value = 800
        oscillator.type = 'sine'
        
        gainNode.gain.setValueAtTime(this.preferences.volume, audioContext.currentTime)
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3)
        
        oscillator.start(audioContext.currentTime)
        oscillator.stop(audioContext.currentTime + 0.3)
      } else {
        audio.volume = this.preferences.volume
        await audio.play()
      }
    } catch (error) {
      console.log('Could not play notification sound:', error)
    }
  }
  
  /**
   * Request browser notification permission
   */
  public async requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
      console.log('This browser does not support notifications')
      return false
    }
    
    if (Notification.permission === 'granted') {
      return true
    }
    
    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission()
      return permission === 'granted'
    }
    
    return false
  }
  
  /**
   * Show a browser notification
   */
  public async showNotification(
    title: string,
    options?: NotificationOptions & { 
      url?: string
      soundName?: string 
    }
  ): Promise<void> {
    if (!this.preferences.browserNotifications) return
    
    const hasPermission = await this.requestPermission()
    if (!hasPermission) return
    
    // Play sound if specified
    if (options?.soundName) {
      await this.playSound(options.soundName)
    }
    
    // Create notification
    const notification = new Notification(title, {
      icon: '/icon-192x192.png',
      badge: '/icon-192x192.png',
      ...options,
    })
    
    // Handle click
    if (options?.url) {
      notification.onclick = () => {
        window.focus()
        window.location.href = options.url
        notification.close()
      }
    }
    
    // Auto-close after 10 seconds
    setTimeout(() => {
      notification.close()
    }, 10000)
  }
  
  /**
   * Show a video request notification
   */
  public async showVideoRequestNotification(request: {
    id: string
    fan_name?: string
    occasion: string
    recipient_name: string
    price: number
  }): Promise<void> {
    await this.showNotification(
      'New Video Request! 🎬',
      {
        body: `${request.fan_name || 'Someone'} requested a ${request.occasion} video for ${request.recipient_name} ($${request.price})`,
        tag: `video-request-${request.id}`,
        requireInteraction: true,
        url: `/creator/requests?highlight=${request.id}`,
        soundName: 'notification'
      }
    )
  }
  
  /**
   * Send email notification (requires backend implementation)
   */
  public async sendEmailNotification(
    userId: string,
    type: string,
    data: any
  ): Promise<void> {
    if (!this.preferences.emailNotifications) return
    
    try {
      // This would typically call a backend API endpoint
      const response = await fetch('/api/notifications/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          type,
          data,
        }),
      })
      
      if (!response.ok) {
        console.error('Failed to send email notification')
      }
    } catch (error) {
      console.error('Error sending email notification:', error)
    }
  }
}

// Export singleton instance for client-side
export const notificationService = new NotificationService()