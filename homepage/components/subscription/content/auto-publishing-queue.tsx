'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Progress } from '@/components/ui/progress';
import { 
  Clock,
  Play,
  Pause,
  SkipForward,
  RefreshCw,
  Settings,
  Timer,
  Calendar,
  Video,
  MessageSquare,
  Radio,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  XCircle,
  Zap,
  TrendingUp,
  BarChart3,
  Upload,
  Edit,
  Trash2,
  GripVertical
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, Reorder } from 'framer-motion';

interface QueuedContent {
  id: string;
  title: string;
  type: 'video' | 'post' | 'stream' | 'event';
  tier: 'public' | 'all' | 'bronze' | 'silver' | 'gold';
  scheduledDate: Date;
  scheduledTime: string;
  status: 'queued' | 'processing' | 'published' | 'failed' | 'paused';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  retries?: number;
  maxRetries?: number;
  publishSettings?: {
    notifySubscribers: boolean;
    crossPost: boolean;
    earlyAccess: boolean;
    autoTweet: boolean;
  };
  analytics?: {
    estimatedReach: number;
    optimalTime: boolean;
    engagement: string;
  };
}

interface AutoPublishingQueueProps {
  onQueueUpdate?: (queue: QueuedContent[]) => void;
  onContentEdit?: (content: QueuedContent) => void;
  onContentPublish?: (id: string) => void;
}

