"use client"

import * as React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Trash2,
  Edit2,
  Check,
  X
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Addon {
  id: string
  enabled: boolean
  name: string
  description: string
  price: number
}

interface AddonEditorProps {
  addon: Addon
  onChange: (addon: Addon) => void
  onDelete: () => void
}

export default function AddonEditor({
  addon,
  onChange,
  onDelete
}: AddonEditorProps) {
  const [isEditing, setIsEditing] = React.useState(false)
  const [editedAddon, setEditedAddon] = React.useState(addon)

  const handleSave = () => {
    onChange(editedAddon)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedAddon(addon)
    setIsEditing(false)
  }

  const getAddonColor = (id: string) => {
    const colors: Record<string, string> = {
      rush: "bg-green-100 text-green-700 border-green-200",
      "extra-length": "bg-blue-100 text-blue-700 border-blue-200",
      "4k": "bg-purple-100 text-purple-700 border-purple-200",
      gift: "bg-pink-100 text-pink-700 border-pink-200"
    }
    return colors[id] || "bg-gray-100 text-gray-700 border-gray-200"
  }

  if (isEditing) {
    return (
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={`addon-name-${addon.id}`}>Name</Label>
              <Input
                id={`addon-name-${addon.id}`}
                value={editedAddon.name}
                onChange={(e) => setEditedAddon({ ...editedAddon, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`addon-price-${addon.id}`}>Price ($)</Label>
              <Input
                id={`addon-price-${addon.id}`}
                type="number"
                min="0"
                step="1"
                value={editedAddon.price}
                onChange={(e) => setEditedAddon({ ...editedAddon, price: parseInt(e.target.value) || 0 })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor={`addon-desc-${addon.id}`}>Description</Label>
            <Input
              id={`addon-desc-${addon.id}`}
              value={editedAddon.description}
              onChange={(e) => setEditedAddon({ ...editedAddon, description: e.target.value })}
            />
          </div>
          <div className="flex justify-end gap-2">
            <Button size="sm" variant="outline" onClick={handleCancel}>
              <X className="h-4 w-4 mr-1" />
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              <Check className="h-4 w-4 mr-1" />
              Save
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className={cn(
      "flex items-center justify-between p-4 rounded-lg border transition-all",
      addon.enabled ? "bg-white" : "bg-gray-50 opacity-60"
    )}>
      <div className="flex items-center gap-4">
        <Switch
          checked={addon.enabled}
          onCheckedChange={(checked) => onChange({ ...addon, enabled: checked })}
        />
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{addon.name}</span>
            <Badge className={getAddonColor(addon.id)}>
              +${addon.price}
            </Badge>
          </div>
          <p className="text-sm text-gray-600">{addon.description}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          size="icon"
          variant="ghost"
          onClick={() => setIsEditing(true)}
        >
          <Edit2 className="h-4 w-4" />
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
  )
}