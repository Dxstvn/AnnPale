'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  UserPlus,
  Target,
  Heart,
  BookOpen,
  Users,
  Gamepad2,
  Compass,
  Star,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Crown,
  MessageSquare,
  Eye,
  HelpCircle,
  Handshake,
  Megaphone,
  Brain,
  Sparkles,
  Calendar,
  Gift,
  Award,
  Zap,
  Clock,
  Globe
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  component: React.ComponentType<any>;
  optional?: boolean;
  personaSpecific?: string[];
}

interface PersonaQuizQuestion {
  id: string;
  question: string;
  answers: Array<{
    id: string;
    text: string;
    persona: string;
    weight: number;
  }>;
}

interface ValuePreference {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  color: string;
}

interface OnboardingProfile {
  detectedPersona: string;
  confidence: number;
  valuePreferences: string[];
  interests: string[];
  goals: string[];
  experience: 'beginner' | 'intermediate' | 'advanced';
  timeCommitment: 'light' | 'moderate' | 'heavy';
  preferredContentTypes: string[];
}

interface OnboardingSystemProps {
  onComplete?: (profile: OnboardingProfile) => void;
  onSkip?: () => void;
  showProgress?: boolean;
}

// Persona Quiz Questions
const PersonaQuizQuestions: PersonaQuizQuestion[] = [
  {
    id: 'participation_style',
    question: 'How do you prefer to participate in online communities?',
    answers: [
      { id: 'lead', text: 'I like to lead discussions and help moderate', persona: 'leader', weight: 3 },
      { id: 'contribute', text: 'I regularly post content and engage actively', persona: 'contributor', weight: 3 },
      { id: 'observe', text: 'I prefer to read and observe without posting much', persona: 'lurker', weight: 3 },
      { id: 'ask', text: 'I ask questions and seek advice from others', persona: 'questioner', weight: 3 },
      { id: 'connect', text: 'I love introducing people and building connections', persona: 'connector', weight: 3 },
      { id: 'promote', text: 'I share content and promote communities I believe in', persona: 'advocate', weight: 3 }
    ]
  },
  {
    id: 'motivation',
    question: 'What motivates you most to join this community?',
    answers: [
      { id: 'influence', text: 'To build influence and help shape the community', persona: 'leader', weight: 2 },
      { id: 'express', text: 'To express myself and share my experiences', persona: 'contributor', weight: 2 },
      { id: 'learn', text: 'To learn from others without much pressure to contribute', persona: 'lurker', weight: 2 },
      { id: 'solve', text: 'To get help solving problems and learning new skills', persona: 'questioner', weight: 2 },
      { id: 'network', text: 'To meet new people and build my network', persona: 'connector', weight: 2 },
      { id: 'support', text: 'To support a cause or mission I care about', persona: 'advocate', weight: 2 }
    ]
  },
  {
    id: 'time_investment',
    question: 'How much time do you typically spend in online communities?',
    answers: [
      { id: 'heavy', text: 'Several hours daily - I\'m very active', persona: 'leader', weight: 1 },
      { id: 'regular', text: 'About an hour daily with regular posting', persona: 'contributor', weight: 1 },
      { id: 'browse', text: 'I browse for 10-30 minutes when I have time', persona: 'lurker', weight: 1 },
      { id: 'when_needed', text: 'Only when I need specific help or information', persona: 'questioner', weight: 1 },
      { id: 'social', text: 'Moderate time focused on connecting with others', persona: 'connector', weight: 1 },
      { id: 'occasional', text: 'Occasional but passionate participation', persona: 'advocate', weight: 1 }
    ]
  }
];

// Value Preferences
const ValuePreferences: ValuePreference[] = [
  {
    id: 'information',
    name: 'Learning & Knowledge',
    description: 'Access to valuable insights and educational content',
    icon: BookOpen,
    color: 'bg-blue-500'
  },
  {
    id: 'connection',
    name: 'Relationships',
    description: 'Building meaningful connections with others',
    icon: Users,
    color: 'bg-green-500'
  },
  {
    id: 'recognition',
    name: 'Achievement',
    description: 'Earning recognition and building reputation',
    icon: Star,
    color: 'bg-yellow-500'
  },
  {
    id: 'support',
    name: 'Help & Support',
    description: 'Getting help and supporting others',
    icon: Heart,
    color: 'bg-red-500'
  },
  {
    id: 'entertainment',
    name: 'Fun & Entertainment',
    description: 'Enjoying engaging and entertaining content',
    icon: Gamepad2,
    color: 'bg-purple-500'
  },
  {
    id: 'purpose',
    name: 'Shared Mission',
    description: 'Contributing to meaningful causes',
    icon: Compass,
    color: 'bg-indigo-500'
  }
];

