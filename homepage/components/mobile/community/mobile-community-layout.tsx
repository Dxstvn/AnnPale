'use client';

import * as React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Home,
  Search,
  PlusCircle,
  Bell,
  User,
  MessageSquare,
  Calendar,
  TrendingUp,
  Bookmark,
  Settings,
  ChevronLeft,
  Menu,
  X,
  Wifi,
  WifiOff
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';
import { MobileForumBrowser } from './mobile-forum-browser';
import { MobileThreadCreator } from './mobile-thread-creator';
import { MobileQuickActionsDemo, SwipeableItem, LongPressMenu, QuickReply, FloatingActionButton } from './mobile-quick-actions';
import { MobileOfflineFeatures } from './mobile-offline-features';
import { MobileEngagement } from './mobile-engagement';

interface MobileCommunityLayoutProps {
  userId?: string;
  isAuthenticated?: boolean;
  initialView?: 'browse' | 'create' | 'notifications' | 'profile' | 'offline' | 'engagement';
  onNavigate?: (view: string) => void;
}

export function MobileCommunityLayout({
  userId,
  isAuthenticated = true,
  initialView = 'browse',
  onNavigate
}: MobileCommunityLayoutProps) {
  const [currentView, setCurrentView] = React.useState(initialView);
  const [showMenu, setShowMenu] = React.useState(false);
  const [showCreateModal, setShowCreateModal] = React.useState(false);
  const [isOnline, setIsOnline] = React.useState(true);
  const [notifications, setNotifications] = React.useState(3);

  // Monitor online status
  React.useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    setIsOnline(navigator.onLine);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    setShowMenu(false);
    onNavigate?.(view);
  };

  const handleCreateThread = () => {
    setShowCreateModal(true);
  };

  const menuItems = [
    { id: 'browse', label: 'Browse', icon: Home },
    { id: 'trending', label: 'Trending', icon: TrendingUp },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'saved', label: 'Saved', icon: Bookmark },
    { id: 'engagement', label: 'Engagement', icon: MessageSquare },
    { id: 'offline', label: 'Offline', icon: isOnline ? Wifi : WifiOff },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const fabActions = [
    {
      id: 'create-thread',
      label: 'New Thread',
      icon: MessageSquare,
      onClick: () => handleCreateThread()
    },
    {
      id: 'quick-poll',
      label: 'Quick Poll',
      icon: TrendingUp,
      onClick: () => console.log('Create poll')
    },
    {
      id: 'share-photo',
      label: 'Share Photo',
      icon: Calendar,
      onClick: () => console.log('Share photo')
    }
  ];

  const renderContent = () => {
    switch (currentView) {
      case 'browse':
        return (
          <MobileForumBrowser
            onThreadClick={(thread) => console.log('Thread clicked:', thread)}
            onRefresh={() => console.log('Refreshing...')}
            showQuickActions={true}
          />
        );
      
      case 'offline':
        return (
          <div className="p-4">
            <MobileOfflineFeatures
              onSync={() => console.log('Syncing...')}
              onClearCache={() => console.log('Cache cleared')}
              autoSync={true}
            />
          </div>
        );
      
      case 'engagement':
        return (
          <div className="p-4">
            <MobileEngagement
              userId={userId}
              onLocationRequest={() => console.log('Location requested')}
              onNotificationToggle={(enabled) => console.log('Notifications:', enabled)}
            />
          </div>
        );
      
      case 'quick-actions':
        return (
          <div className="p-4">
            <MobileQuickActionsDemo />
          </div>
        );
      
      default:
        return (
          <div className="p-4">
            <Card className="p-6 text-center">
              <h3 className="font-semibold mb-2">{currentView}</h3>
              <p className="text-gray-600">This view is coming soon</p>
            </Card>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowMenu(!showMenu)}
              className="h-8 w-8 p-0"
            >
              {showMenu ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <div>
              <h1 className="font-bold text-lg">Community</h1>
              {!isOnline && (
                <div className="flex items-center gap-1 text-xs text-red-600">
                  <WifiOff className="h-3 w-3" />
                  Offline Mode
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewChange('search')}
              className="h-8 w-8 p-0"
            >
              <Search className="h-5 w-5" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewChange('notifications')}
              className="h-8 w-8 p-0 relative"
            >
              <Bell className="h-5 w-5" />
              {notifications > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {notifications}
                </span>
              )}
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleViewChange('profile')}
              className="h-8 w-8 p-0"
            >
              <User className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Side Menu */}
      <AnimatePresence>
        {showMenu && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowMenu(false)}
              className="fixed inset-0 bg-black/50 z-40"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-white z-40 shadow-xl"
            >
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h2 className="font-bold text-lg">Menu</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowMenu(false)}
                    className="h-8 w-8 p-0"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              
              <nav className="p-4">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentView === item.id;
                  
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleViewChange(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                        isActive ? "bg-purple-100 text-purple-700" : "hover:bg-gray-100"
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                      {item.id === 'offline' && !isOnline && (
                        <Badge variant="destructive" className="ml-auto text-xs">
                          Active
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </nav>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pb-20">
        {renderContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t z-30">
        <div className="flex items-center justify-around py-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewChange('browse')}
            className={cn(
              "flex flex-col items-center gap-1 h-auto py-2 px-3",
              currentView === 'browse' && "text-purple-600"
            )}
          >
            <Home className="h-5 w-5" />
            <span className="text-xs">Home</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewChange('trending')}
            className={cn(
              "flex flex-col items-center gap-1 h-auto py-2 px-3",
              currentView === 'trending' && "text-purple-600"
            )}
          >
            <TrendingUp className="h-5 w-5" />
            <span className="text-xs">Trending</span>
          </Button>
          
          <Button
            size="sm"
            onClick={handleCreateThread}
            className="h-12 w-12 rounded-full p-0 bg-gradient-to-r from-purple-600 to-pink-600"
          >
            <PlusCircle className="h-6 w-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewChange('events')}
            className={cn(
              "flex flex-col items-center gap-1 h-auto py-2 px-3",
              currentView === 'events' && "text-purple-600"
            )}
          >
            <Calendar className="h-5 w-5" />
            <span className="text-xs">Events</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleViewChange('engagement')}
            className={cn(
              "flex flex-col items-center gap-1 h-auto py-2 px-3",
              currentView === 'engagement' && "text-purple-600"
            )}
          >
            <MessageSquare className="h-5 w-5" />
            <span className="text-xs">Engage</span>
          </Button>
        </div>
      </nav>

      {/* Floating Action Button */}
      {currentView === 'browse' && (
        <FloatingActionButton actions={fabActions} />
      )}

      {/* Create Thread Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-50"
            />
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="fixed inset-0 z-50"
            >
              <MobileThreadCreator
                onSubmit={(draft) => {
                  console.log('Thread submitted:', draft);
                  setShowCreateModal(false);
                }}
                onCancel={() => setShowCreateModal(false)}
                onSaveDraft={(draft) => {
                  console.log('Draft saved:', draft);
                  setShowCreateModal(false);
                }}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}