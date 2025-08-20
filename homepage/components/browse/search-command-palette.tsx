"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import {
  Search,
  Users,
  Clock,
  TrendingUp,
  Bookmark,
  HelpCircle,
  RotateCcw,
  Tag,
  User,
  Filter,
  Globe,
  DollarSign,
  Calendar,
  Zap,
  Command as CommandIcon
} from "lucide-react"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import type { SearchCommand } from "./advanced-search-parser"

interface SearchCommandPaletteProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  onCommandSelect: (command: SearchCommand) => void
  recentSearches?: string[]
  savedSearches?: string[]
  categories?: string[]
  className?: string
}

// Command definitions
const commands = [
  {
    group: "Quick Actions",
    items: [
      {
        id: "category",
        label: "Browse Category",
        description: "Browse creators by category",
        icon: Tag,
        command: "/category",
        shortcut: "⌘K C"
      },
      {
        id: "creator",
        label: "Find Creator",
        description: "Search for specific creator",
        icon: User,
        command: "/creator",
        shortcut: "⌘K U"
      },
      {
        id: "trending",
        label: "Trending Now",
        description: "See what's popular",
        icon: TrendingUp,
        command: "/trending",
        shortcut: "⌘K T"
      },
      {
        id: "recent",
        label: "Recent Searches",
        description: "View your search history",
        icon: Clock,
        command: "/recent",
        shortcut: "⌘K R"
      },
      {
        id: "saved",
        label: "Saved Searches",
        description: "Your bookmarked searches",
        icon: Bookmark,
        command: "/saved",
        shortcut: "⌘K S"
      }
    ]
  },
  {
    group: "Filters",
    items: [
      {
        id: "filter-price",
        label: "Filter by Price",
        description: "Set price range",
        icon: DollarSign,
        command: "/filter price",
        shortcut: "⌘K P"
      },
      {
        id: "filter-language",
        label: "Filter by Language",
        description: "Select languages",
        icon: Globe,
        command: "/filter language",
        shortcut: "⌘K L"
      },
      {
        id: "filter-availability",
        label: "Filter by Availability",
        description: "Available now or later",
        icon: Calendar,
        command: "/filter availability",
        shortcut: "⌘K A"
      }
    ]
  },
  {
    group: "System",
    items: [
      {
        id: "clear",
        label: "Clear Search",
        description: "Reset search and filters",
        icon: RotateCcw,
        command: "/clear",
        shortcut: "⌘K X"
      },
      {
        id: "help",
        label: "Search Help",
        description: "Learn search operators",
        icon: HelpCircle,
        command: "/help",
        shortcut: "⌘K ?"
      }
    ]
  }
]

