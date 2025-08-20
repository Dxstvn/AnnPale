"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  HelpCircle,
  Search,
  Command,
  Zap,
  MessageSquare,
  Copy,
  Check,
  ChevronRight,
  BookOpen
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { getOperatorHelp } from "./advanced-search-parser"

interface SearchHelpProps {
  open?: boolean
  onOpenChange?: (open: boolean) => void
  className?: string
}

// Example queries organized by category
const exampleQueries = {
  basic: [
    { query: "musicians", description: "Find all musicians" },
    { query: "birthday message", description: "Creators for birthday wishes" },
    { query: "french comedians", description: "French-speaking comedians" }
  ],
  operators: [
    { query: '"happy birthday"', description: "Exact phrase match" },
    { query: "+musician +verified", description: "Must include both terms" },
    { query: "comedy -adult", description: "Exclude adult content" },
    { query: "singer OR musician", description: "Either singers or musicians" },
    { query: "dan*", description: "Names starting with 'dan'" }
  ],
  price: [
    { query: "<$50", description: "Under $50" },
    { query: ">$100", description: "Over $100" },
    { query: "$50-$150", description: "Between $50 and $150" }
  ],
  natural: [
    { query: "musicians under $50", description: "Affordable musicians" },
    { query: "french speaking comedians", description: "Language-specific search" },
    { query: "available this weekend", description: "Availability search" },
    { query: "highly rated athletes", description: "Quality filter" },
    { query: "new creators this month", description: "Recent additions" }
  ],
  commands: [
    { query: "/category music", description: "Browse music category" },
    { query: "/creator john", description: "Search for creator named John" },
    { query: "/recent", description: "View recent searches" },
    { query: "/trending", description: "See trending creators" },
    { query: "/help", description: "Open this help dialog" }
  ]
}

// Keyboard shortcuts
const shortcuts = [
  { keys: ["⌘", "K"], description: "Open command palette" },
  { keys: ["/"], description: "Focus search with commands" },
  { keys: ["↵"], description: "Execute search" },
  { keys: ["ESC"], description: "Clear search or close dialog" },
  { keys: ["↑", "↓"], description: "Navigate suggestions" },
  { keys: ["TAB"], description: "Autocomplete suggestion" }
]

