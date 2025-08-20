'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Smartphone,
  Monitor,
  Tablet,
  Laptop,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Wifi,
  WifiOff,
  Cloud,
  CloudOff,
  RotateCcw,
  Shield,
  Users,
  Crown,
  Star,
  Settings,
  ChevronRight,
  ExternalLink,
  Download,
  Upload,
  Database,
  Globe,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface DeviceInfo {
  id: string;
  name: string;
  platform: 'ios' | 'android' | 'web' | 'desktop';
  type: 'phone' | 'tablet' | 'computer' | 'tv';
  lastSync: Date;
  isOnline: boolean;
  subscriptionStatus: 'synced' | 'pending' | 'failed' | 'offline';
  version: string;
  location?: string;
}

interface SyncStatus {
  isEnabled: boolean;
  lastGlobalSync: Date;
  totalDevices: number;
  syncedDevices: number;
  pendingSync: number;
  failedSync: number;
  dataUsage: {
    thisMonth: number; // MB
    limit?: number; // MB
  };
}

interface SyncConflict {
  id: string;
  type: 'subscription_status' | 'payment_method' | 'preferences' | 'usage_data';
  description: string;
  devices: string[];
  severity: 'low' | 'medium' | 'high';
  autoResolvable: boolean;
}

interface MobileCrossPlatformSyncProps {
  devices?: DeviceInfo[];
  syncStatus?: SyncStatus;
  conflicts?: SyncConflict[];
  currentDevice?: string;
  onSyncNow?: () => void;
  onToggleSync?: (enabled: boolean) => void;
  onResolveConflict?: (conflictId: string) => void;
  onRemoveDevice?: (deviceId: string) => void;
  onManageDevice?: (deviceId: string) => void;
}

