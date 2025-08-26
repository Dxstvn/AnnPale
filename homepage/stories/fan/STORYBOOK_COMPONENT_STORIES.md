# Storybook Component Stories for Fan Dashboard

## Overview
These Storybook stories document and test all component states for the Fan Dashboard. Each story represents a specific component state or variation, allowing for visual testing and documentation.

## Setup

### Storybook Configuration
```typescript
// .storybook/main.ts
import type { StorybookConfig } from '@storybook/nextjs'

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx|mdx)'],
  addons: [
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
    '@storybook/addon-a11y',
    '@storybook/addon-viewport',
  ],
  framework: {
    name: '@storybook/nextjs',
    options: {},
  },
}

export default config
```

### Decorators
```typescript
// .storybook/preview.tsx
import type { Preview } from '@storybook/react'
import '../app/globals.css'

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  decorators: [
    (Story) => (
      <div className="min-h-screen bg-gray-50 p-8">
        <Story />
      </div>
    ),
  ],
}

export default preview
```

## 1. Creator Card Component

```typescript
// stories/fan/CreatorCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { CreatorCard } from '@/components/fan/CreatorCard'

const meta: Meta<typeof CreatorCard> = {
  title: 'Fan/CreatorCard',
  component: CreatorCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    creator: {
      description: 'Creator data object',
    },
    onSelect: {
      description: 'Callback when creator is selected',
      action: 'selected',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Default state
export const Default: Story = {
  args: {
    creator: {
      id: '1',
      name: 'Marie Jean',
      category: 'Music',
      avatar: '/placeholder.svg',
      rating: 4.9,
      price: 75,
      responseTime: '24h',
      completedVideos: 523,
      isAvailable: true,
    },
  },
}

// Loading state
export const Loading: Story = {
  args: {
    creator: undefined,
    isLoading: true,
  },
  render: () => (
    <div className="w-80">
      <div className="animate-pulse">
        <div className="h-48 bg-gray-200 rounded-t-lg" />
        <div className="p-4 space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4" />
          <div className="h-4 bg-gray-200 rounded w-1/2" />
        </div>
      </div>
    </div>
  ),
}

// Selected state
export const Selected: Story = {
  args: {
    ...Default.args,
    selected: true,
  },
  render: (args) => (
    <div className="ring-2 ring-purple-600 rounded-lg">
      <CreatorCard {...args} />
    </div>
  ),
}

// Unavailable state
export const Unavailable: Story = {
  args: {
    creator: {
      ...Default.args.creator,
      isAvailable: false,
    },
  },
  render: (args) => (
    <div className="opacity-50 pointer-events-none">
      <CreatorCard {...args} />
      <div className="absolute inset-0 flex items-center justify-center bg-black/20 rounded-lg">
        <span className="bg-white px-3 py-1 rounded-full text-sm font-medium">
          Currently Unavailable
        </span>
      </div>
    </div>
  ),
}

// With badges (Premium/Verified)
export const WithBadges: Story = {
  args: {
    creator: {
      ...Default.args.creator,
      isPremium: true,
      isVerified: true,
      badges: ['Top Creator', 'Fast Response'],
    },
  },
}

// Different price points
export const PriceVariations: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-4">
      <CreatorCard
        creator={{
          ...Default.args.creator,
          name: 'Budget Creator',
          price: 25,
        }}
      />
      <CreatorCard
        creator={{
          ...Default.args.creator,
          name: 'Standard Creator',
          price: 75,
        }}
      />
      <CreatorCard
        creator={{
          ...Default.args.creator,
          name: 'Premium Creator',
          price: 200,
        }}
      />
    </div>
  ),
}

// Interactive hover state
export const HoverInteraction: Story = {
  args: Default.args,
  parameters: {
    pseudo: { hover: true },
  },
}
```

## 2. Video Player Component

