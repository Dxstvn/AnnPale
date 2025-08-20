'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Target,
  Users,
  Star,
  Clock,
  MapPin,
  Zap,
  Heart,
  MessageSquare,
  TrendingUp,
  Award,
  CheckCircle,
  X,
  Filter,
  Sliders,
  RefreshCw,
  Sparkles,
  Brain,
  Calendar,
  DollarSign,
  Globe,
  User,
  Briefcase,
  GraduationCap,
  Search,
  ArrowRight,
  ThumbsUp,
  ThumbsDown,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface CompatibilityFactors {
  skillMatch: number;
  experienceAlignment: number;
  availabilitySync: number;
  locationProximity: number;
  workStyleCompatibility: number;
  communicationStyleMatch: number;
  projectTypeAlignment: number;
  budgetCompatibility: number;
}

interface Match {
  id: string;
  member: {
    id: string;
    name: string;
    avatar: string;
    title: string;
    verified: boolean;
    rating: number;
    responseTime: string;
    location?: string;
    timezone?: string;
    level: number;
  };
  project?: {
    id: string;
    title: string;
    category: string;
    type: string;
    budget?: string;
    timeline: string;
  };
  compatibilityScore: number;
  factors: CompatibilityFactors;
  matchType: 'skill-based' | 'project-specific' | 'mutual-interest' | 'recommendation';
  confidence: 'high' | 'medium' | 'low';
  reasons: string[];
  potentialIssues?: string[];
  lastInteraction?: Date;
  mutualConnections: number;
  collaborationHistory?: {
    projectsTogether: number;
    averageRating: number;
    lastProject: Date;
  };
}

interface MatchingSystemProps {
  userId?: string;
  projectId?: string;
  matchType?: 'members' | 'projects' | 'opportunities';
  showFilters?: boolean;
  onContactMember?: (memberId: string) => void;
  onViewProject?: (projectId: string) => void;
  onUpdatePreferences?: () => void;
  onProvideFeedback?: (matchId: string, helpful: boolean) => void;
}

