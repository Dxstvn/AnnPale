import type { Meta, StoryObj } from '@storybook/react';
import { Skeleton } from '../../components/ui/skeleton';
import { Card, CardContent, CardHeader } from '../../components/ui/card';

const meta: Meta<typeof Skeleton> = {
  title: 'UI/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Skeleton className="w-[200px] h-4" />,
};

export const Circle: Story = {
  render: () => <Skeleton className="w-12 h-12 rounded-full" />,
};

export const TextLines: Story = {
  render: () => (
    <div className="space-y-2">
      <Skeleton className="h-4 w-[250px]" />
      <Skeleton className="h-4 w-[200px]" />
      <Skeleton className="h-4 w-[150px]" />
    </div>
  ),
};

export const CardSkeleton: Story = {
  name: 'Card Loading State',
  render: () => (
    <Card className="w-[350px]">
      <CardHeader>
        <Skeleton className="h-6 w-[150px] mb-2" />
        <Skeleton className="h-4 w-[250px]" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
      </CardContent>
    </Card>
  ),
};

export const CreatorCardSkeleton: Story = {
  name: 'Creator Card Loading',
  render: () => (
    <div className="w-[350px] border rounded-lg overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <div className="p-4 space-y-3">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-[120px]" />
            <Skeleton className="h-3 w-[80px]" />
          </div>
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 flex-1" />
        </div>
      </div>
    </div>
  ),
};

export const TableSkeleton: Story = {
  name: 'Table Loading State',
  render: () => (
    <div className="w-full max-w-2xl">
      <div className="space-y-3">
        <div className="flex gap-4 p-3 border-b">
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[150px]" />
          <Skeleton className="h-4 w-[100px]" />
          <Skeleton className="h-4 w-[80px]" />
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex gap-4 p-3">
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[150px]" />
            <Skeleton className="h-4 w-[100px]" />
            <Skeleton className="h-4 w-[80px]" />
          </div>
        ))}
      </div>
    </div>
  ),
};

export const ProfileSkeleton: Story = {
  name: 'Profile Loading State',
  render: () => (
    <div className="w-full max-w-4xl">
      <Skeleton className="h-48 w-full mb-4" />
      <div className="flex gap-4 items-start">
        <Skeleton className="h-24 w-24 rounded-full" />
        <div className="flex-1 space-y-3">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
          <Skeleton className="h-4 w-full max-w-[500px]" />
          <div className="flex gap-2">
            <Skeleton className="h-10 w-[120px]" />
            <Skeleton className="h-10 w-[120px]" />
          </div>
        </div>
      </div>
    </div>
  ),
};

export const GridSkeleton: Story = {
  name: 'Grid Loading State',
  render: () => (
    <div className="grid grid-cols-3 gap-4 w-full max-w-4xl">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </div>
      ))}
    </div>
  ),
};