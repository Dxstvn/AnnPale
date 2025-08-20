"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Folder,
  FolderOpen,
  Clock,
  Calendar,
  Users,
  User,
  Gift,
  Heart,
  Star,
  Tag,
  Hash,
  Grid,
  List,
  Layers,
  Archive,
  FileText,
  FileVideo,
  Film,
  Video,
  PlayCircle,
  Upload,
  Download,
  Send,
  Check,
  CheckCircle,
  AlertCircle,
  Info,
  Edit,
  Trash,
  Plus,
  Minus,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ArrowLeft,
  ArrowUp,
  ArrowDown,
  MoreVertical,
  Settings,
  Filter,
  Search,
  Zap,
  Brain,
  Sparkles,
  Trophy,
  Award,
  Target,
  Briefcase,
  Package,
  Box,
  Database,
  HardDrive,
  Save,
  RefreshCw,
  Activity,
  BarChart3,
  PieChart,
  TrendingUp,
  Layout,
  Palette,
  Wand2,
  Camera,
  Mic,
  Headphones,
  Monitor,
  Smartphone,
  Timer,
  CalendarDays,
  UserCircle,
  UserCheck,
  UserPlus,
  FolderTree,
  FolderPlus,
  FolderMinus,
  FolderSearch,
  FolderClock,
  History,
  RotateCcw,
  FastForward,
  Rewind,
  Pause,
  Play
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

// Types
export interface ContentPersona {
  id: string
  name: string
  organizationStyle: string
  primaryNeed: string
  painPoints: string[]
  solutionFocus: string
  icon: React.ElementType
  color: string
  percentage: number
}

export interface ContentLifecycleStage {
  id: string
  name: string
  phase: "creation" | "processing" | "delivery" | "archive"
  subStages: string[]
  icon: React.ElementType
  color: string
  duration?: string
  status?: "active" | "pending" | "completed"
}

export interface OrganizationPattern {
  id: string
  pattern: string
  description: string
  icon: React.ElementType
  examples: string[]
  usage: number
  recommended?: boolean
}

export interface ContentItem {
  id: string
  title: string
  type: "video" | "script" | "draft" | "final"
  status: "draft" | "in_progress" | "complete" | "delivered" | "archived"
  customer?: string
  occasion?: string
  quality?: "portfolio" | "standard" | "practice"
  date: Date
  tags: string[]
  thumbnail?: string
  duration?: string
  size?: string
}

export interface WorkflowTemplate {
  id: string
  name: string
  persona: string
  steps: string[]
  estimatedTime: string
  automations: number
}

export interface ContentOrganizationPsychologyProps {
  onPersonaSelect?: (personaId: string) => void
  onPatternSelect?: (patternId: string) => void
  onWorkflowCreate?: (workflow: WorkflowTemplate) => void
  onContentReorganize?: (items: ContentItem[], pattern: string) => void
}

// Mock data generators
const generateContentPersonas = (): ContentPersona[] => {
  return [
    {
      id: "systematic",
      name: "The Systematic Organizer",
      organizationStyle: "Folders & categories",
      primaryNeed: "Structure",
      painPoints: ["Finding old content", "Inconsistent naming", "Duplicate files"],
      solutionFocus: "Advanced categorization",
      icon: FolderTree,
      color: "text-blue-600",
      percentage: 35
    },
    {
      id: "chronological",
      name: "The Time-Based Filer",
      organizationStyle: "Time-based",
      primaryNeed: "Recent access",
      painPoints: ["Scrolling through history", "Date confusion", "Missing timestamps"],
      solutionFocus: "Timeline view",
      icon: Clock,
      color: "text-green-600",
      percentage: 25
    },
    {
      id: "project_based",
      name: "The Project Manager",
      organizationStyle: "By customer/occasion",
      primaryNeed: "Context",
      painPoints: ["Switching contexts", "Project overlap", "Client confusion"],
      solutionFocus: "Grouping tools",
      icon: Briefcase,
      color: "text-purple-600",
      percentage: 20
    },
    {
      id: "minimal",
      name: "The Minimalist",
      organizationStyle: "Basic organization",
      primaryNeed: "Simplicity",
      painPoints: ["Complex systems", "Too many options", "Overwhelm"],
      solutionFocus: "Smart defaults",
      icon: Archive,
      color: "text-gray-600",
      percentage: 15
    },
    {
      id: "power_user",
      name: "The Power User",
      organizationStyle: "Tags & metadata",
      primaryNeed: "Control",
      painPoints: ["Limited options", "Basic features", "Lack of customization"],
      solutionFocus: "Custom fields",
      icon: Database,
      color: "text-orange-600",
      percentage: 5
    }
  ]
}

