"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  GripVertical,
  Trash2,
  Plus,
  X,
  ChevronDown,
  ChevronUp
} from "lucide-react"
import { cn } from "@/lib/utils"

interface PackageTier {
  id: string
  enabled: boolean
  name: string
  description: string
  price: number
  deliveryDays: number
  videoDuration: string
  revisions: number
  features: string[]
}

interface PackageTierEditorProps {
  tier: PackageTier
  onChange: (tier: PackageTier) => void
  onDelete: () => void
}

export default function PackageTierEditor({
  tier,
  onChange,
  onDelete
}: PackageTierEditorProps) {
  const [isExpanded, setIsExpanded] = React.useState(false)
  const [newFeature, setNewFeature] = React.useState("")

  const handleAddFeature = () => {
    if (newFeature.trim()) {
      onChange({
        ...tier,
        features: [...tier.features, newFeature.trim()]
      })
      setNewFeature("")
    }
  }

  const handleRemoveFeature = (index: number) => {
    onChange({
      ...tier,
      features: tier.features.filter((_, i) => i !== index)
    })
  }

  const popularityColor = {
    basic: "from-gray-600 to-gray-700",
    premium: "from-purple-600 to-pink-600",
    vip: "from-yellow-600 to-orange-600"
  }[tier.id] || "from-gray-600 to-gray-700"

  return (
    <Card className={cn(
      "transition-all",
      !tier.enabled && "opacity-60"
    )}>
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <button className="cursor-move text-gray-400 hover:text-gray-600">
              <GripVertical className="h-5 w-5" />
            </button>
            <div className={cn(
              "w-10 h-10 rounded-lg flex items-center justify-center text-white bg-gradient-to-r",
              popularityColor
            )}>
              {tier.name.charAt(0)}
            </div>
            <div>
              <h4 className="font-semibold">{tier.name}</h4>
              <p className="text-sm text-gray-600">{tier.description}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={tier.enabled}
              onCheckedChange={(checked) => onChange({ ...tier, enabled: checked })}
            />
            <Button
              size="icon"
              variant="ghost"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
            <Button
              size="icon"
              variant="ghost"
              onClick={onDelete}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-4 text-sm">
          <Badge variant="secondary">
            ${tier.price}
          </Badge>
          <Badge variant="outline">
            {tier.deliveryDays} day{tier.deliveryDays !== 1 ? 's' : ''} delivery
          </Badge>
          <Badge variant="outline">
            {tier.videoDuration} seconds
          </Badge>
          <Badge variant="outline">
            {tier.revisions === -1 ? 'Unlimited' : tier.revisions} revision{tier.revisions !== 1 ? 's' : ''}
          </Badge>
        </div>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-6 space-y-4 pt-4 border-t">
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`name-${tier.id}`}>Package Name</Label>
                <Input
                  id={`name-${tier.id}`}
                  value={tier.name}
                  onChange={(e) => onChange({ ...tier, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`price-${tier.id}`}>Price ($)</Label>
                <Input
                  id={`price-${tier.id}`}
                  type="number"
                  min="1"
                  value={tier.price}
                  onChange={(e) => onChange({ ...tier, price: parseInt(e.target.value) || 0 })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor={`description-${tier.id}`}>Description</Label>
              <Input
                id={`description-${tier.id}`}
                value={tier.description}
                onChange={(e) => onChange({ ...tier, description: e.target.value })}
              />
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor={`delivery-${tier.id}`}>Delivery (days)</Label>
                <Input
                  id={`delivery-${tier.id}`}
                  type="number"
                  min="1"
                  value={tier.deliveryDays}
                  onChange={(e) => onChange({ ...tier, deliveryDays: parseInt(e.target.value) || 1 })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`duration-${tier.id}`}>Video Duration</Label>
                <Input
                  id={`duration-${tier.id}`}
                  value={tier.videoDuration}
                  onChange={(e) => onChange({ ...tier, videoDuration: e.target.value })}
                  placeholder="e.g., 30-60"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`revisions-${tier.id}`}>Revisions</Label>
                <Input
                  id={`revisions-${tier.id}`}
                  type="number"
                  min="-1"
                  value={tier.revisions}
                  onChange={(e) => onChange({ ...tier, revisions: parseInt(e.target.value) || 0 })}
                  placeholder="-1 for unlimited"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Features</Label>
              <div className="space-y-2">
                {tier.features.map((feature, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <GripVertical className="h-4 w-4 text-gray-400 cursor-move" />
                    <div className="flex-1 px-3 py-2 bg-gray-50 rounded-lg text-sm">
                      {feature}
                    </div>
                    <Button
                      size="icon"
                      variant="ghost"
                      onClick={() => handleRemoveFeature(index)}
                      className="h-8 w-8"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input
                    value={newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add a feature..."
                    onKeyPress={(e) => e.key === 'Enter' && handleAddFeature()}
                  />
                  <Button onClick={handleAddFeature} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}