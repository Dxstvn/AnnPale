'use client';

import * as React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  ChevronRight,
  ChevronLeft,
  Check,
  AlertCircle,
  Save,
  Eye,
  Rocket,
  Calendar,
  Ticket,
  Settings,
  Megaphone,
  FileCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

// Import step components
import { EventBasicDetailsStep } from './wizard-steps/basic-details-step';
import { EventScheduleStep } from './wizard-steps/schedule-step';
import { EventTicketsStep } from './wizard-steps/tickets-step';
import { EventDetailsStep } from './wizard-steps/event-details-step';
import { EventPromotionStep } from './wizard-steps/promotion-step';
import { EventReviewStep } from './wizard-steps/review-step';

export interface EventData {
  // Basic Details
  title: string;
  type: string;
  description: string;
  bannerUrl?: string;
  videoUrl?: string;
  category: string;
  tags: string[];

  // Schedule
  date: Date | undefined;
  time: string;
  timezone: string;
  duration: number;
  isRecurring: boolean;
  recurringSchedule?: {
    frequency: 'daily' | 'weekly' | 'monthly';
    endDate: Date;
    daysOfWeek?: number[];
  };
  registrationDeadline?: Date;

  // Tickets & Pricing
  tickets: {
    tierId: string;
    name: string;
    price: number;
    capacity: number;
    perks: string[];
  }[];
  groupDiscount?: {
    enabled: boolean;
    minQuantity: number;
    discountPercent: number;
  };
  promoCodes?: {
    code: string;
    discount: number;
    type: 'percentage' | 'fixed';
    limit?: number;
  }[];

  // Event Details
  agenda: {
    time: string;
    title: string;
    description: string;
  }[];
  requirements: string[];
  languages: string[];
  ageRestriction?: number;
  technicalNeeds: string[];
  
  // Configuration
  accessType: 'public' | 'private' | 'unlisted';
  recordingAllowed: boolean;
  replayAvailable: boolean;
  interactionLevel: 'full' | 'limited' | 'view-only';
  cancellationPolicy: 'refundable' | 'final';

  // Promotion
  seoTitle?: string;
  seoDescription?: string;
  socialShareText?: string;
  emailBlastEnabled: boolean;
  featuredListing: boolean;
  affiliateProgram: boolean;
  affiliateCommission?: number;
}

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  component: React.ComponentType<any>;
  validation?: (data: EventData) => string[];
}

const WIZARD_STEPS: WizardStep[] = [
  {
    id: 'basic',
    title: 'Basic Details',
    description: 'Event title, type, and description',
    icon: FileCheck,
    component: EventBasicDetailsStep,
    validation: (data) => {
      const errors = [];
      if (!data.title) errors.push('Event title is required');
      if (!data.type) errors.push('Event type is required');
      if (!data.description) errors.push('Event description is required');
      if (!data.category) errors.push('Event category is required');
      return errors;
    }
  },
  {
    id: 'schedule',
    title: 'Schedule',
    description: 'Date, time, and duration',
    icon: Calendar,
    component: EventScheduleStep,
    validation: (data) => {
      const errors = [];
      if (!data.date) errors.push('Event date is required');
      if (!data.time) errors.push('Event time is required');
      if (!data.duration) errors.push('Event duration is required');
      if (!data.timezone) errors.push('Timezone is required');
      return errors;
    }
  },
  {
    id: 'tickets',
    title: 'Tickets & Pricing',
    description: 'Ticket tiers and pricing',
    icon: Ticket,
    component: EventTicketsStep,
    validation: (data) => {
      const errors = [];
      if (!data.tickets || data.tickets.length === 0) {
        errors.push('At least one ticket tier is required');
      }
      return errors;
    }
  },
  {
    id: 'details',
    title: 'Event Details',
    description: 'Agenda, requirements, and settings',
    icon: Settings,
    component: EventDetailsStep,
    validation: (data) => {
      const errors = [];
      if (!data.languages || data.languages.length === 0) {
        errors.push('At least one language is required');
      }
      return errors;
    }
  },
  {
    id: 'promotion',
    title: 'Promotion',
    description: 'Marketing and visibility settings',
    icon: Megaphone,
    component: EventPromotionStep
  },
  {
    id: 'review',
    title: 'Review & Publish',
    description: 'Final review and publishing',
    icon: Rocket,
    component: EventReviewStep,
    validation: (data) => {
      // Final validation - check all required fields
      const errors = [];
      if (!data.title) errors.push('Event title is missing');
      if (!data.date) errors.push('Event date is missing');
      if (!data.tickets || data.tickets.length === 0) {
        errors.push('No tickets configured');
      }
      return errors;
    }
  }
];

interface EventCreationWizardProps {
  initialData?: Partial<EventData>;
  template?: string;
  onSave?: (data: EventData, isDraft: boolean) => void;
  onPublish?: (data: EventData) => void;
  onCancel?: () => void;
  className?: string;
}

