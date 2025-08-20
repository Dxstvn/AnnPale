'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  RefreshCw,
  Copy,
  Scissors,
  Layers,
  Shuffle,
  Package,
  Video,
  Image,
  MessageSquare,
  Music,
  FileText,
  Sparkles,
  Wand2,
  Settings,
  Download,
  Upload,
  Play,
  Eye,
  Calendar,
  Clock,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Grid3x3,
  List
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';
import { Progress } from '@/components/ui/progress';

interface RecyclableContent {
  id: string;
  title: string;
  originalType: 'video' | 'post' | 'stream' | 'image';
  publishDate: Date;
  performance: {
    views: number;
    engagement: number;
    revenue: number;
  };
  recyclingOptions: RecyclingOption[];
  lastRecycled?: Date;
  recycleCount: number;
}

interface RecyclingOption {
  id: string;
  type: 'clip' | 'highlight' | 'compilation' | 'remix' | 'template' | 'series';
  title: string;
  description: string;
  estimatedTime: string;
  potentialReach: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface ContentRecyclingToolsProps {
  onRecycle?: (contentId: string, option: RecyclingOption) => void;
  onBatchRecycle?: (contentIds: string[], option: RecyclingOption) => void;
}

export function ContentRecyclingTools({
  onRecycle,
  onBatchRecycle
}: ContentRecyclingToolsProps) {
  const [selectedContent, setSelectedContent] = React.useState<string[]>([]);
  const [activeView, setActiveView] = React.useState<'grid' | 'list'>('grid');
  const [selectedRecyclingType, setSelectedRecyclingType] = React.useState<string | null>(null);

  // Sample recyclable content
  const recyclableContent: RecyclableContent[] = [
    {
      id: '1',
      title: 'Epic Behind-the-Scenes Documentary',
      originalType: 'video',
      publishDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      performance: {
        views: 45000,
        engagement: 82,
        revenue: 2500
      },
      recyclingOptions: [
        {
          id: 'clips',
          type: 'clip',
          title: 'Create 5-10 Short Clips',
          description: 'Extract the best moments for social media',
          estimatedTime: '30 min',
          potentialReach: 25000,
          difficulty: 'easy'
        },
        {
          id: 'highlight',
          type: 'highlight',
          title: 'Highlight Reel',
          description: 'Compile best moments into 3-minute video',
          estimatedTime: '1 hour',
          potentialReach: 15000,
          difficulty: 'medium'
        },
        {
          id: 'series',
          type: 'series',
          title: 'Episode Series',
          description: 'Split into 3-part series with cliffhangers',
          estimatedTime: '2 hours',
          potentialReach: 35000,
          difficulty: 'hard'
        }
      ],
      recycleCount: 2,
      lastRecycled: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000)
    },
    {
      id: '2',
      title: 'Q&A Live Stream Session',
      originalType: 'stream',
      publishDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      performance: {
        views: 12000,
        engagement: 75,
        revenue: 800
      },
      recyclingOptions: [
        {
          id: 'qa-clips',
          type: 'clip',
          title: 'Q&A Highlights',
          description: 'Extract individual questions as shorts',
          estimatedTime: '45 min',
          potentialReach: 8000,
          difficulty: 'easy'
        },
        {
          id: 'compilation',
          type: 'compilation',
          title: 'Best Of Compilation',
          description: 'Compile funniest/best answers',
          estimatedTime: '1.5 hours',
          potentialReach: 10000,
          difficulty: 'medium'
        }
      ],
      recycleCount: 0
    },
    {
      id: '3',
      title: 'Photo Shoot Collection',
      originalType: 'image',
      publishDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
      performance: {
        views: 28000,
        engagement: 68,
        revenue: 1200
      },
      recyclingOptions: [
        {
          id: 'slideshow',
          type: 'compilation',
          title: 'Video Slideshow',
          description: 'Create video with music and transitions',
          estimatedTime: '20 min',
          potentialReach: 12000,
          difficulty: 'easy'
        },
        {
          id: 'template',
          type: 'template',
          title: 'Social Media Templates',
          description: 'Create Instagram/TikTok templates',
          estimatedTime: '40 min',
          potentialReach: 18000,
          difficulty: 'medium'
        },
        {
          id: 'remix',
          type: 'remix',
          title: 'Artistic Remix',
          description: 'Create artistic edits with effects',
          estimatedTime: '1 hour',
          potentialReach: 15000,
          difficulty: 'hard'
        }
      ],
      recycleCount: 1,
      lastRecycled: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
    }
  ];

