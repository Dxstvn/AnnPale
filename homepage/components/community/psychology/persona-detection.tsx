'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Crown,
  MessageSquare,
  Eye,
  HelpCircle,
  Users,
  Heart,
  BarChart3,
  Target,
  TrendingUp,
  Calendar,
  Award,
  Lightbulb,
  Handshake,
  Megaphone,
  Brain,
  Compass,
  Zap,
  Star,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface PersonaType {
  id: string;
  name: string;
  description: string;
  primaryNeed: string;
  participationStyle: string;
  valueContribution: string;
  platformBenefit: string;
  color: string;
  icon: React.ElementType;
  characteristics: string[];
  behaviors: string[];
  motivations: string[];
  recommendations: string[];
  percentage: number;
}

interface PersonaScore {
  personaId: string;
  score: number;
  confidence: number;
  reasons: string[];
}

interface UserBehaviorData {
  postsCreated: number;
  commentsPosted: number;
  questionsAsked: number;
  answersGiven: number;
  connectionsIntroduced: number;
  contentShared: number;
  eventsAttended: number;
  moderationActions: number;
  readTime: number;
  activeHours: number[];
  interactionPattern: 'high' | 'medium' | 'low';
  contentPreference: 'create' | 'consume' | 'discuss';
  helpfulness: number;
  leadership: number;
}

interface PersonaDetectionProps {
  userData?: UserBehaviorData;
  onPersonaDetected?: (persona: PersonaType, confidence: number) => void;
  showAnalysis?: boolean;
  showRecommendations?: boolean;
}