export function EventCreationWizard({
  initialData = {},
  template,
  onSave,
  onPublish,
  onCancel,
  className
}: EventCreationWizardProps) {
  const [currentStep, setCurrentStep] = React.useState(0);
  const [eventData, setEventData] = React.useState<EventData>({
    title: '',
    type: template || '',
    description: '',
    category: '',
    tags: [],
    date: undefined,
    time: '',
    timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    duration: 60,
    isRecurring: false,
    tickets: [],
    languages: ['English'],
    requirements: [],
    technicalNeeds: [],
    agenda: [],
    accessType: 'public',
    recordingAllowed: true,
    replayAvailable: true,
    interactionLevel: 'full',
    cancellationPolicy: 'refundable',
    emailBlastEnabled: false,
    featuredListing: false,
    affiliateProgram: false,
    ...initialData
  });
  const [errors, setErrors] = React.useState<string[]>([]);
  const [isValidating, setIsValidating] = React.useState(false);
  const [completedSteps, setCompletedSteps] = React.useState<Set<number>>(new Set());

  const currentStepData = WIZARD_STEPS[currentStep];
  const StepComponent = currentStepData.component;
  const progress = ((currentStep + 1) / WIZARD_STEPS.length) * 100;

  const validateStep = (stepIndex: number): string[] => {
    const step = WIZARD_STEPS[stepIndex];
    if (step.validation) {
      return step.validation(eventData);
    }
    return [];
  };

  const handleNext = async () => {
    setIsValidating(true);
    const stepErrors = validateStep(currentStep);
    
    if (stepErrors.length > 0) {
      setErrors(stepErrors);
      setIsValidating(false);
      return;
    }

    setErrors([]);
    setCompletedSteps(prev => new Set(prev).add(currentStep));
    
    if (currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
    setIsValidating(false);
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setErrors([]);
    }
  };

  const handleStepClick = (index: number) => {
    // Allow navigation to completed steps or the next step
    if (completedSteps.has(index) || index <= currentStep) {
      setCurrentStep(index);
      setErrors([]);
    }
  };

  const handleDataUpdate = (updates: Partial<EventData>) => {
    setEventData(prev => ({ ...prev, ...updates }));
    // Clear errors when data is updated
    if (errors.length > 0) {
      setErrors([]);
    }
  };

  const handleSaveDraft = () => {
    onSave?.(eventData, true);
  };

  const handlePublishEvent = () => {
    // Validate all steps
    const allErrors: string[] = [];
    WIZARD_STEPS.forEach((step, index) => {
      const stepErrors = validateStep(index);
      if (stepErrors.length > 0) {
        allErrors.push(`${step.title}: ${stepErrors.join(', ')}`);
      }
    });

    if (allErrors.length > 0) {
      setErrors(allErrors);
      return;
    }

    onPublish?.(eventData);
  };

  return (
    <div className={cn("max-w-6xl mx-auto", className)}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold">Create New Event</h1>
            <p className="text-gray-600 mt-1">
              Follow the steps to set up your event
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleSaveDraft}>
              <Save className="h-4 w-4 mr-2" />
              Save Draft
            </Button>
            <Button variant="outline" onClick={onCancel}>
              Cancel
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Step {currentStep + 1} of {WIZARD_STEPS.length}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      {/* Steps Navigation */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          {WIZARD_STEPS.map((step, index) => {
            const Icon = step.icon;
            const isActive = index === currentStep;
            const isCompleted = completedSteps.has(index);
            const isClickable = isCompleted || index <= currentStep;

            return (
              <React.Fragment key={step.id}>
                <button
                  onClick={() => isClickable && handleStepClick(index)}
                  disabled={!isClickable}
                  className={cn(
                    "flex flex-col items-center gap-2 p-3 rounded-lg transition-all",
                    isActive && "bg-primary/10",
                    isClickable && "cursor-pointer hover:bg-gray-50",
                    !isClickable && "opacity-50 cursor-not-allowed"
                  )}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-full flex items-center justify-center transition-colors",
                      isActive && "bg-primary text-white",
                      isCompleted && !isActive && "bg-green-500 text-white",
                      !isActive && !isCompleted && "bg-gray-200 text-gray-600"
                    )}
                  >
                    {isCompleted && !isActive ? (
                      <Check className="h-5 w-5" />
                    ) : (
                      <Icon className="h-5 w-5" />
                    )}
                  </div>
                  <div className="text-center">
                    <p className={cn(
                      "text-xs font-medium",
                      isActive && "text-primary",
                      !isActive && "text-gray-600"
                    )}>
                      {step.title}
                    </p>
                  </div>
                </button>
                {index < WIZARD_STEPS.length - 1 && (
                  <ChevronRight className="h-5 w-5 text-gray-400 flex-shrink-0" />
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Error Messages */}
      {errors.length > 0 && (
        <Card className="mb-6 border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">Please fix the following errors:</p>
                <ul className="mt-2 space-y-1">
                  {errors.map((error, index) => (
                    <li key={index} className="text-sm text-red-700">
                      • {error}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step Content */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>{currentStepData.title}</CardTitle>
          <CardDescription>{currentStepData.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              <StepComponent
                data={eventData}
                onUpdate={handleDataUpdate}
                errors={errors}
              />
            </motion.div>
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 0}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous
        </Button>

        {currentStep === WIZARD_STEPS.length - 1 ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => {}}>
              <Eye className="h-4 w-4 mr-2" />
              Preview
            </Button>
            <Button onClick={handlePublishEvent}>
              <Rocket className="h-4 w-4 mr-2" />
              Publish Event
            </Button>
          </div>
        ) : (
          <Button onClick={handleNext} disabled={isValidating}>
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        )}
      </div>
    </div>
  );
}