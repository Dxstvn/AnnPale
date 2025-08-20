'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Trophy,
  Users,
  Clock,
  Star,
  Gift,
  Zap,
  Camera,
  Mic,
  Palette,
  Dumbbell,
  Brain,
  Heart,
  Calendar,
  Award,
  Target,
  Info,
  Plus,
  X,
  ChevronLeft,
  ChevronRight,
  Save,
  Send,
  AlertCircle,
  CheckCircle,
  Upload,
  DollarSign,
  Sparkles
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ChallengeFormData {
  // Basic Info
  title: string;
  description: string;
  shortDescription: string;
  type: 'creative' | 'skill' | 'knowledge' | 'physical' | 'social' | 'charitable';
  category: string;
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';

  // Timeline
  startDate: Date;
  endDate: Date;
  votingDuration: number; // days
  
  // Participation
  participantLimit?: number;
  requiresApproval: boolean;
  ageRestriction?: number;

  // Prize
  prizeType: 'money' | 'product' | 'experience' | 'recognition';
  prizeValue: string;
  prizeDescription: string;

  // Rules & Guidelines
  rules: string[];
  submissionFormat: 'video' | 'image' | 'text' | 'audio' | 'mixed';
  submissionGuidelines: string;
  judgingCriteria: string[];

  // Promotion
  featured: boolean;
  socialPromotions: {
    twitter: boolean;
    instagram: boolean;
    facebook: boolean;
  };
  collaborators: string[];
}

interface ChallengeWizardProps {
  onSave?: (data: ChallengeFormData) => void;
  onPublish?: (data: ChallengeFormData) => void;
  onCancel?: () => void;
  initialData?: Partial<ChallengeFormData>;
  mode?: 'create' | 'edit';
}

