import type { Meta, StoryObj } from '@storybook/react'
import { Button } from './button'
import { ArrowRight, Download, Heart, Play, Plus, Save, Search, Settings, Trash2, User } from 'lucide-react'

const meta = {
  title: 'UI/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'secondary', 'destructive', 'danger', 'success', 'outline', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['xs', 'sm', 'default', 'md', 'lg', 'xl', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'],
    },
    fullWidth: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    asChild: {
      control: 'boolean',
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

// Basic Variants
export const Default: Story = {
  args: {
    children: 'Default Button',
  },
}

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Book Now',
  },
}

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Learn More',
  },
}

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Delete Account',
  },
}

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Payment Successful',
  },
}

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Cancel',
  },
}

export const Ghost: Story = {
  args: {
    variant: 'ghost',
    children: 'Skip',
  },
}

export const Link: Story = {
  args: {
    variant: 'link',
    children: 'View All',
  },
}

// Size Variations
export const ExtraSmall: Story = {
  args: {
    size: 'xs',
    children: 'Extra Small',
  },
}

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small Button',
  },
}

export const Medium: Story = {
  args: {
    size: 'md',
    children: 'Medium Button',
  },
}

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large Button',
  },
}

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
    variant: 'primary',
    children: 'Get Started Now',
  },
}

// Icon Buttons
export const IconButton: Story = {
  args: {
    size: 'icon',
    children: <Settings />,
    'aria-label': 'Settings',
  },
}

export const IconButtonSmall: Story = {
  args: {
    size: 'icon-sm',
    children: <Heart />,
    'aria-label': 'Like',
  },
}

export const IconButtonLarge: Story = {
  args: {
    size: 'icon-lg',
    variant: 'primary',
    children: <Play />,
    'aria-label': 'Play Video',
  },
}

// Buttons with Icons
export const WithLeftIcon: Story = {
  args: {
    variant: 'primary',
    leftIcon: <Plus />,
    children: 'Create Video',
  },
}

export const WithRightIcon: Story = {
  args: {
    rightIcon: <ArrowRight />,
    children: 'Continue',
  },
}

export const WithBothIcons: Story = {
  args: {
    variant: 'secondary',
    leftIcon: <Download />,
    rightIcon: <ArrowRight />,
    children: 'Download Now',
  },
}

// States
export const Loading: Story = {
  args: {
    loading: true,
    children: 'Processing...',
  },
}

export const LoadingPrimary: Story = {
  args: {
    variant: 'primary',
    loading: true,
    children: 'Creating Account...',
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    children: 'Unavailable',
  },
}

export const FullWidth: Story = {
  args: {
    fullWidth: true,
    variant: 'primary',
    children: 'Sign In',
  },
}

// Gradient Primary (Hero CTA)
export const GradientHero: Story = {
  args: {
    variant: 'primary',
    size: 'xl',
    children: 'Start Your Journey',
    rightIcon: <ArrowRight />,
  },
}

// Common Use Cases
export const BookingCTA: Story = {
  args: {
    variant: 'primary',
    size: 'lg',
    children: 'Book Video Message',
    leftIcon: <Play />,
  },
}

export const SaveDraft: Story = {
  args: {
    variant: 'outline',
    leftIcon: <Save />,
    children: 'Save Draft',
  },
}

export const DeleteButton: Story = {
  args: {
    variant: 'danger',
    size: 'sm',
    leftIcon: <Trash2 />,
    children: 'Delete',
  },
}

export const ProfileButton: Story = {
  args: {
    variant: 'ghost',
    leftIcon: <User />,
    children: 'My Profile',
  },
}

export const SearchButton: Story = {
  args: {
    variant: 'secondary',
    leftIcon: <Search />,
    children: 'Search Creators',
  },
}

// Mobile Touch Target (44px minimum)
export const MobileOptimized: Story = {
  args: {
    size: 'md',
    fullWidth: true,
    variant: 'primary',
    children: 'Mobile Optimized (44px height)',
  },
}

// Button Group Example
export const ButtonGroup: Story = {
  render: () => (
    <div className="flex gap-2">
      <Button variant="primary">Save & Continue</Button>
      <Button variant="outline">Save Draft</Button>
      <Button variant="ghost">Cancel</Button>
    </div>
  ),
}

// Responsive Button
export const ResponsiveButton: Story = {
  render: () => (
    <Button 
      variant="primary"
      className="w-full sm:w-auto"
    >
      Responsive Button
    </Button>
  ),
}