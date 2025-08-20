"use client"

import * as React from "react"
import type { CreatorPricingConfig } from "./creator-pricing-config"

// Booking options interface
export interface BookingOptions {
  rushDelivery: boolean
  quantity: number
  isGift: boolean
  firstTimeCustomer: boolean
  promoCode?: string
}

// Pricing breakdown interface
export interface PricingBreakdown {
  basePrice: number
  rushSurcharge: number
  bundleDiscount: number
  promoDiscount: number
  platformFee: number
  creatorEarnings: number
  total: number
  savings: number
  originalTotal: number
}

// Pricing context for user
export interface UserPricingContext {
  isFirstTime: boolean
  previousBookings: number
  giftPurchase: boolean
  location?: string
  referralCode?: string
}

// Demand level for dynamic pricing
export type DemandLevel = "low" | "medium" | "high" | "peak"

// Pricing calculator class
export class PricingCalculator {
  private config: CreatorPricingConfig
  private platformFeeRate: number = 0.20 // 20% platform fee
  
  constructor(config: CreatorPricingConfig) {
    this.config = config
  }
  
  // Calculate total pricing with all factors
  calculateTotal(
    options: BookingOptions,
    context?: UserPricingContext,
    demandLevel?: DemandLevel
  ): PricingBreakdown {
    const base = this.config.basePrice.amount * options.quantity
    const originalBase = base
    
    // Calculate rush surcharge
    const rushSurcharge = this.calculateRushSurcharge(options, demandLevel)
    
    // Calculate bundle discount
    const bundleDiscount = this.calculateBundleDiscount(options.quantity)
    
    // Calculate promotional discount
    const promoDiscount = this.calculatePromoDiscount(
      base + rushSurcharge,
      options,
      context
    )
    
    // Calculate final total
    const subtotal = base + rushSurcharge - bundleDiscount - promoDiscount
    const platformFee = this.calculatePlatformFee(subtotal)
    const creatorEarnings = subtotal - platformFee
    
    return {
      basePrice: base,
      rushSurcharge,
      bundleDiscount,
      promoDiscount,
      platformFee,
      creatorEarnings,
      total: subtotal,
      savings: bundleDiscount + promoDiscount,
      originalTotal: originalBase + rushSurcharge
    }
  }
  
  // Calculate rush delivery surcharge
  private calculateRushSurcharge(
    options: BookingOptions,
    demandLevel?: DemandLevel
  ): number {
    if (!options.rushDelivery || !this.config.rushDelivery.enabled) {
      return 0
    }
    
    const baseAmount = this.config.basePrice.amount * options.quantity
    let surcharge = 0
    
    if (this.config.rushDelivery.surchargeType === "percentage") {
      surcharge = baseAmount * (this.config.rushDelivery.surcharge / 100)
    } else {
      surcharge = this.config.rushDelivery.surcharge * options.quantity
    }
    
    // Apply demand multiplier for peak times
    if (demandLevel === "peak") {
      surcharge *= 1.5
    } else if (demandLevel === "high") {
      surcharge *= 1.25
    }
    
    return Math.round(surcharge * 100) / 100
  }
  
  // Calculate bundle discount
  private calculateBundleDiscount(quantity: number): number {
    if (!this.config.bundles || quantity === 1) {
      return 0
    }
    
    // Find applicable bundle
    const applicableBundle = this.config.bundles
      .filter(b => b.enabled && b.quantity <= quantity)
      .sort((a, b) => b.quantity - a.quantity)[0]
    
    if (!applicableBundle) {
      return 0
    }
    
    const baseAmount = this.config.basePrice.amount * quantity
    return Math.round(baseAmount * (applicableBundle.discount / 100) * 100) / 100
  }
  
  // Calculate promotional discount
  private calculatePromoDiscount(
    subtotal: number,
    options: BookingOptions,
    context?: UserPricingContext
  ): number {
    let discount = 0
    
    // Check for active promotion
    if (this.config.promotions?.enabled) {
      const promo = this.config.promotions
      const now = new Date()
      
      if (promo.validUntil > now) {
        // Check if first-time customer restriction applies
        if (!promo.firstTimeOnly || context?.isFirstTime) {
          discount = subtotal * (promo.discount / 100)
        }
      }
    }
    
    // First-time customer discount (platform-wide)
    if (context?.isFirstTime && discount === 0) {
      discount = subtotal * 0.10 // 10% first-time discount
    }
    
    // Gift purchase bonus
    if (options.isGift && discount === 0) {
      discount = subtotal * 0.05 // 5% gift discount
    }
    
    return Math.round(discount * 100) / 100
  }
  
  // Calculate platform fee
  private calculatePlatformFee(subtotal: number): number {
    return Math.round(subtotal * this.platformFeeRate * 100) / 100
  }
  