export function PersonaDetection({
  userData,
  onPersonaDetected,
  showAnalysis = true,
  showRecommendations = true
}: PersonaDetectionProps) {
  const [detectedPersona, setDetectedPersona] = React.useState<PersonaType | null>(null);
  const [personaScores, setPersonaScores] = React.useState<PersonaScore[]>([]);
  const [analyzing, setAnalyzing] = React.useState(false);
  const [showDetails, setShowDetails] = React.useState(false);

  // Define the 6 community persona types
  const personaTypes: PersonaType[] = [
    {
      id: 'leader',
      name: 'Community Leader',
      description: 'Natural moderators who shape community culture and guide discussions',
      primaryNeed: 'Recognition and influence',
      participationStyle: 'High posting, active moderating',
      valueContribution: 'Guidance and content creation',
      platformBenefit: 'Free moderation and community direction',
      color: 'bg-yellow-500',
      icon: Crown,
      characteristics: [
        'Posts frequently and thoughtfully',
        'Helps resolve conflicts',
        'Welcomes new members',
        'Sets community standards'
      ],
      behaviors: [
        'Moderate discussions',
        'Create comprehensive posts',
        'Mentor other users',
        'Organize community events'
      ],
      motivations: [
        'Build and lead communities',
        'Share expertise and knowledge',
        'Help others succeed',
        'Create positive impact'
      ],
      recommendations: [
        'Grant moderation privileges',
        'Feature their content prominently',
        'Invite to governance discussions',
        'Provide leadership recognition'
      ],
      percentage: 1
    },
    {
      id: 'contributor',
      name: 'Active Contributor',
      description: 'Regular content creators who drive community discussions and engagement',
      primaryNeed: 'Expression and connection',
      participationStyle: 'Regular posting and commenting',
      valueContribution: 'Rich discussions and helpful content',
      platformBenefit: 'High content volume and engagement',
      color: 'bg-purple-500',
      icon: MessageSquare,
      characteristics: [
        'Creates original content regularly',
        'Engages in meaningful discussions',
        'Shares personal experiences',
        'Builds relationships with others'
      ],
      behaviors: [
        'Post multiple times per week',
        'Comment thoughtfully on others\' content',
        'Share resources and tips',
        'Participate in community challenges'
      ],
      motivations: [
        'Express creativity and ideas',
        'Connect with like-minded people',
        'Build personal brand',
        'Share knowledge and experiences'
      ],
      recommendations: [
        'Highlight their contributions',
        'Provide content creation tools',
        'Offer collaboration opportunities',
        'Create contributor recognition programs'
      ],
      percentage: 9
    },
    {
      id: 'lurker',
      name: 'Silent Lurker',
      description: 'Valuable observers who consume content without frequent posting',
      primaryNeed: 'Information and belonging',
      participationStyle: 'Reading only, minimal posting',
      valueContribution: 'Audience size and silent support',
      platformBenefit: 'Large engaged audience base',
      color: 'bg-gray-500',
      icon: Eye,
      characteristics: [
        'Reads content regularly',
        'Rarely posts or comments',
        'Values privacy and anonymity',
        'Learns from community discussions'
      ],
      behaviors: [
        'Browse content daily',
        'Save interesting posts',
        'Attend virtual events as observers',
        'Vote on polls and surveys'
      ],
      motivations: [
        'Stay informed and learn',
        'Feel connected without exposure',
        'Find solutions to problems',
        'Enjoy community content'
      ],
      recommendations: [
        'Provide anonymous participation options',
        'Create low-pressure engagement opportunities',
        'Send personalized content digests',
        'Offer private community spaces'
      ],
      percentage: 75
    },
    {
      id: 'questioner',
      name: 'Questioner',
      description: 'Curious learners who drive engagement through questions and learning',
      primaryNeed: 'Help and answers',
      participationStyle: 'Asking questions and learning',
      valueContribution: 'Engagement drivers and learning catalysts',
      platformBenefit: 'Increased activity and knowledge sharing',
      color: 'bg-blue-500',
      icon: HelpCircle,
      characteristics: [
        'Asks thoughtful questions',
        'Seeks advice and guidance',
        'Shows appreciation for help',
        'Follows up on solutions'
      ],
      behaviors: [
        'Post questions regularly',
        'Research before asking',
        'Thank helpful responders',
        'Share what they learned'
      ],
      motivations: [
        'Learn new skills and knowledge',
        'Solve specific problems',
        'Get expert advice',
        'Improve their situation'
      ],
      recommendations: [
        'Create Q&A focused spaces',
        'Match with mentors and experts',
        'Provide learning resources',
        'Gamify the learning process'
      ],
      percentage: 8
    },
    {
      id: 'connector',
      name: 'Connector',
      description: 'Social networkers who build bridges between community members',
      primaryNeed: 'Networking and relationships',
      participationStyle: 'Introducing and linking people',
      valueContribution: 'Community building and relationship facilitation',
      platformBenefit: 'Stronger network effects and retention',
      color: 'bg-green-500',
      icon: Users,
      characteristics: [
        'Introduces people to each other',
        'Remembers personal details',
        'Facilitates collaborations',
        'Builds inclusive environments'
      ],
      behaviors: [
        'Tag relevant people in discussions',
        'Organize networking events',
        'Create introduction posts',
        'Bridge different community groups'
      ],
      motivations: [
        'Help others succeed',
        'Build meaningful relationships',
        'Create collaborative opportunities',
        'Strengthen community bonds'
      ],
      recommendations: [
        'Provide networking tools',
        'Highlight connection successes',
        'Create matchmaking features',
        'Offer relationship management tools'
      ],
      percentage: 5
    },
    {
      id: 'advocate',
      name: 'Advocate',
      description: 'Passionate supporters who promote and defend the community mission',
      primaryNeed: 'Mission support and purpose',
      participationStyle: 'Promoting and defending community values',
      valueContribution: 'External growth and brand advocacy',
      platformBenefit: 'Marketing reach and community defense',
      color: 'bg-red-500',
      icon: Megaphone,
      characteristics: [
        'Shares community content externally',
        'Defends community from criticism',
        'Recruits new members',
        'Promotes community values'
      ],
      behaviors: [
        'Share content on social media',
        'Write positive reviews',
        'Invite friends and colleagues',
        'Participate in community promotion'
      ],
      motivations: [
        'Support causes they believe in',
        'Help community grow and thrive',
        'Share positive experiences',
        'Build movement momentum'
      ],
      recommendations: [
        'Provide sharing tools and content',
        'Create advocacy programs',
        'Offer exclusive advocate benefits',
        'Amplify their promotional efforts'
      ],
      percentage: 2
    }
  ];

  // Sample user behavior data
  const sampleUserData: UserBehaviorData = {
    postsCreated: 15,
    commentsPosted: 45,
    questionsAsked: 8,
    answersGiven: 22,
    connectionsIntroduced: 3,
    contentShared: 12,
    eventsAttended: 6,
    moderationActions: 2,
    readTime: 3600, // minutes
    activeHours: [9, 10, 14, 15, 20, 21],
    interactionPattern: 'medium',
    contentPreference: 'discuss',
    helpfulness: 78,
    leadership: 45
  };

  const displayUserData = userData || sampleUserData;

  // Persona detection algorithm
  const detectPersona = React.useCallback(() => {
    setAnalyzing(true);
    
    // Simulate analysis delay
    setTimeout(() => {
      const scores: PersonaScore[] = [];
      
      // Calculate scores for each persona based on behavior data
      personaTypes.forEach(persona => {
        let score = 0;
        let reasons: string[] = [];
        
        switch (persona.id) {
          case 'leader':
            if (displayUserData.moderationActions > 0) {
              score += 30;
              reasons.push('Has moderation activity');
            }
            if (displayUserData.leadership > 70) {
              score += 25;
              reasons.push('High leadership score');
            }
            if (displayUserData.postsCreated > 20) {
              score += 20;
              reasons.push('High content creation');
            }
            if (displayUserData.helpfulness > 80) {
              score += 15;
              reasons.push('Very helpful to others');
            }
            if (displayUserData.connectionsIntroduced > 5) {
              score += 10;
              reasons.push('Introduces people frequently');
            }
            break;
            
          case 'contributor':
            if (displayUserData.postsCreated > 10) {
              score += 25;
              reasons.push('Regular content creator');
            }
            if (displayUserData.commentsPosted > 30) {
              score += 20;
              reasons.push('Active in discussions');
            }
            if (displayUserData.interactionPattern === 'high') {
              score += 20;
              reasons.push('High interaction pattern');
            }
            if (displayUserData.contentPreference === 'create') {
              score += 15;
              reasons.push('Prefers creating content');
            }
            if (displayUserData.answersGiven > 15) {
              score += 10;
              reasons.push('Helps answer questions');
            }
            break;
            
          case 'lurker':
            if (displayUserData.readTime > 2000) {
              score += 30;
              reasons.push('High reading time');
            }
            if (displayUserData.postsCreated < 5) {
              score += 25;
              reasons.push('Low posting activity');
            }
            if (displayUserData.commentsPosted < 10) {
              score += 20;
              reasons.push('Minimal commenting');
            }
            if (displayUserData.contentPreference === 'consume') {
              score += 15;
              reasons.push('Prefers consuming content');
            }
            if (displayUserData.eventsAttended > 3) {
              score += 10;
              reasons.push('Attends events passively');
            }
            break;
            
          case 'questioner':
            if (displayUserData.questionsAsked > 5) {
              score += 30;
              reasons.push('Asks many questions');
            }
            if (displayUserData.questionsAsked > displayUserData.answersGiven) {
              score += 25;
              reasons.push('Asks more than answers');
            }
            if (displayUserData.contentPreference === 'discuss') {
              score += 15;
              reasons.push('Prefers discussions');
            }
            if (displayUserData.postsCreated < displayUserData.commentsPosted) {
              score += 10;
              reasons.push('Comments more than posts');
            }
            break;
            
          case 'connector':
            if (displayUserData.connectionsIntroduced > 2) {
              score += 30;
              reasons.push('Introduces people to each other');
            }
            if (displayUserData.helpfulness > 75) {
              score += 20;
              reasons.push('Very helpful community member');
            }
            if (displayUserData.eventsAttended > 5) {
              score += 15;
              reasons.push('Active event participant');
            }
            if (displayUserData.commentsPosted > displayUserData.postsCreated * 2) {
              score += 10;
              reasons.push('More interactive than creative');
            }
            break;
            
          case 'advocate':
            if (displayUserData.contentShared > 8) {
              score += 30;
              reasons.push('Shares content frequently');
            }
            if (displayUserData.eventsAttended > 4) {
              score += 20;
              reasons.push('Strong community participation');
            }
            if (displayUserData.postsCreated > 0 && displayUserData.contentShared > displayUserData.postsCreated) {
              score += 15;
              reasons.push('Shares more than creates');
            }
            if (displayUserData.helpfulness > 70) {
              score += 10;
              reasons.push('Supportive community member');
            }
            break;
        }
        
        // Add randomness for demo purposes
        score += Math.floor(Math.random() * 10);
        
        scores.push({
          personaId: persona.id,
          score: Math.min(score, 100),
          confidence: Math.min(score * 0.8, 95),
          reasons
        });
      });
      
      // Sort by score and find top persona
      scores.sort((a, b) => b.score - a.score);
      const topPersona = personaTypes.find(p => p.id === scores[0].personaId);
      
      setPersonaScores(scores);
      setDetectedPersona(topPersona || null);
      setAnalyzing(false);
      
      if (topPersona) {
        onPersonaDetected?.(topPersona, scores[0].confidence);
      }
    }, 2000);
  }, [displayUserData, onPersonaDetected, personaTypes]);

  React.useEffect(() => {
    detectPersona();
  }, [detectPersona]);

  const getPersonaIcon = (persona: PersonaType) => {
    const Icon = persona.icon;
    return <Icon className="h-5 w-5" />;
  };

  return (
    <div className="space-y-6">
      {/* Persona Detection Results */}
      <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-blue-600" />
            Persona Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analyzing ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center space-y-4">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-gray-600">Analyzing community behavior patterns...</p>
                <Progress value={70} className="w-48 mx-auto" />
              </div>
            </div>
          ) : detectedPersona ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className={cn("w-16 h-16 rounded-full flex items-center justify-center text-white", detectedPersona.color)}>
                  {getPersonaIcon(detectedPersona)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold">{detectedPersona.name}</h3>
                    <Badge className="bg-blue-600">
                      {personaScores[0]?.confidence.toFixed(0)}% confidence
                    </Badge>
                  </div>
                  <p className="text-gray-600">{detectedPersona.description}</p>
                  <div className="flex items-center gap-4 mt-2 text-sm">
                    <span className="text-blue-600">Primary Need: {detectedPersona.primaryNeed}</span>
                    <span className="text-gray-500">Style: {detectedPersona.participationStyle}</span>
                  </div>
                </div>
              </div>
              
              <Button 
                variant="outline" 
                onClick={() => setShowDetails(!showDetails)}
                className="w-full"
              >
                {showDetails ? 'Hide' : 'Show'} Detailed Analysis
              </Button>
            </div>
          ) : null}
        </CardContent>
      </Card>

      {/* Detailed Analysis */}
      <AnimatePresence>
        {showDetails && detectedPersona && showAnalysis && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Persona Analysis Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Persona Scores */}
                  <div>
                    <h4 className="font-semibold mb-3">Persona Likelihood Scores</h4>
                    <div className="space-y-3">
                      {personaScores.map((score) => {
                        const persona = personaTypes.find(p => p.id === score.personaId);
                        if (!persona) return null;
                        
                        return (
                          <div key={score.personaId} className="space-y-2">
                            <div className="flex justify-between items-center">
                              <div className="flex items-center gap-2">
                                <div className={cn("w-6 h-6 rounded flex items-center justify-center text-white text-xs", persona.color)}>
                                  {getPersonaIcon(persona)}
                                </div>
                                <span className="font-medium">{persona.name}</span>
                              </div>
                              <span className="text-sm text-gray-600">{score.score}%</span>
                            </div>
                            <Progress value={score.score} className="h-2" />
                            {score.reasons.length > 0 && (
                              <div className="text-xs text-gray-500 ml-8">
                                Factors: {score.reasons.join(', ')}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Behavior Analysis */}
                  <div>
                    <h4 className="font-semibold mb-3">Behavior Pattern Analysis</h4>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Content Creation</span>
                          <span className="text-sm font-medium">{displayUserData.postsCreated} posts</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Discussion Participation</span>
                          <span className="text-sm font-medium">{displayUserData.commentsPosted} comments</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Questions Asked</span>
                          <span className="text-sm font-medium">{displayUserData.questionsAsked} questions</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Answers Provided</span>
                          <span className="text-sm font-medium">{displayUserData.answersGiven} answers</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm">Connections Made</span>
                          <span className="text-sm font-medium">{displayUserData.connectionsIntroduced} intros</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Content Shared</span>
                          <span className="text-sm font-medium">{displayUserData.contentShared} shares</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Helpfulness Score</span>
                          <span className="text-sm font-medium">{displayUserData.helpfulness}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm">Leadership Score</span>
                          <span className="text-sm font-medium">{displayUserData.leadership}%</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Personalized Recommendations */}
      {showRecommendations && detectedPersona && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              Personalized Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <h4 className="font-semibold text-yellow-800 mb-2">
                  Based on your {detectedPersona.name} persona:
                </h4>
                <ul className="space-y-2">
                  {detectedPersona.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-yellow-700">
                      <CheckCircle className="h-4 w-4 mt-0.5 text-yellow-600" />
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <h5 className="font-medium text-sm mb-2">Characteristics</h5>
                  <ul className="space-y-1">
                    {detectedPersona.characteristics.map((char, index) => (
                      <li key={index} className="text-xs text-gray-600 flex items-center gap-1">
                        <Star className="h-3 w-3 text-blue-600" />
                        {char}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-sm mb-2">Typical Behaviors</h5>
                  <ul className="space-y-1">
                    {detectedPersona.behaviors.map((behavior, index) => (
                      <li key={index} className="text-xs text-gray-600 flex items-center gap-1">
                        <Zap className="h-3 w-3 text-green-600" />
                        {behavior}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-sm mb-2">Motivations</h5>
                  <ul className="space-y-1">
                    {detectedPersona.motivations.map((motivation, index) => (
                      <li key={index} className="text-xs text-gray-600 flex items-center gap-1">
                        <Heart className="h-3 w-3 text-red-600" />
                        {motivation}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Persona Types Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Compass className="h-5 w-5" />
            Community Persona Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {personaTypes.map((persona) => {
              const score = personaScores.find(s => s.personaId === persona.id);
              const isDetected = detectedPersona?.id === persona.id;
              
              return (
                <div
                  key={persona.id}
                  className={cn(
                    "p-4 rounded-lg border transition-all",
                    isDetected ? "border-blue-600 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                  )}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <div className={cn("w-8 h-8 rounded flex items-center justify-center text-white", persona.color)}>
                      {getPersonaIcon(persona)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm">{persona.name}</h4>
                      <p className="text-xs text-gray-600">{persona.percentage}% of community</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{persona.description}</p>
                  {score && (
                    <div className="flex items-center gap-2">
                      <Progress value={score.score} className="flex-1 h-1" />
                      <span className="text-xs text-gray-500">{score.score}%</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}