  // Recycling strategies
  const recyclingStrategies = [
    {
      id: 'clips',
      name: 'Clip Creation',
      icon: Scissors,
      description: 'Extract short clips for social media',
      bestFor: ['video', 'stream'],
      tools: ['Auto-clip AI', 'Highlight detector', 'Caption generator']
    },
    {
      id: 'compilation',
      name: 'Compilations',
      icon: Layers,
      description: 'Combine multiple pieces into one',
      bestFor: ['video', 'image', 'post'],
      tools: ['Smart editor', 'Transition effects', 'Music sync']
    },
    {
      id: 'remix',
      name: 'Creative Remix',
      icon: Shuffle,
      description: 'Transform content with new style',
      bestFor: ['video', 'image', 'music'],
      tools: ['Effects library', 'Filter presets', 'Audio remixer']
    },
    {
      id: 'template',
      name: 'Templates',
      icon: Package,
      description: 'Create reusable content templates',
      bestFor: ['image', 'post', 'video'],
      tools: ['Template builder', 'Brand kit', 'Quick customize']
    }
  ];

  // Calculate recycling potential
  const calculateRecyclingPotential = (content: RecyclableContent) => {
    const ageInDays = Math.floor((Date.now() - content.publishDate.getTime()) / (1000 * 60 * 60 * 24));
    const performanceScore = (content.performance.engagement / 100) * 0.4 + 
                            (Math.min(content.performance.views / 50000, 1)) * 0.4 +
                            (Math.min(content.performance.revenue / 3000, 1)) * 0.2;
    
    const ageFactor = ageInDays > 30 ? 1 : ageInDays / 30;
    const recyclingFactor = content.recycleCount > 0 ? 0.8 : 1;
    
    return Math.round(performanceScore * ageFactor * recyclingFactor * 100);
  };

  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'video': return Video;
      case 'stream': return Radio;
      case 'image': return Image;
      case 'post': return MessageSquare;
      default: return FileText;
    }
  };

  // Get difficulty color
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-700';
      case 'medium': return 'bg-yellow-100 text-yellow-700';
      case 'hard': return 'bg-red-100 text-red-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  // Toggle content selection
  const toggleContentSelection = (contentId: string) => {
    setSelectedContent(prev => 
      prev.includes(contentId)
        ? prev.filter(id => id !== contentId)
        : [...prev, contentId]
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Content Recycling Tools</CardTitle>
              <p className="text-sm text-gray-600 mt-1">Transform existing content into new formats</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <Button
                  variant={activeView === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveView('grid')}
                >
                  <Grid3x3 className="h-4 w-4" />
                </Button>
                <Button
                  variant={activeView === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setActiveView('list')}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              
              {selectedContent.length > 0 && (
                <Button variant="outline">
                  <Package className="h-4 w-4 mr-2" />
                  Batch Process ({selectedContent.length})
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Recycling Strategies */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {recyclingStrategies.map((strategy) => {
          const Icon = strategy.icon;
          const isSelected = selectedRecyclingType === strategy.id;
          
          return (
            <motion.div
              key={strategy.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                className={cn(
                  "cursor-pointer transition-all",
                  isSelected ? "border-purple-500 bg-purple-50" : "hover:border-purple-300"
                )}
                onClick={() => setSelectedRecyclingType(isSelected ? null : strategy.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={cn(
                      "w-10 h-10 rounded-lg flex items-center justify-center",
                      isSelected ? "bg-purple-600" : "bg-purple-100"
                    )}>
                      <Icon className={cn(
                        "h-5 w-5",
                        isSelected ? "text-white" : "text-purple-600"
                      )} />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{strategy.name}</h4>
                      <p className="text-xs text-gray-600 mt-1">{strategy.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Recyclable Content */}
      <Card>
        <CardHeader>
          <CardTitle>Content Library</CardTitle>
        </CardHeader>
        <CardContent>
          {activeView === 'grid' ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recyclableContent.map((content) => {
                const Icon = getTypeIcon(content.originalType);
                const potential = calculateRecyclingPotential(content);
                const isSelected = selectedContent.includes(content.id);
                
                return (
                  <motion.div
                    key={content.id}
                    whileHover={{ y: -4 }}
                    className={cn(
                      "p-4 bg-white border rounded-lg transition-all cursor-pointer",
                      isSelected ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-300"
                    )}
                    onClick={() => toggleContentSelection(content.id)}
                  >
                    {/* Content Header */}
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <Icon className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h4 className="font-medium text-sm line-clamp-1">{content.title}</h4>
                          <p className="text-xs text-gray-500">
                            {content.publishDate.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {isSelected && (
                        <CheckCircle className="h-5 w-5 text-purple-600" />
                      )}
                    </div>
                    
                    {/* Performance Stats */}
                    <div className="grid grid-cols-3 gap-2 mb-3 text-xs">
                      <div>
                        <p className="text-gray-600">Views</p>
                        <p className="font-semibold">{(content.performance.views / 1000).toFixed(1)}k</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Engagement</p>
                        <p className="font-semibold">{content.performance.engagement}%</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Revenue</p>
                        <p className="font-semibold">${content.performance.revenue}</p>
                      </div>
                    </div>
                    
                    {/* Recycling Potential */}
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-600">Recycling Potential</span>
                        <span className="text-xs font-semibold">{potential}%</span>
                      </div>
                      <Progress value={potential} className="h-2" />
                    </div>
                    
                    {/* Recycling Options */}
                    <div className="space-y-2">
                      <p className="text-xs font-medium text-gray-700">Quick Actions:</p>
                      {content.recyclingOptions.slice(0, 2).map((option) => (
                        <Button
                          key={option.id}
                          variant="outline"
                          size="sm"
                          className="w-full justify-start text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            onRecycle?.(content.id, option);
                          }}
                        >
                          <Sparkles className="h-3 w-3 mr-2" />
                          {option.title}
                          <Badge className={cn("ml-auto", getDifficultyColor(option.difficulty))}>
                            {option.estimatedTime}
                          </Badge>
                        </Button>
                      ))}
                    </div>
                    
                    {/* Recycle Status */}
                    {content.recycleCount > 0 && (
                      <div className="mt-3 pt-3 border-t">
                        <div className="flex items-center justify-between text-xs">
                          <span className="text-gray-600">
                            <RefreshCw className="h-3 w-3 inline mr-1" />
                            Recycled {content.recycleCount}x
                          </span>
                          {content.lastRecycled && (
                            <span className="text-gray-500">
                              Last: {Math.floor((Date.now() - content.lastRecycled.getTime()) / (1000 * 60 * 60 * 24))}d ago
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {recyclableContent.map((content) => {
                const Icon = getTypeIcon(content.originalType);
                const potential = calculateRecyclingPotential(content);
                const isSelected = selectedContent.includes(content.id);
                
                return (
                  <motion.div
                    key={content.id}
                    whileHover={{ x: 4 }}
                    className={cn(
                      "flex items-center justify-between p-4 bg-white border rounded-lg transition-all cursor-pointer",
                      isSelected ? "border-purple-500 bg-purple-50" : "border-gray-200 hover:border-purple-300"
                    )}
                    onClick={() => toggleContentSelection(content.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                        <Icon className="h-6 w-6 text-purple-600" />
                      </div>
                      
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{content.title}</h4>
                          {isSelected && (
                            <CheckCircle className="h-4 w-4 text-purple-600" />
                          )}
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>
                            <Calendar className="h-3 w-3 inline mr-1" />
                            {content.publishDate.toLocaleDateString()}
                          </span>
                          <span>
                            <Eye className="h-3 w-3 inline mr-1" />
                            {(content.performance.views / 1000).toFixed(1)}k views
                          </span>
                          <span>
                            <TrendingUp className="h-3 w-3 inline mr-1" />
                            {content.performance.engagement}% engagement
                          </span>
                          {content.recycleCount > 0 && (
                            <Badge variant="secondary" className="text-xs">
                              <RefreshCw className="h-3 w-3 mr-1" />
                              Recycled {content.recycleCount}x
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <div className="text-right mr-4">
                        <p className="text-xs text-gray-600">Potential</p>
                        <p className="text-lg font-bold text-purple-600">{potential}%</p>
                      </div>
                      
                      {content.recyclingOptions.map((option, idx) => (
                        idx === 0 && (
                          <Button
                            key={option.id}
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onRecycle?.(content.id, option);
                            }}
                          >
                            <Wand2 className="h-4 w-4 mr-2" />
                            {option.title}
                          </Button>
                        )
                      ))}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* AI Suggestions */}
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5" />
            AI-Powered Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 bg-white rounded-lg border border-purple-200">
              <h4 className="font-medium text-sm mb-2">Trending Format</h4>
              <p className="text-xs text-gray-600 mb-3">
                Short-form vertical videos are trending. Consider creating 60-second clips from your long-form content.
              </p>
              <Button size="sm" className="w-full">
                Create Shorts
              </Button>
            </div>
            
            <div className="p-4 bg-white rounded-lg border border-purple-200">
              <h4 className="font-medium text-sm mb-2">Compilation Opportunity</h4>
              <p className="text-xs text-gray-600 mb-3">
                You have 5 similar videos that could make a great "Best Of" compilation.
              </p>
              <Button size="sm" className="w-full">
                Build Compilation
              </Button>
            </div>
            
            <div className="p-4 bg-white rounded-lg border border-purple-200">
              <h4 className="font-medium text-sm mb-2">Template Creation</h4>
              <p className="text-xs text-gray-600 mb-3">
                Your photo sets perform well. Create templates for consistent branding.
              </p>
              <Button size="sm" className="w-full">
                Design Templates
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Add missing import
import { Radio } from 'lucide-react';