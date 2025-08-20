'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import {
  Settings,
  Globe,
  Lock,
  Users,
  Eye,
  EyeOff,
  Calendar as CalendarIcon,
  Clock,
  Tag,
  Image as ImageIcon,
  Upload,
  X,
  Plus,
  Info,
  AlertTriangle,
  CheckCircle,
  Save,
  RotateCcw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import {
  StreamSetup,
  StreamPrivacy,
  MonetizationSettings,
  DEFAULT_STREAM_SETUP,
  DEFAULT_MONETIZATION_SETTINGS,
  STREAMING_WORKFLOW_STEPS
} from '@/lib/types/creator-streaming';
import { StreamCategory, STREAM_CATEGORIES } from '@/lib/types/live-discovery';

interface StreamSetupPanelProps {
  setup: StreamSetup;
  monetization: MonetizationSettings;
  onSetupChange: (setup: Partial<StreamSetup>) => void;
  onMonetizationChange: (monetization: Partial<MonetizationSettings>) => void;
  onSave: () => void;
  onReset: () => void;
  isValid: boolean;
  hasUnsavedChanges: boolean;
  className?: string;
}

export function StreamSetupPanel({
  setup,
  monetization,
  onSetupChange,
  onMonetizationChange,
  onSave,
  onReset,
  isValid,
  hasUnsavedChanges,
  className
}: StreamSetupPanelProps) {
  const [activeTab, setActiveTab] = useState('basic');
  const [showCalendar, setShowCalendar] = useState(false);
  const [newTag, setNewTag] = useState('');
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Validation
  useEffect(() => {
    const newErrors: Record<string, string> = {};
    
    if (!setup.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (setup.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    } else if (setup.title.length > 100) {
      newErrors.title = 'Title must be less than 100 characters';
    }

    if (!setup.description.trim()) {
      newErrors.description = 'Description is required';
    } else if (setup.description.length < 10) {
      newErrors.description = 'Description must be at least 10 characters';
    } else if (setup.description.length > 500) {
      newErrors.description = 'Description must be less than 500 characters';
    }

    if (setup.tags.length === 0) {
      newErrors.tags = 'At least one tag is required';
    }

    if (setup.scheduledStartTime && setup.scheduledStartTime <= new Date()) {
      newErrors.scheduledStartTime = 'Scheduled time must be in the future';
    }

    setErrors(newErrors);
  }, [setup]);

  const handleInputChange = (field: keyof StreamSetup, value: any) => {
    onSetupChange({ [field]: value });
  };

  const handleMonetizationChange = (field: keyof MonetizationSettings, value: any) => {
    onMonetizationChange({ [field]: value });
  };

  const addTag = () => {
    if (newTag.trim() && !setup.tags.includes(newTag.trim()) && setup.tags.length < 10) {
      handleInputChange('tags', [...setup.tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    handleInputChange('tags', setup.tags.filter(tag => tag !== tagToRemove));
  };

  const handleThumbnailUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setThumbnailPreview(result);
        handleInputChange('thumbnailUrl', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const getPrivacyIcon = (privacy: StreamPrivacy) => {
    switch (privacy) {
      case 'public': return <Globe className="w-4 h-4" />;
      case 'unlisted': return <EyeOff className="w-4 h-4" />;
      case 'subscribers-only': return <Users className="w-4 h-4" />;
      case 'followers-only': return <Eye className="w-4 h-4" />;
      default: return <Lock className="w-4 h-4" />;
    }
  };

  const getStepStatus = (stepId: string) => {
    switch (stepId) {
      case 'equipment-check':
        return 'completed';
      case 'stream-details':
        return Object.keys(errors).length === 0 ? 'completed' : 'in-progress';
      case 'monetization':
        return monetization.enableTips || monetization.enableGifts ? 'completed' : 'pending';
      case 'promotion':
        return 'pending';
      case 'go-live':
        return isValid ? 'ready' : 'pending';
      default:
        return 'pending';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in-progress':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'ready':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      default:
        return <div className="w-4 h-4 rounded-full border-2 border-gray-300" />;
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Setup Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Stream Setup</h2>
          <p className="text-gray-600 dark:text-gray-400">
            Configure your stream details and settings
          </p>
        </div>

        <div className="flex items-center gap-2">
          {hasUnsavedChanges && (
            <Badge variant="outline" className="border-orange-200 text-orange-700">
              Unsaved Changes
            </Badge>
          )}
          <Button variant="outline" onClick={onReset} disabled={!hasUnsavedChanges}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
          <Button onClick={onSave} disabled={!hasUnsavedChanges || !isValid}>
            <Save className="w-4 h-4 mr-2" />
            Save Setup
          </Button>
        </div>
      </div>

      {/* Workflow Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Setup Progress</CardTitle>
          <CardDescription>Complete these steps to go live</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {STREAMING_WORKFLOW_STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center gap-3">
                {getStatusIcon(getStepStatus(step.id))}
                <div className="flex-1">
                  <div className="font-medium">{step.title}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {step.description}
                  </div>
                </div>
                {step.required && (
                  <Badge variant="outline" className="text-xs">
                    Required
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Setup Form */}
      <Card>
        <CardHeader>
          <CardTitle>Stream Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="privacy">Privacy</TabsTrigger>
              <TabsTrigger value="monetization">Monetization</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="basic" className="space-y-6 mt-6">
              {/* Stream Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Stream Title *</Label>
                <Input
                  id="title"
                  value={setup.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter an engaging title for your stream..."
                  maxLength={100}
                  className={cn(errors.title && 'border-red-500')}
                />
                <div className="flex justify-between text-sm">
                  {errors.title && (
                    <span className="text-red-500">{errors.title}</span>
                  )}
                  <span className="text-gray-500 ml-auto">
                    {setup.title.length}/100
                  </span>
                </div>
              </div>

              {/* Stream Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  value={setup.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Describe what viewers can expect from your stream..."
                  rows={4}
                  maxLength={500}
                  className={cn(errors.description && 'border-red-500')}
                />
                <div className="flex justify-between text-sm">
                  {errors.description && (
                    <span className="text-red-500">{errors.description}</span>
                  )}
                  <span className="text-gray-500 ml-auto">
                    {setup.description.length}/500
                  </span>
                </div>
              </div>

              {/* Category and Language */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select 
                    value={setup.category} 
                    onValueChange={(value: StreamCategory) => handleInputChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(STREAM_CATEGORIES).map(([categoryId, category]) => (
                        <SelectItem key={categoryId} value={categoryId}>
                          <div className="flex items-center gap-2">
                            <span>{category.icon}</span>
                            {category.displayName}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Language</Label>
                  <Select 
                    value={setup.language} 
                    onValueChange={(value) => handleInputChange('language', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">🇺🇸 English</SelectItem>
                      <SelectItem value="fr">🇫🇷 Français</SelectItem>
                      <SelectItem value="ht">🇭🇹 Kreyòl Ayisyen</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <Label>Tags *</Label>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Add a tag..."
                      onKeyPress={(e) => e.key === 'Enter' && addTag()}
                      maxLength={20}
                    />
                    <Button 
                      type="button" 
                      onClick={addTag}
                      disabled={!newTag.trim() || setup.tags.length >= 10}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {setup.tags.map((tag) => (
                      <Badge 
                        key={tag} 
                        variant="secondary" 
                        className="flex items-center gap-1"
                      >
                        #{tag}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeTag(tag)}
                          className="h-auto p-0 ml-1 hover:bg-transparent"
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex justify-between text-sm">
                    {errors.tags && (
                      <span className="text-red-500">{errors.tags}</span>
                    )}
                    <span className="text-gray-500 ml-auto">
                      {setup.tags.length}/10 tags
                    </span>
                  </div>
                </div>
              </div>

              {/* Thumbnail Upload */}
              <div className="space-y-2">
                <Label>Stream Thumbnail</Label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6">
                  {thumbnailPreview ? (
                    <div className="relative">
                      <img 
                        src={thumbnailPreview} 
                        alt="Thumbnail preview" 
                        className="w-full max-w-md mx-auto rounded-lg"
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setThumbnailPreview(null);
                          handleInputChange('thumbnailUrl', undefined);
                        }}
                        className="absolute top-2 right-2"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <ImageIcon className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <div className="mb-4">
                        <p className="text-sm font-medium">Upload a thumbnail</p>
                        <p className="text-xs text-gray-500">
                          Recommended: 1920x1080px, max 5MB
                        </p>
                      </div>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailUpload}
                        className="max-w-xs mx-auto"
                      />
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="privacy" className="space-y-6 mt-6">
              {/* Privacy Settings */}
              <div className="space-y-4">
                <div>
                  <Label className="text-base font-medium">Who can watch your stream?</Label>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Choose who can discover and watch your live stream
                  </p>
                </div>

                <div className="space-y-3">
                  {([
                    { value: 'public', label: 'Public', description: 'Anyone can find and watch your stream' },
                    { value: 'unlisted', label: 'Unlisted', description: 'Only people with the link can watch' },
                    { value: 'followers-only', label: 'Followers Only', description: 'Only your followers can watch' },
                    { value: 'subscribers-only', label: 'Subscribers Only', description: 'Only your subscribers can watch' }
                  ] as const).map((option) => (
                    <div 
                      key={option.value}
                      className={cn(
                        'border rounded-lg p-4 cursor-pointer transition-all',
                        setup.privacy === option.value 
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' 
                          : 'border-gray-200 hover:border-gray-300'
                      )}
                      onClick={() => handleInputChange('privacy', option.value)}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          'w-4 h-4 rounded-full border-2',
                          setup.privacy === option.value 
                            ? 'border-purple-500 bg-purple-500' 
                            : 'border-gray-300'
                        )}>
                          {setup.privacy === option.value && (
                            <div className="w-full h-full rounded-full bg-white scale-50" />
                          )}
                        </div>
                        {getPrivacyIcon(option.value)}
                        <div>
                          <div className="font-medium">{option.label}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {option.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Feature Toggles */}
              <Separator />
              
              <div className="space-y-4">
                <h3 className="text-base font-medium">Stream Features</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Enable Chat</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Allow viewers to chat during your stream
                      </div>
                    </div>
                    <Switch
                      checked={setup.enableChat}
                      onCheckedChange={(checked) => handleInputChange('enableChat', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Record Stream</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Save your stream for later viewing
                      </div>
                    </div>
                    <Switch
                      checked={setup.enableRecording}
                      onCheckedChange={(checked) => handleInputChange('enableRecording', checked)}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">Send Notifications</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        Notify your followers when you go live
                      </div>
                    </div>
                    <Switch
                      checked={setup.enableNotifications}
                      onCheckedChange={(checked) => handleInputChange('enableNotifications', checked)}
                    />
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="monetization" className="space-y-6 mt-6">
              {/* Monetization Features */}
              <div className="space-y-4">
                <div>
                  <h3 className="text-base font-medium">Monetization Options</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Enable ways for your audience to support you during the stream
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className={cn(
                    'cursor-pointer transition-all',
                    monetization.enableTips && 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  )}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">Tips</div>
                        <Switch
                          checked={monetization.enableTips}
                          onCheckedChange={(checked) => handleMonetizationChange('enableTips', checked)}
                        />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Allow viewers to send direct monetary tips
                      </p>
                    </CardContent>
                  </Card>

                  <Card className={cn(
                    'cursor-pointer transition-all',
                    monetization.enableGifts && 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  )}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">Virtual Gifts</div>
                        <Switch
                          checked={monetization.enableGifts}
                          onCheckedChange={(checked) => handleMonetizationChange('enableGifts', checked)}
                        />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Enable virtual gifts and stickers
                      </p>
                    </CardContent>
                  </Card>

                  <Card className={cn(
                    'cursor-pointer transition-all',
                    monetization.enableSuperChat && 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20'
                  )}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">Super Chat</div>
                        <Switch
                          checked={monetization.enableSuperChat}
                          onCheckedChange={(checked) => handleMonetizationChange('enableSuperChat', checked)}
                        />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Highlighted paid messages in chat
                      </p>
                    </CardContent>
                  </Card>

                  <Card className={cn(
                    'cursor-pointer transition-all',
                    monetization.enableSubscriptions && 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                  )}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="font-medium">Subscriptions</div>
                        <Switch
                          checked={monetization.enableSubscriptions}
                          onCheckedChange={(checked) => handleMonetizationChange('enableSubscriptions', checked)}
                        />
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Monthly subscriber perks and benefits
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Tip Goal */}
              {monetization.enableTips && (
                <>
                  <Separator />
                  <div className="space-y-4">
                    <h4 className="font-medium">Tip Goal (Optional)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Goal Amount ($)</Label>
                        <Input
                          type="number"
                          value={monetization.tipGoal?.amount || ''}
                          onChange={(e) => handleMonetizationChange('tipGoal', {
                            ...monetization.tipGoal,
                            amount: parseInt(e.target.value) || 0
                          })}
                          placeholder="100"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Goal Description</Label>
                        <Input
                          value={monetization.tipGoal?.description || ''}
                          onChange={(e) => handleMonetizationChange('tipGoal', {
                            ...monetization.tipGoal,
                            description: e.target.value
                          })}
                          placeholder="New microphone fund"
                        />
                      </div>
                    </div>
                  </div>
                </>
              )}
            </TabsContent>

            <TabsContent value="advanced" className="space-y-6 mt-6">
              {/* Scheduling */}
              <div className="space-y-4">
                <h3 className="text-base font-medium">Stream Scheduling</h3>
                
                <div className="flex items-center gap-4">
                  <Switch
                    checked={!!setup.scheduledStartTime}
                    onCheckedChange={(checked) => {
                      if (!checked) {
                        handleInputChange('scheduledStartTime', undefined);
                      }
                    }}
                  />
                  <div>
                    <div className="font-medium">Schedule Stream</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      Set a specific time to start streaming
                    </div>
                  </div>
                </div>

                {setup.scheduledStartTime !== undefined && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Scheduled Date & Time</Label>
                      <Popover open={showCalendar} onOpenChange={setShowCalendar}>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className="justify-start text-left">
                            <CalendarIcon className="w-4 h-4 mr-2" />
                            {setup.scheduledStartTime 
                              ? format(setup.scheduledStartTime, 'PPP p')
                              : 'Select date and time'
                            }
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={setup.scheduledStartTime || undefined}
                            onSelect={(date) => {
                              if (date) {
                                // Set time to current time if not set
                                const now = new Date();
                                date.setHours(now.getHours(), now.getMinutes());
                                handleInputChange('scheduledStartTime', date);
                              }
                              setShowCalendar(false);
                            }}
                            disabled={(date) => date < new Date()}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      {errors.scheduledStartTime && (
                        <span className="text-sm text-red-500">{errors.scheduledStartTime}</span>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Estimated Duration (minutes)</Label>
                      <Input
                        type="number"
                        value={setup.estimatedDuration || ''}
                        onChange={(e) => handleInputChange('estimatedDuration', parseInt(e.target.value) || undefined)}
                        placeholder="60"
                        min="1"
                        max="480"
                      />
                    </div>
                  </div>
                )}
              </div>

              <Separator />

              {/* Advanced Settings */}
              <div className="space-y-4">
                <h3 className="text-base font-medium">Advanced Settings</h3>
                
                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <Info className="w-4 h-4 mt-0.5 text-blue-500" />
                    <div className="text-sm">
                      <p className="font-medium mb-1">Additional Options</p>
                      <p className="text-gray-600 dark:text-gray-400">
                        More advanced streaming options including encoder settings, 
                        bitrate control, and custom RTMP settings will be available 
                        in the live streaming dashboard once you start your stream.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}