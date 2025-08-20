'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { 
  Star,
  MapPin,
  Clock,
  Briefcase,
  GraduationCap,
  Calendar,
  Eye,
  MessageSquare,
  UserPlus,
  ExternalLink,
  Portfolio,
  Award,
  Users,
  Zap,
  CheckCircle,
  Filter,
  Search,
  Grid,
  List,
  Heart,
  Share2,
  Mail,
  Phone,
  Globe,
  Github,
  Linkedin,
  Instagram,
  Camera,
  Video,
  Palette,
  Code,
  Music,
  Megaphone,
  TrendingUp
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface MemberProfile {
  id: string;
  name: string;
  avatar: string;
  title: string;
  bio: string;
  location?: string;
  timezone?: string;
  verified: boolean;
  level: number;
  rating: number;
  responseTime: string;
  availability: 'available' | 'busy' | 'unavailable';
  
  skills: {
    name: string;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    yearsExperience: number;
    endorsed: number;
  }[];
  
  experience: {
    title: string;
    company: string;
    duration: string;
    current: boolean;
    description: string;
  }[];
  
  portfolio: {
    id: string;
    title: string;
    description: string;
    image?: string;
    link?: string;
    category: string;
    likes: number;
    views: number;
  }[];
  
  collaborations: {
    totalProjects: number;
    completedProjects: number;
    successRate: number;
    averageRating: number;
    totalHours: number;
    categories: string[];
  };
  
  reviews: {
    id: string;
    reviewer: {
      name: string;
      avatar: string;
    };
    rating: number;
    comment: string;
    project: string;
    date: Date;
  }[];
  
  preferences: {
    projectTypes: string[];
    workStyle: 'independent' | 'collaborative' | 'flexible';
    communicationStyle: 'formal' | 'casual' | 'flexible';
    rates?: {
      hourly?: number;
      project?: number;
      currency: string;
    };
  };
  
  social: {
    website?: string;
    email?: string;
    linkedin?: string;
    github?: string;
    instagram?: string;
    portfolio?: string;
  };
  
  joinedAt: Date;
  lastActive: Date;
  badges: string[];
  isOnline: boolean;
  compatibilityScore?: number;
}

interface MemberProfilesProps {
  view?: 'grid' | 'list';
  filterBy?: string;
  sortBy?: 'compatibility' | 'rating' | 'activity' | 'experience';
  skillFilter?: string[];
  locationFilter?: string;
  availabilityFilter?: string;
  onProfileClick?: (profile: MemberProfile) => void;
  onContactMember?: (memberId: string) => void;
  onViewPortfolio?: (portfolioId: string) => void;
  showCompatibilityScore?: boolean;
  currentUserId?: string;
}