export function AutoPublishingQueue({
  onQueueUpdate,
  onContentEdit,
  onContentPublish
}: AutoPublishingQueueProps) {
  const [queueEnabled, setQueueEnabled] = React.useState(true);
  const [queue, setQueue] = React.useState<QueuedContent[]>([
    {
      id: '1',
      title: 'Morning Motivation Video',
      type: 'video',
      tier: 'all',
      scheduledDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
      scheduledTime: '09:00',
      status: 'queued',
      priority: 'high',
      publishSettings: {
        notifySubscribers: true,
        crossPost: true,
        earlyAccess: true,
        autoTweet: true
      },
      analytics: {
        estimatedReach: 5200,
        optimalTime: true,
        engagement: 'High'
      }
    },
    {
      id: '2',
      title: 'Behind the Scenes Photo Set',
      type: 'post',
      tier: 'silver',
      scheduledDate: new Date(Date.now() + 5 * 60 * 60 * 1000),
      scheduledTime: '14:00',
      status: 'queued',
      priority: 'normal',
      publishSettings: {
        notifySubscribers: true,
        crossPost: false,
        earlyAccess: true,
        autoTweet: false
      },
      analytics: {
        estimatedReach: 3100,
        optimalTime: false,
        engagement: 'Medium'
      }
    },
    {
      id: '3',
      title: 'Live Q&A Announcement',
      type: 'stream',
      tier: 'gold',
      scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000),
      scheduledTime: '18:00',
      status: 'processing',
      priority: 'urgent',
      publishSettings: {
        notifySubscribers: true,
        crossPost: true,
        earlyAccess: false,
        autoTweet: true
      },
      analytics: {
        estimatedReach: 1800,
        optimalTime: true,
        engagement: 'Very High'
      }
    },
    {
      id: '4',
      title: 'Weekly Newsletter',
      type: 'post',
      tier: 'public',
      scheduledDate: new Date(Date.now() + 48 * 60 * 60 * 1000),
      scheduledTime: '10:00',
      status: 'paused',
      priority: 'low',
      retries: 2,
      maxRetries: 3,
      publishSettings: {
        notifySubscribers: false,
        crossPost: true,
        earlyAccess: false,
        autoTweet: true
      },
      analytics: {
        estimatedReach: 8900,
        optimalTime: true,
        engagement: 'Medium'
      }
    }
  ]);

  const [selectedContent, setSelectedContent] = React.useState<string | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);

  // Queue statistics
  const queueStats = React.useMemo(() => {
    const total = queue.length;
    const queued = queue.filter(c => c.status === 'queued').length;
    const processing = queue.filter(c => c.status === 'processing').length;
    const paused = queue.filter(c => c.status === 'paused').length;
    const failed = queue.filter(c => c.status === 'failed').length;
    
    return { total, queued, processing, paused, failed };
  }, [queue]);

  // Process next item in queue
  const processNextItem = () => {
    const nextItem = queue.find(item => item.status === 'queued');
    if (nextItem) {
      setQueue(prev => prev.map(item => 
        item.id === nextItem.id 
          ? { ...item, status: 'processing' as const }
          : item
      ));
      
      // Simulate processing
      setTimeout(() => {
        setQueue(prev => prev.map(item => 
          item.id === nextItem.id 
            ? { ...item, status: 'published' as const }
            : item
        ));
      }, 3000);
    }
  };

  // Handle queue reordering
  const handleReorder = (newOrder: QueuedContent[]) => {
    setQueue(newOrder);
    onQueueUpdate?.(newOrder);
  };

  // Handle pause/resume
  const toggleItemStatus = (id: string) => {
    setQueue(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          status: item.status === 'paused' ? 'queued' as const : 'paused' as const
        };
      }
      return item;
    }));
  };

  // Remove from queue
  const removeFromQueue = (id: string) => {
    setQueue(prev => prev.filter(item => item.id !== id));
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'queued': return 'bg-blue-100 text-blue-700';
      case 'processing': return 'bg-yellow-100 text-yellow-700';
      case 'published': return 'bg-green-100 text-green-700';
      case 'failed': return 'bg-red-100 text-red-700';
      case 'paused': return 'bg-gray-100 text-gray-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Get priority color
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'normal': return 'bg-blue-500';
      case 'low': return 'bg-gray-400';
      default: return 'bg-gray-400';
    }
  };

  // Get content icon
  const getContentIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'post': return MessageSquare;
      case 'stream': return Radio;
      case 'event': return Calendar;
      default: return Video;
    }
  };

  // Calculate time until publish
  const getTimeUntilPublish = (date: Date) => {
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    
    if (diff <= 0) return 'Now';
    
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    
    if (hours > 24) {
      const days = Math.floor(hours / 24);
      return `${days}d ${hours % 24}h`;
    }
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-6">
      {/* Queue Control Panel */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CardTitle>Auto-Publishing Queue</CardTitle>
              <Badge variant={queueEnabled ? 'default' : 'secondary'}>
                {queueEnabled ? 'Active' : 'Paused'}
              </Badge>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Queue Status</span>
                <Switch
                  checked={queueEnabled}
                  onCheckedChange={setQueueEnabled}
                />
              </div>
              <Button
                variant="outline"
                onClick={processNextItem}
                disabled={!queueEnabled || isProcessing}
              >
                <SkipForward className="h-4 w-4 mr-2" />
                Process Next
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{queueStats.total}</p>
              <p className="text-sm text-gray-600">Total Items</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{queueStats.queued}</p>
              <p className="text-sm text-gray-600">Queued</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{queueStats.processing}</p>
              <p className="text-sm text-gray-600">Processing</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-600">{queueStats.paused}</p>
              <p className="text-sm text-gray-600">Paused</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{queueStats.failed}</p>
              <p className="text-sm text-gray-600">Failed</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Queue Items */}
      <Card>
        <CardHeader>
          <CardTitle>Queue Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Reorder.Group axis="y" values={queue} onReorder={handleReorder}>
            <AnimatePresence>
              {queue.map((item) => {
                const Icon = getContentIcon(item.type);
                const isSelected = selectedContent === item.id;
                
                return (
                  <Reorder.Item key={item.id} value={item}>
                    <motion.div
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: -100 }}
                      whileHover={{ x: 4 }}
                      className={cn(
                        "mb-3 p-4 bg-white border rounded-lg transition-all cursor-move",
                        isSelected ? "border-purple-500 shadow-lg" : "border-gray-200",
                        item.status === 'processing' && "animate-pulse"
                      )}
                      onClick={() => setSelectedContent(isSelected ? null : item.id)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start gap-3">
                          {/* Drag Handle */}
                          <div className="mt-1 cursor-move">
                            <GripVertical className="h-5 w-5 text-gray-400" />
                          </div>
                          
                          {/* Priority Indicator */}
                          <div className={cn(
                            "w-1 h-full rounded-full",
                            getPriorityColor(item.priority)
                          )} />
                          
                          {/* Content Icon */}
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <Icon className="h-5 w-5 text-purple-600" />
                          </div>
                          
                          {/* Content Details */}
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-medium">{item.title}</h4>
                              <Badge className={cn("text-xs", getStatusColor(item.status))}>
                                {item.status}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {item.tier}
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span>
                                <Clock className="h-3 w-3 inline mr-1" />
                                {getTimeUntilPublish(item.scheduledDate)}
                              </span>
                              <span>
                                <Calendar className="h-3 w-3 inline mr-1" />
                                {item.scheduledDate.toLocaleDateString()} at {item.scheduledTime}
                              </span>
                              {item.retries !== undefined && (
                                <span className="text-orange-600">
                                  <RefreshCw className="h-3 w-3 inline mr-1" />
                                  Retry {item.retries}/{item.maxRetries}
                                </span>
                              )}
                            </div>
                            
                            {/* Publish Settings */}
                            {item.publishSettings && (
                              <div className="flex items-center gap-2 mt-2">
                                {item.publishSettings.notifySubscribers && (
                                  <Badge variant="secondary" className="text-xs">
                                    <Zap className="h-3 w-3 mr-1" />
                                    Notify
                                  </Badge>
                                )}
                                {item.publishSettings.crossPost && (
                                  <Badge variant="secondary" className="text-xs">
                                    <Upload className="h-3 w-3 mr-1" />
                                    Cross-post
                                  </Badge>
                                )}
                                {item.publishSettings.earlyAccess && (
                                  <Badge variant="secondary" className="text-xs">
                                    <Timer className="h-3 w-3 mr-1" />
                                    Early Access
                                  </Badge>
                                )}
                              </div>
                            )}
                            
                            {/* Analytics Preview */}
                            {isSelected && item.analytics && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="mt-3 p-3 bg-gray-50 rounded-lg"
                              >
                                <div className="grid grid-cols-3 gap-3 text-sm">
                                  <div>
                                    <p className="text-gray-600">Est. Reach</p>
                                    <p className="font-semibold">{item.analytics.estimatedReach.toLocaleString()}</p>
                                  </div>
                                  <div>
                                    <p className="text-gray-600">Timing</p>
                                    <p className="font-semibold flex items-center">
                                      {item.analytics.optimalTime ? (
                                        <>
                                          <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                                          Optimal
                                        </>
                                      ) : (
                                        <>
                                          <AlertCircle className="h-3 w-3 text-yellow-500 mr-1" />
                                          Sub-optimal
                                        </>
                                      )}
                                    </p>
                                  </div>
                                  <div>
                                    <p className="text-gray-600">Engagement</p>
                                    <p className="font-semibold">{item.analytics.engagement}</p>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center gap-2">
                          {item.status === 'queued' || item.status === 'paused' ? (
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleItemStatus(item.id);
                              }}
                            >
                              {item.status === 'paused' ? (
                                <Play className="h-4 w-4" />
                              ) : (
                                <Pause className="h-4 w-4" />
                              )}
                            </Button>
                          ) : null}
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              onContentEdit?.(item);
                            }}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeFromQueue(item.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                      
                      {/* Processing Progress */}
                      {item.status === 'processing' && (
                        <div className="mt-3">
                          <Progress value={66} className="h-2" />
                          <p className="text-xs text-gray-600 mt-1">Processing content...</p>
                        </div>
                      )}
                    </motion.div>
                  </Reorder.Item>
                );
              })}
            </AnimatePresence>
          </Reorder.Group>
          
          {queue.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <Timer className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p className="text-lg font-medium">No items in queue</p>
              <p className="text-sm">Add content to start auto-publishing</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Queue Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Queue Settings
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Publishing Rules</h4>
              <div className="space-y-3">
                <label className="flex items-center justify-between">
                  <span className="text-sm">Respect optimal posting times</span>
                  <Switch defaultChecked />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm">Auto-retry failed publishes</span>
                  <Switch defaultChecked />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm">Skip holidays and weekends</span>
                  <Switch />
                </label>
                <label className="flex items-center justify-between">
                  <span className="text-sm">Maintain minimum post spacing</span>
                  <Switch defaultChecked />
                </label>
              </div>
            </div>
            
            <div>
              <h4 className="font-medium mb-3">Performance Optimization</h4>
              <div className="space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Queue Processing Speed</span>
                    <span className="text-sm font-medium">Normal</span>
                  </div>
                  <Progress value={50} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Max Concurrent Publishes</span>
                    <span className="text-sm font-medium">3</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm">Retry Attempts</span>
                    <span className="text-sm font-medium">3</span>
                  </div>
                  <Progress value={60} className="h-2" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}