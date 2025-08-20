'use client';

import * as React from 'react';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Plus, Trash2, Ticket, Users, Percent, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { EventData } from '../event-creation-wizard';

interface TicketsStepProps {
  data: EventData;
  onUpdate: (updates: Partial<EventData>) => void;
  errors?: string[];
}

export function EventTicketsStep({
  data,
  onUpdate,
  errors = []
}: TicketsStepProps) {
  const addTicketTier = () => {
    const newTicket = {
      tierId: `tier-${Date.now()}`,
      name: '',
      price: 0,
      capacity: 100,
      perks: []
    };
    onUpdate({ tickets: [...data.tickets, newTicket] });
  };

  const updateTicket = (index: number, updates: any) => {
    const newTickets = [...data.tickets];
    newTickets[index] = { ...newTickets[index], ...updates };
    onUpdate({ tickets: newTickets });
  };

  const removeTicket = (index: number) => {
    onUpdate({ tickets: data.tickets.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      {/* Ticket Tiers */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold">Ticket Tiers</h3>
            <p className="text-sm text-gray-600">Create different pricing options</p>
          </div>
          <Button onClick={addTicketTier} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Tier
          </Button>
        </div>

        {data.tickets.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="p-8 text-center">
              <Ticket className="h-12 w-12 mx-auto text-gray-400 mb-3" />
              <p className="text-gray-600">No ticket tiers yet</p>
              <p className="text-sm text-gray-500 mt-1">Add at least one ticket tier to continue</p>
              <Button onClick={addTicketTier} className="mt-4">
                <Plus className="h-4 w-4 mr-2" />
                Create First Tier
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {data.tickets.map((ticket, index) => (
              <Card key={ticket.tierId}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Input
                      placeholder="Tier name (e.g., General, VIP)"
                      value={ticket.name}
                      onChange={(e) => updateTicket(index, { name: e.target.value })}
                      className="max-w-xs"
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeTicket(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Price ($)</Label>
                    <Input
                      type="number"
                      value={ticket.price}
                      onChange={(e) => updateTicket(index, { price: parseFloat(e.target.value) || 0 })}
                      min="0"
                      step="0.01"
                    />
                  </div>
                  <div>
                    <Label>Capacity</Label>
                    <Input
                      type="number"
                      value={ticket.capacity}
                      onChange={(e) => updateTicket(index, { capacity: parseInt(e.target.value) || 0 })}
                      min="1"
                    />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Group Discount */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <CardTitle className="text-base">Group Discount</CardTitle>
            </div>
            <Switch
              checked={data.groupDiscount?.enabled || false}
              onCheckedChange={(checked) => 
                onUpdate({ 
                  groupDiscount: { 
                    ...data.groupDiscount,
                    enabled: checked,
                    minQuantity: data.groupDiscount?.minQuantity || 5,
                    discountPercent: data.groupDiscount?.discountPercent || 15
                  }
                })
              }
            />
          </div>
        </CardHeader>
        {data.groupDiscount?.enabled && (
          <CardContent className="grid grid-cols-2 gap-4">
            <div>
              <Label>Minimum Quantity</Label>
              <Input
                type="number"
                value={data.groupDiscount.minQuantity}
                onChange={(e) => 
                  onUpdate({ 
                    groupDiscount: { 
                      ...data.groupDiscount,
                      minQuantity: parseInt(e.target.value) || 5
                    }
                  })
                }
                min="2"
              />
            </div>
            <div>
              <Label>Discount %</Label>
              <Input
                type="number"
                value={data.groupDiscount.discountPercent}
                onChange={(e) => 
                  onUpdate({ 
                    groupDiscount: { 
                      ...data.groupDiscount,
                      discountPercent: parseInt(e.target.value) || 0
                    }
                  })
                }
                min="0"
                max="100"
              />
            </div>
          </CardContent>
        )}
      </Card>

      {errors.length > 0 && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{errors[0]}</p>
        </div>
      )}
    </div>
  );
}