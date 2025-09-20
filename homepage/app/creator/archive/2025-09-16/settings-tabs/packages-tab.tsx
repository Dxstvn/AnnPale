// Archived from creator/settings/page.tsx on 2025-09-16
// This tab was used for configuring video message packages and pricing

import React from 'react'
import { TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Plus } from "lucide-react"
import PackageTierEditor from "@/components/creator/settings/package-tier-editor"
import AddonEditor from "@/components/creator/settings/addon-editor"

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

interface Addon {
  id: string
  enabled: boolean
  name: string
  description: string
  price: number
}

interface PackagesTabProps {
  packageTiers: PackageTier[]
  addons: Addon[]
  setPackageTiers: React.Dispatch<React.SetStateAction<PackageTier[]>>
  setAddons: React.Dispatch<React.SetStateAction<Addon[]>>
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>
}

export function PackagesTab({
  packageTiers,
  addons,
  setPackageTiers,
  setAddons,
  setHasUnsavedChanges
}: PackagesTabProps) {
  return (
    <TabsContent value="packages" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Booking Packages</CardTitle>
          <CardDescription>
            Configure your video message packages and pricing
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Package Tiers */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Package Tiers</h3>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Tier
              </Button>
            </div>

            {packageTiers.map((tier) => (
              <PackageTierEditor
                key={tier.id}
                tier={tier}
                onChange={(updatedTier) => {
                  setPackageTiers(prev =>
                    prev.map(t => t.id === tier.id ? updatedTier : t)
                  )
                  setHasUnsavedChanges(true)
                }}
                onDelete={() => {
                  setPackageTiers(prev => prev.filter(t => t.id !== tier.id))
                  setHasUnsavedChanges(true)
                }}
              />
            ))}
          </div>

          <Separator />

          {/* Add-ons */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Add-on Options</h3>
              <Button size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            </div>

            {addons.map((addon) => (
              <AddonEditor
                key={addon.id}
                addon={addon}
                onChange={(updatedAddon) => {
                  setAddons(prev =>
                    prev.map(a => a.id === addon.id ? updatedAddon : a)
                  )
                  setHasUnsavedChanges(true)
                }}
                onDelete={() => {
                  setAddons(prev => prev.filter(a => a.id !== addon.id))
                  setHasUnsavedChanges(true)
                }}
              />
            ))}
          </div>
        </CardContent>
      </Card>
    </TabsContent>
  )
}