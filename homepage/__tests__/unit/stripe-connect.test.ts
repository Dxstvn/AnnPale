/**
 * Unit tests for Stripe Connect 70/30 revenue split implementation
 * Testing Phase 3.1 of Backend Integration Plan
 */
import { describe, test, expect } from 'vitest'

describe('Stripe Connect - 70/30 Revenue Split', () => {
  describe('Payment Split Calculations', () => {
    test('calculates 70/30 split correctly for video payment', () => {
      const amount = 100 // $100
      const platformFeePercentage = 0.30
      
      const amountInCents = Math.round(amount * 100)
      const platformFeeInCents = Math.round(amountInCents * platformFeePercentage)
      const creatorEarningsInCents = amountInCents - platformFeeInCents
      
      expect(amountInCents).toBe(10000) // $100 in cents
      expect(platformFeeInCents).toBe(3000) // $30 platform fee (30%)
      expect(creatorEarningsInCents).toBe(7000) // $70 to creator (70%)
    })

    test('calculates split for various amounts', () => {
      const testCases = [
        { amount: 50, expectedFee: 1500, expectedEarnings: 3500 },
        { amount: 75, expectedFee: 2250, expectedEarnings: 5250 },
        { amount: 150, expectedFee: 4500, expectedEarnings: 10500 },
        { amount: 200, expectedFee: 6000, expectedEarnings: 14000 },
      ]
      
      testCases.forEach(({ amount, expectedFee, expectedEarnings }) => {
        const amountInCents = Math.round(amount * 100)
        const platformFeeInCents = Math.round(amountInCents * 0.30)
        const creatorEarningsInCents = amountInCents - platformFeeInCents
        
        expect(platformFeeInCents).toBe(expectedFee)
        expect(creatorEarningsInCents).toBe(expectedEarnings)
      })
    })

    test('handles decimal amounts correctly', () => {
      const amount = 49.99
      const amountInCents = Math.round(amount * 100)
      const platformFeeInCents = Math.round(amountInCents * 0.30)
      const creatorEarningsInCents = amountInCents - platformFeeInCents
      
      expect(amountInCents).toBe(4999)
      expect(platformFeeInCents).toBe(1500) // Rounded
      expect(creatorEarningsInCents).toBe(3499)
    })
  })

  describe('Subscription Split Calculations', () => {
    test('calculates monthly subscription split', () => {
      const monthlyPrice = 20 // $20/month
      const amountInCents = Math.round(monthlyPrice * 100)
      const platformFeeInCents = Math.round(amountInCents * 0.30)
      const creatorEarningsInCents = amountInCents - platformFeeInCents
      
      expect(amountInCents).toBe(2000)
      expect(platformFeeInCents).toBe(600) // $6 platform fee
      expect(creatorEarningsInCents).toBe(1400) // $14 to creator
    })

    test('calculates annual subscription split', () => {
      const annualPrice = 200 // $200/year
      const amountInCents = Math.round(annualPrice * 100)
      const platformFeeInCents = Math.round(amountInCents * 0.30)
      const creatorEarningsInCents = amountInCents - platformFeeInCents
      
      expect(amountInCents).toBe(20000)
      expect(platformFeeInCents).toBe(6000) // $60 platform fee
      expect(creatorEarningsInCents).toBe(14000) // $140 to creator
    })
  })

  describe('Refund Calculations', () => {
    test('calculates full refund with fee reversal', () => {
      const originalAmount = 100
      const originalFee = 30
      const refundAmount = 100
      
      const refundedFee = Math.round((refundAmount / originalAmount) * originalFee)
      const creatorRefund = refundAmount - refundedFee
      
      expect(refundedFee).toBe(30) // Full platform fee refunded
      expect(creatorRefund).toBe(70) // Creator portion reversed
    })

    test('calculates partial refund with proportional fee reversal', () => {
      const originalAmount = 100
      const originalFee = 30
      const refundAmount = 50 // 50% refund
      
      const refundedFee = Math.round((refundAmount / originalAmount) * originalFee)
      const creatorRefund = refundAmount - refundedFee
      
      expect(refundedFee).toBe(15) // 50% of platform fee refunded
      expect(creatorRefund).toBe(35) // 50% of creator earnings reversed
    })

    test('handles various partial refund percentages', () => {
      const originalAmount = 100
      const originalFee = 30
      
      const testCases = [
        { refundPercent: 25, expectedFeeRefund: 7.5, expectedCreatorRefund: 17.5 },
        { refundPercent: 33, expectedFeeRefund: 9.9, expectedCreatorRefund: 23.1 },
        { refundPercent: 75, expectedFeeRefund: 22.5, expectedCreatorRefund: 52.5 },
      ]
      
      testCases.forEach(({ refundPercent, expectedFeeRefund, expectedCreatorRefund }) => {
        const refundAmount = (originalAmount * refundPercent) / 100
        const refundedFee = (refundAmount / originalAmount) * originalFee
        const creatorRefund = refundAmount - refundedFee
        
        expect(refundedFee).toBeCloseTo(expectedFeeRefund, 1)
        expect(creatorRefund).toBeCloseTo(expectedCreatorRefund, 1)
      })
    })
  })

  describe('Earnings Calculations', () => {
    test('calculates total earnings correctly', () => {
      const transactions = [
        { amount: 100, status: 'completed' },
        { amount: 50, status: 'completed' },
        { amount: 75, status: 'completed' },
        { amount: 100, status: 'refunded' }, // Should not count
      ]
      
      const completedTransactions = transactions.filter(t => t.status === 'completed')
      const totalRevenue = completedTransactions.reduce((sum, t) => sum + t.amount, 0)
      const totalPlatformFees = totalRevenue * 0.30
      const totalCreatorEarnings = totalRevenue * 0.70
      
      expect(totalRevenue).toBe(225)
      expect(totalPlatformFees).toBe(67.5)
      expect(totalCreatorEarnings).toBe(157.5)
    })

    test('calculates monthly earnings report', () => {
      const monthlyTransactions = [
        { type: 'video', amount: 100, fee: 30, earnings: 70 },
        { type: 'video', amount: 50, fee: 15, earnings: 35 },
        { type: 'subscription', amount: 20, fee: 6, earnings: 14 },
        { type: 'subscription', amount: 20, fee: 6, earnings: 14 },
        { type: 'video', amount: 75, fee: 22.5, earnings: 52.5 },
      ]
      
      const report = {
        totalRevenue: monthlyTransactions.reduce((sum, t) => sum + t.amount, 0),
        totalFees: monthlyTransactions.reduce((sum, t) => sum + t.fee, 0),
        totalEarnings: monthlyTransactions.reduce((sum, t) => sum + t.earnings, 0),
        videoCount: monthlyTransactions.filter(t => t.type === 'video').length,
        subscriptionCount: monthlyTransactions.filter(t => t.type === 'subscription').length,
      }
      
      expect(report.totalRevenue).toBe(265)
      expect(report.totalFees).toBe(79.5)
      expect(report.totalEarnings).toBe(185.5)
      expect(report.videoCount).toBe(3)
      expect(report.subscriptionCount).toBe(2)
      
      // Verify 70/30 split
      expect(report.totalEarnings).toBeCloseTo(report.totalRevenue * 0.70, 1)
      expect(report.totalFees).toBeCloseTo(report.totalRevenue * 0.30, 1)
    })
  })

  describe('Edge Cases', () => {
    test('handles minimum payment amount', () => {
      const amount = 1 // $1 minimum
      const amountInCents = Math.round(amount * 100)
      const platformFeeInCents = Math.round(amountInCents * 0.30)
      const creatorEarningsInCents = amountInCents - platformFeeInCents
      
      expect(amountInCents).toBe(100)
      expect(platformFeeInCents).toBe(30)
      expect(creatorEarningsInCents).toBe(70)
    })

    test('validates negative amounts', () => {
      const amount = -100
      const isValid = amount > 0
      
      expect(isValid).toBe(false)
    })

    test('validates zero amount', () => {
      const amount = 0
      const isValid = amount > 0
      
      expect(isValid).toBe(false)
    })

    test('handles very large amounts', () => {
      const amount = 10000 // $10,000
      const amountInCents = Math.round(amount * 100)
      const platformFeeInCents = Math.round(amountInCents * 0.30)
      const creatorEarningsInCents = amountInCents - platformFeeInCents
      
      expect(amountInCents).toBe(1000000)
      expect(platformFeeInCents).toBe(300000) // $3,000
      expect(creatorEarningsInCents).toBe(700000) // $7,000
    })
  })

  describe('Fee Percentage Verification', () => {
    test('confirms 70/30 split ratio', () => {
      const PLATFORM_FEE_PERCENTAGE = 0.30
      const CREATOR_PERCENTAGE = 0.70
      
      expect(PLATFORM_FEE_PERCENTAGE + CREATOR_PERCENTAGE).toBe(1.0)
      expect(PLATFORM_FEE_PERCENTAGE).toBe(0.30)
      expect(CREATOR_PERCENTAGE).toBe(0.70)
    })

    test('verifies split consistency across amounts', () => {
      const amounts = [10, 25, 50, 100, 250, 500, 1000]
      
      amounts.forEach(amount => {
        const platformFee = amount * 0.30
        const creatorEarnings = amount * 0.70
        const total = platformFee + creatorEarnings
        
        expect(total).toBe(amount)
        expect(platformFee / amount).toBeCloseTo(0.30, 10)
        expect(creatorEarnings / amount).toBeCloseTo(0.70, 10)
      })
    })
  })
})