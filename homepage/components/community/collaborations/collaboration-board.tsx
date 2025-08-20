'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { 
  Users,
  Clock,
  DollarSign,
  MapPin,
  Calendar,
  Star,
  Filter,
  Search,
  Grid,
  List,
  Plus,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  BookmarkPlus,
  Briefcase,
  Palette,
  Camera,
  Music,
  Code,
  Megaphone,
  GraduationCap,
  Lightbulb,
  Handshake,
  Trophy,
  Target,
  Zap,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface CollaborationProject {
  id: string;
  title: string;
  description: string;
  category: 'creative' | 'business' | 'content' | 'events' | 'skills' | 'mentorship';
  type: 'quick-help' | 'short-project' | 'long-project' | 'ongoing' | 'mentorship';
  poster: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
    level: number;
    rating: number;
    completedProjects: number;
  };
  requirements: {
    skills: string[];
    experience: 'beginner' | 'intermediate' | 'advanced';
    commitment: 'low' | 'medium' | 'high';
    teamSize: number;
    location?: 'remote' | 'local' | 'hybrid';
  };
  details: {
    timeline: string;
    budget?: string;
    compensation: 'paid' | 'equity' | 'profit-share' | 'volunteer' | 'skill-exchange';
    startDate: Date;
    estimatedDuration: string;
  };
  status: 'open' | 'in-progress' | 'completed' | 'cancelled';
  applications: number;
  views: number;
  likes: number;
  bookmarks: number;
  postedAt: Date;
  deadline?: Date;
  featured: boolean;
  urgent: boolean;
  tags: string[];
}

interface CollaborationBoardProps {
  view?: 'grid' | 'list';
  filterBy?: string;
  sortBy?: 'newest' | 'popular' | 'deadline' | 'budget';
  category?: 'all' | 'creative' | 'business' | 'content' | 'events' | 'skills' | 'mentorship';
  onProjectClick?: (project: CollaborationProject) => void;
  onCreateProject?: () => void;
  onApplyToProject?: (projectId: string) => void;
  onLikeProject?: (projectId: string) => void;
  onBookmarkProject?: (projectId: string) => void;
  showCreateButton?: boolean;
}

