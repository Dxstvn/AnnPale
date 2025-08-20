'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Mic,
  MicOff,
  Camera,
  Image,
  Video,
  Hash,
  AtSign,
  Smile,
  Send,
  X,
  ChevronDown,
  Paperclip,
  MapPin,
  Calendar,
  Users,
  Globe,
  Lock,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ThreadDraft {
  title: string;
  content: string;
  category: string;
  tags: string[];
  attachments: File[];
  visibility: 'public' | 'members' | 'private';
  mentions: string[];
  location?: string;
  scheduledFor?: Date;
}

interface MobileThreadCreatorProps {
  onSubmit?: (draft: ThreadDraft) => void;
  onCancel?: () => void;
  onSaveDraft?: (draft: ThreadDraft) => void;
  initialDraft?: Partial<ThreadDraft>;
  categories?: Array<{ id: string; name: string; icon?: React.ElementType }>;
}

export function MobileThreadCreator({
  onSubmit,
  onCancel,
  onSaveDraft,
  initialDraft,
  categories = []
}: MobileThreadCreatorProps) {
  const [draft, setDraft] = React.useState<ThreadDraft>({
    title: initialDraft?.title || '',
    content: initialDraft?.content || '',
    category: initialDraft?.category || 'general',
    tags: initialDraft?.tags || [],
    attachments: initialDraft?.attachments || [],
    visibility: initialDraft?.visibility || 'public',
    mentions: initialDraft?.mentions || [],
    location: initialDraft?.location,
    scheduledFor: initialDraft?.scheduledFor
  });

  const [isRecording, setIsRecording] = React.useState(false);
  const [recordingTime, setRecordingTime] = React.useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false);
  const [showAttachmentOptions, setShowAttachmentOptions] = React.useState(false);
  const [currentTag, setCurrentTag] = React.useState('');
  const [showAdvancedOptions, setShowAdvancedOptions] = React.useState(false);
  const [voiceTranscript, setVoiceTranscript] = React.useState('');
  const [isTranscribing, setIsTranscribing] = React.useState(false);

  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const mediaRecorderRef = React.useRef<MediaRecorder | null>(null);
  const recordingIntervalRef = React.useRef<NodeJS.Timeout | null>(null);

  const defaultCategories = [
    { id: 'general', name: 'General', icon: Globe },
    { id: 'questions', name: 'Questions', icon: AlertCircle },
    { id: 'creators', name: 'Creators', icon: Video },
    { id: 'events', name: 'Events', icon: Calendar },
    { id: 'support', name: 'Support', icon: Users }
  ];

  const categoryList = categories.length > 0 ? categories : defaultCategories;

  const emojis = ['😀', '😍', '🤔', '👍', '❤️', '🎉', '🔥', '💯', '🙏', '👏'];

  // Voice recording functions
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      const chunks: BlobPart[] = [];
      mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
      
      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        await transcribeAudio(blob);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingTime(0);

      // Update recording time
      recordingIntervalRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Unable to access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (recordingIntervalRef.current) {
        clearInterval(recordingIntervalRef.current);
        recordingIntervalRef.current = null;
      }
    }
  };

  const transcribeAudio = async (audioBlob: Blob) => {
    setIsTranscribing(true);
    
    // Simulate transcription (in production, use actual speech-to-text API)
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const simulatedTranscript = "This is a simulated transcript of your voice recording. In production, this would be actual speech-to-text conversion.";
    setVoiceTranscript(simulatedTranscript);
    setDraft(prev => ({
      ...prev,
      content: prev.content + (prev.content ? ' ' : '') + simulatedTranscript
    }));
    
    setIsTranscribing(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    setDraft(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
    setShowAttachmentOptions(false);
  };

  const removeAttachment = (index: number) => {
    setDraft(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
    }));
  };

  const addTag = () => {
    if (currentTag && !draft.tags.includes(currentTag)) {
      setDraft(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.toLowerCase()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tag: string) => {
    setDraft(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }));
  };

  const addEmoji = (emoji: string) => {
    setDraft(prev => ({
      ...prev,
      content: prev.content + emoji
    }));
    setShowEmojiPicker(false);
  };

  const handleSubmit = () => {
    if (draft.title && draft.content) {
      onSubmit?.(draft);
    }
  };

  const formatRecordingTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b">
        <div className="flex items-center justify-between p-4">
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="h-5 w-5" />
          </Button>
          <h2 className="font-semibold">Create Thread</h2>
          <Button 
            size="sm"
            onClick={handleSubmit}
            disabled={!draft.title || !draft.content}
          >
            <Send className="h-4 w-4 mr-2" />
            Post
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Category Selection */}
        <div>
          <label className="text-sm font-medium text-gray-700 mb-2 block">
            Category
          </label>
          <div className="flex gap-2 overflow-x-auto scrollbar-hide">
            {categoryList.map((category) => {
              const Icon = category.icon;
              return (
                <Button
                  key={category.id}
                  variant={draft.category === category.id ? "default" : "outline"}
                  size="sm"
                  className="flex-shrink-0"
                  onClick={() => setDraft(prev => ({ ...prev, category: category.id }))}
                >
                  {Icon && <Icon className="h-4 w-4 mr-1" />}
                  {category.name}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Title Input */}
        <div>
          <input
            type="text"
            placeholder="Thread title..."
            value={draft.title}
            onChange={(e) => setDraft(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-3 text-lg font-medium bg-white rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        {/* Content Input */}
        <div className="relative">
          <textarea
            placeholder="What's on your mind?"
            value={draft.content}
            onChange={(e) => setDraft(prev => ({ ...prev, content: e.target.value }))}
            className="w-full px-4 py-3 bg-white rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500 min-h-[200px] resize-none"
          />
          
          {/* Voice Recording Indicator */}
          {isRecording && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2">
              <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
              Recording {formatRecordingTime(recordingTime)}
            </div>
          )}

          {/* Transcribing Indicator */}
          {isTranscribing && (
            <div className="absolute top-2 right-2 bg-blue-500 text-white px-3 py-1 rounded-full text-sm">
              Transcribing...
            </div>
          )}
        </div>

        {/* Tags */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Hash className="h-4 w-4 text-gray-500" />
            <input
              type="text"
              placeholder="Add tags..."
              value={currentTag}
              onChange={(e) => setCurrentTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTag()}
              className="flex-1 px-3 py-2 bg-white rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <Button size="sm" onClick={addTag}>Add</Button>
          </div>
          
          {draft.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {draft.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="pl-2">
                  #{tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="ml-2 hover:text-red-500"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Attachments */}
        {draft.attachments.length > 0 && (
          <div className="space-y-2">
            {draft.attachments.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-gray-100 rounded-lg">
                <div className="flex items-center gap-2">
                  <Paperclip className="h-4 w-4 text-gray-500" />
                  <span className="text-sm truncate">{file.name}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeAttachment(index)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}

        {/* Advanced Options */}
        <Card>
          <CardHeader 
            className="cursor-pointer"
            onClick={() => setShowAdvancedOptions(!showAdvancedOptions)}
          >
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm">Advanced Options</CardTitle>
              <ChevronDown className={cn(
                "h-4 w-4 transition-transform",
                showAdvancedOptions && "rotate-180"
              )} />
            </div>
          </CardHeader>
          
          <AnimatePresence>
            {showAdvancedOptions && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <CardContent className="space-y-3">
                  {/* Visibility */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Visibility
                    </label>
                    <div className="flex gap-2">
                      {[
                        { value: 'public', label: 'Public', icon: Globe },
                        { value: 'members', label: 'Members', icon: Users },
                        { value: 'private', label: 'Private', icon: Lock }
                      ].map((option) => {
                        const Icon = option.icon;
                        return (
                          <Button
                            key={option.value}
                            variant={draft.visibility === option.value ? "default" : "outline"}
                            size="sm"
                            onClick={() => setDraft(prev => ({ 
                              ...prev, 
                              visibility: option.value as ThreadDraft['visibility']
                            }))}
                          >
                            <Icon className="h-4 w-4 mr-1" />
                            {option.label}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                      Location (Optional)
                    </label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Add location..."
                        value={draft.location || ''}
                        onChange={(e) => setDraft(prev => ({ ...prev, location: e.target.value }))}
                        className="w-full pl-10 pr-4 py-2 bg-white rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                    </div>
                  </div>
                </CardContent>
              </motion.div>
            )}
          </AnimatePresence>
        </Card>
      </div>

      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Voice Recording */}
            <Button
              variant={isRecording ? "destructive" : "outline"}
              size="sm"
              onClick={isRecording ? stopRecording : startRecording}
              className="h-10 w-10 p-0"
            >
              {isRecording ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
            </Button>

            {/* Attachments */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowAttachmentOptions(!showAttachmentOptions)}
                className="h-10 w-10 p-0"
              >
                <Paperclip className="h-5 w-5" />
              </Button>

              <AnimatePresence>
                {showAttachmentOptions && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute bottom-12 left-0 bg-white rounded-lg shadow-lg border p-2 min-w-[150px]"
                  >
                    <input
                      ref={fileInputRef}
                      type="file"
                      multiple
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Image className="h-4 w-4 mr-2" />
                      Photo
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Video
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Camera
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Emoji Picker */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className="h-10 w-10 p-0"
              >
                <Smile className="h-5 w-5" />
              </Button>

              <AnimatePresence>
                {showEmojiPicker && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute bottom-12 left-0 bg-white rounded-lg shadow-lg border p-2"
                  >
                    <div className="grid grid-cols-5 gap-1">
                      {emojis.map((emoji) => (
                        <button
                          key={emoji}
                          onClick={() => addEmoji(emoji)}
                          className="p-2 hover:bg-gray-100 rounded text-xl"
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Mentions */}
            <Button
              variant="outline"
              size="sm"
              className="h-10 w-10 p-0"
            >
              <AtSign className="h-5 w-5" />
            </Button>
          </div>

          {/* Save Draft */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onSaveDraft?.(draft)}
          >
            Save Draft
          </Button>
        </div>
      </div>
    </div>
  );
}