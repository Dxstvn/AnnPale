"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast"
import { Plus, Trash2, Edit2, X, DollarSign, Users, Check } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

interface SubscriptionTier {
  id?: string
  creator_id?: string
  tier_name: string
  price: number
  description?: string
  benefits: string[]
  is_active: boolean
  created_at?: string
  updated_at?: string
}

export default function SubscriptionTierManager() {
  const { toast } = useToast()
  const [tiers, setTiers] = React.useState<SubscriptionTier[]>([])
  const [loading, setLoading] = React.useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = React.useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = React.useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false)
  const [selectedTier, setSelectedTier] = React.useState<SubscriptionTier | null>(null)
  const [formData, setFormData] = React.useState<SubscriptionTier>({
    tier_name: "",
    price: 10,
    description: "",
    benefits: [],
    is_active: true
  })
  const [newBenefit, setNewBenefit] = React.useState("")
  const [validationErrors, setValidationErrors] = React.useState<Record<string, string>>({})
  
  const supabase = createClient()

  // Load tiers on mount
  React.useEffect(() => {
    loadTiers()
  }, [])

  const loadTiers = async () => {
    try {
      setLoading(true)
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to manage subscription tiers",
          variant: "destructive"
        })
        return
      }

      const { data, error } = await supabase
        .from('creator_subscription_tiers')
        .select('*')
        .eq('creator_id', user.id)
        .order('price', { ascending: true })

      if (error) throw error
      setTiers(data || [])
    } catch (error) {
      console.error('Error loading tiers:', error)
      toast({
        title: "Error",
        description: "Failed to load subscription tiers",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {}
    
    if (!formData.tier_name.trim()) {
      errors.tier_name = "Tier name is required"
    }
    
    if (formData.price < 1) {
      errors.price = "Price must be at least $1"
    }
    
    if (formData.price > 999) {
      errors.price = "Price cannot exceed $999"
    }
    
    // Check for duplicate tier names
    const isDuplicate = tiers.some(tier => 
      tier.tier_name.toLowerCase() === formData.tier_name.toLowerCase() &&
      tier.id !== selectedTier?.id
    )
    
    if (isDuplicate) {
      errors.tier_name = "Tier name already exists"
    }
    
    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleAddTier = async () => {
    if (!validateForm()) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error("Not authenticated")

      const { error } = await supabase
        .from('creator_subscription_tiers')
        .insert({
          creator_id: user.id,
          tier_name: formData.tier_name,
          price: formData.price,
          description: formData.description,
          benefits: formData.benefits,
          is_active: formData.is_active
        })

      if (error) throw error

      toast({
        title: "Success",
        description: "Subscription tier created successfully"
      })
      
      setIsAddDialogOpen(false)
      resetForm()
      loadTiers()
    } catch (error) {
      console.error('Error creating tier:', error)
      toast({
        title: "Error",
        description: "Failed to create subscription tier",
        variant: "destructive"
      })
    }
  }

  const handleEditTier = async () => {
    if (!validateForm() || !selectedTier?.id) return

    try {
      const { error } = await supabase
        .from('creator_subscription_tiers')
        .update({
          tier_name: formData.tier_name,
          price: formData.price,
          description: formData.description,
          benefits: formData.benefits,
          is_active: formData.is_active
        })
        .eq('id', selectedTier.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Subscription tier updated successfully"
      })
      
      setIsEditDialogOpen(false)
      resetForm()
      loadTiers()
    } catch (error) {
      console.error('Error updating tier:', error)
      toast({
        title: "Error",
        description: "Failed to update subscription tier",
        variant: "destructive"
      })
    }
  }

  const handleDeleteTier = async () => {
    if (!selectedTier?.id) return

    try {
      const { error } = await supabase
        .from('creator_subscription_tiers')
        .delete()
        .eq('id', selectedTier.id)

      if (error) throw error

      toast({
        title: "Success",
        description: "Subscription tier deleted successfully"
      })
      
      setIsDeleteDialogOpen(false)
      setSelectedTier(null)
      loadTiers()
    } catch (error) {
      console.error('Error deleting tier:', error)
      toast({
        title: "Error",
        description: "Failed to delete subscription tier",
        variant: "destructive"
      })
    }
  }

  const handleToggleTier = async (tier: SubscriptionTier) => {
    try {
      const { error } = await supabase
        .from('creator_subscription_tiers')
        .update({ is_active: !tier.is_active })
        .eq('id', tier.id)

      if (error) throw error

      toast({
        title: "Success",
        description: `Tier ${tier.is_active ? 'deactivated' : 'activated'} successfully`
      })
      
      loadTiers()
    } catch (error) {
      console.error('Error toggling tier:', error)
      toast({
        title: "Error",
        description: "Failed to update tier status",
        variant: "destructive"
      })
    }
  }

  const resetForm = () => {
    setFormData({
      tier_name: "",
      price: 10,
      description: "",
      benefits: [],
      is_active: true
    })
    setNewBenefit("")
    setValidationErrors({})
    setSelectedTier(null)
  }

  const openEditDialog = (tier: SubscriptionTier) => {
    setSelectedTier(tier)
    setFormData({
      tier_name: tier.tier_name,
      price: tier.price,
      description: tier.description || "",
      benefits: tier.benefits || [],
      is_active: tier.is_active
    })
    setIsEditDialogOpen(true)
  }

  const openDeleteDialog = (tier: SubscriptionTier) => {
    setSelectedTier(tier)
    setIsDeleteDialogOpen(true)
  }

  const addBenefit = () => {
    if (newBenefit.trim()) {
      setFormData(prev => ({
        ...prev,
        benefits: [...prev.benefits, newBenefit.trim()]
      }))
      setNewBenefit("")
    }
  }

  const removeBenefit = (index: number) => {
    setFormData(prev => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== index)
    }))
  }

  const formatTierCardId = (name: string) => {
    return `tier-card-${name.toLowerCase().replace(/\s+/g, '-')}`
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading subscription tiers...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Subscription Tiers</h2>
          <p className="text-gray-600">Manage your subscription tiers and pricing</p>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
          data-testid="add-tier-button"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Tier
        </Button>
      </div>

      {/* Tiers Grid */}
      {tiers.length === 0 ? (
        <Card className="p-8">
          <div className="text-center">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-lg font-semibold mb-2">No subscription tiers yet</h3>
            <p className="text-gray-600 mb-4">Create your first subscription tier to start offering exclusive content</p>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              variant="outline"
              data-testid="add-tier-button"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create Your First Tier
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tiers.map((tier) => (
            <Card
              key={tier.id}
              data-testid={formatTierCardId(tier.tier_name)}
              className={`relative ${!tier.is_active ? 'opacity-60' : ''}`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{tier.tier_name}</CardTitle>
                    <div className="flex items-center gap-2 mt-2">
                      <span 
                        className="text-2xl font-bold text-purple-600"
                        data-testid={`tier-price-${tier.tier_name.toLowerCase().replace(/\s+/g, '-')}`}
                      >
                        ${tier.price}
                      </span>
                      <span className="text-gray-600">/month</span>
                    </div>
                  </div>
                  <Badge
                    variant={tier.is_active ? "default" : "secondary"}
                    data-testid={`tier-status-${tier.tier_name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {tier.is_active ? "Active" : "Inactive"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {tier.description && (
                  <p className="text-sm text-gray-600">{tier.description}</p>
                )}
                
                {tier.benefits && tier.benefits.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-sm font-semibold">Benefits:</p>
                    <ul className="space-y-1">
                      {tier.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-start gap-2 text-sm">
                          <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(tier)}
                    data-testid={`edit-tier-${tier.tier_name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleTier(tier)}
                    data-testid={`toggle-tier-${tier.tier_name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    {tier.is_active ? "Deactivate" : "Activate"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openDeleteDialog(tier)}
                    className="text-red-600 hover:text-red-700"
                    data-testid={`delete-tier-${tier.tier_name.toLowerCase().replace(/\s+/g, '-')}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isAddDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddDialogOpen(false)
          setIsEditDialogOpen(false)
          resetForm()
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {isEditDialogOpen ? 'Edit Subscription Tier' : 'Create Subscription Tier'}
            </DialogTitle>
            <DialogDescription>
              {isEditDialogOpen 
                ? 'Update the details of your subscription tier'
                : 'Create a new subscription tier for your fans'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="tier-name">Tier Name</Label>
              <Input
                id="tier-name"
                data-testid="tier-name"
                value={formData.tier_name}
                onChange={(e) => setFormData(prev => ({ ...prev, tier_name: e.target.value }))}
                placeholder="e.g., Fan Club, VIP Access"
                className={validationErrors.tier_name ? 'border-red-500' : ''}
              />
              {validationErrors.tier_name && (
                <p className="text-sm text-red-500">{validationErrors.tier_name}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tier-price">Monthly Price ($)</Label>
              <Input
                id="tier-price"
                data-testid="tier-price"
                type="number"
                min="1"
                max="999"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                className={validationErrors.price ? 'border-red-500' : ''}
              />
              {validationErrors.price && (
                <p className="text-sm text-red-500">{validationErrors.price}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="tier-description">Description (Optional)</Label>
              <Textarea
                id="tier-description"
                data-testid="tier-description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what subscribers get with this tier"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Benefits</Label>
              <div className="space-y-2">
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={benefit}
                      data-testid={`benefit-${index}`}
                      onChange={(e) => {
                        const newBenefits = [...formData.benefits]
                        newBenefits[index] = e.target.value
                        setFormData(prev => ({ ...prev, benefits: newBenefits }))
                      }}
                    />
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeBenefit(index)}
                      data-testid={`remove-benefit-${index}`}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    placeholder="Add a benefit"
                    value={newBenefit}
                    onChange={(e) => setNewBenefit(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        addBenefit()
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addBenefit}
                    data-testid="add-benefit"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="tier-active">Active</Label>
              <Switch
                id="tier-active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false)
                setIsEditDialogOpen(false)
                resetForm()
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={isEditDialogOpen ? handleEditTier : handleAddTier}
              className="bg-gradient-to-r from-purple-600 to-pink-600 text-white"
              data-testid="save-tier"
            >
              {isEditDialogOpen ? 'Update Tier' : 'Create Tier'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Subscription Tier</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{selectedTier?.tier_name}"? This action cannot be undone.
              Any active subscribers will need to be migrated to a different tier.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteTier}
              className="bg-red-600 hover:bg-red-700"
              data-testid="confirm-delete"
            >
              Delete Tier
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}