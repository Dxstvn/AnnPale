'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import {
  MessageSquare,
  HelpCircle,
  BarChart,
  Heart,
  ThumbsUp,
  Laugh,
  Star,
  Hand,
  Send,
  Clock,
  ChevronUp,
  Users,
  Sparkles,
  Gift,
  Filter,
  Pin
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessage {
  id: string;
  user: {
    name: string;
    tier?: 'general' | 'vip' | 'platinum';
    isHost?: boolean;
    isModerator?: boolean;
  };
  message: string;
  timestamp: Date;
  isPinned?: boolean;
  reactions?: { type: string; count: number }[];
}

interface Question {
  id: string;
  user: {
    name: string;
    tier?: 'general' | 'vip' | 'platinum';
  };
  question: string;
  upvotes: number;
  answered: boolean;
  timestamp: Date;
}

interface Poll {
  id: string;
  question: string;
  options: Array<{
    id: string;
    text: string;
    votes: number;
  }>;
  totalVotes: number;
  userVoted: boolean;
  endsAt?: Date;
}

interface EventInteractionPanelProps {
  eventId: string;
  userTier?: 'general' | 'vip' | 'platinum';
  isHost?: boolean;
  isModerator?: boolean;
  onSendMessage?: (message: string) => void;
  onSubmitQuestion?: (question: string) => void;
  onVotePoll?: (pollId: string, optionId: string) => void;
  onRaiseHand?: () => void;
  onSendReaction?: (reaction: string) => void;
  onSendGift?: (gift: string) => void;
}

