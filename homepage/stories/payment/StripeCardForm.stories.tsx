import type { Meta, StoryObj } from '@storybook/react'
import StripeCardForm from '@/components/payment/stripe-card-form'
import { Toaster } from '@/components/ui/toaster'

const meta: Meta<typeof StripeCardForm> = {
  title: 'Payment/StripeCardForm',
  component: StripeCardForm,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'A Stripe card payment form component with built-in validation and error handling.',
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
    description: {
      control: 'text',
      description: 'Optional description for the payment',
    },
    metadata: {
      control: 'object',
      description: 'Additional metadata to attach to the payment',
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
type Story = StoryObj<typeof StripeCardForm>

// Default story
export const Default: Story = {
  args: {
    amount: 99.99,
    currency: 'usd',
    description: 'Video request from Jean Baptiste',
  },
}

// Small amount payment
export const SmallAmount: Story = {
  args: {
    amount: 5.00,
    currency: 'usd',
    description: 'Quick shoutout video',
  },
}

// Large amount payment
export const LargeAmount: Story = {
  args: {
    amount: 500.00,
    currency: 'usd',
    description: 'Premium video package',
  },
}

// Euro currency
export const EuroCurrency: Story = {
  args: {
    amount: 89.99,
    currency: 'eur',
    description: 'Video message request',
  },
}

// Haitian Gourde currency
export const HaitianGourde: Story = {
  args: {
    amount: 5000.00,
    currency: 'htg',
    description: 'Mesaj videyo pèsonalize',
  },
}

// With metadata
export const WithMetadata: Story = {
  args: {
    amount: 149.99,
    currency: 'usd',
    description: 'Birthday video message',
    metadata: {
      creatorId: 'creator-123',
      creatorName: 'Michel Martelly',
      occasion: 'birthday',
      recipientName: 'Marie',
      rushOrder: 'true',
      privateVideo: 'false',
    },
  },
}

// No description
export const NoDescription: Story = {
  args: {
    amount: 75.00,
    currency: 'usd',
  },
}

// Interactive story with custom handlers
export const Interactive: Story = {
  args: {
    amount: 99.99,
    currency: 'usd',
    description: 'Test payment - use test card 4242 4242 4242 4242',
    onSuccess: (paymentIntentId) => {
      console.log('Payment successful:', paymentIntentId)
      alert(`Payment successful! Intent ID: ${paymentIntentId}`)
    },
    onError: (error) => {
      console.error('Payment failed:', error)
      alert(`Payment failed: ${error}`)
    },
  },
}

// Loading state simulation (component handles this internally)
export const TestMode: Story = {
  args: {
    amount: 50.00,
    currency: 'usd',
    description: 'Test mode - Use test cards from the form',
  },
  parameters: {
    docs: {
      description: {
        story: `
Test card numbers you can use:
- **Success**: 4242 4242 4242 4242
- **3D Secure**: 4000 0025 0000 3155
- **Declined**: 4000 0000 0000 9995
- **Insufficient Funds**: 4000 0000 0000 9995

Use any future expiration date (e.g., 12/34) and any 3-digit CVC.
        `,
      },
    },
  },
}

// Mobile view
export const MobileView: Story = {
  args: {
    amount: 29.99,
    currency: 'usd',
    description: 'Mobile-optimized payment form',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

// Dark mode (if your app supports it)
export const DarkMode: Story = {
  args: {
    amount: 99.99,
    currency: 'usd',
    description: 'Dark mode payment form',
  },
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
  decorators: [
    (Story) => (
      <div className="dark min-w-[400px] max-w-[600px] w-full p-4">
        <Toaster />
        <Story />
      </div>
    ),
  ],
}

// Accessibility focused
export const Accessible: Story = {
  args: {
    amount: 99.99,
    currency: 'usd',
    description: 'Fully accessible payment form with ARIA labels',
  },
  parameters: {
    a11y: {
      config: {
        rules: [
          {
            id: 'color-contrast',
            enabled: true,
          },
        ],
      },
    },
  },
}