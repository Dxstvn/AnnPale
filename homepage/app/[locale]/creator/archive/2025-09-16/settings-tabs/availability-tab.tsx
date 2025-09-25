// Archived from creator/settings/page.tsx on 2025-09-16
// This tab was used for managing booking availability and schedule

import React from 'react'
import { TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import AvailabilityCalendar from "@/components/creator/settings/availability-calendar"

interface AvailabilityTabProps {
  availability: {
    weeklyLimit: number
    responseTime: string
    vacationMode: boolean
    blackoutDates: any[]
    businessDays: string[]
    businessHours: { start: string; end: string }
  }
  onChange: (updated: any) => void
  setHasUnsavedChanges: React.Dispatch<React.SetStateAction<boolean>>
}

export function AvailabilityTab({
  availability,
  onChange,
  setHasUnsavedChanges
}: AvailabilityTabProps) {
  return (
    <TabsContent value="availability" className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Availability Settings</CardTitle>
          <CardDescription>
            Manage your booking availability and schedule
          </CardDescription>
        </CardHeader>
        <CardContent>
          <AvailabilityCalendar
            availability={availability}
            onChange={(updated) => {
              onChange(updated)
              setHasUnsavedChanges(true)
            }}
          />
        </CardContent>
      </Card>
    </TabsContent>
  )
}