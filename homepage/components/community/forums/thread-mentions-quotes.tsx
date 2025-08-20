'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { 
  AtSign,
  Quote,
  Reply,
  MessageSquare,
  Clock,
  Eye,
  Heart,
  Share2,
  Bell,
  Search,
  Filter,
  MoreHorizontal,
  ExternalLink,
  Check,
  X,
  Star,
  Pin,
  Flag
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Mention {
  id: string;
  type: 'mention' | 'reply' | 'quote';
  threadId: string;
  threadTitle: string;
  postId: string;
  content: string;
  quotedContent?: string;
  author: {
    id: string;
    name: string;
    avatar: string;
    role: 'member' | 'creator' | 'moderator' | 'admin';
  };
  mentionedUser: {
    id: string;
    name: string;
  };
  timestamp: Date;
  isRead: boolean;
  isStarred: boolean;
  category: string;
  context?: {
    beforeText: string;
    afterText: string;
  };
}

interface MentionNotification {
  id: string;
  mention: Mention;
  notificationType: 'immediate' | 'digest';
  deliveredAt: Date;
  readAt?: Date;
  actionTaken?: 'replied' | 'liked' | 'ignored';
}

interface QuoteReference {
  id: string;
  originalPostId: string;
  quotingPostId: string;
  quotedText: string;
  originalAuthor: {
    id: string;
    name: string;
    avatar: string;
  };
  quotingAuthor: {
    id: string;
    name: string;
    avatar: string;
  };
  timestamp: Date;
  threadId: string;
  threadTitle: string;
}

interface ThreadMentionsQuotesProps {
  view?: 'mentions' | 'quotes' | 'notifications';
  currentUserId?: string;
  onMentionClick?: (mention: Mention) => void;
  onQuoteClick?: (quote: QuoteReference) => void;
  onMarkAsRead?: (mentionId: string) => void;
  onReply?: (mentionId: string) => void;
  onCreateQuote?: (postId: string, selectedText: string) => void;
}