// Step Components
const WelcomeStep = ({ onNext }: { onNext: () => void }) => (
  <div className="text-center space-y-6">
    <div className="w-20 h-20 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full mx-auto flex items-center justify-center">
      <UserPlus className="h-10 w-10 text-white" />
    </div>
    <div>
      <h2 className="text-2xl font-bold mb-2">Welcome to Ann Pale!</h2>
      <p className="text-gray-600 max-w-md mx-auto">
        Let's personalize your experience by understanding what brings you value in our community.
        This will help us recommend the right content, connections, and opportunities for you.
      </p>
    </div>
    <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
      <div className="flex items-center gap-1">
        <Clock className="h-4 w-4" />
        <span>2-3 minutes</span>
      </div>
      <div className="flex items-center gap-1">
        <Brain className="h-4 w-4" />
        <span>Personalized experience</span>
      </div>
    </div>
    <Button onClick={onNext} className="bg-gradient-to-r from-purple-600 to-pink-600">
      Get Started
      <ArrowRight className="h-4 w-4 ml-2" />
    </Button>
  </div>
);

const PersonaQuizStep = ({ 
  onNext, 
  onPersonaDetected 
}: { 
  onNext: () => void; 
  onPersonaDetected: (persona: string, confidence: number) => void;
}) => {
  const [currentQuestion, setCurrentQuestion] = React.useState(0);
  const [answers, setAnswers] = React.useState<Record<string, string>>({});

  const handleAnswer = (questionId: string, answerId: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: answerId }));
    
    if (currentQuestion < PersonaQuizQuestions.length - 1) {
      setTimeout(() => setCurrentQuestion(prev => prev + 1), 300);
    } else {
      // Calculate persona
      setTimeout(() => {
        const personaScores: Record<string, number> = {};
        
        Object.entries(answers).forEach(([questionId, answerId]) => {
          const question = PersonaQuizQuestions.find(q => q.id === questionId);
          const answer = question?.answers.find(a => a.id === answerId);
          if (answer) {
            personaScores[answer.persona] = (personaScores[answer.persona] || 0) + answer.weight;
          }
        });

        // Include current answer
        const currentQuestionData = PersonaQuizQuestions[currentQuestion];
        const currentAnswer = currentQuestionData.answers.find(a => a.id === answerId);
        if (currentAnswer) {
          personaScores[currentAnswer.persona] = (personaScores[currentAnswer.persona] || 0) + currentAnswer.weight;
        }

        const sortedPersonas = Object.entries(personaScores).sort(([,a], [,b]) => b - a);
        const detectedPersona = sortedPersonas[0]?.[0] || 'lurker';
        const confidence = Math.min((sortedPersonas[0]?.[1] || 0) / 6 * 100, 95);

        onPersonaDetected(detectedPersona, confidence);
        onNext();
      }, 500);
    }
  };

  const question = PersonaQuizQuestions[currentQuestion];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <Badge variant="secondary" className="mb-4">
          Question {currentQuestion + 1} of {PersonaQuizQuestions.length}
        </Badge>
        <h2 className="text-xl font-bold mb-2">{question.question}</h2>
        <Progress value={((currentQuestion + 1) / PersonaQuizQuestions.length) * 100} className="w-64 mx-auto" />
      </div>

      <div className="space-y-3 max-w-lg mx-auto">
        <AnimatePresence mode="wait">
          {question.answers.map((answer, index) => (
            <motion.div
              key={answer.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Button
                variant="outline"
                className="w-full h-auto p-4 text-left justify-start hover:bg-purple-50 hover:border-purple-300"
                onClick={() => handleAnswer(question.id, answer.id)}
              >
                <span className="text-sm">{answer.text}</span>
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};

const ValuePreferencesStep = ({ 
  onNext, 
  onValueChange 
}: { 
  onNext: () => void; 
  onValueChange: (values: string[]) => void;
}) => {
  const [selectedValues, setSelectedValues] = React.useState<string[]>([]);

  const handleValueToggle = (valueId: string) => {
    setSelectedValues(prev => {
      const newValues = prev.includes(valueId)
        ? prev.filter(id => id !== valueId)
        : [...prev, valueId];
      return newValues;
    });
  };

  React.useEffect(() => {
    onValueChange(selectedValues);
  }, [selectedValues]); // Remove onValueChange from dependencies

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">What do you value most?</h2>
        <p className="text-gray-600">Select the values that matter most to you (choose 2-4)</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4 max-w-2xl mx-auto">
        {ValuePreferences.map((value) => {
          const Icon = value.icon;
          const isSelected = selectedValues.includes(value.id);
          
          return (
            <motion.div
              key={value.id}
              className={cn(
                "p-4 rounded-lg border-2 cursor-pointer transition-all",
                isSelected 
                  ? "border-purple-600 bg-purple-50" 
                  : "border-gray-200 hover:border-gray-300"
              )}
              onClick={() => handleValueToggle(value.id)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={cn("w-10 h-10 rounded-full flex items-center justify-center text-white", value.color)}>
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <h4 className="font-semibold">{value.name}</h4>
                </div>
                {isSelected && <CheckCircle className="h-5 w-5 text-purple-600 ml-auto" />}
              </div>
              <p className="text-sm text-gray-600">{value.description}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="text-center">
        <Button 
          onClick={onNext} 
          disabled={selectedValues.length < 2}
          className="bg-gradient-to-r from-purple-600 to-pink-600"
        >
          Continue
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

const PersonalizationStep = ({ 
  profile, 
  onComplete 
}: { 
  profile: Partial<OnboardingProfile>; 
  onComplete: (fullProfile: OnboardingProfile) => void;
}) => {
  const [interests, setInterests] = React.useState<string[]>([]);
  const [goals, setGoals] = React.useState<string[]>([]);
  const [experience, setExperience] = React.useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [timeCommitment, setTimeCommitment] = React.useState<'light' | 'moderate' | 'heavy'>('moderate');

  const interestOptions = [
    'Haitian Culture', 'Music', 'Art', 'Business', 'Technology', 'Education',
    'Health & Wellness', 'Travel', 'Food', 'Fashion', 'Sports', 'Politics'
  ];

  const goalOptions = [
    'Learn new skills', 'Build professional network', 'Find mentorship',
    'Share my expertise', 'Promote my work', 'Make friends',
    'Stay informed', 'Get help with projects', 'Support causes'
  ];

  const handleComplete = () => {
    const fullProfile: OnboardingProfile = {
      detectedPersona: profile.detectedPersona || 'lurker',
      confidence: profile.confidence || 70,
      valuePreferences: profile.valuePreferences || [],
      interests,
      goals,
      experience,
      timeCommitment,
      preferredContentTypes: []
    };
    onComplete(fullProfile);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center">
        <h2 className="text-xl font-bold mb-2">Let's personalize your experience</h2>
        <p className="text-gray-600">Tell us a bit more about your interests and goals</p>
      </div>

      <div className="space-y-6">
        <div>
          <Label className="text-base font-medium mb-3 block">What are your interests?</Label>
          <div className="flex flex-wrap gap-2">
            {interestOptions.map(interest => (
              <Button
                key={interest}
                variant={interests.includes(interest) ? "default" : "outline"}
                size="sm"
                onClick={() => setInterests(prev => 
                  prev.includes(interest) 
                    ? prev.filter(i => i !== interest)
                    : [...prev, interest]
                )}
              >
                {interest}
              </Button>
            ))}
          </div>
        </div>

        <div>
          <Label className="text-base font-medium mb-3 block">What are your goals?</Label>
          <div className="flex flex-wrap gap-2">
            {goalOptions.map(goal => (
              <Button
                key={goal}
                variant={goals.includes(goal) ? "default" : "outline"}
                size="sm"
                onClick={() => setGoals(prev => 
                  prev.includes(goal) 
                    ? prev.filter(g => g !== goal)
                    : [...prev, goal]
                )}
              >
                {goal}
              </Button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label className="text-base font-medium mb-3 block">Experience Level</Label>
            <div className="space-y-2">
              {[
                { value: 'beginner', label: 'Beginner', desc: 'New to online communities' },
                { value: 'intermediate', label: 'Intermediate', desc: 'Some experience' },
                { value: 'advanced', label: 'Advanced', desc: 'Very experienced' }
              ].map(option => (
                <Button
                  key={option.value}
                  variant={experience === option.value ? "default" : "outline"}
                  className="w-full justify-start h-auto p-3"
                  onClick={() => setExperience(option.value as any)}
                >
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs opacity-70">{option.desc}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-base font-medium mb-3 block">Time Commitment</Label>
            <div className="space-y-2">
              {[
                { value: 'light', label: 'Light', desc: 'Few minutes when needed' },
                { value: 'moderate', label: 'Moderate', desc: '10-30 minutes daily' },
                { value: 'heavy', label: 'Heavy', desc: '1+ hours daily' }
              ].map(option => (
                <Button
                  key={option.value}
                  variant={timeCommitment === option.value ? "default" : "outline"}
                  className="w-full justify-start h-auto p-3"
                  onClick={() => setTimeCommitment(option.value as any)}
                >
                  <div>
                    <div className="font-medium">{option.label}</div>
                    <div className="text-xs opacity-70">{option.desc}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <Button 
          onClick={handleComplete}
          className="bg-gradient-to-r from-purple-600 to-pink-600"
        >
          Complete Setup
          <CheckCircle className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export function OnboardingSystem({
  onComplete,
  onSkip,
  showProgress = true
}: OnboardingSystemProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [profile, setProfile] = React.useState<Partial<OnboardingProfile>>({});

  const steps: OnboardingStep[] = [
    {
      id: 'welcome',
      title: 'Welcome',
      description: 'Introduction to the community',
      component: WelcomeStep
    },
    {
      id: 'persona-quiz',
      title: 'Persona Discovery',
      description: 'Understanding your community style',
      component: PersonaQuizStep
    },
    {
      id: 'value-preferences',
      title: 'Value Preferences',
      description: 'What matters most to you',
      component: ValuePreferencesStep
    },
    {
      id: 'personalization',
      title: 'Personalization',
      description: 'Customize your experience',
      component: PersonalizationStep
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handlePersonaDetected = React.useCallback((persona: string, confidence: number) => {
    setProfile(prev => ({ ...prev, detectedPersona: persona, confidence }));
  }, []);

  const handleValueChange = React.useCallback((values: string[]) => {
    setProfile(prev => ({ ...prev, valuePreferences: values }));
  }, []);

  const handleComplete = React.useCallback((fullProfile: OnboardingProfile) => {
    onComplete?.(fullProfile);
  }, [onComplete]);

  const currentStepData = steps[currentStep];
  const StepComponent = currentStepData.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Progress Header */}
        {showProgress && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-lg font-semibold">Community Onboarding</h1>
              <Button variant="ghost" size="sm" onClick={onSkip}>
                Skip for now
              </Button>
            </div>
            <div className="flex items-center gap-2">
              {steps.map((step, index) => (
                <div key={step.id} className="flex items-center">
                  <div className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                    index < currentStep ? "bg-purple-600 text-white" :
                    index === currentStep ? "bg-purple-100 text-purple-600 border-2 border-purple-600" :
                    "bg-gray-200 text-gray-500"
                  )}>
                    {index < currentStep ? <CheckCircle className="h-4 w-4" /> : index + 1}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={cn(
                      "w-12 h-0.5 mx-2",
                      index < currentStep ? "bg-purple-600" : "bg-gray-200"
                    )} />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-2 text-sm text-gray-600">
              Step {currentStep + 1} of {steps.length}: {currentStepData.title}
            </div>
          </div>
        )}

        {/* Step Content */}
        <Card className="border-0 shadow-xl">
          <CardContent className="p-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <StepComponent
                  onNext={handleNext}
                  onBack={handleBack}
                  onPersonaDetected={handlePersonaDetected}
                  onValueChange={handleValueChange}
                  onComplete={handleComplete}
                  profile={profile}
                />
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </Card>

        {/* Navigation */}
        {currentStep > 0 && currentStep < steps.length - 1 && (
          <div className="flex justify-between mt-6">
            <Button variant="outline" onClick={handleBack}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div className="text-sm text-gray-500 flex items-center">
              {currentStep + 1} of {steps.length}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}