'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy,
  Crown,
  Users,
  Clock,
  Star,
  Gift,
  Calendar,
  CheckCircle,
  AlertCircle,
  Upload,
  Video,
  Image as ImageIcon,
  Mic,
  FileText,
  Play,
  Pause,
  Square,
  RotateCcw,
  Send,
  Save,
  Eye,
  Heart,
  MessageSquare,
  Share2,
  Target,
  Zap,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Info,
  Lightbulb,
  Award,
  Sparkles,
  Camera
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface Challenge {
  id: string;
  title: string;
  description: string;
  type: 'creative' | 'skill' | 'knowledge' | 'physical' | 'social' | 'charitable';
  creator: {
    id: string;
    name: string;
    avatar: string;
    verified: boolean;
  };
  prize: {
    type: 'money' | 'product' | 'experience' | 'recognition';
    value: string;
    description: string;
  };
  timeline: {
    startDate: Date;
    endDate: Date;
    votingEndDate: Date;
  };
  rules: string[];
  submissionFormat: 'video' | 'image' | 'text' | 'audio' | 'mixed';
  submissionGuidelines: string;
  judgingCriteria: string[];
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  participation: {
    current: number;
    limit?: number;
    userStatus: 'not_joined' | 'joined' | 'submitted' | 'withdrawn';
  };
}

interface SubmissionData {
  title: string;
  description: string;
  content: {
    type: 'video' | 'image' | 'text' | 'audio' | 'mixed';
    files: File[];
    text?: string;
    urls?: string[];
  };
  tags: string[];
  isPublic: boolean;
  allowComments: boolean;
  agreeToTerms: boolean;
}

interface ChallengeParticipationFlowProps {
  challenge: Challenge;
  currentStep?: 'overview' | 'join' | 'create' | 'submit' | 'complete';
  onJoin?: (challengeId: string) => void;
  onSubmit?: (challengeId: string, submission: SubmissionData) => void;
  onWithdraw?: (challengeId: string) => void;
  onShare?: (challengeId: string) => void;
  userRole?: 'member' | 'creator' | 'moderator' | 'admin';
  isAuthenticated?: boolean;
}