export function MatchingSystem({
  userId,
  projectId,
  matchType = 'members',
  showFilters = true,
  onContactMember,
  onViewProject,
  onUpdatePreferences,
  onProvideFeedback
}: MatchingSystemProps) {
  const [matches, setMatches] = React.useState<Match[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedFactors, setSelectedFactors] = React.useState<string[]>(['skillMatch', 'availabilitySync']);
  const [minCompatibility, setMinCompatibility] = React.useState(70);
  const [showAdvancedFilters, setShowAdvancedFilters] = React.useState(false);
  const [feedbackGiven, setFeedbackGiven] = React.useState<Set<string>>(new Set());

  // Sample matches data
  const sampleMatches: Match[] = [
    {
      id: 'match1',
      member: {
        id: 'member1',
        name: 'Marie Delacroix',
        avatar: '👩🏾‍🎨',
        title: 'Creative Director & Visual Storyteller',
        verified: true,
        rating: 4.9,
        responseTime: '< 2 hours',
        location: 'Miami, FL',
        timezone: 'EST',
        level: 15
      },
      compatibilityScore: 95,
      factors: {
        skillMatch: 98,
        experienceAlignment: 92,
        availabilitySync: 85,
        locationProximity: 100,
        workStyleCompatibility: 88,
        communicationStyleMatch: 95,
        projectTypeAlignment: 100,
        budgetCompatibility: 90
      },
      matchType: 'skill-based',
      confidence: 'high',
      reasons: [
        'Perfect match for video production skills',
        'Same timezone and location',
        'Excellent track record in cultural projects',
        'Available for immediate start'
      ],
      mutualConnections: 3,
      collaborationHistory: {
        projectsTogether: 2,
        averageRating: 4.8,
        lastProject: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
      }
    },
    {
      id: 'match2',
      member: {
        id: 'member2',
        name: 'Marcus Thompson',
        avatar: '👨🏾‍💻',
        title: 'Full-Stack Developer & Tech Entrepreneur',
        verified: true,
        rating: 4.8,
        responseTime: '< 1 hour',
        location: 'New York, NY',
        timezone: 'EST',
        level: 18
      },
      compatibilityScore: 87,
      factors: {
        skillMatch: 85,
        experienceAlignment: 95,
        availabilitySync: 70,
        locationProximity: 90,
        workStyleCompatibility: 75,
        communicationStyleMatch: 85,
        projectTypeAlignment: 95,
        budgetCompatibility: 100
      },
      matchType: 'project-specific',
      confidence: 'high',
      reasons: [
        'Expert in required tech stack',
        'Experience with similar projects',
        'Budget range aligns perfectly',
        'Strong technical leadership'
      ],
      potentialIssues: [
        'Currently busy with another project',
        'Prefers independent work style'
      ],
      mutualConnections: 1
    },
    {
      id: 'match3',
      member: {
        id: 'member3',
        name: 'Sophia Laurent',
        avatar: '👩🏾‍🏫',
        title: 'Content Creator & Language Educator',
        verified: false,
        rating: 4.7,
        responseTime: '< 4 hours',
        location: 'Boston, MA',
        timezone: 'EST',
        level: 12
      },
      compatibilityScore: 78,
      factors: {
        skillMatch: 80,
        experienceAlignment: 75,
        availabilitySync: 95,
        locationProximity: 85,
        workStyleCompatibility: 90,
        communicationStyleMatch: 88,
        projectTypeAlignment: 70,
        budgetCompatibility: 65
      },
      matchType: 'mutual-interest',
      confidence: 'medium',
      reasons: [
        'Strong cultural knowledge and language skills',
        'Available and eager to collaborate',
        'Good communication style match',
        'Growing expertise in content creation'
      ],
      potentialIssues: [
        'Limited budget range',
        'Less experience with commercial projects'
      ],
      mutualConnections: 0
    }
  ];

  React.useEffect(() => {
    setMatches(sampleMatches);
  }, []);

  const refreshMatches = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
  };

  const getFactorColor = (score: number) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 75) return 'text-blue-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getFactorLabel = (factor: keyof CompatibilityFactors) => {
    const labels: Record<keyof CompatibilityFactors, string> = {
      skillMatch: 'Skill Match',
      experienceAlignment: 'Experience Level',
      availabilitySync: 'Availability',
      locationProximity: 'Location',
      workStyleCompatibility: 'Work Style',
      communicationStyleMatch: 'Communication',
      projectTypeAlignment: 'Project Type',
      budgetCompatibility: 'Budget Range'
    };
    return labels[factor];
  };

  const getConfidenceColor = (confidence: string) => {
    switch (confidence) {
      case 'high': return 'bg-green-100 text-green-700 border-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'low': return 'bg-red-100 text-red-700 border-red-300';
      default: return 'bg-gray-100 text-gray-700 border-gray-300';
    }
  };

  const handleFeedback = (matchId: string, helpful: boolean) => {
    setFeedbackGiven(prev => new Set([...prev, matchId]));
    onProvideFeedback?.(matchId, helpful);
  };

  const MatchCard = ({ match }: { match: Match }) => (
    <Card className="hover:shadow-lg transition-all">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="h-16 w-16">
            <AvatarImage src={match.member.avatar} />
            <AvatarFallback className="text-lg">{match.member.name.charAt(0)}</AvatarFallback>
          </Avatar>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg">{match.member.name}</h3>
              {match.member.verified && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Verified
                </Badge>
              )}
              <Badge variant="outline" className={cn("text-xs", getConfidenceColor(match.confidence))}>
                {match.confidence} confidence
              </Badge>
            </div>
            
            <p className="text-purple-600 font-medium text-sm mb-2">{match.member.title}</p>
            
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-current text-yellow-500" />
                {match.member.rating}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {match.member.responseTime}
              </span>
              {match.member.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="h-3 w-3" />
                  {match.member.location}
                </span>
              )}
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">{match.compatibilityScore}%</div>
            <div className="text-xs text-gray-500">Match</div>
          </div>
        </div>

        {/* Compatibility Factors */}
        <div className="mb-4">
          <div className="text-sm font-medium mb-3 flex items-center gap-2">
            <Brain className="h-4 w-4" />
            Compatibility Factors
          </div>
          <div className="grid grid-cols-2 gap-3">
            {Object.entries(match.factors).map(([factor, score]) => (
              <div key={factor} className="flex items-center justify-between">
                <span className="text-xs text-gray-600">{getFactorLabel(factor as keyof CompatibilityFactors)}</span>
                <div className="flex items-center gap-2">
                  <Progress value={score} className="w-16 h-2" />
                  <span className={cn("text-xs font-medium", getFactorColor(score))}>{score}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Match Reasons */}
        <div className="mb-4">
          <div className="text-sm font-medium mb-2 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            Why this is a good match
          </div>
          <ul className="space-y-1">
            {match.reasons.map((reason, index) => (
              <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                <CheckCircle className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                {reason}
              </li>
            ))}
          </ul>
        </div>

        {/* Potential Issues */}
        {match.potentialIssues && match.potentialIssues.length > 0 && (
          <div className="mb-4">
            <div className="text-sm font-medium mb-2 flex items-center gap-2">
              <Info className="h-4 w-4 text-yellow-500" />
              Things to consider
            </div>
            <ul className="space-y-1">
              {match.potentialIssues.map((issue, index) => (
                <li key={index} className="text-sm text-yellow-700 flex items-start gap-2">
                  <X className="h-3 w-3 text-yellow-500 mt-0.5 flex-shrink-0" />
                  {issue}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Collaboration History */}
        {match.collaborationHistory && (
          <div className="mb-4 p-3 bg-green-50 rounded-lg">
            <div className="text-sm font-medium mb-2 flex items-center gap-2">
              <Award className="h-4 w-4 text-green-600" />
              Previous Collaboration
            </div>
            <div className="grid grid-cols-3 gap-3 text-xs">
              <div className="text-center">
                <div className="font-bold text-green-600">{match.collaborationHistory.projectsTogether}</div>
                <div className="text-gray-600">Projects</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-green-600">{match.collaborationHistory.averageRating}</div>
                <div className="text-gray-600">Avg Rating</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-green-600">
                  {Math.floor((Date.now() - match.collaborationHistory.lastProject.getTime()) / (1000 * 60 * 60 * 24))}d
                </div>
                <div className="text-gray-600">Days Ago</div>
              </div>
            </div>
          </div>
        )}

        {/* Additional Info */}
        <div className="flex items-center justify-between mb-4 text-xs text-gray-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {match.mutualConnections} mutual connections
            </span>
            <Badge variant="secondary" className="text-xs">
              {match.matchType.replace('-', ' ')}
            </Badge>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <Button
            onClick={() => onContactMember?.(match.member.id)}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600"
            size="sm"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Send Message
          </Button>
          
          <Button variant="outline" size="sm">
            <User className="h-4 w-4 mr-2" />
            View Profile
          </Button>
        </div>

        {/* Feedback */}
        {!feedbackGiven.has(match.id) && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-xs text-gray-500 mb-2">Was this match helpful?</div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFeedback(match.id, true)}
                className="text-green-600 hover:bg-green-50"
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                Yes
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleFeedback(match.id, false)}
                className="text-red-600 hover:bg-red-50"
              >
                <ThumbsDown className="h-4 w-4 mr-1" />
                No
              </Button>
            </div>
          </div>
        )}

        {feedbackGiven.has(match.id) && (
          <div className="mt-4 pt-4 border-t">
            <div className="text-xs text-green-600 flex items-center gap-1">
              <CheckCircle className="h-3 w-3" />
              Thanks for your feedback!
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Smart Matching</h2>
          <p className="text-gray-600">AI-powered recommendations based on your profile and preferences</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}>
            <Sliders className="h-4 w-4 mr-2" />
            Filters
          </Button>
          <Button onClick={refreshMatches} disabled={isLoading}>
            <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showAdvancedFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Matching Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Minimum Compatibility Score: {minCompatibility}%
                  </label>
                  <input
                    type="range"
                    min="50"
                    max="100"
                    value={minCompatibility}
                    onChange={(e) => setMinCompatibility(parseInt(e.target.value))}
                    className="w-full"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-3">Priority Factors</label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      { id: 'skillMatch', label: 'Skills' },
                      { id: 'availabilitySync', label: 'Availability' },
                      { id: 'locationProximity', label: 'Location' },
                      { id: 'experienceAlignment', label: 'Experience' },
                      { id: 'workStyleCompatibility', label: 'Work Style' },
                      { id: 'budgetCompatibility', label: 'Budget' },
                      { id: 'communicationStyleMatch', label: 'Communication' },
                      { id: 'projectTypeAlignment', label: 'Project Type' }
                    ].map((factor) => (
                      <label key={factor.id} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={selectedFactors.includes(factor.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedFactors(prev => [...prev, factor.id]);
                            } else {
                              setSelectedFactors(prev => prev.filter(f => f !== factor.id));
                            }
                          }}
                        />
                        {factor.label}
                      </label>
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={onUpdatePreferences}>
                    <Target className="h-4 w-4 mr-2" />
                    Update Profile Preferences
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Match Statistics */}
      <div className="grid md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">{matches.length}</div>
            <div className="text-sm text-gray-600">Total Matches</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {matches.filter(m => m.confidence === 'high').length}
            </div>
            <div className="text-sm text-gray-600">High Confidence</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(matches.reduce((acc, m) => acc + m.compatibilityScore, 0) / matches.length)}%
            </div>
            <div className="text-sm text-gray-600">Avg Compatibility</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {matches.filter(m => m.collaborationHistory).length}
            </div>
            <div className="text-sm text-gray-600">Past Collaborators</div>
          </CardContent>
        </Card>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="text-center py-12">
          <RefreshCw className="h-8 w-8 text-purple-600 mx-auto mb-4 animate-spin" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Finding your perfect matches...</h3>
          <p className="text-gray-600">Analyzing compatibility factors and preferences</p>
        </div>
      )}

      {/* Matches List */}
      {!isLoading && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-semibold">Recommended Matches</h3>
            <p className="text-sm text-gray-600">
              Sorted by compatibility score
            </p>
          </div>
          
          <div className="space-y-4">
            <AnimatePresence>
              {matches
                .filter(match => match.compatibilityScore >= minCompatibility)
                .map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <MatchCard match={match} />
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && matches.filter(m => m.compatibilityScore >= minCompatibility).length === 0 && (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No matches found</h3>
          <p className="text-gray-600 mb-4">
            Try lowering your compatibility threshold or updating your profile preferences
          </p>
          <Button onClick={onUpdatePreferences}>
            <User className="h-4 w-4 mr-2" />
            Update Profile
          </Button>
        </div>
      )}
    </div>
  );
}