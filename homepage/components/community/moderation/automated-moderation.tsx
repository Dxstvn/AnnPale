'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Shield,
  Bot,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Eye,
  MessageSquare,
  Image as ImageIcon,
  Link,
  TrendingUp,
  Activity,
  Filter,
  Settings,
  RefreshCw,
  Zap,
  Brain,
  Search,
  Flag,
  Ban,
  Clock,
  FileText,
  Users,
  Globe,
  Lock,
  Unlock,
  AlertOctagon,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface DetectionRule {
  id: string;
  name: string;
  type: 'spam' | 'toxicity' | 'nsfw' | 'phishing' | 'copyright' | 'misinformation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  enabled: boolean;
  threshold: number;
  patterns: string[];
  actions: AutomatedAction[];
  statistics: {
    triggered: number;
    falsePositives: number;
    accuracy: number;
    lastTriggered?: Date;
  };
}

interface AutomatedAction {
  type: 'flag' | 'remove' | 'shadow-ban' | 'timeout' | 'escalate' | 'notify';
  target: 'content' | 'user' | 'both';
  duration?: number;
  notifyModerators?: boolean;
  message?: string;
}

interface ContentScan {
  id: string;
  contentId: string;
  contentType: 'text' | 'image' | 'video' | 'link';
  timestamp: Date;
  results: {
    spam: number;
    toxicity: number;
    nsfw: number;
    phishing: number;
    overall: number;
  };
  flags: string[];
  status: 'clean' | 'suspicious' | 'flagged' | 'removed';
  reviewedBy?: string;
  action?: AutomatedAction;
}

interface SystemMetrics {
  totalScans: number;
  flaggedContent: number;
  falsePositiveRate: number;
  averageResponseTime: number;
  activeRules: number;
  queueSize: number;
  processingRate: number;
}

interface AutomatedModerationProps {
  onRuleUpdate?: (rule: DetectionRule) => void;
  onManualReview?: (contentId: string) => void;
  onSystemToggle?: (system: string, enabled: boolean) => void;
  onThresholdChange?: (system: string, threshold: number) => void;
  showMetrics?: boolean;
  showLogs?: boolean;
}