export function MobileCrossPlatformSync({
  devices = [],
  syncStatus,
  conflicts = [],
  currentDevice = 'current_device',
  onSyncNow,
  onToggleSync,
  onResolveConflict,
  onRemoveDevice,
  onManageDevice
}: MobileCrossPlatformSyncProps) {
  const [isManualSyncing, setIsManualSyncing] = React.useState(false);
  const [expandedDevice, setExpandedDevice] = React.useState<string | null>(null);

  // Default sync status
  const defaultSyncStatus: SyncStatus = syncStatus || {
    isEnabled: true,
    lastGlobalSync: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
    totalDevices: 4,
    syncedDevices: 3,
    pendingSync: 1,
    failedSync: 0,
    dataUsage: {
      thisMonth: 12.5,
      limit: 500
    }
  };

  // Default devices
  const defaultDevices: DeviceInfo[] = devices.length > 0 ? devices : [
    {
      id: 'iphone_main',
      name: 'iPhone 15 Pro',
      platform: 'ios',
      type: 'phone',
      lastSync: new Date(Date.now() - 2 * 60 * 1000),
      isOnline: true,
      subscriptionStatus: 'synced',
      version: 'iOS 17.1',
      location: 'New York, USA'
    },
    {
      id: 'android_tablet',
      name: 'Samsung Galaxy Tab',
      platform: 'android',
      type: 'tablet',
      lastSync: new Date(Date.now() - 15 * 60 * 1000),
      isOnline: false,
      subscriptionStatus: 'pending',
      version: 'Android 14',
      location: 'Miami, USA'
    },
    {
      id: 'web_browser',
      name: 'Chrome Browser',
      platform: 'web',
      type: 'computer',
      lastSync: new Date(Date.now() - 1 * 60 * 1000),
      isOnline: true,
      subscriptionStatus: 'synced',
      version: 'Chrome 119',
      location: 'Los Angeles, USA'
    },
    {
      id: 'macbook_app',
      name: 'MacBook Pro',
      platform: 'desktop',
      type: 'computer',
      lastSync: new Date(Date.now() - 30 * 60 * 1000),
      isOnline: true,
      subscriptionStatus: 'synced',
      version: 'macOS 14.1',
      location: 'Boston, USA'
    }
  ];

  // Get device icon
  const getDeviceIcon = (device: DeviceInfo) => {
    const iconClass = "h-5 w-5";
    
    if (device.platform === 'ios') {
      return device.type === 'tablet' ? 
        <Tablet className={iconClass} /> : 
        <Smartphone className={iconClass} />;
    }
    
    if (device.platform === 'android') {
      return device.type === 'tablet' ? 
        <Tablet className={iconClass} /> : 
        <Smartphone className={iconClass} />;
    }
    
    if (device.platform === 'web' || device.platform === 'desktop') {
      return device.type === 'computer' ? 
        <Monitor className={iconClass} /> : 
        <Laptop className={iconClass} />;
    }

    return <Smartphone className={iconClass} />;
  };

  // Get platform emoji
  const getPlatformEmoji = (platform: string) => {
    switch (platform) {
      case 'ios': return '🍎';
      case 'android': return '🤖';
      case 'web': return '🌐';
      case 'desktop': return '💻';
      default: return '📱';
    }
  };

  // Get sync status info
  const getSyncStatusInfo = (status: string) => {
    switch (status) {
      case 'synced':
        return {
          label: 'Synced',
          color: 'text-green-600',
          bgColor: 'bg-green-100',
          icon: CheckCircle
        };
      case 'pending':
        return {
          label: 'Pending',
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-100',
          icon: Clock
        };
      case 'failed':
        return {
          label: 'Failed',
          color: 'text-red-600',
          bgColor: 'bg-red-100',
          icon: XCircle
        };
      case 'offline':
        return {
          label: 'Offline',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          icon: WifiOff
        };
      default:
        return {
          label: 'Unknown',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          icon: AlertTriangle
        };
    }
  };

  // Handle manual sync
  const handleManualSync = async () => {
    setIsManualSyncing(true);
    
    // Simulate sync process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    onSyncNow?.();
    setIsManualSyncing(false);
  };

  // Format time ago
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}d ago`;
  };

  // Calculate sync health percentage
  const syncHealthPercentage = defaultSyncStatus.totalDevices > 0 ? 
    (defaultSyncStatus.syncedDevices / defaultSyncStatus.totalDevices) * 100 : 0;

  return (
    <div className="max-w-md mx-auto space-y-4">
      {/* Sync Status Header */}
      <Card className={cn(
        "border-l-4",
        defaultSyncStatus.isEnabled ? "border-l-green-500" : "border-l-gray-500"
      )}>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                <Cloud className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="font-semibold">Cross-Platform Sync</h3>
                <p className="text-sm text-gray-600">
                  {defaultSyncStatus.isEnabled ? 'Enabled' : 'Disabled'}
                </p>
              </div>
            </div>
            <div className={cn(
              "w-12 h-6 rounded-full p-1 transition-colors cursor-pointer",
              defaultSyncStatus.isEnabled ? "bg-green-500" : "bg-gray-300"
            )}
            onClick={() => onToggleSync?.(!defaultSyncStatus.isEnabled)}
            >
              <div className={cn(
                "w-4 h-4 rounded-full bg-white transition-transform",
                defaultSyncStatus.isEnabled ? "translate-x-6" : "translate-x-0"
              )} />
            </div>
          </div>

          {defaultSyncStatus.isEnabled && (
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Last sync:</span>
                <span className="font-medium">{formatTimeAgo(defaultSyncStatus.lastGlobalSync)}</span>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sync Health</span>
                  <span className="font-medium">{Math.round(syncHealthPercentage)}%</span>
                </div>
                <Progress value={syncHealthPercentage} className="h-2" />
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div>
                  <p className="text-lg font-semibold text-green-600">{defaultSyncStatus.syncedDevices}</p>
                  <p className="text-xs text-gray-600">Synced</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-yellow-600">{defaultSyncStatus.pendingSync}</p>
                  <p className="text-xs text-gray-600">Pending</p>
                </div>
                <div>
                  <p className="text-lg font-semibold text-red-600">{defaultSyncStatus.failedSync}</p>
                  <p className="text-xs text-gray-600">Failed</p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Sync Conflicts */}
      {conflicts.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600" />
              Sync Conflicts ({conflicts.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {conflicts.map((conflict, index) => (
              <div key={conflict.id} className="p-3 bg-white rounded-lg border">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{conflict.description}</span>
                  <Badge className={cn(
                    "text-xs",
                    conflict.severity === 'high' ? "bg-red-100 text-red-700" :
                    conflict.severity === 'medium' ? "bg-orange-100 text-orange-700" :
                    "bg-yellow-100 text-yellow-700"
                  )}>
                    {conflict.severity}
                  </Badge>
                </div>
                <p className="text-xs text-gray-600 mb-2">
                  Affects: {conflict.devices.join(', ')}
                </p>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="w-full text-xs"
                  onClick={() => onResolveConflict?.(conflict.id)}
                >
                  {conflict.autoResolvable ? 'Auto Resolve' : 'Resolve Manually'}
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Manual Sync */}
      {defaultSyncStatus.isEnabled && (
        <Card>
          <CardContent className="p-4">
            <Button
              className="w-full h-12"
              onClick={handleManualSync}
              disabled={isManualSyncing}
            >
              {isManualSyncing ? (
                <div className="flex items-center gap-2">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Syncing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <RotateCcw className="h-4 w-4" />
                  <span>Sync Now</span>
                </div>
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Device List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Connected Devices ({defaultDevices.length})</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {defaultDevices.map((device, index) => {
            const statusInfo = getSyncStatusInfo(device.subscriptionStatus);
            const StatusIcon = statusInfo.icon;
            const isExpanded = expandedDevice === device.id;
            const isCurrentDevice = device.id === currentDevice;

            return (
              <motion.div key={device.id} className="space-y-2">
                <Card 
                  className={cn(
                    "cursor-pointer transition-all",
                    isCurrentDevice && "border-purple-500 ring-2 ring-purple-200",
                    isExpanded && "shadow-md"
                  )}
                  onClick={() => setExpandedDevice(isExpanded ? null : device.id)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          {getDeviceIcon(device)}
                          <div className="absolute -top-1 -right-1">
                            <span className="text-xs">{getPlatformEmoji(device.platform)}</span>
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{device.name}</span>
                            {isCurrentDevice && (
                              <Badge className="bg-purple-100 text-purple-700 text-xs">
                                Current
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-600">{device.version}</span>
                            <div className="flex items-center gap-1">
                              {device.isOnline ? (
                                <Wifi className="h-3 w-3 text-green-500" />
                              ) : (
                                <WifiOff className="h-3 w-3 text-gray-400" />
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={cn("text-xs", statusInfo.bgColor, statusInfo.color)}>
                          <StatusIcon className="h-3 w-3 mr-1" />
                          {statusInfo.label}
                        </Badge>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatTimeAgo(device.lastSync)}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                    >
                      <Card className="ml-4">
                        <CardContent className="p-3 space-y-3">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div>
                              <span className="text-gray-600">Platform:</span>
                              <span className="ml-1 font-medium">{device.platform.toUpperCase()}</span>
                            </div>
                            <div>
                              <span className="text-gray-600">Type:</span>
                              <span className="ml-1 font-medium capitalize">{device.type}</span>
                            </div>
                            {device.location && (
                              <div className="col-span-2">
                                <span className="text-gray-600">Location:</span>
                                <span className="ml-1 font-medium">{device.location}</span>
                              </div>
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Button 
                              size="sm" 
                              variant="outline" 
                              className="flex-1"
                              onClick={() => onManageDevice?.(device.id)}
                            >
                              <Settings className="h-3 w-3 mr-1" />
                              Manage
                            </Button>
                            {!isCurrentDevice && (
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="text-red-600 border-red-200"
                                onClick={() => onRemoveDevice?.(device.id)}
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>

      {/* Data Usage */}
      {defaultSyncStatus.dataUsage && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Sync Data Usage</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">This month:</span>
              <span className="font-medium">
                {defaultSyncStatus.dataUsage.thisMonth} MB
                {defaultSyncStatus.dataUsage.limit && (
                  <span className="text-gray-500"> / {defaultSyncStatus.dataUsage.limit} MB</span>
                )}
              </span>
            </div>
            
            {defaultSyncStatus.dataUsage.limit && (
              <div className="space-y-1">
                <Progress 
                  value={(defaultSyncStatus.dataUsage.thisMonth / defaultSyncStatus.dataUsage.limit) * 100} 
                  className="h-2"
                />
                <p className="text-xs text-gray-600">
                  {((defaultSyncStatus.dataUsage.thisMonth / defaultSyncStatus.dataUsage.limit) * 100).toFixed(1)}% of monthly limit used
                </p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
              <div>
                <Database className="h-3 w-3 inline mr-1" />
                Subscription data
              </div>
              <div>
                <Shield className="h-3 w-3 inline mr-1" />
                Encrypted sync
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sync Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Sync Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Auto-sync</span>
            </div>
            <div className="w-10 h-5 bg-green-500 rounded-full p-0.5">
              <div className="w-4 h-4 bg-white rounded-full translate-x-5 transition-transform" />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-green-500" />
              <span className="text-sm">WiFi only</span>
            </div>
            <div className="w-10 h-5 bg-gray-300 rounded-full p-0.5">
              <div className="w-4 h-4 bg-white rounded-full transition-transform" />
            </div>
          </div>

          <Button variant="outline" className="w-full justify-between">
            <span>Advanced Settings</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}