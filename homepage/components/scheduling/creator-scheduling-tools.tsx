'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Calendar,
  Clock,
  Copy,
  Edit,
  Trash2,
  Plus,
  Save,
  Upload,
  Download,
  Users,
  Repeat,
  Zap,
  Star,
  Settings,
  FileText,
  Wand2,
  CheckCircle,
  AlertCircle,
  MoreHorizontal,
  Play,
  Pause,
  RefreshCw,
  Target,
  BarChart3,
  TrendingUp,
  Calendar as CalendarIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addDays, addWeeks, addMonths, setHours, setMinutes } from 'date-fns';

// Stream template interface
export interface StreamTemplate {
  id: string;
  name: string;
  description: string;
  category: 'music' | 'talk' | 'gaming' | 'education' | 'culture' | 'other';
  defaultDuration: number; // minutes
  defaultTitle: string;
  defaultDescription: string;
  defaultTags: string[];
  defaultSettings: {
    isPublic: boolean;
    maxViewers?: number;
    enableChat: boolean;
    enableDonations: boolean;
    reminderTime: number; // minutes before
  };
  recurringPattern?: {
    type: 'daily' | 'weekly' | 'monthly';
    interval: number;
    daysOfWeek?: number[]; // 0-6, Sunday-Saturday
    preferredTimes: string[]; // "HH:MM" format
  };
  usageCount: number;
  lastUsed?: Date;
  createdAt: Date;
  isActive: boolean;
}

// Bulk scheduling interface
export interface BulkScheduleOperation {
  id: string;
  templateId?: string;
  title: string;
  dates: Date[];
  times: string[]; // "HH:MM" format
  duration: number;
  category: string;
  isPublic: boolean;
  tags: string[];
  status: 'draft' | 'scheduled' | 'processing' | 'completed' | 'failed';
  createdAt: Date;
  totalEvents: number;
  completedEvents: number;
}

// Conflict detection result
export interface ScheduleConflict {
  type: 'overlap' | 'too-close' | 'overbooked' | 'timezone-issue';
  severity: 'low' | 'medium' | 'high';
  message: string;
  suggestedAction: string;
  affectedEvents: string[];
}

// Default templates
export const DEFAULT_TEMPLATES: StreamTemplate[] = [
  {
    id: 'weekly-music-show',
    name: 'Weekly Music Show',
    description: 'Regular music performance and interaction',
    category: 'music',
    defaultDuration: 90,
    defaultTitle: 'Live Music Session - {{date}}',
    defaultDescription: 'Join me for live music, requests, and good vibes! 🎵',
    defaultTags: ['music', 'live', 'requests', 'haiti'],
    defaultSettings: {
      isPublic: true,
      enableChat: true,
      enableDonations: true,
      reminderTime: 30
    },
    recurringPattern: {
      type: 'weekly',
      interval: 1,
      daysOfWeek: [5], // Friday
      preferredTimes: ['20:00'] // 8 PM
    },
    usageCount: 24,
    lastUsed: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    isActive: true
  },
  {
    id: 'cultural-talk',
    name: 'Cultural Discussion',
    description: 'Weekly discussion about Haitian culture and heritage',
    category: 'culture',
    defaultDuration: 60,
    defaultTitle: 'Haitian Heritage Talk - {{topic}}',
    defaultDescription: 'Deep dive into Haitian culture, history, and traditions 🇭🇹',
    defaultTags: ['culture', 'haiti', 'education', 'heritage'],
    defaultSettings: {
      isPublic: true,
      enableChat: true,
      enableDonations: false,
      reminderTime: 60
    },
    recurringPattern: {
      type: 'weekly',
      interval: 1,
      daysOfWeek: [0], // Sunday
      preferredTimes: ['15:00'] // 3 PM
    },
    usageCount: 12,
    lastUsed: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000),
    isActive: true
  },
  {
    id: 'quick-update',
    name: 'Quick Update',
    description: 'Short announcements and updates',
    category: 'talk',
    defaultDuration: 15,
    defaultTitle: 'Quick Update - {{date}}',
    defaultDescription: 'Brief update about upcoming content and events',
    defaultTags: ['update', 'announcement', 'quick'],
    defaultSettings: {
      isPublic: true,
      enableChat: true,
      enableDonations: false,
      reminderTime: 15
    },
    usageCount: 8,
    lastUsed: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    isActive: true
  }
];

