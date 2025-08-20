"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DollarSign,
  Percent,
  Clock,
  Zap,
  TrendingUp,
  Info,
  AlertCircle,
  CheckCircle,
  Save,
  RefreshCw,
  Gift,
  Users,
  ChevronUp,
  ChevronDown,
  Sparkles
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"

// Creator pricing configuration types
export interface CreatorPricingConfig {
  // Base Pricing
  basePrice: {
    amount: number
    currency: string
    minPrice: number
    maxPrice: number
  }
  
  // Rush Delivery Options
  rushDelivery: {
    enabled: boolean
    surchargeType: "fixed" | "percentage"
    surcharge: number
    deliveryTime: number // hours
    maxOrders: number
  }
  
  // Optional Pricing Tiers
  tiers?: Array<{
    id: string
    name: string
    baseMultiplier: number
    features: string[]
    deliveryDays: number
  }>
  
  // Promotional Pricing
  promotions?: {
    enabled: boolean
    discount: number
    validUntil: Date
    firstTimeOnly: boolean
    quantity?: number
  }
  
  // Bundle Options
  bundles?: Array<{
    quantity: number
    discount: number
    validityMonths: number
    enabled: boolean
  }>
}

interface CreatorPricingConfigProps {
  initialConfig: CreatorPricingConfig
  categoryAverage?: number
  onSave: (config: CreatorPricingConfig) => Promise<void>
  analytics?: {
    currentRevenue: number
    optimalPrice: number
    conversionRate: number
  }
  className?: string
}

