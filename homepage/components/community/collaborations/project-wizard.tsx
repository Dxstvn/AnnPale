'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  ChevronLeft,
  ChevronRight,
  Save,
  Send,
  X,
  Plus,
  Minus,
  Calendar,
  DollarSign,
  Users,
  MapPin,
  Clock,
  Target,
  Zap,
  Star,
  GraduationCap,
  Briefcase,
  Palette,
  Camera,
  Handshake,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface ProjectFormData {
  // Basic Information
  title: string;
  description: string;
  category: 'creative' | 'business' | 'content' | 'events' | 'skills' | 'mentorship';
  type: 'quick-help' | 'short-project' | 'long-project' | 'ongoing' | 'mentorship';
  
  // Requirements
  skills: string[];
  experience: 'beginner' | 'intermediate' | 'advanced';
  commitment: 'low' | 'medium' | 'high';
  teamSize: number;
  location: 'remote' | 'local' | 'hybrid';
  
  // Timeline & Budget
  timeline: string;
  startDate: string;
  deadline?: string;
  estimatedDuration: string;
  budget?: string;
  compensation: 'paid' | 'equity' | 'profit-share' | 'volunteer' | 'skill-exchange';
  
  // Additional Details
  tags: string[];
  isUrgent: boolean;
  applicationDeadline?: string;
  additionalRequirements?: string;
  contactMethod: 'platform' | 'email' | 'phone';
  
  // Project Scope
  deliverables: string[];
  milestones: string[];
  successCriteria: string[];
}

interface ProjectWizardProps {
  mode?: 'create' | 'edit';
  initialData?: Partial<ProjectFormData>;
  onSave?: (data: ProjectFormData) => void;
  onPublish?: (data: ProjectFormData) => void;
  onCancel?: () => void;
}

