'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar,
  Plus,
  Clock,
  Video,
  MessageSquare,
  Radio,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Copy,
  MoreVertical,
  Filter,
  Grid3x3,
  List,
  Star,
  Crown,
  Shield,
  Sparkles,
  Timer,
  CheckCircle,
  AlertCircle,
  Eye
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ScheduledContent {
  id: string;
  title: string;
  type: 'video' | 'post' | 'stream' | 'event';
  date: Date;
  time: string;
  tier: 'public' | 'all' | 'bronze' | 'silver' | 'gold';
  status: 'draft' | 'scheduled' | 'published' | 'live';
  duration?: string;
  thumbnail?: string;
  description?: string;
  autoPublish?: boolean;
  earlyAccess?: {
    enabled: boolean;
    hours: number;
    tier: string;
  };
}

interface ContentCalendarProps {
  onContentAdd?: () => void;
  onContentEdit?: (content: ScheduledContent) => void;
  onContentDelete?: (id: string) => void;
  view?: 'month' | 'week' | 'list';
}

export function ContentCalendar({
  onContentAdd,
  onContentEdit,
  onContentDelete,
  view: initialView = 'month'
}: ContentCalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [view, setView] = React.useState<'month' | 'week' | 'list'>(initialView);
  const [filterTier, setFilterTier] = React.useState<string>('all');
  const [hoveredContent, setHoveredContent] = React.useState<string | null>(null);

  // Sample scheduled content
  const [scheduledContent] = React.useState<ScheduledContent[]>([
    {
      id: '1',
      title: 'Behind the Scenes Episode 5',
      type: 'video',
      date: new Date(2024, 0, 15),
      time: '14:00',
      tier: 'all',
      status: 'scheduled',
      duration: '15:00',
      autoPublish: true,
      earlyAccess: { enabled: true, hours: 48, tier: 'gold' }
    },
    {
      id: '2',
      title: 'Weekly Q&A Session',
      type: 'stream',
      date: new Date(2024, 0, 17),
      time: '18:00',
      tier: 'silver',
      status: 'scheduled',
      duration: '60:00'
    },
    {
      id: '3',
      title: 'Member Exclusive Announcement',
      type: 'post',
      date: new Date(2024, 0, 20),
      time: '12:00',
      tier: 'bronze',
      status: 'draft'
    },
    {
      id: '4',
      title: 'Gold Tier Virtual Meetup',
      type: 'event',
      date: new Date(2024, 0, 25),
      time: '20:00',
      tier: 'gold',
      status: 'scheduled',
      duration: '90:00'
    }
  ]);

  // Calendar helpers
  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getMonthName = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  // Get content for a specific date
  const getContentForDate = (date: Date) => {
    return scheduledContent.filter(content => {
      const contentDate = new Date(content.date);
      return contentDate.getDate() === date.getDate() &&
             contentDate.getMonth() === date.getMonth() &&
             contentDate.getFullYear() === date.getFullYear() &&
             (filterTier === 'all' || content.tier === filterTier);
    });
  };

  // Content type icon
  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'post': return MessageSquare;
      case 'stream': return Radio;
      case 'event': return Calendar;
      default: return Video;
    }
  };

  // Status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-700';
      case 'scheduled': return 'bg-blue-100 text-blue-700';
      case 'published': return 'bg-green-100 text-green-700';
      case 'live': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Tier icon
  const getTierIcon = (tier: string) => {
    switch (tier) {
      case 'bronze': return Shield;
      case 'silver': return Star;
      case 'gold': return Crown;
      default: return null;
    }
  };

  // Render calendar grid
  const renderCalendarGrid = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="p-2 border border-gray-100" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const content = getContentForDate(date);
      const isToday = new Date().toDateString() === date.toDateString();
      const isSelected = selectedDate?.toDateString() === date.toDateString();

      days.push(
        <motion.div
          key={day}
          whileHover={{ scale: 1.02 }}
          className={cn(
            "p-2 border border-gray-200 min-h-[100px] cursor-pointer transition-all",
            isToday && "bg-purple-50 border-purple-300",
            isSelected && "bg-purple-100 border-purple-500",
            "hover:bg-gray-50"
          )}
          onClick={() => setSelectedDate(date)}
        >
          <div className="flex justify-between items-start mb-1">
            <span className={cn(
              "text-sm font-medium",
              isToday && "text-purple-700"
            )}>
              {day}
            </span>
            {content.length > 0 && (
              <Badge variant="secondary" className="text-xs">
                {content.length}
              </Badge>
            )}
          </div>
          
          <div className="space-y-1">
            {content.slice(0, 3).map((item, idx) => {
              const Icon = getContentIcon(item.type);
              const TierIcon = getTierIcon(item.tier);
              
              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group"
                  onMouseEnter={() => setHoveredContent(item.id)}
                  onMouseLeave={() => setHoveredContent(null)}
                >
                  <div className={cn(
                    "flex items-center gap-1 p-1 rounded text-xs transition-all",
                    getStatusColor(item.status),
                    hoveredContent === item.id && "ring-2 ring-purple-400"
                  )}>
                    <Icon className="h-3 w-3" />
                    {TierIcon && <TierIcon className="h-3 w-3" />}
                    <span className="truncate flex-1">{item.title}</span>
                  </div>
                </motion.div>
              );
            })}
            {content.length > 3 && (
              <div className="text-xs text-gray-500 text-center">
                +{content.length - 3} more
              </div>
            )}
          </div>
        </motion.div>
      );
    }

    return days;
  };

  // Render list view
  const renderListView = () => {
    const filteredContent = filterTier === 'all' 
      ? scheduledContent 
      : scheduledContent.filter(c => c.tier === filterTier);

    return (
      <div className="space-y-3">
        {filteredContent.map((item) => {
          const Icon = getContentIcon(item.type);
          const TierIcon = getTierIcon(item.tier);
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              whileHover={{ x: 4 }}
              className="flex items-center justify-between p-4 bg-white border rounded-lg hover:border-purple-300 transition-all"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Icon className="h-6 w-6 text-purple-600" />
                </div>
                
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium">{item.title}</h4>
                    {TierIcon && (
                      <Badge variant="outline" className="text-xs">
                        <TierIcon className="h-3 w-3 mr-1" />
                        {item.tier}
                      </Badge>
                    )}
                    <Badge className={cn("text-xs", getStatusColor(item.status))}>
                      {item.status}
                    </Badge>
                    {item.autoPublish && (
                      <Badge variant="secondary" className="text-xs">
                        <Timer className="h-3 w-3 mr-1" />
                        Auto
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                    <span>
                      <Calendar className="h-3 w-3 inline mr-1" />
                      {item.date.toLocaleDateString()}
                    </span>
                    <span>
                      <Clock className="h-3 w-3 inline mr-1" />
                      {item.time}
                    </span>
                    {item.duration && (
                      <span>
                        <Timer className="h-3 w-3 inline mr-1" />
                        {item.duration}
                      </span>
                    )}
                    {item.earlyAccess?.enabled && (
                      <span className="text-green-600">
                        <Sparkles className="h-3 w-3 inline mr-1" />
                        {item.earlyAccess.hours}h early access
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={() => onContentEdit?.(item)}>
                  <Edit className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Copy className="h-4 w-4 mr-2" />
                      Duplicate
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-red-600"
                      onClick={() => onContentDelete?.(item.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Controls */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Content Calendar</CardTitle>
            <div className="flex items-center gap-2">
              {/* View Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                  variant={view === 'month' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('month')}
                >
                  <Grid3x3 className="h-4 w-4 mr-2" />
                  Month
                </Button>
                <Button
                  variant={view === 'week' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('week')}
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Week
                </Button>
                <Button
                  variant={view === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setView('list')}
                >
                  <List className="h-4 w-4 mr-2" />
                  List
                </Button>
              </div>
              
              {/* Filter */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    {filterTier === 'all' ? 'All Tiers' : filterTier}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setFilterTier('all')}>
                    All Tiers
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setFilterTier('public')}>
                    Public
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterTier('bronze')}>
                    <Shield className="h-4 w-4 mr-2" />
                    Bronze
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterTier('silver')}>
                    <Star className="h-4 w-4 mr-2" />
                    Silver
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setFilterTier('gold')}>
                    <Crown className="h-4 w-4 mr-2" />
                    Gold
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Add Content */}
              <Button onClick={onContentAdd}>
                <Plus className="h-4 w-4 mr-2" />
                Add Content
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Calendar Navigation */}
      {view === 'month' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={() => navigateMonth('prev')}>
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <h2 className="text-xl font-semibold">{getMonthName(currentDate)}</h2>
              <Button variant="ghost" size="icon" onClick={() => navigateMonth('next')}>
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Calendar Content */}
      <Card>
        <CardContent className="p-6">
          {view === 'month' ? (
            <>
              {/* Day headers */}
              <div className="grid grid-cols-7 gap-0 mb-2">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 text-center text-sm font-medium text-gray-600">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-0">
                {renderCalendarGrid()}
              </div>
            </>
          ) : view === 'list' ? (
            renderListView()
          ) : (
            <div className="text-center py-12 text-gray-500">
              Week view coming soon...
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Scheduled</p>
                <p className="text-2xl font-bold">12</p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Drafts</p>
                <p className="text-2xl font-bold">5</p>
              </div>
              <Edit className="h-8 w-8 text-gray-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Published</p>
                <p className="text-2xl font-bold">48</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Auto-Queue</p>
                <p className="text-2xl font-bold">8</p>
              </div>
              <Timer className="h-8 w-8 text-purple-500 opacity-20" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}