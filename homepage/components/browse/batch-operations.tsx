"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Heart,
  Share2,
  Download,
  MessageSquare,
  FileText,
  X,
  CheckSquare,
  Square,
  MinusSquare,
  MoreVertical,
  Users,
  Star,
  Copy,
  Mail,
  Filter,
  Trash2
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import type { EnhancedCreator } from "./enhanced-creator-card"

interface BatchOperationsProps {
  creators: EnhancedCreator[]
  selectedIds: Set<string>
  onSelectionChange: (ids: Set<string>) => void
  onBulkAction: (action: string, ids: string[]) => void
  selectionMode: boolean
  onToggleSelectionMode: () => void
  className?: string
}

export function BatchOperations({
  creators,
  selectedIds,
  onSelectionChange,
  onBulkAction,
  selectionMode,
  onToggleSelectionMode,
  className
}: BatchOperationsProps) {
  const selectedCount = selectedIds.size
  const allSelected = selectedCount === creators.length && creators.length > 0
  const someSelected = selectedCount > 0 && selectedCount < creators.length

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange(new Set())
    } else {
      onSelectionChange(new Set(creators.map(c => c.id)))
    }
  }

  const handleBulkFavorite = () => {
    onBulkAction("favorite", Array.from(selectedIds))
    toast.success(`Added ${selectedCount} creators to favorites`)
  }

  const handleBulkShare = () => {
    onBulkAction("share", Array.from(selectedIds))
    toast.success("Share link copied to clipboard")
  }

  const handleBulkExport = () => {
    onBulkAction("export", Array.from(selectedIds))
    toast.success("Exporting creator list...")
  }

  const handleBulkMessage = () => {
    onBulkAction("message", Array.from(selectedIds))
    toast.success("Opening bulk message composer...")
  }

  const handleBulkQuote = () => {
    onBulkAction("quote", Array.from(selectedIds))
    toast.success("Requesting quotes from selected creators...")
  }

  const handleClearSelection = () => {
    onSelectionChange(new Set())
  }

  return (
    <TooltipProvider>
      <div className={cn("space-y-4", className)}>
        {/* Selection Mode Toggle */}
        <div className="flex items-center justify-between">
          <Button
            variant={selectionMode ? "default" : "outline"}
            size="sm"
            onClick={onToggleSelectionMode}
            className={cn(
              selectionMode && "bg-purple-600 hover:bg-purple-700"
            )}
          >
            <CheckSquare className="h-4 w-4 mr-2" />
            {selectionMode ? "Exit Selection" : "Select Multiple"}
          </Button>

          {selectionMode && (
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedCount} selected
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSelectAll}
              >
                {allSelected ? (
                  <>
                    <MinusSquare className="h-4 w-4 mr-1" />
                    Deselect All
                  </>
                ) : (
                  <>
                    <Square className="h-4 w-4 mr-1" />
                    Select All
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Bulk Actions Bar */}
        <AnimatePresence>
          {selectionMode && selectedCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="sticky top-20 z-30 bg-white dark:bg-gray-900 border rounded-lg shadow-lg p-4"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Badge variant="secondary" className="text-sm">
                    {selectedCount} selected
                  </Badge>
                  
                  <div className="flex items-center gap-2">
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleBulkFavorite}
                        >
                          <Heart className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Add to Favorites</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleBulkShare}
                        >
                          <Share2 className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Share Collection</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleBulkMessage}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Message Selected</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleBulkQuote}
                        >
                          <FileText className="h-4 w-4" />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>Request Quotes</TooltipContent>
                    </Tooltip>

                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="outline" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={handleBulkExport}>
                          <Download className="h-4 w-4 mr-2" />
                          Export List
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onBulkAction("compare", Array.from(selectedIds))}>
                          <Users className="h-4 w-4 mr-2" />
                          Compare Selected
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => onBulkAction("collection", Array.from(selectedIds))}>
                          <Copy className="h-4 w-4 mr-2" />
                          Create Collection
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={handleClearSelection}
                          className="text-red-600"
                        >
                          <X className="h-4 w-4 mr-2" />
                          Clear Selection
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClearSelection}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              {/* Selection Info */}
              <div className="mt-3 flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400">
                <span>Hold Shift for range selection</span>
                <span>•</span>
                <span>Ctrl/Cmd + Click for individual selection</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </TooltipProvider>
  )
}