// Price recommendation component
function PriceRecommendation({
  currentPrice,
  categoryAverage,
  optimalPrice
}: {
  currentPrice: number
  categoryAverage?: number
  optimalPrice?: number
}) {
  const getRecommendation = () => {
    if (!categoryAverage && !optimalPrice) return null
    
    if (optimalPrice && Math.abs(currentPrice - optimalPrice) > 10) {
      const difference = optimalPrice - currentPrice
      const percentage = ((difference / currentPrice) * 100).toFixed(0)
      
      return {
        type: difference > 0 ? "increase" : "decrease",
        message: `Consider ${difference > 0 ? "increasing" : "decreasing"} by ${Math.abs(Number(percentage))}%`,
        value: optimalPrice,
        impact: `Could increase revenue by ${Math.abs(Number(percentage) * 0.7).toFixed(0)}%`
      }
    }
    
    if (categoryAverage) {
      const difference = ((currentPrice - categoryAverage) / categoryAverage) * 100
      if (Math.abs(difference) > 20) {
        return {
          type: difference > 0 ? "above" : "below",
          message: `You're ${Math.abs(difference).toFixed(0)}% ${difference > 0 ? "above" : "below"} category average`,
          value: categoryAverage,
          impact: difference > 0 ? "May reduce bookings" : "Good value positioning"
        }
      }
    }
    
    return {
      type: "optimal",
      message: "Your pricing looks good!",
      impact: "Well-positioned for your category"
    }
  }
  
  const recommendation = getRecommendation()
  if (!recommendation) return null
  
  return (
    <Card className={cn(
      "border-l-4",
      recommendation.type === "optimal" && "border-green-500 bg-green-50 dark:bg-green-900/20",
      recommendation.type === "increase" && "border-blue-500 bg-blue-50 dark:bg-blue-900/20",
      recommendation.type === "decrease" && "border-orange-500 bg-orange-50 dark:bg-orange-900/20",
      (recommendation.type === "above" || recommendation.type === "below") && "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-full bg-white dark:bg-gray-800">
            <TrendingUp className="h-4 w-4 text-purple-600" />
          </div>
          <div className="flex-1">
            <p className="font-medium text-sm">{recommendation.message}</p>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
              {recommendation.impact}
            </p>
            {recommendation.value && (
              <p className="text-xs text-gray-500 mt-2">
                Suggested price: ${recommendation.value}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Bundle configuration component
function BundleConfig({
  bundles,
  onChange
}: {
  bundles: CreatorPricingConfig["bundles"]
  onChange: (bundles: CreatorPricingConfig["bundles"]) => void
}) {
  const defaultBundles = [
    { quantity: 3, discount: 10, validityMonths: 6, enabled: false },
    { quantity: 5, discount: 15, validityMonths: 12, enabled: false },
    { quantity: 10, discount: 20, validityMonths: 12, enabled: false }
  ]
  
  const currentBundles = bundles || defaultBundles
  
  return (
    <div className="space-y-3">
      <Label>Bundle Packages</Label>
      <div className="space-y-2">
        {currentBundles.map((bundle, index) => (
          <div
            key={index}
            className={cn(
              "flex items-center gap-3 p-3 rounded-lg border",
              bundle.enabled ? "bg-purple-50 dark:bg-purple-900/20 border-purple-300" : "bg-gray-50 dark:bg-gray-800"
            )}
          >
            <Switch
              checked={bundle.enabled}
              onCheckedChange={(enabled) => {
                const updated = [...currentBundles]
                updated[index] = { ...bundle, enabled }
                onChange(updated)
              }}
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-sm">
                  {bundle.quantity} videos
                </span>
                <Badge variant="secondary" className="text-xs">
                  {bundle.discount}% off
                </Badge>
              </div>
              <p className="text-xs text-gray-500">
                Valid for {bundle.validityMonths} months
              </p>
            </div>
            {bundle.enabled && (
              <Badge className="bg-green-600">Active</Badge>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

// Main pricing configuration component
export function CreatorPricingConfiguration({
  initialConfig,
  categoryAverage,
  onSave,
  analytics,
  className
}: CreatorPricingConfigProps) {
  const [config, setConfig] = React.useState<CreatorPricingConfig>(initialConfig)
  const [isSaving, setIsSaving] = React.useState(false)
  const [showAdvanced, setShowAdvanced] = React.useState(false)
  
  const handleSave = async () => {
    // Validate pricing
    if (config.basePrice.amount < 20 || config.basePrice.amount > 5000) {
      toast.error("Base price must be between $20 and $5000")
      return
    }
    
    if (config.rushDelivery.enabled && config.rushDelivery.surcharge === 0) {
      toast.error("Rush delivery surcharge cannot be $0")
      return
    }
    
    setIsSaving(true)
    try {
      await onSave(config)
      toast.success("Pricing updated successfully!")
    } catch (error) {
      toast.error("Failed to update pricing. Please try again.")
    } finally {
      setIsSaving(false)
    }
  }
  
  const calculateRushPrice = () => {
    if (!config.rushDelivery.enabled) return config.basePrice.amount
    
    if (config.rushDelivery.surchargeType === "percentage") {
      return config.basePrice.amount * (1 + config.rushDelivery.surcharge / 100)
    }
    return config.basePrice.amount + config.rushDelivery.surcharge
  }
  
  return (
    <div className={cn("space-y-6", className)}>
      {/* Base Pricing */}
      <Card>
        <CardHeader>
          <CardTitle>Base Pricing</CardTitle>
          <CardDescription>
            Set your standard video message price
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="base-price">
              Base Price (USD)
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Info className="h-3 w-3 ml-1 inline" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="text-xs">Platform range: $20 - $5000</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </Label>
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                id="base-price"
                type="number"
                min={20}
                max={5000}
                value={config.basePrice.amount}
                onChange={(e) => setConfig({
                  ...config,
                  basePrice: {
                    ...config.basePrice,
                    amount: Number(e.target.value)
                  }
                })}
                className="pl-10"
              />
            </div>
          </div>
          
          {/* Price Recommendation */}
          {(categoryAverage || analytics?.optimalPrice) && (
            <PriceRecommendation
              currentPrice={config.basePrice.amount}
              categoryAverage={categoryAverage}
              optimalPrice={analytics?.optimalPrice}
            />
          )}
          
          {/* Analytics Preview */}
          {analytics && (
            <div className="grid grid-cols-3 gap-3 pt-3 border-t">
              <div className="text-center">
                <p className="text-2xl font-bold">${analytics.currentRevenue}</p>
                <p className="text-xs text-gray-500">Monthly Revenue</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">{analytics.conversionRate}%</p>
                <p className="text-xs text-gray-500">Conversion Rate</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold">${analytics.optimalPrice}</p>
                <p className="text-xs text-gray-500">Optimal Price</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Rush Delivery */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-orange-500" />
            Rush Delivery
          </CardTitle>
          <CardDescription>
            Offer faster delivery for a premium
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="rush-enabled">Enable Rush Delivery</Label>
            <Switch
              id="rush-enabled"
              checked={config.rushDelivery.enabled}
              onCheckedChange={(enabled) => setConfig({
                ...config,
                rushDelivery: {
                  ...config.rushDelivery,
                  enabled
                }
              })}
            />
          </div>
          
          <AnimatePresence>
            {config.rushDelivery.enabled && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-4"
              >
                {/* Surcharge Type */}
                <div className="space-y-2">
                  <Label>Surcharge Type</Label>
                  <Select
                    value={config.rushDelivery.surchargeType}
                    onValueChange={(value: "fixed" | "percentage") => setConfig({
                      ...config,
                      rushDelivery: {
                        ...config.rushDelivery,
                        surchargeType: value
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fixed">
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          Fixed Amount
                        </div>
                      </SelectItem>
                      <SelectItem value="percentage">
                        <div className="flex items-center gap-2">
                          <Percent className="h-4 w-4" />
                          Percentage
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Surcharge Amount */}
                <div className="space-y-2">
                  <Label>
                    Surcharge {config.rushDelivery.surchargeType === "percentage" ? "(%)" : "($)"}
                  </Label>
                  <div className="relative">
                    {config.rushDelivery.surchargeType === "fixed" ? (
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    ) : (
                      <Percent className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    )}
                    <Input
                      type="number"
                      min={config.rushDelivery.surchargeType === "percentage" ? 10 : 10}
                      max={config.rushDelivery.surchargeType === "percentage" ? 100 : 500}
                      value={config.rushDelivery.surcharge}
                      onChange={(e) => setConfig({
                        ...config,
                        rushDelivery: {
                          ...config.rushDelivery,
                          surcharge: Number(e.target.value)
                        }
                      })}
                      className="pl-10"
                    />
                  </div>
                </div>
                
                {/* Delivery Time */}
                <div className="space-y-2">
                  <Label>Delivery Time (hours)</Label>
                  <Select
                    value={config.rushDelivery.deliveryTime.toString()}
                    onValueChange={(value) => setConfig({
                      ...config,
                      rushDelivery: {
                        ...config.rushDelivery,
                        deliveryTime: Number(value)
                      }
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="24">24 hours</SelectItem>
                      <SelectItem value="48">48 hours</SelectItem>
                      <SelectItem value="72">72 hours</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Max Orders */}
                <div className="space-y-2">
                  <Label>Max Rush Orders per Day</Label>
                  <Input
                    type="number"
                    min={1}
                    max={10}
                    value={config.rushDelivery.maxOrders}
                    onChange={(e) => setConfig({
                      ...config,
                      rushDelivery: {
                        ...config.rushDelivery,
                        maxOrders: Number(e.target.value)
                      }
                    })}
                  />
                </div>
                
                {/* Rush Price Preview */}
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Rush Delivery Price</p>
                      <p className="text-xs text-gray-500">
                        Standard: ${config.basePrice.amount} → Rush: ${calculateRushPrice().toFixed(2)}
                      </p>
                    </div>
                    <div className="text-2xl font-bold text-orange-600">
                      ${calculateRushPrice().toFixed(2)}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
      
      {/* Advanced Options */}
      <Card>
        <CardHeader>
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="flex items-center justify-between w-full"
          >
            <CardTitle>Advanced Options</CardTitle>
            {showAdvanced ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>
        </CardHeader>
        
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <CardContent className="space-y-6">
                {/* Bundle Packages */}
                <BundleConfig
                  bundles={config.bundles}
                  onChange={(bundles) => setConfig({ ...config, bundles })}
                />
                
                {/* Promotional Pricing */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Limited Time Promotion</Label>
                    <Switch
                      checked={config.promotions?.enabled || false}
                      onCheckedChange={(enabled) => setConfig({
                        ...config,
                        promotions: {
                          enabled,
                          discount: config.promotions?.discount || 10,
                          validUntil: config.promotions?.validUntil || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                          firstTimeOnly: config.promotions?.firstTimeOnly || false
                        }
                      })}
                    />
                  </div>
                  
                  {config.promotions?.enabled && (
                    <div className="space-y-3 pl-4 border-l-2 border-purple-200">
                      <div className="space-y-2">
                        <Label>Discount Percentage</Label>
                        <Input
                          type="number"
                          min={5}
                          max={50}
                          value={config.promotions.discount}
                          onChange={(e) => setConfig({
                            ...config,
                            promotions: {
                              ...config.promotions!,
                              discount: Number(e.target.value)
                            }
                          })}
                        />
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={config.promotions.firstTimeOnly}
                          onCheckedChange={(firstTimeOnly) => setConfig({
                            ...config,
                            promotions: {
                              ...config.promotions!,
                              firstTimeOnly
                            }
                          })}
                        />
                        <Label>First-time customers only</Label>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
      
      {/* Save Button */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          Changes will apply to new bookings only
        </p>
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className="min-w-[120px]"
        >
          {isSaving ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  )
}