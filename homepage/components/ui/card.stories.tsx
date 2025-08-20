import type { Meta, StoryObj } from '@storybook/react'
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent, 
  CardFooter,
  CardAction,
  CreatorCard,
  StatsCard
} from './card'
import { Button } from './button'
import { Avatar, AvatarFallback, AvatarImage } from './avatar'
import { Badge } from './badge'
import { Star, Play, Users, DollarSign, TrendingUp, MoreVertical } from 'lucide-react'

const meta = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'elevated', 'interactive', 'ghost', 'bordered', 'gradient'],
    },
    padding: {
      control: 'select',
      options: ['none', 'sm', 'default', 'lg'],
    },
    spacing: {
      control: 'select',
      options: ['none', 'sm', 'default', 'lg'],
    },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

// Basic Card Variants
export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Default Card</CardTitle>
        <CardDescription>This is a default card with standard styling</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Card content goes here. You can add any content you like.
        </p>
      </CardContent>
      <CardFooter>
        <Button variant="primary" size="sm">Action</Button>
      </CardFooter>
    </Card>
  ),
}

export const Elevated: Story = {
  render: () => (
    <Card variant="elevated" className="w-[350px]">
      <CardHeader>
        <CardTitle>Elevated Card</CardTitle>
        <CardDescription>This card has an elevated shadow on hover</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Hover over this card to see the elevation change.
        </p>
      </CardContent>
    </Card>
  ),
}

export const Interactive: Story = {
  render: () => (
    <Card variant="interactive" className="w-[350px]">
      <CardHeader>
        <CardTitle>Interactive Card</CardTitle>
        <CardDescription>This card responds to hover with animation</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          The card lifts up and increases shadow on hover.
        </p>
      </CardContent>
    </Card>
  ),
}

export const Bordered: Story = {
  render: () => (
    <Card variant="bordered" className="w-[350px]">
      <CardHeader>
        <CardTitle>Bordered Card</CardTitle>
        <CardDescription>A card with a prominent border</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Uses purple border for brand consistency.
        </p>
      </CardContent>
    </Card>
  ),
}

export const Gradient: Story = {
  render: () => (
    <Card variant="gradient" className="w-[350px]">
      <CardHeader>
        <CardTitle>Gradient Card</CardTitle>
        <CardDescription>Features a subtle gradient background</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Perfect for highlighting special content or featured items.
        </p>
      </CardContent>
    </Card>
  ),
}

// Creator Card Examples
export const CreatorCardDefault: Story = {
  render: () => (
    <CreatorCard className="w-[300px]">
      <div className="aspect-video bg-gradient-to-br from-purple-400 to-pink-400 rounded-t-xl" />
      <CardHeader>
        <div className="flex items-start justify-between">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
          <Badge variant="secondary">Music</Badge>
        </div>
        <CardTitle className="mt-2">Jean Dupont</CardTitle>
        <CardDescription>Haitian Music Artist</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>4.9</span>
          </div>
          <div className="flex items-center gap-1">
            <Play className="h-4 w-4" />
            <span>125 videos</span>
          </div>
        </div>
        <p className="mt-2 text-lg font-semibold">From $50</p>
      </CardContent>
      <CardFooter>
        <Button variant="primary" fullWidth>Book Now</Button>
      </CardFooter>
    </CreatorCard>
  ),
}

export const CreatorCardFeatured: Story = {
  render: () => (
    <CreatorCard featured className="w-[300px]">
      <div className="aspect-video bg-gradient-to-br from-purple-400 to-pink-400 rounded-t-xl" />
      <CardHeader>
        <div className="flex items-start justify-between">
          <Avatar className="h-12 w-12">
            <AvatarImage src="/placeholder-avatar.jpg" />
            <AvatarFallback>ML</AvatarFallback>
          </Avatar>
          <Badge variant="secondary">Comedy</Badge>
        </div>
        <CardTitle className="mt-2">Marie Laurent</CardTitle>
        <CardDescription>Comedian & TV Host</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span>5.0</span>
          </div>
          <div className="flex items-center gap-1">
            <Play className="h-4 w-4" />
            <span>500+ videos</span>
          </div>
        </div>
        <p className="mt-2 text-lg font-semibold">From $150</p>
      </CardContent>
      <CardFooter>
        <Button variant="primary" fullWidth>Book Now</Button>
      </CardFooter>
    </CreatorCard>
  ),
}

// Stats Card Examples
export const StatsCardRevenue: Story = {
  render: () => (
    <StatsCard trend="up" trendValue="+12.5%" className="w-[280px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          Revenue
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">$12,450</p>
        <p className="text-sm text-muted-foreground mt-1">This month</p>
      </CardContent>
    </StatsCard>
  ),
}

export const StatsCardUsers: Story = {
  render: () => (
    <StatsCard trend="up" trendValue="+5.2%" className="w-[280px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Active Users
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">1,234</p>
        <p className="text-sm text-muted-foreground mt-1">Last 30 days</p>
      </CardContent>
    </StatsCard>
  ),
}

export const StatsCardEngagement: Story = {
  render: () => (
    <StatsCard trend="down" trendValue="-2.1%" className="w-[280px]">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Engagement
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-bold">68.5%</p>
        <p className="text-sm text-muted-foreground mt-1">Average rate</p>
      </CardContent>
    </StatsCard>
  ),
}

// Card with Action
export const CardWithAction: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Settings</CardTitle>
        <CardDescription>Manage your account settings</CardDescription>
        <CardAction>
          <Button size="icon-sm" variant="ghost">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-sm">Email notifications</span>
            <Badge>On</Badge>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm">SMS notifications</span>
            <Badge variant="secondary">Off</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  ),
}

// Different Padding Examples
export const PaddingSizes: Story = {
  render: () => (
    <div className="space-y-4">
      <Card padding="sm" className="w-[300px]">
        <CardHeader className="p-0">
          <CardTitle>Small Padding</CardTitle>
        </CardHeader>
      </Card>
      <Card padding="default" className="w-[300px]">
        <CardHeader className="p-0">
          <CardTitle>Default Padding</CardTitle>
        </CardHeader>
      </Card>
      <Card padding="lg" className="w-[300px]">
        <CardHeader className="p-0">
          <CardTitle>Large Padding</CardTitle>
        </CardHeader>
      </Card>
    </div>
  ),
}

// Responsive Card Grid
export const CardGrid: Story = {
  render: () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i} variant="interactive">
          <CardHeader>
            <CardTitle>Card {i}</CardTitle>
            <CardDescription>Description for card {i}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              This is content for card number {i}.
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
}

// Loading State Card
export const LoadingCard: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse" />
        <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <div className="h-4 w-full bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
        </div>
      </CardContent>
      <CardFooter>
        <div className="h-9 w-24 bg-gray-200 rounded animate-pulse" />
      </CardFooter>
    </Card>
  ),
}