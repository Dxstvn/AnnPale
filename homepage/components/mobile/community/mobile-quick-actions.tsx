'use client';

import * as React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Heart,
  MessageSquare,
  Share2,
  Bookmark,
  Flag,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  MoreVertical,
  CheckCircle,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';

interface QuickAction {
  id: string;
  label: string;
  icon: React.ElementType;
  color: string;
  action: () => void;
}

interface SwipeableItemProps {
  children: React.ReactNode;
  leftActions?: QuickAction[];
  rightActions?: QuickAction[];
  onSwipe?: (direction: 'left' | 'right', action: QuickAction) => void;
  threshold?: number;
  className?: string;
}

export function SwipeableItem({
  children,
  leftActions = [],
  rightActions = [],
  onSwipe,
  threshold = 100,
  className
}: SwipeableItemProps) {
  const [dragX, setDragX] = React.useState(0);
  const [isDragging, setIsDragging] = React.useState(false);
  const [swipeDirection, setSwipeDirection] = React.useState<'left' | 'right' | null>(null);

  const handleDragStart = () => {
    setIsDragging(true);
  };

  const handleDrag = (event: any, info: PanInfo) => {
    setDragX(info.offset.x);
    
    if (info.offset.x > threshold) {
      setSwipeDirection('right');
    } else if (info.offset.x < -threshold) {
      setSwipeDirection('left');
    } else {
      setSwipeDirection(null);
    }
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);

    if (info.offset.x > threshold && leftActions.length > 0) {
      const action = leftActions[0];
      onSwipe?.('right', action);
      action.action();
    } else if (info.offset.x < -threshold && rightActions.length > 0) {
      const action = rightActions[0];
      onSwipe?.('left', action);
      action.action();
    }

    setDragX(0);
    setSwipeDirection(null);
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Background Actions */}
      <div className="absolute inset-0 flex items-center justify-between px-4">
        {/* Left Actions */}
        {leftActions.length > 0 && (
          <div className={cn(
            "flex items-center gap-2 transition-opacity",
            dragX > 0 ? "opacity-100" : "opacity-0"
          )}>
            {leftActions.map((action) => {
              const Icon = action.icon;
              return (
                <div
                  key={action.id}
                  className={cn(
                    "flex flex-col items-center justify-center p-2 rounded-lg",
                    action.color,
                    swipeDirection === 'right' && "scale-110"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs mt-1">{action.label}</span>
                </div>
              );
            })}
          </div>
        )}

        {/* Right Actions */}
        {rightActions.length > 0 && (
          <div className={cn(
            "flex items-center gap-2 transition-opacity ml-auto",
            dragX < 0 ? "opacity-100" : "opacity-0"
          )}>
            {rightActions.map((action) => {
              const Icon = action.icon;
              return (
                <div
                  key={action.id}
                  className={cn(
                    "flex flex-col items-center justify-center p-2 rounded-lg",
                    action.color,
                    swipeDirection === 'left' && "scale-110"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs mt-1">{action.label}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Draggable Content */}
      <motion.div
        drag="x"
        dragConstraints={{ left: -200, right: 200 }}
        dragElastic={0.2}
        onDragStart={handleDragStart}
        onDrag={handleDrag}
        onDragEnd={handleDragEnd}
        animate={{ x: isDragging ? dragX : 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="relative bg-white"
      >
        {children}
      </motion.div>
    </div>
  );
}

interface LongPressMenuProps {
  children: React.ReactNode;
  actions: QuickAction[];
  onAction?: (action: QuickAction) => void;
  delay?: number;
  className?: string;
}

export function LongPressMenu({
  children,
  actions,
  onAction,
  delay = 500,
  className
}: LongPressMenuProps) {
  const [showMenu, setShowMenu] = React.useState(false);
  const [menuPosition, setMenuPosition] = React.useState({ x: 0, y: 0 });
  const longPressTimer = React.useRef<NodeJS.Timeout | null>(null);
  const elementRef = React.useRef<HTMLDivElement>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    const touch = e.touches[0];
    setMenuPosition({ x: touch.clientX, y: touch.clientY });

    longPressTimer.current = setTimeout(() => {
      setShowMenu(true);
      // Haptic feedback (if available)
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }, delay);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleTouchMove = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleAction = (action: QuickAction) => {
    action.action();
    onAction?.(action);
    setShowMenu(false);
  };

  const closeMenu = () => {
    setShowMenu(false);
  };

  return (
    <>
      <div
        ref={elementRef}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        onTouchMove={handleTouchMove}
        onContextMenu={(e) => {
          e.preventDefault();
          setMenuPosition({ x: e.clientX, y: e.clientY });
          setShowMenu(true);
        }}
        className={className}
      >
        {children}
      </div>

      <AnimatePresence>
        {showMenu && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMenu}
              className="fixed inset-0 bg-black/50 z-50"
            />

            {/* Menu */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              style={{
                position: 'fixed',
                left: menuPosition.x,
                top: menuPosition.y,
                transform: 'translate(-50%, -50%)'
              }}
              className="z-50"
            >
              <Card className="shadow-xl">
                <CardContent className="p-2 min-w-[200px]">
                  {actions.map((action) => {
                    const Icon = action.icon;
                    return (
                      <Button
                        key={action.id}
                        variant="ghost"
                        size="sm"
                        className="w-full justify-start"
                        onClick={() => handleAction(action)}
                      >
                        <Icon className={cn("h-4 w-4 mr-2", action.color)} />
                        {action.label}
                      </Button>
                    );
                  })}
                </CardContent>
              </Card>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

interface QuickReplyProps {
  onReply: (text: string) => void;
  suggestions?: string[];
  className?: string;
}

export function QuickReply({ 
  onReply, 
  suggestions = [],
  className 
}: QuickReplyProps) {
  const [showCustom, setShowCustom] = React.useState(false);
  const [customText, setCustomText] = React.useState('');

  const defaultSuggestions = [
    '👍 Thanks!',
    '❤️ Love it!',
    '🤔 Interesting...',
    '✅ Agreed',
    '📍 Following'
  ];

  const replies = suggestions.length > 0 ? suggestions : defaultSuggestions;

  const handleQuickReply = (text: string) => {
    onReply(text);
  };

  const handleCustomReply = () => {
    if (customText.trim()) {
      onReply(customText);
      setCustomText('');
      setShowCustom(false);
    }
  };

  return (
    <div className={cn("space-y-2", className)}>
      <div className="flex gap-2 overflow-x-auto scrollbar-hide">
        {replies.map((reply, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => handleQuickReply(reply)}
            className="flex-shrink-0"
          >
            {reply}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowCustom(!showCustom)}
          className="flex-shrink-0"
        >
          <Edit className="h-4 w-4 mr-1" />
          Custom
        </Button>
      </div>

      <AnimatePresence>
        {showCustom && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="flex gap-2"
          >
            <input
              type="text"
              value={customText}
              onChange={(e) => setCustomText(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleCustomReply()}
              placeholder="Type your reply..."
              className="flex-1 px-3 py-2 bg-white rounded-lg border focus:outline-none focus:ring-2 focus:ring-purple-500"
              autoFocus
            />
            <Button size="sm" onClick={handleCustomReply}>
              Send
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface FloatingActionButtonProps {
  actions: Array<{
    id: string;
    label: string;
    icon: React.ElementType;
    onClick: () => void;
  }>;
  className?: string;
}

export function FloatingActionButton({ 
  actions,
  className 
}: FloatingActionButtonProps) {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className={cn("fixed bottom-20 right-4 z-40", className)}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-16 right-0 space-y-2"
          >
            {actions.map((action) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex items-center gap-2 justify-end"
                >
                  <Badge variant="secondary" className="text-xs">
                    {action.label}
                  </Badge>
                  <Button
                    size="sm"
                    className="h-12 w-12 rounded-full shadow-lg"
                    onClick={() => {
                      action.onClick();
                      setIsOpen(false);
                    }}
                  >
                    <Icon className="h-5 w-5" />
                  </Button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="lg"
        className="h-14 w-14 rounded-full shadow-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.2 }}
        >
          {isOpen ? <X className="h-6 w-6" /> : <MoreVertical className="h-6 w-6" />}
        </motion.div>
      </Button>
    </div>
  );
}

// Example usage component
export function MobileQuickActionsDemo() {
  const swipeLeftActions: QuickAction[] = [
    {
      id: 'like',
      label: 'Like',
      icon: Heart,
      color: 'text-red-500 bg-red-100',
      action: () => console.log('Liked!')
    },
    {
      id: 'reply',
      label: 'Reply',
      icon: Reply,
      color: 'text-blue-500 bg-blue-100',
      action: () => console.log('Reply!')
    }
  ];

  const swipeRightActions: QuickAction[] = [
    {
      id: 'bookmark',
      label: 'Save',
      icon: Bookmark,
      color: 'text-purple-500 bg-purple-100',
      action: () => console.log('Bookmarked!')
    },
    {
      id: 'share',
      label: 'Share',
      icon: Share2,
      color: 'text-green-500 bg-green-100',
      action: () => console.log('Shared!')
    }
  ];

  const longPressActions: QuickAction[] = [
    { id: 'copy', label: 'Copy', icon: Copy, color: 'text-blue-500', action: () => console.log('Copied!') },
    { id: 'edit', label: 'Edit', icon: Edit, color: 'text-green-500', action: () => console.log('Edit!') },
    { id: 'flag', label: 'Report', icon: Flag, color: 'text-red-500', action: () => console.log('Reported!') },
    { id: 'delete', label: 'Delete', icon: Trash2, color: 'text-red-500', action: () => console.log('Deleted!') }
  ];

  return (
    <div className="p-4 space-y-4">
      <h3 className="font-semibold mb-4">Mobile Quick Actions Demo</h3>

      {/* Swipeable Item */}
      <div>
        <p className="text-sm text-gray-600 mb-2">Swipe left or right:</p>
        <SwipeableItem
          leftActions={swipeLeftActions}
          rightActions={swipeRightActions}
        >
          <Card>
            <CardContent className="p-4">
              <p>Swipe me left or right!</p>
            </CardContent>
          </Card>
        </SwipeableItem>
      </div>

      {/* Long Press Menu */}
      <div>
        <p className="text-sm text-gray-600 mb-2">Long press or right-click:</p>
        <LongPressMenu actions={longPressActions}>
          <Card>
            <CardContent className="p-4">
              <p>Long press me for options!</p>
            </CardContent>
          </Card>
        </LongPressMenu>
      </div>

      {/* Quick Reply */}
      <div>
        <p className="text-sm text-gray-600 mb-2">Quick reply options:</p>
        <QuickReply onReply={(text) => console.log('Reply:', text)} />
      </div>
    </div>
  );
}