export function SearchCommandPalette({
  open = false,
  onOpenChange,
  onCommandSelect,
  recentSearches = [],
  savedSearches = [],
  categories = [],
  className
}: SearchCommandPaletteProps) {
  const [search, setSearch] = React.useState("")
  const [selectedGroup, setSelectedGroup] = React.useState<string | null>(null)

  // Handle command selection
  const handleSelect = (commandId: string, argument?: string) => {
    const command = commands
      .flatMap(g => g.items)
      .find(c => c.id === commandId)

    if (!command) return

    let searchCommand: SearchCommand

    switch (commandId) {
      case "category":
        searchCommand = { type: "category", argument }
        break
      case "creator":
        searchCommand = { type: "creator", argument }
        break
      case "trending":
        searchCommand = { type: "trending" }
        break
      case "recent":
        searchCommand = { type: "recent" }
        break
      case "saved":
        searchCommand = { type: "saved" }
        break
      case "clear":
        searchCommand = { type: "clear" }
        break
      case "help":
      default:
        searchCommand = { type: "help" }
        break
    }

    onCommandSelect(searchCommand)
    onOpenChange?.(false)
    setSearch("")
    setSelectedGroup(null)

    // Show feedback
    toast.success(`Command executed: ${command.command}`)
  }

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ⌘K or Ctrl+K to open
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        onOpenChange?.(!open)
      }

      // / to open with search focus
      if (e.key === "/" && !open && 
          !["input", "textarea"].includes((e.target as HTMLElement).tagName.toLowerCase())) {
        e.preventDefault()
        onOpenChange?.(true)
      }

      // Escape to close
      if (e.key === "Escape" && open) {
        onOpenChange?.(false)
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [open, onOpenChange])

  return (
    <>
      {/* Trigger hint */}
      {!open && (
        <div className="fixed bottom-4 right-4 z-40">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange?.(true)}
            className="gap-2 shadow-lg"
          >
            <CommandIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Command Palette</span>
            <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground">
              <span className="text-xs">⌘</span>K
            </kbd>
          </Button>
        </div>
      )}

      {/* Command Dialog */}
      <CommandDialog open={open} onOpenChange={onOpenChange}>
        <CommandInput
          placeholder="Type a command or search..."
          value={search}
          onValueChange={setSearch}
        />
        <CommandList className="max-h-[400px]">
          <CommandEmpty>
            No commands found. Type "/" to see available commands.
          </CommandEmpty>

          {/* Dynamic content based on selected command */}
          {selectedGroup === "category" && categories.length > 0 ? (
            <CommandGroup heading="Select Category">
              {categories.map((category) => (
                <CommandItem
                  key={category}
                  onSelect={() => handleSelect("category", category)}
                >
                  <Tag className="mr-2 h-4 w-4" />
                  {category}
                </CommandItem>
              ))}
            </CommandGroup>
          ) : selectedGroup === "recent" && recentSearches.length > 0 ? (
            <CommandGroup heading="Recent Searches">
              {recentSearches.map((search, index) => (
                <CommandItem
                  key={index}
                  onSelect={() => handleSelect("creator", search)}
                >
                  <Clock className="mr-2 h-4 w-4" />
                  {search}
                </CommandItem>
              ))}
            </CommandGroup>
          ) : selectedGroup === "saved" && savedSearches.length > 0 ? (
            <CommandGroup heading="Saved Searches">
              {savedSearches.map((search, index) => (
                <CommandItem
                  key={index}
                  onSelect={() => handleSelect("creator", search)}
                >
                  <Bookmark className="mr-2 h-4 w-4" />
                  {search}
                </CommandItem>
              ))}
            </CommandGroup>
          ) : (
            // Default command list
            commands.map((group) => (
              <React.Fragment key={group.group}>
                <CommandGroup heading={group.group}>
                  {group.items.map((item) => {
                    const Icon = item.icon
                    return (
                      <CommandItem
                        key={item.id}
                        onSelect={() => {
                          if (item.id === "category" || 
                              item.id === "recent" || 
                              item.id === "saved") {
                            setSelectedGroup(item.id)
                          } else {
                            handleSelect(item.id)
                          }
                        }}
                      >
                        <Icon className="mr-2 h-4 w-4" />
                        <div className="flex flex-1 items-center justify-between">
                          <div>
                            <div className="font-medium">{item.label}</div>
                            <div className="text-xs text-muted-foreground">
                              {item.description}
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {item.command}
                            </Badge>
                            {item.shortcut && (
                              <CommandShortcut>{item.shortcut}</CommandShortcut>
                            )}
                          </div>
                        </div>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
                <CommandSeparator />
              </React.Fragment>
            ))
          )}

          {/* Quick help footer */}
          <div className="p-2 text-xs text-muted-foreground border-t">
            <div className="flex items-center justify-between">
              <span>Use arrow keys to navigate</span>
              <div className="flex items-center gap-2">
                <kbd className="px-1 rounded bg-muted">↵</kbd>
                <span>to select</span>
                <kbd className="px-1 rounded bg-muted">esc</kbd>
                <span>to close</span>
              </div>
            </div>
          </div>
        </CommandList>
      </CommandDialog>
    </>
  )
}

/**
 * Inline command hint component
 */
export function CommandHint({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-2 text-xs text-muted-foreground", className)}>
      <Zap className="h-3 w-3" />
      <span>Tip: Press</span>
      <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">/</kbd>
      <span>for commands or</span>
      <kbd className="px-1.5 py-0.5 rounded bg-muted font-mono text-[10px]">
        <span className="text-xs">⌘</span>K
      </kbd>
      <span>for palette</span>
    </div>
  )
}