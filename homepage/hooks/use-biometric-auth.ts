"use client"

import { useState, useEffect, useCallback } from 'react'

export interface BiometricAuthOptions {
  challenge?: Uint8Array
  timeout?: number
  userVerification?: 'required' | 'preferred' | 'discouraged'
  authenticatorAttachment?: 'platform' | 'cross-platform'
}

export interface BiometricCredential {
  id: string
  rawId: ArrayBuffer
  type: 'public-key'
  response: {
    authenticatorData: ArrayBuffer
    clientDataJSON: ArrayBuffer
    signature: ArrayBuffer
    userHandle?: ArrayBuffer
  }
}

export interface BiometricRegistrationOptions {
  userId: string
  userName: string
  userDisplayName: string
  challenge?: Uint8Array
  excludeCredentials?: PublicKeyCredentialDescriptor[]
  authenticatorSelection?: {
    authenticatorAttachment?: 'platform' | 'cross-platform'
    userVerification?: 'required' | 'preferred' | 'discouraged'
    requireResidentKey?: boolean
    residentKey?: 'discouraged' | 'preferred' | 'required'
  }
  attestation?: 'none' | 'indirect' | 'direct' | 'enterprise'
}

export interface BiometricAuthState {
  isSupported: boolean
  isAvailable: boolean
  hasCredentials: boolean
  isRegistering: boolean
  isAuthenticating: boolean
  error: string | null
  lastUsed: Date | null
  supportedAuthenticators: string[]
}

export interface UseBiometricAuthReturn {
  state: BiometricAuthState
  register: (options: BiometricRegistrationOptions) => Promise<PublicKeyCredential | null>
  authenticate: (options?: BiometricAuthOptions) => Promise<BiometricCredential | null>
  checkSupport: () => Promise<boolean>
  checkAvailability: () => Promise<boolean>
  getCredentials: () => Promise<PublicKeyCredentialDescriptor[]>
  deleteCredential: (credentialId: string) => Promise<boolean>
  clear: () => void
}

// Generate random challenge
const generateChallenge = (): Uint8Array => {
  return new Uint8Array(32).map(() => Math.floor(Math.random() * 256))
}

// Convert ArrayBuffer to base64
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer)
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i])
  }
  return btoa(binary)
}

// Convert base64 to ArrayBuffer
const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }
  return bytes.buffer
}

// Convert string to ArrayBuffer
const stringToArrayBuffer = (str: string): ArrayBuffer => {
  const encoder = new TextEncoder()
  return encoder.encode(str).buffer
}