export function ThreadMentionsQuotes({
  view = 'mentions',
  currentUserId = 'current-user',
  onMentionClick,
  onQuoteClick,
  onMarkAsRead,
  onReply,
  onCreateQuote
}: ThreadMentionsQuotesProps) {
  const [activeView, setActiveView] = React.useState(view);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState<'all' | 'unread' | 'starred'>('all');
  const [selectedMentions, setSelectedMentions] = React.useState<Set<string>>(new Set());

  // Sample mentions data
  const mentions: Mention[] = [
    {
      id: 'mention1',
      type: 'mention',
      threadId: 'thread1',
      threadTitle: 'Best places to visit in Port-au-Prince for first-time travelers',
      postId: 'post1',
      content: '@current-user Have you been to the Iron Market? I think you mentioned it before in another discussion about local shopping.',
      author: {
        id: 'user1',
        name: 'Jean Baptiste',
        avatar: '👨🏾‍💼',
        role: 'member'
      },
      mentionedUser: {
        id: 'current-user',
        name: 'Current User'
      },
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      isRead: false,
      isStarred: false,
      category: 'general',
      context: {
        beforeText: 'The Iron Market is definitely worth visiting for authentic crafts. ',
        afterText: ' Would love to hear your thoughts on the best time to visit.'
      }
    },
    {
      id: 'mention2',
      type: 'reply',
      threadId: 'thread2',
      threadTitle: 'Learning Kreyòl as an adult - Tips and resources needed',
      postId: 'post2',
      content: 'Great question! @current-user I remember you sharing some excellent language learning apps in the past. Could you recommend them again?',
      author: {
        id: 'user2',
        name: 'Marcus Thompson',
        avatar: '👨🏾‍🎓',
        role: 'member'
      },
      mentionedUser: {
        id: 'current-user',
        name: 'Current User'
      },
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      isRead: true,
      isStarred: true,
      category: 'culture-heritage'
    },
    {
      id: 'mention3',
      type: 'quote',
      threadId: 'thread3',
      threadTitle: 'Traditional Haitian recipes from grandmere',
      postId: 'post3',
      content: 'This is exactly what I was looking for!',
      quotedContent: 'The secret to authentic griot is in the marinade - let the pork sit overnight with bitter orange juice and scotch bonnet peppers.',
      author: {
        id: 'user3',
        name: 'Marie Delacroix',
        avatar: '👩🏾‍🎨',
        role: 'creator'
      },
      mentionedUser: {
        id: 'current-user',
        name: 'Current User'
      },
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      isRead: false,
      isStarred: false,
      category: 'culture-heritage'
    }
  ];

  // Sample quote references
  const quotes: QuoteReference[] = [
    {
      id: 'quote1',
      originalPostId: 'post1',
      quotingPostId: 'post4',
      quotedText: 'The secret to authentic griot is in the marinade - let the pork sit overnight with bitter orange juice and scotch bonnet peppers.',
      originalAuthor: {
        id: 'current-user',
        name: 'Current User',
        avatar: '👤'
      },
      quotingAuthor: {
        id: 'user3',
        name: 'Marie Delacroix',
        avatar: '👩🏾‍🎨'
      },
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      threadId: 'thread3',
      threadTitle: 'Traditional Haitian recipes from grandmere'
    },
    {
      id: 'quote2',
      originalPostId: 'post2',
      quotingPostId: 'post5',
      quotedText: 'I found that immersion through Haitian podcasts really helped me understand the rhythm of the language.',
      originalAuthor: {
        id: 'current-user',
        name: 'Current User',
        avatar: '👤'
      },
      quotingAuthor: {
        id: 'user4',
        name: 'Sophia Laurent',
        avatar: '👩🏾‍💻'
      },
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      threadId: 'thread2',
      threadTitle: 'Learning Kreyòl as an adult - Tips and resources needed'
    }
  ];

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)}h ago`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)}d ago`;
    }
  };

  const getMentionTypeIcon = (type: string) => {
    switch (type) {
      case 'mention': return <AtSign className="h-4 w-4 text-blue-600" />;
      case 'reply': return <Reply className="h-4 w-4 text-green-600" />;
      case 'quote': return <Quote className="h-4 w-4 text-purple-600" />;
      default: return <MessageSquare className="h-4 w-4 text-gray-600" />;
    }
  };

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return '👑';
      case 'moderator': return '🛡️';
      case 'creator': return '⭐';
      default: return null;
    }
  };

  const handleSelectMention = (mentionId: string) => {
    setSelectedMentions(prev => {
      const newSet = new Set(prev);
      if (newSet.has(mentionId)) {
        newSet.delete(mentionId);
      } else {
        newSet.add(mentionId);
      }
      return newSet;
    });
  };

  const handleBulkAction = (action: 'mark_read' | 'star' | 'unstar') => {
    selectedMentions.forEach(mentionId => {
      if (action === 'mark_read') {
        onMarkAsRead?.(mentionId);
      }
    });
    setSelectedMentions(new Set());
  };

  const filteredMentions = mentions.filter(mention => {
    if (searchQuery && !mention.content.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !mention.threadTitle.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    switch (filterStatus) {
      case 'unread': return !mention.isRead;
      case 'starred': return mention.isStarred;
      default: return true;
    }
  });

  const highlightMentions = (text: string, mentionedUser: string) => {
    const mentionRegex = new RegExp(`@${mentionedUser.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`, 'gi');
    return text.split(mentionRegex).reduce((acc, part, index, array) => {
      if (index === array.length - 1) return acc + part;
      return acc + part + `<span class="bg-blue-100 text-blue-800 px-1 rounded">@${mentionedUser}</span>`;
    }, '');
  };

  const renderMentions = () => (
    <div className="space-y-4">
      {/* Search and Filter */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search mentions and replies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as any)}
          className="px-3 py-2 border rounded-md text-sm"
        >
          <option value="all">All</option>
          <option value="unread">Unread</option>
          <option value="starred">Starred</option>
        </select>
      </div>

      {/* Bulk Actions */}
      {selectedMentions.size > 0 && (
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">
                {selectedMentions.size} mention(s) selected
              </span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('mark_read')}>
                  <Check className="h-4 w-4 mr-1" />
                  Mark Read
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleBulkAction('star')}>
                  <Star className="h-4 w-4 mr-1" />
                  Star
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Mentions List */}
      <div className="space-y-3">
        {filteredMentions.map((mention) => (
          <Card key={mention.id} className={cn(
            "hover:shadow-md transition-all cursor-pointer",
            !mention.isRead && "border-l-4 border-l-blue-500 bg-blue-50/30"
          )}>
            <CardContent className="p-4">
              <div className="flex gap-4">
                {/* Selection & Type */}
                <div className="flex-shrink-0 space-y-2">
                  <input
                    type="checkbox"
                    checked={selectedMentions.has(mention.id)}
                    onChange={() => handleSelectMention(mention.id)}
                    className="rounded border-gray-300"
                  />
                  {getMentionTypeIcon(mention.type)}
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0" onClick={() => onMentionClick?.(mention)}>
                  {/* Header */}
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src={mention.author.avatar} />
                        <AvatarFallback className="text-xs">{mention.author.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium text-sm">{mention.author.name}</span>
                      {getRoleIcon(mention.author.role) && (
                        <span className="text-xs">{getRoleIcon(mention.author.role)}</span>
                      )}
                      <span className="text-xs text-gray-500">mentioned you in</span>
                      <Badge variant="secondary" className="text-xs">
                        {mention.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-2">
                      {mention.isStarred && <Star className="h-4 w-4 text-yellow-500 fill-current" />}
                      {!mention.isRead && <div className="w-2 h-2 bg-blue-600 rounded-full" />}
                    </div>
                  </div>

                  {/* Thread Title */}
                  <h4 className="font-semibold text-sm text-gray-900 mb-2 hover:text-purple-600 transition-colors">
                    {mention.threadTitle}
                  </h4>

                  {/* Quoted Content (for quote type) */}
                  {mention.type === 'quote' && mention.quotedContent && (
                    <div className="bg-gray-100 border-l-4 border-gray-300 pl-3 py-2 mb-2 text-sm">
                      <div className="text-xs text-gray-500 mb-1">You wrote:</div>
                      <div className="text-gray-700 italic">"{mention.quotedContent}"</div>
                    </div>
                  )}

                  {/* Context (for mentions) */}
                  {mention.context && (
                    <div className="text-sm text-gray-600 mb-2">
                      <span>{mention.context.beforeText}</span>
                      <span className="bg-blue-100 text-blue-800 px-1 rounded">@{mention.mentionedUser.name}</span>
                      <span>{mention.context.afterText}</span>
                    </div>
                  )}

                  {/* Main Content */}
                  <div 
                    className="text-sm text-gray-800 mb-3"
                    dangerouslySetInnerHTML={{ 
                      __html: highlightMentions(mention.content, mention.mentionedUser.name) 
                    }}
                  />

                  {/* Timestamp */}
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Clock className="h-3 w-3" />
                    <span>{formatTimeAgo(mention.timestamp)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex-shrink-0">
                  <div className="flex flex-col gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onReply?.(mention.id);
                      }}
                    >
                      <Reply className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Toggle star
                      }}
                    >
                      <Star className={cn("h-4 w-4", mention.isStarred && "fill-current text-yellow-500")} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={(e) => {
                        e.stopPropagation();
                        onMarkAsRead?.(mention.id);
                      }}
                    >
                      {mention.isRead ? <Eye className="h-4 w-4" /> : <Bell className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMentions.length === 0 && (
        <div className="text-center py-12">
          <AtSign className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No mentions found</h3>
          <p className="text-gray-600">
            {searchQuery || filterStatus !== 'all' 
              ? 'Try adjusting your search or filter criteria' 
              : 'You\'ll see mentions and replies here when someone references you'
            }
          </p>
        </div>
      )}
    </div>
  );

  const renderQuotes = () => (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Your Quoted Posts</h3>
          <p className="text-sm text-gray-600">See when others quote your content</p>
        </div>
      </div>

      {/* Quotes List */}
      <div className="space-y-3">
        {quotes.map((quote) => (
          <Card key={quote.id} className="hover:shadow-md transition-all cursor-pointer">
            <CardContent className="p-4" onClick={() => onQuoteClick?.(quote)}>
              <div className="flex gap-4">
                <Quote className="h-5 w-5 text-purple-600 flex-shrink-0 mt-1" />
                
                <div className="flex-1 min-w-0">
                  {/* Header */}
                  <div className="flex items-center gap-2 mb-3">
                    <Avatar className="h-6 w-6">
                      <AvatarImage src={quote.quotingAuthor.avatar} />
                      <AvatarFallback className="text-xs">{quote.quotingAuthor.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <span className="font-medium text-sm">{quote.quotingAuthor.name}</span>
                    <span className="text-xs text-gray-500">quoted your post in</span>
                    <span className="text-xs text-purple-600 font-medium">{quote.threadTitle}</span>
                  </div>

                  {/* Your Original Quote */}
                  <div className="bg-gray-100 border-l-4 border-purple-300 pl-3 py-2 mb-3">
                    <div className="text-xs text-gray-500 mb-1">Your original post:</div>
                    <div className="text-sm text-gray-700 italic">"{quote.quotedText}"</div>
                  </div>

                  {/* Timestamp and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      <span>{formatTimeAgo(quote.timestamp)}</span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">
                        <ExternalLink className="h-3 w-3 mr-1" />
                        View Thread
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {quotes.length === 0 && (
        <div className="text-center py-12">
          <Quote className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No quotes yet</h3>
          <p className="text-gray-600">When others quote your posts, they'll appear here</p>
        </div>
      )}
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Mention Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Notification Settings</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email notifications for mentions</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Push notifications for mentions</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Digest for quotes</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-medium">Auto-responses</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Auto-like mentions</span>
                  <input type="checkbox" className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Auto-follow quoters</span>
                  <input type="checkbox" className="rounded" />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Mark as read when replied</span>
                  <input type="checkbox" defaultChecked className="rounded" />
                </div>
              </div>
            </div>
          </div>

          <Button className="w-full">Save Notification Settings</Button>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Mentions & Quotes</h2>
        <p className="text-gray-600">Track when others reference your content or mention you</p>
      </div>

      {/* View Tabs */}
      <div className="flex border-b">
        {[
          { id: 'mentions', label: 'Mentions & Replies', icon: AtSign, count: mentions.filter(m => !m.isRead).length },
          { id: 'quotes', label: 'Quotes', icon: Quote, count: quotes.length },
          { id: 'notifications', label: 'Settings', icon: Bell }
        ].map(({ id, label, icon: Icon, count }) => (
          <button
            key={id}
            onClick={() => setActiveView(id as any)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 border-b-2 transition-colors",
              activeView === id
                ? "border-purple-600 text-purple-600"
                : "border-transparent text-gray-600 hover:text-gray-900"
            )}
          >
            <Icon className="h-4 w-4" />
            <span>{label}</span>
            {count !== undefined && count > 0 && (
              <Badge variant="secondary" className="ml-1">
                {count}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>
        {activeView === 'mentions' && renderMentions()}
        {activeView === 'quotes' && renderQuotes()}
        {activeView === 'notifications' && renderNotifications()}
      </div>
    </div>
  );
}