export function ProjectWizard({
  mode = 'create',
  initialData,
  onSave,
  onPublish,
  onCancel
}: ProjectWizardProps) {
  const [currentStep, setCurrentStep] = React.useState(1);
  const [formData, setFormData] = React.useState<ProjectFormData>({
    title: '',
    description: '',
    category: 'creative',
    type: 'short-project',
    skills: [],
    experience: 'intermediate',
    commitment: 'medium',
    teamSize: 3,
    location: 'remote',
    timeline: '',
    startDate: '',
    estimatedDuration: '',
    compensation: 'paid',
    tags: [],
    isUrgent: false,
    contactMethod: 'platform',
    deliverables: [],
    milestones: [],
    successCriteria: [],
    ...initialData
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [newSkill, setNewSkill] = React.useState('');
  const [newTag, setNewTag] = React.useState('');
  const [newDeliverable, setNewDeliverable] = React.useState('');
  const [newMilestone, setNewMilestone] = React.useState('');
  const [newCriteria, setNewCriteria] = React.useState('');

  const steps = [
    {
      id: 1,
      title: 'Basic Information',
      description: 'Project title, description, and category',
      icon: Info
    },
    {
      id: 2,
      title: 'Requirements',
      description: 'Skills, experience, and team needs',
      icon: Target
    },
    {
      id: 3,
      title: 'Timeline & Budget',
      description: 'Project duration and compensation',
      icon: Calendar
    },
    {
      id: 4,
      title: 'Project Details',
      description: 'Deliverables, milestones, and success criteria',
      icon: CheckCircle
    },
    {
      id: 5,
      title: 'Review & Publish',
      description: 'Review your project before publishing',
      icon: Send
    }
  ];

  const categories = [
    { id: 'creative', label: 'Creative Projects', icon: Palette },
    { id: 'business', label: 'Business Ventures', icon: Briefcase },
    { id: 'content', label: 'Content Creation', icon: Camera },
    { id: 'events', label: 'Event Planning', icon: Calendar },
    { id: 'skills', label: 'Skill Exchange', icon: Handshake },
    { id: 'mentorship', label: 'Mentorship', icon: GraduationCap }
  ];

  const projectTypes = [
    {
      id: 'quick-help',
      label: 'Quick Help',
      description: 'Get help with a specific task (<1 day)',
      duration: '<1 day',
      icon: Zap,
      successRate: '85%'
    },
    {
      id: 'short-project',
      label: 'Short Project',
      description: 'Complete a project in a week',
      duration: '1 week',
      icon: Clock,
      successRate: '70%'
    },
    {
      id: 'long-project',
      label: 'Long Project',
      description: 'Major project over a month',
      duration: '1+ month',
      icon: Target,
      successRate: '60%'
    },
    {
      id: 'ongoing',
      label: 'Ongoing',
      description: 'Continuous collaboration',
      duration: 'Continuous',
      icon: Users,
      successRate: '50%'
    },
    {
      id: 'mentorship',
      label: 'Mentorship',
      description: 'Long-term guidance and learning',
      duration: '3+ months',
      icon: GraduationCap,
      successRate: '75%'
    }
  ];

  const updateFormData = (field: keyof ProjectFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const addListItem = (field: 'skills' | 'tags' | 'deliverables' | 'milestones' | 'successCriteria', value: string) => {
    if (!value.trim()) return;
    
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], value.trim()]
    }));
    
    // Clear the input
    switch (field) {
      case 'skills': setNewSkill(''); break;
      case 'tags': setNewTag(''); break;
      case 'deliverables': setNewDeliverable(''); break;
      case 'milestones': setNewMilestone(''); break;
      case 'successCriteria': setNewCriteria(''); break;
    }
  };

  const removeListItem = (field: 'skills' | 'tags' | 'deliverables' | 'milestones' | 'successCriteria', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};

    switch (step) {
      case 1:
        if (!formData.title.trim()) newErrors.title = 'Title is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (formData.description.length < 50) newErrors.description = 'Description should be at least 50 characters';
        break;
      
      case 2:
        if (formData.skills.length === 0) newErrors.skills = 'At least one skill is required';
        if (formData.teamSize < 1) newErrors.teamSize = 'Team size must be at least 1';
        break;
      
      case 3:
        if (!formData.timeline.trim()) newErrors.timeline = 'Timeline is required';
        if (!formData.startDate) newErrors.startDate = 'Start date is required';
        if (!formData.estimatedDuration.trim()) newErrors.estimatedDuration = 'Estimated duration is required';
        break;
      
      case 4:
        if (formData.deliverables.length === 0) newErrors.deliverables = 'At least one deliverable is required';
        break;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, steps.length));
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSave = () => {
    onSave?.(formData);
  };

  const handlePublish = () => {
    if (validateStep(currentStep)) {
      onPublish?.(formData);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Project Title</label>
        <Input
          value={formData.title}
          onChange={(e) => updateFormData('title', e.target.value)}
          placeholder="Enter a clear, descriptive title..."
          className={errors.title ? 'border-red-500' : ''}
        />
        {errors.title && (
          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <Textarea
          value={formData.description}
          onChange={(e) => updateFormData('description', e.target.value)}
          placeholder="Describe your project in detail. What are you trying to achieve? What kind of help do you need?"
          rows={6}
          className={errors.description ? 'border-red-500' : ''}
        />
        <div className="flex justify-between items-center mt-1">
          {errors.description ? (
            <p className="text-red-500 text-sm">{errors.description}</p>
          ) : (
            <p className="text-gray-500 text-sm">
              {formData.description.length}/500 characters (minimum 50)
            </p>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-3">Category</label>
        <div className="grid md:grid-cols-2 gap-3">
          {categories.map((category) => (
            <div
              key={category.id}
              className={cn(
                "p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md",
                formData.category === category.id
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 hover:border-gray-300"
              )}
              onClick={() => updateFormData('category', category.id)}
            >
              <div className="flex items-center gap-3">
                <category.icon className="h-5 w-5" />
                <span className="font-medium">{category.label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-3">Project Type</label>
        <div className="space-y-3">
          {projectTypes.map((type) => (
            <div
              key={type.id}
              className={cn(
                "p-4 border rounded-lg cursor-pointer transition-all hover:shadow-md",
                formData.type === type.id
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 hover:border-gray-300"
              )}
              onClick={() => updateFormData('type', type.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <type.icon className="h-5 w-5" />
                  <div>
                    <div className="font-medium">{type.label}</div>
                    <div className="text-sm text-gray-600">{type.description}</div>
                  </div>
                </div>
                <div className="text-right text-sm">
                  <div className="text-gray-600">{type.duration}</div>
                  <div className="text-green-600">{type.successRate} success</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Required Skills</label>
        <div className="flex gap-2 mb-3">
          <Input
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            placeholder="Add a required skill..."
            onKeyPress={(e) => e.key === 'Enter' && addListItem('skills', newSkill)}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => addListItem('skills', newSkill)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.skills.map((skill, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {skill}
              <X
                className="h-3 w-3 cursor-pointer hover:text-red-600"
                onClick={() => removeListItem('skills', index)}
              />
            </Badge>
          ))}
        </div>
        {errors.skills && (
          <p className="text-red-500 text-sm mt-1">{errors.skills}</p>
        )}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Experience Level</label>
          <select
            value={formData.experience}
            onChange={(e) => updateFormData('experience', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Commitment Level</label>
          <select
            value={formData.commitment}
            onChange={(e) => updateFormData('commitment', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="low">Low (Few hours)</option>
            <option value="medium">Medium (Part-time)</option>
            <option value="high">High (Full-time)</option>
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Team Size</label>
          <Input
            type="number"
            min="1"
            max="50"
            value={formData.teamSize}
            onChange={(e) => updateFormData('teamSize', parseInt(e.target.value) || 1)}
            className={errors.teamSize ? 'border-red-500' : ''}
          />
          {errors.teamSize && (
            <p className="text-red-500 text-sm mt-1">{errors.teamSize}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Location</label>
          <select
            value={formData.location}
            onChange={(e) => updateFormData('location', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          >
            <option value="remote">Remote</option>
            <option value="local">Local/In-person</option>
            <option value="hybrid">Hybrid</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Timeline</label>
          <Input
            value={formData.timeline}
            onChange={(e) => updateFormData('timeline', e.target.value)}
            placeholder="e.g., 2 weeks, 3 months"
            className={errors.timeline ? 'border-red-500' : ''}
          />
          {errors.timeline && (
            <p className="text-red-500 text-sm mt-1">{errors.timeline}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Estimated Duration</label>
          <Input
            value={formData.estimatedDuration}
            onChange={(e) => updateFormData('estimatedDuration', e.target.value)}
            placeholder="e.g., 40 hours total, 10 hours/week"
            className={errors.estimatedDuration ? 'border-red-500' : ''}
          />
          {errors.estimatedDuration && (
            <p className="text-red-500 text-sm mt-1">{errors.estimatedDuration}</p>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Start Date</label>
          <Input
            type="date"
            value={formData.startDate}
            onChange={(e) => updateFormData('startDate', e.target.value)}
            className={errors.startDate ? 'border-red-500' : ''}
          />
          {errors.startDate && (
            <p className="text-red-500 text-sm mt-1">{errors.startDate}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">Application Deadline (Optional)</label>
          <Input
            type="date"
            value={formData.applicationDeadline || ''}
            onChange={(e) => updateFormData('applicationDeadline', e.target.value)}
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Compensation Type</label>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { id: 'paid', label: 'Paid', description: 'Fixed payment for work' },
            { id: 'equity', label: 'Equity', description: 'Ownership stake in project' },
            { id: 'profit-share', label: 'Profit Share', description: 'Share of future profits' },
            { id: 'volunteer', label: 'Volunteer', description: 'No monetary compensation' },
            { id: 'skill-exchange', label: 'Skill Exchange', description: 'Trade skills and services' }
          ].map((comp) => (
            <div
              key={comp.id}
              className={cn(
                "p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md",
                formData.compensation === comp.id
                  ? "border-purple-500 bg-purple-50"
                  : "border-gray-200 hover:border-gray-300"
              )}
              onClick={() => updateFormData('compensation', comp.id)}
            >
              <div className="font-medium">{comp.label}</div>
              <div className="text-sm text-gray-600">{comp.description}</div>
            </div>
          ))}
        </div>
      </div>

      {formData.compensation === 'paid' && (
        <div>
          <label className="block text-sm font-medium mb-2">Budget Range</label>
          <Input
            value={formData.budget || ''}
            onChange={(e) => updateFormData('budget', e.target.value)}
            placeholder="e.g., $500-1000, $50/hour"
          />
        </div>
      )}

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="urgent"
          checked={formData.isUrgent}
          onChange={(e) => updateFormData('isUrgent', e.target.checked)}
        />
        <label htmlFor="urgent" className="text-sm font-medium">
          This is an urgent project
        </label>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Deliverables</label>
        <div className="flex gap-2 mb-3">
          <Input
            value={newDeliverable}
            onChange={(e) => setNewDeliverable(e.target.value)}
            placeholder="Add a project deliverable..."
            onKeyPress={(e) => e.key === 'Enter' && addListItem('deliverables', newDeliverable)}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => addListItem('deliverables', newDeliverable)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2">
          {formData.deliverables.map((deliverable, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span>{deliverable}</span>
              <X
                className="h-4 w-4 cursor-pointer hover:text-red-600"
                onClick={() => removeListItem('deliverables', index)}
              />
            </div>
          ))}
        </div>
        {errors.deliverables && (
          <p className="text-red-500 text-sm mt-1">{errors.deliverables}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Project Milestones (Optional)</label>
        <div className="flex gap-2 mb-3">
          <Input
            value={newMilestone}
            onChange={(e) => setNewMilestone(e.target.value)}
            placeholder="Add a project milestone..."
            onKeyPress={(e) => e.key === 'Enter' && addListItem('milestones', newMilestone)}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => addListItem('milestones', newMilestone)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2">
          {formData.milestones.map((milestone, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span>{milestone}</span>
              <X
                className="h-4 w-4 cursor-pointer hover:text-red-600"
                onClick={() => removeListItem('milestones', index)}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Success Criteria (Optional)</label>
        <div className="flex gap-2 mb-3">
          <Input
            value={newCriteria}
            onChange={(e) => setNewCriteria(e.target.value)}
            placeholder="Add success criteria..."
            onKeyPress={(e) => e.key === 'Enter' && addListItem('successCriteria', newCriteria)}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => addListItem('successCriteria', newCriteria)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="space-y-2">
          {formData.successCriteria.map((criteria, index) => (
            <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
              <span>{criteria}</span>
              <X
                className="h-4 w-4 cursor-pointer hover:text-red-600"
                onClick={() => removeListItem('successCriteria', index)}
              />
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Project Tags (Optional)</label>
        <div className="flex gap-2 mb-3">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="Add tags to help people find your project..."
            onKeyPress={(e) => e.key === 'Enter' && addListItem('tags', newTag)}
          />
          <Button
            type="button"
            variant="outline"
            onClick={() => addListItem('tags', newTag)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              #{tag}
              <X
                className="h-3 w-3 cursor-pointer hover:text-red-600"
                onClick={() => removeListItem('tags', index)}
              />
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Additional Requirements (Optional)</label>
        <Textarea
          value={formData.additionalRequirements || ''}
          onChange={(e) => updateFormData('additionalRequirements', e.target.value)}
          placeholder="Any other requirements or information for potential collaborators..."
          rows={3}
        />
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Project Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg">{formData.title}</h3>
            <p className="text-gray-600 mt-1">{formData.description}</p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="font-medium">Category:</span> {categories.find(c => c.id === formData.category)?.label}
            </div>
            <div>
              <span className="font-medium">Type:</span> {projectTypes.find(t => t.id === formData.type)?.label}
            </div>
            <div>
              <span className="font-medium">Timeline:</span> {formData.timeline}
            </div>
            <div>
              <span className="font-medium">Team Size:</span> {formData.teamSize} people
            </div>
            <div>
              <span className="font-medium">Experience:</span> {formData.experience}
            </div>
            <div>
              <span className="font-medium">Commitment:</span> {formData.commitment}
            </div>
            <div>
              <span className="font-medium">Location:</span> {formData.location}
            </div>
            <div>
              <span className="font-medium">Compensation:</span> {formData.compensation.replace('-', ' ')}
            </div>
          </div>

          {formData.skills.length > 0 && (
            <div>
              <span className="font-medium">Required Skills:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {formData.skills.map((skill, index) => (
                  <Badge key={index} variant="outline">{skill}</Badge>
                ))}
              </div>
            </div>
          )}

          {formData.deliverables.length > 0 && (
            <div>
              <span className="font-medium">Deliverables:</span>
              <ul className="list-disc list-inside mt-1 text-sm">
                {formData.deliverables.map((deliverable, index) => (
                  <li key={index}>{deliverable}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Info className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <h4 className="font-medium text-blue-900">Before Publishing</h4>
            <p className="text-blue-700 text-sm mt-1">
              Make sure all information is accurate. You can edit your project after publishing, 
              but major changes may affect existing applications.
            </p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">
            {mode === 'edit' ? 'Edit Project' : 'Create New Project'}
          </h2>
          <p className="text-gray-600">Step {currentStep} of {steps.length}</p>
        </div>
        <Button variant="ghost" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {steps.map((step) => (
            <div
              key={step.id}
              className={cn(
                "flex items-center gap-2 text-sm",
                currentStep === step.id
                  ? "text-purple-600 font-medium"
                  : currentStep > step.id
                  ? "text-green-600"
                  : "text-gray-400"
              )}
            >
              <div className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-xs",
                currentStep === step.id
                  ? "bg-purple-600 text-white"
                  : currentStep > step.id
                  ? "bg-green-600 text-white"
                  : "bg-gray-200 text-gray-600"
              )}>
                {currentStep > step.id ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  step.id
                )}
              </div>
              <div className="hidden sm:block">
                <div>{step.title}</div>
                <div className="text-xs text-gray-500">{step.description}</div>
              </div>
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
      </div>

      {/* Step Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {React.createElement(steps[currentStep - 1].icon, { className: "h-5 w-5" })}
            {steps[currentStep - 1].title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
              {currentStep === 4 && renderStep4()}
              {currentStep === 5 && renderStep5()}
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Save Draft
          </Button>
          
          {currentStep === steps.length ? (
            <Button onClick={handlePublish} className="bg-gradient-to-r from-purple-600 to-pink-600">
              <Send className="h-4 w-4 mr-2" />
              Publish Project
            </Button>
          ) : (
            <Button onClick={nextStep}>
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}