  // Get rush delivery availability
  getRushAvailability(currentOrders: number): {
    available: boolean
    slotsRemaining: number
    message: string
  } {
    if (!this.config.rushDelivery.enabled) {
      return {
        available: false,
        slotsRemaining: 0,
        message: "Rush delivery not available"
      }
    }
    
    const slotsRemaining = this.config.rushDelivery.maxOrders - currentOrders
    
    if (slotsRemaining <= 0) {
      return {
        available: false,
        slotsRemaining: 0,
        message: "Rush delivery sold out for today"
      }
    }
    
    if (slotsRemaining <= 2) {
      return {
        available: true,
        slotsRemaining,
        message: `Only ${slotsRemaining} rush ${slotsRemaining === 1 ? "slot" : "slots"} left today!`
      }
    }
    
    return {
      available: true,
      slotsRemaining,
      message: `${slotsRemaining} rush slots available`
    }
  }
  
  // Get optimal price suggestion
  getOptimalPrice(
    historicalData: {
      conversionRates: Map<number, number>
      averageOrderValue: number
      categoryAverage: number
    }
  ): number {
    // Simple optimization based on conversion rates
    let optimalPrice = this.config.basePrice.amount
    let maxRevenue = 0
    
    historicalData.conversionRates.forEach((conversionRate, price) => {
      const estimatedRevenue = price * conversionRate
      if (estimatedRevenue > maxRevenue) {
        maxRevenue = estimatedRevenue
        optimalPrice = price
      }
    })
    
    // Adjust based on category average
    if (optimalPrice > historicalData.categoryAverage * 1.5) {
      optimalPrice = historicalData.categoryAverage * 1.3
    }
    
    return Math.round(optimalPrice)
  }
  
  // Format price for display
  static formatPrice(amount: number, currency: string = "USD"): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 2
    }).format(amount)
  }
  
  // Get psychological price
  static getPsychologicalPrice(price: number): number {
    // Convert to .99 ending for psychological pricing
    if (price < 100) {
      return Math.floor(price) - 0.01
    } else if (price < 500) {
      return Math.floor(price / 5) * 5 - 1
    } else {
      return Math.floor(price / 10) * 10 - 1
    }
  }
}

// Pricing validation utilities
export class PricingValidator {
  static validateBasePrice(price: number): {
    valid: boolean
    message?: string
  } {
    if (price < 20) {
      return {
        valid: false,
        message: "Minimum price is $20"
      }
    }
    
    if (price > 5000) {
      return {
        valid: false,
        message: "Maximum price is $5000"
      }
    }
    
    return { valid: true }
  }
  
  static validateRushSurcharge(
    surcharge: number,
    type: "fixed" | "percentage"
  ): {
    valid: boolean
    message?: string
  } {
    if (type === "percentage") {
      if (surcharge < 10) {
        return {
          valid: false,
          message: "Minimum rush surcharge is 10%"
        }
      }
      if (surcharge > 100) {
        return {
          valid: false,
          message: "Maximum rush surcharge is 100%"
        }
      }
    } else {
      if (surcharge < 10) {
        return {
          valid: false,
          message: "Minimum rush surcharge is $10"
        }
      }
      if (surcharge > 500) {
        return {
          valid: false,
          message: "Maximum rush surcharge is $500"
        }
      }
    }
    
    return { valid: true }
  }
}

// Conversion optimization utilities
export class ConversionOptimizer {
  // Get pricing message based on context
  static getPricingMessage(
    price: number,
    categoryAverage: number,
    context: UserPricingContext
  ): string {
    const difference = ((price - categoryAverage) / categoryAverage) * 100
    
    if (context.isFirstTime) {
      return "🎉 Special first-time customer discount available!"
    }
    
    if (context.giftPurchase) {
      return "🎁 Perfect gift! Special gift pricing applied"
    }
    
    if (difference < -20) {
      return "🔥 Great value! " + Math.abs(Math.round(difference)) + "% below average"
    }
    
    if (difference < 0) {
      return "✨ Good value pricing"
    }
    
    if (difference < 20) {
      return "⭐ Premium quality service"
    }
    
    return "💎 Exclusive creator pricing"
  }
  
  // Get urgency message
  static getUrgencyMessage(
    slotsRemaining: number,
    recentBookings: number
  ): string | null {
    if (slotsRemaining <= 2) {
      return `⚡ Only ${slotsRemaining} ${slotsRemaining === 1 ? "slot" : "slots"} left today!`
    }
    
    if (recentBookings > 10) {
      return `🔥 ${recentBookings} people booked in the last hour`
    }
    
    if (slotsRemaining <= 5) {
      return `⏰ Limited availability - ${slotsRemaining} slots remaining`
    }
    
    return null
  }
  
  // Get social proof message
  static getSocialProofMessage(
    totalBookings: number,
    repeatRate: number
  ): string {
    if (totalBookings > 1000) {
      return `🌟 ${(totalBookings / 1000).toFixed(1)}k+ happy customers`
    }
    
    if (repeatRate > 30) {
      return `💜 ${repeatRate}% of customers book again`
    }
    
    if (totalBookings > 100) {
      return `✅ ${totalBookings} videos delivered`
    }
    
    return `🎬 Professional video messages`
  }
}