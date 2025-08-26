/**
 * Payment utility functions for the Fan Dashboard
 * These functions handle payment calculations, validations, and currency conversions
 */

export type PaymentProvider = 'stripe' | 'moncash' | 'paypal'
export type CurrencyCode = 'USD' | 'HTG' | 'EUR'

export interface PaymentFees {
  percentageFee: number
  fixedFee: number
}

export interface PaymentValidation {
  isValid: boolean
  error?: string
}

// Exchange rates (should be fetched from an API in production)
const EXCHANGE_RATES = {
  USD_TO_HTG: 150,
  EUR_TO_HTG: 165,
  USD_TO_EUR: 0.92,
  EUR_TO_USD: 1.09
}

// Payment provider configurations
const PAYMENT_CONFIGS = {
  stripe: {
    percentageFee: 2.9,
    fixedFee: 0.30,
    minAmount: 1,
    maxAmount: 10000,
    supportedCurrencies: ['USD', 'EUR'],
  },
  moncash: {
    percentageFee: 3,
    fixedFee: 10, // HTG
    minAmount: 50,
    maxAmount: 500000,
    supportedCurrencies: ['HTG'],
  },
  paypal: {
    percentageFee: 3.49,
    fixedFee: 0.49,
    minAmount: 1,
    maxAmount: 10000,
    supportedCurrencies: ['USD', 'EUR'],
  }
}

/**
 * Calculate processing fees for a payment
 */
export function calculateProcessingFees(
  amount: number,
  provider: PaymentProvider
): { subtotal: number; fee: number; total: number } {
  const config = PAYMENT_CONFIGS[provider]
  if (!config) {
    throw new Error(`Invalid payment provider: ${provider}`)
  }

  const percentageFee = (amount * config.percentageFee) / 100
  const totalFee = Number((percentageFee + config.fixedFee).toFixed(2))
  const total = Number((amount + totalFee).toFixed(2))

  return {
    subtotal: amount,
    fee: totalFee,
    total
  }
}

/**
 * Convert currency between different codes
 */
export function convertCurrency(
  amount: number,
  from: CurrencyCode,
  to: CurrencyCode
): number {
  if (from === to) return amount

  let rate = 1

  if (from === 'USD' && to === 'HTG') {
    rate = EXCHANGE_RATES.USD_TO_HTG
  } else if (from === 'HTG' && to === 'USD') {
    rate = 1 / EXCHANGE_RATES.USD_TO_HTG
  } else if (from === 'EUR' && to === 'HTG') {
    rate = EXCHANGE_RATES.EUR_TO_HTG
  } else if (from === 'HTG' && to === 'EUR') {
    rate = 1 / EXCHANGE_RATES.EUR_TO_HTG
  } else if (from === 'USD' && to === 'EUR') {
    rate = EXCHANGE_RATES.USD_TO_EUR
  } else if (from === 'EUR' && to === 'USD') {
    rate = EXCHANGE_RATES.EUR_TO_USD
  }

  // Round HTG to no decimal places, others to 2 decimal places
  const converted = amount * rate
  return to === 'HTG' ? Math.round(converted) : Number(converted.toFixed(2))
}

/**
 * Validate payment amount for a specific provider
 */
export function validatePaymentAmount(
  amount: number,
  provider: PaymentProvider,
  currency: CurrencyCode
): PaymentValidation {
  const config = PAYMENT_CONFIGS[provider]
  
  if (!config) {
    return { isValid: false, error: 'Invalid payment provider' }
  }

  if (!config.supportedCurrencies.includes(currency)) {
    return { 
      isValid: false, 
      error: `${provider} does not support ${currency}` 
    }
  }

  // Convert amount to provider's base currency for validation
  let validationAmount = amount
  if (provider === 'moncash' && currency !== 'HTG') {
    validationAmount = convertCurrency(amount, currency, 'HTG')
  } else if (provider !== 'moncash' && currency === 'HTG') {
    validationAmount = convertCurrency(amount, 'HTG', 'USD')
  }

  if (validationAmount < config.minAmount) {
    return {
      isValid: false,
      error: `Minimum amount is ${formatCurrency(config.minAmount, provider === 'moncash' ? 'HTG' : 'USD')}`
    }
  }

  if (validationAmount > config.maxAmount) {
    return {
      isValid: false,
      error: `Maximum amount is ${formatCurrency(config.maxAmount, provider === 'moncash' ? 'HTG' : 'USD')}`
    }
  }

  return { isValid: true }
}

/**
 * Format currency with proper symbol and decimals
 */
export function formatCurrency(amount: number, currency: CurrencyCode): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: currency === 'HTG' ? 0 : 2,
    maximumFractionDigits: currency === 'HTG' ? 0 : 2
  })
  return formatter.format(amount)
}

/**
 * Get exchange rate between two currencies
 */
export function getExchangeRate(from: CurrencyCode, to: CurrencyCode): number {
  if (from === to) return 1

  if (from === 'USD' && to === 'HTG') return EXCHANGE_RATES.USD_TO_HTG
  if (from === 'HTG' && to === 'USD') return 1 / EXCHANGE_RATES.USD_TO_HTG
  if (from === 'EUR' && to === 'HTG') return EXCHANGE_RATES.EUR_TO_HTG
  if (from === 'HTG' && to === 'EUR') return 1 / EXCHANGE_RATES.EUR_TO_HTG
  if (from === 'USD' && to === 'EUR') return EXCHANGE_RATES.USD_TO_EUR
  if (from === 'EUR' && to === 'USD') return EXCHANGE_RATES.EUR_TO_USD

  throw new Error(`Exchange rate not available for ${from} to ${to}`)
}

/**
 * Calculate refund amount based on order status and reason
 */
export function calculateRefundAmount(
  originalAmount: number,
  status: string,
  reason: string
): number {
  // Full refund for creator-cancelled or system errors
  if (reason === 'creator_cancelled' || reason === 'system_error') {
    return originalAmount
  }

  // Partial refund based on status
  switch (status) {
    case 'pending':
      return originalAmount // Full refund if not accepted yet
    case 'accepted':
      return originalAmount * 0.9 // 90% refund if accepted but not started
    case 'recording':
      return originalAmount * 0.5 // 50% refund if recording started
    case 'processing':
      return 0 // No refund once processing
    case 'completed':
      return 0 // No refund for completed orders
    default:
      return originalAmount // Default to full refund
  }
}

/**
 * Determine best payment method based on user location
 */
export function getRecommendedPaymentMethod(
  countryCode: string,
  availableMethods: PaymentProvider[]
): PaymentProvider | null {
  // Haiti - recommend MonCash
  if (countryCode === 'HT' && availableMethods.includes('moncash')) {
    return 'moncash'
  }
  
  // US, Canada, Europe - recommend Stripe
  if (['US', 'CA', 'GB', 'FR', 'DE'].includes(countryCode) && availableMethods.includes('stripe')) {
    return 'stripe'
  }
  
  // Default to first available method
  return availableMethods[0] || null
}