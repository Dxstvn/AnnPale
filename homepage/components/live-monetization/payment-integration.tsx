'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  CreditCard,
  DollarSign,
  Shield,
  Lock,
  CheckCircle,
  AlertCircle,
  Smartphone,
  Globe,
  Zap,
  Gift,
  Crown,
  Star,
  Heart,
  Coins,
  Wallet,
  Bitcoin,
  Plus,
  Minus,
  ArrowRight,
  Eye,
  EyeOff,
  Clock,
  Percent,
  TrendingUp,
  Users,
  Award,
  Target,
  RefreshCw,
  Download,
  Upload,
  Settings,
  Bell,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Payment method interfaces
export interface PaymentMethod {
  id: string;
  name: string;
  type: 'card' | 'digital_wallet' | 'crypto' | 'bank' | 'mobile';
  icon: React.ComponentType<any>;
  description: string;
  fees: {
    percentage: number;
    fixed: number;
    currency: string;
  };
  processingTime: string;
  regions: string[];
  isEnabled: boolean;
  popularity: number;
  securityLevel: 'standard' | 'high' | 'maximum';
}

export interface MonetizationAction {
  id: string;
  type: 'tip' | 'gift' | 'super-chat' | 'subscription' | 'paid-access';
  amount: number;
  currency: string;
  paymentMethod: string;
  creatorRevenue: number;
  platformFee: number;
  processingFee: number;
  timestamp: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  description: string;
  giftDetails?: {
    giftId: string;
    giftName: string;
    quantity: number;
  };
}

// Payment methods configuration
export const PAYMENT_METHODS: PaymentMethod[] = [
  {
    id: 'stripe-card',
    name: 'Credit/Debit Card',
    type: 'card',
    icon: CreditCard,
    description: 'Visa, Mastercard, American Express',
    fees: { percentage: 2.9, fixed: 0.30, currency: 'USD' },
    processingTime: 'Instant',
    regions: ['Global'],
    isEnabled: true,
    popularity: 85,
    securityLevel: 'high'
  },
  {
    id: 'paypal',
    name: 'PayPal',
    type: 'digital_wallet',
    icon: Wallet,
    description: 'PayPal account or guest checkout',
    fees: { percentage: 3.49, fixed: 0.49, currency: 'USD' },
    processingTime: 'Instant',
    regions: ['Global'],
    isEnabled: true,
    popularity: 70,
    securityLevel: 'high'
  },
  {
    id: 'apple-pay',
    name: 'Apple Pay',
    type: 'digital_wallet',
    icon: Smartphone,
    description: 'Touch ID or Face ID',
    fees: { percentage: 2.9, fixed: 0.30, currency: 'USD' },
    processingTime: 'Instant',
    regions: ['iOS devices'],
    isEnabled: true,
    popularity: 60,
    securityLevel: 'maximum'
  },
  {
    id: 'google-pay',
    name: 'Google Pay',
    type: 'digital_wallet',
    icon: Smartphone,
    description: 'Google account payment',
    fees: { percentage: 2.9, fixed: 0.30, currency: 'USD' },
    processingTime: 'Instant',
    regions: ['Android devices'],
    isEnabled: true,
    popularity: 55,
    securityLevel: 'high'
  },
  {
    id: 'crypto-btc',
    name: 'Bitcoin',
    type: 'crypto',
    icon: Bitcoin,
    description: 'BTC payments via Lightning Network',
    fees: { percentage: 1.0, fixed: 0, currency: 'USD' },
    processingTime: '10-60 minutes',
    regions: ['Global'],
    isEnabled: false,
    popularity: 15,
    securityLevel: 'maximum'
  },
  {
    id: 'bank-transfer',
    name: 'Bank Transfer',
    type: 'bank',
    icon: Globe,
    description: 'Direct bank account transfer',
    fees: { percentage: 0.8, fixed: 0, currency: 'USD' },
    processingTime: '1-3 business days',
    regions: ['US', 'EU', 'Canada'],
    isEnabled: false,
    popularity: 25,
    securityLevel: 'high'
  }
];

interface PaymentIntegrationProps {
  onPaymentProcess: (action: MonetizationAction) => void;
  recentTransactions: MonetizationAction[];
  totalProcessed: number;
  className?: string;
}

