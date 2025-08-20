'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Calendar,
  Download,
  FileText,
  Camera,
  Scissors,
  Languages,
  BookOpen,
  Clock,
  ChevronRight,
  Play,
  Pause,
  SkipForward,
  Share2,
  Bookmark,
  Volume2,
  Subtitles,
  Settings,
  Maximize
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AgendaItem {
  id: string;
  time: string;
  title: string;
  speaker?: string;
  duration: number;
  isCurrent?: boolean;
  isCompleted?: boolean;
}

interface Resource {
  id: string;
  title: string;
  type: 'pdf' | 'video' | 'link' | 'slides';
  size?: string;
  url: string;
  downloadable: boolean;
}

interface EventToolsProps {
  eventId: string;
  agenda: AgendaItem[];
  resources: Resource[];
  hasTranslation?: boolean;
  availableLanguages?: string[];
  selectedLanguage?: string;
  onChangeLanguage?: (language: string) => void;
  onTakeScreenshot?: () => void;
  onCreateClip?: (startTime: number, endTime: number) => void;
  onDownloadResource?: (resourceId: string) => void;
  onSaveNote?: (note: string) => void;
  userTier?: 'general' | 'vip' | 'platinum';
}

export function EventTools({
  eventId,
  agenda,
  resources,
  hasTranslation = false,
  availableLanguages = ['English', 'French', 'Haitian Creole'],
  selectedLanguage = 'English',
  onChangeLanguage,
  onTakeScreenshot,
  onCreateClip,
  onDownloadResource,
  onSaveNote,
  userTier = 'general'
}: EventToolsProps) {
  const [activeTab, setActiveTab] = React.useState('agenda');
  const [notes, setNotes] = React.useState('');
  const [savedNotes, setSavedNotes] = React.useState<string[]>([]);
  const [clipStart, setClipStart] = React.useState<number | null>(null);
  const [isRecordingClip, setIsRecordingClip] = React.useState(false);

  const handleSaveNote = () => {
    if (notes.trim()) {
      setSavedNotes([...savedNotes, notes]);
      onSaveNote?.(notes);
      setNotes('');
    }
  };

  const handleStartClip = () => {
    setClipStart(Date.now());
    setIsRecordingClip(true);
  };

  const handleEndClip = () => {
    if (clipStart) {
      const endTime = Date.now();
      onCreateClip?.(clipStart, endTime);
      setClipStart(null);
      setIsRecordingClip(false);
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-4 w-4" />;
      case 'video':
        return <Play className="h-4 w-4" />;
      case 'slides':
        return <BookOpen className="h-4 w-4" />;
      default:
        return <Download className="h-4 w-4" />;
    }
  };

  const currentAgendaIndex = agenda.findIndex(item => item.isCurrent);
  const progress = currentAgendaIndex >= 0 ? ((currentAgendaIndex + 1) / agenda.length) * 100 : 0;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Event Tools</CardTitle>
          <div className="flex items-center gap-2">
            {hasTranslation && (
              <select
                value={selectedLanguage}
                onChange={(e) => onChangeLanguage?.(e.target.value)}
                className="text-sm px-2 py-1 rounded border"
              >
                {availableLanguages.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
            )}
            <Button variant="ghost" size="icon" onClick={onTakeScreenshot}>
              <Camera className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid grid-cols-4 w-full rounded-none">
            <TabsTrigger value="agenda">
              <Calendar className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="resources">
              <Download className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="notes">
              <FileText className="h-4 w-4" />
            </TabsTrigger>
            <TabsTrigger value="tools">
              <Settings className="h-4 w-4" />
            </TabsTrigger>
          </TabsList>

          {/* Agenda Tab */}
          <TabsContent value="agenda" className="flex-1 flex flex-col p-4 pt-2">
            <div className="mb-3">
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-semibold">Event Progress</span>
                <span className="text-gray-600">{Math.round(progress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="space-y-2">
                {agenda.map((item, index) => (
                  <div
                    key={item.id}
                    className={cn(
                      "p-3 rounded-lg border transition-all",
                      item.isCurrent && "bg-purple-50 border-purple-300",
                      item.isCompleted && "opacity-60"
                    )}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold">{item.time}</span>
                          {item.isCurrent && (
                            <Badge variant="default" className="text-xs">
                              Now
                            </Badge>
                          )}
                          {item.isCompleted && (
                            <Badge variant="secondary" className="text-xs">
                              Completed
                            </Badge>
                          )}
                        </div>
                        <p className="font-medium mt-1">{item.title}</p>
                        {item.speaker && (
                          <p className="text-sm text-gray-600">by {item.speaker}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">{item.duration} min</p>
                      </div>
                      {index === currentAgendaIndex && (
                        <ChevronRight className="h-5 w-5 text-purple-600 animate-pulse" />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="flex-1 flex flex-col p-4 pt-2">
            <ScrollArea className="flex-1">
              <div className="space-y-2">
                {resources.map((resource) => (
                  <Card key={resource.id} className="p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-100 rounded">
                          {getResourceIcon(resource.type)}
                        </div>
                        <div>
                          <p className="font-medium text-sm">{resource.title}</p>
                          <p className="text-xs text-gray-500">
                            {resource.type.toUpperCase()}
                            {resource.size && ` • ${resource.size}`}
                          </p>
                        </div>
                      </div>
                      {resource.downloadable && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onDownloadResource?.(resource.id)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>

            {userTier === 'general' && (
              <div className="mt-3 p-3 bg-purple-50 rounded-lg">
                <p className="text-sm text-purple-900 font-medium">
                  🔒 Upgrade to VIP to download all resources
                </p>
              </div>
            )}
          </TabsContent>

          {/* Notes Tab */}
          <TabsContent value="notes" className="flex-1 flex flex-col p-4 pt-2">
            <div className="flex-1 flex flex-col">
              <Textarea
                placeholder="Take notes during the event..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="flex-1 resize-none"
              />
              <Button
                onClick={handleSaveNote}
                className="mt-2"
                disabled={!notes.trim()}
              >
                Save Note
              </Button>
            </div>

            {savedNotes.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h4 className="font-semibold text-sm mb-2">Saved Notes</h4>
                <ScrollArea className="h-32">
                  <div className="space-y-2">
                    {savedNotes.map((note, index) => (
                      <div key={index} className="p-2 bg-gray-50 rounded text-sm">
                        {note}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            )}
          </TabsContent>

          {/* Tools Tab */}
          <TabsContent value="tools" className="flex-1 flex flex-col p-4 pt-2">
            <div className="space-y-3">
              {/* Screenshot Tool */}
              <Card className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Camera className="h-5 w-5 text-gray-600" />
                    <div>
                      <p className="font-medium text-sm">Screenshot</p>
                      <p className="text-xs text-gray-500">Capture current frame</p>
                    </div>
                  </div>
                  <Button size="sm" onClick={onTakeScreenshot}>
                    Capture
                  </Button>
                </div>
              </Card>

              {/* Clip Creator (VIP/Platinum) */}
              {(userTier === 'vip' || userTier === 'platinum') && (
                <Card className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Scissors className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-sm">Create Clip</p>
                        <p className="text-xs text-gray-500">Save event highlights</p>
                      </div>
                    </div>
                    <Button
                      size="sm"
                      variant={isRecordingClip ? "destructive" : "default"}
                      onClick={isRecordingClip ? handleEndClip : handleStartClip}
                    >
                      {isRecordingClip ? (
                        <>
                          <div className="h-2 w-2 bg-white rounded-full animate-pulse mr-2" />
                          Stop
                        </>
                      ) : (
                        'Start Clip'
                      )}
                    </Button>
                  </div>
                </Card>
              )}

              {/* Translation (if available) */}
              {hasTranslation && (
                <Card className="p-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Languages className="h-5 w-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-sm">Live Translation</p>
                        <p className="text-xs text-gray-500">Available in {availableLanguages.length} languages</p>
                      </div>
                    </div>
                    <Badge variant="success">Active</Badge>
                  </div>
                </Card>
              )}

              {/* Playback Controls */}
              <Card className="p-3">
                <p className="font-medium text-sm mb-3">Playback Controls</p>
                <div className="flex items-center justify-center gap-2">
                  <Button variant="ghost" size="icon">
                    <SkipForward className="h-4 w-4 rotate-180" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Play className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <SkipForward className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Volume2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Subtitles className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Maximize className="h-4 w-4" />
                  </Button>
                </div>
              </Card>

              {/* Quick Actions */}
              <div className="grid grid-cols-2 gap-2">
                <Button variant="outline" size="sm">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" size="sm">
                  <Bookmark className="h-4 w-4 mr-2" />
                  Bookmark
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}