export function EventInteractionPanel({
  eventId,
  userTier = 'general',
  isHost = false,
  isModerator = false,
  onSendMessage,
  onSubmitQuestion,
  onVotePoll,
  onRaiseHand,
  onSendReaction,
  onSendGift
}: EventInteractionPanelProps) {
  const [activeTab, setActiveTab] = React.useState('chat');
  const [chatMessage, setChatMessage] = React.useState('');
  const [questionText, setQuestionText] = React.useState('');
  const [handRaised, setHandRaised] = React.useState(false);
  const [chatFilter, setChatFilter] = React.useState<'all' | 'vip' | 'questions'>('all');

  // Sample data
  const [messages] = React.useState<ChatMessage[]>([
    {
      id: '1',
      user: { name: 'Marie Joseph', tier: 'vip' },
      message: 'This is amazing! Thank you for sharing this knowledge 🙏',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      reactions: [{ type: '❤️', count: 12 }, { type: '👍', count: 8 }]
    },
    {
      id: '2',
      user: { name: 'Event Host', isHost: true },
      message: 'Welcome everyone! Feel free to ask questions in the Q&A tab!',
      timestamp: new Date(Date.now() - 3 * 60 * 1000),
      isPinned: true
    },
    {
      id: '3',
      user: { name: 'Jean Pierre', tier: 'platinum' },
      message: 'Can we get the slides after the presentation?',
      timestamp: new Date(Date.now() - 2 * 60 * 1000)
    },
    {
      id: '4',
      user: { name: 'Moderator', isModerator: true },
      message: 'Reminder: Please keep chat respectful and on-topic',
      timestamp: new Date(Date.now() - 1 * 60 * 1000)
    }
  ]);

  const [questions] = React.useState<Question[]>([
    {
      id: '1',
      user: { name: 'Sophie Laurent', tier: 'vip' },
      question: 'How do you handle scalability with this approach?',
      upvotes: 24,
      answered: false,
      timestamp: new Date(Date.now() - 10 * 60 * 1000)
    },
    {
      id: '2',
      user: { name: 'Marcus T.', tier: 'general' },
      question: 'What are the main prerequisites to get started?',
      upvotes: 18,
      answered: true,
      timestamp: new Date(Date.now() - 8 * 60 * 1000)
    },
    {
      id: '3',
      user: { name: 'Patricia M.', tier: 'platinum' },
      question: 'Will there be a follow-up session on advanced topics?',
      upvotes: 15,
      answered: false,
      timestamp: new Date(Date.now() - 5 * 60 * 1000)
    }
  ]);

  const [currentPoll] = React.useState<Poll>({
    id: '1',
    question: 'What topic should we cover in the next session?',
    options: [
      { id: '1', text: 'Advanced Performance Optimization', votes: 145 },
      { id: '2', text: 'Security Best Practices', votes: 98 },
      { id: '3', text: 'Real-world Case Studies', votes: 167 },
      { id: '4', text: 'Q&A Deep Dive', votes: 72 }
    ],
    totalVotes: 482,
    userVoted: false,
    endsAt: new Date(Date.now() + 10 * 60 * 1000)
  });

  const reactions = [
    { emoji: '❤️', name: 'heart' },
    { emoji: '👍', name: 'thumbs-up' },
    { emoji: '😂', name: 'laugh' },
    { emoji: '🔥', name: 'fire' },
    { emoji: '👏', name: 'clap' },
    { emoji: '🎉', name: 'party' }
  ];

  const virtualGifts = [
    { emoji: '🌹', name: 'Rose', cost: 5 },
    { emoji: '🎁', name: 'Gift', cost: 10 },
    { emoji: '💎', name: 'Diamond', cost: 25 },
    { emoji: '🏆', name: 'Trophy', cost: 50 }
  ];

  const handleSendMessage = () => {
    if (chatMessage.trim()) {
      onSendMessage?.(chatMessage);
      setChatMessage('');
    }
  };

  const handleSubmitQuestion = () => {
    if (questionText.trim()) {
      onSubmitQuestion?.(questionText);
      setQuestionText('');
    }
  };

  const handleRaiseHand = () => {
    setHandRaised(!handRaised);
    onRaiseHand?.();
  };

  const filteredMessages = messages.filter(msg => {
    if (chatFilter === 'all') return true;
    if (chatFilter === 'vip') return msg.user.tier === 'vip' || msg.user.tier === 'platinum';
    if (chatFilter === 'questions') return msg.message.includes('?');
    return true;
  });

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">Event Interaction</CardTitle>
          <div className="flex items-center gap-2">
            {handRaised && (
              <Badge className="bg-orange-500 text-white animate-pulse">
                <Hand className="h-3 w-3 mr-1" />
                Hand Raised
              </Badge>
            )}
            {userTier === 'vip' && (
              <Badge className="bg-purple-600 text-white">
                <Sparkles className="h-3 w-3 mr-1" />
                VIP
              </Badge>
            )}
            {userTier === 'platinum' && (
              <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                <Sparkles className="h-3 w-3 mr-1" />
                Platinum
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-hidden p-0">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
          <TabsList className="grid grid-cols-3 w-full rounded-none">
            <TabsTrigger value="chat" className="gap-2">
              <MessageSquare className="h-4 w-4" />
              Chat
            </TabsTrigger>
            <TabsTrigger value="qa" className="gap-2">
              <HelpCircle className="h-4 w-4" />
              Q&A
            </TabsTrigger>
            <TabsTrigger value="polls" className="gap-2">
              <BarChart className="h-4 w-4" />
              Polls
            </TabsTrigger>
          </TabsList>

          {/* Chat Tab */}
          <TabsContent value="chat" className="flex-1 flex flex-col p-4 pt-2">
            {/* Chat Filter */}
            <div className="flex items-center gap-2 mb-3">
              <Button
                variant={chatFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChatFilter('all')}
              >
                All
              </Button>
              <Button
                variant={chatFilter === 'vip' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChatFilter('vip')}
              >
                VIP Only
              </Button>
              <Button
                variant={chatFilter === 'questions' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setChatFilter('questions')}
              >
                Questions
              </Button>
            </div>

            {/* Messages */}
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-3">
                {filteredMessages.map((msg) => (
                  <div key={msg.id} className={cn("", msg.isPinned && "border-l-2 border-purple-600 pl-2")}>
                    <div className="flex items-start gap-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{msg.user.name}</span>
                          {msg.user.isHost && (
                            <Badge variant="secondary" className="text-xs">Host</Badge>
                          )}
                          {msg.user.isModerator && (
                            <Badge variant="secondary" className="text-xs">Mod</Badge>
                          )}
                          {msg.user.tier === 'vip' && (
                            <Badge className="text-xs bg-purple-600 text-white">VIP</Badge>
                          )}
                          {msg.user.tier === 'platinum' && (
                            <Badge className="text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                              Platinum
                            </Badge>
                          )}
                          {msg.isPinned && (
                            <Pin className="h-3 w-3 text-purple-600" />
                          )}
                        </div>
                        <p className="text-sm mt-1">{msg.message}</p>
                        {msg.reactions && msg.reactions.length > 0 && (
                          <div className="flex items-center gap-2 mt-2">
                            {msg.reactions.map((reaction) => (
                              <span key={reaction.type} className="text-xs bg-gray-100 px-2 py-1 rounded-full">
                                {reaction.type} {reaction.count}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <span className="text-xs text-gray-500">
                        {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

            {/* Quick Reactions */}
            <div className="flex items-center gap-2 py-2 border-t">
              {reactions.map((reaction) => (
                <Button
                  key={reaction.name}
                  variant="ghost"
                  size="sm"
                  onClick={() => onSendReaction?.(reaction.name)}
                  className="hover:scale-110 transition-transform"
                >
                  <span className="text-lg">{reaction.emoji}</span>
                </Button>
              ))}
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage}>
                <Send className="h-4 w-4" />
              </Button>
            </div>

            {/* Virtual Gifts (VIP/Platinum only) */}
            {(userTier === 'vip' || userTier === 'platinum') && (
              <div className="flex items-center gap-2 mt-2 pt-2 border-t">
                <Gift className="h-4 w-4 text-gray-500" />
                <span className="text-xs text-gray-500">Send gift:</span>
                {virtualGifts.map((gift) => (
                  <Button
                    key={gift.name}
                    variant="ghost"
                    size="sm"
                    onClick={() => onSendGift?.(gift.name)}
                    className="hover:scale-110 transition-transform"
                  >
                    <span className="text-lg">{gift.emoji}</span>
                    <span className="text-xs ml-1">${gift.cost}</span>
                  </Button>
                ))}
              </div>
            )}
          </TabsContent>

          {/* Q&A Tab */}
          <TabsContent value="qa" className="flex-1 flex flex-col p-4 pt-2">
            <ScrollArea className="flex-1 pr-4">
              <div className="space-y-3">
                {questions.map((q) => (
                  <Card key={q.id} className={cn(
                    "p-3",
                    q.answered && "bg-green-50 border-green-200"
                  )}>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{q.user.name}</span>
                          {q.user.tier === 'vip' && (
                            <Badge className="text-xs bg-purple-600 text-white">VIP</Badge>
                          )}
                          {q.user.tier === 'platinum' && (
                            <Badge className="text-xs bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                              Platinum
                            </Badge>
                          )}
                          {q.answered && (
                            <Badge variant="success" className="text-xs">Answered</Badge>
                          )}
                        </div>
                        <p className="text-sm mt-1">{q.question}</p>
                      </div>
                      <div className="flex flex-col items-center">
                        <Button variant="ghost" size="sm">
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                        <span className="text-sm font-semibold">{q.upvotes}</span>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </ScrollArea>

            {/* Submit Question */}
            <div className="mt-3 pt-3 border-t">
              <Textarea
                placeholder="Ask a question..."
                value={questionText}
                onChange={(e) => setQuestionText(e.target.value)}
                rows={2}
                className="mb-2"
              />
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={handleRaiseHand}
                  className={cn(handRaised && "bg-orange-100")}
                >
                  <Hand className="h-4 w-4 mr-2" />
                  {handRaised ? 'Lower Hand' : 'Raise Hand'}
                </Button>
                <Button onClick={handleSubmitQuestion}>
                  Submit Question
                </Button>
              </div>
            </div>
          </TabsContent>

          {/* Polls Tab */}
          <TabsContent value="polls" className="flex-1 flex flex-col p-4 pt-2">
            {currentPoll && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-1">{currentPoll.question}</h3>
                  {currentPoll.endsAt && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Clock className="h-3 w-3" />
                      Ends in {Math.ceil((currentPoll.endsAt.getTime() - Date.now()) / 60000)} minutes
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  {currentPoll.options.map((option) => {
                    const percentage = (option.votes / currentPoll.totalVotes) * 100;
                    return (
                      <div key={option.id}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm">{option.text}</span>
                          <span className="text-sm font-semibold">{percentage.toFixed(1)}%</span>
                        </div>
                        <div className="relative">
                          <Progress value={percentage} className="h-8" />
                          <Button
                            variant="ghost"
                            className="absolute inset-0 h-8 justify-start"
                            onClick={() => onVotePoll?.(currentPoll.id, option.id)}
                            disabled={currentPoll.userVoted}
                          >
                            <span className="text-xs ml-2">{option.votes} votes</span>
                          </Button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="text-center text-sm text-gray-500">
                  Total votes: {currentPoll.totalVotes}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}