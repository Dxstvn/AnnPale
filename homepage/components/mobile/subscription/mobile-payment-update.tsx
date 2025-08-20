'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  CreditCard,
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Lock,
  Smartphone,
  Fingerprint,
  Eye,
  EyeOff,
  Calendar,
  User,
  MapPin,
  Globe,
  ChevronRight,
  ChevronLeft,
  X,
  Zap,
  Clock,
  RefreshCw,
  AlertCircle,
  Check,
  Plus,
  Trash2,
  Edit,
  Star
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface PaymentMethod {
  id: string;
  type: 'credit_card' | 'debit_card' | 'apple_pay' | 'google_pay' | 'paypal' | 'bank_account';
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  isDefault: boolean;
  isValid: boolean;
  email?: string; // for PayPal
  bankName?: string; // for bank accounts
  platform: 'ios' | 'android' | 'web' | 'all';
  biometric?: boolean;
  nickname?: string;
}

interface BillingAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface ValidationError {
  field: string;
  message: string;
}

interface MobilePaymentUpdateProps {
  currentMethods?: PaymentMethod[];
  platform?: 'ios' | 'android' | 'web';
  onAddMethod?: (method: PaymentMethod) => void;
  onUpdateMethod?: (methodId: string, updates: Partial<PaymentMethod>) => void;
  onRemoveMethod?: (methodId: string) => void;
  onSetDefault?: (methodId: string) => void;
  onClose?: () => void;
  isLoading?: boolean;
  showBiometric?: boolean;
}