```typescript
// stories/fan/VideoPlayer.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { VideoPlayer } from '@/components/fan/VideoPlayer'

const meta: Meta<typeof VideoPlayer> = {
  title: 'Fan/VideoPlayer',
  component: VideoPlayer,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    video: {
      description: 'Video data object',
    },
    onClose: {
      action: 'closed',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

const mockVideo = {
  id: '1',
  creatorName: 'Marie Jean',
  creatorAvatar: '/placeholder.svg',
  videoUrl: 'https://test-videos.com/sample.mp4',
  thumbnailUrl: '/placeholder.svg',
  duration: '2:34',
  occasion: 'Birthday',
  recipientName: 'Sarah',
}

// Playing state
export const Playing: Story = {
  args: {
    video: mockVideo,
    autoPlay: true,
  },
}

// Paused state
export const Paused: Story = {
  args: {
    video: mockVideo,
    autoPlay: false,
  },
}

// Buffering state
export const Buffering: Story = {
  args: {
    video: mockVideo,
    isBuffering: true,
  },
  render: (args) => (
    <VideoPlayer {...args}>
      <div className="absolute inset-0 flex items-center justify-center bg-black/50">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-white border-t-transparent" />
      </div>
    </VideoPlayer>
  ),
}

// Error state
export const Error: Story = {
  args: {
    video: {
      ...mockVideo,
      videoUrl: 'invalid-url',
    },
    error: 'Failed to load video',
  },
  render: (args) => (
    <VideoPlayer {...args}>
      <div className="absolute inset-0 flex items-center justify-center bg-black/80">
        <div className="text-white text-center">
          <p className="text-xl mb-2">Video Unavailable</p>
          <p className="text-sm opacity-80">Please try again later</p>
        </div>
      </div>
    </VideoPlayer>
  ),
}

// With controls visible
export const WithControls: Story = {
  args: {
    video: mockVideo,
    showControls: true,
  },
}

// Without controls (clean view)
export const WithoutControls: Story = {
  args: {
    video: mockVideo,
    showControls: false,
  },
}

// Fullscreen mode
export const FullscreenMode: Story = {
  args: {
    video: mockVideo,
    isFullscreen: true,
  },
  parameters: {
    layout: 'fullscreen',
    viewport: {
      defaultViewport: 'responsive',
    },
  },
}

// Mobile player
export const MobilePlayer: Story = {
  args: {
    video: mockVideo,
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphone12',
    },
  },
}
```

## 3. Order Timeline Component

