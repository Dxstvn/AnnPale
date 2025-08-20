'use client';

import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Mail, Star, Users, Percent, Share2 } from 'lucide-react';
import type { EventData } from '../event-creation-wizard';

interface PromotionStepProps {
  data: EventData;
  onUpdate: (updates: Partial<EventData>) => void;
  errors?: string[];
}

export function EventPromotionStep({
  data,
  onUpdate,
  errors = []
}: PromotionStepProps) {
  return (
    <div className="space-y-6">
      {/* SEO Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Search className="h-5 w-5" />
            SEO Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>SEO Title</Label>
            <Input
              className="mt-1"
              placeholder="Custom title for search engines"
              value={data.seoTitle || ''}
              onChange={(e) => onUpdate({ seoTitle: e.target.value })}
            />
            <p className="text-sm text-gray-500 mt-1">Leave empty to use event title</p>
          </div>
          <div>
            <Label>SEO Description</Label>
            <Textarea
              className="mt-1"
              placeholder="Description for search results"
              value={data.seoDescription || ''}
              onChange={(e) => onUpdate({ seoDescription: e.target.value })}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Marketing Options */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Marketing Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-gray-500" />
              <div>
                <Label>Email Blast</Label>
                <p className="text-sm text-gray-600">Send to your subscribers</p>
              </div>
            </div>
            <Switch
              checked={data.emailBlastEnabled}
              onCheckedChange={(checked) => onUpdate({ emailBlastEnabled: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Star className="h-5 w-5 text-gray-500" />
              <div>
                <Label>Featured Listing</Label>
                <p className="text-sm text-gray-600">Boost visibility (+$25)</p>
              </div>
            </div>
            <Switch
              checked={data.featuredListing}
              onCheckedChange={(checked) => onUpdate({ featuredListing: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Users className="h-5 w-5 text-gray-500" />
              <div>
                <Label>Affiliate Program</Label>
                <p className="text-sm text-gray-600">Let others promote your event</p>
              </div>
            </div>
            <Switch
              checked={data.affiliateProgram}
              onCheckedChange={(checked) => onUpdate({ affiliateProgram: checked })}
            />
          </div>

          {data.affiliateProgram && (
            <div className="ml-8 p-3 bg-gray-50 rounded-lg">
              <Label>Commission Rate (%)</Label>
              <Input
                type="number"
                className="mt-1 max-w-xs"
                placeholder="10"
                value={data.affiliateCommission || ''}
                onChange={(e) => onUpdate({ affiliateCommission: parseInt(e.target.value) || 0 })}
                min="0"
                max="50"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Social Sharing */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Social Sharing
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label>Share Text</Label>
            <Textarea
              className="mt-1"
              placeholder="Custom message for social media shares"
              value={data.socialShareText || ''}
              onChange={(e) => onUpdate({ socialShareText: e.target.value })}
              rows={3}
            />
            <p className="text-sm text-gray-500 mt-1">
              This text will be used when people share your event
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}