// Selection checkbox component for creator cards
export function SelectionCheckbox({
  creatorId,
  isSelected,
  onToggle,
  className
}: {
  creatorId: string
  isSelected: boolean
  onToggle: (id: string) => void
  className?: string
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className={cn(
        "absolute top-3 left-3 z-10",
        className
      )}
    >
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => onToggle(creatorId)}
        className="h-5 w-5 bg-white/90 dark:bg-gray-900/90 backdrop-blur"
      />
    </motion.div>
  )
}

// Hook for batch selection logic
export function useBatchSelection(creators: EnhancedCreator[]) {
  const [selectionMode, setSelectionMode] = React.useState(false)
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set())
  const [lastSelectedIndex, setLastSelectedIndex] = React.useState<number | null>(null)

  const toggleSelectionMode = () => {
    setSelectionMode(prev => !prev)
    if (selectionMode) {
      setSelectedIds(new Set())
      setLastSelectedIndex(null)
    }
  }

  const toggleSelection = (id: string, index: number, event?: React.MouseEvent) => {
    const newSelection = new Set(selectedIds)
    
    if (event?.shiftKey && lastSelectedIndex !== null) {
      // Range selection
      const start = Math.min(lastSelectedIndex, index)
      const end = Math.max(lastSelectedIndex, index)
      
      for (let i = start; i <= end; i++) {
        newSelection.add(creators[i].id)
      }
    } else if (event?.ctrlKey || event?.metaKey) {
      // Toggle individual selection
      if (newSelection.has(id)) {
        newSelection.delete(id)
      } else {
        newSelection.add(id)
      }
    } else {
      // Normal toggle
      if (newSelection.has(id)) {
        newSelection.delete(id)
      } else {
        newSelection.add(id)
      }
    }
    
    setSelectedIds(newSelection)
    setLastSelectedIndex(index)
  }

  const selectAll = () => {
    setSelectedIds(new Set(creators.map(c => c.id)))
  }

  const clearSelection = () => {
    setSelectedIds(new Set())
    setLastSelectedIndex(null)
  }

  const handleBulkAction = async (action: string, ids: string[]) => {
    console.log(`Performing ${action} on`, ids)
    
    // Simulate async action
    await new Promise(resolve => setTimeout(resolve, 500))
    
    // Clear selection after action
    if (action !== "compare") {
      clearSelection()
    }
  }

  return {
    selectionMode,
    selectedIds,
    toggleSelectionMode,
    toggleSelection,
    selectAll,
    clearSelection,
    handleBulkAction,
    setSelectedIds
  }
}

// Keyboard shortcuts for batch operations
export function useBatchKeyboardShortcuts({
  selectionMode,
  toggleSelectionMode,
  selectAll,
  clearSelection
}: {
  selectionMode: boolean
  toggleSelectionMode: () => void
  selectAll: () => void
  clearSelection: () => void
}) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle selection mode with 's'
      if (e.key === 's' && !e.ctrlKey && !e.metaKey) {
        const target = e.target as HTMLElement
        if (target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA') {
          e.preventDefault()
          toggleSelectionMode()
        }
      }
      
      // Select all with Ctrl/Cmd + A
      if ((e.ctrlKey || e.metaKey) && e.key === 'a' && selectionMode) {
        e.preventDefault()
        selectAll()
      }
      
      // Clear selection with Escape
      if (e.key === 'Escape' && selectionMode) {
        clearSelection()
      }
    }
    
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectionMode, toggleSelectionMode, selectAll, clearSelection])
}