"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  Plus,
  Edit,
  Trash2,
  GripVertical,
  Save,
  Eye,
  Users,
  DollarSign,
  Sparkles,
  Info,
  ChevronUp,
  ChevronDown,
  Star,
  Zap,
  Trophy,
  Gift,
  Heart,
  Crown
} from "lucide-react"
import { cn } from "@/lib/utils"
import { useSupabaseAuth } from "@/contexts/supabase-auth-context"
import { useCreatorTierManagement } from "@/hooks/use-subscriptions"
import { TierBuilder } from "@/components/creator/subscriptions/TierBuilder"
import { TierPreview } from "@/components/creator/subscriptions/TierPreview"
import type { CreatorSubscriptionTier } from "@/lib/types/livestream"

export default function ManageSubscriptionTiers() {
  const router = useRouter()
  const { user, isLoading: authLoading } = useSupabaseAuth()
  const {
    tiers,
    loading,
    error,
    createTier,
    updateTier,
    deleteTier,
    reorderTiers
  } = useCreatorTierManagement()

  const [activeTab, setActiveTab] = useState("manage")
  const [editingTier, setEditingTier] = useState<CreatorSubscriptionTier | null>(null)
  const [showBuilder, setShowBuilder] = useState(false)
  const [previewTier, setPreviewTier] = useState<CreatorSubscriptionTier | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Redirect if not authenticated or not a creator
  useEffect(() => {
    if (!authLoading && (!user || user.user_role !== 'creator')) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  const handleDragEnd = async (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      const oldIndex = tiers.findIndex((tier) => tier.id === active.id)
      const newIndex = tiers.findIndex((tier) => tier.id === over.id)
      
      const newOrder = arrayMove(tiers, oldIndex, newIndex)
      const updates = newOrder.map((tier, index) => ({
        id: tier.id,
        sort_order: index + 1
      }))
      
      await reorderTiers(updates)
    }
  }

  const handleSaveTier = async (tierData: Partial<CreatorSubscriptionTier>) => {
    if (editingTier) {
      await updateTier(editingTier.id, tierData)
    } else {
      await createTier(tierData)
    }
    setShowBuilder(false)
    setEditingTier(null)
  }

  const handleDeleteTier = async (tierId: string) => {
    if (confirm('Are you sure you want to delete this tier? This action cannot be undone.')) {
      await deleteTier(tierId)
    }
  }

  const getIconComponent = (iconName?: string) => {
    switch(iconName) {
      case 'zap': return Zap
      case 'trophy': return Trophy
      case 'gift': return Gift
      case 'heart': return Heart
      case 'crown': return Crown
      default: return Star
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl p-4 sm:p-6 text-white">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="flex-1">
            <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
              Manage Subscription Tiers
              <Sparkles className="h-5 sm:h-6 w-5 sm:w-6" />
            </h1>
            <p className="text-white/90 mt-2 text-sm sm:text-base">
              Create custom subscription tiers with unique names, prices, and benefits
            </p>
          </div>
          <Button
            size="lg"
            className="bg-white text-purple-600 hover:bg-gray-100"
            onClick={() => {
              setEditingTier(null)
              setShowBuilder(true)
            }}
          >
            <Plus className="h-4 w-4 mr-2" />
            Create New Tier
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Tiers</p>
                <p className="text-2xl font-bold">{tiers.length}</p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Sparkles className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Subscribers</p>
                <p className="text-2xl font-bold">
                  {tiers.reduce((sum, tier) => sum + (tier.subscriber_count || 0), 0)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <Users className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Monthly Revenue</p>
                <p className="text-2xl font-bold">
                  ${tiers.reduce((sum, tier) => 
                    sum + (tier.price * (tier.subscriber_count || 0)), 0
                  ).toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-orange-100 rounded-lg">
                <DollarSign className="h-5 w-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alert for no tiers */}
      {tiers.length === 0 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertTitle>No subscription tiers yet</AlertTitle>
          <AlertDescription>
            Create your first subscription tier to start offering exclusive content to your fans.
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full sm:w-auto grid-cols-2">
          <TabsTrigger value="manage">Manage Tiers</TabsTrigger>
          <TabsTrigger value="preview">Fan Preview</TabsTrigger>
        </TabsList>

        {/* Manage Tab */}
        <TabsContent value="manage" className="space-y-4 mt-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={tiers.map(t => t.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-4">
                {tiers.map((tier) => {
                  const IconComponent = getIconComponent(tier.icon)
                  
                  return (
                    <Card key={tier.id} className="overflow-hidden">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-4">
                            <div className="cursor-move">
                              <GripVertical className="h-5 w-5 text-gray-400" />
                            </div>
                            <div className={cn(
                              "p-3 rounded-lg bg-gradient-to-r",
                              tier.color || "from-purple-600 to-pink-600"
                            )}>
                              <IconComponent className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <CardTitle className="text-xl">{tier.tier_name}</CardTitle>
                              <CardDescription>{tier.description}</CardDescription>
                              <div className="flex items-center gap-4 mt-2">
                                <Badge variant="secondary">
                                  ${tier.price}/{tier.billing_period === 'yearly' ? 'year' : 'month'}
                                </Badge>
                                <Badge variant="outline">
                                  <Users className="h-3 w-3 mr-1" />
                                  {tier.subscriber_count || 0} subscribers
                                </Badge>
                                {tier.sort_order === 1 && (
                                  <Badge className="bg-gradient-to-r from-purple-600 to-pink-600">
                                    Highest Tier
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => setPreviewTier(tier)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                setEditingTier(tier)
                                setShowBuilder(true)
                              }}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleDeleteTier(tier.id)}
                              disabled={(tier.subscriber_count || 0) > 0}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-2">
                          <p className="text-sm font-medium">Benefits:</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {(Array.isArray(tier.benefits) ? tier.benefits : [])
                              .slice(0, 3)
                              .map((benefit, idx) => (
                                <li key={idx} className="flex items-center gap-2">
                                  <div className="h-1.5 w-1.5 bg-purple-600 rounded-full" />
                                  {typeof benefit === 'string' ? benefit : benefit.text}
                                </li>
                              ))}
                            {tier.benefits.length > 3 && (
                              <li className="text-purple-600 font-medium">
                                +{tier.benefits.length - 3} more benefits
                              </li>
                            )}
                          </ul>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            </SortableContext>
          </DndContext>
        </TabsContent>

        {/* Preview Tab */}
        <TabsContent value="preview" className="mt-6">
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">This is how fans will see your tiers:</h3>
            <div className="grid gap-6 lg:grid-cols-3">
              {tiers.map((tier) => (
                <TierPreview key={tier.id} tier={tier} />
              ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Tier Builder Modal */}
      {showBuilder && (
        <TierBuilder
          tier={editingTier}
          onSave={handleSaveTier}
          onClose={() => {
            setShowBuilder(false)
            setEditingTier(null)
          }}
        />
      )}

      {/* Preview Modal */}
      {previewTier && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h3 className="text-lg font-semibold mb-4">Tier Preview</h3>
              <TierPreview tier={previewTier} />
              <Button
                className="w-full mt-4"
                onClick={() => setPreviewTier(null)}
              >
                Close Preview
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}