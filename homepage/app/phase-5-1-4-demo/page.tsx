'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Users,
  UserCheck,
  BarChart3,
  TrendingUp,
  MessageSquare,
  Award,
  Target,
  Shield,
  Activity,
  Clock,
  CheckCircle,
  Eye,
  Play,
  RotateCcw,
  Lightbulb,
  ChevronRight,
  X,
  Star,
  DollarSign,
  Calendar,
  FileText,
  Gift,
  BookOpen,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

// Import Phase 5.1.4 components
import { CreatorPipelineManagement } from '@/components/admin/creator-pipeline-management';
import { CreatorDirectory } from '@/components/admin/creator-directory';
import { CreatorProfileManager } from '@/components/admin/creator-profile-manager';
import { CreatorPerformanceAnalytics } from '@/components/admin/creator-performance-analytics';
import { CreatorRelationshipManagement } from '@/components/admin/creator-relationship-management';

export default function Phase514Demo() {
  const [activeComponent, setActiveComponent] = React.useState('pipeline');
  const [isComponentVisible, setIsComponentVisible] = React.useState(false);

  const showComponent = () => {
    setIsComponentVisible(true);
  };

  const hideComponent = () => {
    setIsComponentVisible(false);
  };

  const renderComponentDemo = () => {
    switch (activeComponent) {
      case 'pipeline':
        return <CreatorPipelineManagement />;
      case 'directory':
        return <CreatorDirectory />;
      case 'profile-manager':
        return <CreatorProfileManager />;
      case 'analytics':
        return <CreatorPerformanceAnalytics />;
      case 'relationship':
        return <CreatorRelationshipManagement />;
      default:
        return <div>Select a component</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-orange-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Phase 5.1.4 - Creator Management Tools</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Components</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant={activeComponent === 'pipeline' ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => setActiveComponent('pipeline')}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Creator Pipeline
                </Button>
                <Button 
                  variant={activeComponent === 'directory' ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => setActiveComponent('directory')}
                >
                  <UserCheck className="h-4 w-4 mr-2" />
                  Creator Directory
                </Button>
                <Button 
                  variant={activeComponent === 'profile-manager' ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => setActiveComponent('profile-manager')}
                >
                  <Award className="h-4 w-4 mr-2" />
                  Profile Manager
                </Button>
                <Button 
                  variant={activeComponent === 'analytics' ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => setActiveComponent('analytics')}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Performance Analytics
                </Button>
                <Button 
                  variant={activeComponent === 'relationship' ? 'default' : 'outline'}
                  className="w-full justify-start"
                  onClick={() => setActiveComponent('relationship')}
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Relationship Management
                </Button>
              </CardContent>
            </Card>
          </div>
          
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Demo</CardTitle>
              </CardHeader>
              <CardContent>
                <Button onClick={showComponent} className="mb-4">
                  <Play className="h-4 w-4 mr-2" />
                  Show Component
                </Button>
                <div className="text-sm text-gray-600 mb-4">
                  Selected: {activeComponent}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isComponentVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
            onClick={hideComponent}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-y-auto p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{activeComponent}</h2>
                <Button variant="ghost" onClick={hideComponent}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <div className="max-h-[600px] overflow-y-auto">
                {renderComponentDemo()}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
