'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  CreditCard,
  Lock,
  Shield,
  User,
  Mail,
  MapPin,
  ChevronRight,
  Info,
  Check,
  AlertCircle,
  Building,
  Calendar,
  Key
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

interface AccountSetupStepProps {
  onContinue?: (data: AccountData) => void;
  onBack?: () => void;
  isNewUser?: boolean;
  orderSummary?: {
    tier: string;
    price: number;
    billingCycle: string;
  };
}

interface AccountData {
  email: string;
  password?: string;
  paymentMethod: 'card' | 'paypal';
  cardNumber?: string;
  cardExpiry?: string;
  cardCVC?: string;
  cardName?: string;
  billingAddress: {
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  autoRenewal: boolean;
  termsAccepted: boolean;
}

export function AccountSetupStep({
  onContinue,
  onBack,
  isNewUser = true,
  orderSummary
}: AccountSetupStepProps) {
  const [formData, setFormData] = React.useState<AccountData>({
    email: '',
    password: '',
    paymentMethod: 'card',
    cardNumber: '',
    cardExpiry: '',
    cardCVC: '',
    cardName: '',
    billingAddress: {
      address: '',
      city: '',
      state: '',
      zip: '',
      country: 'US'
    },
    autoRenewal: true,
    termsAccepted: false
  });

  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [isProcessing, setIsProcessing] = React.useState(false);

  // Payment method icons
  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
    { id: 'paypal', name: 'PayPal', icon: Building }
  ];

  // Trust badges
  const trustBadges = [
    { icon: Lock, text: 'SSL Encrypted' },
    { icon: Shield, text: 'PCI Compliant' },
    { icon: Check, text: 'Secure Checkout' }
  ];

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...(prev as any)[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.email.includes('@')) newErrors.email = 'Valid email required';
    
    if (isNewUser && !formData.password) newErrors.password = 'Password is required';
    if (isNewUser && formData.password && formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.paymentMethod === 'card') {
      if (!formData.cardNumber) newErrors.cardNumber = 'Card number is required';
      if (!formData.cardExpiry) newErrors.cardExpiry = 'Expiry date is required';
      if (!formData.cardCVC) newErrors.cardCVC = 'CVC is required';
      if (!formData.cardName) newErrors.cardName = 'Cardholder name is required';
    }
    
    if (!formData.billingAddress.address) newErrors['billingAddress.address'] = 'Address is required';
    if (!formData.billingAddress.city) newErrors['billingAddress.city'] = 'City is required';
    if (!formData.billingAddress.zip) newErrors['billingAddress.zip'] = 'ZIP code is required';
    