export function MobilePaymentUpdate({
  currentMethods = [],
  platform = 'web',
  onAddMethod,
  onUpdateMethod,
  onRemoveMethod,
  onSetDefault,
  onClose,
  isLoading = false,
  showBiometric = true
}: MobilePaymentUpdateProps) {
  const [activeStep, setActiveStep] = React.useState<'list' | 'add' | 'edit'>('list');
  const [selectedMethod, setSelectedMethod] = React.useState<string | null>(null);
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [showCardDetails, setShowCardDetails] = React.useState(false);
  const [errors, setErrors] = React.useState<ValidationError[]>([]);

  // Form state for new/edit payment method
  const [formData, setFormData] = React.useState({
    type: 'credit_card' as PaymentMethod['type'],
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    cardholderName: '',
    nickname: '',
    email: '', // for PayPal
    billingAddress: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'US'
    } as BillingAddress
  });

  // Default payment methods for demo
  const defaultMethods: PaymentMethod[] = currentMethods.length > 0 ? currentMethods : [
    {
      id: 'card_1',
      type: 'credit_card',
      last4: '4242',
      brand: 'Visa',
      expiryMonth: 12,
      expiryYear: 2025,
      isDefault: true,
      isValid: true,
      platform: 'all',
      nickname: 'Primary Card'
    },
    {
      id: 'apple_pay_1',
      type: 'apple_pay',
      isDefault: false,
      isValid: true,
      platform: 'ios',
      biometric: true,
      nickname: 'Apple Pay'
    },
    {
      id: 'paypal_1',
      type: 'paypal',
      email: 'user@example.com',
      isDefault: false,
      isValid: true,
      platform: 'web',
      nickname: 'PayPal Account'
    }
  ];

  // Get payment method icon and details
  const getPaymentMethodInfo = (method: PaymentMethod) => {
    switch (method.type) {
      case 'credit_card':
      case 'debit_card':
        return {
          icon: CreditCard,
          label: `${method.brand} •••• ${method.last4}`,
          description: `Expires ${method.expiryMonth}/${method.expiryYear}`,
          emoji: '💳'
        };
      case 'apple_pay':
        return {
          icon: Smartphone,
          label: 'Apple Pay',
          description: 'Touch ID or Face ID',
          emoji: '🍎'
        };
      case 'google_pay':
        return {
          icon: Smartphone,
          label: 'Google Pay',
          description: 'Fingerprint or PIN',
          emoji: '🤖'
        };
      case 'paypal':
        return {
          icon: Globe,
          label: 'PayPal',
          description: method.email || 'PayPal Account',
          emoji: '💳'
        };
      case 'bank_account':
        return {
          icon: Globe,
          label: method.bankName || 'Bank Account',
          description: `•••• ${method.last4}`,
          emoji: '🏦'
        };
      default:
        return {
          icon: CreditCard,
          label: 'Payment Method',
          description: '',
          emoji: '💳'
        };
    }
  };

  // Available payment methods for platform
  const getAvailablePaymentTypes = () => {
    const baseTypes = [
      { type: 'credit_card', label: 'Credit Card', platforms: ['ios', 'android', 'web'] },
      { type: 'debit_card', label: 'Debit Card', platforms: ['ios', 'android', 'web'] }
    ];

    const platformSpecific = [];

    if (platform === 'ios') {
      platformSpecific.push({ type: 'apple_pay', label: 'Apple Pay', platforms: ['ios'] });
    }

    if (platform === 'android') {
      platformSpecific.push({ type: 'google_pay', label: 'Google Pay', platforms: ['android'] });
    }

    if (platform === 'web') {
      platformSpecific.push(
        { type: 'paypal', label: 'PayPal', platforms: ['web'] },
        { type: 'bank_account', label: 'Bank Account', platforms: ['web'] }
      );
    }

    return [...baseTypes, ...platformSpecific];
  };

  // Validate form data
  const validateForm = () => {
    const newErrors: ValidationError[] = [];

    if (formData.type === 'credit_card' || formData.type === 'debit_card') {
      if (!formData.cardNumber || formData.cardNumber.length < 13) {
        newErrors.push({ field: 'cardNumber', message: 'Please enter a valid card number' });
      }
      if (!formData.expiryMonth || !formData.expiryYear) {
        newErrors.push({ field: 'expiry', message: 'Please enter expiry date' });
      }
      if (!formData.cvv || formData.cvv.length < 3) {
        newErrors.push({ field: 'cvv', message: 'Please enter CVV' });
      }
      if (!formData.cardholderName.trim()) {
        newErrors.push({ field: 'cardholderName', message: 'Please enter cardholder name' });
      }
    }

    if (formData.type === 'paypal' && !formData.email) {
      newErrors.push({ field: 'email', message: 'Please enter PayPal email' });
    }

    setErrors(newErrors);
    return newErrors.length === 0;
  };

  // Handle form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsProcessing(true);

    // Simulate processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    const newMethod: PaymentMethod = {
      id: `new_${Date.now()}`,
      type: formData.type,
      isDefault: defaultMethods.length === 0,
      isValid: true,
      platform: platform,
      nickname: formData.nickname || undefined,
      ...(formData.type === 'credit_card' || formData.type === 'debit_card' ? {
        last4: formData.cardNumber.slice(-4),
        brand: 'Visa', // Would be detected from card number
        expiryMonth: parseInt(formData.expiryMonth),
        expiryYear: parseInt(formData.expiryYear)
      } : {}),
      ...(formData.type === 'paypal' ? {
        email: formData.email
      } : {}),
      ...(platform !== 'web' ? {
        biometric: showBiometric
      } : {})
    };

    onAddMethod?.(newMethod);
    setIsProcessing(false);
    setActiveStep('list');
    
    // Reset form
    setFormData({
      type: 'credit_card',
      cardNumber: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      cardholderName: '',
      nickname: '',
      email: '',
      billingAddress: {
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'US'
      }
    });
  };

  // Format card number input
  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  // Get field error
  const getFieldError = (field: string) => {
    return errors.find(error => error.field === field)?.message;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-center z-50">
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="bg-white w-full max-w-md rounded-t-3xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {activeStep !== 'list' && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setActiveStep('list')}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
              )}
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-blue-500 rounded-lg flex items-center justify-center">
                  <CreditCard className="h-4 w-4 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold">
                    {activeStep === 'list' ? 'Payment Methods' : 
                     activeStep === 'add' ? 'Add Payment Method' : 
                     'Edit Payment Method'}
                  </h2>
                  <p className="text-xs text-gray-600">
                    {platform === 'ios' ? 'App Store' : 
                     platform === 'android' ? 'Play Store' : 
                     'Web Platform'}
                  </p>
                </div>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="p-4">
          <AnimatePresence mode="wait">
            {/* Payment Methods List */}
            {activeStep === 'list' && (
              <motion.div
                key="list"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {/* Current Payment Methods */}
                <div className="space-y-3">
                  {defaultMethods.map((method, index) => {
                    const methodInfo = getPaymentMethodInfo(method);
                    const Icon = methodInfo.icon;

                    return (
                      <Card 
                        key={method.id}
                        className={cn(
                          "transition-all",
                          method.isDefault && "border-green-500 ring-2 ring-green-200",
                          !method.isValid && "border-red-500 ring-2 ring-red-200"
                        )}
                      >
                        <CardContent className="p-4">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                <span className="text-lg">{methodInfo.emoji}</span>
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-medium text-sm">{methodInfo.label}</span>
                                  {method.isDefault && (
                                    <Badge className="bg-green-100 text-green-700 text-xs">
                                      Default
                                    </Badge>
                                  )}
                                  {method.biometric && (
                                    <Fingerprint className="h-3 w-3 text-blue-500" />
                                  )}
                                </div>
                                <p className="text-xs text-gray-600">{methodInfo.description}</p>
                                {method.nickname && (
                                  <p className="text-xs text-purple-600">{method.nickname}</p>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-2">
                              {!method.isValid && (
                                <AlertTriangle className="h-4 w-4 text-red-500" />
                              )}
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => {
                                  setSelectedMethod(method.id);
                                  setActiveStep('edit');
                                }}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>

                          {!method.isValid && (
                            <div className="mt-3 p-2 bg-red-50 rounded-lg">
                              <p className="text-xs text-red-700">
                                This payment method needs to be updated
                              </p>
                            </div>
                          )}

                          {/* Quick Actions */}
                          <div className="mt-3 flex gap-2">
                            {!method.isDefault && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-xs"
                                onClick={() => onSetDefault?.(method.id)}
                              >
                                Set as Default
                              </Button>
                            )}
                            {defaultMethods.length > 1 && (
                              <Button 
                                size="sm" 
                                variant="outline"
                                className="text-xs text-red-600 border-red-200"
                                onClick={() => onRemoveMethod?.(method.id)}
                              >
                                Remove
                              </Button>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>

                {/* Add New Payment Method */}
                <Button
                  className="w-full h-12 border-2 border-dashed border-gray-300 bg-transparent text-gray-600 hover:bg-gray-50"
                  onClick={() => setActiveStep('add')}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Payment Method
                </Button>

                {/* Security Notice */}
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="p-3">
                    <div className="flex items-center gap-2 mb-1">
                      <Shield className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Secure Payments</span>
                    </div>
                    <p className="text-xs text-blue-700">
                      Your payment information is encrypted and securely stored. We never store your full card details.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Add Payment Method Form */}
            {activeStep === 'add' && (
              <motion.div
                key="add"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-4"
              >
                {/* Payment Type Selection */}
                <div className="space-y-3">
                  <h3 className="font-medium">Select Payment Type</h3>
                  <div className="grid grid-cols-1 gap-2">
                    {getAvailablePaymentTypes().map((type) => (
                      <Card
                        key={type.type}
                        className={cn(
                          "cursor-pointer transition-all",
                          formData.type === type.type && "border-purple-500 ring-2 ring-purple-200"
                        )}
                        onClick={() => setFormData(prev => ({ ...prev, type: type.type as any }))}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-sm">{type.label}</span>
                            {formData.type === type.type && (
                              <CheckCircle className="h-4 w-4 text-purple-500" />
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  {(formData.type === 'credit_card' || formData.type === 'debit_card') && (
                    <>
                      {/* Card Number */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Card Number</label>
                        <div className="relative">
                          <Input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            value={formData.cardNumber}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              cardNumber: formatCardNumber(e.target.value) 
                            }))}
                            className={cn(getFieldError('cardNumber') && "border-red-500")}
                            maxLength={19}
                          />
                          <CreditCard className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                        </div>
                        {getFieldError('cardNumber') && (
                          <p className="text-xs text-red-600">{getFieldError('cardNumber')}</p>
                        )}
                      </div>

                      {/* Expiry and CVV */}
                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Month</label>
                          <Input
                            type="text"
                            placeholder="MM"
                            value={formData.expiryMonth}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              expiryMonth: e.target.value.replace(/\D/g, '').slice(0, 2) 
                            }))}
                            maxLength={2}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Year</label>
                          <Input
                            type="text"
                            placeholder="YYYY"
                            value={formData.expiryYear}
                            onChange={(e) => setFormData(prev => ({ 
                              ...prev, 
                              expiryYear: e.target.value.replace(/\D/g, '').slice(0, 4) 
                            }))}
                            maxLength={4}
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-medium">CVV</label>
                          <div className="relative">
                            <Input
                              type={showCardDetails ? "text" : "password"}
                              placeholder="123"
                              value={formData.cvv}
                              onChange={(e) => setFormData(prev => ({ 
                                ...prev, 
                                cvv: e.target.value.replace(/\D/g, '').slice(0, 4) 
                              }))}
                              maxLength={4}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="absolute right-0 top-0 h-full px-2"
                              onClick={() => setShowCardDetails(!showCardDetails)}
                            >
                              {showCardDetails ? (
                                <EyeOff className="h-3 w-3" />
                              ) : (
                                <Eye className="h-3 w-3" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                      {getFieldError('expiry') && (
                        <p className="text-xs text-red-600">{getFieldError('expiry')}</p>
                      )}
                      {getFieldError('cvv') && (
                        <p className="text-xs text-red-600">{getFieldError('cvv')}</p>
                      )}

                      {/* Cardholder Name */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Cardholder Name</label>
                        <Input
                          type="text"
                          placeholder="John Doe"
                          value={formData.cardholderName}
                          onChange={(e) => setFormData(prev => ({ 
                            ...prev, 
                            cardholderName: e.target.value 
                          }))}
                          className={cn(getFieldError('cardholderName') && "border-red-500")}
                        />
                        {getFieldError('cardholderName') && (
                          <p className="text-xs text-red-600">{getFieldError('cardholderName')}</p>
                        )}
                      </div>
                    </>
                  )}

                  {formData.type === 'paypal' && (
                    <div className="space-y-2">
                      <label className="text-sm font-medium">PayPal Email</label>
                      <Input
                        type="email"
                        placeholder="user@example.com"
                        value={formData.email}
                        onChange={(e) => setFormData(prev => ({ 
                          ...prev, 
                          email: e.target.value 
                        }))}
                        className={cn(getFieldError('email') && "border-red-500")}
                      />
                      {getFieldError('email') && (
                        <p className="text-xs text-red-600">{getFieldError('email')}</p>
                      )}
                    </div>
                  )}

                  {/* Nickname (Optional) */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Nickname (Optional)</label>
                    <Input
                      type="text"
                      placeholder="e.g., Work Card, Personal Account"
                      value={formData.nickname}
                      onChange={(e) => setFormData(prev => ({ 
                        ...prev, 
                        nickname: e.target.value 
                      }))}
                    />
                  </div>
                </div>

                {/* Biometric Authentication Option */}
                {(platform === 'ios' || platform === 'android') && showBiometric && (
                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <Fingerprint className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-medium text-blue-800">
                          {platform === 'ios' ? 'Face ID / Touch ID' : 'Fingerprint Authentication'}
                        </span>
                      </div>
                      <p className="text-xs text-blue-700">
                        Use biometric authentication for faster, more secure payments
                      </p>
                    </CardContent>
                  </Card>
                )}

                {/* Add Button */}
                <Button
                  className="w-full h-12"
                  onClick={handleSubmit}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <div className="flex items-center gap-2">
                      <RefreshCw className="h-4 w-4 animate-spin" />
                      <span>Adding Payment Method...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      <span>Add Payment Method</span>
                    </div>
                  )}
                </Button>

                {/* Security Notice */}
                <div className="text-center space-y-2">
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Shield className="h-3 w-3" />
                      <span>SSL Encrypted</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Lock className="h-3 w-3" />
                      <span>PCI Compliant</span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">
                    Your payment information is secure and encrypted
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}