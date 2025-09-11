// Stripe mock implementation
export const mockStripeInstance = {
  accounts: {
    create: jest.fn(),
    retrieve: jest.fn(),
    update: jest.fn(),
  },
  accountLinks: {
    create: jest.fn(),
  },
  paymentIntents: {
    create: jest.fn(),
    confirm: jest.fn(),
    retrieve: jest.fn(),
  },
  transfers: {
    list: jest.fn(),
  },
  refunds: {
    create: jest.fn(),
  },
  applicationFees: {
    listRefunds: jest.fn(),
  },
  products: {
    create: jest.fn(),
  },
  prices: {
    create: jest.fn(),
  },
  subscriptions: {
    create: jest.fn(),
    cancel: jest.fn(),
  },
  invoices: {
    retrieveUpcoming: jest.fn(),
    retrieve: jest.fn(),
  },
}

export const mockSupabaseClient = {
  from: jest.fn().mockReturnThis(),
  select: jest.fn().mockReturnThis(),
  insert: jest.fn().mockReturnThis(),
  update: jest.fn().mockReturnThis(),
  eq: jest.fn().mockReturnThis(),
  single: jest.fn(),
  gte: jest.fn().mockReturnThis(),
  lte: jest.fn().mockReturnThis(),
}