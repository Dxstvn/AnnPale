'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar,
  Clock,
  MapPin,
  Users,
  Video,
  Bell,
  BellOff,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info,
  Star,
  Heart,
  MessageSquare,
  Share2,
  Download,
  ExternalLink,
  Mail,
  Phone,
  User,
  Ticket,
  Gift,
  Sparkles,
  Shield,
  ChevronRight,
  Copy,
  QrCode,
  Send,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface EventDetails {
  id: string;
  title: string;
  description: string;
  date: Date;
  startTime: string;
  endTime: string;
  location: 'virtual' | 'hybrid' | 'in-person';
  locationDetails?: string;
  host: {
    id: string;
    name: string;
    avatar?: string;
    role?: string;
  };
  capacity?: number;
  registered: number;
  waitlist?: number;
  requirements?: string[];
  tags: string[];
  pointsReward?: number;
  featured?: boolean;
  premium?: boolean;
}

interface RSVPFormData {
  name: string;
  email: string;
  phone?: string;
  dietaryRestrictions?: string;
  accommodations?: string;
  guests?: number;
  questions?: string;
}

interface RegistrationStatus {
  isRegistered: boolean;
  registrationId?: string;
  position?: number;
  isWaitlisted?: boolean;
  qrCode?: string;
  confirmationEmail?: boolean;
}

interface EventRSVPProps {
  event: EventDetails;
  userId?: string;
  registrationStatus?: RegistrationStatus;
  onRSVP?: (formData: RSVPFormData) => void;
  onCancelRSVP?: () => void;
  onAddToCalendar?: () => void;
  onShareEvent?: () => void;
  onNotificationToggle?: (enabled: boolean) => void;
  showGuestOptions?: boolean;
  requiresApproval?: boolean;
}

