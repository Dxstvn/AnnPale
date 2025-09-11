'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Users,
  DollarSign,
  Plus,
  Edit,
  Trash2,
  MoreVertical,
  Check,
  X,
  Loader2,
  Crown,
  Star,
  Zap,
  AlertCircle,
  Settings
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Alert, AlertDescription } from '@/components/ui/alert'

interface SubscriptionTier {
  id: string
  creator_id: string
  tier_name: string
  description: string
  price: number
  billing_period: 'monthly' | 'yearly'
  benefits: string[]
  is_active: boolean
  subscriber_count?: number
  created_at: string
  updated_at: string
}

interface TierFormData {
  tier_name: string
  description: string
  price: string
  billing_period: 'monthly' | 'yearly'
  benefits: string[]
  is_active: boolean
}

export function SubscriptionTierManager() {
  const { toast } = useToast()
  const [tiers, setTiers] = useState<SubscriptionTier[]>([])
  const [loading, setLoading] = useState(true)
  const [editingTier, setEditingTier] = useState<SubscriptionTier | null>(null)
  const [deletingTier, setDeletingTier] = useState<SubscriptionTier | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [processing, setProcessing] = useState(false)
  
  const [formData, setFormData] = useState<TierFormData>({
    tier_name: '',
    description: '',
    price: '',
    billing_period: 'monthly',
    benefits: [''],
    is_active: true
  })

  useEffect(() => {
    loadTiers()
  }, [])

  const loadTiers = async () => {
    try {
      const response = await fetch('/api/creator/tiers', {
        method: 'GET',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch tiers')
      }

      const data = await response.json()
      setTiers(data.tiers || [])
    } catch (error) {
      console.error('Error loading tiers:', error)
      toast({
        title: 'Error',
        description: 'Failed to load subscription tiers',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async () => {
    if (!formData.tier_name || !formData.price || formData.benefits.length === 0) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      })
      return
    }

    setProcessing(true)
    try {
      const endpoint = '/api/creator/tiers'
      const method = editingTier ? 'PUT' : 'POST'

      const response = await fetch(endpoint, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...(editingTier ? { id: editingTier.id } : {}),
          ...formData,
          price: parseFloat(formData.price),
          benefits: formData.benefits.filter(b => b.trim() !== '')
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save tier')
      }

      toast({
        title: 'Success',
        description: editingTier ? 'Tier updated successfully' : 'Tier created successfully',
      })

      // Reset form and reload
      setFormData({
        tier_name: '',
        description: '',
        price: '',
        billing_period: 'monthly',
        benefits: [''],
        is_active: true
      })
      setEditingTier(null)
      setIsCreating(false)
      loadTiers()
    } catch (error) {
      console.error('Error saving tier:', error)
      toast({
        title: 'Error',
        description: 'Failed to save tier',
        variant: 'destructive',
      })
    } finally {
      setProcessing(false)
    }
  }

  const handleDelete = async () => {
    if (!deletingTier) return

    setProcessing(true)
    try {
      const response = await fetch(`/api/creator/tiers?id=${deletingTier.id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete tier')
      }

      toast({
        title: 'Success',
        description: 'Tier deleted successfully',
      })

      setDeletingTier(null)
      loadTiers()
    } catch (error) {
      console.error('Error deleting tier:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete tier',
        variant: 'destructive',
      })
    } finally {
      setProcessing(false)
    }
  }

  const handleEdit = (tier: SubscriptionTier) => {
    setFormData({
      tier_name: tier.tier_name,
      description: tier.description,
      price: tier.price.toString(),
      billing_period: tier.billing_period,
      benefits: tier.benefits.length > 0 ? tier.benefits : [''],
      is_active: tier.is_active
    })
    setEditingTier(tier)
    setIsCreating(true)
  }

  const addBenefit = () => {
    setFormData(prev => ({
      ...prev,
      benefits: [...prev.benefits, '']
    }))
  }

  const removeBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }))
  }

  const updateBenefit = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.map((b, i) => i === index ? value : b)
    }))
  }

  const getTierIcon = (index: number) => {
    const icons = [Crown, Star, Zap]
    const Icon = icons[index % icons.length]
    return <Icon className="h-5 w-5" />
  }

  if (loading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Subscription Tiers</CardTitle>
            <CardDescription>Manage your subscription tiers and pricing</CardDescription>
          </div>
          <Button 
            onClick={() => {
              setIsCreating(true)
              setEditingTier(null)
              setFormData({
                tier_name: '',
                description: '',
                price: '',
                billing_period: 'monthly',
                benefits: [''],
                is_active: true
              })
            }}
            className="bg-gradient-to-r from-purple-600 to-pink-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Tier
          </Button>
        </CardHeader>
        <CardContent>
          {tiers.length === 0 ? (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No subscription tiers created yet</p>
              <p className="text-sm text-gray-500">
                Create tiers to offer different subscription levels to your fans
              </p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {tiers.map((tier, index) => (
                <Card key={tier.id} className="relative">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getTierIcon(index)}
                        <div>
                          <h3 className="font-semibold">{tier.tier_name}</h3>
                          <Badge variant={tier.is_active ? 'default' : 'secondary'}>
                            {tier.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleEdit(tier)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem 
                            className="text-red-600"
                            onClick={() => setDeletingTier(tier)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <p className="text-2xl font-bold">
                        {formatCurrency(tier.price)}
                        <span className="text-sm font-normal text-gray-500">
                          /{tier.billing_period === 'yearly' ? 'year' : 'month'}
                        </span>
                      </p>
                    </div>
                    
                    <p className="text-sm text-gray-600">{tier.description}</p>
                    
                    <div className="space-y-2">
                      {tier.benefits.map((benefit, i) => (
                        <div key={i} className="flex items-start gap-2">
                          <Check className="h-4 w-4 text-green-600 mt-0.5" />
                          <span className="text-sm">{benefit}</span>
                        </div>
                      ))}
                    </div>

                    {tier.subscriber_count !== undefined && (
                      <div className="pt-2 border-t">
                        <p className="text-sm text-gray-500">
                          <Users className="h-4 w-4 inline mr-1" />
                          {tier.subscriber_count} subscribers
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create/Edit Dialog */}
      <Dialog open={isCreating} onOpenChange={(open) => {
        if (!processing) {
          setIsCreating(open)
          if (!open) {
            setEditingTier(null)
          }
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingTier ? 'Edit Subscription Tier' : 'Create Subscription Tier'}
            </DialogTitle>
            <DialogDescription>
              Set up your subscription tier details and benefits
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tier_name">Tier Name</Label>
                <Input
                  id="tier_name"
                  placeholder="e.g., Basic, Premium, VIP"
                  value={formData.tier_name}
                  onChange={(e) => setFormData(prev => ({ ...prev, tier_name: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="9.99"
                    className="pl-8"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe what subscribers get with this tier"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Billing Period</Label>
              <div className="flex gap-4">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="billing_period"
                    value="monthly"
                    checked={formData.billing_period === 'monthly'}
                    onChange={(e) => setFormData(prev => ({ ...prev, billing_period: 'monthly' }))}
                  />
                  Monthly
                </label>
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="billing_period"
                    value="yearly"
                    checked={formData.billing_period === 'yearly'}
                    onChange={(e) => setFormData(prev => ({ ...prev, billing_period: 'yearly' }))}
                  />
                  Yearly
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label>Benefits</Label>
              <div className="space-y-2">
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      placeholder="Enter a benefit"
                      value={benefit}
                      onChange={(e) => updateBenefit(index, e.target.value)}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeBenefit(index)}
                      disabled={formData.benefits.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={addBenefit}
                  className="w-full"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Benefit
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="is_active" className="flex items-center gap-2">
                <Switch
                  id="is_active"
                  checked={formData.is_active}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
                />
                Tier is active
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsCreating(false)
                setEditingTier(null)
              }}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={processing}
              className="bg-gradient-to-r from-purple-600 to-pink-600"
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  {editingTier ? 'Update' : 'Create'} Tier
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deletingTier} onOpenChange={(open) => {
        if (!processing && !open) {
          setDeletingTier(null)
        }
      }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Subscription Tier</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{deletingTier?.tier_name}"?
            </DialogDescription>
          </DialogHeader>
          
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              This action cannot be undone. Existing subscribers will lose access to this tier.
            </AlertDescription>
          </Alert>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeletingTier(null)}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={processing}
            >
              {processing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete Tier'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}