export function SearchHelp({
  open = false,
  onOpenChange,
  className
}: SearchHelpProps) {
  const [copiedExample, setCopiedExample] = React.useState<string | null>(null)
  const operators = getOperatorHelp()

  // Copy example to clipboard
  const copyExample = (query: string) => {
    navigator.clipboard.writeText(query)
    setCopiedExample(query)
    toast.success("Copied to clipboard!")
    setTimeout(() => setCopiedExample(null), 2000)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2">
          <HelpCircle className="h-4 w-4" />
          Search Help
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Search Guide
          </DialogTitle>
          <DialogDescription>
            Learn how to use advanced search features to find creators quickly
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basics" className="mt-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="basics">Basics</TabsTrigger>
            <TabsTrigger value="operators">Operators</TabsTrigger>
            <TabsTrigger value="natural">Natural</TabsTrigger>
            <TabsTrigger value="commands">Commands</TabsTrigger>
            <TabsTrigger value="shortcuts">Shortcuts</TabsTrigger>
          </TabsList>

          {/* Basic Search */}
          <TabsContent value="basics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Basic Search
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Start with simple keywords to find creators. The search looks through names,
                  categories, and descriptions.
                </p>
                <div className="space-y-2">
                  {exampleQueries.basic.map((example) => (
                    <ExampleQuery
                      key={example.query}
                      query={example.query}
                      description={example.description}
                      onCopy={copyExample}
                      isCopied={copiedExample === example.query}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Search Operators */}
          <TabsContent value="operators" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Search Operators
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Use special operators for precise control over your search results.
                </p>
                
                {/* Operator reference */}
                <div className="space-y-3">
                  {operators.map((op) => (
                    <div key={op.operator} className="flex items-start gap-3 p-3 rounded-lg bg-muted/50">
                      <Badge variant="secondary" className="font-mono">
                        {op.operator}
                      </Badge>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{op.description}</p>
                        <code className="text-xs text-muted-foreground">{op.example}</code>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Examples */}
                <div className="space-y-2 pt-4 border-t">
                  <h4 className="text-sm font-medium mb-2">Examples</h4>
                  {exampleQueries.operators.map((example) => (
                    <ExampleQuery
                      key={example.query}
                      query={example.query}
                      description={example.description}
                      onCopy={copyExample}
                      isCopied={copiedExample === example.query}
                    />
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Natural Language */}
          <TabsContent value="natural" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <MessageSquare className="h-4 w-4" />
                  Natural Language Search
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Type naturally and let our AI understand what you're looking for.
                  No need to remember special syntax!
                </p>

                <div className="space-y-2">
                  {exampleQueries.natural.map((example) => (
                    <ExampleQuery
                      key={example.query}
                      query={example.query}
                      description={example.description}
                      onCopy={copyExample}
                      isCopied={copiedExample === example.query}
                    />
                  ))}
                </div>

                <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20">
                  <p className="text-sm">
                    <strong>Tip:</strong> Combine natural language with operators for even
                    more powerful searches like{" "}
                    <code className="px-1 py-0.5 rounded bg-white dark:bg-gray-800">
                      "birthday message" +verified under $100
                    </code>
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Commands */}
          <TabsContent value="commands" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Command className="h-4 w-4" />
                  Quick Commands
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Start your search with <kbd className="px-1 rounded bg-muted">/</kbd> to
                  access quick commands for common actions.
                </p>

                <div className="space-y-2">
                  {exampleQueries.commands.map((example) => (
                    <ExampleQuery
                      key={example.query}
                      query={example.query}
                      description={example.description}
                      onCopy={copyExample}
                      isCopied={copiedExample === example.query}
                    />
                  ))}
                </div>

                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
                  <p className="text-sm">
                    <strong>Pro tip:</strong> Press{" "}
                    <kbd className="px-1 rounded bg-white dark:bg-gray-800">⌘K</kbd> to open
                    the command palette for even faster access to all commands.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Keyboard Shortcuts */}
          <TabsContent value="shortcuts" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Keyboard Shortcuts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {shortcuts.map((shortcut) => (
                    <div
                      key={shortcut.keys.join("+")}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition"
                    >
                      <div className="flex items-center gap-2">
                        {shortcut.keys.map((key, index) => (
                          <React.Fragment key={key}>
                            <kbd className="px-2 py-1 rounded bg-muted border text-xs font-mono">
                              {key}
                            </kbd>
                            {index < shortcut.keys.length - 1 && (
                              <span className="text-muted-foreground">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {shortcut.description}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Footer tips */}
        <div className="mt-6 p-4 rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
          <p className="text-sm">
            <strong>Need more help?</strong> Contact our support team or browse our{" "}
            <Button variant="link" className="p-0 h-auto">
              full documentation
            </Button>
            .
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

/**
 * Example query component
 */
function ExampleQuery({
  query,
  description,
  onCopy,
  isCopied
}: {
  query: string
  description: string
  onCopy: (query: string) => void
  isCopied: boolean
}) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center justify-between p-2 rounded-lg hover:bg-muted/50 transition group"
    >
      <div className="flex-1">
        <code className="text-sm font-mono">{query}</code>
        <p className="text-xs text-muted-foreground mt-1">{description}</p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onCopy(query)}
        className="opacity-0 group-hover:opacity-100 transition"
      >
        {isCopied ? (
          <Check className="h-3 w-3 text-green-600" />
        ) : (
          <Copy className="h-3 w-3" />
        )}
      </Button>
    </motion.div>
  )
}

/**
 * Inline search tip component
 */
export function SearchTip() {
  const tips = [
    'Use "quotes" for exact phrases',
    "Add + to require a term",
    "Use - to exclude terms",
    "Try /help for search guide",
    "Press ⌘K for commands",
    "Use * for wildcards"
  ]

  const [currentTip, setCurrentTip] = React.useState(0)

  React.useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTip((prev) => (prev + 1) % tips.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      key={currentTip}
      initial={{ opacity: 0, y: -5 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 5 }}
      className="flex items-center gap-2 text-xs text-muted-foreground"
    >
      <Zap className="h-3 w-3" />
      <span>Tip: {tips[currentTip]}</span>
    </motion.div>
  )
}