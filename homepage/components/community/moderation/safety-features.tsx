'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Shield,
  Lock,
  Eye,
  EyeOff,
  UserX,
  Ban,
  VolumeX,
  MessageSquareOff,
  Filter,
  AlertTriangle,
  Info,
  Settings,
  Bell,
  BellOff,
  Users,
  UserCheck,
  Globe,
  CheckCircle,
  XCircle,
  Heart,
  HeartOff,
  Flag,
  FileText,
  Image as ImageIcon,
  Video,
  Mic,
  MicOff,
  Camera,
  CameraOff,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Download,
  Upload,
  RefreshCw,
  HelpCircle,
  ChevronRight,
  ToggleLeft,
  ToggleRight,
  Zap,
  Star,
  Award
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface PrivacySetting {
  id: string;
  label: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
  level?: 'low' | 'medium' | 'high';
  category: 'profile' | 'content' | 'interaction' | 'data';
}

interface BlockedUser {
  id: string;
  name: string;
  avatar?: string;
  blockedDate: Date;
  reason?: string;
}

interface ContentFilter {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  strength: 'light' | 'moderate' | 'strict';
  categories: string[];
}

interface SafetyAlert {
  id: string;
  type: 'warning' | 'info' | 'danger';
  title: string;
  description: string;
  timestamp: Date;
  actionRequired?: boolean;
  actions?: Array<{
    label: string;
    action: () => void;
  }>;
}

interface SafetyFeaturesProps {
  userId?: string;
  userRole?: 'member' | 'creator' | 'moderator' | 'admin';
  onUpdatePrivacy?: (settings: PrivacySetting[]) => void;
  onBlockUser?: (userId: string, reason?: string) => void;
  onUnblockUser?: (userId: string) => void;
  onUpdateFilters?: (filters: ContentFilter[]) => void;
  onReportIssue?: (issue: any) => void;
  showAlerts?: boolean;
  showEducation?: boolean;
}