interface CreatorSchedulingToolsProps {
  templates?: StreamTemplate[];
  onCreateTemplate?: (template: Omit<StreamTemplate, 'id' | 'usageCount' | 'createdAt'>) => void;
  onUpdateTemplate?: (templateId: string, updates: Partial<StreamTemplate>) => void;
  onDeleteTemplate?: (templateId: string) => void;
  onBulkSchedule?: (operation: Omit<BulkScheduleOperation, 'id' | 'createdAt'>) => void;
  onConflictCheck?: (dates: Date[], times: string[]) => Promise<ScheduleConflict[]>;
  className?: string;
}

// Template form component
function TemplateForm({
  template,
  onSave,
  onCancel
}: {
  template?: StreamTemplate;
  onSave: (template: Omit<StreamTemplate, 'id' | 'usageCount' | 'createdAt'>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = React.useState({
    name: template?.name || '',
    description: template?.description || '',
    category: template?.category || 'talk' as StreamTemplate['category'],
    defaultDuration: template?.defaultDuration || 60,
    defaultTitle: template?.defaultTitle || '',
    defaultDescription: template?.defaultDescription || '',
    defaultTags: template?.defaultTags || [],
    defaultSettings: template?.defaultSettings || {
      isPublic: true,
      enableChat: true,
      enableDonations: true,
      reminderTime: 30
    },
    recurringPattern: template?.recurringPattern,
    isActive: template?.isActive !== false
  });

  const [newTag, setNewTag] = React.useState('');
  const [enableRecurring, setEnableRecurring] = React.useState(!!template?.recurringPattern);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const templateData: Omit<StreamTemplate, 'id' | 'usageCount' | 'createdAt'> = {
      ...formData,
      recurringPattern: enableRecurring ? formData.recurringPattern : undefined,
      lastUsed: template?.lastUsed
    };
    
    onSave(templateData);
  };

  const addTag = () => {
    if (newTag.trim() && !formData.defaultTags.includes(newTag.trim())) {
      setFormData(prev => ({
        ...prev,
        defaultTags: [...prev.defaultTags, newTag.trim()]
      }));
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData(prev => ({
      ...prev,
      defaultTags: prev.defaultTags.filter(t => t !== tag)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="name">Template Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="e.g., Weekly Music Show"
              required
            />
          </div>
          
          <div>
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value: StreamTemplate['category']) => 
              setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="music">🎵 Music</SelectItem>
                <SelectItem value="talk">💬 Talk Show</SelectItem>
                <SelectItem value="gaming">🎮 Gaming</SelectItem>
                <SelectItem value="education">📚 Education</SelectItem>
                <SelectItem value="culture">🇭🇹 Cultural</SelectItem>
                <SelectItem value="other">📺 Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div>
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
            placeholder="Brief description of this template"
            rows={2}
          />
        </div>
      </div>

      {/* Default Content */}
      <div className="space-y-4">
        <h4 className="font-medium">Default Content</h4>
        
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-2">
            <Label htmlFor="defaultTitle">Default Title</Label>
            <Input
              id="defaultTitle"
              value={formData.defaultTitle}
              onChange={(e) => setFormData(prev => ({ ...prev, defaultTitle: e.target.value }))}
              placeholder="Use {{date}} for dynamic date"
            />
          </div>
          
          <div>
            <Label htmlFor="defaultDuration">Duration (minutes)</Label>
            <Input
              id="defaultDuration"
              type="number"
              value={formData.defaultDuration}
              onChange={(e) => setFormData(prev => ({ ...prev, defaultDuration: parseInt(e.target.value) || 60 }))}
              min="15"
              max="480"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="defaultDescription">Default Description</Label>
          <Textarea
            id="defaultDescription"
            value={formData.defaultDescription}
            onChange={(e) => setFormData(prev => ({ ...prev, defaultDescription: e.target.value }))}
            placeholder="Default stream description"
            rows={3}
          />
        </div>

        {/* Tags */}
        <div>
          <Label>Default Tags</Label>
          <div className="flex gap-2 mb-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              placeholder="Add a tag..."
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
            />
            <Button type="button" onClick={addTag} size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </div>
          
          {formData.defaultTags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {formData.defaultTags.map((tag) => (
                <Badge key={tag} variant="outline" className="gap-1">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Settings */}
      <div className="space-y-4">
        <h4 className="font-medium">Default Settings</h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Public Stream</Label>
              <Switch
                checked={formData.defaultSettings.isPublic}
                onCheckedChange={(checked) => setFormData(prev => ({
                  ...prev,
                  defaultSettings: { ...prev.defaultSettings, isPublic: checked }
                }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label>Enable Chat</Label>
              <Switch
                checked={formData.defaultSettings.enableChat}
                onCheckedChange={(checked) => setFormData(prev => ({
                  ...prev,
                  defaultSettings: { ...prev.defaultSettings, enableChat: checked }
                }))}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label>Enable Donations</Label>
              <Switch
                checked={formData.defaultSettings.enableDonations}
                onCheckedChange={(checked) => setFormData(prev => ({
                  ...prev,
                  defaultSettings: { ...prev.defaultSettings, enableDonations: checked }
                }))}
              />
            </div>
          </div>
          
          <div className="space-y-3">
            <div>
              <Label>Reminder Time (minutes)</Label>
              <Input
                type="number"
                value={formData.defaultSettings.reminderTime}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  defaultSettings: { 
                    ...prev.defaultSettings, 
                    reminderTime: parseInt(e.target.value) || 30 
                  }
                }))}
                min="5"
                max="1440"
              />
            </div>
            
            <div>
              <Label>Max Viewers (optional)</Label>
              <Input
                type="number"
                value={formData.defaultSettings.maxViewers || ''}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  defaultSettings: { 
                    ...prev.defaultSettings, 
                    maxViewers: e.target.value ? parseInt(e.target.value) : undefined
                  }
                }))}
                placeholder="No limit"
                min="1"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Recurring Pattern */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="font-medium">Recurring Pattern</h4>
          <Switch
            checked={enableRecurring}
            onCheckedChange={setEnableRecurring}
          />
        </div>
        
        {enableRecurring && (
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <Label>Frequency</Label>
              <Select 
                value={formData.recurringPattern?.type || 'weekly'} 
                onValueChange={(value: 'daily' | 'weekly' | 'monthly') => 
                  setFormData(prev => ({
                    ...prev,
                    recurringPattern: { 
                      ...prev.recurringPattern,
                      type: value,
                      interval: 1,
                      daysOfWeek: value === 'weekly' ? [1] : undefined,
                      preferredTimes: ['20:00']
                    }
                  }))
                }>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>Interval</Label>
              <Input
                type="number"
                value={formData.recurringPattern?.interval || 1}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  recurringPattern: { 
                    ...prev.recurringPattern!,
                    interval: parseInt(e.target.value) || 1
                  }
                }))}
                min="1"
                max="12"
              />
            </div>
            
            {formData.recurringPattern?.type === 'weekly' && (
              <div className="col-span-2">
                <Label>Days of Week</Label>
                <div className="flex gap-2 mt-2">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
                    <Button
                      key={day}
                      type="button"
                      variant={formData.recurringPattern?.daysOfWeek?.includes(index) ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        const currentDays = formData.recurringPattern?.daysOfWeek || [];
                        const newDays = currentDays.includes(index)
                          ? currentDays.filter(d => d !== index)
                          : [...currentDays, index];
                        
                        setFormData(prev => ({
                          ...prev,
                          recurringPattern: { 
                            ...prev.recurringPattern!,
                            daysOfWeek: newDays
                          }
                        }));
                      }}
                    >
                      {day}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <Save className="w-4 h-4 mr-2" />
          {template ? 'Update Template' : 'Create Template'}
        </Button>
      </div>
    </form>
  );
}

// Bulk scheduling component
function BulkScheduler({
  templates,
  onSchedule,
  onConflictCheck
}: {
  templates: StreamTemplate[];
  onSchedule: (operation: Omit<BulkScheduleOperation, 'id' | 'createdAt'>) => void;
  onConflictCheck?: (dates: Date[], times: string[]) => Promise<ScheduleConflict[]>;
}) {
  const [selectedTemplate, setSelectedTemplate] = React.useState<string>('');
  const [title, setTitle] = React.useState('');
  const [selectedDates, setSelectedDates] = React.useState<Date[]>([]);
  const [selectedTimes, setSelectedTimes] = React.useState<string[]>(['20:00']);
  const [duration, setDuration] = React.useState(60);
  const [isPublic, setIsPublic] = React.useState(true);
  const [conflicts, setConflicts] = React.useState<ScheduleConflict[]>([]);
  const [isCheckingConflicts, setIsCheckingConflicts] = React.useState(false);

  const template = templates.find(t => t.id === selectedTemplate);

  React.useEffect(() => {
    if (template) {
      setTitle(template.defaultTitle);
      setDuration(template.defaultDuration);
      setIsPublic(template.defaultSettings.isPublic);
      if (template.recurringPattern?.preferredTimes) {
        setSelectedTimes(template.recurringPattern.preferredTimes);
      }
    }
  }, [template]);

  const checkConflicts = async () => {
    if (selectedDates.length === 0 || selectedTimes.length === 0 || !onConflictCheck) return;
    
    setIsCheckingConflicts(true);
    try {
      const detectedConflicts = await onConflictCheck(selectedDates, selectedTimes);
      setConflicts(detectedConflicts);
    } catch (error) {
      console.error('Error checking conflicts:', error);
    } finally {
      setIsCheckingConflicts(false);
    }
  };

  const handleSchedule = () => {
    const operation: Omit<BulkScheduleOperation, 'id' | 'createdAt'> = {
      templateId: selectedTemplate || undefined,
      title,
      dates: selectedDates,
      times: selectedTimes,
      duration,
      category: template?.category || 'other',
      isPublic,
      tags: template?.defaultTags || [],
      status: 'draft',
      totalEvents: selectedDates.length * selectedTimes.length,
      completedEvents: 0
    };
    
    onSchedule(operation);
  };

  const generateDateRange = (startDate: Date, endDate: Date, pattern: 'daily' | 'weekly' | 'monthly') => {
    const dates: Date[] = [];
    let currentDate = new Date(startDate);
    
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      
      switch (pattern) {
        case 'daily':
          currentDate = addDays(currentDate, 1);
          break;
        case 'weekly':
          currentDate = addWeeks(currentDate, 1);
          break;
        case 'monthly':
          currentDate = addMonths(currentDate, 1);
          break;
      }
    }
    
    return dates;
  };

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <div className="space-y-2">
        <Label>Select Template (Optional)</Label>
        <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
          <SelectTrigger>
            <SelectValue placeholder="Choose a template or create custom" />
          </SelectTrigger>
          <SelectContent>
            {templates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  <span>{template.name}</span>
                  <Badge variant="outline" className="text-xs">
                    {template.category}
                  </Badge>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Basic Information */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Stream Title</Label>
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Stream title"
          />
        </div>
        
        <div>
          <Label>Duration (minutes)</Label>
          <Input
            type="number"
            value={duration}
            onChange={(e) => setDuration(parseInt(e.target.value) || 60)}
            min="15"
            max="480"
          />
        </div>
      </div>

      {/* Date Selection */}
      <div className="space-y-4">
        <Label>Select Dates</Label>
        
        {/* Quick Date Range Generator */}
        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-3">Quick Date Range</h4>
          <div className="grid grid-cols-3 gap-3">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSelectedDates(generateDateRange(new Date(), addDays(new Date(), 6), 'daily'))}
            >
              Next 7 Days
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSelectedDates(generateDateRange(new Date(), addWeeks(new Date(), 4), 'weekly'))}
            >
              Next 4 Weeks
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSelectedDates(generateDateRange(new Date(), addMonths(new Date(), 3), 'monthly'))}
            >
              Next 3 Months
            </Button>
          </div>
        </div>

        {/* Selected Dates Display */}
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="font-medium">Selected Dates ({selectedDates.length})</span>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSelectedDates([])}
            >
              Clear All
            </Button>
          </div>
          
          {selectedDates.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {selectedDates.slice(0, 10).map((date, index) => (
                <Badge key={index} variant="outline">
                  {format(date, 'MMM d')}
                </Badge>
              ))}
              {selectedDates.length > 10 && (
                <Badge variant="outline">+{selectedDates.length - 10} more</Badge>
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No dates selected</p>
          )}
        </div>
      </div>

      {/* Time Selection */}
      <div className="space-y-2">
        <Label>Stream Times</Label>
        <div className="flex gap-2">
          <Input
            type="time"
            value={selectedTimes[0] || '20:00'}
            onChange={(e) => setSelectedTimes([e.target.value])}
          />
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setSelectedTimes([...selectedTimes, '20:00'])}
          >
            <Plus className="w-4 h-4" />
          </Button>
        </div>
        
        {selectedTimes.length > 1 && (
          <div className="flex flex-wrap gap-2">
            {selectedTimes.map((time, index) => (
              <Badge key={index} variant="outline" className="gap-1">
                {time}
                <button
                  type="button"
                  onClick={() => setSelectedTimes(selectedTimes.filter((_, i) => i !== index))}
                  className="ml-1 hover:bg-gray-200 rounded-full p-0.5"
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Conflict Detection */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Label>Conflict Detection</Label>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={checkConflicts}
            disabled={isCheckingConflicts || selectedDates.length === 0}
          >
            {isCheckingConflicts ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Zap className="w-4 h-4 mr-2" />
            )}
            Check Conflicts
          </Button>
        </div>
        
        {conflicts.length > 0 && (
          <div className="space-y-2">
            {conflicts.map((conflict, index) => (
              <div
                key={index}
                className={cn(
                  "p-3 rounded-lg border",
                  conflict.severity === 'high' ? 'bg-red-50 border-red-200' :
                  conflict.severity === 'medium' ? 'bg-yellow-50 border-yellow-200' :
                  'bg-blue-50 border-blue-200'
                )}
              >
                <div className="flex items-start gap-2">
                  {conflict.severity === 'high' ? (
                    <AlertCircle className="w-4 h-4 text-red-500 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-yellow-500 mt-0.5" />
                  )}
                  <div>
                    <div className="font-medium text-sm">{conflict.message}</div>
                    <div className="text-xs text-gray-600 mt-1">{conflict.suggestedAction}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Summary */}
      <div className="p-4 bg-green-50 rounded-lg border border-green-200">
        <h4 className="font-medium text-green-900 mb-2">Scheduling Summary</h4>
        <div className="text-sm text-green-700 space-y-1">
          <div>Total Events: {selectedDates.length * selectedTimes.length}</div>
          <div>Duration per Event: {duration} minutes</div>
          <div>Total Stream Time: {(selectedDates.length * selectedTimes.length * duration / 60).toFixed(1)} hours</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button
          type="button"
          onClick={handleSchedule}
          disabled={selectedDates.length === 0 || !title.trim()}
        >
          <Calendar className="w-4 h-4 mr-2" />
          Schedule {selectedDates.length * selectedTimes.length} Events
        </Button>
      </div>
    </div>
  );
}

// Main creator scheduling tools component
export function CreatorSchedulingTools({
  templates = DEFAULT_TEMPLATES,
  onCreateTemplate,
  onUpdateTemplate,
  onDeleteTemplate,
  onBulkSchedule,
  onConflictCheck,
  className
}: CreatorSchedulingToolsProps) {
  const [activeTab, setActiveTab] = React.useState<'templates' | 'bulk' | 'analytics'>('templates');
  const [showTemplateForm, setShowTemplateForm] = React.useState(false);
  const [editingTemplate, setEditingTemplate] = React.useState<StreamTemplate | null>(null);

  const handleCreateTemplate = (template: Omit<StreamTemplate, 'id' | 'usageCount' | 'createdAt'>) => {
    onCreateTemplate?.(template);
    setShowTemplateForm(false);
  };

  const handleUpdateTemplate = (template: Omit<StreamTemplate, 'id' | 'usageCount' | 'createdAt'>) => {
    if (editingTemplate) {
      onUpdateTemplate?.(editingTemplate.id, template);
      setEditingTemplate(null);
    }
  };

  const activeTemplates = templates.filter(t => t.isActive);
  const totalUsage = templates.reduce((sum, t) => sum + t.usageCount, 0);
  const mostUsedTemplate = templates.reduce((max, t) => t.usageCount > max.usageCount ? t : max, templates[0]);

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Creator Scheduling Tools</h2>
          <p className="text-gray-600">Streamline your content scheduling with templates and bulk operations</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-blue-50 text-blue-700">
            <FileText className="w-3 h-3 mr-1" />
            {activeTemplates.length} Templates
          </Badge>
          <Button onClick={() => setShowTemplateForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            New Template
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Templates</p>
                <p className="text-2xl font-bold">{activeTemplates.length}</p>
              </div>
              <FileText className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Usage</p>
                <p className="text-2xl font-bold">{totalUsage}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Most Used</p>
                <p className="text-lg font-bold truncate">{mostUsedTemplate?.name || 'None'}</p>
              </div>
              <Star className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Efficiency</p>
                <p className="text-2xl font-bold">+45%</p>
              </div>
              <TrendingUp className="w-8 h-8 text-purple-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tab Navigation */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="bulk">Bulk Scheduling</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="mt-6">
          <div className="space-y-4">
            {templates.map((template) => (
              <Card key={template.id} className={cn(!template.isActive && "opacity-60")}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold">{template.name}</h3>
                        <Badge variant="outline" className="capitalize">
                          {template.category}
                        </Badge>
                        {!template.isActive && (
                          <Badge variant="outline" className="text-gray-500">
                            Inactive
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-gray-600 mb-3">{template.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Duration:</span>
                          <span className="ml-1 font-medium">{template.defaultDuration} min</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Usage:</span>
                          <span className="ml-1 font-medium">{template.usageCount} times</span>
                        </div>
                        <div>
                          <span className="text-gray-500">Last Used:</span>
                          <span className="ml-1 font-medium">
                            {template.lastUsed ? format(template.lastUsed, 'MMM d') : 'Never'}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-500">Created:</span>
                          <span className="ml-1 font-medium">{format(template.createdAt, 'MMM d, yyyy')}</span>
                        </div>
                      </div>
                      
                      {template.defaultTags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                          {template.defaultTags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingTemplate(template)}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          // Copy template functionality
                          const copy = { ...template, name: `${template.name} (Copy)` };
                          delete (copy as any).id;
                          delete (copy as any).usageCount;
                          delete (copy as any).createdAt;
                          onCreateTemplate?.(copy);
                        }}
                      >
                        <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onDeleteTemplate?.(template.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="bulk" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Bulk Scheduling</CardTitle>
              <CardDescription>Schedule multiple streams efficiently</CardDescription>
            </CardHeader>
            <CardContent>
              <BulkScheduler
                templates={templates}
                onSchedule={onBulkSchedule || (() => {})}
                onConflictCheck={onConflictCheck}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Template Performance</CardTitle>
                <CardDescription>Usage statistics and effectiveness</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {templates.map((template) => (
                    <div key={template.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <div className="font-medium">{template.name}</div>
                        <div className="text-sm text-gray-600">{template.category}</div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold">{template.usageCount}</div>
                        <div className="text-sm text-gray-500">uses</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Scheduling Insights</CardTitle>
                <CardDescription>Optimize your scheduling strategy</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium text-blue-900">Peak Performance</div>
                    <div className="text-sm text-blue-700">
                      Templates save you an average of 15 minutes per stream setup
                    </div>
                  </div>
                  
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="font-medium text-green-900">Consistency Boost</div>
                    <div className="text-sm text-green-700">
                      Using templates improves stream quality consistency by 30%
                    </div>
                  </div>
                  
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="font-medium text-purple-900">Engagement Impact</div>
                    <div className="text-sm text-purple-700">
                      Regular scheduling increases viewer retention by 25%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Template Form Dialog */}
      <Dialog open={showTemplateForm || !!editingTemplate} onOpenChange={(open) => {
        if (!open) {
          setShowTemplateForm(false);
          setEditingTemplate(null);
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingTemplate ? 'Edit Template' : 'Create New Template'}
            </DialogTitle>
            <DialogDescription>
              {editingTemplate 
                ? 'Update your stream template settings'
                : 'Create a reusable template for consistent streaming'
              }
            </DialogDescription>
          </DialogHeader>
          
          <TemplateForm
            template={editingTemplate || undefined}
            onSave={editingTemplate ? handleUpdateTemplate : handleCreateTemplate}
            onCancel={() => {
              setShowTemplateForm(false);
              setEditingTemplate(null);
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}