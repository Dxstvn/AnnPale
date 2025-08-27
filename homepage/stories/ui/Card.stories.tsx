import type { Meta, StoryObj } from '@storybook/react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';

const meta: Meta<typeof Card> = {
  title: 'UI/Card',
  component: Card,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Card Title</CardTitle>
        <CardDescription>Card description goes here</CardDescription>
      </CardHeader>
      <CardContent>
        <p>Card content with some text inside the card body.</p>
      </CardContent>
      <CardFooter>
        <Button>Action</Button>
      </CardFooter>
    </Card>
  ),
};

export const SimpleCard: Story = {
  render: () => (
    <Card className="w-[350px]">
      <CardContent className="pt-6">
        <p>Simple card with just content, no header or footer.</p>
      </CardContent>
    </Card>
  ),
};

export const CreatorCard: Story = {
  name: 'Creator Profile Card',
  render: () => (
    <Card className="w-[350px] overflow-hidden">
      <div className="h-48 bg-gradient-to-r from-purple-600 to-pink-600" />
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Wyclef Jean</CardTitle>
          <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
            Verified
          </Badge>
        </div>
        <CardDescription>Musician & Philanthropist</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Starting at $150</p>
          <p className="text-sm">⭐ 4.9 (234 reviews)</p>
          <p className="text-sm">📍 New York, USA</p>
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button className="flex-1">Book Now</Button>
        <Button variant="outline" className="flex-1">View Profile</Button>
      </CardFooter>
    </Card>
  ),
};

export const StatCard: Story = {
  name: 'Dashboard Stat Card',
  render: () => (
    <Card className="w-[250px]">
      <CardHeader className="pb-2">
        <CardDescription>Total Revenue</CardDescription>
        <CardTitle className="text-3xl">$12,450</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-xs text-green-600">+12.5% from last month</p>
      </CardContent>
    </Card>
  ),
};

export const ElevatedCard: Story = {
  name: 'Elevated Shadow Card',
  render: () => (
    <Card className="w-[350px] shadow-xl hover:shadow-2xl transition-shadow">
      <CardHeader>
        <CardTitle>Elevated Card</CardTitle>
        <CardDescription>Card with enhanced shadow for prominence</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card appears elevated from the surface.</p>
      </CardContent>
    </Card>
  ),
};

export const InteractiveCard: Story = {
  name: 'Interactive Hover Card',
  render: () => (
    <Card className="w-[350px] cursor-pointer hover:scale-105 transition-transform">
      <CardHeader>
        <CardTitle>Interactive Card</CardTitle>
        <CardDescription>Hover to see the interaction</CardDescription>
      </CardHeader>
      <CardContent>
        <p>This card responds to user interaction.</p>
      </CardContent>
    </Card>
  ),
};

export const CardGrid: Story = {
  name: 'Card Grid Layout',
  render: () => (
    <div className="grid grid-cols-3 gap-4 w-full max-w-4xl">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Card key={i}>
          <CardHeader>
            <CardTitle>Card {i}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Content for card {i}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  ),
};