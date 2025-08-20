'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  CreditCard,
  Smartphone,
  Building,
  Bitcoin,
  Gift,
  Ticket,
  Plus,
  Trash2,
  Edit,
  Check,
  X,
  Shield,
  Star,
  AlertCircle,
  Lock,
  Globe,
  Wallet,
  DollarSign,
  Euro,
  ChevronRight,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface PaymentMethod {
  id: string;
  type: 'card' | 'wallet' | 'bank' | 'crypto' | 'gift' | 'credit';
  name: string;
  details: string;
  isDefault: boolean;
  isExpired?: boolean;
  expiryDate?: string;
  lastUsed?: Date;
  addedDate: Date;
  brand?: string;
  last4?: string;
  balance?: number;
  currency?: string;
  status: 'active' | 'expired' | 'failed' | 'pending';
}

interface PaymentMethodsProps {
  methods?: PaymentMethod[];
  onMethodAdd?: (type: string) => void;
  onMethodUpdate?: (method: PaymentMethod) => void;
  onMethodDelete?: (methodId: string) => void;
  onMethodSetDefault?: (methodId: string) => void;
  showAddOptions?: boolean;
}

export function PaymentMethods({
  methods = [],
  onMethodAdd,
  onMethodUpdate,
  onMethodDelete,
  onMethodSetDefault,
  showAddOptions = true
}: PaymentMethodsProps) {
  const [selectedMethod, setSelectedMethod] = React.useState<string | null>(null);
  const [isAddingMethod, setIsAddingMethod] = React.useState(false);
  const [editingMethod, setEditingMethod] = React.useState<string | null>(null);
  // Use a stable time reference to avoid hydration mismatch
  const [currentTime] = React.useState(() => Date.now());

  // Sample payment methods for demo
  const demoMethods: PaymentMethod[] = methods.length > 0 ? methods : [
    {
      id: 'pm_1',
      type: 'card',
      name: 'Visa',
      details: '•••• 4242',
      isDefault: true,
      expiryDate: '12/25',
      lastUsed: new Date(currentTime - 5 * 24 * 60 * 60 * 1000),
      addedDate: new Date(currentTime - 180 * 24 * 60 * 60 * 1000),
      brand: 'visa',
      last4: '4242',
      status: 'active'
    },
    {
      id: 'pm_2',
      type: 'wallet',
      name: 'PayPal',
      details: 'user@example.com',
      isDefault: false,
      lastUsed: new Date(currentTime - 30 * 24 * 60 * 60 * 1000),
      addedDate: new Date(currentTime - 120 * 24 * 60 * 60 * 1000),
      status: 'active'
    },
    {
      id: 'pm_3',
      type: 'card',
      name: 'Mastercard',
      details: '•••• 5555',
      isDefault: false,
      isExpired: true,
      expiryDate: '06/23',
      addedDate: new Date(currentTime - 365 * 24 * 60 * 60 * 1000),
      brand: 'mastercard',
      last4: '5555',
      status: 'expired'
    },
    {
      id: 'pm_4',
      type: 'gift',
      name: 'Gift Subscription',
      details: 'From John Doe',
      isDefault: false,
      balance: 50,
      currency: 'USD',
      addedDate: new Date(currentTime - 7 * 24 * 60 * 60 * 1000),
      status: 'active'
    },
    {
      id: 'pm_5',
      type: 'credit',
      name: 'Promotional Credit',
      details: 'Welcome bonus',
      isDefault: false,
      balance: 10,
      currency: 'USD',
      addedDate: new Date(currentTime - 14 * 24 * 60 * 60 * 1000),
      status: 'active'
    }
  ];

  // Payment method types
  const methodTypes = [
    {
      id: 'card',
      name: 'Credit/Debit Card',
      icon: CreditCard,
      description: 'Visa, Mastercard, Amex',
      color: 'from-blue-400 to-blue-600',
      popular: true
    },
    {
      id: 'wallet',
      name: 'Digital Wallet',
      icon: Wallet,
      description: 'PayPal, Apple Pay, Google Pay',
      color: 'from-purple-400 to-purple-600',
      popular: true
    },
    {
      id: 'bank',
      name: 'Bank Transfer',
      icon: Building,
      description: 'Direct bank payment',
      color: 'from-green-400 to-green-600',
      popular: false
    },
    {
      id: 'crypto',
      name: 'Cryptocurrency',
      icon: Bitcoin,
      description: 'Bitcoin, Ethereum, USDC',
      color: 'from-orange-400 to-orange-600',
      popular: false
    },
    {
      id: 'gift',
      name: 'Gift Subscription',
      icon: Gift,
      description: 'Received as a gift',
      color: 'from-pink-400 to-pink-600',
      popular: false
    },
    {
      id: 'credit',
      name: 'Account Credit',
      icon: Ticket,
      description: 'Promotional or earned credits',
      color: 'from-indigo-400 to-indigo-600',
      popular: false
    }
  ];

  // Get method icon
  const getMethodIcon = (type: string) => {
    const methodType = methodTypes.find(m => m.id === type);
    return methodType?.icon || CreditCard;
  };

  // Get method color
  const getMethodColor = (type: string) => {
    const methodType = methodTypes.find(m => m.id === type);
    return methodType?.color || 'from-gray-400 to-gray-600';
  };

  // Get status badge
  const getStatusBadge = (status: string, isExpired?: boolean) => {
    if (isExpired) {
      return { color: 'bg-red-100 text-red-700', text: 'Expired' };
    }
    switch (status) {
      case 'active':
        return { color: 'bg-green-100 text-green-700', text: 'Active' };
      case 'failed':
        return { color: 'bg-orange-100 text-orange-700', text: 'Failed' };
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-700', text: 'Pending' };
      default:
        return { color: 'bg-gray-100 text-gray-700', text: status };
    }
  };

  // Format date
  const formatDate = (date: Date) => {
    const days = Math.floor((currentTime - date.getTime()) / (1000 * 60 * 60 * 24));
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  // Handle delete confirmation
  const handleDelete = (methodId: string) => {
    if (confirm('Are you sure you want to remove this payment method?')) {
      onMethodDelete?.(methodId);
    }
  };

  return (
    <div className="space-y-6">
      {/* Payment Methods List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              Payment Methods
            </CardTitle>
            {showAddOptions && (
              <Button
                size="sm"
                onClick={() => setIsAddingMethod(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Method
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {demoMethods.map((method) => {
              const Icon = getMethodIcon(method.type);
              const statusBadge = getStatusBadge(method.status, method.isExpired);
              const isEditing = editingMethod === method.id;
              
              return (
                <motion.div
                  key={method.id}
                  whileHover={{ x: 4 }}
                  className={cn(
                    "p-4 rounded-lg border transition-all",
                    method.isDefault 
                      ? "border-purple-300 bg-purple-50"
                      : method.isExpired
                      ? "border-red-200 bg-red-50"
                      : "border-gray-200 hover:border-purple-300"
                  )}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={cn(
                        "w-12 h-12 rounded-lg bg-gradient-to-br flex items-center justify-center",
                        getMethodColor(method.type)
                      )}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="font-medium">{method.name}</h4>
                          {method.isDefault && (
                            <Badge className="bg-purple-100 text-purple-700 text-xs">
                              <Star className="h-3 w-3 mr-1" />
                              Default
                            </Badge>
                          )}
                          <Badge className={cn("text-xs", statusBadge.color)}>
                            {statusBadge.text}
                          </Badge>
                        </div>
                        
                        <p className="text-sm text-gray-600">{method.details}</p>
                        
                        {/* Additional Details */}
                        <div className="flex flex-wrap items-center gap-4 mt-2 text-xs text-gray-500">
                          {method.expiryDate && (
                            <span>Expires {method.expiryDate}</span>
                          )}
                          {method.balance !== undefined && (
                            <span className="font-medium text-green-600">
                              ${method.balance} {method.currency}
                            </span>
                          )}
                          {method.lastUsed && (
                            <span>Last used {formatDate(method.lastUsed)}</span>
                          )}
                          <span>Added {formatDate(method.addedDate)}</span>
                        </div>
                        
                        {/* Expiry Warning */}
                        {method.isExpired && (
                          <div className="flex items-center gap-2 mt-2 p-2 bg-red-100 rounded text-xs text-red-700">
                            <AlertCircle className="h-3 w-3" />
                            This payment method has expired. Please update or remove it.
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Actions */}
                    <div className="flex items-center gap-2">
                      {!method.isDefault && method.type === 'card' && !method.isExpired && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onMethodSetDefault?.(method.id)}
                        >
                          Set Default
                        </Button>
                      )}
                      
                      {(method.type === 'card' || method.type === 'bank') && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setEditingMethod(method.id)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                      )}
                      
                      {!method.isDefault && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDelete(method.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );
            })}
            
            {demoMethods.length === 0 && (
              <div className="text-center py-8">
                <CreditCard className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No payment methods added</p>
                <p className="text-sm text-gray-500">Add a payment method to start your subscription</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Add Payment Method */}
      <AnimatePresence>
        {isAddingMethod && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Add Payment Method</CardTitle>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => setIsAddingMethod(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {methodTypes.map((type) => {
                    const Icon = type.icon;
                    
                    return (
                      <motion.button
                        key={type.id}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          onMethodAdd?.(type.id);
                          setIsAddingMethod(false);
                        }}
                        className={cn(
                          "p-4 rounded-lg border-2 transition-all text-left",
                          "border-gray-200 hover:border-purple-300 hover:bg-purple-50"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-lg bg-gradient-to-br flex items-center justify-center",
                            type.color
                          )}>
                            <Icon className="h-5 w-5 text-white" />
                          </div>
                          
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium text-sm">{type.name}</h4>
                              {type.popular && (
                                <Badge className="bg-green-100 text-green-700 text-xs">
                                  Popular
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-gray-600 mt-1">{type.description}</p>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Security */}
      <Card className="bg-gradient-to-r from-green-50 to-blue-50">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center shadow-sm">
              <Shield className="h-6 w-6 text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold mb-1">Your payment information is secure</h3>
              <p className="text-sm text-gray-600">
                We use industry-standard encryption and never store your full card details. 
                All transactions are processed through secure payment gateways.
              </p>
            </div>
            <Lock className="h-8 w-8 text-green-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}