export function MemberProfiles({
  view = 'grid',
  filterBy = 'all',
  sortBy = 'compatibility',
  skillFilter = [],
  locationFilter,
  availabilityFilter,
  onProfileClick,
  onContactMember,
  onViewPortfolio,
  showCompatibilityScore = false,
  currentUserId
}: MemberProfilesProps) {
  const [activeView, setActiveView] = React.useState(view);
  const [activeSort, setActiveSort] = React.useState(sortBy);
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedSkills, setSelectedSkills] = React.useState<string[]>(skillFilter);
  const [likedProfiles, setLikedProfiles] = React.useState<Set<string>>(new Set());

  // Sample member profiles
  const profiles: MemberProfile[] = [
    {
      id: 'member1',
      name: 'Marie Delacroix',
      avatar: '👩🏾‍🎨',
      title: 'Creative Director & Visual Storyteller',
      bio: 'Passionate about preserving Haitian culture through visual narratives. Specializing in documentary filmmaking, brand design, and cultural preservation projects.',
      location: 'Miami, FL',
      timezone: 'EST',
      verified: true,
      level: 15,
      rating: 4.9,
      responseTime: '< 2 hours',
      availability: 'available',
      
      skills: [
        { name: 'Video Production', level: 'expert', yearsExperience: 8, endorsed: 23 },
        { name: 'Graphic Design', level: 'expert', yearsExperience: 10, endorsed: 31 },
        { name: 'Adobe Creative Suite', level: 'expert', yearsExperience: 10, endorsed: 28 },
        { name: 'Kreyòl (Native)', level: 'expert', yearsExperience: 25, endorsed: 15 },
        { name: 'French', level: 'advanced', yearsExperience: 20, endorsed: 12 }
      ],
      
      experience: [
        {
          title: 'Creative Director',
          company: 'Cultural Heritage Films',
          duration: '2020 - Present',
          current: true,
          description: 'Leading creative direction for documentary projects focused on Caribbean diaspora stories.'
        },
        {
          title: 'Senior Graphic Designer',
          company: 'Miami Design Studio',
          duration: '2017 - 2020',
          current: false,
          description: 'Created visual identities for over 50 local businesses, specializing in multicultural branding.'
        }
      ],
      
      portfolio: [
        {
          id: 'port1',
          title: 'Haiti Heritage Documentary Series',
          description: 'Award-winning 6-part documentary series',
          image: '/portfolio/heritage-doc.jpg',
          category: 'Documentary',
          likes: 234,
          views: 2100
        },
        {
          id: 'port2',
          title: 'Haitian Restaurant Branding',
          description: 'Complete visual identity for 12 restaurants',
          image: '/portfolio/restaurant-brand.jpg',
          category: 'Branding',
          likes: 189,
          views: 1450
        }
      ],
      
      collaborations: {
        totalProjects: 25,
        completedProjects: 23,
        successRate: 92,
        averageRating: 4.8,
        totalHours: 1250,
        categories: ['Creative', 'Content', 'Business']
      },
      
      reviews: [
        {
          id: 'rev1',
          reviewer: { name: 'Marcus Thompson', avatar: '👨🏾‍💻' },
          rating: 5,
          comment: 'Marie exceeded all expectations. Her creative vision and cultural sensitivity made our project truly special.',
          project: 'Heritage Video Campaign',
          date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
        }
      ],
      
      preferences: {
        projectTypes: ['Creative Projects', 'Documentary', 'Cultural Heritage'],
        workStyle: 'collaborative',
        communicationStyle: 'flexible',
        rates: { hourly: 75, currency: 'USD' }
      },
      
      social: {
        website: 'mariedelacroix.com',
        email: 'marie@culturalfilms.com',
        linkedin: 'marie-delacroix',
        instagram: '@mariedelacroix_creative'
      },
      
      joinedAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000),
      lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
      badges: ['Top Rated', 'Cultural Expert', 'Project Leader'],
      isOnline: true,
      compatibilityScore: 95
    },
    {
      id: 'member2',
      name: 'Marcus Thompson',
      avatar: '👨🏾‍💻',
      title: 'Full-Stack Developer & Tech Entrepreneur',
      bio: 'Building technology solutions for the Haitian community. Experienced in mobile apps, web platforms, and e-commerce solutions.',
      location: 'New York, NY',
      timezone: 'EST',
      verified: true,
      level: 18,
      rating: 4.8,
      responseTime: '< 1 hour',
      availability: 'busy',
      
      skills: [
        { name: 'React/Next.js', level: 'expert', yearsExperience: 6, endorsed: 45 },
        { name: 'Node.js', level: 'expert', yearsExperience: 7, endorsed: 38 },
        { name: 'Mobile Development', level: 'advanced', yearsExperience: 5, endorsed: 29 },
        { name: 'UI/UX Design', level: 'intermediate', yearsExperience: 4, endorsed: 22 },
        { name: 'Business Strategy', level: 'advanced', yearsExperience: 8, endorsed: 31 }
      ],
      
      experience: [
        {
          title: 'CTO & Co-Founder',
          company: 'Caribbean Connect App',
          duration: '2021 - Present',
          current: true,
          description: 'Leading technical development of a social platform connecting Caribbean diaspora worldwide.'
        }
      ],
      
      portfolio: [
        {
          id: 'port3',
          title: 'Haitian Restaurant Finder App',
          description: 'Mobile app with 10K+ downloads',
          link: 'https://app-store-link.com',
          category: 'Mobile App',
          likes: 456,
          views: 3200
        }
      ],
      
      collaborations: {
        totalProjects: 18,
        completedProjects: 17,
        successRate: 94,
        averageRating: 4.9,
        totalHours: 890,
        categories: ['Business', 'Technical', 'Strategy']
      },
      
      reviews: [],
      
      preferences: {
        projectTypes: ['Tech Startups', 'Mobile Apps', 'E-commerce'],
        workStyle: 'independent',
        communicationStyle: 'formal',
        rates: { hourly: 125, currency: 'USD' }
      },
      
      social: {
        website: 'marcustech.dev',
        linkedin: 'marcus-thompson-dev',
        github: 'marcusthompson'
      },
      
      joinedAt: new Date(Date.now() - 240 * 24 * 60 * 60 * 1000),
      lastActive: new Date(Date.now() - 30 * 60 * 1000),
      badges: ['Tech Expert', 'Startup Founder', 'Mentor'],
      isOnline: true,
      compatibilityScore: 87
    },
    {
      id: 'member3',
      name: 'Sophia Laurent',
      avatar: '👩🏾‍🏫',
      title: 'Content Creator & Language Educator',
      bio: 'Creating educational content to preserve and teach Kreyòl. Specializing in language learning materials and cultural education.',
      location: 'Boston, MA',
      timezone: 'EST',
      verified: false,
      level: 12,
      rating: 4.7,
      responseTime: '< 4 hours',
      availability: 'available',
      
      skills: [
        { name: 'Content Creation', level: 'expert', yearsExperience: 6, endorsed: 34 },
        { name: 'Educational Design', level: 'advanced', yearsExperience: 5, endorsed: 28 },
        { name: 'Kreyòl (Native)', level: 'expert', yearsExperience: 28, endorsed: 41 },
        { name: 'Video Editing', level: 'intermediate', yearsExperience: 3, endorsed: 19 }
      ],
      
      experience: [
        {
          title: 'Language Content Creator',
          company: 'LearnKreyol.com',
          duration: '2019 - Present',
          current: true,
          description: 'Developing comprehensive Kreyòl learning curriculum and video content.'
        }
      ],
      
      portfolio: [
        {
          id: 'port4',
          title: 'Kreyòl Learning Series',
          description: '50+ educational videos with 100K+ views',
          category: 'Education',
          likes: 298,
          views: 5600
        }
      ],
      
      collaborations: {
        totalProjects: 14,
        completedProjects: 13,
        successRate: 93,
        averageRating: 4.6,
        totalHours: 567,
        categories: ['Content', 'Education', 'Cultural']
      },
      
      reviews: [],
      
      preferences: {
        projectTypes: ['Educational Content', 'Language Projects', 'Cultural Preservation'],
        workStyle: 'flexible',
        communicationStyle: 'casual',
        rates: { hourly: 45, currency: 'USD' }
      },
      
      social: {
        website: 'sophialaurent.edu',
        instagram: '@learn_kreyol'
      },
      
      joinedAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000),
      lastActive: new Date(Date.now() - 6 * 60 * 60 * 1000),
      badges: ['Language Expert', 'Educator', 'Content Creator'],
      isOnline: false,
      compatibilityScore: 78
    }
  ];

  const getSkillIcon = (skillName: string) => {
    const skill = skillName.toLowerCase();
    if (skill.includes('video') || skill.includes('film')) return Video;
    if (skill.includes('design') || skill.includes('graphic')) return Palette;
    if (skill.includes('code') || skill.includes('dev')) return Code;
    if (skill.includes('music') || skill.includes('audio')) return Music;
    if (skill.includes('photo') || skill.includes('camera')) return Camera;
    if (skill.includes('market') || skill.includes('promo')) return Megaphone;
    return Star;
  };

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'beginner': return 'bg-gray-100 text-gray-700';
      case 'intermediate': return 'bg-blue-100 text-blue-700';
      case 'advanced': return 'bg-purple-100 text-purple-700';
      case 'expert': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'available': return 'bg-green-100 text-green-700 border-green-300';
      case 'busy': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'unavailable': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const handleLike = (profileId: string) => {
    setLikedProfiles(prev => {
      const newSet = new Set(prev);
      if (newSet.has(profileId)) {
        newSet.delete(profileId);
      } else {
        newSet.add(profileId);
      }
      return newSet;
    });
  };

  const filteredProfiles = profiles.filter(profile => {
    if (searchQuery && !profile.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !profile.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !profile.bio.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    if (selectedSkills.length > 0 && !selectedSkills.some(skill => 
      profile.skills.some(s => s.name.toLowerCase().includes(skill.toLowerCase())))) {
      return false;
    }
    if (availabilityFilter && profile.availability !== availabilityFilter) return false;
    if (locationFilter && profile.location && !profile.location.toLowerCase().includes(locationFilter.toLowerCase())) {
      return false;
    }
    return true;
  }).sort((a, b) => {
    switch (activeSort) {
      case 'compatibility':
        return (b.compatibilityScore || 0) - (a.compatibilityScore || 0);
      case 'rating':
        return b.rating - a.rating;
      case 'activity':
        return b.lastActive.getTime() - a.lastActive.getTime();
      case 'experience':
        return b.collaborations.totalProjects - a.collaborations.totalProjects;
      default:
        return 0;
    }
  });

  const ProfileCard = ({ profile }: { profile: MemberProfile }) => (
    <Card className="hover:shadow-lg transition-all cursor-pointer">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <div className="relative">
            <Avatar className="h-16 w-16">
              <AvatarImage src={profile.avatar} />
              <AvatarFallback className="text-lg">{profile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            {profile.isOnline && (
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white"></div>
            )}
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 
                className="font-bold text-lg hover:text-purple-600 transition-colors truncate"
                onClick={() => onProfileClick?.(profile)}
              >
                {profile.name}
              </h3>
              {profile.verified && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
            </div>
            
            <p className="text-purple-600 font-medium text-sm mb-2">{profile.title}</p>
            
            <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-current text-yellow-500" />
                {profile.rating} ({profile.collaborations.totalProjects} projects)
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {profile.responseTime}
              </span>
              {profile.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {profile.location}
                </span>
              )}
            </div>
            
            <Badge variant="outline" className={cn("text-xs", getAvailabilityColor(profile.availability))}>
              {profile.availability}
            </Badge>
          </div>
          
          {showCompatibilityScore && profile.compatibilityScore && (
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{profile.compatibilityScore}%</div>
              <div className="text-xs text-gray-500">Match</div>
            </div>
          )}
        </div>

        {/* Bio */}
        <p className="text-gray-600 text-sm line-clamp-3 mb-4">{profile.bio}</p>

        {/* Top Skills */}
        <div className="mb-4">
          <div className="text-xs text-gray-500 mb-2">Top Skills</div>
          <div className="flex flex-wrap gap-1">
            {profile.skills.slice(0, 4).map((skill, index) => (
              <Badge 
                key={index} 
                variant="outline" 
                className={cn("text-xs", getSkillLevelColor(skill.level))}
              >
                {skill.name}
              </Badge>
            ))}
            {profile.skills.length > 4 && (
              <Badge variant="outline" className="text-xs">
                +{profile.skills.length - 4}
              </Badge>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-4 text-center text-sm">
          <div>
            <div className="font-bold text-green-600">{profile.collaborations.successRate}%</div>
            <div className="text-xs text-gray-500">Success Rate</div>
          </div>
          <div>
            <div className="font-bold text-blue-600">{profile.collaborations.totalHours}</div>
            <div className="text-xs text-gray-500">Total Hours</div>
          </div>
          <div>
            <div className="font-bold text-purple-600">Level {profile.level}</div>
            <div className="text-xs text-gray-500">Experience</div>
          </div>
        </div>

        {/* Portfolio Preview */}
        {profile.portfolio.length > 0 && (
          <div className="mb-4">
            <div className="text-xs text-gray-500 mb-2">Recent Work</div>
            <div className="grid grid-cols-2 gap-2">
              {profile.portfolio.slice(0, 2).map((item) => (
                <div 
                  key={item.id}
                  className="p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100 transition-colors"
                  onClick={() => onViewPortfolio?.(item.id)}
                >
                  <div className="font-medium text-xs line-clamp-1">{item.title}</div>
                  <div className="text-xs text-gray-500 flex items-center gap-2">
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {item.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <Heart className="h-3 w-3" />
                      {item.likes}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Badges */}
        <div className="flex flex-wrap gap-1 mb-4">
          {profile.badges.slice(0, 3).map((badge, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              <Award className="h-3 w-3 mr-1" />
              {badge}
            </Badge>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => onContactMember?.(profile.id)}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
            size="sm"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Contact
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            className={cn(likedProfiles.has(profile.id) && "text-red-600")}
            onClick={() => handleLike(profile.id)}
          >
            <Heart className={cn("h-4 w-4", likedProfiles.has(profile.id) && "fill-current")} />
          </Button>

          <Button variant="ghost" size="sm">
            <Share2 className="h-4 w-4" />
          </Button>

          <Button variant="ghost" size="sm" onClick={() => onProfileClick?.(profile)}>
            <ExternalLink className="h-4 w-4" />
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
          <h2 className="text-3xl font-bold">Community Members</h2>
          <p className="text-gray-600">Find collaborators with the skills you need</p>
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, skills, or expertise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>

            <select
              value={availabilityFilter || ''}
              onChange={(e) => setActiveSort(e.target.value as any)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="">All Availability</option>
              <option value="available">Available</option>
              <option value="busy">Busy</option>
              <option value="unavailable">Unavailable</option>
            </select>

            <select
              value={activeSort}
              onChange={(e) => setActiveSort(e.target.value as any)}
              className="px-3 py-2 border rounded-md text-sm"
            >
              <option value="compatibility">Best Match</option>
              <option value="rating">Highest Rated</option>
              <option value="activity">Most Active</option>
              <option value="experience">Most Experienced</option>
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
          Showing {filteredProfiles.length} member{filteredProfiles.length !== 1 ? 's' : ''}
        </p>
        {showCompatibilityScore && (
          <p className="text-sm text-purple-600 font-medium">
            Compatibility scores based on your profile and project preferences
          </p>
        )}
      </div>

      {/* Members Grid/List */}
      <div className={cn(
        activeView === 'grid' 
          ? "grid md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
      )}>
        <AnimatePresence>
          {filteredProfiles.map((profile, index) => (
            <motion.div
              key={profile.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
            >
              <ProfileCard profile={profile} />
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty state */}
      {filteredProfiles.length === 0 && (
        <div className="text-center py-12">
          <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No members found</h3>
          <p className="text-gray-600">
            {searchQuery || selectedSkills.length > 0
              ? 'Try adjusting your search or filter criteria'
              : 'No community members match your current filters'
            }
          </p>
        </div>
      )}
    </div>
  );
}