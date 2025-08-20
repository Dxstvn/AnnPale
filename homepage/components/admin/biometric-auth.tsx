"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { toast } from "@/lib/utils/toast"
import {
  Fingerprint,
  Shield,
  Smartphone,
  Key,
  Lock,
  Unlock,
  Check,
  X,
  AlertTriangle,
  Info,
  Settings,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  User,
  Monitor,
  Zap,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useBiometricAuth, BiometricRegistrationOptions } from "@/hooks/use-biometric-auth"

interface BiometricAuthProps {
  className?: string
  onAuthSuccess?: (credential: any) => void
  onAuthFailure?: (error: string) => void
  onRegistrationSuccess?: (credential: any) => void
  onRegistrationFailure?: (error: string) => void
  autoPrompt?: boolean
  showManagement?: boolean
}

interface StoredCredential {
  id: string
  type: string
  transports: string[]
  createdAt: string
  userId: string
  userName: string
  lastUsed?: string
  nickname?: string
}

export function BiometricAuth({
  className,
  onAuthSuccess,
  onAuthFailure,
  onRegistrationSuccess,
  onRegistrationFailure,
  autoPrompt = false,
  showManagement = true,
}: BiometricAuthProps) {
  const biometric = useBiometricAuth()
  const [isSetupDialogOpen, setIsSetupDialogOpen] = useState(false)
  const [isManagementDialogOpen, setIsManagementDialogOpen] = useState(false)
  const [setupForm, setSetupForm] = useState({
    userId: '',
    userName: '',
    userDisplayName: '',
    nickname: '',
    authenticatorType: 'platform' as 'platform' | 'cross-platform',
  })
  const [storedCredentials, setStoredCredentials] = useState<StoredCredential[]>([])
  const [selectedCredential, setSelectedCredential] = useState<StoredCredential | null>(null)
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false)

  // Load stored credentials
  useEffect(() => {
    const loadCredentials = () => {
      try {
        const stored = localStorage.getItem('biometric-credentials')
        if (stored) {
          setStoredCredentials(JSON.parse(stored))
        }
      } catch (error) {
        console.error('Error loading credentials:', error)
      }
    }

    loadCredentials()
  }, [biometric.state.hasCredentials])

  // Auto-prompt for authentication if enabled
  useEffect(() => {
    if (autoPrompt && biometric.state.isAvailable && biometric.state.hasCredentials) {
      handleAuthenticate()
    }
  }, [autoPrompt, biometric.state.isAvailable, biometric.state.hasCredentials])

  const handleAuthenticate = async () => {
    try {
      const credential = await biometric.authenticate({
        userVerification: 'required',
        timeout: 60000,
      })

      if (credential) {
        // Update last used timestamp
        const credentialId = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)))
        updateCredentialLastUsed(credentialId)
        
        toast({
          title: "Authentication Successful",
          description: "You have been authenticated using biometrics",
        })
        
        onAuthSuccess?.(credential)
      }
    } catch (error: any) {
      toast({
        title: "Authentication Failed",
        description: biometric.state.error || "Failed to authenticate",
        variant: "destructive",
      })
      
      onAuthFailure?.(biometric.state.error || "Authentication failed")
    }
  }

  const handleRegister = async () => {
    if (!setupForm.userId || !setupForm.userName || !setupForm.userDisplayName) {
      toast({
        title: "Invalid Form",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    try {
      const options: BiometricRegistrationOptions = {
        userId: setupForm.userId,
        userName: setupForm.userName,
        userDisplayName: setupForm.userDisplayName,
        authenticatorSelection: {
          authenticatorAttachment: setupForm.authenticatorType,
          userVerification: 'required',
          requireResidentKey: false,
          residentKey: 'preferred',
        },
      }

      const credential = await biometric.register(options)

      if (credential) {
        // Add nickname to stored credential
        const credentialId = btoa(String.fromCharCode(...new Uint8Array(credential.rawId)))
        if (setupForm.nickname) {
          updateCredentialNickname(credentialId, setupForm.nickname)
        }

        toast({
          title: "Registration Successful",
          description: "Biometric authentication has been set up",
        })
        
        setIsSetupDialogOpen(false)
        setSetupForm({
          userId: '',
          userName: '',
          userDisplayName: '',
          nickname: '',
          authenticatorType: 'platform',
        })
        
        onRegistrationSuccess?.(credential)
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: biometric.state.error || "Failed to register biometric authentication",
        variant: "destructive",
      })
      
      onRegistrationFailure?.(biometric.state.error || "Registration failed")
    }
  }

  const updateCredentialLastUsed = (credentialId: string) => {
    try {
      const credentials = JSON.parse(localStorage.getItem('biometric-credentials') || '[]')
      const updated = credentials.map((cred: StoredCredential) =>
        cred.id === credentialId
          ? { ...cred, lastUsed: new Date().toISOString() }
          : cred
      )
      localStorage.setItem('biometric-credentials', JSON.stringify(updated))
      setStoredCredentials(updated)
    } catch (error) {
      console.error('Error updating credential last used:', error)
    }
  }

  const updateCredentialNickname = (credentialId: string, nickname: string) => {
    try {
      const credentials = JSON.parse(localStorage.getItem('biometric-credentials') || '[]')
      const updated = credentials.map((cred: StoredCredential) =>
        cred.id === credentialId ? { ...cred, nickname } : cred
      )
      localStorage.setItem('biometric-credentials', JSON.stringify(updated))
      setStoredCredentials(updated)
    } catch (error) {
      console.error('Error updating credential nickname:', error)
    }
  }

  const handleDeleteCredential = async (credentialId: string) => {
    const success = await biometric.deleteCredential(credentialId)
    if (success) {
      setStoredCredentials(prev => prev.filter(cred => cred.id !== credentialId))
      toast({
        title: "Credential Deleted",
        description: "Biometric credential has been removed",
      })
    }
  }

  const handleClearAll = () => {
    biometric.clear()
    setStoredCredentials([])
    toast({
      title: "All Credentials Cleared",
      description: "All biometric credentials have been removed",
    })
  }

  const getAuthenticatorIcon = (transports: string[]) => {
    if (transports.includes('internal') || transports.includes('hybrid')) {
      return <Smartphone className="h-4 w-4" />
    }
    if (transports.includes('usb') || transports.includes('nfc') || transports.includes('ble')) {
      return <Key className="h-4 w-4" />
    }
    return <Monitor className="h-4 w-4" />
  }

  const getAuthenticatorName = (transports: string[]) => {
    if (transports.includes('internal')) return 'Built-in Biometric'
    if (transports.includes('hybrid')) return 'Hybrid Transport'
    if (transports.includes('usb')) return 'USB Security Key'
    if (transports.includes('nfc')) return 'NFC Security Key'
    if (transports.includes('ble')) return 'Bluetooth Security Key'
    return 'Unknown Authenticator'
  }

  if (!biometric.state.isSupported) {
    return (
      <Alert className={className}>
        <XCircle className="h-4 w-4" />
        <AlertTitle>Biometric Authentication Not Supported</AlertTitle>
        <AlertDescription>
          Your device or browser does not support biometric authentication.
        </AlertDescription>
      </Alert>
    )
  }

  if (!biometric.state.isAvailable) {
    return (
      <Alert className={className}>
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Biometric Authentication Not Available</AlertTitle>
        <AlertDescription>
          Biometric authentication is not available on this device. Please ensure you have biometric sensors enabled.
        </AlertDescription>
      </Alert>
    )
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Status Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center space-x-2">
            <Fingerprint className="h-5 w-5 text-blue-600" />
            <span>Biometric Authentication</span>
            {biometric.state.hasCredentials && (
              <Badge variant="outline" className="ml-auto">
                <CheckCircle className="h-3 w-3 mr-1" />
                Active
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Status Information */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <Label className="text-gray-500">Support Status</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Supported</span>
                </div>
              </div>
              <div>
                <Label className="text-gray-500">Availability</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <span>Available</span>
                </div>
              </div>
              <div>
                <Label className="text-gray-500">Registered Credentials</Label>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="font-medium">{storedCredentials.length}</span>
                  <span>credential{storedCredentials.length !== 1 ? 's' : ''}</span>
                </div>
              </div>
              <div>
                <Label className="text-gray-500">Last Used</Label>
                <div className="flex items-center space-x-2 mt-1">
                  {biometric.state.lastUsed ? (
                    <span className="text-sm">
                      {biometric.state.lastUsed.toLocaleDateString()}
                    </span>
                  ) : (
                    <span className="text-gray-400">Never</span>
                  )}
                </div>
              </div>
            </div>

            {/* Supported Authenticators */}
            {biometric.state.supportedAuthenticators.length > 0 && (
              <div>
                <Label className="text-gray-500">Supported Authenticators</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {biometric.state.supportedAuthenticators.map((auth) => (
                    <Badge key={auth} variant="outline" className="text-xs">
                      {auth === 'platform' ? (
                        <>
                          <Smartphone className="h-3 w-3 mr-1" />
                          Platform
                        </>
                      ) : (
                        <>
                          <Key className="h-3 w-3 mr-1" />
                          Cross-Platform
                        </>
                      )}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Error Display */}
            {biometric.state.error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{biometric.state.error}</AlertDescription>
              </Alert>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2">
              {biometric.state.hasCredentials ? (
                <Button
                  onClick={handleAuthenticate}
                  disabled={biometric.state.isAuthenticating}
                  className="flex-1"
                >
                  {biometric.state.isAuthenticating ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <Fingerprint className="h-4 w-4 mr-2" />
                      Authenticate
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  onClick={() => setIsSetupDialogOpen(true)}
                  disabled={biometric.state.isRegistering}
                  className="flex-1"
                >
                  {biometric.state.isRegistering ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Setting up...
                    </>
                  ) : (
                    <>
                      <Plus className="h-4 w-4 mr-2" />
                      Set Up Biometric Auth
                    </>
                  )}
                </Button>
              )}

              {showManagement && (
                <Button
                  variant="outline"
                  onClick={() => setIsManagementDialogOpen(true)}
                >
                  <Settings className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Quick Access */}
            {biometric.state.hasCredentials && (
              <div className="pt-3 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Quick access enabled</span>
                  <Badge variant="outline" className="text-xs">
                    <Zap className="h-3 w-3 mr-1" />
                    Fast auth
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Recent Credentials */}
      {storedCredentials.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm">Registered Devices</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {storedCredentials.slice(0, 3).map((credential) => (
                <div key={credential.id} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center space-x-3">
                    {getAuthenticatorIcon(credential.transports)}
                    <div>
                      <div className="font-medium text-sm">
                        {credential.nickname || getAuthenticatorName(credential.transports)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {credential.userName} • {new Date(credential.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  {credential.lastUsed && (
                    <Badge variant="outline" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" />
                      Recent
                    </Badge>
                  )}
                </div>
              ))}
              {storedCredentials.length > 3 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsManagementDialogOpen(true)}
                  className="w-full"
                >
                  View all {storedCredentials.length} credentials
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Setup Dialog */}
      <Dialog open={isSetupDialogOpen} onOpenChange={setIsSetupDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set Up Biometric Authentication</DialogTitle>
            <DialogDescription>
              Configure biometric authentication for secure and convenient access.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="user-id">User ID *</Label>
              <Input
                id="user-id"
                value={setupForm.userId}
                onChange={(e) => setSetupForm(prev => ({ ...prev, userId: e.target.value }))}
                placeholder="admin@annpale.com"
              />
            </div>
            <div>
              <Label htmlFor="user-name">Username *</Label>
              <Input
                id="user-name"
                value={setupForm.userName}
                onChange={(e) => setSetupForm(prev => ({ ...prev, userName: e.target.value }))}
                placeholder="admin"
              />
            </div>
            <div>
              <Label htmlFor="display-name">Display Name *</Label>
              <Input
                id="display-name"
                value={setupForm.userDisplayName}
                onChange={(e) => setSetupForm(prev => ({ ...prev, userDisplayName: e.target.value }))}
                placeholder="Admin User"
              />
            </div>
            <div>
              <Label htmlFor="nickname">Device Nickname (Optional)</Label>
              <Input
                id="nickname"
                value={setupForm.nickname}
                onChange={(e) => setSetupForm(prev => ({ ...prev, nickname: e.target.value }))}
                placeholder="My iPhone"
              />
            </div>

            {/* Advanced Options */}
            <div>
              <Button
                variant="ghost"
                onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
                className="h-auto p-0 font-normal text-sm"
              >
                {showAdvancedOptions ? (
                  <EyeOff className="h-4 w-4 mr-1" />
                ) : (
                  <Eye className="h-4 w-4 mr-1" />
                )}
                {showAdvancedOptions ? 'Hide' : 'Show'} Advanced Options
              </Button>
            </div>

            {showAdvancedOptions && (
              <div className="space-y-3 p-3 border rounded">
                <div>
                  <Label>Authenticator Type</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <Button
                      variant={setupForm.authenticatorType === 'platform' ? 'default' : 'outline'}
                      onClick={() => setSetupForm(prev => ({ ...prev, authenticatorType: 'platform' }))}
                      className="justify-start"
                    >
                      <Smartphone className="h-4 w-4 mr-2" />
                      Platform
                    </Button>
                    <Button
                      variant={setupForm.authenticatorType === 'cross-platform' ? 'default' : 'outline'}
                      onClick={() => setSetupForm(prev => ({ ...prev, authenticatorType: 'cross-platform' }))}
                      className="justify-start"
                    >
                      <Key className="h-4 w-4 mr-2" />
                      External
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsSetupDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleRegister}
              disabled={
                !setupForm.userId ||
                !setupForm.userName ||
                !setupForm.userDisplayName ||
                biometric.state.isRegistering
              }
            >
              {biometric.state.isRegistering ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Setting up...
                </>
              ) : (
                <>
                  <Fingerprint className="h-4 w-4 mr-2" />
                  Set Up
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Management Dialog */}
      <Dialog open={isManagementDialogOpen} onOpenChange={setIsManagementDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Biometric Credentials</DialogTitle>
            <DialogDescription>
              View and manage your registered biometric credentials.
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-96">
            <div className="space-y-3">
              {storedCredentials.map((credential) => (
                <div key={credential.id} className="border rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      {getAuthenticatorIcon(credential.transports)}
                      <span className="font-medium text-sm">
                        {credential.nickname || getAuthenticatorName(credential.transports)}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteCredential(credential.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="space-y-1 text-xs text-gray-500">
                    <div>User: {credential.userName}</div>
                    <div>Created: {new Date(credential.createdAt).toLocaleDateString()}</div>
                    {credential.lastUsed && (
                      <div>Last used: {new Date(credential.lastUsed).toLocaleDateString()}</div>
                    )}
                    <div>Transport: {credential.transports.join(', ')}</div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={handleClearAll}
              disabled={storedCredentials.length === 0}
            >
              Clear All
            </Button>
            <Button
              onClick={() => setIsSetupDialogOpen(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Add New
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}