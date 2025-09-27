'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Progress } from '@/components/ui/progress'
import {
  AlertTriangle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  DollarSign,
  Users,
  TrendingUp,
  Clock,
  AlertCircle,
  Activity
} from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

interface SyncResults {
  checked: number
  synced: number
  errors: number
  mismatches: {
    stripe_id: string
    issue: string
    stripe_status?: string
    db_status?: string
  }[]
  timestamp?: string
}

interface SubscriptionStats {
  total: number
  active: number
  trialing: number
  paused: number
  cancelled: number
  expired: number
  pending: number
  totalRevenue: number
  monthlyRecurringRevenue: number
  averageSubscriptionValue: number
  churnRate: number
}

interface HealthCheck {
  status: 'healthy' | 'warning' | 'critical'
  stripeConnected: boolean
  databaseConnected: boolean
  webhooksActive: boolean
  lastSync: string | null
  syncErrors: number
  outOfSyncCount: number
}

export default function SubscriptionMonitoringDashboard() {
  const [syncResults, setSyncResults] = useState<SyncResults | null>(null)
  const [stats, setStats] = useState<SubscriptionStats | null>(null)
  const [healthCheck, setHealthCheck] = useState<HealthCheck | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isSyncing, setIsSyncing] = useState(false)
  const [autoRefresh, setAutoRefresh] = useState(false)

  // Fetch dashboard data
  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      // Fetch subscription stats
      const statsRes = await fetch('/api/admin/subscriptions/stats')
      if (statsRes.ok) {
        const data = await statsRes.json()
        setStats(data)
      }

      // Fetch health check
      const healthRes = await fetch('/api/admin/subscriptions/health')
      if (healthRes.ok) {
        const data = await healthRes.json()
        setHealthCheck(data)
      }

      // Fetch last sync results
      const syncRes = await fetch('/api/admin/subscriptions/last-sync')
      if (syncRes.ok) {
        const data = await syncRes.json()
        setSyncResults(data)
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error)
    } finally {
      setIsLoading(false)
    }
  }

  // Run manual sync
  const runSync = async () => {
    setIsSyncing(true)
    try {
      const res = await fetch('/api/cron/sync-subscriptions', {
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_CRON_SECRET || ''}`
        }
      })

      if (res.ok) {
        const data = await res.json()
        setSyncResults(data.results)
        await fetchDashboardData() // Refresh all data
      }
    } catch (error) {
      console.error('Error running sync:', error)
    } finally {
      setIsSyncing(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  // Auto-refresh
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(fetchDashboardData, 30000) // Every 30 seconds
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const getHealthIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />
      case 'critical':
        return <XCircle className="w-5 h-5 text-red-600" />
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />
    }
  }

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
      active: 'default',
      trialing: 'secondary',
      paused: 'outline',
      cancelled: 'destructive',
      expired: 'destructive',
      pending: 'secondary'
    }

    return (
      <Badge variant={variants[status] || 'default'}>
        {status}
      </Badge>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Subscription Monitoring</h1>
        <p className="text-muted-foreground mt-2">
          Monitor subscription health, Stripe synchronization, and revenue metrics
        </p>
      </div>

      {/* Health Status Bar */}
      {healthCheck && (
        <Card className="mb-6">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {getHealthIcon(healthCheck.status)}
                <CardTitle>System Health</CardTitle>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setAutoRefresh(!autoRefresh)}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${autoRefresh ? 'animate-spin' : ''}`} />
                  {autoRefresh ? 'Auto-refreshing' : 'Auto-refresh'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchDashboardData}
                  disabled={isLoading}
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
                <Button
                  size="sm"
                  onClick={runSync}
                  disabled={isSyncing}
                >
                  <Activity className={`w-4 h-4 mr-2 ${isSyncing ? 'animate-pulse' : ''}`} />
                  {isSyncing ? 'Syncing...' : 'Run Sync Now'}
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-2">
                {healthCheck.stripeConnected ?
                  <CheckCircle2 className="w-4 h-4 text-green-600" /> :
                  <XCircle className="w-4 h-4 text-red-600" />
                }
                <span className="text-sm">Stripe Connected</span>
              </div>
              <div className="flex items-center gap-2">
                {healthCheck.databaseConnected ?
                  <CheckCircle2 className="w-4 h-4 text-green-600" /> :
                  <XCircle className="w-4 h-4 text-red-600" />
                }
                <span className="text-sm">Database Connected</span>
              </div>
              <div className="flex items-center gap-2">
                {healthCheck.webhooksActive ?
                  <CheckCircle2 className="w-4 h-4 text-green-600" /> :
                  <XCircle className="w-4 h-4 text-red-600" />
                }
                <span className="text-sm">Webhooks Active</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-600" />
                <span className="text-sm">
                  Last sync: {healthCheck.lastSync ?
                    formatDistanceToNow(new Date(healthCheck.lastSync), { addSuffix: true }) :
                    'Never'
                  }
                </span>
              </div>
            </div>
            {healthCheck.outOfSyncCount > 0 && (
              <Alert className="mt-4" variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Synchronization Issues</AlertTitle>
                <AlertDescription>
                  {healthCheck.outOfSyncCount} subscription{healthCheck.outOfSyncCount !== 1 ? 's' : ''} out of sync with Stripe
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Key Metrics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Subscriptions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.total}</div>
              <div className="flex gap-2 mt-2">
                <Badge variant="default" className="text-xs">
                  {stats.active} active
                </Badge>
                {stats.trialing > 0 && (
                  <Badge variant="secondary" className="text-xs">
                    {stats.trialing} trial
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Monthly Recurring Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(stats.monthlyRecurringRevenue / 100).toFixed(2)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Avg: ${(stats.averageSubscriptionValue / 100).toFixed(2)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Revenue
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${(stats.totalRevenue / 100).toFixed(2)}
              </div>
              <div className="flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3 text-green-600" />
                <span className="text-xs text-green-600">All time</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Churn Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.churnRate.toFixed(1)}%
              </div>
              <Progress
                value={stats.churnRate}
                className="mt-2 h-2"
              />
            </CardContent>
          </Card>
        </div>
      )}

      {/* Sync Results */}
      <Tabs defaultValue="sync" className="space-y-4">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sync">Sync Results</TabsTrigger>
          <TabsTrigger value="status">Status Breakdown</TabsTrigger>
          <TabsTrigger value="mismatches">Mismatches</TabsTrigger>
        </TabsList>

        <TabsContent value="sync">
          {syncResults ? (
            <Card>
              <CardHeader>
                <CardTitle>Last Synchronization</CardTitle>
                <CardDescription>
                  {syncResults.timestamp ?
                    `Run ${formatDistanceToNow(new Date(syncResults.timestamp), { addSuffix: true })}` :
                    'No recent sync data'
                  }
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {syncResults.checked}
                    </div>
                    <div className="text-sm text-muted-foreground">Checked</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {syncResults.synced}
                    </div>
                    <div className="text-sm text-muted-foreground">Synced</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-red-600">
                      {syncResults.errors}
                    </div>
                    <div className="text-sm text-muted-foreground">Errors</div>
                  </div>
                </div>

                {syncResults.mismatches.length > 0 && (
                  <Alert variant="destructive">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>Mismatches Detected</AlertTitle>
                    <AlertDescription>
                      {syncResults.mismatches.length} subscription{syncResults.mismatches.length !== 1 ? 's' : ''} have synchronization issues
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="text-center text-muted-foreground">
                  No sync data available. Run a sync to see results.
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="status">
          {stats && (
            <Card>
              <CardHeader>
                <CardTitle>Subscription Status Breakdown</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusBadge('active')}
                      <span>Active</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{stats.active}</span>
                      <Progress value={(stats.active / stats.total) * 100} className="w-32" />
                    </div>
                  </div>

                  {stats.trialing > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusBadge('trialing')}
                        <span>Trialing</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{stats.trialing}</span>
                        <Progress value={(stats.trialing / stats.total) * 100} className="w-32" />
                      </div>
                    </div>
                  )}

                  {stats.paused > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusBadge('paused')}
                        <span>Paused</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{stats.paused}</span>
                        <Progress value={(stats.paused / stats.total) * 100} className="w-32" />
                      </div>
                    </div>
                  )}

                  {stats.pending > 0 && (
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {getStatusBadge('pending')}
                        <span>Pending</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{stats.pending}</span>
                        <Progress value={(stats.pending / stats.total) * 100} className="w-32" />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusBadge('cancelled')}
                      <span>Cancelled</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{stats.cancelled}</span>
                      <Progress value={(stats.cancelled / stats.total) * 100} className="w-32" />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {getStatusBadge('expired')}
                      <span>Expired</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold">{stats.expired}</span>
                      <Progress value={(stats.expired / stats.total) * 100} className="w-32" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="mismatches">
          {syncResults && syncResults.mismatches.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>Synchronization Mismatches</CardTitle>
                <CardDescription>
                  Subscriptions with data inconsistencies between Stripe and database
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {syncResults.mismatches.map((mismatch, idx) => (
                    <Alert key={idx} variant="destructive">
                      <AlertTriangle className="h-4 w-4" />
                      <AlertTitle className="font-mono text-sm">
                        {mismatch.stripe_id}
                      </AlertTitle>
                      <AlertDescription>
                        <div className="mt-1">
                          <Badge variant="outline" className="mr-2">
                            {mismatch.issue.replace(/_/g, ' ')}
                          </Badge>
                          {mismatch.stripe_status && (
                            <span className="text-xs">
                              Stripe: {mismatch.stripe_status}
                            </span>
                          )}
                          {mismatch.db_status && (
                            <span className="text-xs ml-2">
                              Database: {mismatch.db_status}
                            </span>
                          )}
                        </div>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="flex flex-col items-center justify-center py-8">
                  <CheckCircle2 className="w-12 h-12 text-green-600 mb-4" />
                  <div className="text-center">
                    <div className="font-semibold text-lg">All Synchronized</div>
                    <div className="text-muted-foreground text-sm mt-1">
                      No mismatches detected between Stripe and database
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}