'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  Gift,
  Heart,
  Star,
  Zap,
  Sparkles,
  Crown,
  DollarSign,
  Send,
  Vote,
  HelpCircle,
  ThumbsUp,
  Pin,
  Timer,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  ReactionType,
  VirtualGift,
  StreamPoll,
  StreamQA,
  SuperChatMessage,
  REACTION_TYPES
} from '@/lib/types/live-viewer';

interface InteractiveFeaturesProps {
  reactions: ReactionType[];
  gifts: VirtualGift[];
  polls: StreamPoll[];
  qaQueue: StreamQA[];
  onReaction: (reactionId: string) => void;
  onSendGift: (giftId: string, quantity: number) => void;
  onPollVote: (pollId: string, optionId: string) => void;
  onSubmitQuestion: (question: string) => void;
  onUpvoteQuestion: (questionId: string) => void;
  onSuperChat: (message: string, amount: number) => void;
  className?: string;
}

export function InteractiveFeatures({
  reactions,
  gifts,
  polls,
  qaQueue,
  onReaction,
  onSendGift,
  onPollVote,
  onSubmitQuestion,
  onUpvoteQuestion,
  onSuperChat,
  className
}: InteractiveFeaturesProps) {
  const [selectedTab, setSelectedTab] = useState('reactions');
  const [showGiftModal, setShowGiftModal] = useState(false);
  const [showSuperChatModal, setShowSuperChatModal] = useState(false);
  const [selectedGift, setSelectedGift] = useState<VirtualGift | null>(null);
  const [giftQuantity, setGiftQuantity] = useState(1);
  const [superChatMessage, setSuperChatMessage] = useState('');
  const [superChatAmount, setSuperChatAmount] = useState(5);
  const [newQuestion, setNewQuestion] = useState('');

  const handleReaction = (reactionId: string) => {
    onReaction(reactionId);
    
    // Create visual effect
    const element = document.getElementById(`reaction-${reactionId}`);
    if (element) {
      element.classList.add('animate-bounce');
      setTimeout(() => {
        element.classList.remove('animate-bounce');
      }, 600);
    }
  };

  const handleSendGift = () => {
    if (selectedGift) {
      onSendGift(selectedGift.id, giftQuantity);
      setShowGiftModal(false);
      setSelectedGift(null);
      setGiftQuantity(1);
    }
  };

  const handleSuperChat = () => {
    if (superChatMessage.trim()) {
      onSuperChat(superChatMessage.trim(), superChatAmount);
      setShowSuperChatModal(false);
      setSuperChatMessage('');
      setSuperChatAmount(5);
    }
  };

  const handleSubmitQuestion = () => {
    if (newQuestion.trim()) {
      onSubmitQuestion(newQuestion.trim());
      setNewQuestion('');
    }
  };

  const getGiftsByCategory = () => {
    const categories = ['hearts', 'flowers', 'stars', 'special', 'premium'];
    return categories.map(category => ({
      category,
      gifts: gifts.filter(gift => gift.category === category)
    })).filter(group => group.gifts.length > 0);
  };

  const getActivePoll = () => {
    return polls.find(poll => poll.isActive);
  };

  const formatTimeRemaining = (endTime: Date) => {
    const now = new Date();
    const remaining = Math.max(0, endTime.getTime() - now.getTime());
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className={cn('bg-white dark:bg-gray-900 rounded-lg border', className)}>
      <Tabs value={selectedTab} onValueChange={setSelectedTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="reactions" className="flex items-center gap-1">
            <Heart className="w-4 h-4" />
            React
          </TabsTrigger>
          <TabsTrigger value="gifts" className="flex items-center gap-1">
            <Gift className="w-4 h-4" />
            Gifts
          </TabsTrigger>
          <TabsTrigger value="polls" className="flex items-center gap-1">
            <Vote className="w-4 h-4" />
            Polls
          </TabsTrigger>
          <TabsTrigger value="qa" className="flex items-center gap-1">
            <HelpCircle className="w-4 h-4" />
            Q&A
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reactions" className="p-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Express Yourself</h3>
            
            {/* Quick Reactions */}
            <div className="grid grid-cols-3 gap-3">
              {reactions.map((reaction) => (
                <Button
                  key={reaction.id}
                  id={`reaction-${reaction.id}`}
                  variant="outline"
                  onClick={() => handleReaction(reaction.id)}
                  className={cn(
                    'h-20 flex flex-col gap-2 transition-all hover:scale-105',
                    reaction.userReacted && 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                  )}
                >
                  <span className="text-2xl">{reaction.emoji}</span>
                  <div className="text-center">
                    <div className="text-xs font-medium">{reaction.name}</div>
                    <div className="text-xs text-gray-500">{reaction.count}</div>
                  </div>
                </Button>
              ))}
            </div>

            {/* Super Chat Button */}
            <Button
              onClick={() => setShowSuperChatModal(true)}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Send Super Chat
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="gifts" className="p-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Virtual Gifts</h3>
              <Button
                onClick={() => setShowGiftModal(true)}
                className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
              >
                <Gift className="w-4 h-4 mr-2" />
                Send Gift
              </Button>
            </div>

            {/* Popular Gifts Preview */}
            <div className="grid grid-cols-4 gap-2">
              {gifts.slice(0, 8).map((gift) => (
                <div
                  key={gift.id}
                  className="aspect-square bg-gray-50 dark:bg-gray-800 rounded-lg flex flex-col items-center justify-center p-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  onClick={() => {
                    setSelectedGift(gift);
                    setShowGiftModal(true);
                  }}
                >
                  <img src={gift.image} alt={gift.name} className="w-8 h-8 mb-1" />
                  <span className="text-xs text-center">${gift.price}</span>
                </div>
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="polls" className="p-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Live Polls</h3>
            
            {/* Active Poll */}
            {getActivePoll() ? (
              <ActivePollComponent
                poll={getActivePoll()!}
                onVote={onPollVote}
              />
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Vote className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No active polls right now</p>
                <p className="text-sm">The creator may start a poll soon!</p>
              </div>
            )}

            {/* Recent Polls */}
            {polls.filter(poll => !poll.isActive).length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-gray-600 dark:text-gray-400">Recent Polls</h4>
                {polls.filter(poll => !poll.isActive).slice(0, 3).map((poll) => (
                  <Card key={poll.id} className="p-3">
                    <div className="text-sm font-medium mb-2">{poll.question}</div>
                    <div className="space-y-1">
                      {poll.options.map((option) => (
                        <div key={option.id} className="flex items-center justify-between text-xs">
                          <span>{option.text}</span>
                          <span>{option.percentage.toFixed(0)}%</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="qa" className="p-4">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Q&A Queue</h3>

            {/* Submit Question */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask the creator a question..."
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSubmitQuestion()}
                  maxLength={200}
                />
                <Button
                  onClick={handleSubmitQuestion}
                  disabled={!newQuestion.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
              <div className="text-xs text-gray-500 text-right">
                {newQuestion.length}/200
              </div>
            </div>

            {/* Question Queue */}
            <div className="space-y-3 max-h-60 overflow-y-auto">
              {qaQueue.map((qa) => (
                <Card key={qa.id} className={cn(
                  'p-3',
                  qa.isHighlighted && 'border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20',
                  qa.isPinned && 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                )}>
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium">
                          {qa.askedByDisplayName}
                        </span>
                        {qa.isPinned && (
                          <Pin className="w-3 h-3 text-purple-500" />
                        )}
                        <span className="text-xs text-gray-500">
                          {qa.timestamp.toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-sm break-words">{qa.question}</p>
                      {qa.isAnswered && qa.answer && (
                        <div className="mt-2 p-2 bg-gray-50 dark:bg-gray-800 rounded text-sm">
                          <span className="font-medium text-green-600">Answer: </span>
                          {qa.answer}
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => onUpvoteQuestion(qa.id)}
                        className={cn(
                          'p-1 h-auto',
                          qa.userUpvoted && 'text-purple-500'
                        )}
                      >
                        <ThumbsUp className="w-3 h-3" />
                        <span className="ml-1 text-xs">{qa.upvotes}</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
              
              {qaQueue.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <HelpCircle className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No questions yet</p>
                  <p className="text-sm">Be the first to ask something!</p>
                </div>
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      {/* Gift Modal */}
      <Dialog open={showGiftModal} onOpenChange={setShowGiftModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send a Gift</DialogTitle>
            <DialogDescription>
              Show your appreciation with a virtual gift
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            {getGiftsByCategory().map(({ category, gifts: categoryGifts }) => (
              <div key={category} className="space-y-2">
                <h4 className="text-sm font-medium capitalize">{category}</h4>
                <div className="grid grid-cols-4 gap-3">
                  {categoryGifts.map((gift) => (
                    <div
                      key={gift.id}
                      className={cn(
                        'p-3 border rounded-lg cursor-pointer transition-all hover:scale-105',
                        selectedGift?.id === gift.id && 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                      )}
                      onClick={() => setSelectedGift(gift)}
                    >
                      <div className="text-center">
                        <img src={gift.image} alt={gift.name} className="w-12 h-12 mx-auto mb-2" />
                        <div className="text-sm font-medium">{gift.name}</div>
                        <div className="text-sm text-green-600">${gift.price}</div>
                        <Badge 
                          variant="outline" 
                          className={cn(
                            'text-xs mt-1',
                            gift.rarity === 'legendary' && 'border-yellow-500 text-yellow-600',
                            gift.rarity === 'epic' && 'border-purple-500 text-purple-600',
                            gift.rarity === 'rare' && 'border-blue-500 text-blue-600'
                          )}
                        >
                          {gift.rarity}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {selectedGift && (
              <div className="border-t pt-4">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h4 className="font-medium">{selectedGift.name}</h4>
                    <p className="text-sm text-gray-600">{selectedGift.description}</p>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-green-600">
                      ${(selectedGift.price * giftQuantity).toFixed(2)}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <label className="text-sm">Quantity:</label>
                    <Input
                      type="number"
                      min="1"
                      max="100"
                      value={giftQuantity}
                      onChange={(e) => setGiftQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20"
                    />
                  </div>
                  
                  <Button
                    onClick={handleSendGift}
                    className="flex-1 bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                  >
                    <Gift className="w-4 h-4 mr-2" />
                    Send Gift
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Super Chat Modal */}
      <Dialog open={showSuperChatModal} onOpenChange={setShowSuperChatModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Super Chat</DialogTitle>
            <DialogDescription>
              Highlight your message and support the creator
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Amount</label>
              <div className="flex gap-2">
                {[5, 10, 25, 50, 100].map((amount) => (
                  <Button
                    key={amount}
                    variant={superChatAmount === amount ? "default" : "outline"}
                    onClick={() => setSuperChatAmount(amount)}
                    className="flex-1"
                  >
                    ${amount}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Message</label>
              <Input
                placeholder="Your highlighted message..."
                value={superChatMessage}
                onChange={(e) => setSuperChatMessage(e.target.value)}
                maxLength={200}
              />
              <div className="text-xs text-gray-500 text-right mt-1">
                {superChatMessage.length}/200
              </div>
            </div>

            <Button
              onClick={handleSuperChat}
              disabled={!superChatMessage.trim()}
              className="w-full bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white"
            >
              <DollarSign className="w-4 h-4 mr-2" />
              Send Super Chat (${superChatAmount})
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

interface ActivePollComponentProps {
  poll: StreamPoll;
  onVote: (pollId: string, optionId: string) => void;
}

function ActivePollComponent({ poll, onVote }: ActivePollComponentProps) {
  const [timeRemaining, setTimeRemaining] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const remaining = Math.max(0, poll.endTime.getTime() - now.getTime());
      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);
      setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(timer);
  }, [poll.endTime]);

  return (
    <Card className="border-purple-500 bg-purple-50 dark:bg-purple-900/20">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{poll.question}</CardTitle>
          <div className="flex items-center gap-2 text-sm">
            <Timer className="w-4 h-4" />
            <span className="font-mono">{timeRemaining}</span>
          </div>
        </div>
        <CardDescription>
          {poll.totalVotes} votes • {poll.allowMultipleChoice ? 'Multiple choice' : 'Single choice'}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-3">
        {poll.options.map((option) => (
          <div key={option.id} className="space-y-2">
            <div className="flex items-center justify-between">
              <Button
                variant={poll.userVote === option.id ? "default" : "outline"}
                onClick={() => onVote(poll.id, option.id)}
                disabled={!!poll.userVote && !poll.allowMultipleChoice}
                className="flex-1 text-left justify-start"
              >
                {option.text}
              </Button>
              <div className="ml-3 text-sm font-medium">
                {option.percentage.toFixed(0)}%
              </div>
            </div>
            <Progress value={option.percentage} className="h-2" />
          </div>
        ))}
      </CardContent>
    </Card>
  );
}