export function CollaborationBoard({
  view = 'grid',
  filterBy = 'all',
  sortBy = 'newest',
  category = 'all',
  onProjectClick,
  onCreateProject,
  onApplyToProject,
  onLikeProject,
  onBookmarkProject,
  showCreateButton = true
}: CollaborationBoardProps) {
  const [activeView, setActiveView] = React.useState(view);
  const [activeCategory, setActiveCategory] = React.useState(category);
  const [activeSort, setActiveSort] = React.useState(sortBy);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [likedProjects, setLikedProjects] = React.useState<Set<string>>(new Set());
  const [bookmarkedProjects, setBookmarkedProjects] = React.useState<Set<string>>(new Set());

  // Sample collaboration projects
  const projects: CollaborationProject[] = [
    {
      id: 'proj1',
      title: 'Haiti Heritage Documentary Series',
      description: 'Looking for videographers, editors, and storytellers to create a 6-part documentary series about Haitian heritage in the diaspora. This is a passion project that aims to preserve our stories.',
      category: 'creative',
      type: 'long-project',
      poster: {
        id: 'user1',
        name: 'Marie Delacroix',
        avatar: '👩🏾‍🎨',
        verified: true,
        level: 12,
        rating: 4.8,
        completedProjects: 15
      },
      requirements: {
        skills: ['Video Production', 'Editing', 'Storytelling', 'Kreyòl'],
        experience: 'intermediate',
        commitment: 'high',
        teamSize: 5,
        location: 'hybrid'
      },
      details: {
        timeline: '6 months',
        budget: '$10,000',
        compensation: 'profit-share',
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        estimatedDuration: '6 months'
      },
      status: 'open',
      applications: 23,
      views: 456,
      likes: 89,
      bookmarks: 34,
      postedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      featured: true,
      urgent: false,
      tags: ['documentary', 'heritage', 'diaspora', 'storytelling']
    },
    {
      id: 'proj2',
      title: 'Haitian Restaurant App Development',
      description: 'Building a mobile app to help people find authentic Haitian restaurants in their area. Need full-stack developers, UI/UX designers, and marketing help.',
      category: 'business',
      type: 'long-project',
      poster: {
        id: 'user2',
        name: 'Marcus Thompson',
        avatar: '👨🏾‍💻',
        verified: true,
        level: 15,
        rating: 4.9,
        completedProjects: 8
      },
      requirements: {
        skills: ['React Native', 'Node.js', 'UI/UX Design', 'Marketing'],
        experience: 'advanced',
        commitment: 'high',
        teamSize: 6,
        location: 'remote'
      },
      details: {
        timeline: '4 months',
        budget: '$25,000',
        compensation: 'equity',
        startDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
        estimatedDuration: '4 months'
      },
      status: 'open',
      applications: 45,
      views: 789,
      likes: 156,
      bookmarks: 67,
      postedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      featured: true,
      urgent: true,
      tags: ['mobile-app', 'restaurants', 'startup', 'equity']
    },
    {
      id: 'proj3',
      title: 'Kreyòl Language Learning Content',
      description: 'Creating engaging content for a Kreyòl language learning platform. Looking for native speakers, content creators, and educational designers.',
      category: 'content',
      type: 'short-project',
      poster: {
        id: 'user3',
        name: 'Lucienne Toussaint',
        avatar: '👩🏾‍🏫',
        verified: false,
        level: 8,
        rating: 4.6,
        completedProjects: 12
      },
      requirements: {
        skills: ['Kreyòl Native', 'Content Creation', 'Educational Design'],
        experience: 'beginner',
        commitment: 'medium',
        teamSize: 4,
        location: 'remote'
      },
      details: {
        timeline: '2 weeks',
        budget: '$2,500',
        compensation: 'paid',
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        estimatedDuration: '2 weeks'
      },
      status: 'open',
      applications: 18,
      views: 234,
      likes: 45,
      bookmarks: 23,
      postedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
      featured: false,
      urgent: false,
      tags: ['education', 'language', 'content', 'kreyol']
    },
    {
      id: 'proj4',
      title: 'Haiti Independence Day Event Planning',
      description: 'Organizing a major Haiti Independence Day celebration in Miami. Need event coordinators, performers, vendors, and volunteers.',
      category: 'events',
      type: 'short-project',
      poster: {
        id: 'user4',
        name: 'Jean Baptiste',
        avatar: '👨🏾‍💼',
        verified: false,
        level: 10,
        rating: 4.7,
        completedProjects: 6
      },
      requirements: {
        skills: ['Event Planning', 'Performance', 'Volunteer Coordination'],
        experience: 'intermediate',
        commitment: 'medium',
        teamSize: 15,
        location: 'local'
      },
      details: {
        timeline: '3 weeks',
        compensation: 'volunteer',
        startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        estimatedDuration: '3 weeks'
      },
      status: 'open',
      applications: 67,
      views: 512,
      likes: 98,
      bookmarks: 45,
      postedAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      featured: false,
      urgent: true,
      tags: ['event', 'independence-day', 'miami', 'celebration']
    },
    {
      id: 'proj5',
      title: 'Graphic Design Mentorship',
      description: 'Experienced graphic designer offering mentorship for beginners. Will cover branding, typography, and design thinking specific to Haitian businesses.',
      category: 'mentorship',
      type: 'mentorship',
      poster: {
        id: 'user5',
        name: 'Sophia Laurent',
        avatar: '👩🏾‍🎨',
        verified: true,
        level: 14,
        rating: 4.9,
        completedProjects: 25
      },
      requirements: {
        skills: ['Beginner Graphic Design', 'Adobe Creative Suite'],
        experience: 'beginner',
        commitment: 'medium',
        teamSize: 3,
        location: 'remote'
      },
      details: {
        timeline: '3 months',
        compensation: 'skill-exchange',
        startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        estimatedDuration: '3 months'
      },
      status: 'open',
      applications: 12,
      views: 189,
      likes: 34,
      bookmarks: 28,
      postedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
      featured: false,
      urgent: false,
      tags: ['mentorship', 'design', 'branding', 'skills-exchange']
    }
  ];

  const categories = [
    { id: 'all', label: 'All Projects', icon: Briefcase },
    { id: 'creative', label: 'Creative', icon: Palette },
    { id: 'business', label: 'Business', icon: Briefcase },
    { id: 'content', label: 'Content', icon: Camera },
    { id: 'events', label: 'Events', icon: Calendar },
    { id: 'skills', label: 'Skills Exchange', icon: Handshake },
    { id: 'mentorship', label: 'Mentorship', icon: GraduationCap }
  ];

  const getTypeIcon = (type: CollaborationProject['type']) => {
    switch (type) {
      case 'quick-help': return <Zap className="h-4 w-4 text-green-600" />;
      case 'short-project': return <Clock className="h-4 w-4 text-blue-600" />;
      case 'long-project': return <Target className="h-4 w-4 text-purple-600" />;
      case 'ongoing': return <Users className="h-4 w-4 text-orange-600" />;
      case 'mentorship': return <GraduationCap className="h-4 w-4 text-pink-600" />;
    }
  };

  const getCompensationBadge = (compensation: CollaborationProject['details']['compensation']) => {
    const variants = {
      'paid': 'bg-green-100 text-green-700 border-green-300',
      'equity': 'bg-blue-100 text-blue-700 border-blue-300',
      'profit-share': 'bg-purple-100 text-purple-700 border-purple-300',
      'volunteer': 'bg-gray-100 text-gray-700 border-gray-300',
      'skill-exchange': 'bg-orange-100 text-orange-700 border-orange-300'
    };
    
    return (
      <Badge variant="outline" className={cn("text-xs", variants[compensation])}>
        {compensation.replace('-', ' ')}
      </Badge>
    );
  };

  const handleLike = (projectId: string) => {
    setLikedProjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
    onLikeProject?.(projectId);
  };

  const handleBookmark = (projectId: string) => {
    setBookmarkedProjects(prev => {
      const newSet = new Set(prev);
      if (newSet.has(projectId)) {
        newSet.delete(projectId);
      } else {
        newSet.add(projectId);
      }
      return newSet;
    });
    onBookmarkProject?.(projectId);
  };

  const filteredProjects = projects.filter(project => {
    if (activeCategory !== 'all' && project.category !== activeCategory) return false;
    if (searchQuery && !project.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !project.description.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !project.poster.name.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    switch (activeSort) {
      case 'newest':
        return b.postedAt.getTime() - a.postedAt.getTime();
      case 'popular':
        return b.views - a.views;
      case 'deadline':
        if (!a.deadline && !b.deadline) return 0;
        if (!a.deadline) return 1;
        if (!b.deadline) return -1;
        return a.deadline.getTime() - b.deadline.getTime();
      case 'budget':
        const aBudget = a.details.budget ? parseInt(a.details.budget.replace(/\D/g, '')) : 0;
        const bBudget = b.details.budget ? parseInt(b.details.budget.replace(/\D/g, '')) : 0;
        return bBudget - aBudget;
      default:
        return 0;
    }
  });

  const ProjectCard = ({ project }: { project: CollaborationProject }) => (
    <Card className={cn(
      "hover:shadow-lg transition-all cursor-pointer",
      project.featured && "ring-2 ring-yellow-500 ring-opacity-20",
      project.urgent && "border-l-4 border-l-red-500"
    )}>
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getTypeIcon(project.type)}
              <h3 
                className="font-bold text-lg hover:text-purple-600 transition-colors line-clamp-2"
                onClick={() => onProjectClick?.(project)}
              >
                {project.title}
              </h3>
              {project.featured && (
                <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
                  Featured
                </Badge>
              )}
              {project.urgent && (
                <Badge variant="secondary" className="bg-red-100 text-red-700">
                  Urgent
                </Badge>
              )}
            </div>
            <p className="text-gray-600 text-sm line-clamp-3 mb-3">
              {project.description}
            </p>
          </div>
        </div>

        {/* Poster Info */}
        <div className="flex items-center gap-3 mb-4">
          <Avatar className="h-8 w-8">
            <AvatarImage src={project.poster.avatar} />
            <AvatarFallback className="text-xs">{project.poster.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-medium text-sm">{project.poster.name}</span>
              {project.poster.verified && (
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  Verified
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-current text-yellow-500" />
                {project.poster.rating}
              </span>
              <span>{project.poster.completedProjects} projects</span>
              <span>Level {project.poster.level}</span>
            </div>
          </div>
        </div>

        {/* Project Details */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <div className="text-gray-500">Timeline</div>
            <div className="font-medium">{project.details.timeline}</div>
          </div>
          <div>
            <div className="text-gray-500">Team Size</div>
            <div className="font-medium">{project.requirements.teamSize} people</div>
          </div>
          <div>
            <div className="text-gray-500">Experience</div>
            <div className="font-medium capitalize">{project.requirements.experience}</div>
          </div>
          <div>
            <div className="text-gray-500">Commitment</div>
            <div className="font-medium capitalize">{project.requirements.commitment}</div>
          </div>
        </div>

        {/* Skills & Budget */}
        <div className="space-y-3 mb-4">
          <div>
            <div className="text-xs text-gray-500 mb-1">Required Skills</div>
            <div className="flex flex-wrap gap-1">
              {project.requirements.skills.slice(0, 3).map((skill) => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {project.requirements.skills.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{project.requirements.skills.length - 3}
                </Badge>
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {getCompensationBadge(project.details.compensation)}
              {project.details.budget && (
                <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                  {project.details.budget}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {project.deadline && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {Math.ceil((project.deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24))}d left
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Engagement Stats */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Eye className="h-4 w-4" />
              {project.views}
            </span>
            <span className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {project.applications} applied
            </span>
            <span className="flex items-center gap-1">
              <Heart className="h-4 w-4" />
              {project.likes}
            </span>
          </div>
          <span className="text-xs">
            {Math.floor((Date.now() - project.postedAt.getTime()) / (1000 * 60 * 60 * 24))}d ago
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => onApplyToProject?.(project.id)}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
          >
            Apply Now
            <ArrowRight className="h-4 w-4 ml-1" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className={cn(likedProjects.has(project.id) && "text-red-600")}
            onClick={() => handleLike(project.id)}
          >
            <Heart className={cn("h-4 w-4", likedProjects.has(project.id) && "fill-current")} />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={cn(bookmarkedProjects.has(project.id) && "text-blue-600")}
            onClick={() => handleBookmark(project.id)}
          >
            <BookmarkPlus className={cn("h-4 w-4", bookmarkedProjects.has(project.id) && "fill-current")} />
          </Button>

          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Collaboration Board</h2>
          <p className="text-gray-600">Connect, create, and build together</p>
        </div>
        
        {showCreateButton && (
          <Button 
            onClick={onCreateProject}
            className="bg-gradient-to-r from-purple-600 to-pink-600"
          >
            <Plus className="h-4 w-4 mr-2" />
            Post Project
          </Button>
        )}
      </div>

      {/* Categories */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={activeCategory === cat.id ? 'default' : 'outline'}
            size="sm"
            className="flex items-center gap-2 whitespace-nowrap"
            onClick={() => setActiveCategory(cat.id)}
          >
            <cat.icon className="h-4 w-4" />
            {cat.label}
          </Button>
        ))}
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={activeSort}
              onChange={(e) => setActiveSort(e.target.value as any)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="newest">Newest First</option>
              <option value="popular">Most Popular</option>
              <option value="deadline">Deadline Soon</option>
              <option value="budget">Highest Budget</option>
            </select>

            <div className="flex items-center gap-2">
              <Button
                variant={activeView === 'grid' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveView('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={activeView === 'list' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveView('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Projects Grid/List */}
      <div className={cn(
        activeView === 'grid' 
          ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
      )}>
        <AnimatePresence>
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <ProjectCard project={project} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || activeCategory !== 'all'
              ? 'Try adjusting your search or filter criteria'
              : 'No collaboration projects match your current filters'
            }
          </p>
          {showCreateButton && (
            <Button onClick={onCreateProject}>
              <Plus className="h-4 w-4 mr-2" />
              Post the First Project
            </Button>
          )}
        </div>
      )}
    </div>
  );
}