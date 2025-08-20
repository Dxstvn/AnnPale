"use client"

import * as React from "react"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { Grid3X3, List, LayoutGrid } from "lucide-react"
import { cn } from "@/lib/utils"

export type ViewMode = "grid" | "list" | "compact"

interface ViewToggleProps {
  value: ViewMode
  onChange: (value: ViewMode) => void
  className?: string
}

export function ViewToggle({ value, onChange, className }: ViewToggleProps) {
  return (
    <ToggleGroup
      type="single"
      value={value}
      onValueChange={(newValue) => {
        if (newValue) onChange(newValue as ViewMode)
      }}
      className={cn("bg-gray-100 dark:bg-gray-800 p-1 rounded-lg", className)}
    >
      <ToggleGroupItem
        value="grid"
        aria-label="Grid view"
        className="data-[state=on]:bg-white dark:data-[state=on]:bg-gray-900 data-[state=on]:shadow-sm"
      >
        <Grid3X3 className="h-4 w-4" />
        <span className="ml-2 hidden sm:inline">Grid</span>
      </ToggleGroupItem>
      <ToggleGroupItem
        value="list"
        aria-label="List view"
        className="data-[state=on]:bg-white dark:data-[state=on]:bg-gray-900 data-[state=on]:shadow-sm"
      >
        <List className="h-4 w-4" />
        <span className="ml-2 hidden sm:inline">List</span>
      </ToggleGroupItem>
      <ToggleGroupItem
        value="compact"
        aria-label="Compact view"
        className="data-[state=on]:bg-white dark:data-[state=on]:bg-gray-900 data-[state=on]:shadow-sm"
      >
        <LayoutGrid className="h-4 w-4" />
        <span className="ml-2 hidden sm:inline">Compact</span>
      </ToggleGroupItem>
    </ToggleGroup>
  )
}

export default ViewToggle
