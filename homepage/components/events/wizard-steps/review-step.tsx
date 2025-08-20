'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Calendar,
  Clock,
  Globe,
  DollarSign,
  Users,
  Video,
  Shield,
  CheckCircle,
  AlertCircle,
  Eye
} from 'lucide-react';
import { format } from 'date-fns';
import type { EventData } from '../event-creation-wizard';

interface ReviewStepProps {
  data: EventData;
  onUpdate: (updates: Partial<EventData>) => void;
  errors?: string[];
}

export function EventReviewStep({
  data,
  onUpdate,
  errors = []
}: ReviewStepProps) {
  const [termsAccepted, setTermsAccepted] = React.useState(false);

  return (
    <div className="space-y-6">
      {/* Event Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Event Summary</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">{data.title || 'Untitled Event'}</h3>
            <p className="text-gray-600 mt-1">{data.description}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary">{data.type}</Badge>
            <Badge variant="secondary">{data.category}</Badge>
            {data.tags.map((tag) => (
              <Badge key={tag} variant="outline">{tag}</Badge>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm">
                {data.date ? format(data.date, 'PPP') : 'No date set'}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gray-500" />
              <span className="text-sm">
                {data.time || 'No time set'} ({data.duration} min)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Globe className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{data.accessType}</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-gray-500" />
              <span className="text-sm">{data.interactionLevel} interaction</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tickets Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Ticket Tiers</CardTitle>
        </CardHeader>
        <CardContent>
          {data.tickets.length === 0 ? (
            <p className="text-gray-600">No tickets configured</p>
          ) : (
            <div className="space-y-3">
              {data.tickets.map((ticket, index) => (
                <div key={ticket.tierId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="font-medium">{ticket.name || `Tier ${index + 1}`}</p>
                    <p className="text-sm text-gray-600">{ticket.capacity} spots</p>
                  </div>
                  <Badge className="text-lg">${ticket.price}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Settings Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Event Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {data.recordingAllowed ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-gray-400" />
              )}
              <span className="text-sm">Recording {data.recordingAllowed ? 'allowed' : 'not allowed'}</span>
            </div>
            <div className="flex items-center gap-2">
              {data.replayAvailable ? (
                <CheckCircle className="h-4 w-4 text-green-500" />
              ) : (
                <AlertCircle className="h-4 w-4 text-gray-400" />
              )}
              <span className="text-sm">Replay {data.replayAvailable ? 'available' : 'not available'}</span>
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-blue-500" />
              <span className="text-sm">Cancellation policy: {data.cancellationPolicy}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Promotion Summary */}
      {(data.emailBlastEnabled || data.featuredListing || data.affiliateProgram) && (
        <Card>
          <CardHeader>
            <CardTitle>Promotion Settings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.emailBlastEnabled && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Email blast scheduled</span>
                </div>
              )}
              {data.featuredListing && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Featured listing (+$25)</span>
                </div>
              )}
              {data.affiliateProgram && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm">Affiliate program ({data.affiliateCommission}% commission)</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Terms Agreement */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-6">
          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={termsAccepted}
              onCheckedChange={(checked: boolean) => setTermsAccepted(checked)}
            />
            <div>
              <Label htmlFor="terms" className="cursor-pointer">
                I agree to the event hosting terms and conditions
              </Label>
              <p className="text-sm text-gray-600 mt-1">
                By publishing this event, you agree to our platform policies, 
                payment terms, and code of conduct.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Preview Button */}
      <div className="flex justify-center">
        <Button variant="outline" size="lg">
          <Eye className="h-5 w-5 mr-2" />
          Preview Event Page
        </Button>
      </div>

      {errors.length > 0 && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="font-medium text-red-900 mb-2">Please fix these issues before publishing:</p>
          <ul className="space-y-1">
            {errors.map((error, index) => (
              <li key={index} className="text-sm text-red-700">• {error}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}