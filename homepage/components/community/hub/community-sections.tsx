'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MessageSquare, 
  Calendar, 
  Users, 
  Handshake,
  BookOpen,
  Trophy,
  Star,
  ArrowRight,
  Plus,
  Zap,
  Globe,
  Heart,
  Lightbulb,
  Music,
  MapPin,
  Briefcase,
  GraduationCap,
  Camera,
  Coffee,
  Utensils,
  Plane,
  Home,
  Flame,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface CommunitySection {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  stats: {
    members: number;
    postsToday: number;
    totalPosts: number;
  };
  isPopular?: boolean;
  isNew?: boolean;
  subcategories?: string[];
  recentActivity?: string;
  lastActive?: Date;
}

interface CommunitySectionsProps {
  layout?: 'grid' | 'list';
  showStats?: boolean;
  maxSections?: number;
  onSectionClick?: (section: CommunitySection) => void;
  onCreateSection?: () => void;
}

export function CommunitySections({
  layout = 'grid',
  showStats = true,
  maxSections,
  onSectionClick,
  onCreateSection
}: CommunitySectionsProps) {
  // Sample community sections data
  const sections: CommunitySection[] = [
    {
      id: 'discussions',
      name: 'General Discussions',
      description: 'Open conversations about anything and everything related to Haitian culture, life, and experiences.',
      icon: MessageSquare,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      stats: { members: 8924, postsToday: 23, totalPosts: 15624 },
      isPopular: true,
      subcategories: ['Daily Life', 'Current Events', 'Ask the Community'],
      recentActivity: 'Jean Baptiste started a discussion about Miami restaurants',
      lastActive: new Date(Date.now() - 15 * 60 * 1000)
    },
    {
      id: 'creator-spaces',
      name: 'Creator Spaces',
      description: 'Connect with your favorite creators, get behind-the-scenes content, and participate in exclusive discussions.',
      icon: Star,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      stats: { members: 6543, postsToday: 18, totalPosts: 9876 },
      isPopular: true,
      subcategories: ['Behind the Scenes', 'Fan Art', 'Creator Q&A'],
      recentActivity: 'Marie Delacroix shared recording studio photos',
      lastActive: new Date(Date.now() - 45 * 60 * 1000)
    },
    {
      id: 'events',
      name: 'Community Events',
      description: 'Stay updated on virtual and in-person events, meetups, and cultural celebrations.',
      icon: Calendar,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      stats: { members: 4567, postsToday: 8, totalPosts: 3241 },
      subcategories: ['Virtual Events', 'Local Meetups', 'Cultural Celebrations'],
      recentActivity: 'Virtual Konpa Night scheduled for Saturday',
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 'language-learning',
      name: 'Kreyòl & Language Learning',
      description: 'Practice Haitian Creole, share learning resources, and connect with language exchange partners.',
      icon: GraduationCap,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      stats: { members: 3245, postsToday: 12, totalPosts: 5643 },
      isNew: true,
      subcategories: ['Beginner Lessons', 'Practice Partners', 'Resources'],
      recentActivity: 'Marcus shared his favorite Kreyòl learning apps',
      lastActive: new Date(Date.now() - 3 * 60 * 60 * 1000)
    },
    {
      id: 'food-culture',
      name: 'Food & Culture',
      description: 'Share recipes, restaurant recommendations, and celebrate Haitian culinary traditions.',
      icon: Utensils,
      color: 'text-red-600',
      bgColor: 'bg-red-50',
      stats: { members: 5432, postsToday: 15, totalPosts: 7890 },
      isPopular: true,
      subcategories: ['Traditional Recipes', 'Restaurant Reviews', 'Cooking Tips'],
      recentActivity: 'New griot recipe with family secrets shared',
      lastActive: new Date(Date.now() - 1 * 60 * 60 * 1000)
    },
    {
      id: 'music-arts',
      name: 'Music & Arts',
      description: 'Discover new artists, share your creative work, and discuss Haitian music and art.',
      icon: Music,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50',
      stats: { members: 4321, postsToday: 9, totalPosts: 6547 },
      subcategories: ['Konpa Music', 'Visual Arts', 'Creative Showcases'],
      recentActivity: 'New konpa playlist for weekend vibes',
      lastActive: new Date(Date.now() - 4 * 60 * 60 * 1000)
    },
    {
      id: 'business-networking',
      name: 'Business & Networking',
      description: 'Connect with entrepreneurs, share business opportunities, and support Haitian-owned businesses.',
      icon: Briefcase,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      stats: { members: 2876, postsToday: 6, totalPosts: 4321 },
      subcategories: ['Entrepreneurship', 'Job Opportunities', 'Business Support'],
      recentActivity: 'Nadege seeking advice for Haiti startup',
      lastActive: new Date(Date.now() - 12 * 60 * 60 * 1000)
    },
    {
      id: 'travel-tourism',
      name: 'Travel & Tourism',
      description: 'Share travel experiences, get recommendations for visiting Haiti, and connect with fellow travelers.',
      icon: Plane,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      stats: { members: 3456, postsToday: 7, totalPosts: 5234 },
      subcategories: ['Haiti Travel', 'Diaspora Visits', 'Travel Tips'],
      recentActivity: 'Photo gallery from Port-au-Prince trip',
      lastActive: new Date(Date.now() - 6 * 60 * 60 * 1000)
    },
    {
      id: 'support-wellness',
      name: 'Support & Wellness',
      description: 'A safe space for mental health discussions, community support, and wellness resources.',
      icon: Heart,
      color: 'text-rose-600',
      bgColor: 'bg-rose-50',
      stats: { members: 2134, postsToday: 4, totalPosts: 3456 },
      subcategories: ['Mental Health', 'Community Support', 'Wellness Tips'],
      recentActivity: 'Weekly wellness check-in thread',
      lastActive: new Date(Date.now() - 8 * 60 * 60 * 1000)
    },
    {
      id: 'tech-innovation',
      name: 'Tech & Innovation',
      description: 'Discuss technology, share innovations, and connect with tech professionals in the community.',
      icon: Zap,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      stats: { members: 1987, postsToday: 5, totalPosts: 2987 },
      isNew: true,
      subcategories: ['Software Development', 'Tech Careers', 'Innovation'],
      recentActivity: 'AI discussion: Impact on creative industries',
      lastActive: new Date(Date.now() - 10 * 60 * 60 * 1000)
    }
  ];

  const displayedSections = maxSections ? sections.slice(0, maxSections) : sections;

  const formatMemberCount = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

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

  const SectionCard = ({ section, index }: { section: CommunitySection; index: number }) => {
    const Icon = section.icon;
    
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
      >
        <Card 
          className="h-full hover:shadow-lg transition-all cursor-pointer group border-l-4"
          style={{ borderLeftColor: section.color.replace('text-', '').includes('blue') ? '#2563eb' :
            section.color.replace('text-', '').includes('purple') ? '#9333ea' :
            section.color.replace('text-', '').includes('green') ? '#16a34a' :
            section.color.replace('text-', '').includes('orange') ? '#ea580c' :
            section.color.replace('text-', '').includes('red') ? '#dc2626' :
            section.color.replace('text-', '').includes('pink') ? '#ec4899' :
            section.color.replace('text-', '').includes('indigo') ? '#4f46e5' :
            section.color.replace('text-', '').includes('teal') ? '#0d9488' :
            section.color.replace('text-', '').includes('rose') ? '#f43f5e' :
            section.color.replace('text-', '').includes('yellow') ? '#eab308' : '#6b7280'
          }}
          onClick={() => onSectionClick?.(section)}
        >
          <CardHeader className="pb-2">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center", section.bgColor)}>
                  <Icon className={cn("h-5 w-5", section.color)} />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <CardTitle className="text-base font-semibold group-hover:text-purple-600 transition-colors">
                      {section.name}
                    </CardTitle>
                    {section.isPopular && (
                      <Badge variant="secondary" className="text-xs bg-orange-100 text-orange-700">
                        <Flame className="h-3 w-3 mr-1" />
                        Popular
                      </Badge>
                    )}
                    {section.isNew && (
                      <Badge variant="secondary" className="text-xs bg-green-100 text-green-700">
                        <Sparkles className="h-3 w-3 mr-1" />
                        New
                      </Badge>
                    )}
                  </div>
                  {showStats && (
                    <div className="flex items-center gap-4 mt-1 text-xs text-gray-600">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {formatMemberCount(section.stats.members)} members
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageSquare className="h-3 w-3" />
                        {section.stats.postsToday} today
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <ArrowRight className="h-4 w-4 text-gray-400 group-hover:text-purple-600 transition-colors" />
            </div>
          </CardHeader>
          <CardContent className="pt-0">
            <p className="text-sm text-gray-600 mb-3 leading-relaxed">{section.description}</p>
            
            {section.subcategories && section.subcategories.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {section.subcategories.slice(0, 3).map((sub, subIndex) => (
                  <Badge key={subIndex} variant="outline" className="text-xs">
                    {sub}
                  </Badge>
                ))}
                {section.subcategories.length > 3 && (
                  <Badge variant="outline" className="text-xs">
                    +{section.subcategories.length - 3} more
                  </Badge>
                )}
              </div>
            )}

            {section.recentActivity && section.lastActive && (
              <div className="mt-3 pt-3 border-t border-gray-100">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{section.recentActivity}</span>
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {formatTimeAgo(section.lastActive)}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Community Sections</h2>
          <p className="text-gray-600">Explore different areas of our community</p>
        </div>
        {onCreateSection && (
          <Button onClick={onCreateSection} className="bg-purple-600 hover:bg-purple-700">
            <Plus className="h-4 w-4 mr-2" />
            Create Section
          </Button>
        )}
      </div>

      {/* Sections Grid/List */}
      <div className={cn(
        layout === 'grid' 
          ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-4"
      )}>
        {displayedSections.map((section, index) => (
          <SectionCard key={section.id} section={section} index={index} />
        ))}
      </div>

      {/* Load More */}
      {maxSections && sections.length > maxSections && (
        <div className="text-center">
          <Button variant="outline" size="lg">
            View All Sections ({sections.length})
          </Button>
        </div>
      )}
    </div>
  );
}