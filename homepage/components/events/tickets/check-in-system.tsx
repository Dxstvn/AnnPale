'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  QrCode,
  Search,
  UserCheck,
  UserX,
  AlertCircle,
  CheckCircle,
  Clock,
  Users,
  Smartphone,
  Zap,
  Wifi,
  WifiOff,
  RefreshCw,
  HelpCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface CheckInResult {
  success: boolean;
  attendee?: {
    name: string;
    email: string;
    ticketTier: string;
    ticketNumber: string;
    seatNumber?: string;
  };
  message: string;
  alreadyCheckedIn?: boolean;
  checkInTime?: Date;
}

interface CheckInSystemProps {
  eventId: string;
  onScanQR: (qrCode: string) => Promise<CheckInResult>;
  onManualCheckIn: (ticketNumber: string) => Promise<CheckInResult>;
  onUndoCheckIn?: (ticketNumber: string) => Promise<boolean>;
  stats: {
    totalAttendees: number;
    checkedIn: number;
    notArrived: number;
    checkInRate: number; // per minute
  };
  isOnline?: boolean;
}

export function CheckInSystem({
  eventId,
  onScanQR,
  onManualCheckIn,
  onUndoCheckIn,
  stats,
  isOnline = true
}: CheckInSystemProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isScanning, setIsScanning] = React.useState(false);
  const [lastCheckIn, setLastCheckIn] = React.useState<CheckInResult | null>(null);
  const [checkInHistory, setCheckInHistory] = React.useState<CheckInResult[]>([]);
  const [isProcessing, setIsProcessing] = React.useState(false);

  const checkInPercentage = (stats.checkedIn / stats.totalAttendees) * 100;

  const handleManualCheckIn = async () => {
    if (!searchQuery.trim()) return;
    
    setIsProcessing(true);
    try {
      const result = await onManualCheckIn(searchQuery);
      setLastCheckIn(result);
      if (result.success) {
        setCheckInHistory([result, ...checkInHistory.slice(0, 4)]);
        setSearchQuery('');
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleQRScan = async (qrCode: string) => {
    setIsProcessing(true);
    try {
      const result = await onScanQR(qrCode);
      setLastCheckIn(result);
      if (result.success) {
        setCheckInHistory([result, ...checkInHistory.slice(0, 4)]);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  const handleUndo = async () => {
    if (!lastCheckIn?.attendee?.ticketNumber || !onUndoCheckIn) return;
    
    const success = await onUndoCheckIn(lastCheckIn.attendee.ticketNumber);
    if (success) {
      setLastCheckIn(null);
      setCheckInHistory(checkInHistory.slice(1));
    }
  };

  return (
    <div className="space-y-6">
      {/* Connection Status */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Event Check-In</h2>
        <div className="flex items-center gap-2">
          {isOnline ? (
            <>
              <Wifi className="h-4 w-4 text-green-500" />
              <span className="text-sm text-green-600">Online</span>
            </>
          ) : (
            <>
              <WifiOff className="h-4 w-4 text-orange-500" />
              <span className="text-sm text-orange-600">Offline Mode</span>
            </>
          )}
        </div>
      </div>

      {/* Check-In Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Checked In</p>
                <p className="text-2xl font-bold text-green-600">{stats.checkedIn}</p>
              </div>
              <UserCheck className="h-8 w-8 text-green-500" />
            </div>
            <div className="mt-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${checkInPercentage}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">{checkInPercentage.toFixed(1)}%</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Not Arrived</p>
                <p className="text-2xl font-bold">{stats.notArrived}</p>
              </div>
              <UserX className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Expected</p>
                <p className="text-2xl font-bold">{stats.totalAttendees}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Check-In Rate</p>
                <p className="text-2xl font-bold">{stats.checkInRate}</p>
                <p className="text-xs text-gray-500">per minute</p>
              </div>
              <Zap className="h-8 w-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Check-In Methods */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* QR Scanner */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <QrCode className="h-5 w-5" />
              QR Code Scanner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isScanning ? (
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <QrCode className="h-16 w-16 mx-auto mb-4 text-gray-400 animate-pulse" />
                    <p className="text-sm text-gray-600">Scanning...</p>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="mt-4"
                      onClick={() => setIsScanning(false)}
                    >
                      Stop Scanning
                    </Button>
                  </div>
                </div>
              ) : (
                <Button 
                  className="w-full h-32" 
                  variant="outline"
                  onClick={() => setIsScanning(true)}
                  disabled={isProcessing}
                >
                  <div className="text-center">
                    <Smartphone className="h-8 w-8 mx-auto mb-2" />
                    <span>Start QR Scanner</span>
                  </div>
                </Button>
              )}
              
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <AlertCircle className="h-4 w-4" />
                <span>Position QR code within frame for automatic scanning</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Manual Check-In */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Manual Check-In
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  placeholder="Enter ticket number or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleManualCheckIn()}
                  disabled={isProcessing}
                />
                <Button 
                  onClick={handleManualCheckIn}
                  disabled={!searchQuery.trim() || isProcessing}
                >
                  Check In
                </Button>
              </div>

              <div className="space-y-2">
                <p className="text-sm font-medium text-gray-700">Quick Actions:</p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm">
                    <Users className="h-4 w-4 mr-2" />
                    Group Check-In
                  </Button>
                  <Button variant="outline" size="sm">
                    <Clock className="h-4 w-4 mr-2" />
                    Late Arrivals
                  </Button>
                  <Button variant="outline" size="sm">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Support
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Last Check-In Result */}
      {lastCheckIn && (
        <Alert className={cn(
          "transition-all",
          lastCheckIn.success ? "border-green-200 bg-green-50" : "border-red-200 bg-red-50"
        )}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              {lastCheckIn.success ? (
                <CheckCircle className="h-5 w-5 text-green-600 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              )}
              <div>
                <AlertDescription>
                  <p className={cn(
                    "font-medium",
                    lastCheckIn.success ? "text-green-900" : "text-red-900"
                  )}>
                    {lastCheckIn.message}
                  </p>
                  {lastCheckIn.attendee && (
                    <div className="mt-2 space-y-1 text-sm">
                      <p className="font-medium">{lastCheckIn.attendee.name}</p>
                      <p className="text-gray-600">{lastCheckIn.attendee.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline">{lastCheckIn.attendee.ticketTier}</Badge>
                        {lastCheckIn.attendee.seatNumber && (
                          <Badge variant="outline">Seat {lastCheckIn.attendee.seatNumber}</Badge>
                        )}
                        <Badge variant="outline">#{lastCheckIn.attendee.ticketNumber}</Badge>
                      </div>
                    </div>
                  )}
                  {lastCheckIn.alreadyCheckedIn && lastCheckIn.checkInTime && (
                    <p className="text-sm text-orange-600 mt-2">
                      Already checked in at {lastCheckIn.checkInTime.toLocaleTimeString()}
                    </p>
                  )}
                </AlertDescription>
              </div>
            </div>
            {lastCheckIn.success && onUndoCheckIn && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleUndo}
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Undo
              </Button>
            )}
          </div>
        </Alert>
      )}

      {/* Recent Check-Ins */}
      {checkInHistory.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Recent Check-Ins</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {checkInHistory.map((checkIn, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <div>
                      <p className="text-sm font-medium">{checkIn.attendee?.name}</p>
                      <p className="text-xs text-gray-500">
                        {checkIn.attendee?.ticketTier} • #{checkIn.attendee?.ticketNumber}
                      </p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-500">Just now</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Offline Mode Notice */}
      {!isOnline && (
        <Alert className="border-orange-200 bg-orange-50">
          <WifiOff className="h-4 w-4 text-orange-600" />
          <AlertDescription>
            <p className="font-medium text-orange-900">Working Offline</p>
            <p className="text-sm text-orange-700 mt-1">
              Check-ins are being saved locally and will sync when connection is restored.
            </p>
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}