const generateLifecycleStages = (): ContentLifecycleStage[] => {
  return [
    {
      id: "creation",
      name: "Creation",
      phase: "creation",
      subStages: ["Planning", "Scripts", "Setup"],
      icon: Sparkles,
      color: "text-blue-600",
      duration: "30 min",
      status: "completed"
    },
    {
      id: "processing",
      name: "Processing",
      phase: "processing",
      subStages: ["Recording", "Raw video", "Editing"],
      icon: Film,
      color: "text-purple-600",
      duration: "45 min",
      status: "active"
    },
    {
      id: "delivery",
      name: "Delivery",
      phase: "delivery",
      subStages: ["Review", "Edited", "Sent"],
      icon: Send,
      color: "text-green-600",
      duration: "15 min",
      status: "pending"
    },
    {
      id: "archive",
      name: "Archive",
      phase: "archive",
      subStages: ["Storage", "Organized", "Backed up"],
      icon: Archive,
      color: "text-gray-600",
      duration: "5 min",
      status: "pending"
    }
  ]
}

const generateOrganizationPatterns = (): OrganizationPattern[] => {
  return [
    {
      id: "by_status",
      pattern: "By Status",
      description: "Organize content by completion status",
      icon: Activity,
      examples: ["Draft", "In Progress", "Complete", "Delivered"],
      usage: 78,
      recommended: true
    },
    {
      id: "by_customer",
      pattern: "By Customer",
      description: "Individual customer folders",
      icon: Users,
      examples: ["John Smith", "Sarah Johnson", "Mike Wilson"],
      usage: 65
    },
    {
      id: "by_occasion",
      pattern: "By Occasion",
      description: "Group by event type",
      icon: Gift,
      examples: ["Birthday", "Wedding", "Anniversary", "Graduation"],
      usage: 52
    },
    {
      id: "by_quality",
      pattern: "By Quality",
      description: "Separate by production quality",
      icon: Star,
      examples: ["Portfolio", "Standard", "Practice", "Test"],
      usage: 38
    },
    {
      id: "by_date",
      pattern: "By Date",
      description: "Chronological organization",
      icon: Calendar,
      examples: ["Today", "This Week", "This Month", "Older"],
      usage: 71,
      recommended: true
    }
  ]
}

const generateContentItems = (): ContentItem[] => {
  return [
    {
      id: "1",
      title: "Birthday Message - Sarah M.",
      type: "video",
      status: "complete",
      customer: "Sarah Miller",
      occasion: "Birthday",
      quality: "standard",
      date: new Date(Date.now() - 1000 * 60 * 60 * 2),
      tags: ["birthday", "personal", "english"],
      duration: "2:30",
      size: "45MB"
    },
    {
      id: "2",
      title: "Wedding Anniversary - John & Mary",
      type: "video",
      status: "in_progress",
      customer: "John Davis",
      occasion: "Anniversary",
      quality: "portfolio",
      date: new Date(Date.now() - 1000 * 60 * 60 * 24),
      tags: ["anniversary", "couple", "romantic"],
      duration: "3:15",
      size: "62MB"
    },
    {
      id: "3",
      title: "Graduation Congratulations",
      type: "script",
      status: "draft",
      customer: "Mike Wilson",
      occasion: "Graduation",
      quality: "standard",
      date: new Date(Date.now() - 1000 * 60 * 60 * 48),
      tags: ["graduation", "achievement", "motivational"]
    },
    {
      id: "4",
      title: "Business Partnership Message",
      type: "video",
      status: "delivered",
      customer: "Tech Corp",
      occasion: "Business",
      quality: "portfolio",
      date: new Date(Date.now() - 1000 * 60 * 60 * 72),
      tags: ["business", "professional", "corporate"],
      duration: "1:45",
      size: "38MB"
    },
    {
      id: "5",
      title: "Mother's Day Special",
      type: "final",
      status: "archived",
      customer: "Emma Thompson",
      occasion: "Mother's Day",
      quality: "portfolio",
      date: new Date(Date.now() - 1000 * 60 * 60 * 96),
      tags: ["holiday", "family", "emotional"],
      duration: "2:00",
      size: "42MB"
    }
  ]
}