```typescript
// stories/fan/OrderTimeline.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { OrderTimeline } from '@/components/fan/OrderTimeline'

const meta: Meta<typeof OrderTimeline> = {
  title: 'Fan/OrderTimeline',
  component: OrderTimeline,
  parameters: {
    layout: 'padded',
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Pending order
export const PendingOrder: Story = {
  args: {
    steps: [
      {
        id: 'placed',
        title: 'Order Placed',
        description: 'Your request has been submitted',
        timestamp: '2024-03-20T10:00:00',
        completed: true,
        current: false,
      },
      {
        id: 'payment',
        title: 'Payment Confirmed',
        description: 'Payment processed successfully',
        timestamp: '2024-03-20T10:01:00',
        completed: true,
        current: false,
      },
      {
        id: 'accepted',
        title: 'Pending Acceptance',
        description: 'Waiting for creator to accept',
        completed: false,
        current: true,
      },
      {
        id: 'recording',
        title: 'Recording',
        description: 'Creator will record your video',
        completed: false,
        current: false,
      },
      {
        id: 'delivered',
        title: 'Delivered',
        description: 'Video ready to watch',
        completed: false,
        current: false,
      },
    ],
  },
}

// Recording in progress
export const RecordingOrder: Story = {
  args: {
    steps: [
      {
        id: 'placed',
        title: 'Order Placed',
        description: 'Your request has been submitted',
        timestamp: '2024-03-20T10:00:00',
        completed: true,
        current: false,
      },
      {
        id: 'payment',
        title: 'Payment Confirmed',
        description: 'Payment processed successfully',
        timestamp: '2024-03-20T10:01:00',
        completed: true,
        current: false,
      },
      {
        id: 'accepted',
        title: 'Creator Accepted',
        description: 'Marie Jean accepted your request',
        timestamp: '2024-03-20T11:00:00',
        completed: true,
        current: false,
      },
      {
        id: 'recording',
        title: 'Recording Video',
        description: 'Creator is recording your video',
        timestamp: '2024-03-20T14:00:00',
        completed: false,
        current: true,
        progress: 65,
      },
      {
        id: 'delivered',
        title: 'Delivered',
        description: 'Video ready to watch',
        completed: false,
        current: false,
      },
    ],
  },
}

// Completed order
export const CompletedOrder: Story = {
  args: {
    steps: [
      {
        id: 'placed',
        title: 'Order Placed',
        description: 'Your request has been submitted',
        timestamp: '2024-03-20T10:00:00',
        completed: true,
        current: false,
      },
      {
        id: 'payment',
        title: 'Payment Confirmed',
        description: 'Payment processed successfully',
        timestamp: '2024-03-20T10:01:00',
        completed: true,
        current: false,
      },
      {
        id: 'accepted',
        title: 'Creator Accepted',
        description: 'Marie Jean accepted your request',
        timestamp: '2024-03-20T11:00:00',
        completed: true,
        current: false,
      },
      {
        id: 'recording',
        title: 'Video Recorded',
        description: 'Video recording completed',
        timestamp: '2024-03-20T14:00:00',
        completed: true,
        current: false,
      },
      {
        id: 'delivered',
        title: 'Delivered',
        description: 'Video ready to watch!',
        timestamp: '2024-03-20T14:30:00',
        completed: true,
        current: true,
      },
    ],
  },
}

// Cancelled order
export const CancelledOrder: Story = {
  args: {
    steps: [
      {
        id: 'placed',
        title: 'Order Placed',
        description: 'Your request has been submitted',
        timestamp: '2024-03-20T10:00:00',
        completed: true,
        current: false,
      },
      {
        id: 'payment',
        title: 'Payment Confirmed',
        description: 'Payment processed successfully',
        timestamp: '2024-03-20T10:01:00',
        completed: true,
        current: false,
      },
      {
        id: 'cancelled',
        title: 'Order Cancelled',
        description: 'Order was cancelled by customer',
        timestamp: '2024-03-20T11:00:00',
        completed: true,
        current: true,
        error: true,
      },
      {
        id: 'refunded',
        title: 'Refund Processed',
        description: 'Payment refunded to original method',
        timestamp: '2024-03-20T11:05:00',
        completed: true,
        current: false,
      },
    ],
    cancelled: true,
  },
}

// With multiple status updates
export const DetailedTimeline: Story = {
  args: {
    steps: [
      {
        id: 'placed',
        title: 'Order Placed',
        description: 'Your request has been submitted',
        timestamp: '2024-03-20T10:00:00',
        completed: true,
        updates: [
          { message: 'Order received', time: '10:00 AM' },
          { message: 'Payment processing', time: '10:00 AM' },
        ],
      },
      {
        id: 'payment',
        title: 'Payment Confirmed',
        description: 'Payment processed via Stripe',
        timestamp: '2024-03-20T10:01:00',
        completed: true,
        updates: [
          { message: 'Card charged successfully', time: '10:01 AM' },
          { message: 'Receipt sent to email', time: '10:01 AM' },
        ],
      },
      {
        id: 'accepted',
        title: 'Creator Accepted',
        description: 'Marie Jean accepted your request',
        timestamp: '2024-03-20T11:00:00',
        completed: true,
        updates: [
          { message: 'Creator notified', time: '10:05 AM' },
          { message: 'Creator viewed request', time: '10:45 AM' },
          { message: 'Request accepted', time: '11:00 AM' },
        ],
      },
      {
        id: 'recording',
        title: 'Recording',
        description: 'Video in progress',
        timestamp: '2024-03-20T14:00:00',
        completed: false,
        current: true,
        updates: [
          { message: 'Recording started', time: '2:00 PM' },
          { message: '50% complete', time: '2:15 PM' },
        ],
      },
    ],
  },
}
```

