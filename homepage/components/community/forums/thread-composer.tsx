'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Bold,
  Italic,
  Underline,
  Link,
  Image,
  Code,
  List,
  ListOrdered,
  Quote,
  Video,
  Paperclip,
  Hash,
  X,
  Send,
  Eye,
  MessageSquare,
  HelpCircle,
  Megaphone,
  BarChart3,
  FileText,
  Calendar,
  Save,
  AlertCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ThreadComposerProps {
  categoryId?: string;
  isReply?: boolean;
  parentThreadId?: string;
  quotedContent?: {
    author: string;
    content: string;
  };
  onSubmit?: (thread: ThreadData) => void;
  onCancel?: () => void;
  onSaveDraft?: (draft: ThreadData) => void;
}

interface ThreadData {
  title: string;
  content: string;
  type: 'discussion' | 'question' | 'announcement' | 'poll' | 'resource' | 'event';
  category: string;
  tags: string[];
  attachments: File[];
  isPoll?: boolean;
  pollOptions?: string[];
  isEvent?: boolean;
  eventDate?: Date;
}

export function ThreadComposer({
  categoryId,
  isReply = false,
  parentThreadId,
  quotedContent,
  onSubmit,
  onCancel,
  onSaveDraft
}: ThreadComposerProps) {
  const [threadData, setThreadData] = React.useState<ThreadData>({
    title: '',
    content: quotedContent ? `[quote="${quotedContent.author}"]${quotedContent.content}[/quote]\n\n` : '',
    type: 'discussion',
    category: categoryId || '',
    tags: [],
    attachments: []
  });
  
  const [currentTag, setCurrentTag] = React.useState('');
  const [isPreview, setIsPreview] = React.useState(false);
  const [isDraft, setIsDraft] = React.useState(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const threadTypes = [
    { value: 'discussion', label: 'Discussion', icon: MessageSquare, description: 'General conversation topic' },
    { value: 'question', label: 'Question', icon: HelpCircle, description: 'Seeking help or answers' },
    { value: 'announcement', label: 'Announcement', icon: Megaphone, description: 'Important community news' },
    { value: 'poll', label: 'Poll', icon: BarChart3, description: 'Community voting/survey' },
    { value: 'resource', label: 'Resource', icon: FileText, description: 'Helpful guides or materials' },
    { value: 'event', label: 'Event', icon: Calendar, description: 'Community event or meetup' }
  ];

  const categories = [
    { id: 'general', name: 'General Discussion' },
    { id: 'creator-spaces', name: 'Creator Spaces' },
    { id: 'fan-zones', name: 'Fan Zones' },
    { id: 'help-support', name: 'Help & Support' },
    { id: 'showcase', name: 'Showcase' },
    { id: 'culture-heritage', name: 'Culture & Heritage' },
    { id: 'off-topic', name: 'Off-Topic' }
  ];

  const formatButtons = [
    { icon: Bold, label: 'Bold', shortcut: 'Ctrl+B', format: '**text**' },
    { icon: Italic, label: 'Italic', shortcut: 'Ctrl+I', format: '*text*' },
    { icon: Underline, label: 'Underline', shortcut: 'Ctrl+U', format: '__text__' },
    { icon: Code, label: 'Code', shortcut: 'Ctrl+`', format: '`code`' },
    { icon: Link, label: 'Link', shortcut: 'Ctrl+K', format: '[text](url)' },
    { icon: Quote, label: 'Quote', shortcut: 'Ctrl+>', format: '> quote' },
    { icon: List, label: 'Bullet List', shortcut: 'Ctrl+L', format: '- item' },
    { icon: ListOrdered, label: 'Numbered List', shortcut: 'Ctrl+Shift+L', format: '1. item' }
  ];

  const handleFormatText = (format: string) => {
    const textarea = document.querySelector('textarea[name="content"]') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = textarea.value.substring(start, end);
    const beforeText = textarea.value.substring(0, start);
    const afterText = textarea.value.substring(end);

    let formattedText = '';
    switch (format) {
      case '**text**':
        formattedText = selectedText ? `**${selectedText}**` : '**bold text**';
        break;
      case '*text*':
        formattedText = selectedText ? `*${selectedText}*` : '*italic text*';
        break;
      case '__text__':
        formattedText = selectedText ? `__${selectedText}__` : '__underlined text__';
        break;
      case '`code`':
        formattedText = selectedText ? `\`${selectedText}\`` : '`code`';
        break;
      case '[text](url)':
        formattedText = selectedText ? `[${selectedText}](url)` : '[link text](url)';
        break;
      case '> quote':
        formattedText = selectedText ? `> ${selectedText}` : '> quoted text';
        break;
      case '- item':
        formattedText = selectedText ? `- ${selectedText}` : '- list item';
        break;
      case '1. item':
        formattedText = selectedText ? `1. ${selectedText}` : '1. numbered item';
        break;
      default:
        formattedText = selectedText;
    }

    const newContent = beforeText + formattedText + afterText;
    setThreadData(prev => ({ ...prev, content: newContent }));

    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + formattedText.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !threadData.tags.includes(currentTag.trim().toLowerCase())) {
      setThreadData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim().toLowerCase()]
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setThreadData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.target === document.querySelector('input[name="tag"]')) {
      e.preventDefault();
      handleAddTag();
    }

    // Format shortcuts
    if (e.ctrlKey || e.metaKey) {
      switch (e.key) {
        case 'b':
          e.preventDefault();
          handleFormatText('**text**');
          break;
        case 'i':
          e.preventDefault();
          handleFormatText('*text*');
          break;
        case 'u':
          e.preventDefault();
          handleFormatText('__text__');
          break;
        case '`':
          e.preventDefault();
          handleFormatText('`code`');
          break;
      }
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!threadData.title.trim() && !isReply) {
      newErrors.title = 'Title is required';
    }
    if (!threadData.content.trim()) {
      newErrors.content = 'Content is required';
    }
    if (!threadData.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSubmit?.(threadData);
    }
  };

  const handleSaveDraft = () => {
    setIsDraft(true);
    onSaveDraft?.(threadData);
    setTimeout(() => setIsDraft(false), 2000);
  };

  const renderPreview = () => {
    // Simple markdown-like preview
    let previewContent = threadData.content
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/__(.*?)__/g, '<u>$1</u>')
      .replace(/`(.*?)`/g, '<code class="bg-gray-100 px-1 rounded">$1</code>')
      .replace(/\[quote="(.*?)"\](.*?)\[\/quote\]/g, '<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600 my-2"><small class="text-gray-500">$1 wrote:</small><br>$2</blockquote>')
      .replace(/> (.*?)$/gm, '<blockquote class="border-l-4 border-gray-300 pl-4 italic text-gray-600">$1</blockquote>')
      .replace(/^- (.*?)$/gm, '<li>$1</li>')
      .replace(/^\d+\. (.*?)$/gm, '<li>$1</li>')
      .replace(/\n/g, '<br>');

    return (
      <div className="prose prose-sm max-w-none">
        <div dangerouslySetInnerHTML={{ __html: previewContent }} />
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            {isReply ? 'Reply to Thread' : 'Create New Thread'}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Thread Type & Category */}
          {!isReply && (
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Thread Type</Label>
                <Select
                  value={threadData.type}
                  onValueChange={(value) => setThreadData(prev => ({ ...prev, type: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select thread type" />
                  </SelectTrigger>
                  <SelectContent>
                    {threadTypes.map((type) => {
                      const Icon = type.icon;
                      return (
                        <SelectItem key={type.value} value={type.value}>
                          <div className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            <div>
                              <div className="font-medium">{type.label}</div>
                              <div className="text-xs text-gray-500">{type.description}</div>
                            </div>
                          </div>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={threadData.category}
                  onValueChange={(value) => setThreadData(prev => ({ ...prev, category: value }))}
                >
                  <SelectTrigger className={errors.category ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-sm text-red-500 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {errors.category}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Title */}
          {!isReply && (
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                name="title"
                placeholder="Enter thread title..."
                value={threadData.title}
                onChange={(e) => setThreadData(prev => ({ ...prev, title: e.target.value }))}
                className={errors.title ? 'border-red-500' : ''}
                onKeyDown={handleKeyPress}
              />
              {errors.title && (
                <p className="text-sm text-red-500 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" />
                  {errors.title}
                </p>
              )}
            </div>
          )}

          {/* Rich Text Editor */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="content">Content</Label>
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsPreview(!isPreview)}
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Preview
                </Button>
              </div>
            </div>

            {/* Formatting Toolbar */}
            <div className="border rounded-t-md bg-gray-50 p-2">
              <div className="flex flex-wrap gap-1">
                {formatButtons.map((button) => {
                  const Icon = button.icon;
                  return (
                    <Button
                      key={button.label}
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      title={`${button.label} (${button.shortcut})`}
                      onClick={() => handleFormatText(button.format)}
                    >
                      <Icon className="h-4 w-4" />
                    </Button>
                  );
                })}
                <div className="w-px bg-gray-300 mx-1" />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="Add Image"
                >
                  <Image className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="Add Video"
                >
                  <Video className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="Attach File"
                >
                  <Paperclip className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Content Area */}
            <div className="border rounded-b-md border-t-0 min-h-[200px]">
              {isPreview ? (
                <div className="p-4 bg-white min-h-[200px]">
                  {threadData.content ? renderPreview() : (
                    <div className="text-gray-500 italic">Nothing to preview</div>
                  )}
                </div>
              ) : (
                <Textarea
                  id="content"
                  name="content"
                  placeholder={isReply ? "Write your reply..." : "Write your thread content..."}
                  value={threadData.content}
                  onChange={(e) => setThreadData(prev => ({ ...prev, content: e.target.value }))}
                  className={cn(
                    "min-h-[200px] border-0 rounded-t-none focus-visible:ring-0 resize-none",
                    errors.content ? 'border-red-500' : ''
                  )}
                  onKeyDown={handleKeyPress}
                />
              )}
            </div>
            {errors.content && (
              <p className="text-sm text-red-500 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {errors.content}
              </p>
            )}
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <div className="flex gap-2">
              <Input
                id="tags"
                name="tag"
                placeholder="Add tags..."
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                onClick={handleAddTag}
                disabled={!currentTag.trim()}
              >
                <Hash className="h-4 w-4" />
              </Button>
            </div>
            {threadData.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                <AnimatePresence>
                  {threadData.tags.map((tag) => (
                    <motion.div
                      key={tag}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                    >
                      <Badge variant="secondary" className="flex items-center gap-1">
                        <Hash className="h-3 w-3" />
                        {tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-auto w-auto p-0 ml-1"
                          onClick={() => handleRemoveTag(tag)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleSaveDraft}
                disabled={!threadData.content.trim()}
              >
                <Save className="h-4 w-4 mr-1" />
                {isDraft ? 'Saved!' : 'Save Draft'}
              </Button>
              {onCancel && (
                <Button type="button" variant="ghost" onClick={onCancel}>
                  Cancel
                </Button>
              )}
            </div>

            <Button onClick={handleSubmit} className="bg-purple-600 hover:bg-purple-700">
              <Send className="h-4 w-4 mr-1" />
              {isReply ? 'Post Reply' : 'Create Thread'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}