"use client"

import * as React from "react"
import { EnhancedConfirmation } from "../../enhanced-confirmation"
import type { StepComponentProps } from "../multi-step-wizard"
import { toast } from "sonner"

export function Confirmation({
  data,
  updateData,
  errors,
  isActive
}: StepComponentProps) {
  // Generate order details from wizard data
  const orderDetails = React.useMemo(() => ({
    orderNumber: `ANN-${Date.now().toString().slice(-8)}`,
    creatorName: data.creatorName || "Creator",
    creatorImage: data.creatorImage,
    recipientName: data.recipientName || data.toName || "Recipient",
    occasion: data.occasion === "custom" ? data.customOccasion : data.occasion || "Special Occasion",
    price: data.basePrice || 150,
    deliveryTime: data.deliveryTier === "rush" ? "1 day" : 
                  data.deliveryTier === "express" ? "2 days" : "3-5 days",
    createdAt: new Date()
  }), [data])
  
  const handleShare = (platform: string) => {
    // Track share action
    console.log(`Shared on ${platform}`)
    updateData({
      ...data,
      sharedOn: [...(data.sharedOn || []), platform]
    })
  }
  
  const handleDownloadReceipt = () => {
    // In production, this would generate and download a PDF receipt
    console.log("Downloading receipt...")
    toast.success("Receipt downloaded successfully!")
    updateData({
      ...data,
      receiptDownloaded: true
    })
  }
  
  const handleBookAnother = () => {
    // In production, this would start a new booking flow
    console.log("Starting new booking...")
    toast.info("Starting a new booking with 20% discount!")
    updateData({
      ...data,
      bookingAnother: true
    })
  }
  
  const handleViewProgress = () => {
    // In production, this would navigate to order tracking
    console.log("Viewing order progress...")
    updateData({
      ...data,
      viewingProgress: true
    })
  }
  
  if (!isActive) {
    return null
  }
  
  return (
    <div className="w-full">
      <EnhancedConfirmation
        orderDetails={orderDetails}
        onShare={handleShare}
        onDownloadReceipt={handleDownloadReceipt}
        onBookAnother={handleBookAnother}
        onViewProgress={handleViewProgress}
        showAnimation={true}
      />
    </div>
  )
}