export function SafetyFeatures({
  userId = 'user1',
  userRole = 'member',
  onUpdatePrivacy,
  onBlockUser,
  onUnblockUser,
  onUpdateFilters,
  onReportIssue,
  showAlerts = true,
  showEducation = true
}: SafetyFeaturesProps) {
  const [activeTab, setActiveTab] = React.useState<'privacy' | 'blocking' | 'filters' | 'alerts' | 'education'>('privacy');
  const [showBlockModal, setShowBlockModal] = React.useState(false);
  const [blockUsername, setBlockUsername] = React.useState('');
  const [blockReason, setBlockReason] = React.useState('');
  const [selectedPrivacyLevel, setSelectedPrivacyLevel] = React.useState<'custom' | 'low' | 'medium' | 'high'>('medium');

  // Privacy settings
  const [privacySettings, setPrivacySettings] = React.useState<PrivacySetting[]>([
    {
      id: 'profile-visibility',
      label: 'Profile Visibility',
      description: 'Control who can view your profile',
      icon: Eye,
      enabled: true,
      level: 'medium',
      category: 'profile'
    },
    {
      id: 'message-privacy',
      label: 'Message Privacy',
      description: 'Control who can send you messages',
      icon: MessageSquareOff,
      enabled: true,
      level: 'high',
      category: 'interaction'
    },
    {
      id: 'content-visibility',
      label: 'Content Visibility',
      description: 'Control who can see your posts',
      icon: Globe,
      enabled: false,
      level: 'low',
      category: 'content'
    },
    {
      id: 'location-sharing',
      label: 'Location Sharing',
      description: 'Hide your location information',
      icon: MapPin,
      enabled: true,
      level: 'high',
      category: 'data'
    },
    {
      id: 'online-status',
      label: 'Online Status',
      description: 'Hide when you are online',
      icon: Clock,
      enabled: false,
      level: 'low',
      category: 'profile'
    },
    {
      id: 'email-privacy',
      label: 'Email Privacy',
      description: 'Hide your email from other users',
      icon: Mail,
      enabled: true,
      level: 'high',
      category: 'data'
    }
  ]);

  // Blocked users
  const [blockedUsers, setBlockedUsers] = React.useState<BlockedUser[]>([
    {
      id: 'blocked1',
      name: 'John Troublemaker',
      avatar: '👤',
      blockedDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      reason: 'Harassment'
    },
    {
      id: 'blocked2',
      name: 'SpamBot123',
      blockedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
      reason: 'Spam'
    }
  ]);

  // Content filters
  const [contentFilters, setContentFilters] = React.useState<ContentFilter[]>([
    {
      id: 'explicit-content',
      name: 'Explicit Content Filter',
      description: 'Block adult and explicit content',
      enabled: true,
      strength: 'strict',
      categories: ['nsfw', 'adult', 'violence']
    },
    {
      id: 'profanity-filter',
      name: 'Profanity Filter',
      description: 'Filter out offensive language',
      enabled: true,
      strength: 'moderate',
      categories: ['profanity', 'slurs', 'hate-speech']
    },
    {
      id: 'spam-filter',
      name: 'Spam Detection',
      description: 'Automatically hide spam content',
      enabled: true,
      strength: 'moderate',
      categories: ['spam', 'scams', 'phishing']
    },
    {
      id: 'sensitive-topics',
      name: 'Sensitive Topics',
      description: 'Warn before showing sensitive content',
      enabled: false,
      strength: 'light',
      categories: ['politics', 'religion', 'controversial']
    }
  ]);

  // Safety alerts
  const safetyAlerts: SafetyAlert[] = [
    {
      id: 'alert1',
      type: 'warning',
      title: 'Suspicious Login Attempt',
      description: 'We detected a login attempt from an unusual location',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      actionRequired: true,
      actions: [
        { label: 'Review Activity', action: () => console.log('Review') },
        { label: 'Secure Account', action: () => console.log('Secure') }
      ]
    },
    {
      id: 'alert2',
      type: 'info',
      title: 'Privacy Settings Updated',
      description: 'Your privacy settings have been successfully updated',
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000)
    }
  ];

  const handlePrivacyToggle = (settingId: string) => {
    const updated = privacySettings.map(setting =>
      setting.id === settingId ? { ...setting, enabled: !setting.enabled } : setting
    );
    setPrivacySettings(updated);
    onUpdatePrivacy?.(updated);
  };

  const handleBlockUser = () => {
    if (!blockUsername.trim()) return;
    
    const newBlock: BlockedUser = {
      id: `blocked-${Date.now()}`,
      name: blockUsername,
      blockedDate: new Date(),
      reason: blockReason
    };
    
    setBlockedUsers([...blockedUsers, newBlock]);
    onBlockUser?.(newBlock.id, blockReason);
    setBlockUsername('');
    setBlockReason('');
    setShowBlockModal(false);
  };

  const handleUnblock = (userId: string) => {
    setBlockedUsers(blockedUsers.filter(u => u.id !== userId));
    onUnblockUser?.(userId);
  };

  const handleFilterChange = (filterId: string, field: 'enabled' | 'strength', value: any) => {
    const updated = contentFilters.map(filter =>
      filter.id === filterId ? { ...filter, [field]: value } : filter
    );
    setContentFilters(updated);
    onUpdateFilters?.(updated);
  };

  const applyPrivacyPreset = (level: 'low' | 'medium' | 'high') => {
    const updated = privacySettings.map(setting => ({
      ...setting,
      enabled: level === 'high' || (level === 'medium' && setting.level !== 'low'),
      level: level
    }));
    setPrivacySettings(updated);
    setSelectedPrivacyLevel(level);
    onUpdatePrivacy?.(updated);
  };

  const renderPrivacy = () => (
    <div className="space-y-6">
      {/* Privacy Presets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Privacy Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 mb-6">
            {(['low', 'medium', 'high'] as const).map((level) => (
              <Card 
                key={level}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  selectedPrivacyLevel === level && "border-purple-500 bg-purple-50"
                )}
                onClick={() => applyPrivacyPreset(level)}
              >
                <CardContent className="p-4 text-center">
                  <div className={cn(
                    "w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2",
                    level === 'low' && "bg-green-100",
                    level === 'medium' && "bg-yellow-100",
                    level === 'high' && "bg-red-100"
                  )}>
                    <Shield className={cn(
                      "h-6 w-6",
                      level === 'low' && "text-green-600",
                      level === 'medium' && "text-yellow-600",
                      level === 'high' && "text-red-600"
                    )} />
                  </div>
                  <h4 className="font-semibold capitalize mb-1">{level}</h4>
                  <p className="text-xs text-gray-600">
                    {level === 'low' && 'Open to connections'}
                    {level === 'medium' && 'Balanced privacy'}
                    {level === 'high' && 'Maximum protection'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Button 
            variant={selectedPrivacyLevel === 'custom' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPrivacyLevel('custom')}
          >
            Custom Settings
          </Button>
        </CardContent>
      </Card>

      {/* Individual Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(
              privacySettings.reduce((acc, setting) => {
                if (!acc[setting.category]) acc[setting.category] = [];
                acc[setting.category].push(setting);
                return acc;
              }, {} as Record<string, PrivacySetting[]>)
            ).map(([category, settings]) => (
              <div key={category}>
                <h4 className="font-medium text-sm text-gray-600 mb-3 capitalize">
                  {category} Settings
                </h4>
                <div className="space-y-3">
                  {settings.map((setting) => {
                    const Icon = setting.icon;
                    return (
                      <div key={setting.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <Icon className="h-5 w-5 text-gray-600" />
                          <div>
                            <div className="font-medium text-sm">{setting.label}</div>
                            <div className="text-xs text-gray-500">{setting.description}</div>
                          </div>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handlePrivacyToggle(setting.id)}
                        >
                          {setting.enabled ? (
                            <ToggleRight className="h-5 w-5 text-green-600" />
                          ) : (
                            <ToggleLeft className="h-5 w-5 text-gray-400" />
                          )}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderBlocking = () => (
    <div className="space-y-6">
      {/* Block User */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserX className="h-5 w-5" />
            Block Users
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Block users to prevent them from contacting you or seeing your content
          </p>
          <Button onClick={() => setShowBlockModal(true)}>
            <Ban className="h-4 w-4 mr-2" />
            Block User
          </Button>
        </CardContent>
      </Card>

      {/* Blocked Users List */}
      <Card>
        <CardHeader>
          <CardTitle>Blocked Users ({blockedUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {blockedUsers.length === 0 ? (
            <div className="text-center py-8">
              <UserCheck className="h-12 w-12 text-gray-400 mx-auto mb-3" />
              <p className="text-gray-600">No blocked users</p>
            </div>
          ) : (
            <div className="space-y-3">
              {blockedUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{user.name}</div>
                      <div className="text-sm text-gray-500">
                        Blocked {Math.floor((Date.now() - user.blockedDate.getTime()) / (24 * 60 * 60 * 1000))} days ago
                        {user.reason && ` • ${user.reason}`}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleUnblock(user.id)}
                  >
                    Unblock
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Mute Options */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <VolumeX className="h-5 w-5" />
            Mute Options
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center gap-3">
                <Bell className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="font-medium text-sm">Mute Notifications</div>
                  <div className="text-xs text-gray-500">Temporarily disable all notifications</div>
                </div>
              </div>
              <select className="text-sm border rounded px-2 py-1">
                <option>Off</option>
                <option>1 hour</option>
                <option>8 hours</option>
                <option>24 hours</option>
                <option>Until turned on</option>
              </select>
            </div>
            
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded">
              <div className="flex items-center gap-3">
                <MessageSquareOff className="h-5 w-5 text-gray-600" />
                <div>
                  <div className="font-medium text-sm">Mute Keywords</div>
                  <div className="text-xs text-gray-500">Hide posts containing specific words</div>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderFilters = () => (
    <div className="space-y-6">
      {/* Content Filters */}
      {contentFilters.map((filter) => (
        <Card key={filter.id}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                {filter.name}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFilterChange(filter.id, 'enabled', !filter.enabled)}
              >
                {filter.enabled ? (
                  <ToggleRight className="h-5 w-5 text-green-600" />
                ) : (
                  <ToggleLeft className="h-5 w-5 text-gray-400" />
                )}
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600 mb-4">{filter.description}</p>
            
            {filter.enabled && (
              <div>
                <label className="text-sm font-medium mb-2 block">Filter Strength</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['light', 'moderate', 'strict'] as const).map((strength) => (
                    <Button
                      key={strength}
                      variant={filter.strength === strength ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleFilterChange(filter.id, 'strength', strength)}
                    >
                      {strength.charAt(0).toUpperCase() + strength.slice(1)}
                    </Button>
                  ))}
                </div>
                
                <div className="mt-4">
                  <label className="text-sm font-medium mb-2 block">Categories</label>
                  <div className="flex flex-wrap gap-2">
                    {filter.categories.map((category) => (
                      <Badge key={category} variant="secondary">
                        {category}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderAlerts = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Safety Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {safetyAlerts.map((alert) => (
              <div
                key={alert.id}
                className={cn(
                  "p-4 rounded-lg border",
                  alert.type === 'warning' && "bg-yellow-50 border-yellow-200",
                  alert.type === 'info' && "bg-blue-50 border-blue-200",
                  alert.type === 'danger' && "bg-red-50 border-red-200"
                )}
              >
                <div className="flex items-start gap-3">
                  <AlertTriangle className={cn(
                    "h-5 w-5 mt-0.5",
                    alert.type === 'warning' && "text-yellow-600",
                    alert.type === 'info' && "text-blue-600",
                    alert.type === 'danger' && "text-red-600"
                  )} />
                  <div className="flex-1">
                    <h4 className="font-medium mb-1">{alert.title}</h4>
                    <p className="text-sm text-gray-600 mb-2">{alert.description}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {Math.floor((Date.now() - alert.timestamp.getTime()) / (60 * 60 * 1000))} hours ago
                      </span>
                      {alert.actionRequired && (
                        <Badge variant="outline" className="text-xs bg-orange-50 text-orange-700">
                          Action Required
                        </Badge>
                      )}
                    </div>
                    {alert.actions && (
                      <div className="flex gap-2 mt-3">
                        {alert.actions.map((action, index) => (
                          <Button
                            key={index}
                            size="sm"
                            variant={index === 0 ? 'default' : 'outline'}
                            onClick={action.action}
                          >
                            {action.label}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderEducation = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="h-5 w-5" />
            Safety Resources
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {[
              {
                title: 'Privacy Best Practices',
                description: 'Learn how to protect your personal information',
                icon: Lock,
                color: 'text-blue-600 bg-blue-100'
              },
              {
                title: 'Recognizing Scams',
                description: 'Identify and avoid common online scams',
                icon: AlertTriangle,
                color: 'text-yellow-600 bg-yellow-100'
              },
              {
                title: 'Safe Communication',
                description: 'Tips for safe online interactions',
                icon: MessageSquareOff,
                color: 'text-green-600 bg-green-100'
              },
              {
                title: 'Report Abuse',
                description: 'How to report harmful content and behavior',
                icon: Flag,
                color: 'text-red-600 bg-red-100'
              }
            ].map((resource) => (
              <Card key={resource.title} className="hover:shadow-md transition-all cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", resource.color.split(' ')[1])}>
                      <resource.icon className={cn("h-5 w-5", resource.color.split(' ')[0])} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium mb-1">{resource.title}</h4>
                      <p className="text-sm text-gray-600">{resource.description}</p>
                      <Button variant="link" size="sm" className="px-0 mt-2">
                        Learn More
                        <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Safety & Privacy</h2>
          <p className="text-gray-600">Manage your safety settings and privacy controls</p>
        </div>
        
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Download Data
        </Button>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: 'privacy', label: 'Privacy', icon: Lock },
            { id: 'blocking', label: 'Blocking', icon: UserX },
            { id: 'filters', label: 'Content Filters', icon: Filter },
            { id: 'alerts', label: 'Alerts', icon: Bell, show: showAlerts },
            { id: 'education', label: 'Resources', icon: HelpCircle, show: showEducation }
          ].filter(tab => tab.show !== false).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={cn(
                "flex items-center gap-2 py-2 px-1 border-b-2 font-medium text-sm transition-colors",
                activeTab === tab.id
                  ? "border-purple-500 text-purple-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              )}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'privacy' && renderPrivacy()}
          {activeTab === 'blocking' && renderBlocking()}
          {activeTab === 'filters' && renderFilters()}
          {activeTab === 'alerts' && showAlerts && renderAlerts()}
          {activeTab === 'education' && showEducation && renderEducation()}
        </motion.div>
      </AnimatePresence>

      {/* Block User Modal */}
      <AnimatePresence>
        {showBlockModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
          >
            <Card className="max-w-md w-full">
              <CardHeader>
                <CardTitle>Block User</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Username</label>
                    <Input
                      placeholder="Enter username to block"
                      value={blockUsername}
                      onChange={(e) => setBlockUsername(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Reason (optional)</label>
                    <Textarea
                      placeholder="Why are you blocking this user?"
                      value={blockReason}
                      onChange={(e) => setBlockReason(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      onClick={handleBlockUser}
                      disabled={!blockUsername.trim()}
                    >
                      Block User
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowBlockModal(false)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}