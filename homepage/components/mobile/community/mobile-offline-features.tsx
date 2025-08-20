'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Wifi,
  WifiOff,
  Download,
  Upload,
  Save,
  Cloud,
  CloudOff,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Clock,
  Database,
  Trash2,
  FileText,
  Image,
  Video,
  MessageSquare,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface CachedItem {
  id: string;
  type: 'thread' | 'post' | 'comment' | 'media' | 'profile';
  title: string;
  size: number;
  timestamp: Date;
  status: 'cached' | 'pending' | 'syncing' | 'error';
  priority: 'high' | 'medium' | 'low';
}

interface QueuedAction {
  id: string;
  type: 'create' | 'update' | 'delete' | 'like' | 'comment';
  target: string;
  data: any;
  timestamp: Date;
  retries: number;
  status: 'pending' | 'syncing' | 'failed';
}

interface OfflineStatus {
  isOnline: boolean;
  lastSync: Date | null;
  cacheSize: number;
  maxCacheSize: number;
  queuedActions: number;
  downloadProgress: number;
}

interface MobileOfflineFeaturesProps {
  onSync?: () => void;
  onClearCache?: () => void;
  onManageStorage?: () => void;
  autoSync?: boolean;
  syncInterval?: number;
}

export function MobileOfflineFeatures({
  onSync,
  onClearCache,
  onManageStorage,
  autoSync = true,
  syncInterval = 30000 // 30 seconds
}: MobileOfflineFeaturesProps) {
  const [offlineStatus, setOfflineStatus] = React.useState<OfflineStatus>({
    isOnline: true,
    lastSync: new Date(),
    cacheSize: 45.2,
    maxCacheSize: 100,
    queuedActions: 3,
    downloadProgress: 0
  });

  const [cachedItems, setCachedItems] = React.useState<CachedItem[]>([
    {
      id: '1',
      type: 'thread',
      title: 'Community Guidelines Discussion',
      size: 2.3,
      timestamp: new Date(Date.now() - 60 * 60 * 1000),
      status: 'cached',
      priority: 'high'
    },
    {
      id: '2',
      type: 'post',
      title: 'Welcome to the Community!',
      size: 1.5,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      status: 'cached',
      priority: 'medium'
    },
    {
      id: '3',
      type: 'media',
      title: 'Event Photos',
      size: 15.8,
      timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
      status: 'pending',
      priority: 'low'
    }
  ]);

  const [queuedActions, setQueuedActions] = React.useState<QueuedAction[]>([
    {
      id: '1',
      type: 'comment',
      target: 'thread-123',
      data: { text: 'Great discussion!' },
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      retries: 0,
      status: 'pending'
    },
    {
      id: '2',
      type: 'like',
      target: 'post-456',
      data: {},
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      retries: 1,
      status: 'pending'
    },
    {
      id: '3',
      type: 'create',
      target: 'thread',
      data: { title: 'New Thread', content: 'Content here...' },
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      retries: 0,
      status: 'pending'
    }
  ]);

  const [isSyncing, setIsSyncing] = React.useState(false);
  const [showDetails, setShowDetails] = React.useState(false);

  // Monitor online/offline status
  React.useEffect(() => {
    const handleOnline = () => {
      setOfflineStatus(prev => ({ ...prev, isOnline: true }));
      if (autoSync) {
        handleSync();
      }
    };

    const handleOffline = () => {
      setOfflineStatus(prev => ({ ...prev, isOnline: false }));
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    setOfflineStatus(prev => ({ ...prev, isOnline: navigator.onLine }));

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [autoSync]);

  // Auto-sync interval
  React.useEffect(() => {
    if (autoSync && offlineStatus.isOnline) {
      const interval = setInterval(() => {
        handleSync();
      }, syncInterval);

      return () => clearInterval(interval);
    }
  }, [autoSync, offlineStatus.isOnline, syncInterval]);

  const handleSync = async () => {
    if (isSyncing || !offlineStatus.isOnline) return;

    setIsSyncing(true);
    
    // Simulate sync process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setOfflineStatus(prev => ({ ...prev, downloadProgress: i }));
    }

    // Update sync status
    setOfflineStatus(prev => ({
      ...prev,
      lastSync: new Date(),
      queuedActions: 0,
      downloadProgress: 0
    }));

    // Clear synced actions
    setQueuedActions(prev => 
      prev.map(action => ({ ...action, status: 'pending' }))
    );

    setIsSyncing(false);
    onSync?.();
  };

  const handleClearCache = () => {
    setCachedItems([]);
    setOfflineStatus(prev => ({ ...prev, cacheSize: 0 }));
    onClearCache?.();
  };

  const removeQueuedAction = (id: string) => {
    setQueuedActions(prev => prev.filter(action => action.id !== id));
    setOfflineStatus(prev => ({ ...prev, queuedActions: prev.queuedActions - 1 }));
  };

  const removeCachedItem = (id: string) => {
    const item = cachedItems.find(i => i.id === id);
    if (item) {
      setCachedItems(prev => prev.filter(i => i.id !== id));
      setOfflineStatus(prev => ({ 
        ...prev, 
        cacheSize: Math.max(0, prev.cacheSize - item.size) 
      }));
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'thread':
      case 'post':
        return FileText;
      case 'comment':
        return MessageSquare;
      case 'media':
        return Image;
      case 'video':
        return Video;
      default:
        return FileText;
    }
  };

  const getActionTypeColor = (type: string) => {
    switch (type) {
      case 'create':
        return 'text-green-600 bg-green-100';
      case 'update':
        return 'text-blue-600 bg-blue-100';
      case 'delete':
        return 'text-red-600 bg-red-100';
      case 'like':
        return 'text-pink-600 bg-pink-100';
      case 'comment':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatSize = (mb: number) => {
    if (mb < 1) return `${(mb * 1024).toFixed(0)} KB`;
    return `${mb.toFixed(1)} MB`;
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${days}d ago`;
  };

  return (
    <div className="space-y-4">
      {/* Status Bar */}
      <Card className={cn(
        "border-2",
        offlineStatus.isOnline ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
      )}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              {offlineStatus.isOnline ? (
                <>
                  <Wifi className="h-5 w-5 text-green-600" />
                  <div>
                    <div className="font-medium">Online</div>
                    <div className="text-xs text-gray-600">
                      Last sync: {offlineStatus.lastSync ? formatTime(offlineStatus.lastSync) : 'Never'}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <WifiOff className="h-5 w-5 text-red-600" />
                  <div>
                    <div className="font-medium">Offline Mode</div>
                    <div className="text-xs text-gray-600">
                      {offlineStatus.queuedActions} actions queued
                    </div>
                  </div>
                </>
              )}
            </div>

            <Button
              size="sm"
              variant={offlineStatus.isOnline ? "default" : "outline"}
              onClick={handleSync}
              disabled={!offlineStatus.isOnline || isSyncing}
            >
              {isSyncing ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
              <span className="ml-2">Sync</span>
            </Button>
          </div>

          {/* Sync Progress */}
          {isSyncing && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Syncing...</span>
                <span>{offlineStatus.downloadProgress}%</span>
              </div>
              <Progress value={offlineStatus.downloadProgress} className="h-2" />
            </div>
          )}

          {/* Storage Info */}
          <div className="mt-3 pt-3 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Cache Storage</span>
              <span className="font-medium">
                {formatSize(offlineStatus.cacheSize)} / {formatSize(offlineStatus.maxCacheSize)}
              </span>
            </div>
            <Progress 
              value={(offlineStatus.cacheSize / offlineStatus.maxCacheSize) * 100} 
              className="h-2 mt-2"
            />
          </div>
        </CardContent>
      </Card>

      {/* Queued Actions */}
      {queuedActions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Queued Actions
              </div>
              <Badge variant="secondary">{queuedActions.length}</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {queuedActions.map((action) => (
                <div 
                  key={action.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <Badge className={cn("text-xs", getActionTypeColor(action.type))}>
                      {action.type}
                    </Badge>
                    <div>
                      <div className="text-sm font-medium">{action.target}</div>
                      <div className="text-xs text-gray-500">
                        {formatTime(action.timestamp)}
                        {action.retries > 0 && ` • ${action.retries} retries`}
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeQueuedAction(action.id)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cached Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Offline Content
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowDetails(!showDetails)}
            >
              {showDetails ? 'Hide' : 'Show'} Details
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence>
            {showDetails && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="space-y-2"
              >
                {cachedItems.map((item) => {
                  const Icon = getTypeIcon(item.type);
                  return (
                    <div 
                      key={item.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <Icon className="h-4 w-4 text-gray-500" />
                        <div>
                          <div className="text-sm font-medium">{item.title}</div>
                          <div className="text-xs text-gray-500">
                            {formatSize(item.size)} • {formatTime(item.timestamp)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {item.status === 'cached' && (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        )}
                        {item.status === 'pending' && (
                          <Clock className="h-4 w-4 text-yellow-600" />
                        )}
                        {item.status === 'syncing' && (
                          <RefreshCw className="h-4 w-4 text-blue-600 animate-spin" />
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeCachedItem(item.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Cache Actions */}
          <div className="flex gap-2 mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={handleClearCache}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cache
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1"
              onClick={onManageStorage}
            >
              <Database className="h-4 w-4 mr-2" />
              Manage Storage
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Offline Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <div className="font-medium text-sm mb-2">Offline Mode Tips</div>
              <ul className="text-xs text-gray-600 space-y-1">
                <li>• Your posts and comments will be queued and sent when online</li>
                <li>• Downloaded content is available for offline viewing</li>
                <li>• Some features may be limited in offline mode</li>
                <li>• Data will sync automatically when connection is restored</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}