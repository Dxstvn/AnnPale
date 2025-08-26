import type { Meta, StoryObj } from '@storybook/react'
import StripePaymentForm from '@/components/payment/stripe-payment-form'
import { Toaster } from '@/components/ui/toaster'

const meta: Meta<typeof StripePaymentForm> = {
  title: 'Payment/StripePaymentForm',
  component: StripePaymentForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Advanced Stripe payment form using Payment Element for multiple payment methods.',
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="min-w-[400px] max-w-[600px] w-full p-4">
        <Toaster />
        <Story />
      </div>
    ),
  ],
  tags: ['autodocs'],
  argTypes: {
    amount: {
      control: { type: 'number', min: 1, max: 10000, step: 0.01 },
      description: 'Payment amount in the specified currency',
    },
    currency: {
      control: { type: 'select' },
      options: ['usd', 'eur', 'gbp', 'cad', 'htg'],
      description: 'Currency code for the payment',
    },
    creatorId: {
      control: 'text',
      description: 'ID of the creator receiving payment',
    },
    requestDetails: {
      control: 'object',
      description: 'Details about the video request',
    },
    onSuccess: {
      action: 'payment-success',
      description: 'Callback when payment is successful',
    },
    onError: {
      action: 'payment-error',
      description: 'Callback when payment fails',
    },
  },
}

export default meta
type Story = StoryObj<typeof StripePaymentForm>

// Default story
export const Default: Story = {
  args: {
    amount: 149.99,
    currency: 'usd',
    creatorId: 'creator-456',
    requestDetails: {
      occasion: 'Birthday',
      recipientName: 'John',
      instructions: 'Please wish John a happy 30th birthday!',
    },
  },
}

// Rush order with higher price
export const RushOrder: Story = {
  args: {
    amount: 199.99,
    currency: 'usd',
    creatorId: 'creator-789',
    requestDetails: {
      occasion: 'Anniversary',
      recipientName: 'Sarah & Mike',
      instructions: 'Congratulate them on their 10th anniversary',
      rushOrder: true,
    },
  },
}

// Birthday request
export const BirthdayRequest: Story = {
  args: {
    amount: 75.00,
    currency: 'usd',
    creatorId: 'creator-birthday',
    requestDetails: {
      occasion: 'Birthday',
      recipientName: 'Emma',
      instructions: 'Wish Emma a happy sweet 16!',
      privateVideo: false,
      allowDownload: true,
    },
  },
}

// Corporate event
export const CorporateEvent: Story = {
  args: {
    amount: 500.00,
    currency: 'usd',
    creatorId: 'creator-corporate',
    requestDetails: {
      occasion: 'Corporate Event',
      recipientName: 'Tech Summit 2025 Attendees',
      instructions: 'Opening keynote message for our annual tech summit',
      privateVideo: true,
    },
  },
}

// Graduation congratulations
export const Graduation: Story = {
  args: {
    amount: 125.00,
    currency: 'usd',
    creatorId: 'creator-grad',
    requestDetails: {
      occasion: 'Graduation',
      recipientName: 'Marcus',
      instructions: 'Congratulate Marcus on graduating from medical school',
    },
  },
}

// Wedding wishes
export const Wedding: Story = {
  args: {
    amount: 250.00,
    currency: 'usd',
    creatorId: 'creator-wedding',
    requestDetails: {
      occasion: 'Wedding',
      recipientName: 'Jessica & David',
      instructions: 'Best wishes for their wedding day on June 15th',
      privateVideo: false,
    },
  },
}

// Haitian Creole request
export const HaitianCreole: Story = {
  args: {
    amount: 8000.00,
    currency: 'htg',
    creatorId: 'creator-haiti',
    requestDetails: {
      occasion: 'Fet',
      recipientName: 'Marie-Claire',
      instructions: 'Swete Marie-Claire bon fet pou 25èm anivèsè li',
      language: 'ht',
    },
  },
}

// Minimal request
export const MinimalRequest: Story = {
  args: {
    amount: 50.00,
    currency: 'usd',
  },
}

// Interactive with callbacks
export const InteractiveWithCallbacks: Story = {
  args: {
    amount: 99.99,
    currency: 'usd',
    creatorId: 'creator-interactive',
    requestDetails: {
      occasion: 'Test Payment',
      recipientName: 'Test User',
      instructions: 'This is a test payment - use card 4242 4242 4242 4242',
    },
    onSuccess: (paymentIntentId) => {
      console.log('Payment successful:', paymentIntentId)
      alert(`Payment successful!\nIntent ID: ${paymentIntentId}`)
    },
    onError: (error) => {
      console.error('Payment failed:', error)
      alert(`Payment failed:\n${error}`)
    },
  },
}

// Loading state (simulated)
export const LoadingState: Story = {
  args: {
    amount: 99.99,
    currency: 'usd',
  },
  parameters: {
    docs: {
      description: {
        story: 'The component shows a loading state while initializing the payment intent.',
      },
    },
  },
}

// Error state (will be shown if API fails)
export const ErrorState: Story = {
  args: {
    amount: -1, // Invalid amount to trigger error
    currency: 'usd',
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows error handling when payment initialization fails.',
      },
    },
  },
}

// Mobile optimized
export const MobileView: Story = {
  args: {
    amount: 75.00,
    currency: 'usd',
    creatorId: 'creator-mobile',
    requestDetails: {
      occasion: 'Get Well',
      recipientName: 'Alex',
      instructions: 'Wishing Alex a speedy recovery',
    },
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

// Tablet view
export const TabletView: Story = {
  args: {
    amount: 125.00,
    currency: 'usd',
    creatorId: 'creator-tablet',
    requestDetails: {
      occasion: 'Congratulations',
      recipientName: 'Team Alpha',
      instructions: 'Congratulate the team on winning the championship',
    },
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
}

// With all payment methods enabled
export const AllPaymentMethods: Story = {
  args: {
    amount: 199.99,
    currency: 'usd',
    creatorId: 'creator-all-methods',
    requestDetails: {
      occasion: 'Special Request',
      recipientName: 'VIP Client',
      instructions: 'Premium personalized message with priority delivery',
    },
  },
  parameters: {
    docs: {
      description: {
        story: `
This story demonstrates the Payment Element which automatically shows all available payment methods based on:
- Customer location
- Currency
- Payment amount
- Stripe account configuration

Payment methods may include:
- Credit/Debit cards
- Apple Pay / Google Pay
- Bank transfers
- Buy now, pay later options
        `,
      },
    },
  },
}