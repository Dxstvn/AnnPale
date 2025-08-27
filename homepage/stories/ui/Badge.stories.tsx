import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from '../../components/ui/badge';

const meta: Meta<typeof Badge> = {
  title: 'UI/Badge',
  component: Badge,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'secondary', 'destructive', 'outline'],
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    children: 'Badge',
  },
};

export const Secondary: Story = {
  args: {
    variant: 'secondary',
    children: 'Secondary',
  },
};

export const Destructive: Story = {
  args: {
    variant: 'destructive',
    children: 'Destructive',
  },
};

export const Outline: Story = {
  args: {
    variant: 'outline',
    children: 'Outline',
  },
};

export const AllVariants: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
    </div>
  ),
};

export const WithStatus: Story = {
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Badge className="bg-green-500 hover:bg-green-600">Active</Badge>
      <Badge className="bg-yellow-500 hover:bg-yellow-600">Pending</Badge>
      <Badge className="bg-red-500 hover:bg-red-600">Inactive</Badge>
      <Badge className="bg-blue-500 hover:bg-blue-600">New</Badge>
    </div>
  ),
};

export const CreatorBadges: Story = {
  name: 'Creator Status Badges',
  render: () => (
    <div className="flex gap-2 flex-wrap">
      <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        Verified
      </Badge>
      <Badge variant="outline">Top Creator</Badge>
      <Badge className="bg-gold-500">Premium</Badge>
      <Badge variant="secondary">Rising Star</Badge>
    </div>
  ),
};