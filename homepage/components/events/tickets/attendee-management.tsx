'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Search,
  Filter,
  Mail,
  Phone,
  MoreVertical,
  UserCheck,
  UserX,
  RefreshCw,
  ArrowUpCircle,
  Download,
  Send,
  AlertCircle
} from 'lucide-react';

export interface Attendee {
  id: string;
  name: string;
  email: string;
  phone?: string;
  ticketTier: string;
  ticketNumber: string;
  purchaseDate: Date;
  checkInStatus: 'not-arrived' | 'checked-in' | 'no-show';
  checkInTime?: Date;
  refundRequested?: boolean;
  upgradeRequested?: boolean;
  notes?: string;
}

interface AttendeeManagementProps {
  eventId: string;
  attendees: Attendee[];
  onContactAttendee: (attendee: Attendee) => void;
  onProcessRefund: (attendee: Attendee) => void;
  onProcessUpgrade: (attendee: Attendee) => void;
  onCheckIn: (attendee: Attendee) => void;
  onExport: () => void;
}

export function AttendeeManagement({
  eventId,
  attendees,
  onContactAttendee,
  onProcessRefund,
  onProcessUpgrade,
  onCheckIn,
  onExport
}: AttendeeManagementProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedAttendees, setSelectedAttendees] = React.useState<string[]>([]);
  const [filterStatus, setFilterStatus] = React.useState<'all' | 'checked-in' | 'not-arrived' | 'requests'>('all');

  const filteredAttendees = React.useMemo(() => {
    let filtered = attendees;

    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter(
        a => a.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
             a.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
             a.ticketNumber.includes(searchQuery)
      );
    }

    // Apply status filter
    if (filterStatus === 'checked-in') {
      filtered = filtered.filter(a => a.checkInStatus === 'checked-in');
    } else if (filterStatus === 'not-arrived') {
      filtered = filtered.filter(a => a.checkInStatus === 'not-arrived');
    } else if (filterStatus === 'requests') {
      filtered = filtered.filter(a => a.refundRequested || a.upgradeRequested);
    }

    return filtered;
  }, [attendees, searchQuery, filterStatus]);

  const stats = React.useMemo(() => ({
    total: attendees.length,
    checkedIn: attendees.filter(a => a.checkInStatus === 'checked-in').length,
    notArrived: attendees.filter(a => a.checkInStatus === 'not-arrived').length,
    refundRequests: attendees.filter(a => a.refundRequested).length,
    upgradeRequests: attendees.filter(a => a.upgradeRequested).length,
  }), [attendees]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedAttendees(filteredAttendees.map(a => a.id));
    } else {
      setSelectedAttendees([]);
    }
  };

  const handleSelectAttendee = (attendeeId: string, checked: boolean) => {
    if (checked) {
      setSelectedAttendees([...selectedAttendees, attendeeId]);
    } else {
      setSelectedAttendees(selectedAttendees.filter(id => id !== attendeeId));
    }
  };

  const sendBulkMessage = () => {
    const selected = attendees.filter(a => selectedAttendees.includes(a.id));
    console.log('Send message to:', selected);
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-sm text-gray-600">Total Attendees</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">{stats.checkedIn}</div>
            <p className="text-sm text-gray-600">Checked In</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-gray-600">{stats.notArrived}</div>
            <p className="text-sm text-gray-600">Not Arrived</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-orange-600">{stats.refundRequests}</div>
            <p className="text-sm text-gray-600">Refund Requests</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">{stats.upgradeRequests}</div>
            <p className="text-sm text-gray-600">Upgrade Requests</p>
          </CardContent>
        </Card>
      </div>

      {/* Attendee List */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Attendee List</CardTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onExport}>
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
              {selectedAttendees.length > 0 && (
                <Button size="sm" onClick={sendBulkMessage}>
                  <Send className="h-4 w-4 mr-2" />
                  Message ({selectedAttendees.length})
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, email, or ticket..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter: {filterStatus}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setFilterStatus('all')}>
                  All Attendees
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('checked-in')}>
                  Checked In
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('not-arrived')}>
                  Not Arrived
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setFilterStatus('requests')}>
                  Has Requests
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Table */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedAttendees.length === filteredAttendees.length && filteredAttendees.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Ticket</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Requests</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAttendees.map((attendee) => (
                  <TableRow key={attendee.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedAttendees.includes(attendee.id)}
                        onCheckedChange={(checked) => handleSelectAttendee(attendee.id, checked as boolean)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{attendee.name}</div>
                        <div className="text-xs text-gray-500">#{attendee.ticketNumber}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Mail className="h-3 w-3" />
                          {attendee.email}
                        </div>
                        {attendee.phone && (
                          <div className="flex items-center gap-1 text-sm">
                            <Phone className="h-3 w-3" />
                            {attendee.phone}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <Badge variant="outline">{attendee.ticketTier}</Badge>
                        <div className="text-xs text-gray-500 mt-1">
                          {attendee.purchaseDate.toLocaleDateString()}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {attendee.checkInStatus === 'checked-in' ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <UserCheck className="h-4 w-4" />
                          <span className="text-sm">Checked In</span>
                        </div>
                      ) : attendee.checkInStatus === 'no-show' ? (
                        <div className="flex items-center gap-1 text-red-600">
                          <UserX className="h-4 w-4" />
                          <span className="text-sm">No Show</span>
                        </div>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onCheckIn(attendee)}
                        >
                          Check In
                        </Button>
                      )}
                      {attendee.checkInTime && (
                        <div className="text-xs text-gray-500 mt-1">
                          {attendee.checkInTime.toLocaleTimeString()}
                        </div>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {attendee.refundRequested && (
                          <Badge variant="warning" className="text-xs">
                            <RefreshCw className="h-3 w-3 mr-1" />
                            Refund
                          </Badge>
                        )}
                        {attendee.upgradeRequested && (
                          <Badge variant="default" className="text-xs">
                            <ArrowUpCircle className="h-3 w-3 mr-1" />
                            Upgrade
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => onContactAttendee(attendee)}>
                            <Mail className="h-4 w-4 mr-2" />
                            Contact
                          </DropdownMenuItem>
                          {attendee.checkInStatus === 'not-arrived' && (
                            <DropdownMenuItem onClick={() => onCheckIn(attendee)}>
                              <UserCheck className="h-4 w-4 mr-2" />
                              Check In
                            </DropdownMenuItem>
                          )}
                          {attendee.refundRequested && (
                            <DropdownMenuItem onClick={() => onProcessRefund(attendee)}>
                              <RefreshCw className="h-4 w-4 mr-2" />
                              Process Refund
                            </DropdownMenuItem>
                          )}
                          {attendee.upgradeRequested && (
                            <DropdownMenuItem onClick={() => onProcessUpgrade(attendee)}>
                              <ArrowUpCircle className="h-4 w-4 mr-2" />
                              Process Upgrade
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pending Requests Alert */}
          {(stats.refundRequests > 0 || stats.upgradeRequests > 0) && (
            <div className="mt-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-orange-600" />
                <div>
                  <p className="font-medium text-orange-900">Pending Requests</p>
                  <p className="text-sm text-orange-700">
                    {stats.refundRequests > 0 && `${stats.refundRequests} refund requests`}
                    {stats.refundRequests > 0 && stats.upgradeRequests > 0 && ', '}
                    {stats.upgradeRequests > 0 && `${stats.upgradeRequests} upgrade requests`}
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}