export function AutomatedModeration({
  onRuleUpdate,
  onManualReview,
  onSystemToggle,
  onThresholdChange,
  showMetrics = true,
  showLogs = true
}: AutomatedModerationProps) {
  const [activeTab, setActiveTab] = React.useState<'overview' | 'rules' | 'logs' | 'settings'>('overview');
  const [selectedRule, setSelectedRule] = React.useState<DetectionRule | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [recentScans, setRecentScans] = React.useState<ContentScan[]>([]);

  // System metrics
  const metrics: SystemMetrics = {
    totalScans: 15234,
    flaggedContent: 342,
    falsePositiveRate: 2.3,
    averageResponseTime: 0.8,
    activeRules: 12,
    queueSize: 23,
    processingRate: 98.5
  };

  // Detection rules
  const detectionRules: DetectionRule[] = [
    {
      id: 'spam-detector',
      name: 'Spam Detection',
      type: 'spam',
      severity: 'medium',
      enabled: true,
      threshold: 0.75,
      patterns: ['buy now', 'click here', 'limited offer', 'make money'],
      actions: [
        { type: 'flag', target: 'content' },
        { type: 'notify', target: 'both', notifyModerators: true }
      ],
      statistics: {
        triggered: 234,
        falsePositives: 5,
        accuracy: 97.8,
        lastTriggered: new Date(Date.now() - 10 * 60 * 1000)
      }
    },
    {
      id: 'toxicity-filter',
      name: 'Toxicity Filter',
      type: 'toxicity',
      severity: 'high',
      enabled: true,
      threshold: 0.6,
      patterns: [],
      actions: [
        { type: 'remove', target: 'content' },
        { type: 'timeout', target: 'user', duration: 3600 },
        { type: 'escalate', target: 'both', notifyModerators: true }
      ],
      statistics: {
        triggered: 89,
        falsePositives: 2,
        accuracy: 97.7,
        lastTriggered: new Date(Date.now() - 30 * 60 * 1000)
      }
    },
    {
      id: 'nsfw-scanner',
      name: 'NSFW Image Scanner',
      type: 'nsfw',
      severity: 'critical',
      enabled: true,
      threshold: 0.8,
      patterns: [],
      actions: [
        { type: 'remove', target: 'content' },
        { type: 'shadow-ban', target: 'user' },
        { type: 'escalate', target: 'both', notifyModerators: true }
      ],
      statistics: {
        triggered: 12,
        falsePositives: 0,
        accuracy: 100,
        lastTriggered: new Date(Date.now() - 2 * 60 * 60 * 1000)
      }
    },
    {
      id: 'phishing-detector',
      name: 'Phishing Link Detection',
      type: 'phishing',
      severity: 'critical',
      enabled: true,
      threshold: 0.9,
      patterns: [],
      actions: [
        { type: 'remove', target: 'content' },
        { type: 'escalate', target: 'both', notifyModerators: true }
      ],
      statistics: {
        triggered: 7,
        falsePositives: 1,
        accuracy: 85.7,
        lastTriggered: new Date(Date.now() - 5 * 60 * 60 * 1000)
      }
    }
  ];

  // Recent scan samples
  const sampleScans: ContentScan[] = [
    {
      id: 'scan1',
      contentId: 'post-123',
      contentType: 'text',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      results: {
        spam: 0.85,
        toxicity: 0.12,
        nsfw: 0.02,
        phishing: 0.05,
        overall: 0.85
      },
      flags: ['spam', 'promotional'],
      status: 'flagged',
      action: { type: 'flag', target: 'content' }
    },
    {
      id: 'scan2',
      contentId: 'comment-456',
      contentType: 'text',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      results: {
        spam: 0.15,
        toxicity: 0.78,
        nsfw: 0.05,
        phishing: 0.02,
        overall: 0.78
      },
      flags: ['toxicity', 'harassment'],
      status: 'removed',
      reviewedBy: 'moderator-1',
      action: { type: 'remove', target: 'content' }
    },
    {
      id: 'scan3',
      contentId: 'image-789',
      contentType: 'image',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      results: {
        spam: 0.05,
        toxicity: 0.02,
        nsfw: 0.92,
        phishing: 0.01,
        overall: 0.92
      },
      flags: ['nsfw', 'inappropriate'],
      status: 'removed',
      action: { type: 'remove', target: 'content' }
    }
  ];

  React.useEffect(() => {
    setRecentScans(sampleScans);
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'low': return 'bg-green-100 text-green-700 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'high': return 'bg-orange-100 text-orange-700 border-orange-300';
      case 'critical': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'clean': return 'bg-green-100 text-green-700';
      case 'suspicious': return 'bg-yellow-100 text-yellow-700';
      case 'flagged': return 'bg-orange-100 text-orange-700';
      case 'removed': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getScoreColor = (score: number) => {
    if (score < 0.3) return 'text-green-600';
    if (score < 0.6) return 'text-yellow-600';
    if (score < 0.8) return 'text-orange-600';
    return 'text-red-600';
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* System Status */}
      <Card className="bg-gradient-to-r from-purple-50 to-blue-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600">{metrics.processingRate}%</div>
              <div className="text-sm text-gray-600">System Health</div>
              <Progress value={metrics.processingRate} className="mt-2" />
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">{metrics.activeRules}</div>
              <div className="text-sm text-gray-600">Active Rules</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">{metrics.averageResponseTime}s</div>
              <div className="text-sm text-gray-600">Avg Response</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-600">{metrics.queueSize}</div>
              <div className="text-sm text-gray-600">Queue Size</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detection Systems */}
      <div>
        <h3 className="text-lg font-semibold mb-4">Detection Systems</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {detectionRules.map((rule) => (
            <Card key={rule.id} className="hover:shadow-md transition-all">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      rule.enabled ? "bg-green-100" : "bg-gray-100"
                    )}>
                      <Bot className={cn(
                        "h-5 w-5",
                        rule.enabled ? "text-green-600" : "text-gray-400"
                      )} />
                    </div>
                    <div>
                      <h4 className="font-medium">{rule.name}</h4>
                      <Badge variant="outline" className={cn("text-xs mt-1", getSeverityColor(rule.severity))}>
                        {rule.severity}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onSystemToggle?.(rule.id, !rule.enabled)}
                  >
                    {rule.enabled ? <Unlock className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm mb-3">
                  <div>
                    <span className="text-gray-500">Threshold:</span>
                    <div className="font-medium">{(rule.threshold * 100).toFixed(0)}%</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Accuracy:</span>
                    <div className="font-medium text-green-600">{rule.statistics.accuracy}%</div>
                  </div>
                  <div>
                    <span className="text-gray-500">Triggered:</span>
                    <div className="font-medium">{rule.statistics.triggered}</div>
                  </div>
                  <div>
                    <span className="text-gray-500">False Positives:</span>
                    <div className="font-medium text-red-600">{rule.statistics.falsePositives}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {rule.actions.map((action, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {action.type}
                    </Badge>
                  ))}
                </div>

                {rule.statistics.lastTriggered && (
                  <div className="text-xs text-gray-500 mt-2">
                    Last triggered {Math.floor((Date.now() - rule.statistics.lastTriggered.getTime()) / 60000)} minutes ago
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Performance Metrics */}
      {showMetrics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5" />
              Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Total Scans</span>
                  <span className="font-medium">{metrics.totalScans.toLocaleString()}</span>
                </div>
                <Progress value={100} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">Flagged Content</span>
                  <span className="font-medium">{metrics.flaggedContent}</span>
                </div>
                <Progress value={(metrics.flaggedContent / metrics.totalScans) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-gray-600">False Positive Rate</span>
                  <span className="font-medium">{metrics.falsePositiveRate}%</span>
                </div>
                <Progress value={metrics.falsePositiveRate} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const renderRules = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Detection Rules Configuration</h3>
        <Button size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Advanced Settings
        </Button>
      </div>

      {detectionRules.map((rule) => (
        <Card key={rule.id} className="hover:shadow-md transition-all">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Bot className="h-5 w-5" />
                {rule.name}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={getSeverityColor(rule.severity)}>
                  {rule.severity}
                </Badge>
                <Button
                  variant={rule.enabled ? "default" : "outline"}
                  size="sm"
                  onClick={() => onSystemToggle?.(rule.id, !rule.enabled)}
                >
                  {rule.enabled ? "Enabled" : "Disabled"}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {/* Threshold Slider */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium">Detection Threshold</label>
                  <span className="text-sm font-medium">{(rule.threshold * 100).toFixed(0)}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={rule.threshold * 100}
                  onChange={(e) => onThresholdChange?.(rule.id, parseInt(e.target.value) / 100)}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Less Strict</span>
                  <span>More Strict</span>
                </div>
              </div>

              {/* Actions */}
              <div>
                <h4 className="text-sm font-medium mb-2">Automated Actions</h4>
                <div className="flex flex-wrap gap-2">
                  {rule.actions.map((action, index) => (
                    <div key={index} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                      {action.type === 'flag' && <Flag className="h-4 w-4 text-yellow-600" />}
                      {action.type === 'remove' && <XCircle className="h-4 w-4 text-red-600" />}
                      {action.type === 'timeout' && <Clock className="h-4 w-4 text-orange-600" />}
                      {action.type === 'escalate' && <AlertTriangle className="h-4 w-4 text-purple-600" />}
                      <span className="text-sm">{action.type}</span>
                      {action.duration && (
                        <Badge variant="outline" className="text-xs">
                          {action.duration}s
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Statistics */}
              <div className="grid grid-cols-4 gap-4 p-3 bg-gray-50 rounded">
                <div className="text-center">
                  <div className="text-2xl font-bold">{rule.statistics.triggered}</div>
                  <div className="text-xs text-gray-600">Triggered</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{rule.statistics.accuracy}%</div>
                  <div className="text-xs text-gray-600">Accuracy</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-600">{rule.statistics.falsePositives}</div>
                  <div className="text-xs text-gray-600">False Positives</div>
                </div>
                <div className="text-center">
                  <div className="text-xs">
                    {rule.statistics.lastTriggered 
                      ? `${Math.floor((Date.now() - rule.statistics.lastTriggered.getTime()) / 60000)}m ago`
                      : 'Never'
                    }
                  </div>
                  <div className="text-xs text-gray-600">Last Triggered</div>
                </div>
              </div>

              {/* Patterns (if applicable) */}
              {rule.patterns.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium mb-2">Detection Patterns</h4>
                  <div className="flex flex-wrap gap-1">
                    {rule.patterns.map((pattern, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {pattern}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderLogs = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Recent Activity Logs</h3>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm" onClick={() => setIsProcessing(!isProcessing)}>
            <RefreshCw className={cn("h-4 w-4 mr-2", isProcessing && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        {recentScans.map((scan) => (
          <Card key={scan.id} className="hover:shadow-md transition-all">
            <CardContent className="p-4">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    {scan.contentType === 'text' && <MessageSquare className="h-4 w-4" />}
                    {scan.contentType === 'image' && <ImageIcon className="h-4 w-4" />}
                    {scan.contentType === 'link' && <Link className="h-4 w-4" />}
                    <span className="font-medium">Content ID: {scan.contentId}</span>
                    <Badge variant="outline" className={getStatusColor(scan.status)}>
                      {scan.status}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {Math.floor((Date.now() - scan.timestamp.getTime()) / 60000)} minutes ago
                    </span>
                  </div>

                  {/* Scan Results */}
                  <div className="grid grid-cols-5 gap-3 mb-3">
                    <div className="text-center">
                      <div className={cn("text-sm font-medium", getScoreColor(scan.results.spam))}>
                        {(scan.results.spam * 100).toFixed(0)}%
                      </div>
                      <div className="text-xs text-gray-500">Spam</div>
                    </div>
                    <div className="text-center">
                      <div className={cn("text-sm font-medium", getScoreColor(scan.results.toxicity))}>
                        {(scan.results.toxicity * 100).toFixed(0)}%
                      </div>
                      <div className="text-xs text-gray-500">Toxicity</div>
                    </div>
                    <div className="text-center">
                      <div className={cn("text-sm font-medium", getScoreColor(scan.results.nsfw))}>
                        {(scan.results.nsfw * 100).toFixed(0)}%
                      </div>
                      <div className="text-xs text-gray-500">NSFW</div>
                    </div>
                    <div className="text-center">
                      <div className={cn("text-sm font-medium", getScoreColor(scan.results.phishing))}>
                        {(scan.results.phishing * 100).toFixed(0)}%
                      </div>
                      <div className="text-xs text-gray-500">Phishing</div>
                    </div>
                    <div className="text-center">
                      <div className={cn("text-sm font-bold", getScoreColor(scan.results.overall))}>
                        {(scan.results.overall * 100).toFixed(0)}%
                      </div>
                      <div className="text-xs text-gray-500">Overall</div>
                    </div>
                  </div>

                  {/* Flags and Actions */}
                  <div className="flex items-center gap-2">
                    {scan.flags.map((flag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {flag}
                      </Badge>
                    ))}
                    {scan.action && (
                      <Badge variant="outline" className="text-xs bg-purple-50 text-purple-700">
                        Action: {scan.action.type}
                      </Badge>
                    )}
                    {scan.reviewedBy && (
                      <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700">
                        Reviewed by {scan.reviewedBy}
                      </Badge>
                    )}
                  </div>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onManualReview?.(scan.contentId)}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Review
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {recentScans.length === 0 && (
        <div className="text-center py-12">
          <Shield className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No recent activity</h3>
          <p className="text-gray-600">Automated moderation logs will appear here</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Automated Moderation</h2>
          <p className="text-gray-600">AI-powered content moderation and safety systems</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Badge variant="outline" className={cn(
            "px-3 py-1",
            isProcessing ? "bg-green-50 text-green-700 border-green-300" : "bg-gray-50"
          )}>
            <Activity className={cn("h-3 w-3 mr-1", isProcessing && "animate-pulse")} />
            {isProcessing ? "Processing" : "Idle"}
          </Badge>
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configure
          </Button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: Shield },
            { id: 'rules', label: 'Rules', icon: Filter },
            { id: 'logs', label: 'Activity Logs', icon: FileText },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map((tab) => (
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
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'rules' && renderRules()}
          {activeTab === 'logs' && showLogs && renderLogs()}
          {activeTab === 'settings' && (
            <div className="text-center py-12">
              <Settings className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">System Settings</h3>
              <p className="text-gray-600">Configure advanced moderation settings</p>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}