export function PaymentIntegration({
  onPaymentProcess,
  recentTransactions,
  totalProcessed,
  className
}: PaymentIntegrationProps) {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('stripe-card');
  const [showProcessingDialog, setShowProcessingDialog] = useState(false);
  const [processingAction, setProcessingAction] = useState<Partial<MonetizationAction> | null>(null);
  const [amount, setAmount] = useState(10);
  const [actionType, setActionType] = useState<MonetizationAction['type']>('tip');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showMethodSettings, setShowMethodSettings] = useState(false);

  const enabledMethods = PAYMENT_METHODS.filter(method => method.isEnabled);
  const selectedMethod = PAYMENT_METHODS.find(method => method.id === selectedPaymentMethod);

  // Calculate fees and splits
  const calculatePaymentBreakdown = (amount: number, method: PaymentMethod) => {
    const processingFee = (amount * method.fees.percentage / 100) + method.fees.fixed;
    const platformFeeRate = getRevenueShare(actionType).platformFee / 100;
    const platformFee = amount * platformFeeRate;
    const creatorRevenue = amount - processingFee - platformFee;
    
    return {
      gross: amount,
      processingFee: processingFee,
      platformFee: platformFee,
      creatorRevenue: Math.max(0, creatorRevenue)
    };
  };

  // Get revenue share based on action type
  const getRevenueShare = (type: MonetizationAction['type']) => {
    switch (type) {
      case 'tip':
      case 'paid-access':
        return { creatorRevenue: 80, platformFee: 20 };
      case 'gift':
      case 'super-chat':
      case 'subscription':
        return { creatorRevenue: 70, platformFee: 30 };
      default:
        return { creatorRevenue: 80, platformFee: 20 };
    }
  };

  const handleProcessPayment = async () => {
    if (!selectedMethod || amount <= 0) return;

    setIsProcessing(true);
    const breakdown = calculatePaymentBreakdown(amount, selectedMethod);

    const action: MonetizationAction = {
      id: `action-${Date.now()}`,
      type: actionType,
      amount: amount,
      currency: 'USD',
      paymentMethod: selectedMethod.id,
      creatorRevenue: breakdown.creatorRevenue,
      platformFee: breakdown.platformFee,
      processingFee: breakdown.processingFee,
      timestamp: new Date(),
      status: 'processing',
      description: `${actionType.charAt(0).toUpperCase() + actionType.slice(1)} of $${amount}`,
      ...(actionType === 'gift' && {
        giftDetails: {
          giftId: 'heart',
          giftName: 'Hearts',
          quantity: Math.floor(amount / 0.99)
        }
      })
    };

    setProcessingAction(action);
    setShowProcessingDialog(true);

    // Simulate payment processing
    setTimeout(() => {
      action.status = Math.random() > 0.05 ? 'completed' : 'failed';
      onPaymentProcess(action);
      setIsProcessing(false);
      setShowProcessingDialog(false);
      setProcessingAction(null);
    }, 3000);
  };

  const getActionIcon = (type: MonetizationAction['type']) => {
    switch (type) {
      case 'tip': return <DollarSign className="w-4 h-4" />;
      case 'gift': return <Gift className="w-4 h-4" />;
      case 'super-chat': return <Zap className="w-4 h-4" />;
      case 'subscription': return <Crown className="w-4 h-4" />;
      case 'paid-access': return <Lock className="w-4 h-4" />;
      default: return <DollarSign className="w-4 h-4" />;
    }
  };

  const getStatusColor = (status: MonetizationAction['status']) => {
    switch (status) {
      case 'completed': return 'text-green-600 bg-green-50 border-green-200';
      case 'processing': return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'pending': return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      case 'failed': return 'text-red-600 bg-red-50 border-red-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Payment Integration</h2>
          <p className="text-gray-600">Secure payment processing for all monetization methods</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            <Shield className="w-3 h-3 mr-1" />
            PCI Compliant
          </Badge>
          <Button variant="outline" size="sm" onClick={() => setShowMethodSettings(true)}>
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Payment Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Processed</p>
                <p className="text-2xl font-bold">{formatCurrency(totalProcessed)}</p>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Success Rate</p>
                <p className="text-2xl font-bold">98.5%</p>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Processing</p>
                <p className="text-2xl font-bold">1.2s</p>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Methods</p>
                <p className="text-2xl font-bold">{enabledMethods.length}</p>
              </div>
              <div className="p-2 bg-orange-100 rounded-lg">
                <CreditCard className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Payment Processing Demo */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Processing Demo</CardTitle>
            <CardDescription>Test payment flows and fee calculations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Action Type Selection */}
            <div className="space-y-2">
              <Label>Action Type</Label>
              <Select value={actionType} onValueChange={(value: MonetizationAction['type']) => setActionType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tip">💰 Tip</SelectItem>
                  <SelectItem value="gift">🎁 Virtual Gift</SelectItem>
                  <SelectItem value="super-chat">⚡ Super Chat</SelectItem>
                  <SelectItem value="subscription">👑 Subscription</SelectItem>
                  <SelectItem value="paid-access">🔒 Paid Access</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Amount Input */}
            <div className="space-y-2">
              <Label>Amount (USD)</Label>
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setAmount(Math.max(1, amount - 1))}
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <Input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                  className="text-center"
                  min="1"
                  max="500"
                />
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setAmount(amount + 1)}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
              <div className="flex gap-2">
                {[5, 10, 25, 50, 100].map((preset) => (
                  <Button
                    key={preset}
                    size="sm"
                    variant="outline"
                    onClick={() => setAmount(preset)}
                    className="flex-1"
                  >
                    ${preset}
                  </Button>
                ))}
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="space-y-2">
              <Label>Payment Method</Label>
              <div className="grid grid-cols-2 gap-2">
                {enabledMethods.map((method) => (
                  <Button
                    key={method.id}
                    variant={selectedPaymentMethod === method.id ? "default" : "outline"}
                    onClick={() => setSelectedPaymentMethod(method.id)}
                    className="h-auto p-3 flex flex-col items-center gap-2"
                  >
                    <method.icon className="w-5 h-5" />
                    <span className="text-xs">{method.name}</span>
                  </Button>
                ))}
              </div>
            </div>

            {/* Fee Breakdown */}
            {selectedMethod && (
              <div className="p-4 bg-gray-50 rounded-lg space-y-3">
                <h4 className="font-semibold text-sm">Payment Breakdown</h4>
                {(() => {
                  const breakdown = calculatePaymentBreakdown(amount, selectedMethod);
                  return (
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Gross Amount:</span>
                        <span className="font-medium">{formatCurrency(breakdown.gross)}</span>
                      </div>
                      <div className="flex justify-between text-red-600">
                        <span>Processing Fee ({selectedMethod.fees.percentage}% + ${selectedMethod.fees.fixed}):</span>
                        <span>-{formatCurrency(breakdown.processingFee)}</span>
                      </div>
                      <div className="flex justify-between text-red-600">
                        <span>Platform Fee ({getRevenueShare(actionType).platformFee}%):</span>
                        <span>-{formatCurrency(breakdown.platformFee)}</span>
                      </div>
                      <Separator />
                      <div className="flex justify-between font-semibold text-green-600">
                        <span>Creator Revenue:</span>
                        <span>{formatCurrency(breakdown.creatorRevenue)}</span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            )}

            {/* Process Button */}
            <Button
              onClick={handleProcessPayment}
              disabled={isProcessing || amount <= 0}
              className="w-full"
            >
              {isProcessing ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  {getActionIcon(actionType)}
                  <span className="ml-2">Process {formatCurrency(amount)} {actionType}</span>
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Payment Methods Management */}
        <Card>
          <CardHeader>
            <CardTitle>Payment Methods</CardTitle>
            <CardDescription>Configure available payment options</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {PAYMENT_METHODS.map((method) => (
                <div key={method.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      "p-2 rounded-lg",
                      method.isEnabled ? "bg-green-100" : "bg-gray-100"
                    )}>
                      <method.icon className={cn(
                        "w-5 h-5",
                        method.isEnabled ? "text-green-600" : "text-gray-400"
                      )} />
                    </div>
                    <div>
                      <h4 className="font-semibold">{method.name}</h4>
                      <p className="text-sm text-gray-600">{method.description}</p>
                      <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                        <span>Fee: {method.fees.percentage}%{method.fees.fixed > 0 && ` + $${method.fees.fixed}`}</span>
                        <span>Time: {method.processingTime}</span>
                        <Badge variant="outline" className="text-xs">
                          {method.popularity}% popular
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-xs",
                        method.securityLevel === 'maximum' ? 'border-green-500 text-green-700' :
                        method.securityLevel === 'high' ? 'border-blue-500 text-blue-700' :
                        'border-gray-500 text-gray-700'
                      )}
                    >
                      {method.securityLevel} security
                    </Badge>
                    <Switch
                      checked={method.isEnabled}
                      onCheckedChange={(checked) => {
                        // Handle method toggle
                        method.isEnabled = checked;
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>Latest payment activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recentTransactions.slice(0, 8).map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-white rounded-lg border">
                    {getActionIcon(transaction.type)}
                  </div>
                  <div>
                    <div className="font-medium text-sm">{transaction.description}</div>
                    <div className="text-xs text-gray-600">
                      {transaction.timestamp.toLocaleString()} • via {transaction.paymentMethod}
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(transaction.amount)}</div>
                    <div className="text-xs text-green-600">
                      +{formatCurrency(transaction.creatorRevenue)} earned
                    </div>
                  </div>
                  <Badge className={cn('text-xs', getStatusColor(transaction.status))}>
                    {transaction.status}
                  </Badge>
                </div>
              </div>
            ))}
            
            {recentTransactions.length === 0 && (
              <div className="text-center py-8">
                <CreditCard className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                <p className="text-gray-600">No transactions yet</p>
                <p className="text-sm text-gray-500">Process a test payment to see it here</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Processing Dialog */}
      <Dialog open={showProcessingDialog} onOpenChange={setShowProcessingDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
              Processing Payment
            </DialogTitle>
            <DialogDescription>
              Securely processing your payment...
            </DialogDescription>
          </DialogHeader>
          
          {processingAction && (
            <div className="space-y-4">
              <div className="text-center py-6">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Processing {processingAction.description}</h3>
                <p className="text-sm text-gray-600">
                  Please wait while we securely process your payment through {selectedMethod?.name}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Amount:</span>
                  <span className="font-medium">{formatCurrency(processingAction.amount || 0)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Creator Revenue:</span>
                  <span className="font-medium text-green-600">
                    {formatCurrency(processingAction.creatorRevenue || 0)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Processing Fee:</span>
                  <span className="font-medium text-red-600">
                    -{formatCurrency(processingAction.processingFee || 0)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Shield className="w-4 h-4" />
                <span>Your payment information is encrypted and secure</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}