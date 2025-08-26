/**
 * Unit tests for payment utility functions
 */

import {
  calculateProcessingFees,
  convertCurrency,
  validatePaymentAmount,
  formatCurrency,
  getExchangeRate,
  calculateRefundAmount,
  getRecommendedPaymentMethod
} from '@/lib/utils/payment'

describe('Payment Utilities', () => {
  describe('calculateProcessingFees', () => {
    it('should calculate Stripe fees correctly', () => {
      const result = calculateProcessingFees(100, 'stripe')
      expect(result.subtotal).toBe(100)
      expect(result.fee).toBe(3.20) // 2.9% + $0.30
      expect(result.total).toBe(103.20)
    })

    it('should calculate MonCash fees correctly', () => {
      const result = calculateProcessingFees(1000, 'moncash')
      expect(result.subtotal).toBe(1000)
      expect(result.fee).toBe(40) // 3% + 10 HTG
      expect(result.total).toBe(1040)
    })

    it('should calculate PayPal fees correctly', () => {
      const result = calculateProcessingFees(50, 'paypal')
      expect(result.subtotal).toBe(50)
      expect(result.fee).toBe(2.24) // 3.49% + $0.49
      expect(result.total).toBe(52.24)
    })

    it('should handle zero amount', () => {
      const result = calculateProcessingFees(0, 'stripe')
      expect(result.subtotal).toBe(0)
      expect(result.fee).toBe(0.30) // Fixed fee still applies
      expect(result.total).toBe(0.30)
    })

    it('should round to 2 decimal places', () => {
      const result = calculateProcessingFees(33.33, 'stripe')
      expect(result.fee).toBe(1.27) // (33.33 * 0.029) + 0.30 = 1.27
      expect(result.total).toBe(34.60)
    })

    it('should throw error for invalid provider', () => {
      expect(() => {
        calculateProcessingFees(100, 'invalid' as any)
      }).toThrow('Invalid payment provider: invalid')
    })
  })

  describe('convertCurrency', () => {
    it('should return same amount for same currency', () => {
      expect(convertCurrency(100, 'USD', 'USD')).toBe(100)
      expect(convertCurrency(500, 'HTG', 'HTG')).toBe(500)
    })

    it('should convert USD to HTG', () => {
      const result = convertCurrency(10, 'USD', 'HTG')
      expect(result).toBe(1500) // 10 * 150
    })

    it('should convert HTG to USD', () => {
      const result = convertCurrency(1500, 'HTG', 'USD')
      expect(result).toBe(10.00)
    })

    it('should convert EUR to HTG', () => {
      const result = convertCurrency(10, 'EUR', 'HTG')
      expect(result).toBe(1650) // 10 * 165
    })

    it('should convert HTG to EUR', () => {
      const result = convertCurrency(1650, 'HTG', 'EUR')
      expect(result).toBe(10.00)
    })

    it('should convert USD to EUR', () => {
      const result = convertCurrency(100, 'USD', 'EUR')
      expect(result).toBe(92.00) // 100 * 0.92
    })

    it('should convert EUR to USD', () => {
      const result = convertCurrency(100, 'EUR', 'USD')
      expect(result).toBe(109.00) // 100 * 1.09
    })

    it('should round HTG to no decimal places', () => {
      const result = convertCurrency(10.33, 'USD', 'HTG')
      expect(result).toBe(1550) // 10.33 * 150 = 1549.5, rounded to 1550
    })

    it('should round other currencies to 2 decimal places', () => {
      const result = convertCurrency(10.336, 'USD', 'EUR')
      expect(result).toBe(9.51) // 10.336 * 0.92 = 9.509, rounded to 9.51
    })
  })

  describe('validatePaymentAmount', () => {
    it('should validate valid Stripe amount', () => {
      const result = validatePaymentAmount(50, 'stripe', 'USD')
      expect(result.isValid).toBe(true)
      expect(result.error).toBeUndefined()
    })

    it('should reject amount below minimum for Stripe', () => {
      const result = validatePaymentAmount(0.5, 'stripe', 'USD')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('Minimum amount')
    })

    it('should reject amount above maximum for Stripe', () => {
      const result = validatePaymentAmount(15000, 'stripe', 'USD')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('Maximum amount')
    })

    it('should validate valid MonCash amount', () => {
      const result = validatePaymentAmount(1000, 'moncash', 'HTG')
      expect(result.isValid).toBe(true)
    })

    it('should reject amount below minimum for MonCash', () => {
      const result = validatePaymentAmount(25, 'moncash', 'HTG')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('Minimum amount')
    })

    it('should reject unsupported currency for provider', () => {
      const result = validatePaymentAmount(100, 'moncash', 'USD')
      expect(result.isValid).toBe(false)
      expect(result.error).toContain('does not support USD')
    })

    it('should handle currency conversion for validation', () => {
      // MonCash with USD amount (should convert to HTG for validation)
      const result = validatePaymentAmount(1, 'moncash', 'USD')
      expect(result.isValid).toBe(false) // 1 USD = 150 HTG, min is 50 HTG
      expect(result.error).toContain('does not support USD')
    })

    it('should reject invalid provider', () => {
      const result = validatePaymentAmount(100, 'invalid' as any, 'USD')
      expect(result.isValid).toBe(false)
      expect(result.error).toBe('Invalid payment provider')
    })
  })

  describe('formatCurrency', () => {
    it('should format USD correctly', () => {
      expect(formatCurrency(100, 'USD')).toBe('$100.00')
      expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56')
      expect(formatCurrency(0.5, 'USD')).toBe('$0.50')
    })

    it('should format HTG without decimal places', () => {
      expect(formatCurrency(1500, 'HTG')).toBe('HTG 1,500')
      expect(formatCurrency(150.99, 'HTG')).toBe('HTG 151')
    })

    it('should format EUR correctly', () => {
      expect(formatCurrency(100, 'EUR')).toBe('€100.00')
      expect(formatCurrency(1234.56, 'EUR')).toBe('€1,234.56')
    })

    it('should handle zero amount', () => {
      expect(formatCurrency(0, 'USD')).toBe('$0.00')
      expect(formatCurrency(0, 'HTG')).toBe('HTG 0')
    })

    it('should handle negative amounts', () => {
      expect(formatCurrency(-100, 'USD')).toBe('-$100.00')
      expect(formatCurrency(-1500, 'HTG')).toBe('-HTG 1,500')
    })
  })

  describe('getExchangeRate', () => {
    it('should return 1 for same currency', () => {
      expect(getExchangeRate('USD', 'USD')).toBe(1)
      expect(getExchangeRate('HTG', 'HTG')).toBe(1)
    })

    it('should get USD to HTG rate', () => {
      expect(getExchangeRate('USD', 'HTG')).toBe(150)
    })

    it('should get HTG to USD rate', () => {
      expect(getExchangeRate('HTG', 'USD')).toBeCloseTo(0.00667, 4)
    })

    it('should get EUR to HTG rate', () => {
      expect(getExchangeRate('EUR', 'HTG')).toBe(165)
    })

    it('should get HTG to EUR rate', () => {
      expect(getExchangeRate('HTG', 'EUR')).toBeCloseTo(0.00606, 4)
    })

    it('should get USD to EUR rate', () => {
      expect(getExchangeRate('USD', 'EUR')).toBe(0.92)
    })

    it('should get EUR to USD rate', () => {
      expect(getExchangeRate('EUR', 'USD')).toBe(1.09)
    })

    it('should throw error for unsupported conversion', () => {
      expect(() => {
        getExchangeRate('GBP' as any, 'JPY' as any)
      }).toThrow('Exchange rate not available')
    })
  })

  describe('calculateRefundAmount', () => {
    it('should give full refund for creator cancelled', () => {
      expect(calculateRefundAmount(100, 'recording', 'creator_cancelled')).toBe(100)
    })

    it('should give full refund for system error', () => {
      expect(calculateRefundAmount(100, 'processing', 'system_error')).toBe(100)
    })

    it('should give full refund for pending status', () => {
      expect(calculateRefundAmount(100, 'pending', 'customer_request')).toBe(100)
    })

    it('should give 90% refund for accepted status', () => {
      expect(calculateRefundAmount(100, 'accepted', 'customer_request')).toBe(90)
    })

    it('should give 50% refund for recording status', () => {
      expect(calculateRefundAmount(100, 'recording', 'customer_request')).toBe(50)
    })

    it('should give no refund for processing status', () => {
      expect(calculateRefundAmount(100, 'processing', 'customer_request')).toBe(0)
    })

    it('should give no refund for completed status', () => {
      expect(calculateRefundAmount(100, 'completed', 'customer_request')).toBe(0)
    })

    it('should give full refund for unknown status', () => {
      expect(calculateRefundAmount(100, 'unknown', 'customer_request')).toBe(100)
    })

    it('should handle zero amount', () => {
      expect(calculateRefundAmount(0, 'accepted', 'customer_request')).toBe(0)
    })
  })

  describe('getRecommendedPaymentMethod', () => {
    it('should recommend MonCash for Haiti', () => {
      expect(getRecommendedPaymentMethod('HT', ['stripe', 'moncash'])).toBe('moncash')
    })

    it('should recommend Stripe for US', () => {
      expect(getRecommendedPaymentMethod('US', ['stripe', 'moncash', 'paypal'])).toBe('stripe')
    })

    it('should recommend Stripe for Canada', () => {
      expect(getRecommendedPaymentMethod('CA', ['stripe', 'paypal'])).toBe('stripe')
    })

    it('should recommend Stripe for UK', () => {
      expect(getRecommendedPaymentMethod('GB', ['stripe', 'paypal'])).toBe('stripe')
    })

    it('should return first available for unknown country', () => {
      expect(getRecommendedPaymentMethod('JP', ['paypal', 'stripe'])).toBe('paypal')
    })

    it('should return null if no methods available', () => {
      expect(getRecommendedPaymentMethod('US', [])).toBeNull()
    })

    it('should handle MonCash not available for Haiti', () => {
      expect(getRecommendedPaymentMethod('HT', ['stripe', 'paypal'])).toBe('stripe')
    })

    it('should handle Stripe not available for supported countries', () => {
      expect(getRecommendedPaymentMethod('US', ['paypal', 'moncash'])).toBe('paypal')
    })
  })
})