export function ChallengeWizard({
  onSave,
  onPublish,
  onCancel,
  initialData,
  mode = 'create'
}: ChallengeWizardProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [formData, setFormData] = React.useState<ChallengeFormData>({
    title: '',
    description: '',
    shortDescription: '',
    type: 'creative',
    category: '',
    tags: [],
    difficulty: 'beginner',
    startDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
    endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 2 weeks from now
    votingDuration: 3,
    requiresApproval: false,
    prizeType: 'recognition',
    prizeValue: '',
    prizeDescription: '',
    rules: [''],
    submissionFormat: 'mixed',
    submissionGuidelines: '',
    judgingCriteria: ['Creativity', 'Originality', 'Quality'],
    featured: false,
    socialPromotions: {
      twitter: false,
      instagram: false,
      facebook: false
    },
    collaborators: [],
    ...initialData
  });

  const [currentTag, setCurrentTag] = React.useState('');
  const [currentRule, setCurrentRule] = React.useState('');
  const [currentCriteria, setCurrentCriteria] = React.useState('');
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const challengeTypes = [
    { 
      id: 'creative', 
      label: 'Creative', 
      icon: Palette, 
      description: 'Art, video, music, design challenges',
      examples: ['Video creation', 'Digital art', 'Photography', 'Music composition']
    },
    { 
      id: 'skill', 
      label: 'Skill-based', 
      icon: Star, 
      description: 'Talent showcases and skill demonstrations',
      examples: ['Dance performance', 'Language skills', 'Cooking techniques', 'Sports tricks']
    },
    { 
      id: 'knowledge', 
      label: 'Knowledge', 
      icon: Brain, 
      description: 'Trivia, quizzes, and educational content',
      examples: ['Haiti trivia', 'Culture quiz', 'History questions', 'Language tests']
    },
    { 
      id: 'physical', 
      label: 'Physical', 
      icon: Dumbbell, 
      description: 'Fitness, sports, and physical activities',
      examples: ['Workout challenges', 'Dance moves', 'Sports challenges', 'Fitness goals']
    },
    { 
      id: 'social', 
      label: 'Social', 
      icon: Heart, 
      description: 'Community building and social impact',
      examples: ['Community service', 'Kindness acts', 'Social awareness', 'Team building']
    },
    { 
      id: 'charitable', 
      label: 'Charitable', 
      icon: Gift, 
      description: 'Fundraising and charitable initiatives',
      examples: ['Charity drives', 'Fundraising goals', 'Volunteer work', 'Awareness campaigns']
    }
  ];

  const prizeTypes = [
    { 
      id: 'recognition', 
      label: 'Recognition', 
      icon: Award, 
      description: 'Badges, certificates, features',
      examples: ['Winner badge', 'Feature spotlight', 'Certificate', 'Hall of fame']
    },
    { 
      id: 'money', 
      label: 'Monetary', 
      icon: DollarSign, 
      description: 'Cash prizes and gift cards',
      examples: ['$100 cash', '$50 gift card', 'Donation to charity', 'PayPal transfer']
    },
    { 
      id: 'product', 
      label: 'Products', 
      icon: Gift, 
      description: 'Physical items and merchandise',
      examples: ['Ann Pale merchandise', 'Books', 'Electronics', 'Art supplies']
    },
    { 
      id: 'experience', 
      label: 'Experiences', 
      icon: Sparkles, 
      description: 'Unique experiences and opportunities',
      examples: ['Virtual meet & greet', 'Mentorship session', 'Tour experience', 'Workshop access']
    }
  ];

  const submissionFormats = [
    { id: 'video', label: 'Video only', description: 'MP4, MOV, AVI files' },
    { id: 'image', label: 'Images only', description: 'JPG, PNG, GIF files' },
    { id: 'text', label: 'Text only', description: 'Written submissions' },
    { id: 'audio', label: 'Audio only', description: 'MP3, WAV files' },
    { id: 'mixed', label: 'Mixed media', description: 'Any combination of formats' }
  ];

  const steps = [
    {
      id: 'basic',
      title: 'Basic Information',
      description: 'Challenge details and type'
    },
    {
      id: 'timeline',
      title: 'Timeline & Participation',
      description: 'Dates and participant settings'
    },
    {
      id: 'prize',
      title: 'Prize & Incentives',
      description: 'Rewards and recognition'
    },
    {
      id: 'rules',
      title: 'Rules & Guidelines',
      description: 'Submission requirements and judging'
    },
    {
      id: 'promotion',
      title: 'Promotion & Launch',
      description: 'Marketing and collaboration'
    }
  ];

  const updateFormData = (updates: Partial<ChallengeFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const addTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim().toLowerCase())) {
      updateFormData({
        tags: [...formData.tags, currentTag.trim().toLowerCase()]
      });
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    updateFormData({
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const addRule = () => {
    if (currentRule.trim()) {
      updateFormData({
        rules: [...formData.rules.filter(r => r.trim()), currentRule.trim()]
      });
      setCurrentRule('');
    }
  };

  const removeRule = (index: number) => {
    updateFormData({
      rules: formData.rules.filter((_, i) => i !== index)
    });
  };

  const addCriteria = () => {
    if (currentCriteria.trim() && !formData.judgingCriteria.includes(currentCriteria.trim())) {
      updateFormData({
        judgingCriteria: [...formData.judgingCriteria, currentCriteria.trim()]
      });
      setCurrentCriteria('');
    }
  };

  const removeCriteria = (criteriaToRemove: string) => {
    updateFormData({
      judgingCriteria: formData.judgingCriteria.filter(c => c !== criteriaToRemove)
    });
  };

  const validateStep = (stepIndex: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (stepIndex) {
      case 0: // Basic Info
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.shortDescription.trim()) newErrors.shortDescription = 'Short description is required';
        if (!formData.category.trim()) newErrors.category = 'Category is required';
        break;
      case 1: // Timeline
        if (formData.startDate <= new Date()) newErrors.startDate = 'Start date must be in the future';
        if (formData.endDate <= formData.startDate) newErrors.endDate = 'End date must be after start date';
        if (formData.votingDuration < 1) newErrors.votingDuration = 'Voting duration must be at least 1 day';
        break;
      case 2: // Prize
        if (!formData.prizeValue.trim()) newErrors.prizeValue = 'Prize value is required';
        if (!formData.prizeDescription.trim()) newErrors.prizeDescription = 'Prize description is required';
        break;
      case 3: // Rules
        if (formData.rules.filter(r => r.trim()).length === 0) newErrors.rules = 'At least one rule is required';
        if (!formData.submissionGuidelines.trim()) newErrors.submissionGuidelines = 'Submission guidelines are required';
        if (formData.judgingCriteria.length === 0) newErrors.judgingCriteria = 'At least one judging criteria is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  const handleSave = () => {
    onSave?.(formData);
  };

  const handlePublish = () => {
    if (validateStep(currentStep)) {
      onPublish?.(formData);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0: // Basic Information
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Challenge Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => updateFormData({ title: e.target.value })}
                    placeholder="Enter an engaging challenge title"
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
                </div>

                <div>
                  <Label htmlFor="shortDescription">Short Description *</Label>
                  <Input
                    id="shortDescription"
                    value={formData.shortDescription}
                    onChange={(e) => updateFormData({ shortDescription: e.target.value })}
                    placeholder="Brief one-line description"
                    className={errors.shortDescription ? 'border-red-500' : ''}
                  />
                  {errors.shortDescription && <p className="text-sm text-red-500 mt-1">{errors.shortDescription}</p>}
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Input
                    id="category"
                    value={formData.category}
                    onChange={(e) => updateFormData({ category: e.target.value })}
                    placeholder="e.g., Culture, Entertainment, Education"
                    className={errors.category ? 'border-red-500' : ''}
                  />
                  {errors.category && <p className="text-sm text-red-500 mt-1">{errors.category}</p>}
                </div>

                <div>
                  <Label htmlFor="difficulty">Difficulty Level</Label>
                  <select
                    value={formData.difficulty}
                    onChange={(e) => updateFormData({ difficulty: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="description">Full Description *</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => updateFormData({ description: e.target.value })}
                    placeholder="Detailed challenge description, goals, and expectations"
                    rows={6}
                    className={errors.description ? 'border-red-500' : ''}
                  />
                  {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
                </div>

                <div>
                  <Label>Tags</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={currentTag}
                      onChange={(e) => setCurrentTag(e.target.value)}
                      placeholder="Add tag..."
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                    />
                    <Button type="button" variant="outline" onClick={addTag}>
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {formData.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                        #{tag}
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-auto w-auto p-0 ml-1"
                          onClick={() => removeTag(tag)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Challenge Type Selection */}
            <div>
              <Label>Challenge Type *</Label>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-2">
                {challengeTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <Card
                      key={type.id}
                      className={cn(
                        "cursor-pointer border-2 transition-all",
                        formData.type === type.id
                          ? "border-purple-500 bg-purple-50"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                      onClick={() => updateFormData({ type: type.id as any })}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className="h-5 w-5 text-purple-600" />
                          <h4 className="font-semibold">{type.label}</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{type.description}</p>
                        <div className="text-xs text-gray-500">
                          Examples: {type.examples.slice(0, 2).join(', ')}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 1: // Timeline & Participation
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="startDate">Start Date *</Label>
                  <Input
                    type="datetime-local"
                    id="startDate"
                    value={formData.startDate.toISOString().slice(0, 16)}
                    onChange={(e) => updateFormData({ startDate: new Date(e.target.value) })}
                    className={errors.startDate ? 'border-red-500' : ''}
                  />
                  {errors.startDate && <p className="text-sm text-red-500 mt-1">{errors.startDate}</p>}
                </div>

                <div>
                  <Label htmlFor="endDate">End Date *</Label>
                  <Input
                    type="datetime-local"
                    id="endDate"
                    value={formData.endDate.toISOString().slice(0, 16)}
                    onChange={(e) => updateFormData({ endDate: new Date(e.target.value) })}
                    className={errors.endDate ? 'border-red-500' : ''}
                  />
                  {errors.endDate && <p className="text-sm text-red-500 mt-1">{errors.endDate}</p>}
                </div>

                <div>
                  <Label htmlFor="votingDuration">Voting Duration (days) *</Label>
                  <Input
                    type="number"
                    id="votingDuration"
                    min="1"
                    max="30"
                    value={formData.votingDuration}
                    onChange={(e) => updateFormData({ votingDuration: parseInt(e.target.value) || 1 })}
                    className={errors.votingDuration ? 'border-red-500' : ''}
                  />
                  {errors.votingDuration && <p className="text-sm text-red-500 mt-1">{errors.votingDuration}</p>}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="participantLimit">Participant Limit (optional)</Label>
                  <Input
                    type="number"
                    id="participantLimit"
                    min="1"
                    value={formData.participantLimit || ''}
                    onChange={(e) => updateFormData({ 
                      participantLimit: e.target.value ? parseInt(e.target.value) : undefined 
                    })}
                    placeholder="Leave empty for unlimited"
                  />
                </div>

                <div>
                  <Label htmlFor="ageRestriction">Age Restriction (optional)</Label>
                  <Input
                    type="number"
                    id="ageRestriction"
                    min="13"
                    max="99"
                    value={formData.ageRestriction || ''}
                    onChange={(e) => updateFormData({ 
                      ageRestriction: e.target.value ? parseInt(e.target.value) : undefined 
                    })}
                    placeholder="Minimum age requirement"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Switch
                    id="requiresApproval"
                    checked={formData.requiresApproval}
                    onCheckedChange={(checked) => updateFormData({ requiresApproval: checked })}
                  />
                  <Label htmlFor="requiresApproval">Require approval for participation</Label>
                </div>
              </div>
            </div>

            {/* Timeline Preview */}
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Timeline Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Challenge starts:</span>
                    <span className="font-medium">{formData.startDate.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Submissions end:</span>
                    <span className="font-medium">{formData.endDate.toLocaleDateString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Voting ends:</span>
                    <span className="font-medium">
                      {new Date(formData.endDate.getTime() + formData.votingDuration * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Duration:</span>
                    <span className="font-medium">
                      {Math.ceil((formData.endDate.getTime() - formData.startDate.getTime()) / (1000 * 60 * 60 * 24))} days
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 2: // Prize & Incentives
        return (
          <div className="space-y-6">
            {/* Prize Type Selection */}
            <div>
              <Label>Prize Type *</Label>
              <div className="grid md:grid-cols-2 gap-4 mt-2">
                {prizeTypes.map((prize) => {
                  const Icon = prize.icon;
                  return (
                    <Card
                      key={prize.id}
                      className={cn(
                        "cursor-pointer border-2 transition-all",
                        formData.prizeType === prize.id
                          ? "border-yellow-500 bg-yellow-50"
                          : "border-gray-200 hover:border-gray-300"
                      )}
                      onClick={() => updateFormData({ prizeType: prize.id as any })}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3 mb-2">
                          <Icon className="h-5 w-5 text-yellow-600" />
                          <h4 className="font-semibold">{prize.label}</h4>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{prize.description}</p>
                        <div className="text-xs text-gray-500">
                          Examples: {prize.examples.slice(0, 2).join(', ')}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="prizeValue">Prize Value *</Label>
                <Input
                  id="prizeValue"
                  value={formData.prizeValue}
                  onChange={(e) => updateFormData({ prizeValue: e.target.value })}
                  placeholder={
                    formData.prizeType === 'money' ? '$100' :
                    formData.prizeType === 'product' ? 'Premium headphones' :
                    formData.prizeType === 'experience' ? 'Virtual meet & greet' :
                    'Winner badge'
                  }
                  className={errors.prizeValue ? 'border-red-500' : ''}
                />
                {errors.prizeValue && <p className="text-sm text-red-500 mt-1">{errors.prizeValue}</p>}
              </div>

              <div>
                <Label htmlFor="prizeDescription">Prize Description *</Label>
                <Textarea
                  id="prizeDescription"
                  value={formData.prizeDescription}
                  onChange={(e) => updateFormData({ prizeDescription: e.target.value })}
                  placeholder="Detailed description of the prize and how it will be awarded"
                  rows={3}
                  className={errors.prizeDescription ? 'border-red-500' : ''}
                />
                {errors.prizeDescription && <p className="text-sm text-red-500 mt-1">{errors.prizeDescription}</p>}
              </div>
            </div>

            {/* Prize Preview */}
            <Card className="bg-yellow-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <Trophy className="h-4 w-4" />
                  Prize Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  {formData.prizeType === 'money' && <DollarSign className="h-6 w-6 text-yellow-600" />}
                  {formData.prizeType === 'product' && <Gift className="h-6 w-6 text-yellow-600" />}
                  {formData.prizeType === 'experience' && <Sparkles className="h-6 w-6 text-yellow-600" />}
                  {formData.prizeType === 'recognition' && <Award className="h-6 w-6 text-yellow-600" />}
                  <div>
                    <div className="font-semibold text-yellow-800">
                      {formData.prizeValue || 'Prize value not set'}
                    </div>
                    <div className="text-sm text-yellow-700">
                      {formData.prizeDescription || 'Prize description not set'}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 3: // Rules & Guidelines
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label>Challenge Rules *</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={currentRule}
                        onChange={(e) => setCurrentRule(e.target.value)}
                        placeholder="Add a rule..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addRule();
                          }
                        }}
                      />
                      <Button type="button" variant="outline" onClick={addRule}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="space-y-1">
                      {formData.rules.filter(r => r.trim()).map((rule, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                          <Badge variant="outline" className="px-2 py-1">
                            {index + 1}
                          </Badge>
                          <span className="flex-1">{rule}</span>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => removeRule(index)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                  {errors.rules && <p className="text-sm text-red-500 mt-1">{errors.rules}</p>}
                </div>

                <div>
                  <Label>Submission Format</Label>
                  <select
                    value={formData.submissionFormat}
                    onChange={(e) => updateFormData({ submissionFormat: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    {submissionFormats.map((format) => (
                      <option key={format.id} value={format.id}>
                        {format.label} - {format.description}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="submissionGuidelines">Submission Guidelines *</Label>
                  <Textarea
                    id="submissionGuidelines"
                    value={formData.submissionGuidelines}
                    onChange={(e) => updateFormData({ submissionGuidelines: e.target.value })}
                    placeholder="Detailed guidelines for submissions (file sizes, formats, content requirements, etc.)"
                    rows={4}
                    className={errors.submissionGuidelines ? 'border-red-500' : ''}
                  />
                  {errors.submissionGuidelines && <p className="text-sm text-red-500 mt-1">{errors.submissionGuidelines}</p>}
                </div>

                <div>
                  <Label>Judging Criteria *</Label>
                  <div className="space-y-2">
                    <div className="flex gap-2">
                      <Input
                        value={currentCriteria}
                        onChange={(e) => setCurrentCriteria(e.target.value)}
                        placeholder="Add judging criteria..."
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addCriteria();
                          }
                        }}
                      />
                      <Button type="button" variant="outline" onClick={addCriteria}>
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {formData.judgingCriteria.map((criteria) => (
                        <Badge key={criteria} variant="secondary" className="flex items-center gap-1">
                          {criteria}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-auto w-auto p-0 ml-1"
                            onClick={() => removeCriteria(criteria)}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                  {errors.judgingCriteria && <p className="text-sm text-red-500 mt-1">{errors.judgingCriteria}</p>}
                </div>
              </div>
            </div>
          </div>
        );

      case 4: // Promotion & Launch
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="featured"
                    checked={formData.featured}
                    onCheckedChange={(checked) => updateFormData({ featured: checked })}
                  />
                  <Label htmlFor="featured">Request featured placement</Label>
                </div>

                <div>
                  <Label>Social Media Promotion</Label>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="twitter"
                        checked={formData.socialPromotions.twitter}
                        onCheckedChange={(checked) => updateFormData({
                          socialPromotions: { ...formData.socialPromotions, twitter: checked }
                        })}
                      />
                      <Label htmlFor="twitter">Promote on Twitter</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="instagram"
                        checked={formData.socialPromotions.instagram}
                        onCheckedChange={(checked) => updateFormData({
                          socialPromotions: { ...formData.socialPromotions, instagram: checked }
                        })}
                      />
                      <Label htmlFor="instagram">Promote on Instagram</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="facebook"
                        checked={formData.socialPromotions.facebook}
                        onCheckedChange={(checked) => updateFormData({
                          socialPromotions: { ...formData.socialPromotions, facebook: checked }
                        })}
                      />
                      <Label htmlFor="facebook">Promote on Facebook</Label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label>Collaborators (optional)</Label>
                  <Input
                    placeholder="Add collaborator usernames..."
                    // Add collaborator functionality here
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Invite other creators to help promote and judge this challenge
                  </p>
                </div>
              </div>
            </div>

            {/* Launch Preview */}
            <Card className="bg-green-50 border-green-200">
              <CardHeader>
                <CardTitle className="text-sm flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Ready to Launch
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Challenge details complete</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Timeline configured</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Prize information set</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span>Rules and guidelines defined</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">
          {mode === 'create' ? 'Create New Challenge' : 'Edit Challenge'}
        </h2>
        <p className="text-gray-600">
          Design an engaging challenge that brings the community together
        </p>
      </div>

      {/* Progress Steps */}
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
              index <= currentStep
                ? "bg-purple-600 text-white"
                : "bg-gray-200 text-gray-600"
            )}>
              {index + 1}
            </div>
            {index < steps.length - 1 && (
              <div className={cn(
                "w-16 h-1 mx-2",
                index < currentStep ? "bg-purple-600" : "bg-gray-200"
              )} />
            )}
          </div>
        ))}
      </div>

      <div className="text-center">
        <h3 className="font-semibold">{steps[currentStep].title}</h3>
        <p className="text-sm text-gray-600">{steps[currentStep].description}</p>
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {currentStep > 0 && (
            <Button variant="outline" onClick={prevStep}>
              <ChevronLeft className="h-4 w-4 mr-1" />
              Previous
            </Button>
          )}
          {onCancel && (
            <Button variant="ghost" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleSave}>
            <Save className="h-4 w-4 mr-1" />
            Save Draft
          </Button>
          
          {currentStep < steps.length - 1 ? (
            <Button onClick={nextStep}>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          ) : (
            <Button onClick={handlePublish} className="bg-gradient-to-r from-purple-600 to-pink-600">
              <Send className="h-4 w-4 mr-1" />
              Publish Challenge
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}