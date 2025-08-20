'use client';

import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, X, Globe, Shield, Video, Users } from 'lucide-react';
import type { EventData } from '../event-creation-wizard';

interface EventDetailsStepProps {
  data: EventData;
  onUpdate: (updates: Partial<EventData>) => void;
  errors?: string[];
}

const LANGUAGES = [
  'English',
  'French',
  'Haitian Creole',
  'Spanish',
  'Portuguese'
];

export function EventDetailsStep({
  data,
  onUpdate,
  errors = []
}: EventDetailsStepProps) {
  return (
    <div className="space-y-6">
      {/* Languages */}
      <div>
        <Label>Event Languages</Label>
        <div className="mt-2 space-y-2">
          {LANGUAGES.map((lang) => (
            <div key={lang} className="flex items-center space-x-2">
              <Checkbox
                id={lang}
                checked={data.languages.includes(lang)}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onUpdate({ languages: [...data.languages, lang] });
                  } else {
                    onUpdate({ languages: data.languages.filter(l => l !== lang) });
                  }
                }}
              />
              <Label htmlFor={lang} className="font-normal cursor-pointer">
                {lang}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Access Type */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Access Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={data.accessType} onValueChange={(value: any) => onUpdate({ accessType: value })}>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="public" id="public" />
                <div>
                  <Label htmlFor="public">Public</Label>
                  <p className="text-sm text-gray-600">Anyone can find and register</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="private" id="private" />
                <div>
                  <Label htmlFor="private">Private</Label>
                  <p className="text-sm text-gray-600">Only invited guests can register</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="unlisted" id="unlisted" />
                <div>
                  <Label htmlFor="unlisted">Unlisted</Label>
                  <p className="text-sm text-gray-600">Only people with the link can register</p>
                </div>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Recording Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Video className="h-5 w-5" />
            Recording Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Allow Recording</Label>
              <p className="text-sm text-gray-600">Event can be recorded for later viewing</p>
            </div>
            <Checkbox
              checked={data.recordingAllowed}
              onCheckedChange={(checked: boolean) => onUpdate({ recordingAllowed: checked })}
            />
          </div>
          {data.recordingAllowed && (
            <div className="flex items-center justify-between">
              <div>
                <Label>Replay Available</Label>
                <p className="text-sm text-gray-600">Recording available to ticket holders</p>
              </div>
              <Checkbox
                checked={data.replayAvailable}
                onCheckedChange={(checked: boolean) => onUpdate({ replayAvailable: checked })}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Interaction Level */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Users className="h-5 w-5" />
            Interaction Level
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup value={data.interactionLevel} onValueChange={(value: any) => onUpdate({ interactionLevel: value })}>
            <div className="space-y-3">
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="full" id="full" />
                <div>
                  <Label htmlFor="full">Full Interaction</Label>
                  <p className="text-sm text-gray-600">Chat, Q&A, polls, and participation</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="limited" id="limited" />
                <div>
                  <Label htmlFor="limited">Limited Interaction</Label>
                  <p className="text-sm text-gray-600">Q&A and polls only</p>
                </div>
              </div>
              <div className="flex items-start space-x-2">
                <RadioGroupItem value="view-only" id="view-only" />
                <div>
                  <Label htmlFor="view-only">View Only</Label>
                  <p className="text-sm text-gray-600">No interaction, just watching</p>
                </div>
              </div>
            </div>
          </RadioGroup>
        </CardContent>
      </Card>

      {/* Requirements */}
      <div>
        <Label>Requirements & What to Bring</Label>
        <Textarea
          className="mt-1"
          placeholder="List any requirements or materials attendees need..."
          value={data.requirements.join('\n')}
          onChange={(e) => onUpdate({ requirements: e.target.value.split('\n').filter(r => r.trim()) })}
          rows={4}
        />
      </div>
    </div>
  );
}