const generateWorkflowTemplates = (): WorkflowTemplate[] => {
  return [
    {
      id: "systematic_workflow",
      name: "Systematic Creator Workflow",
      persona: "systematic",
      steps: ["Create folder structure", "Import content", "Apply metadata", "Organize by category", "Archive completed"],
      estimatedTime: "15 min",
      automations: 3
    },
    {
      id: "minimal_workflow",
      name: "Simple & Quick Workflow",
      persona: "minimal",
      steps: ["Upload content", "Quick review", "Deliver", "Auto-archive"],
      estimatedTime: "5 min",
      automations: 2
    },
    {
      id: "power_workflow",
      name: "Advanced Power User Flow",
      persona: "power_user",
      steps: ["Tag extensively", "Custom metadata", "Advanced filters", "Batch operations", "Export analytics"],
      estimatedTime: "20 min",
      automations: 5
    }
  ]
}

// Sub-components
const PersonaCard: React.FC<{
  persona: ContentPersona
  isSelected: boolean
  onSelect: () => void
}> = ({ persona, isSelected, onSelect }) => {
  const Icon = persona.icon

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className={cn(
          "cursor-pointer transition-all",
          isSelected && "ring-2 ring-blue-500"
        )}
        onClick={onSelect}
      >
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={cn("p-2 rounded-lg bg-gray-100 dark:bg-gray-800", persona.color)}>
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <CardTitle className="text-lg">{persona.name}</CardTitle>
                <CardDescription className="text-sm">
                  {persona.organizationStyle}
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline">
              {persona.percentage}%
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <h5 className="text-sm font-medium mb-1">Primary Need:</h5>
              <p className="text-sm text-gray-600">{persona.primaryNeed}</p>
            </div>
            
            <div>
              <h5 className="text-sm font-medium mb-1">Pain Points:</h5>
              <ul className="text-sm text-gray-600 space-y-1">
                {persona.painPoints.map((point, index) => (
                  <li key={index} className="flex items-center gap-2">
                    <AlertCircle className="h-3 w-3 text-red-500" />
                    {point}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h5 className="text-sm font-medium mb-1">Solution Focus:</h5>
              <Badge className="text-xs">{persona.solutionFocus}</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

const LifecycleFlow: React.FC<{
  stages: ContentLifecycleStage[]
}> = ({ stages }) => {
  return (
    <div className="relative">
      <div className="absolute top-1/2 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-700 -translate-y-1/2" />
      
      <div className="relative flex justify-between">
        {stages.map((stage, index) => {
          const Icon = stage.icon
          
          return (
            <motion.div
              key={stage.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex flex-col items-center"
            >
              <div className={cn(
                "relative z-10 p-3 rounded-full bg-white dark:bg-gray-800 border-4",
                stage.status === "completed" && "border-green-500",
                stage.status === "active" && "border-blue-500 animate-pulse",
                stage.status === "pending" && "border-gray-300"
              )}>
                <Icon className={cn("h-6 w-6", stage.color)} />
              </div>
              
              <div className="mt-2 text-center">
                <h5 className="font-medium text-sm">{stage.name}</h5>
                {stage.duration && (
                  <p className="text-xs text-gray-500">{stage.duration}</p>
                )}
              </div>
              
              <div className="mt-2 space-y-1">
                {stage.subStages.map((subStage, subIndex) => (
                  <motion.div
                    key={subIndex}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 + subIndex * 0.05 }}
                    className="text-xs text-gray-600 flex items-center gap-1"
                  >
                    <ChevronRight className="h-3 w-3" />
                    {subStage}
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

const PatternSelector: React.FC<{
  patterns: OrganizationPattern[]
  selectedPattern: string
  onSelectPattern: (patternId: string) => void
}> = ({ patterns, selectedPattern, onSelectPattern }) => {
  return (
    <div className="space-y-3">
      {patterns.map(pattern => {
        const Icon = pattern.icon
        const isSelected = selectedPattern === pattern.id
        
        return (
          <motion.div
            key={pattern.id}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Card
              className={cn(
                "cursor-pointer transition-all",
                isSelected && "ring-2 ring-blue-500"
              )}
              onClick={() => onSelectPattern(pattern.id)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <Icon className="h-5 w-5 text-gray-600 mt-0.5" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h5 className="font-medium">{pattern.pattern}</h5>
                        {pattern.recommended && (
                          <Badge variant="secondary" className="text-xs">
                            Recommended
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{pattern.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {pattern.examples.map((example, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {example}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="text-2xl font-bold">{pattern.usage}%</div>
                    <div className="text-xs text-gray-500">usage</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )
      })}
    </div>
  )
}

const SortableContentItem: React.FC<{
  item: ContentItem
}> = ({ item }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft": return "text-gray-600"
      case "in_progress": return "text-blue-600"
      case "complete": return "text-green-600"
      case "delivered": return "text-purple-600"
      case "archived": return "text-gray-400"
      default: return "text-gray-600"
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video": return Video
      case "script": return FileText
      case "draft": return Edit
      case "final": return CheckCircle
      default: return FileText
    }
  }

  const TypeIcon = getTypeIcon(item.type)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "p-3 bg-white dark:bg-gray-800 rounded-lg border transition-all",
        isDragging && "opacity-50 shadow-lg"
      )}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <TypeIcon className="h-4 w-4 text-gray-600" />
          <div>
            <h5 className="font-medium text-sm">{item.title}</h5>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="outline" className={cn("text-xs", getStatusColor(item.status))}>
                {item.status.replace("_", " ")}
              </Badge>
              {item.occasion && (
                <Badge variant="secondary" className="text-xs">
                  {item.occasion}
                </Badge>
              )}
              {item.duration && (
                <span className="text-xs text-gray-500">{item.duration}</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          {item.quality === "portfolio" && (
            <Star className="h-4 w-4 text-yellow-500" />
          )}
          <MoreVertical className="h-4 w-4 text-gray-400" />
        </div>
      </div>
    </div>
  )
}

const ContentOrganizer: React.FC<{
  items: ContentItem[]
  pattern: string
}> = ({ items: initialItems, pattern }) => {
  const [items, setItems] = React.useState(initialItems)
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  )

  const handleDragEnd = (event: any) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setItems((items) => {
        const oldIndex = items.findIndex(item => item.id === active.id)
        const newIndex = items.findIndex(item => item.id === over.id)
        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  // Group items based on pattern
  const groupedItems = React.useMemo(() => {
    switch (pattern) {
      case "by_status":
        return {
          draft: items.filter(i => i.status === "draft"),
          in_progress: items.filter(i => i.status === "in_progress"),
          complete: items.filter(i => i.status === "complete"),
          delivered: items.filter(i => i.status === "delivered"),
          archived: items.filter(i => i.status === "archived")
        }
      case "by_customer":
        const byCustomer: Record<string, ContentItem[]> = {}
        items.forEach(item => {
          const customer = item.customer || "Unknown"
          if (!byCustomer[customer]) byCustomer[customer] = []
          byCustomer[customer].push(item)
        })
        return byCustomer
      case "by_occasion":
        const byOccasion: Record<string, ContentItem[]> = {}
        items.forEach(item => {
          const occasion = item.occasion || "Other"
          if (!byOccasion[occasion]) byOccasion[occasion] = []
          byOccasion[occasion].push(item)
        })
        return byOccasion
      default:
        return { all: items }
    }
  }, [items, pattern])

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="space-y-4">
        {Object.entries(groupedItems).map(([group, groupItems]) => (
          <div key={group}>
            <h5 className="font-medium text-sm mb-2 capitalize flex items-center gap-2">
              <FolderOpen className="h-4 w-4" />
              {group.replace("_", " ")}
              <Badge variant="secondary" className="text-xs">{groupItems.length}</Badge>
            </h5>
            <SortableContext
              items={groupItems.map(i => i.id)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {groupItems.map(item => (
                  <SortableContentItem key={item.id} item={item} />
                ))}
              </div>
            </SortableContext>
          </div>
        ))}
      </div>
    </DndContext>
  )
}

// Main component
export const ContentOrganizationPsychology: React.FC<ContentOrganizationPsychologyProps> = ({
  onPersonaSelect,
  onPatternSelect,
  onWorkflowCreate,
  onContentReorganize
}) => {
  const [personas] = React.useState<ContentPersona[]>(generateContentPersonas())
  const [lifecycleStages] = React.useState<ContentLifecycleStage[]>(generateLifecycleStages())
  const [patterns] = React.useState<OrganizationPattern[]>(generateOrganizationPatterns())
  const [contentItems] = React.useState<ContentItem[]>(generateContentItems())
  const [workflows] = React.useState<WorkflowTemplate[]>(generateWorkflowTemplates())
  
  const [selectedPersona, setSelectedPersona] = React.useState<string>("systematic")
  const [selectedPattern, setSelectedPattern] = React.useState<string>("by_status")
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("list")

  const handlePersonaSelect = (personaId: string) => {
    setSelectedPersona(personaId)
    onPersonaSelect?.(personaId)
  }

  const handlePatternSelect = (patternId: string) => {
    setSelectedPattern(patternId)
    onPatternSelect?.(patternId)
  }

  return (
    <div className="space-y-6">
      {/* Content Management Personas */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Creator Personas</h3>
          <Badge variant="outline">
            5 persona types
          </Badge>
        </div>
        
        <ScrollArea className="w-full">
          <div className="flex gap-4 pb-4">
            {personas.map(persona => (
              <div key={persona.id} className="min-w-[300px]">
                <PersonaCard
                  persona={persona}
                  isSelected={selectedPersona === persona.id}
                  onSelect={() => handlePersonaSelect(persona.id)}
                />
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>

      <Separator />

      {/* Content Lifecycle */}
      <Card>
        <CardHeader>
          <CardTitle>Content Lifecycle Journey</CardTitle>
          <CardDescription>
            From creation to archive - understanding the content flow
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LifecycleFlow stages={lifecycleStages} />
        </CardContent>
      </Card>

      <Separator />

      {/* Organization Patterns */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Organization Patterns</h3>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
            >
              {viewMode === "grid" ? <List className="h-4 w-4" /> : <Grid className="h-4 w-4" />}
            </Button>
          </div>
          
          <PatternSelector
            patterns={patterns}
            selectedPattern={selectedPattern}
            onSelectPattern={handlePatternSelect}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Content Preview</h3>
            <Badge variant="secondary">
              {contentItems.length} items
            </Badge>
          </div>
          
          <Card>
            <CardContent className="p-4">
              <ContentOrganizer
                items={contentItems}
                pattern={selectedPattern}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator />

      {/* Workflow Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Personalized Workflows</CardTitle>
          <CardDescription>
            Optimized workflows based on creator personas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            {workflows.map(workflow => (
              <Card key={workflow.id}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">{workflow.name}</CardTitle>
                  <CardDescription className="text-xs">
                    For: {workflow.persona} • {workflow.estimatedTime}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 mb-4">
                    {workflow.steps.map((step, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm">
                        <div className="w-6 h-6 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <span className="text-gray-600">{step}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Badge variant="outline" className="text-xs">
                      <Zap className="h-3 w-3 mr-1" />
                      {workflow.automations} automations
                    </Badge>
                    <Button
                      size="sm"
                      onClick={() => onWorkflowCreate?.(workflow)}
                    >
                      Use
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Psychology Insights */}
      <Alert>
        <Brain className="h-4 w-4" />
        <AlertDescription>
          <strong>Psychology Insight:</strong> {personas.find(p => p.id === selectedPersona)?.percentage}% of creators 
          match the "{personas.find(p => p.id === selectedPersona)?.name}" persona. 
          This system adapts to their mental model by focusing on {personas.find(p => p.id === selectedPersona)?.solutionFocus}.
        </AlertDescription>
      </Alert>
    </div>
  )
}