export function ChallengeParticipationFlow({
  challenge,
  currentStep = 'overview',
  onJoin,
  onSubmit,
  onWithdraw,
  onShare,
  userRole = 'member',
  isAuthenticated = false
}: ChallengeParticipationFlowProps) {
  const [activeStep, setActiveStep] = React.useState(currentStep);
  const [submissionData, setSubmissionData] = React.useState<SubmissionData>({
    title: '',
    description: '',
    content: {
      type: challenge.submissionFormat,
      files: [],
      text: '',
      urls: []
    },
    tags: [],
    isPublic: true,
    allowComments: true,
    agreeToTerms: false
  });
  const [isRecording, setIsRecording] = React.useState(false);
  const [recordingTime, setRecordingTime] = React.useState(0);
  const [currentTag, setCurrentTag] = React.useState('');
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [uploadProgress, setUploadProgress] = React.useState(0);

  const steps = [
    { id: 'overview', title: 'Challenge Overview', description: 'Learn about the challenge' },
    { id: 'join', title: 'Join Challenge', description: 'Confirm participation' },
    { id: 'create', title: 'Create Submission', description: 'Prepare your entry' },
    { id: 'submit', title: 'Submit Entry', description: 'Finalize submission' },
    { id: 'complete', title: 'Complete', description: 'Submission received' }
  ];

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => step.id === activeStep);
  };

  const formatTimeRemaining = (endDate: Date) => {
    const now = new Date();
    const diffInMs = endDate.getTime() - now.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    const diffInHours = Math.floor((diffInMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (diffInDays > 0) {
      return `${diffInDays} days, ${diffInHours} hours`;
    } else if (diffInHours > 0) {
      return `${diffInHours} hours`;
    } else {
      return 'Less than 1 hour';
    }
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files) return;
    
    const fileArray = Array.from(files);
    setSubmissionData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        files: [...prev.content.files, ...fileArray]
      }
    }));

    // Simulate upload progress
    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const removeFile = (index: number) => {
    setSubmissionData(prev => ({
      ...prev,
      content: {
        ...prev.content,
        files: prev.content.files.filter((_, i) => i !== index)
      }
    }));
  };

  const addTag = () => {
    if (currentTag.trim() && !submissionData.tags.includes(currentTag.trim().toLowerCase())) {
      setSubmissionData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim().toLowerCase()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setSubmissionData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const validateSubmission = () => {
    const newErrors: Record<string, string> = {};

    if (!submissionData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!submissionData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (challenge.submissionFormat !== 'text' && submissionData.content.files.length === 0) {
      newErrors.files = 'At least one file is required';
    }
    if (challenge.submissionFormat === 'text' && !submissionData.content.text?.trim()) {
      newErrors.text = 'Text content is required';
    }
    if (!submissionData.agreeToTerms) {
      newErrors.terms = 'You must agree to the terms and conditions';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validateSubmission()) {
      onSubmit?.(challenge.id, submissionData);
      setActiveStep('complete');
    }
  };

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Challenge Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">{challenge.title}</h1>
        <p className="text-gray-600 text-lg">{challenge.description}</p>
      </div>

      {/* Creator Info */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage src={challenge.creator.avatar} />
              <AvatarFallback>{challenge.creator.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">Created by {challenge.creator.name}</h3>
              {challenge.creator.verified && (
                <Badge variant="outline" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                  Verified Creator
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Key Details */}
      <div className="grid md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Gift className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Prize</h3>
            <p className="text-2xl font-bold text-yellow-600">{challenge.prize.value}</p>
            <p className="text-sm text-gray-600">{challenge.prize.description}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-8 w-8 text-red-600 mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Time Left</h3>
            <p className="text-lg font-bold text-red-600">
              {formatTimeRemaining(challenge.timeline.endDate)}
            </p>
            <p className="text-sm text-gray-600">to submit</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Users className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold mb-1">Participants</h3>
            <p className="text-2xl font-bold text-blue-600">{challenge.participation.current}</p>
            <p className="text-sm text-gray-600">
              {challenge.participation.limit ? `of ${challenge.participation.limit}` : 'unlimited'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Challenge Rules */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Challenge Rules
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {challenge.rules.map((rule, index) => (
              <li key={index} className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span className="text-sm">{rule}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Submission Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            Submission Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-700 mb-4">{challenge.submissionGuidelines}</p>
          <div className="space-y-2">
            <h4 className="font-semibold text-sm">Judging Criteria:</h4>
            <div className="flex flex-wrap gap-2">
              {challenge.judgingCriteria.map((criteria) => (
                <Badge key={criteria} variant="outline" className="text-xs">
                  {criteria}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4">
        {!isAuthenticated ? (
          <Button size="lg" className="bg-gradient-to-r from-purple-600 to-pink-600">
            Sign In to Join Challenge
          </Button>
        ) : challenge.participation.userStatus === 'not_joined' ? (
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-purple-600 to-pink-600"
            onClick={() => setActiveStep('join')}
          >
            <Trophy className="h-5 w-5 mr-2" />
            Join Challenge
          </Button>
        ) : challenge.participation.userStatus === 'joined' ? (
          <Button 
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-purple-600"
            onClick={() => setActiveStep('create')}
          >
            <Sparkles className="h-5 w-5 mr-2" />
            Create Submission
          </Button>
        ) : challenge.participation.userStatus === 'submitted' ? (
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-green-600 mb-2">
              <CheckCircle className="h-6 w-6" />
              <span className="font-semibold">Submission Complete</span>
            </div>
            <p className="text-sm text-gray-600">
              Your entry has been submitted successfully
            </p>
          </div>
        ) : null}
        
        <Button variant="outline" onClick={() => onShare?.(challenge.id)}>
          <Share2 className="h-4 w-4 mr-2" />
          Share Challenge
        </Button>
      </div>
    </div>
  );

  const renderJoin = () => (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center">
        <Trophy className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Join {challenge.title}</h2>
        <p className="text-gray-600">
          Ready to take on this challenge? Here's what you need to know before joining.
        </p>
      </div>

      {/* Commitment Overview */}
      <Card>
        <CardHeader>
          <CardTitle>What You're Committing To</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-start gap-3">
            <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold">Timeline</h4>
              <p className="text-sm text-gray-600">
                Submit your entry by {challenge.timeline.endDate.toLocaleDateString()}
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <Target className="h-5 w-5 text-green-600 mt-0.5" />
            <div>
              <h4 className="font-semibold">Requirements</h4>
              <p className="text-sm text-gray-600">
                Follow all challenge rules and submission guidelines
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <h4 className="font-semibold">Community</h4>
              <p className="text-sm text-gray-600">
                Engage respectfully with other participants and voters
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips for Success */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900">
            <Lightbulb className="h-5 w-5" />
            Tips for Success
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm text-blue-800">
            <li className="flex items-start gap-2">
              <Star className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>Read all rules carefully before creating your submission</span>
            </li>
            <li className="flex items-start gap-2">
              <Star className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>Focus on the judging criteria when planning your entry</span>
            </li>
            <li className="flex items-start gap-2">
              <Star className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>Submit early to avoid last-minute technical issues</span>
            </li>
            <li className="flex items-start gap-2">
              <Star className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span>Engage with the community by voting on other submissions</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4">
        <Button variant="outline" onClick={() => setActiveStep('overview')}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Overview
        </Button>
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-purple-600 to-pink-600"
          onClick={() => {
            onJoin?.(challenge.id);
            setActiveStep('create');
          }}
        >
          <Trophy className="h-5 w-5 mr-2" />
          Confirm & Join Challenge
        </Button>
      </div>
    </div>
  );

  const renderCreate = () => (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="text-center">
        <Sparkles className="h-16 w-16 text-purple-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Create Your Submission</h2>
        <p className="text-gray-600">
          Bring your creativity to life and make your mark in this challenge.
        </p>
      </div>

      {/* Submission Form */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="title">Submission Title *</Label>
            <Input
              id="title"
              value={submissionData.title}
              onChange={(e) => setSubmissionData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Give your submission a catchy title"
              className={errors.title ? 'border-red-500' : ''}
            />
            {errors.title && <p className="text-sm text-red-500 mt-1">{errors.title}</p>}
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={submissionData.description}
              onChange={(e) => setSubmissionData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe your submission and the story behind it"
              rows={4}
              className={errors.description ? 'border-red-500' : ''}
            />
            {errors.description && <p className="text-sm text-red-500 mt-1">{errors.description}</p>}
          </div>

          {challenge.submissionFormat === 'text' && (
            <div>
              <Label htmlFor="textContent">Text Content *</Label>
              <Textarea
                id="textContent"
                value={submissionData.content.text}
                onChange={(e) => setSubmissionData(prev => ({ 
                  ...prev, 
                  content: { ...prev.content, text: e.target.value }
                }))}
                placeholder="Write your submission content here"
                rows={8}
                className={errors.text ? 'border-red-500' : ''}
              />
              {errors.text && <p className="text-sm text-red-500 mt-1">{errors.text}</p>}
            </div>
          )}

          <div>
            <Label>Tags</Label>
            <div className="flex gap-2 mb-2">
              <Input
                value={currentTag}
                onChange={(e) => setCurrentTag(e.target.value)}
                placeholder="Add tags..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag();
                  }
                }}
              />
              <Button type="button" variant="outline" onClick={addTag}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {submissionData.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                  #{tag}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="h-auto w-auto p-0 ml-1"
                    onClick={() => removeTag(tag)}
                  >
                    ×
                  </Button>
                </Badge>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-4">
          {/* File Upload */}
          {challenge.submissionFormat !== 'text' && (
            <div>
              <Label>Upload Files *</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept={
                    challenge.submissionFormat === 'video' ? 'video/*' :
                    challenge.submissionFormat === 'image' ? 'image/*' :
                    challenge.submissionFormat === 'audio' ? 'audio/*' :
                    '*/*'
                  }
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {challenge.submissionFormat === 'video' && 'MP4, MOV, AVI up to 100MB'}
                    {challenge.submissionFormat === 'image' && 'JPG, PNG, GIF up to 10MB'}
                    {challenge.submissionFormat === 'audio' && 'MP3, WAV up to 50MB'}
                    {challenge.submissionFormat === 'mixed' && 'Any format up to 100MB total'}
                  </p>
                </label>
              </div>
              {errors.files && <p className="text-sm text-red-500 mt-1">{errors.files}</p>}

              {/* File List */}
              {submissionData.content.files.length > 0 && (
                <div className="space-y-2">
                  {submissionData.content.files.map((file, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                      <div className="flex items-center gap-2">
                        {file.type.startsWith('video/') && <Video className="h-4 w-4" />}
                        {file.type.startsWith('image/') && <ImageIcon className="h-4 w-4" />}
                        {file.type.startsWith('audio/') && <Mic className="h-4 w-4" />}
                        <span className="text-sm">{file.name}</span>
                        <span className="text-xs text-gray-500">
                          ({(file.size / 1024 / 1024).toFixed(1)} MB)
                        </span>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(index)}
                      >
                        ×
                      </Button>
                    </div>
                  ))}
                </div>
              )}

              {/* Upload Progress */}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Uploading...</span>
                    <span>{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} />
                </div>
              )}
            </div>
          )}

          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Privacy & Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Make submission public</span>
                <input
                  type="checkbox"
                  checked={submissionData.isPublic}
                  onChange={(e) => setSubmissionData(prev => ({ 
                    ...prev, 
                    isPublic: e.target.checked 
                  }))}
                  className="rounded"
                />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Allow comments</span>
                <input
                  type="checkbox"
                  checked={submissionData.allowComments}
                  onChange={(e) => setSubmissionData(prev => ({ 
                    ...prev, 
                    allowComments: e.target.checked 
                  }))}
                  className="rounded"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Preview */}
      {(submissionData.title || submissionData.description) && (
        <Card className="bg-gray-50">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <Eye className="h-4 w-4" />
              Preview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {submissionData.title && (
                <h3 className="font-semibold">{submissionData.title}</h3>
              )}
              {submissionData.description && (
                <p className="text-sm text-gray-600">{submissionData.description}</p>
              )}
              {submissionData.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {submissionData.tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      #{tag}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => setActiveStep('join')}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          <Button 
            onClick={() => setActiveStep('submit')}
            disabled={!submissionData.title || !submissionData.description}
          >
            Continue to Submit
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );

  const renderSubmit = () => (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="text-center">
        <Send className="h-16 w-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2">Submit Your Entry</h2>
        <p className="text-gray-600">
          Review your submission and confirm you're ready to enter the challenge.
        </p>
      </div>

      {/* Submission Review */}
      <Card>
        <CardHeader>
          <CardTitle>Submission Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="font-semibold">Title</h4>
            <p className="text-gray-700">{submissionData.title}</p>
          </div>
          <div>
            <h4 className="font-semibold">Description</h4>
            <p className="text-gray-700">{submissionData.description}</p>
          </div>
          {submissionData.content.files.length > 0 && (
            <div>
              <h4 className="font-semibold">Files</h4>
              <div className="space-y-1">
                {submissionData.content.files.map((file, index) => (
                  <div key={index} className="text-sm text-gray-600">
                    {file.name} ({(file.size / 1024 / 1024).toFixed(1)} MB)
                  </div>
                ))}
              </div>
            </div>
          )}
          {submissionData.tags.length > 0 && (
            <div>
              <h4 className="font-semibold">Tags</h4>
              <div className="flex flex-wrap gap-1">
                {submissionData.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    #{tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Terms Agreement */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={submissionData.agreeToTerms}
              onChange={(e) => setSubmissionData(prev => ({ 
                ...prev, 
                agreeToTerms: e.target.checked 
              }))}
              className="rounded mt-1"
            />
            <div className="text-sm">
              <p className="mb-2">
                I agree to the challenge terms and conditions, including:
              </p>
              <ul className="text-xs text-gray-600 space-y-1 ml-4">
                <li>• My submission follows all challenge rules</li>
                <li>• Content is original and I own all rights</li>
                <li>• I understand submissions may be public</li>
                <li>• I accept the judging process and results</li>
              </ul>
            </div>
          </div>
          {errors.terms && <p className="text-sm text-red-500 mt-2">{errors.terms}</p>}
        </CardContent>
      </Card>

      {/* Final Reminder */}
      <Card className="bg-yellow-50 border-yellow-200">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div className="text-sm">
              <h4 className="font-semibold text-yellow-800 mb-1">Before You Submit</h4>
              <ul className="text-yellow-700 space-y-1">
                <li>• Double-check your files are correctly uploaded</li>
                <li>• Review your title and description for typos</li>
                <li>• Ensure you've followed all challenge rules</li>
                <li>• Remember: you cannot edit after submitting</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => setActiveStep('create')}>
          <ChevronLeft className="h-4 w-4 mr-2" />
          Back to Edit
        </Button>
        <Button 
          size="lg"
          onClick={handleSubmit}
          disabled={!submissionData.agreeToTerms}
          className="bg-gradient-to-r from-green-600 to-blue-600"
        >
          <Send className="h-5 w-5 mr-2" />
          Submit Entry
        </Button>
      </div>
    </div>
  );

  const renderComplete = () => (
    <div className="space-y-6 max-w-2xl mx-auto text-center">
      <div>
        <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-4" />
        <h2 className="text-3xl font-bold mb-2">Submission Complete!</h2>
        <p className="text-gray-600 text-lg">
          Your entry has been successfully submitted to "{challenge.title}".
        </p>
      </div>

      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>What Happens Next?</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-left">
          <div className="flex items-start gap-3">
            <Eye className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="font-semibold">Review Period</h4>
              <p className="text-sm text-gray-600">
                Your submission will be reviewed and published to the gallery
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Users className="h-5 w-5 text-purple-600 mt-0.5" />
            <div>
              <h4 className="font-semibold">Voting Phase</h4>
              <p className="text-sm text-gray-600">
                Community members will vote on submissions starting {challenge.timeline.endDate.toLocaleDateString()}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <Trophy className="h-5 w-5 text-yellow-600 mt-0.5" />
            <div>
              <h4 className="font-semibold">Results</h4>
              <p className="text-sm text-gray-600">
                Winners will be announced on {challenge.timeline.votingEndDate.toLocaleDateString()}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-center gap-4">
        <Button size="lg" onClick={() => onShare?.(challenge.id)}>
          <Share2 className="h-5 w-5 mr-2" />
          Share Your Entry
        </Button>
        <Button variant="outline" onClick={() => setActiveStep('overview')}>
          Back to Challenge
        </Button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Header */}
      <div className="bg-white border-b sticky top-0 z-40">
        <div className="max-w-6xl mx-auto p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-bold">{challenge.title}</h1>
            <Badge 
              variant="outline" 
              className={cn(
                "capitalize",
                challenge.difficulty === 'beginner' && "bg-green-50 text-green-700",
                challenge.difficulty === 'intermediate' && "bg-yellow-50 text-yellow-700",
                challenge.difficulty === 'advanced' && "bg-red-50 text-red-700"
              )}
            >
              {challenge.difficulty}
            </Badge>
          </div>
          
          {/* Step Progress */}
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  index <= getCurrentStepIndex()
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-600"
                )}>
                  {index < getCurrentStepIndex() ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    index + 1
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={cn(
                    "w-16 h-1 mx-2",
                    index < getCurrentStepIndex() ? "bg-purple-600" : "bg-gray-200"
                  )} />
                )}
              </div>
            ))}
          </div>
          
          <div className="text-center mt-2">
            <span className="text-sm font-medium">{steps[getCurrentStepIndex()]?.title}</span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeStep === 'overview' && renderOverview()}
            {activeStep === 'join' && renderJoin()}
            {activeStep === 'create' && renderCreate()}
            {activeStep === 'submit' && renderSubmit()}
            {activeStep === 'complete' && renderComplete()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}