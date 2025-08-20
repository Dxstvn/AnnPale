'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Download,
  Share2,
  Smartphone,
  Mail,
  Shield,
  CheckCircle,
  AlertCircle,
  QrCode
} from 'lucide-react';
import { cn } from '@/lib/utils';
import QRCode from 'react-qr-code';

export interface DigitalTicketData {
  id: string;
  eventName: string;
  eventDate: Date;
  eventTime: string;
  eventLocation: string;
  ticketHolder: {
    name: string;
    email: string;
  };
  ticketDetails: {
    tier: string;
    seatNumber?: string;
    price: number;
    purchaseDate: Date;
    orderNumber: string;
  };
  qrCode: string;
  status: 'valid' | 'used' | 'transferred' | 'cancelled';
  transferable: boolean;
  checkInTime?: Date;
}

interface DigitalTicketProps {
  ticket: DigitalTicketData;
  onTransfer?: () => void;
  onAddToWallet?: () => void;
  onDownloadPDF?: () => void;
  onShare?: () => void;
  showActions?: boolean;
  compact?: boolean;
}

export function DigitalTicket({
  ticket,
  onTransfer,
  onAddToWallet,
  onDownloadPDF,
  onShare,
  showActions = true,
  compact = false
}: DigitalTicketProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'valid':
        return 'border-green-500 bg-green-50';
      case 'used':
        return 'border-gray-500 bg-gray-50';
      case 'transferred':
        return 'border-blue-500 bg-blue-50';
      case 'cancelled':
        return 'border-red-500 bg-red-50';
      default:
        return '';
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'valid':
        return { label: 'Valid', variant: 'success' as const, icon: CheckCircle };
      case 'used':
        return { label: 'Used', variant: 'secondary' as const, icon: CheckCircle };
      case 'transferred':
        return { label: 'Transferred', variant: 'default' as const, icon: Share2 };
      case 'cancelled':
        return { label: 'Cancelled', variant: 'destructive' as const, icon: AlertCircle };
      default:
        return { label: status, variant: 'default' as const, icon: Ticket };
    }
  };

  const statusInfo = getStatusBadge(ticket.status);
  const StatusIcon = statusInfo.icon;

  if (compact) {
    return (
      <Card className={cn("overflow-hidden", getStatusColor(ticket.status))}>
        <CardContent className="p-4">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div>
                <h3 className="font-semibold text-lg">{ticket.eventName}</h3>
                <p className="text-sm text-gray-600">{ticket.ticketDetails.tier}</p>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <span>{ticket.eventDate.toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  <span>{ticket.eventTime}</span>
                </div>
              </div>
              <Badge variant={statusInfo.variant} className="w-fit">
                <StatusIcon className="h-3 w-3 mr-1" />
                {statusInfo.label}
              </Badge>
            </div>
            <div className="bg-white p-2 rounded-lg">
              <QRCode value={ticket.qrCode} size={80} />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn("overflow-hidden", getStatusColor(ticket.status))}>
      <CardHeader className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">{ticket.eventName}</h2>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                {ticket.ticketDetails.tier}
              </Badge>
              {ticket.ticketDetails.seatNumber && (
                <Badge variant="secondary" className="bg-white/20 text-white border-white/30">
                  Seat {ticket.ticketDetails.seatNumber}
                </Badge>
              )}
            </div>
          </div>
          <Ticket className="h-12 w-12 text-white/80" />
        </div>
      </CardHeader>

      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Event Details */}
          <div className="md:col-span-2 space-y-4">
            <div>
              <h3 className="font-semibold mb-3">Event Details</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">{ticket.eventDate.toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-gray-500" />
                  <p>{ticket.eventTime}</p>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <p>{ticket.eventLocation}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Ticket Holder</h3>
              <div className="space-y-2">
                <p className="font-medium">{ticket.ticketHolder.name}</p>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Mail className="h-4 w-4" />
                  {ticket.ticketHolder.email}
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Purchase Information</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Order Number</p>
                  <p className="font-mono">{ticket.ticketDetails.orderNumber}</p>
                </div>
                <div>
                  <p className="text-gray-600">Purchase Date</p>
                  <p>{ticket.ticketDetails.purchaseDate.toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-gray-600">Price</p>
                  <p className="font-semibold">${ticket.ticketDetails.price}</p>
                </div>
                <div>
                  <p className="text-gray-600">Status</p>
                  <Badge variant={statusInfo.variant}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {statusInfo.label}
                  </Badge>
                </div>
              </div>
            </div>

            {ticket.checkInTime && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Checked In</p>
                    <p className="text-sm text-green-700">
                      {ticket.checkInTime.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center space-y-4">
            <div className="bg-white p-4 rounded-lg border-2 border-gray-200">
              <QRCode value={ticket.qrCode} size={200} />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">Ticket ID</p>
              <p className="font-mono text-xs text-gray-600">{ticket.id}</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Shield className="h-3 w-3" />
              <span>Secure digital ticket</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        {showActions && ticket.status === 'valid' && (
          <div className="mt-6 pt-6 border-t">
            <div className="flex flex-wrap gap-3">
              {onAddToWallet && (
                <Button onClick={onAddToWallet} variant="outline">
                  <Smartphone className="h-4 w-4 mr-2" />
                  Add to Wallet
                </Button>
              )}
              {onDownloadPDF && (
                <Button onClick={onDownloadPDF} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Download PDF
                </Button>
              )}
              {ticket.transferable && onTransfer && (
                <Button onClick={onTransfer} variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Transfer Ticket
                </Button>
              )}
              {onShare && (
                <Button onClick={onShare} variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
              )}
            </div>
          </div>
        )}

        {/* Anti-fraud Notice */}
        <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-900">Important</p>
              <p className="text-yellow-700">
                This is your official ticket. Do not share the QR code with anyone you don't trust. 
                Screenshots or photos of this ticket may be used fraudulently.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}