"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Search,
  X,
  Command,
  HelpCircle,
  Zap,
  ChevronRight,
  Loader2,
  Check,
  AlertCircle
} from "lucide-react"
import { cn } from "@/lib/utils"
import { motion, AnimatePresence } from "framer-motion"
import { toast } from "sonner"
import { 
  parseAdvancedSearch, 
  hasAdvancedOperators,
  type ParsedSearch 
} from "./advanced-search-parser"
import { 
  processNaturalLanguage,
  simplifyQuery,
  type NLSearchResult 
} from "./natural-language-search"
import { SearchCommandPalette, CommandHint } from "./search-command-palette"
import { SearchHelp, SearchTip } from "./search-help"
import type { FilterState } from "./filter-sidebar"

interface AdvancedSearchBarProps {
  value?: string
  onChange?: (value: string) => void
  onSearch?: (parsed: ParsedSearch, nlResult: NLSearchResult) => void
  onFilterUpdate?: (filters: Partial<FilterState>) => void
  placeholder?: string
  className?: string
}

export function AdvancedSearchBar({
  value: controlledValue,
  onChange,
  onSearch,
  onFilterUpdate,
  placeholder = "Search creators... (try /help for tips)",
  className
}: AdvancedSearchBarProps) {
  const [internalValue, setInternalValue] = React.useState("")
  const [isParsing, setIsParsing] = React.useState(false)
  const [parsedQuery, setParsedQuery] = React.useState<ParsedSearch | null>(null)
  const [nlResult, setNlResult] = React.useState<NLSearchResult | null>(null)
  const [showCommandPalette, setShowCommandPalette] = React.useState(false)
  const [showHelp, setShowHelp] = React.useState(false)
  const [isFocused, setIsFocused] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const value = controlledValue !== undefined ? controlledValue : internalValue
  const setValue = (newValue: string) => {
    if (controlledValue === undefined) {
      setInternalValue(newValue)
    }
    onChange?.(newValue)
    
    // Parse query in real-time
    parseQuery(newValue)
  }

  // Parse query for operators and natural language
  const parseQuery = React.useCallback((query: string) => {
    if (!query) {
      setParsedQuery(null)
      setNlResult(null)
      return
    }

    setIsParsing(true)

    // Check for command
    if (query.startsWith("/")) {
      const parsed = parseAdvancedSearch(query)
      setParsedQuery(parsed)
      setNlResult(null)
      
      // Execute command immediately
      if (parsed.command) {
        handleCommand(parsed.command)
        setValue("") // Clear after command
      }
    } else if (hasAdvancedOperators(query)) {
      // Parse advanced operators
      const parsed = parseAdvancedSearch(query)
      setParsedQuery(parsed)
      setNlResult(null)
    } else {
      // Process as natural language
      const simplified = simplifyQuery(query)
      const nlResult = processNaturalLanguage(simplified)
      setNlResult(nlResult)
      setParsedQuery(null)
    }

    setIsParsing(false)
  }, [])

  // Handle command execution
  const handleCommand = (command: any) => {
    switch (command.type) {
      case "help":
        setShowHelp(true)
        break
      case "clear":
        setValue("")
        onFilterUpdate?.({
          categories: [],
          priceRange: [0, 500],
          languages: [],
          rating: 0,
          responseTime: [],
          availability: "any",
          verified: false,
          location: ""
        })
        toast.success("Search and filters cleared")
        break
      default:
        // Other commands handled by parent
        break
    }
  }

  // Handle search submission
  const handleSearch = () => {
    if (!value.trim()) return

    if (parsedQuery) {
      onSearch?.(parsedQuery, { 
        query: value, 
        filters: parsedQuery.filters || {}, 
        confidence: 100,
        interpretations: []
      })
    } else if (nlResult) {
      onSearch?.({
        tokens: [],
        exactPhrases: [],
        includeTerms: [],
        excludeTerms: [],
        orGroups: [],
        wildcards: [],
        plainText: value,
        filters: nlResult.filters
      }, nlResult)
    } else {
      // Plain text search
      onSearch?.({
        tokens: [],
        exactPhrases: [],
        includeTerms: [],
        excludeTerms: [],
        orGroups: [],
        wildcards: [],
        plainText: value
      }, {
        query: value,
        filters: {},
        confidence: 0,
        interpretations: []
      })
    }
  }

  // Keyboard shortcuts
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // / to focus search
      if (e.key === "/" && !isFocused) {
        e.preventDefault()
        inputRef.current?.focus()
      }

      // Escape to clear
      if (e.key === "Escape" && isFocused) {
        if (value) {
          setValue("")
        } else {
          inputRef.current?.blur()
        }
      }

      // Enter to search
      if (e.key === "Enter" && isFocused) {
        handleSearch()
      }
    }

    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [isFocused, value])

  return (
    <>
      <div className={cn("relative", className)}>
        {/* Search Input */}
        <div className="relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2">
            <Search className="h-5 w-5 text-gray-400" />
          </div>

          <input
            ref={inputRef}
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            placeholder={placeholder}
            className={cn(
              "w-full h-12 pl-10 pr-32 rounded-xl border bg-white dark:bg-gray-800",
              "placeholder:text-gray-400 outline-none transition-all",
              "focus:border-purple-500 focus:ring-4 focus:ring-purple-500/20",
              hasAdvancedOperators(value) && "font-mono text-sm"
            )}
          />

          {/* Operator Indicators */}
          {parsedQuery && (
            <div className="absolute left-10 top-full mt-1 flex flex-wrap gap-1">
              <AnimatePresence mode="popLayout">
                {parsedQuery.exactPhrases.length > 0 && (
                  <OperatorBadge key="exact" type="exact" count={parsedQuery.exactPhrases.length} />
                )}
                {parsedQuery.includeTerms.length > 0 && (
                  <OperatorBadge key="include" type="include" count={parsedQuery.includeTerms.length} />
                )}
                {parsedQuery.excludeTerms.length > 0 && (
                  <OperatorBadge key="exclude" type="exclude" count={parsedQuery.excludeTerms.length} />
                )}
                {parsedQuery.orGroups.length > 0 && (
                  <OperatorBadge key="or" type="or" count={parsedQuery.orGroups.length} />
                )}
                {parsedQuery.wildcards.length > 0 && (
                  <OperatorBadge key="wildcard" type="wildcard" count={parsedQuery.wildcards.length} />
                )}
                {parsedQuery.priceFilter && (
                  <OperatorBadge key="price" type="price" />
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Natural Language Interpretations */}
          {nlResult && nlResult.confidence > 30 && (
            <div className="absolute left-10 top-full mt-1 flex flex-wrap gap-1">
              <AnimatePresence mode="popLayout">
                {nlResult.interpretations.map((interp, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Badge variant="secondary" className="text-xs gap-1">
                      <Check className="h-3 w-3" />
                      {interp}
                    </Badge>
                  </motion.div>
                ))}
                {nlResult.confidence < 70 && (
                  <Badge variant="outline" className="text-xs gap-1">
                    <AlertCircle className="h-3 w-3" />
                    {Math.round(nlResult.confidence)}% confidence
                  </Badge>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Action Buttons */}
          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-1">
            {value && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setValue("")}
                className="h-10 w-10 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowCommandPalette(true)}
              className="h-10 w-10 p-0"
            >
              <Command className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowHelp(true)}
              className="h-10 w-10 p-0"
            >
              <HelpCircle className="h-4 w-4" />
            </Button>

            <Button
              onClick={handleSearch}
              disabled={!value || isParsing}
              size="sm"
              className="h-10 px-4"
            >
              {isParsing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Search
                  <ChevronRight className="h-4 w-4 ml-1" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Helper Text */}
        <div className="flex items-center justify-between mt-2 px-1">
          {isFocused ? (
            <CommandHint />
          ) : (
            <SearchTip />
          )}
          
          {hasAdvancedOperators(value) && (
            <Badge variant="secondary" className="text-xs gap-1">
              <Zap className="h-3 w-3" />
              Advanced mode
            </Badge>
          )}
        </div>
      </div>

      {/* Command Palette */}
      <SearchCommandPalette
        open={showCommandPalette}
        onOpenChange={setShowCommandPalette}
        onCommandSelect={(command) => {
          handleCommand(command)
          setShowCommandPalette(false)
        }}
      />

      {/* Search Help */}
      <SearchHelp
        open={showHelp}
        onOpenChange={setShowHelp}
      />
    </>
  )
}

/**
 * Operator indicator badge
 */
function OperatorBadge({ 
  type, 
  count 
}: { 
  type: "exact" | "include" | "exclude" | "or" | "wildcard" | "price"
  count?: number 
}) {
  const config = {
    exact: { label: "Exact", color: "blue" },
    include: { label: "Must have", color: "green" },
    exclude: { label: "Exclude", color: "red" },
    or: { label: "Either/or", color: "purple" },
    wildcard: { label: "Wildcard", color: "orange" },
    price: { label: "Price", color: "yellow" }
  }

  const { label, color } = config[type]

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
    >
      <Badge 
        variant="outline" 
        className={cn(
          "text-xs gap-1",
          color === "blue" && "border-blue-500 text-blue-700 dark:text-blue-300",
          color === "green" && "border-green-500 text-green-700 dark:text-green-300",
          color === "red" && "border-red-500 text-red-700 dark:text-red-300",
          color === "purple" && "border-purple-500 text-purple-700 dark:text-purple-300",
          color === "orange" && "border-orange-500 text-orange-700 dark:text-orange-300",
          color === "yellow" && "border-yellow-500 text-yellow-700 dark:text-yellow-300"
        )}
      >
        <Zap className="h-3 w-3" />
        {label}
        {count && count > 1 && ` (${count})`}
      </Badge>
    </motion.div>
  )
}