export function EventRSVP({
  event,
  userId,
  registrationStatus = {
    isRegistered: false
  },
  onRSVP,
  onCancelRSVP,
  onAddToCalendar,
  onShareEvent,
  onNotificationToggle,
  showGuestOptions = true,
  requiresApproval = false
}: EventRSVPProps) {
  const [formData, setFormData] = React.useState<RSVPFormData>({
    name: '',
    email: '',
    phone: '',
    dietaryRestrictions: '',
    accommodations: '',
    guests: 0,
    questions: ''
  });
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [showConfirmation, setShowConfirmation] = React.useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = React.useState(true);
  const [showCancelDialog, setShowCancelDialog] = React.useState(false);

  const isFull = event.capacity && event.registered >= event.capacity;
  const spotsLeft = event.capacity ? event.capacity - event.registered : null;
  const registrationProgress = event.capacity ? (event.registered / event.capacity) * 100 : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    onRSVP?.(formData);
    setIsSubmitting(false);
    setShowConfirmation(true);
  };

  const handleCancelRSVP = () => {
    onCancelRSVP?.();
    setShowCancelDialog(false);
  };

  const handleNotificationToggle = () => {
    const newState = !notificationsEnabled;
    setNotificationsEnabled(newState);
    onNotificationToggle?.(newState);
  };

  const renderRegistrationForm = () => (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              required
              placeholder="Enter your name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              required
              type="email"
              placeholder="your@email.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone Number
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="tel"
              placeholder="(555) 123-4567"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="pl-10"
            />
          </div>
        </div>

        {showGuestOptions && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Number of Guests
            </label>
            <div className="relative">
              <Users className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="number"
                min="0"
                max="5"
                placeholder="0"
                value={formData.guests}
                onChange={(e) => setFormData({ ...formData, guests: parseInt(e.target.value) || 0 })}
                className="pl-10"
              />
            </div>
          </div>
        )}
      </div>

      {event.location === 'in-person' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Dietary Restrictions
            </label>
            <Input
              placeholder="Vegetarian, vegan, allergies, etc."
              value={formData.dietaryRestrictions}
              onChange={(e) => setFormData({ ...formData, dietaryRestrictions: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Special Accommodations
            </label>
            <Input
              placeholder="Wheelchair access, sign language, etc."
              value={formData.accommodations}
              onChange={(e) => setFormData({ ...formData, accommodations: e.target.value })}
            />
          </div>
        </>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Questions or Comments
        </label>
        <Textarea
          placeholder="Any questions for the host?"
          rows={3}
          value={formData.questions}
          onChange={(e) => setFormData({ ...formData, questions: e.target.value })}
        />
      </div>

      {event.requirements && event.requirements.length > 0 && (
        <Card className="bg-yellow-50 border-yellow-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-sm mb-2">Event Requirements</h4>
                <ul className="space-y-1">
                  {event.requirements.map((req, index) => (
                    <li key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-yellow-600 rounded-full" />
                      {req}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex items-center gap-4">
        <Button
          type="submit"
          className="flex-1"
          disabled={isSubmitting || isFull}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Registering...
            </>
          ) : isFull ? (
            'Join Waitlist'
          ) : requiresApproval ? (
            'Request to Join'
          ) : (
            <>
              Confirm RSVP
              <ArrowRight className="h-4 w-4 ml-2" />
            </>
          )}
        </Button>
        
        <Button
          type="button"
          variant="outline"
          onClick={() => window.history.back()}
        >
          Cancel
        </Button>
      </div>
    </form>
  );

  const renderRegistrationConfirmation = () => (
    <Card className="bg-green-50 border-green-200">
      <CardContent className="p-6 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
        </div>
        
        <h3 className="text-xl font-bold mb-2">Registration Confirmed!</h3>
        <p className="text-gray-600 mb-6">
          {requiresApproval 
            ? "Your registration request has been sent to the host for approval."
            : "You're all set! We've sent a confirmation email with event details."}
        </p>

        {registrationStatus.registrationId && (
          <div className="bg-white rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-500 mb-1">Registration ID</div>
            <div className="font-mono text-lg font-bold flex items-center justify-center gap-2">
              {registrationStatus.registrationId}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigator.clipboard.writeText(registrationStatus.registrationId!)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {registrationStatus.qrCode && (
          <div className="bg-white rounded-lg p-4 mb-6">
            <QrCode className="h-32 w-32 mx-auto mb-2" />
            <p className="text-xs text-gray-500">Show this QR code at check-in</p>
          </div>
        )}

        <div className="flex gap-2">
          <Button
            className="flex-1"
            onClick={onAddToCalendar}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Add to Calendar
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={onShareEvent}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share Event
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderRegisteredStatus = () => (
    <div className="space-y-4">
      <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <h3 className="font-semibold">You're Registered!</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                {registrationStatus.isWaitlisted 
                  ? `You're #${registrationStatus.position} on the waitlist`
                  : 'Your spot is confirmed for this event'}
              </p>
              
              {registrationStatus.registrationId && (
                <div className="bg-white/50 rounded p-3 mb-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-gray-500">Registration ID</div>
                      <div className="font-mono font-medium">{registrationStatus.registrationId}</div>
                    </div>
                    <Badge variant="secondary">
                      <Ticket className="h-3 w-3 mr-1" />
                      Ticket
                    </Badge>
                  </div>
                </div>
              )}

              {event.pointsReward && (
                <Badge className="bg-green-600">
                  <Gift className="h-3 w-3 mr-1" />
                  +{event.pointsReward} points on attendance
                </Badge>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowCancelDialog(true)}
            >
              Cancel RSVP
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Event Reminders */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm flex items-center justify-between">
            Event Reminders
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNotificationToggle}
            >
              {notificationsEnabled ? (
                <>
                  <Bell className="h-4 w-4 mr-2" />
                  On
                </>
              ) : (
                <>
                  <BellOff className="h-4 w-4 mr-2" />
                  Off
                </>
              )}
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Email reminder 24 hours before</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Push notification 1 hour before</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span>Calendar event created</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-3">
        <Button variant="outline" onClick={onAddToCalendar}>
          <Calendar className="h-4 w-4 mr-2" />
          Update Calendar
        </Button>
        <Button variant="outline" onClick={onShareEvent}>
          <Share2 className="h-4 w-4 mr-2" />
          Invite Friends
        </Button>
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Download Ticket
        </Button>
        <Button variant="outline">
          <MessageSquare className="h-4 w-4 mr-2" />
          Contact Host
        </Button>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Event Summary */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
              <p className="text-gray-600">{event.description}</p>
            </div>
            {event.featured && (
              <Badge className="bg-purple-600">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
          </div>

          <div className="grid md:grid-cols-3 gap-4 mb-4">
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span>{new Date(event.date).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4 text-gray-500" />
              <span>{event.startTime} - {event.endTime}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              {event.location === 'virtual' ? (
                <>
                  <Video className="h-4 w-4 text-gray-500" />
                  <span>Virtual Event</span>
                </>
              ) : (
                <>
                  <MapPin className="h-4 w-4 text-gray-500" />
                  <span>{event.locationDetails || 'Location TBD'}</span>
                </>
              )}
            </div>
          </div>

          {/* Host Info */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg mb-4">
            <Avatar>
              <AvatarImage src={event.host.avatar} />
              <AvatarFallback>{event.host.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <div className="font-medium">Hosted by {event.host.name}</div>
              {event.host.role && (
                <div className="text-sm text-gray-600">{event.host.role}</div>
              )}
            </div>
          </div>

          {/* Registration Progress */}
          {event.capacity && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Registration Progress</span>
                <span className="font-medium">
                  {event.registered}/{event.capacity} registered
                  {event.waitlist && event.waitlist > 0 && (
                    <span className="text-gray-500 ml-1">
                      ({event.waitlist} on waitlist)
                    </span>
                  )}
                </span>
              </div>
              <Progress value={registrationProgress} className="h-2" />
              {spotsLeft !== null && spotsLeft > 0 && spotsLeft <= 10 && (
                <div className="flex items-center gap-1 text-sm text-orange-600">
                  <AlertTriangle className="h-4 w-4" />
                  Only {spotsLeft} spots left!
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Registration Section */}
      {showConfirmation ? (
        renderRegistrationConfirmation()
      ) : registrationStatus.isRegistered ? (
        renderRegisteredStatus()
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Event Registration</CardTitle>
          </CardHeader>
          <CardContent>
            {renderRegistrationForm()}
          </CardContent>
        </Card>
      )}

      {/* Cancel Dialog */}
      <AnimatePresence>
        {showCancelDialog && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowCancelDialog(false)}
          >
            <Card className="max-w-md w-full" onClick={(e) => e.stopPropagation()}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-yellow-600" />
                  Cancel Registration?
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Are you sure you want to cancel your registration for this event? 
                  You may lose your spot if the event fills up.
                </p>
                <div className="flex gap-2">
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={handleCancelRSVP}
                  >
                    Yes, Cancel RSVP
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => setShowCancelDialog(false)}
                  >
                    Keep Registration
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}