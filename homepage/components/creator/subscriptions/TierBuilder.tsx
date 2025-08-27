import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { X, Save, Plus, Trash2, Star, Zap, Trophy, Gift, Heart, Crown } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CreatorSubscriptionTier } from '@/lib/types/livestream'

interface TierBuilderProps {
  tier?: CreatorSubscriptionTier | null
  onSave: (tier: Partial<CreatorSubscriptionTier>) => void
  onClose: () => void
}

const TIER_COLORS = [
  { name: 'Purple', value: 'from-purple-500 to-purple-700' },
  { name: 'Pink', value: 'from-pink-500 to-rose-700' },
  { name: 'Amber', value: 'from-amber-500 to-orange-700' },
  { name: 'Green', value: 'from-green-500 to-emerald-700' },
  { name: 'Blue', value: 'from-blue-500 to-indigo-700' },
  { name: 'Red', value: 'from-red-500 to-rose-700' },
]

const TIER_ICONS = [
  { name: 'Star', value: 'star', icon: Star },
  { name: 'Lightning', value: 'zap', icon: Zap },
  { name: 'Trophy', value: 'trophy', icon: Trophy },
  { name: 'Gift', value: 'gift', icon: Gift },
  { name: 'Heart', value: 'heart', icon: Heart },
  { name: 'Crown', value: 'crown', icon: Crown },
]

export function TierBuilder({ tier, onSave, onClose }: TierBuilderProps) {
  const [formData, setFormData] = useState({
    tier_name: '',
    description: '',
    price: 5,
    billing_period: 'monthly' as 'monthly' | 'yearly',
    color: 'from-purple-500 to-purple-700',
    icon: 'star',
    tier_type: 'basic' as 'basic' | 'premium' | 'vip',
    benefits: [] as string[],
    ad_free: false,
    exclusive_content: true,
    priority_chat: false,
    vod_access: false,
    max_quality: '1080p'
  })

  const [newBenefit, setNewBenefit] = useState('')

  useEffect(() => {
    if (tier) {
      setFormData({
        tier_name: tier.tier_name || '',
        description: tier.description || '',
        price: tier.price || 5,
        billing_period: tier.billing_period || 'monthly',
        color: tier.color || 'from-purple-500 to-purple-700',
        icon: tier.icon || 'star',
        tier_type: tier.tier_type || 'basic',
        benefits: Array.isArray(tier.benefits) 
          ? tier.benefits.map(b => typeof b === 'string' ? b : b.text)
          : [],
        ad_free: tier.ad_free || false,
        exclusive_content: tier.exclusive_content || true,
        priority_chat: tier.priority_chat || false,
        vod_access: tier.vod_access || false,
        max_quality: tier.max_quality || '1080p'
      })
    }
  }, [tier])

  const handleAddBenefit = () => {
    if (newBenefit.trim()) {
      setFormData({
        ...formData,
        benefits: [...formData.benefits, newBenefit.trim()]
      })
      setNewBenefit('')
    }
  }

  const handleRemoveBenefit = (index: number) => {
    setFormData({
      ...formData,
      benefits: formData.benefits.filter((_, i) => i !== index)
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <Card className="max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">
              {tier ? 'Edit Subscription Tier' : 'Create New Subscription Tier'}
            </CardTitle>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <div>
                <Label htmlFor="tier_name">Tier Name</Label>
                <Input
                  id="tier_name"
                  value={formData.tier_name}
                  onChange={(e) => setFormData({ ...formData, tier_name: e.target.value })}
                  placeholder="e.g., Backstage Pass, Studio Sessions, VIP Circle"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe what makes this tier special..."
                  rows={3}
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="price">Price ($)</Label>
                <Input
                  id="price"
                  type="number"
                  min="1"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="billing_period">Billing Period</Label>
                <Select
                  value={formData.billing_period}
                  onValueChange={(value: 'monthly' | 'yearly') => 
                    setFormData({ ...formData, billing_period: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="monthly">Monthly</SelectItem>
                    <SelectItem value="yearly">Yearly</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Appearance */}
            <div className="space-y-4">
              <div>
                <Label>Color Theme</Label>
                <RadioGroup
                  value={formData.color}
                  onValueChange={(value) => setFormData({ ...formData, color: value })}
                  className="grid grid-cols-3 gap-3 mt-2"
                >
                  {TIER_COLORS.map((color) => (
                    <Label
                      key={color.value}
                      htmlFor={color.value}
                      className="cursor-pointer"
                    >
                      <RadioGroupItem
                        value={color.value}
                        id={color.value}
                        className="sr-only"
                      />
                      <div className={cn(
                        "p-4 rounded-lg bg-gradient-to-r text-white text-center font-medium",
                        color.value,
                        formData.color === color.value && "ring-2 ring-offset-2 ring-purple-500"
                      )}>
                        {color.name}
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              </div>

              <div>
                <Label>Icon</Label>
                <RadioGroup
                  value={formData.icon}
                  onValueChange={(value) => setFormData({ ...formData, icon: value })}
                  className="grid grid-cols-6 gap-3 mt-2"
                >
                  {TIER_ICONS.map(({ name, value, icon: Icon }) => (
                    <Label
                      key={value}
                      htmlFor={`icon-${value}`}
                      className="cursor-pointer"
                    >
                      <RadioGroupItem
                        value={value}
                        id={`icon-${value}`}
                        className="sr-only"
                      />
                      <div className={cn(
                        "p-3 rounded-lg border-2 flex flex-col items-center gap-1",
                        formData.icon === value 
                          ? "border-purple-500 bg-purple-50" 
                          : "border-gray-200 hover:border-gray-300"
                      )}>
                        <Icon className="h-5 w-5" />
                        <span className="text-xs">{name}</span>
                      </div>
                    </Label>
                  ))}
                </RadioGroup>
              </div>
            </div>

            {/* Benefits */}
            <div className="space-y-4">
              <Label>Benefits</Label>
              <div className="flex gap-2">
                <Input
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  placeholder="Add a benefit..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      handleAddBenefit()
                    }
                  }}
                />
                <Button type="button" onClick={handleAddBenefit}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              
              <ul className="space-y-2">
                {formData.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                    <span className="flex-1 text-sm">{benefit}</span>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveBenefit(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </li>
                ))}
              </ul>
            </div>

            {/* Submit */}
            <div className="flex gap-3 justify-end pt-4 border-t">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-gradient-to-r from-purple-600 to-pink-600">
                <Save className="h-4 w-4 mr-2" />
                {tier ? 'Update Tier' : 'Create Tier'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}