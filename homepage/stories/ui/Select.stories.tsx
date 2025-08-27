import type { Meta, StoryObj } from '@storybook/react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue,
  SelectGroup,
  SelectLabel 
} from '../../components/ui/select';
import { Label } from '../../components/ui/label';

const meta: Meta<typeof Select> = {
  title: 'UI/Select',
  component: Select,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select an option" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
        <SelectItem value="option2">Option 2</SelectItem>
        <SelectItem value="option3">Option 3</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithLabel: Story = {
  render: () => (
    <div className="space-y-2">
      <Label>Choose a category</Label>
      <Select>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="music">Music</SelectItem>
          <SelectItem value="sports">Sports</SelectItem>
          <SelectItem value="comedy">Comedy</SelectItem>
          <SelectItem value="acting">Acting</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const GroupedOptions: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-[250px]">
        <SelectValue placeholder="Select a creator type" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Entertainment</SelectLabel>
          <SelectItem value="musician">Musician</SelectItem>
          <SelectItem value="comedian">Comedian</SelectItem>
          <SelectItem value="actor">Actor/Actress</SelectItem>
          <SelectItem value="dancer">Dancer</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Sports</SelectLabel>
          <SelectItem value="athlete">Athlete</SelectItem>
          <SelectItem value="coach">Coach</SelectItem>
          <SelectItem value="trainer">Personal Trainer</SelectItem>
        </SelectGroup>
        <SelectGroup>
          <SelectLabel>Business & Education</SelectLabel>
          <SelectItem value="entrepreneur">Entrepreneur</SelectItem>
          <SelectItem value="educator">Educator</SelectItem>
          <SelectItem value="influencer">Influencer</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  ),
};

export const LanguageSelector: Story = {
  name: 'Language Selector',
  render: () => (
    <div className="space-y-2">
      <Label>Preferred Language</Label>
      <Select defaultValue="en">
        <SelectTrigger className="w-[200px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">🇺🇸 English</SelectItem>
          <SelectItem value="fr">🇫🇷 Français</SelectItem>
          <SelectItem value="ht">🇭🇹 Kreyòl Ayisyen</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const PriceRangeSelector: Story = {
  name: 'Price Range Selector',
  render: () => (
    <div className="space-y-2">
      <Label>Price Range</Label>
      <Select>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="Select price range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="0-50">$0 - $50</SelectItem>
          <SelectItem value="50-100">$50 - $100</SelectItem>
          <SelectItem value="100-250">$100 - $250</SelectItem>
          <SelectItem value="250-500">$250 - $500</SelectItem>
          <SelectItem value="500+">$500+</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const DeliveryTimeSelector: Story = {
  name: 'Delivery Time Selector',
  render: () => (
    <div className="space-y-2">
      <Label>Delivery Time</Label>
      <Select>
        <SelectTrigger className="w-[250px]">
          <SelectValue placeholder="When do you need it?" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="24h">Within 24 hours ⚡</SelectItem>
          <SelectItem value="3d">Within 3 days</SelectItem>
          <SelectItem value="7d">Within 7 days</SelectItem>
          <SelectItem value="14d">Within 2 weeks</SelectItem>
          <SelectItem value="30d">Within 30 days</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const DisabledSelect: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-[200px]">
        <SelectValue placeholder="Disabled select" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="option1">Option 1</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const FormExample: Story = {
  name: 'Booking Form Selects',
  render: () => (
    <form className="space-y-4 w-96 p-6 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">Book a Video Message</h3>
      
      <div className="space-y-2">
        <Label>Occasion</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="What's the occasion?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="birthday">🎂 Birthday</SelectItem>
            <SelectItem value="wedding">💒 Wedding</SelectItem>
            <SelectItem value="graduation">🎓 Graduation</SelectItem>
            <SelectItem value="anniversary">💕 Anniversary</SelectItem>
            <SelectItem value="motivation">💪 Motivation</SelectItem>
            <SelectItem value="other">🎉 Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>For Who?</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="Who is this for?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="myself">For myself</SelectItem>
            <SelectItem value="someone">For someone else</SelectItem>
            <SelectItem value="group">For a group</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Delivery Speed</Label>
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="How soon?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="express">Express (24 hours) +$50</SelectItem>
            <SelectItem value="standard">Standard (7 days)</SelectItem>
            <SelectItem value="flexible">Flexible (whenever)</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </form>
  ),
};