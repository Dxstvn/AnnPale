'use client';

import * as React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Upload,
  Image as ImageIcon,
  Video,
  X,
  Plus,
  Music,
  Users,
  MessageCircle,
  GraduationCap,
  PartyPopper,
  Mic,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EventData } from '../event-creation-wizard';

interface BasicDetailsStepProps {
  data: EventData;
  onUpdate: (updates: Partial<EventData>) => void;
  errors?: string[];
}

const EVENT_TYPES = [
  { id: 'concert', label: 'Concert/Performance', icon: Music, description: 'Live music or performance show' },
  { id: 'workshop', label: 'Workshop/Masterclass', icon: GraduationCap, description: 'Educational or skill-building session' },
  { id: 'meetgreet', label: 'Meet & Greet', icon: Users, description: 'Personal interaction with fans' },
  { id: 'qa', label: 'Q&A Session', icon: MessageCircle, description: 'Question and answer format' },
  { id: 'watch', label: 'Watch Party', icon: Video, description: 'Group viewing experience' },
  { id: 'celebration', label: 'Birthday/Celebration', icon: PartyPopper, description: 'Special occasion celebration' },
  { id: 'podcast', label: 'Podcast/Talk', icon: Mic, description: 'Discussion or interview format' },
  { id: 'custom', label: 'Custom Event', icon: Star, description: 'Create your own format' }
];

const EVENT_CATEGORIES = [
  'Music & Performance',
  'Education & Workshops',
  'Entertainment',
  'Sports & Fitness',
  'Arts & Culture',
  'Business & Professional',
  'Lifestyle & Wellness',
  'Technology',
  'Food & Cooking',
  'Fashion & Beauty',
  'Gaming',
  'Other'
];

const SUGGESTED_TAGS = [
  'Live',
  'Interactive',
  'Exclusive',
  'Limited Seats',
  'Q&A',
  'Beginner Friendly',
  'Advanced',
  'Family Friendly',
  'Adults Only',
  'Haitian Culture',
  'Music',
  'Dance',
  'Workshop',
  'Masterclass'
];

export function EventBasicDetailsStep({
  data,
  onUpdate,
  errors = []
}: BasicDetailsStepProps) {
  const [tagInput, setTagInput] = React.useState('');
  const [showAllTags, setShowAllTags] = React.useState(false);

  const handleAddTag = (tag: string) => {
    if (tag && !data.tags.includes(tag)) {
      onUpdate({ tags: [...data.tags, tag] });
    }
    setTagInput('');
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdate({ tags: data.tags.filter(tag => tag !== tagToRemove) });
  };

  const handleTagInputKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag(tagInput);
    }
  };

  return (
    <div className="space-y-6">
      {/* Event Title */}
      <div>
        <Label htmlFor="title">
          Event Title <span className="text-red-500">*</span>
        </Label>
        <Input
          id="title"
          value={data.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          placeholder="Enter a catchy title for your event"
          className={cn(
            "mt-1",
            errors.some(e => e.includes('title')) && "border-red-500"
          )}
        />
        <p className="text-sm text-gray-500 mt-1">
          Make it descriptive and exciting (max 100 characters)
        </p>
      </div>

      {/* Event Type */}
      <div>
        <Label>
          Event Type <span className="text-red-500">*</span>
        </Label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-2">
          {EVENT_TYPES.map((type) => {
            const Icon = type.icon;
            const isSelected = data.type === type.id;
            
            return (
              <Card
                key={type.id}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  isSelected && "ring-2 ring-primary",
                  errors.some(e => e.includes('type')) && !data.type && "border-red-500"
                )}
                onClick={() => onUpdate({ type: type.id })}
              >
                <CardContent className="p-4">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <div className={cn(
                      "p-2 rounded-lg",
                      isSelected ? "bg-primary text-white" : "bg-gray-100"
                    )}>
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">{type.label}</p>
                      <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Category */}
      <div>
        <Label htmlFor="category">
          Category <span className="text-red-500">*</span>
        </Label>
        <Select value={data.category} onValueChange={(value) => onUpdate({ category: value })}>
          <SelectTrigger 
            id="category"
            className={cn(
              "mt-1",
              errors.some(e => e.includes('category')) && "border-red-500"
            )}
          >
            <SelectValue placeholder="Select a category" />
          </SelectTrigger>
          <SelectContent>
            {EVENT_CATEGORIES.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Description */}
      <div>
        <Label htmlFor="description">
          Event Description <span className="text-red-500">*</span>
        </Label>
        <Textarea
          id="description"
          value={data.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          placeholder="Describe what attendees can expect from your event..."
          rows={5}
          className={cn(
            "mt-1",
            errors.some(e => e.includes('description')) && "border-red-500"
          )}
        />
        <p className="text-sm text-gray-500 mt-1">
          Be detailed! This helps attendees understand the value (min 100 characters)
        </p>
      </div>

      {/* Tags */}
      <div>
        <Label>Event Tags</Label>
        <div className="mt-2 space-y-3">
          {/* Current Tags */}
          {data.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {data.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}

          {/* Tag Input */}
          <div className="flex gap-2">
            <Input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleTagInputKeyDown}
              placeholder="Add a tag..."
              className="flex-1"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => handleAddTag(tagInput)}
              disabled={!tagInput}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>

          {/* Suggested Tags */}
          <div>
            <p className="text-sm text-gray-600 mb-2">Suggested tags:</p>
            <div className="flex flex-wrap gap-2">
              {(showAllTags ? SUGGESTED_TAGS : SUGGESTED_TAGS.slice(0, 8)).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="cursor-pointer hover:bg-gray-100"
                  onClick={() => handleAddTag(tag)}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
              {!showAllTags && SUGGESTED_TAGS.length > 8 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAllTags(true)}
                >
                  Show more...
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Media Upload */}
      <div className="space-y-4">
        <div>
          <Label>Event Banner</Label>
          <div className="mt-2">
            {data.bannerUrl ? (
              <div className="relative">
                <img
                  src={data.bannerUrl}
                  alt="Event banner"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2"
                  onClick={() => onUpdate({ bannerUrl: undefined })}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
                <ImageIcon className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <p className="text-sm text-gray-600">
                  Click to upload or drag and drop
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Recommended: 1920x1080px, max 5MB
                </p>
                <Button variant="outline" size="sm" className="mt-3">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              </div>
            )}
          </div>
        </div>

        <div>
          <Label>Promotional Video (Optional)</Label>
          <div className="mt-2">
            {data.videoUrl ? (
              <div className="relative">
                <video
                  src={data.videoUrl}
                  className="w-full h-48 object-cover rounded-lg"
                  controls
                />
                <Button
                  size="sm"
                  variant="destructive"
                  className="absolute top-2 right-2"
                  onClick={() => onUpdate({ videoUrl: undefined })}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors cursor-pointer">
                <Video className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <p className="text-sm text-gray-600">
                  Upload a promotional video
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  MP4, max 100MB, up to 2 minutes
                </p>
                <Button variant="outline" size="sm" className="mt-3">
                  <Upload className="h-4 w-4 mr-2" />
                  Choose Video
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}