## 4. Payment Method Selector Component

```typescript
// stories/fan/PaymentMethodSelector.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { PaymentMethodSelector } from '@/components/payment/PaymentMethodSelector'

const meta: Meta<typeof PaymentMethodSelector> = {
  title: 'Fan/PaymentMethodSelector',
  component: PaymentMethodSelector,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    amount: {
      control: { type: 'number', min: 1, max: 1000 },
    },
    onMethodSelect: { action: 'selected' },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Haiti location - MonCash recommended
export const HaitiLocation: Story = {
  args: {
    amount: 75,
    userLocation: {
      country: 'Haiti',
      country_code: 'HT',
      city: 'Port-au-Prince',
      is_haiti: true,
    },
  },
  render: (args) => (
    <div className="w-full max-w-2xl">
      <PaymentMethodSelector {...args} />
    </div>
  ),
}

// US location - Stripe recommended
export const USLocation: Story = {
  args: {
    amount: 75,
    userLocation: {
      country: 'United States',
      country_code: 'US',
      city: 'New York',
      is_haiti: false,
    },
  },
  render: (args) => (
    <div className="w-full max-w-2xl">
      <PaymentMethodSelector {...args} />
    </div>
  ),
}

// Loading state (detecting location)
export const LoadingLocation: Story = {
  args: {
    amount: 75,
    isDetectingLocation: true,
  },
  render: (args) => (
    <div className="w-full max-w-2xl">
      <PaymentMethodSelector {...args} />
    </div>
  ),
}

// Error state (location detection failed)
export const LocationError: Story = {
  args: {
    amount: 75,
    error: 'Could not detect your location. Showing all payment options.',
  },
  render: (args) => (
    <div className="w-full max-w-2xl">
      <PaymentMethodSelector {...args} />
    </div>
  ),
}

// With selected method
export const MethodSelected: Story = {
  args: {
    amount: 75,
    selectedMethod: 'stripe',
    userLocation: {
      country: 'United States',
      country_code: 'US',
    },
  },
  render: (args) => (
    <div className="w-full max-w-2xl">
      <PaymentMethodSelector {...args} />
    </div>
  ),
}

// Different amounts
export const AmountVariations: Story = {
  render: () => (
    <div className="space-y-8">
      <div>
        <h3 className="text-lg font-semibold mb-4">Small Amount ($25)</h3>
        <PaymentMethodSelector amount={25} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Medium Amount ($100)</h3>
        <PaymentMethodSelector amount={100} />
      </div>
      <div>
        <h3 className="text-lg font-semibold mb-4">Large Amount ($500)</h3>
        <PaymentMethodSelector amount={500} />
      </div>
    </div>
  ),
}

// Mobile view
export const MobileView: Story = {
  args: {
    amount: 75,
  },
  parameters: {
    viewport: {
      defaultViewport: 'iphone12',
    },
  },
}
```

## 5. Request Form Component

