import type { Meta, StoryObj } from '@storybook/react';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Search, Mail, Lock, User, DollarSign } from 'lucide-react';

const meta: Meta<typeof Input> = {
  title: 'UI/Input',
  component: Input,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      control: 'select',
      options: ['text', 'email', 'password', 'number', 'search', 'tel', 'url'],
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    placeholder: 'Enter text...',
  },
};

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" placeholder="Enter your email" />
    </div>
  ),
};

export const Disabled: Story = {
  args: {
    placeholder: 'Disabled input',
    disabled: true,
    value: 'Cannot edit this',
  },
};

export const WithIcon: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search creators..." className="pl-8" />
      </div>
      <div className="relative">
        <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="email" placeholder="Email" className="pl-8" />
      </div>
      <div className="relative">
        <Lock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="password" placeholder="Password" className="pl-8" />
      </div>
    </div>
  ),
};

export const InputTypes: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div>
        <Label>Text Input</Label>
        <Input type="text" placeholder="Enter text" />
      </div>
      <div>
        <Label>Email Input</Label>
        <Input type="email" placeholder="email@example.com" />
      </div>
      <div>
        <Label>Password Input</Label>
        <Input type="password" placeholder="Enter password" />
      </div>
      <div>
        <Label>Number Input</Label>
        <Input type="number" placeholder="0" min="0" max="100" />
      </div>
      <div>
        <Label>Search Input</Label>
        <Input type="search" placeholder="Search..." />
      </div>
      <div>
        <Label>Tel Input</Label>
        <Input type="tel" placeholder="+1 (555) 000-0000" />
      </div>
    </div>
  ),
};

export const ValidationStates: Story = {
  render: () => (
    <div className="space-y-4 w-80">
      <div>
        <Label>Valid Input</Label>
        <Input 
          className="border-green-500 focus:ring-green-500" 
          defaultValue="Valid input"
        />
        <p className="text-sm text-green-600 mt-1">✓ Looks good!</p>
      </div>
      <div>
        <Label>Invalid Input</Label>
        <Input 
          className="border-red-500 focus:ring-red-500" 
          defaultValue="Invalid"
        />
        <p className="text-sm text-red-600 mt-1">This field is required</p>
      </div>
      <div>
        <Label>Warning Input</Label>
        <Input 
          className="border-yellow-500 focus:ring-yellow-500" 
          defaultValue="Warning"
        />
        <p className="text-sm text-yellow-600 mt-1">Consider using a stronger value</p>
      </div>
    </div>
  ),
};

export const FormExample: Story = {
  name: 'Complete Form Example',
  render: () => (
    <form className="space-y-4 w-96 p-6 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Create Account</h3>
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <div className="relative">
          <User className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input id="name" placeholder="John Doe" className="pl-8" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="form-email">Email</Label>
        <div className="relative">
          <Mail className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input id="form-email" type="email" placeholder="john@example.com" className="pl-8" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="form-password">Password</Label>
        <div className="relative">
          <Lock className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input id="form-password" type="password" placeholder="••••••••" className="pl-8" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="price">Starting Price</Label>
        <div className="relative">
          <DollarSign className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input id="price" type="number" placeholder="150" className="pl-8" min="0" />
        </div>
      </div>
    </form>
  ),
};