export function useBiometricAuth(): UseBiometricAuthReturn {
  const [state, setState] = useState<BiometricAuthState>({
    isSupported: false,
    isAvailable: false,
    hasCredentials: false,
    isRegistering: false,
    isAuthenticating: false,
    error: null,
    lastUsed: null,
    supportedAuthenticators: [],
  })

  // Check if WebAuthn is supported
  const checkSupport = useCallback(async (): Promise<boolean> => {
    try {
      const isSupported = !!(
        window.PublicKeyCredential &&
        typeof window.PublicKeyCredential === 'function' &&
        window.navigator.credentials &&
        typeof window.navigator.credentials.create === 'function' &&
        typeof window.navigator.credentials.get === 'function'
      )

      setState(prev => ({ ...prev, isSupported }))
      return isSupported
    } catch (error) {
      console.error('Error checking biometric support:', error)
      setState(prev => ({ ...prev, isSupported: false, error: 'Failed to check support' }))
      return false
    }
  }, [])

  // Check if biometric authentication is available
  const checkAvailability = useCallback(async (): Promise<boolean> => {
    try {
      if (!state.isSupported) {
        return false
      }

      // Check if platform authenticator is available
      const isAvailable = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
      
      // Check for conditional UI support (for better UX)
      const supportsConditionalUI = await PublicKeyCredential.isConditionalMediationAvailable?.() ?? false
      
      // Detect supported authenticator types
      const supportedAuthenticators: string[] = []
      
      if (isAvailable) {
        supportedAuthenticators.push('platform')
      }
      
      // Check for external authenticators (security keys, etc.)
      try {
        // This is a heuristic check - external authenticators are generally available if WebAuthn is supported
        supportedAuthenticators.push('cross-platform')
      } catch (error) {
        // External authenticators might not be available
      }

      setState(prev => ({ 
        ...prev, 
        isAvailable,
        supportedAuthenticators,
        error: null 
      }))
      
      return isAvailable
    } catch (error) {
      console.error('Error checking biometric availability:', error)
      setState(prev => ({ 
        ...prev, 
        isAvailable: false, 
        error: 'Failed to check availability' 
      }))
      return false
    }
  }, [state.isSupported])

  // Get existing credentials from localStorage
  const getCredentials = useCallback(async (): Promise<PublicKeyCredentialDescriptor[]> => {
    try {
      const stored = localStorage.getItem('biometric-credentials')
      if (!stored) return []
      
      const credentials = JSON.parse(stored)
      const hasCredentials = credentials.length > 0
      
      setState(prev => ({ ...prev, hasCredentials, error: null }))
      
      return credentials.map((cred: any) => ({
        id: base64ToArrayBuffer(cred.id),
        type: 'public-key' as const,
        transports: cred.transports || ['internal', 'hybrid'],
      }))
    } catch (error) {
      console.error('Error getting credentials:', error)
      setState(prev => ({ ...prev, error: 'Failed to get credentials' }))
      return []
    }
  }, [])

  // Register a new biometric credential
  const register = useCallback(async (options: BiometricRegistrationOptions): Promise<PublicKeyCredential | null> => {
    try {
      setState(prev => ({ ...prev, isRegistering: true, error: null }))

      if (!state.isSupported || !state.isAvailable) {
        throw new Error('Biometric authentication is not supported or available')
      }

      const challenge = options.challenge || generateChallenge()
      const userId = stringToArrayBuffer(options.userId)

      const publicKeyCredentialCreationOptions: PublicKeyCredentialCreationOptions = {
        challenge,
        rp: {
          name: 'Ann Pale Admin',
          id: window.location.hostname,
        },
        user: {
          id: userId,
          name: options.userName,
          displayName: options.userDisplayName,
        },
        pubKeyCredParams: [
          { alg: -7, type: 'public-key' }, // ES256
          { alg: -257, type: 'public-key' }, // RS256
        ],
        authenticatorSelection: {
          authenticatorAttachment: options.authenticatorSelection?.authenticatorAttachment || 'platform',
          userVerification: options.authenticatorSelection?.userVerification || 'required',
          requireResidentKey: options.authenticatorSelection?.requireResidentKey ?? false,
          residentKey: options.authenticatorSelection?.residentKey || 'preferred',
        },
        timeout: 60000,
        attestation: options.attestation || 'none',
        excludeCredentials: options.excludeCredentials || [],
      }

      const credential = await navigator.credentials.create({
        publicKey: publicKeyCredentialCreationOptions,
      }) as PublicKeyCredential

      if (!credential) {
        throw new Error('Failed to create credential')
      }

      // Store credential info in localStorage
      const credentialInfo = {
        id: arrayBufferToBase64(credential.rawId),
        type: credential.type,
        transports: (credential.response as any).getTransports?.() || ['internal', 'hybrid'],
        createdAt: new Date().toISOString(),
        userId: options.userId,
        userName: options.userName,
      }

      const existingCredentials = JSON.parse(localStorage.getItem('biometric-credentials') || '[]')
      existingCredentials.push(credentialInfo)
      localStorage.setItem('biometric-credentials', JSON.stringify(existingCredentials))

      setState(prev => ({ 
        ...prev, 
        isRegistering: false, 
        hasCredentials: true,
        lastUsed: new Date(),
        error: null 
      }))

      return credential
    } catch (error: any) {
      console.error('Error registering biometric credential:', error)
      
      let errorMessage = 'Failed to register biometric credential'
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Biometric registration was cancelled or denied'
      } else if (error.name === 'InvalidStateError') {
        errorMessage = 'A credential is already registered for this device'
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Biometric authentication is not supported'
      } else if (error.name === 'SecurityError') {
        errorMessage = 'Security error during biometric registration'
      } else if (error.name === 'AbortError') {
        errorMessage = 'Biometric registration was aborted'
      }

      setState(prev => ({ 
        ...prev, 
        isRegistering: false, 
        error: errorMessage 
      }))
      
      return null
    }
  }, [state.isSupported, state.isAvailable])

  // Authenticate using biometric credential
  const authenticate = useCallback(async (options: BiometricAuthOptions = {}): Promise<BiometricCredential | null> => {
    try {
      setState(prev => ({ ...prev, isAuthenticating: true, error: null }))

      if (!state.isSupported || !state.isAvailable) {
        throw new Error('Biometric authentication is not supported or available')
      }

      const credentials = await getCredentials()
      if (credentials.length === 0) {
        throw new Error('No biometric credentials found. Please register first.')
      }

      const challenge = options.challenge || generateChallenge()

      const publicKeyCredentialRequestOptions: PublicKeyCredentialRequestOptions = {
        challenge,
        allowCredentials: credentials,
        userVerification: options.userVerification || 'required',
        timeout: options.timeout || 60000,
      }

      const credential = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions,
      }) as PublicKeyCredential

      if (!credential) {
        throw new Error('Failed to authenticate with biometric credential')
      }

      const biometricCredential: BiometricCredential = {
        id: credential.id,
        rawId: credential.rawId,
        type: credential.type as 'public-key',
        response: {
          authenticatorData: (credential.response as AuthenticatorAssertionResponse).authenticatorData,
          clientDataJSON: (credential.response as AuthenticatorAssertionResponse).clientDataJSON,
          signature: (credential.response as AuthenticatorAssertionResponse).signature,
          userHandle: (credential.response as AuthenticatorAssertionResponse).userHandle || undefined,
        },
      }

      setState(prev => ({ 
        ...prev, 
        isAuthenticating: false,
        lastUsed: new Date(),
        error: null 
      }))

      return biometricCredential
    } catch (error: any) {
      console.error('Error authenticating with biometric credential:', error)
      
      let errorMessage = 'Failed to authenticate with biometric credential'
      if (error.name === 'NotAllowedError') {
        errorMessage = 'Biometric authentication was cancelled or denied'
      } else if (error.name === 'InvalidStateError') {
        errorMessage = 'No valid biometric credentials found'
      } else if (error.name === 'NotSupportedError') {
        errorMessage = 'Biometric authentication is not supported'
      } else if (error.name === 'SecurityError') {
        errorMessage = 'Security error during biometric authentication'
      } else if (error.name === 'AbortError') {
        errorMessage = 'Biometric authentication was aborted'
      } else if (error.name === 'NetworkError') {
        errorMessage = 'Network error during biometric authentication'
      }

      setState(prev => ({ 
        ...prev, 
        isAuthenticating: false, 
        error: errorMessage 
      }))
      
      return null
    }
  }, [state.isSupported, state.isAvailable, getCredentials])

  // Delete a specific credential
  const deleteCredential = useCallback(async (credentialId: string): Promise<boolean> => {
    try {
      const existingCredentials = JSON.parse(localStorage.getItem('biometric-credentials') || '[]')
      const filteredCredentials = existingCredentials.filter((cred: any) => cred.id !== credentialId)
      
      localStorage.setItem('biometric-credentials', JSON.stringify(filteredCredentials))
      
      setState(prev => ({ 
        ...prev, 
        hasCredentials: filteredCredentials.length > 0,
        error: null 
      }))
      
      return true
    } catch (error) {
      console.error('Error deleting credential:', error)
      setState(prev => ({ ...prev, error: 'Failed to delete credential' }))
      return false
    }
  }, [])

  // Clear all biometric data
  const clear = useCallback(() => {
    localStorage.removeItem('biometric-credentials')
    setState(prev => ({ 
      ...prev, 
      hasCredentials: false,
      lastUsed: null,
      error: null 
    }))
  }, [])

  // Initialize on mount
  useEffect(() => {
    const initialize = async () => {
      const supported = await checkSupport()
      if (supported) {
        await checkAvailability()
        await getCredentials()
      }
    }

    initialize()
  }, [checkSupport, checkAvailability, getCredentials])

  return {
    state,
    register,
    authenticate,
    checkSupport,
    checkAvailability,
    getCredentials,
    deleteCredential,
    clear,
  }
}

// Helper hook for quick biometric authentication
export function useQuickBiometricAuth() {
  const biometric = useBiometricAuth()
  
  const quickAuth = useCallback(async (): Promise<boolean> => {
    try {
      if (!biometric.state.isAvailable || !biometric.state.hasCredentials) {
        return false
      }
      
      const credential = await biometric.authenticate({
        userVerification: 'preferred',
        timeout: 30000,
      })
      
      return !!credential
    } catch (error) {
      console.error('Quick biometric auth failed:', error)
      return false
    }
  }, [biometric])

  return {
    ...biometric,
    quickAuth,
  }
}