    if (!formData.termsAccepted) newErrors.terms = 'You must accept the terms';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsProcessing(true);
    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    
    onContinue?.(formData);
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    
    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  return (
    <div className="space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={onBack}>
          ← Back
        </Button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
            ✓
          </div>
          <div className="w-16 h-1 bg-green-600" />
          <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
            ✓
          </div>
          <div className="w-16 h-1 bg-green-600" />
          <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center text-sm font-bold">
            ✓
          </div>
          <div className="w-16 h-1 bg-purple-600" />
          <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center text-sm font-bold">
            4
          </div>
        </div>
        <div className="w-20" />
      </div>

      {/* Account Information */}
      {isNewUser && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Account Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={errors.email ? 'border-red-500' : ''}
                />
                {errors.email && (
                  <p className="text-sm text-red-500 mt-1">{errors.email}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Minimum 8 characters"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className={errors.password ? 'border-red-500' : ''}
                />
                {errors.password && (
                  <p className="text-sm text-red-500 mt-1">{errors.password}</p>
                )}
                <p className="text-xs text-gray-500 mt-1">
                  Your password must be at least 8 characters long
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Method */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment Method
          </CardTitle>
        </CardHeader>
        <CardContent>
          <RadioGroup 
            value={formData.paymentMethod}
            onValueChange={(v) => handleInputChange('paymentMethod', v)}
          >
            <div className="grid md:grid-cols-2 gap-4 mb-4">
              {paymentMethods.map((method) => {
                const Icon = method.icon;
                return (
                  <Label
                    key={method.id}
                    htmlFor={method.id}
                    className={cn(
                      "flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer",
                      formData.paymentMethod === method.id 
                        ? "border-purple-500 bg-purple-50" 
                        : "border-gray-200"
                    )}
                  >
                    <RadioGroupItem value={method.id} id={method.id} />
                    <Icon className="h-5 w-5" />
                    <span className="font-medium">{method.name}</span>
                  </Label>
                );
              })}
            </div>
          </RadioGroup>

          {formData.paymentMethod === 'card' && (
            <div className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                  id="cardNumber"
                  placeholder="1234 5678 9012 3456"
                  value={formData.cardNumber}
                  onChange={(e) => handleInputChange('cardNumber', formatCardNumber(e.target.value))}
                  maxLength={19}
                  className={errors.cardNumber ? 'border-red-500' : ''}
                />
                {errors.cardNumber && (
                  <p className="text-sm text-red-500 mt-1">{errors.cardNumber}</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cardExpiry">Expiry Date</Label>
                  <Input
                    id="cardExpiry"
                    placeholder="MM/YY"
                    value={formData.cardExpiry}
                    onChange={(e) => handleInputChange('cardExpiry', e.target.value)}
                    maxLength={5}
                    className={errors.cardExpiry ? 'border-red-500' : ''}
                  />
                  {errors.cardExpiry && (
                    <p className="text-sm text-red-500 mt-1">{errors.cardExpiry}</p>
                  )}
                </div>
                
                <div>
                  <Label htmlFor="cardCVC">CVC</Label>
                  <Input
                    id="cardCVC"
                    placeholder="123"
                    value={formData.cardCVC}
                    onChange={(e) => handleInputChange('cardCVC', e.target.value)}
                    maxLength={4}
                    className={errors.cardCVC ? 'border-red-500' : ''}
                  />
                  {errors.cardCVC && (
                    <p className="text-sm text-red-500 mt-1">{errors.cardCVC}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="cardName">Cardholder Name</Label>
                <Input
                  id="cardName"
                  placeholder="John Doe"
                  value={formData.cardName}
                  onChange={(e) => handleInputChange('cardName', e.target.value)}
                  className={errors.cardName ? 'border-red-500' : ''}
                />
                {errors.cardName && (
                  <p className="text-sm text-red-500 mt-1">{errors.cardName}</p>
                )}
              </div>
            </div>
          )}

          {formData.paymentMethod === 'paypal' && (
            <div className="p-6 bg-gray-50 rounded-lg text-center">
              <p className="text-sm text-gray-600 mb-3">
                You will be redirected to PayPal to complete your payment
              </p>
              <Badge className="bg-blue-100 text-blue-700">
                Secure PayPal Checkout
              </Badge>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Billing Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Billing Address
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                placeholder="123 Main Street"
                value={formData.billingAddress.address}
                onChange={(e) => handleInputChange('billingAddress.address', e.target.value)}
                className={errors['billingAddress.address'] ? 'border-red-500' : ''}
              />
              {errors['billingAddress.address'] && (
                <p className="text-sm text-red-500 mt-1">{errors['billingAddress.address']}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  placeholder="New York"
                  value={formData.billingAddress.city}
                  onChange={(e) => handleInputChange('billingAddress.city', e.target.value)}
                  className={errors['billingAddress.city'] ? 'border-red-500' : ''}
                />
                {errors['billingAddress.city'] && (
                  <p className="text-sm text-red-500 mt-1">{errors['billingAddress.city']}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="state">State</Label>
                <Input
                  id="state"
                  placeholder="NY"
                  value={formData.billingAddress.state}
                  onChange={(e) => handleInputChange('billingAddress.state', e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="zip">ZIP Code</Label>
                <Input
                  id="zip"
                  placeholder="10001"
                  value={formData.billingAddress.zip}
                  onChange={(e) => handleInputChange('billingAddress.zip', e.target.value)}
                  className={errors['billingAddress.zip'] ? 'border-red-500' : ''}
                />
                {errors['billingAddress.zip'] && (
                  <p className="text-sm text-red-500 mt-1">{errors['billingAddress.zip']}</p>
                )}
              </div>
              
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  value={formData.billingAddress.country}
                  onChange={(e) => handleInputChange('billingAddress.country', e.target.value)}
                  disabled
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Auto-renewal & Terms */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Checkbox
                id="autoRenewal"
                checked={formData.autoRenewal}
                onCheckedChange={(checked) => handleInputChange('autoRenewal', checked)}
              />
              <div className="flex-1">
                <Label htmlFor="autoRenewal" className="cursor-pointer">
                  Enable auto-renewal
                </Label>
                <p className="text-sm text-gray-600">
                  Your subscription will automatically renew each billing period
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Checkbox
                id="terms"
                checked={formData.termsAccepted}
                onCheckedChange={(checked) => handleInputChange('termsAccepted', checked)}
              />
              <div className="flex-1">
                <Label htmlFor="terms" className="cursor-pointer">
                  I agree to the Terms of Service and Privacy Policy
                </Label>
                {errors.terms && (
                  <p className="text-sm text-red-500 mt-1">{errors.terms}</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Trust Badges */}
      <div className="flex items-center justify-center gap-6">
        {trustBadges.map((badge) => (
          <div key={badge.text} className="flex items-center gap-2 text-sm text-gray-600">
            <badge.icon className="h-4 w-4" />
            <span>{badge.text}</span>
          </div>
        ))}
      </div>

      {/* Order Summary (if provided) */}
      {orderSummary && (
        <Card className="border-2 border-purple-200 bg-purple-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Your {orderSummary.tier} subscription</p>
                <p className="text-2xl font-bold">${orderSummary.price}/month</p>
                <p className="text-sm text-gray-600">{orderSummary.billingCycle} billing</p>
              </div>
              <Shield className="h-12 w-12 text-purple-600 opacity-20" />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button 
          size="lg"
          className="px-8"
          onClick={handleSubmit}
          disabled={isProcessing}
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
              Processing...
            </>
          ) : (
            <>
              Complete Subscription
              <ChevronRight className="h-5 w-5 ml-2" />
            </>
          )}
        </Button>
      </div>

      {/* Security Note */}
      <p className="text-center text-xs text-gray-500">
        <Lock className="h-3 w-3 inline mr-1" />
        Your payment information is encrypted and secure. We never store your card details.
      </p>
    </div>
  );
}