```typescript
// stories/fan/RequestForm.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { RequestForm } from '@/components/fan/RequestForm'

const meta: Meta<typeof RequestForm> = {
  title: 'Fan/RequestForm',
  component: RequestForm,
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    onSubmit: { action: 'submitted' },
    creator: {
      description: 'Selected creator',
    },
  },
}

export default meta
type Story = StoryObj<typeof meta>

// Empty form
export const EmptyForm: Story = {
  args: {
    creator: {
      id: '1',
      name: 'Marie Jean',
      price: 75,
    },
  },
}

// With validation errors
export const ValidationErrors: Story = {
  args: {
    creator: {
      id: '1',
      name: 'Marie Jean',
      price: 75,
    },
    errors: {
      recipientName: 'Recipient name is required',
      instructions: 'Instructions must be at least 10 characters',
    },
  },
  render: (args) => (
    <RequestForm {...args}>
      <div className="text-red-500 text-sm mt-1">
        {args.errors?.recipientName}
      </div>
      <div className="text-red-500 text-sm mt-1">
        {args.errors?.instructions}
      </div>
    </RequestForm>
  ),
}

// Filled form
export const FilledForm: Story = {
  args: {
    creator: {
      id: '1',
      name: 'Marie Jean',
      price: 75,
    },
    defaultValues: {
      occasion: 'birthday',
      recipientName: 'Sarah Johnson',
      recipientRelation: 'sister',
      instructions: 'Please wish my sister Sarah a happy 25th birthday!',
      rushOrder: true,
      privateVideo: false,
    },
  },
}

// Submission state
export const SubmittingForm: Story = {
  args: {
    creator: {
      id: '1',
      name: 'Marie Jean',
      price: 75,
    },
    isSubmitting: true,
  },
  render: (args) => (
    <div className="opacity-50 pointer-events-none">
      <RequestForm {...args} />
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-purple-600 border-t-transparent" />
      </div>
    </div>
  ),
}

// Success state
export const SuccessState: Story = {
  args: {
    creator: {
      id: '1',
      name: 'Marie Jean',
      price: 75,
    },
    isSuccess: true,
  },
  render: (args) => (
    <div>
      <RequestForm {...args} />
      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
        <p className="text-green-800 font-medium">Request submitted successfully!</p>
      </div>
    </div>
  ),
}

// With all options enabled
export const AllOptionsEnabled: Story = {
  args: {
    creator: {
      id: '1',
      name: 'Marie Jean',
      price: 75,
    },
    showRushOption: true,
    showPrivateOption: true,
    showDownloadOption: true,
    showScheduleOption: true,
  },
}
```

## 6. Video Card Component

```typescript
// stories/fan/VideoCard.stories.tsx
import type { Meta, StoryObj } from '@storybook/react'
import { VideoCard } from '@/components/fan/VideoCard'

const meta: Meta<typeof VideoCard> = {
  title: 'Fan/VideoCard',
  component: VideoCard,
  parameters: {
    layout: 'centered',
  },
}

export default meta
type Story = StoryObj<typeof meta>

const mockVideo = {
  id: '1',
  creatorName: 'Marie Jean',
  creatorAvatar: '/placeholder.svg',
  recipientName: 'Sarah',
  occasion: 'Birthday',
  thumbnailUrl: '/placeholder.svg',
  duration: '2:34',
  deliveredAt: '2024-03-15T10:00:00',
  viewCount: 12,
  rating: 5,
}

// Ready video
export const ReadyVideo: Story = {
  args: {
    video: {
      ...mockVideo,
      status: 'ready',
    },
  },
}

// Processing video
export const ProcessingVideo: Story = {
  args: {
    video: {
      ...mockVideo,
      status: 'processing',
    },
  },
}

// Private video
export const PrivateVideo: Story = {
  args: {
    video: {
      ...mockVideo,
      isPrivate: true,
    },
  },
}

// Favorited video
export const FavoritedVideo: Story = {
  args: {
    video: {
      ...mockVideo,
      isFavorite: true,
    },
  },
}

// Not downloadable
export const NoDownload: Story = {
  args: {
    video: {
      ...mockVideo,
      allowDownload: false,
    },
  },
}

// Grid view
export const GridView: Story = {
  args: {
    video: mockVideo,
    viewMode: 'grid',
  },
  render: (args) => (
    <div className="grid grid-cols-3 gap-4">
      <VideoCard {...args} />
      <VideoCard {...args} />
      <VideoCard {...args} />
    </div>
  ),
}

// List view
export const ListView: Story = {
  args: {
    video: mockVideo,
    viewMode: 'list',
  },
  render: (args) => (
    <div className="space-y-4">
      <VideoCard {...args} />
      <VideoCard {...args} />
      <VideoCard {...args} />
    </div>
  ),
}
```

## Running Storybook

### Commands
```bash
# Install Storybook
npx storybook@latest init

# Run Storybook locally
npm run storybook

# Build Storybook
npm run build-storybook

# Run interaction tests
npm run test-storybook

# Run accessibility tests
npm run test-storybook --axe

# Visual regression testing
npm run chromatic
```

### Configuration for Testing
```javascript
// .storybook/test-runner.js
module.exports = {
  async postRender(page, context) {
    // Run accessibility tests
    await page.addScriptTag({
      path: require.resolve('axe-core'),
    })
    
    const result = await page.evaluate(() => {
      return new Promise((resolve) => {
        axe.run((err, results) => {
          resolve(results.violations)
        })
      })
    })
    
    if (result.length > 0) {
      console.error('Accessibility violations found:', result)
    }
  },
}
```

### CI/CD Integration
```yaml
# .github/workflows/storybook.yml
name: Storybook Tests
on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build Storybook
        run: npm run build-storybook
      
      - name: Run Storybook tests
        run: npm run test-storybook
      
      - name: Run visual tests
        run: npx chromatic --project-token=${{ secrets.CHROMATIC_PROJECT_TOKEN }}
```

## Visual Testing with Chromatic

### Setup
```bash
# Install Chromatic
npm install --save-dev chromatic

# Run Chromatic
npx chromatic --project-token=<your-project-token>
```

### Configuration
```json
// package.json
{
  "scripts": {
    "chromatic": "npx chromatic --exit-zero-on-changes"
  }
}
```

## Interaction Testing

```typescript
// stories/fan/RequestForm.stories.tsx
import { within, userEvent, waitFor } from '@storybook/testing-library'
import { expect } from '@storybook/jest'

export const FormInteraction: Story = {
  args: {
    creator: {
      id: '1',
      name: 'Marie Jean',
      price: 75,
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    
    // Select occasion
    await userEvent.click(canvas.getByTestId('occasion-birthday'))
    
    // Fill recipient name
    await userEvent.type(
      canvas.getByLabelText('Recipient Name'),
      'Sarah Johnson'
    )
    
    // Select relationship
    await userEvent.selectOptions(
      canvas.getByLabelText('Relationship'),
      'sister'
    )
    
    // Fill instructions
    await userEvent.type(
      canvas.getByLabelText('Instructions'),
      'Please wish my sister a happy birthday!'
    )
    
    // Check rush order
    await userEvent.click(canvas.getByLabelText('Rush Order'))
    
    // Verify price update
    await waitFor(() => {
      expect(canvas.getByText('$100')).toBeInTheDocument()
    })
    
    // Submit form
    await userEvent.click(canvas.getByRole('button', { name: 'Continue' }))
  },
}
```

## Component Documentation

### Automatic Documentation
Storybook automatically generates documentation from:
- TypeScript props
- JSDoc comments
- ArgTypes configuration
- MDX documentation files

### Example MDX Documentation
```mdx
// stories/fan/Introduction.stories.mdx
import { Meta } from '@storybook/addon-docs'

<Meta title="Fan/Introduction" />

# Fan Dashboard Components

This section contains all components used in the Fan Dashboard of Ann Pale.

## Component Categories

### Request Flow
- Creator selection cards
- Request form components
- Payment method selector

### Video Management
- Video player with custom controls
- Video library grid/list views
- Video cards with actions

### Order Tracking
- Order timeline visualization
- Status badges and indicators
- Communication log display

## Design Principles

All components follow these principles:
- Mobile-first responsive design
- Accessibility (WCAG 2.1 AA)
- Consistent theming with Tailwind CSS
- Support for light/dark modes
- Internationalization ready
```