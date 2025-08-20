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
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import {
  FileText,
  Play,
  Pause,
  Square,
  Plus,
  Minus,
  Edit,
  Copy,
  Trash2,
  Save,
  Download,
  Upload,
  Share2,
  Star,
  Heart,
  Gift,
  Calendar,
  Clock,
  User,
  Users,
  Hash,
  Tag,
  Folder,
  FolderOpen,
  FolderPlus,
  Archive,
  Search,
  Filter,
  Grid,
  List,
  Layers,
  Layout,
  Settings,
  Sliders,
  Palette,
  Wand2,
  Magic,
  Sparkles,
  Zap,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  MoreVertical,
  MoreHorizontal,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Shield,
  AlertCircle,
  CheckCircle,
  Info,
  HelpCircle,
  MessageSquare,
  Video,
  Camera,
  Mic,
  Music,
  Volume2,
  Headphones,
  Film,
  Clapperboard,
  Monitor,
  Smartphone,
  Tablet,
  Tv,
  Radio,
  Wifi,
  Activity,
  BarChart3,
  TrendingUp,
  Award,
  Trophy,
  Target,
  Flag,
  Bookmark,
  BookOpen,
  FileCode,
  Code,
  Terminal,
  GitBranch,
  GitMerge,
  GitPullRequest,
  GitCommit,
  Database,
  Server,
  Cloud,
  CloudUpload,
  CloudDownload,
  Package,
  Box,
  Briefcase,
  Building,
  Home,
  MapPin,
  Navigation,
  Compass,
  Map,
  Globe,
  Sun,
  Moon,
  CloudRain,
  CloudSnow,
  Wind,
  Thermometer,
  Droplets,
  Waves,
  Mountain,
  Trees,
  Flower,
  Leaf,
  Bug,
  Bird,
  Fish,
  Rabbit,
  Cat,
  Dog,
  Pizza,
  Coffee,
  Wine,
  Beer,
  Cake,
  IceCream,
  Apple,
  Cherry,
  Lemon,
  Carrot,
  Salad,
  Sandwich,
  Soup,
  Utensils,
  ChefHat,
  Shirt,
  Footprints,
  Umbrella,
  Glasses,
  Watch,
  Crown,
  Gem,
  Ring,
  Necklace,
  Scissors
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

// Types
export interface Template {
  id: string
  name: string
  category: "intros" | "outros" | "occasions" | "responses" | "effects"
  description: string
  thumbnail?: string
  duration?: number
  customization: "low" | "medium" | "high"
  usage: number
  lastUsed?: Date
  favorite: boolean
  version: number
  tags: string[]
  elements: TemplateElement[]
  variables: TemplateVariable[]
  timeSaved: number // in seconds
  public: boolean
  author: string
  rating?: number
  downloads?: number
}

export interface TemplateElement {
  id: string
  type: "text" | "video" | "audio" | "image" | "effect" | "transition"
  name: string
  content: string
  position?: { x: number; y: number }
  duration?: number
  timing?: { start: number; end: number }
  properties?: Record<string, any>
  editable: boolean
}

export interface TemplateVariable {
  id: string
  name: string
  type: "text" | "number" | "date" | "select" | "color" | "boolean"
  placeholder: string
  defaultValue: any
  required: boolean
  options?: string[]
  validation?: string
}

export interface TemplateCategory {
  id: string
  name: string
  description: string
  icon: React.ElementType
  color: string
  templates: number
  avgTimeSaved: number
  usageFrequency: string
}

export interface TemplateStyle {
  id: string
  name: string
  background: string
  primaryColor: string
  secondaryColor: string
  fontFamily: string
  musicGenre?: string
  effects: string[]
  mood: string
}

export interface TemplateSystemDesignProps {
  onTemplateCreate?: (template: Template) => void
  onTemplateApply?: (templateId: string, variables?: Record<string, any>) => void
  onTemplateEdit?: (templateId: string) => void
  onTemplateDelete?: (templateId: string) => void
  onTemplateShare?: (templateId: string) => void
  enableVersionControl?: boolean
  enableSharing?: boolean
  enableAnalytics?: boolean
}

// Mock data generators
const generateTemplateCategories = (): TemplateCategory[] => {
  return [
    {
      id: "intros",
      name: "Intros",
      description: "Brand consistency opening",
      icon: Play,
      color: "text-blue-600",
      templates: 12,
      avgTimeSaved: 30,
      usageFrequency: "Every video"
    },
    {
      id: "outros",
      name: "Outros",
      description: "Call-to-action closing",
      icon: Square,
      color: "text-green-600",
      templates: 8,
      avgTimeSaved: 20,
      usageFrequency: "Every video"
    },
    {
      id: "occasions",
      name: "Occasions",
      description: "Common request templates",
      icon: Gift,
      color: "text-purple-600",
      templates: 25,
      avgTimeSaved: 150,
      usageFrequency: "Daily"
    },
    {
      id: "responses",
      name: "Responses",
      description: "FAQ answer templates",
      icon: MessageSquare,
      color: "text-orange-600",
      templates: 15,
      avgTimeSaved: 300,
      usageFrequency: "Weekly"
    },
    {
      id: "effects",
      name: "Effects",
      description: "Visual style presets",
      icon: Sparkles,
      color: "text-pink-600",
      templates: 20,
      avgTimeSaved: 60,
      usageFrequency: "Per preference"
    }
  ]
}

const generateTemplates = (): Template[] => {
  return [
    {
      id: "1",
      name: "Energetic Welcome",
      category: "intros",
      description: "High-energy greeting with animated text",
      duration: 5,
      customization: "low",
      usage: 156,
      lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 2),
      favorite: true,
      version: 2,
      tags: ["energetic", "greeting", "animated"],
      elements: [
        {
          id: "e1",
          type: "text",
          name: "Greeting",
          content: "Hey {{name}}!",
          position: { x: 50, y: 50 },
          duration: 3,
          editable: true
        },
        {
          id: "e2",
          type: "effect",
          name: "Zoom In",
          content: "zoom-bounce",
          properties: { intensity: 0.8 },
          editable: false
        }
      ],
      variables: [
        {
          id: "v1",
          name: "name",
          type: "text",
          placeholder: "Recipient's name",
          defaultValue: "friend",
          required: true
        }
      ],
      timeSaved: 30,
      public: true,
      author: "You",
      rating: 4.8,
      downloads: 342
    },
    {
      id: "2",
      name: "Birthday Celebration",
      category: "occasions",
      description: "Complete birthday message template",
      duration: 60,
      customization: "medium",
      usage: 89,
      lastUsed: new Date(Date.now() - 1000 * 60 * 60 * 24),
      favorite: true,
      version: 3,
      tags: ["birthday", "celebration", "personal"],
      elements: [
        {
          id: "e3",
          type: "text",
          name: "Opening",
          content: "Happy Birthday {{name}}!",
          position: { x: 50, y: 30 },
          timing: { start: 0, end: 5 },
          editable: true
        },
        {
          id: "e4",
          type: "text",
          name: "Message",
          content: "Wishing you {{wish}} on your special day!",
          position: { x: 50, y: 50 },
          timing: { start: 5, end: 15 },
          editable: true
        },
        {
          id: "e5",
          type: "audio",
          name: "Background Music",
          content: "birthday-jazz.mp3",
          properties: { volume: 0.3 },
          editable: false
        }
      ],
      variables: [
        {
          id: "v2",
          name: "name",
          type: "text",
          placeholder: "Birthday person's name",
          defaultValue: "",
          required: true
        },
        {
          id: "v3",
          name: "wish",
          type: "text",
          placeholder: "Your wish",
          defaultValue: "all the best",
          required: false
        }
      ],
      timeSaved: 180,
      public: true,
      author: "You",
      rating: 4.9,
      downloads: 567
    },
    {
      id: "3",
      name: "Professional Sign-off",
      category: "outros",
      description: "Business-appropriate closing",
      duration: 8,
      customization: "low",
      usage: 234,
      favorite: false,
      version: 1,
      tags: ["professional", "business", "formal"],
      elements: [
        {
          id: "e6",
          type: "text",
          name: "Sign-off",
          content: "Thank you for your time, {{name}}",
          position: { x: 50, y: 40 },
          editable: true
        },
        {
          id: "e7",
          type: "text",
          name: "Contact",
          content: "{{contact}}",
          position: { x: 50, y: 60 },
          editable: true
        }
      ],
      variables: [
        {
          id: "v4",
          name: "name",
          type: "text",
          placeholder: "Recipient name",
          defaultValue: "",
          required: false
        },
        {
          id: "v5",
          name: "contact",
          type: "text",
          placeholder: "Your contact info",
          defaultValue: "Let's connect!",
          required: false
        }
      ],
      timeSaved: 20,
      public: false,
      author: "You"
    },
    {
      id: "4",
      name: "Thank You Response",
      category: "responses",
      description: "Gratitude message template",
      duration: 30,
      customization: "high",
      usage: 45,
      favorite: false,
      version: 1,
      tags: ["thank you", "gratitude", "response"],
      elements: [],
      variables: [],
      timeSaved: 120,
      public: true,
      author: "Community",
      rating: 4.5,
      downloads: 123
    },
    {
      id: "5",
      name: "Vintage Film Effect",
      category: "effects",
      description: "Retro film grain and color grading",
      customization: "low",
      usage: 67,
      favorite: false,
      version: 2,
      tags: ["vintage", "film", "retro", "effect"],
      elements: [],
      variables: [],
      timeSaved: 60,
      public: true,
      author: "Effects Library",
      rating: 4.7,
      downloads: 892
    }
  ]
}

const generateTemplateStyles = (): TemplateStyle[] => {
  return [
    {
      id: "modern",
      name: "Modern Minimal",
      background: "gradient",
      primaryColor: "#3B82F6",
      secondaryColor: "#10B981",
      fontFamily: "Inter",
      musicGenre: "Electronic",
      effects: ["fade", "slide"],
      mood: "Professional"
    },
    {
      id: "vibrant",
      name: "Vibrant Energy",
      background: "animated",
      primaryColor: "#EC4899",
      secondaryColor: "#F97316",
      fontFamily: "Poppins",
      musicGenre: "Pop",
      effects: ["bounce", "zoom", "sparkle"],
      mood: "Energetic"
    },
    {
      id: "elegant",
      name: "Elegant Classic",
      background: "solid",
      primaryColor: "#1F2937",
      secondaryColor: "#D4AF37",
      fontFamily: "Playfair Display",
      musicGenre: "Classical",
      effects: ["dissolve", "fade"],
      mood: "Sophisticated"
    },
    {
      id: "playful",
      name: "Playful Fun",
      background: "pattern",
      primaryColor: "#10B981",
      secondaryColor: "#FBBF24",
      fontFamily: "Comic Sans MS",
      musicGenre: "Kids",
      effects: ["bounce", "spin", "confetti"],
      mood: "Cheerful"
    }
  ]
}

// Sub-components
const TemplateCategoryCard: React.FC<{
  category: TemplateCategory
  isSelected: boolean
  onSelect: () => void
}> = ({ category, isSelected, onSelect }) => {
  const Icon = category.icon

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card 
        className={cn(
          "cursor-pointer transition-all",
          isSelected && "ring-2 ring-purple-500"
        )}
        onClick={onSelect}
      >
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className={cn("p-2 rounded-lg bg-gray-100 dark:bg-gray-800", category.color)}>
              <Icon className="h-5 w-5" />
            </div>
            <Badge variant="secondary">
              {category.templates} templates
            </Badge>
          </div>
          
          <h4 className="font-semibold mb-1">{category.name}</h4>
          <p className="text-sm text-gray-600 mb-3">{category.description}</p>
          
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Usage:</span>
              <span className="font-medium">{category.usageFrequency}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-500">Time saved:</span>
              <span className="font-medium text-green-600">~{category.avgTimeSaved}s</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

const TemplateCard: React.FC<{
  template: Template
  onApply?: () => void
  onEdit?: () => void
  onDelete?: () => void
  onToggleFavorite?: () => void
  viewMode?: "grid" | "list"
}> = ({ template, onApply, onEdit, onDelete, onToggleFavorite, viewMode = "grid" }) => {
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "intros": return Play
      case "outros": return Square
      case "occasions": return Gift
      case "responses": return MessageSquare
      case "effects": return Sparkles
      default: return FileText
    }
  }

  const CategoryIcon = getCategoryIcon(template.category)

  if (viewMode === "list") {
    return (
      <Card className="hover:shadow-md transition-all">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
                <CategoryIcon className="h-5 w-5 text-gray-600" />
              </div>
              
              <div>
                <div className="flex items-center gap-2">
                  <h5 className="font-medium">{template.name}</h5>
                  {template.favorite && (
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  )}
                  {template.public && (
                    <Badge variant="outline" className="text-xs">Public</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600">{template.description}</p>
                <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                  <span>Used {template.usage} times</span>
                  {template.duration && <span>{template.duration}s</span>}
                  <span className="text-green-600">Saves ~{template.timeSaved}s</span>
                  {template.rating && (
                    <span className="flex items-center gap-1">
                      <Star className="h-3 w-3" />
                      {template.rating}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge 
                variant="secondary"
                className={cn(
                  "text-xs",
                  template.customization === "low" && "bg-gray-100",
                  template.customization === "medium" && "bg-blue-100",
                  template.customization === "high" && "bg-purple-100"
                )}
              >
                {template.customization} custom
              </Badge>
              
              <Button size="sm" variant="outline" onClick={onEdit}>
                <Edit className="h-3 w-3" />
              </Button>
              
              <Button size="sm" onClick={onApply}>
                Apply
              </Button>
              
              <Button size="sm" variant="ghost" onClick={onToggleFavorite}>
                <Star className={cn(
                  "h-4 w-4",
                  template.favorite && "fill-yellow-500 text-yellow-500"
                )} />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Card className="hover:shadow-md transition-all">
        <div className="aspect-video bg-gray-100 dark:bg-gray-800 relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <CategoryIcon className="h-12 w-12 text-gray-400" />
          </div>
          {template.favorite && (
            <div className="absolute top-2 right-2">
              <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
            </div>
          )}
          {template.public && (
            <Badge className="absolute top-2 left-2" variant="secondary">
              Public
            </Badge>
          )}
        </div>
        
        <CardContent className="p-4">
          <h5 className="font-medium mb-1">{template.name}</h5>
          <p className="text-sm text-gray-600 mb-3">{template.description}</p>
          
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2 text-xs">
              {template.duration && (
                <Badge variant="outline">
                  <Clock className="h-3 w-3 mr-1" />
                  {template.duration}s
                </Badge>
              )}
              <Badge 
                variant="outline"
                className={cn(
                  template.customization === "low" && "border-gray-300",
                  template.customization === "medium" && "border-blue-300",
                  template.customization === "high" && "border-purple-300"
                )}
              >
                {template.customization}
              </Badge>
            </div>
            
            {template.rating && (
              <div className="flex items-center gap-1 text-xs">
                <Star className="h-3 w-3 text-yellow-500" />
                <span>{template.rating}</span>
              </div>
            )}
          </div>
          
          <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
            <span>Used {template.usage} times</span>
            <span className="text-green-600">Saves ~{template.timeSaved}s</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Button size="sm" className="flex-1" onClick={onApply}>
              Apply
            </Button>
            <Button size="sm" variant="outline" onClick={onEdit}>
              <Edit className="h-3 w-3" />
            </Button>
            <Button size="sm" variant="ghost" onClick={onToggleFavorite}>
              <Star className={cn(
                "h-4 w-4",
                template.favorite && "fill-yellow-500 text-yellow-500"
              )} />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

const TemplateBuilder: React.FC<{
  onSave?: (template: Partial<Template>) => void
  onCancel?: () => void
}> = ({ onSave, onCancel }) => {
  const [templateName, setTemplateName] = React.useState("")
  const [templateCategory, setTemplateCategory] = React.useState("occasions")
  const [templateDescription, setTemplateDescription] = React.useState("")
  const [elements, setElements] = React.useState<TemplateElement[]>([])
  const [variables, setVariables] = React.useState<TemplateVariable[]>([])
  const [activeTab, setActiveTab] = React.useState("structure")

  const handleAddElement = (type: TemplateElement["type"]) => {
    const newElement: TemplateElement = {
      id: `element-${Date.now()}`,
      type,
      name: `New ${type}`,
      content: "",
      editable: true
    }
    setElements([...elements, newElement])
  }

  const handleAddVariable = () => {
    const newVariable: TemplateVariable = {
      id: `var-${Date.now()}`,
      name: "",
      type: "text",
      placeholder: "",
      defaultValue: "",
      required: false
    }
    setVariables([...variables, newVariable])
  }

  const handleSave = () => {
    const template: Partial<Template> = {
      name: templateName,
      category: templateCategory as Template["category"],
      description: templateDescription,
      elements,
      variables,
      customization: variables.length === 0 ? "low" : variables.length < 3 ? "medium" : "high",
      version: 1,
      public: false,
      author: "You",
      tags: [],
      usage: 0,
      favorite: false,
      timeSaved: 0
    }
    onSave?.(template)
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Template Name</Label>
          <Input
            id="name"
            value={templateName}
            onChange={(e) => setTemplateName(e.target.value)}
            placeholder="Enter template name"
          />
        </div>
        
        <div>
          <Label htmlFor="category">Category</Label>
          <Select value={templateCategory} onValueChange={setTemplateCategory}>
            <SelectTrigger id="category">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="intros">Intros</SelectItem>
              <SelectItem value="outros">Outros</SelectItem>
              <SelectItem value="occasions">Occasions</SelectItem>
              <SelectItem value="responses">Responses</SelectItem>
              <SelectItem value="effects">Effects</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={templateDescription}
          onChange={(e) => setTemplateDescription(e.target.value)}
          placeholder="Describe your template"
          rows={3}
        />
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="structure">Structure</TabsTrigger>
          <TabsTrigger value="variables">Variables</TabsTrigger>
          <TabsTrigger value="style">Style</TabsTrigger>
        </TabsList>

        <TabsContent value="structure" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Template Elements</CardTitle>
              <CardDescription>
                Add and configure template building blocks
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-4">
                <Button size="sm" variant="outline" onClick={() => handleAddElement("text")}>
                  <FileText className="h-4 w-4 mr-1" />
                  Text
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleAddElement("video")}>
                  <Video className="h-4 w-4 mr-1" />
                  Video
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleAddElement("audio")}>
                  <Music className="h-4 w-4 mr-1" />
                  Audio
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleAddElement("image")}>
                  <Camera className="h-4 w-4 mr-1" />
                  Image
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleAddElement("effect")}>
                  <Sparkles className="h-4 w-4 mr-1" />
                  Effect
                </Button>
              </div>

              <div className="space-y-2">
                {elements.map((element, index) => (
                  <div key={element.id} className="flex items-center gap-2 p-2 bg-gray-50 dark:bg-gray-800 rounded">
                    <span className="text-sm font-medium">{element.name}</span>
                    <Badge variant="outline" className="text-xs">{element.type}</Badge>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setElements(elements.filter(e => e.id !== element.id))}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                
                {elements.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No elements added yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="variables" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Template Variables</CardTitle>
              <CardDescription>
                Define customizable placeholders
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                size="sm"
                onClick={handleAddVariable}
                className="mb-4"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Variable
              </Button>

              <div className="space-y-3">
                {variables.map((variable, index) => (
                  <div key={variable.id} className="p-3 border rounded-lg">
                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        placeholder="Variable name"
                        value={variable.name}
                        onChange={(e) => {
                          const updated = [...variables]
                          updated[index].name = e.target.value
                          setVariables(updated)
                        }}
                      />
                      <Select
                        value={variable.type}
                        onValueChange={(value) => {
                          const updated = [...variables]
                          updated[index].type = value as TemplateVariable["type"]
                          setVariables(updated)
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="text">Text</SelectItem>
                          <SelectItem value="number">Number</SelectItem>
                          <SelectItem value="date">Date</SelectItem>
                          <SelectItem value="select">Select</SelectItem>
                          <SelectItem value="color">Color</SelectItem>
                          <SelectItem value="boolean">Boolean</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={variable.required}
                          onCheckedChange={(checked) => {
                            const updated = [...variables]
                            updated[index].required = checked
                            setVariables(updated)
                          }}
                        />
                        <Label className="text-sm">Required</Label>
                      </div>
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setVariables(variables.filter(v => v.id !== variable.id))}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
                
                {variables.length === 0 && (
                  <p className="text-sm text-gray-500 text-center py-4">
                    No variables defined yet
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="style" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Style Presets</CardTitle>
              <CardDescription>
                Choose a visual style for your template
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RadioGroup defaultValue="modern">
                {generateTemplateStyles().map(style => (
                  <div key={style.id} className="flex items-start space-x-2 mb-3">
                    <RadioGroupItem value={style.id} id={style.id} />
                    <Label htmlFor={style.id} className="flex-1 cursor-pointer">
                      <div>
                        <div className="font-medium">{style.name}</div>
                        <div className="text-sm text-gray-600">
                          {style.mood} • {style.musicGenre} music
                        </div>
                        <div className="flex items-center gap-2 mt-1">
                          <div 
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: style.primaryColor }}
                          />
                          <div 
                            className="w-4 h-4 rounded"
                            style={{ backgroundColor: style.secondaryColor }}
                          />
                          <span className="text-xs text-gray-500">{style.fontFamily}</span>
                        </div>
                      </div>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex items-center justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!templateName || !templateDescription}>
          <Save className="h-4 w-4 mr-1" />
          Save Template
        </Button>
      </div>
    </div>
  )
}

const TemplatePreview: React.FC<{
  template: Template
  variables?: Record<string, any>
}> = ({ template, variables = {} }) => {
  const replaceVariables = (text: string) => {
    return text.replace(/\{\{(\w+)\}\}/g, (match, varName) => {
      return variables[varName] || match
    })
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preview</CardTitle>
        <CardDescription>
          See how your template will look with current variables
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="aspect-video bg-gray-900 rounded-lg relative overflow-hidden">
          {/* Preview canvas */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center text-white p-8">
              {template.elements.map(element => {
                if (element.type === "text") {
                  return (
                    <div
                      key={element.id}
                      className="mb-4"
                      style={{
                        position: element.position ? "absolute" : "relative",
                        left: element.position?.x ? `${element.position.x}%` : "auto",
                        top: element.position?.y ? `${element.position.y}%` : "auto"
                      }}
                    >
                      <h3 className="text-2xl font-bold">
                        {replaceVariables(element.content)}
                      </h3>
                    </div>
                  )
                }
                return null
              })}
              
              {template.elements.length === 0 && (
                <div className="text-gray-400">
                  <Video className="h-16 w-16 mx-auto mb-4" />
                  <p>Template preview will appear here</p>
                </div>
              )}
            </div>
          </div>

          {/* Timeline */}
          <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 p-2">
            <div className="flex items-center gap-2">
              <Button size="sm" variant="ghost" className="text-white">
                <Play className="h-4 w-4" />
              </Button>
              <div className="flex-1">
                <Progress value={33} className="h-1" />
              </div>
              <span className="text-xs text-white">
                0:{template.duration?.toString().padStart(2, "0") || "00"}
              </span>
            </div>
          </div>
        </div>

        {/* Variable inputs */}
        {template.variables.length > 0 && (
          <div className="mt-4 space-y-3">
            <h4 className="font-medium text-sm">Variables</h4>
            {template.variables.map(variable => (
              <div key={variable.id}>
                <Label htmlFor={variable.id} className="text-sm">
                  {variable.name}
                  {variable.required && <span className="text-red-500 ml-1">*</span>}
                </Label>
                <Input
                  id={variable.id}
                  placeholder={variable.placeholder}
                  defaultValue={variable.defaultValue}
                  onChange={(e) => {
                    variables[variable.name] = e.target.value
                  }}
                />
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Main component
export const TemplateSystemDesign: React.FC<TemplateSystemDesignProps> = ({
  onTemplateCreate,
  onTemplateApply,
  onTemplateEdit,
  onTemplateDelete,
  onTemplateShare,
  enableVersionControl = true,
  enableSharing = true,
  enableAnalytics = true
}) => {
  const [categories] = React.useState<TemplateCategory[]>(generateTemplateCategories())
  const [templates] = React.useState<Template[]>(generateTemplates())
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [viewMode, setViewMode] = React.useState<"grid" | "list">("grid")
  const [showBuilder, setShowBuilder] = React.useState(false)
  const [selectedTemplate, setSelectedTemplate] = React.useState<Template | null>(null)
  const [filterFavorites, setFilterFavorites] = React.useState(false)
  const [sortBy, setSortBy] = React.useState<"usage" | "recent" | "name" | "timeSaved">("usage")

  // Filter and sort templates
  const filteredTemplates = React.useMemo(() => {
    let filtered = templates

    // Category filter
    if (selectedCategory !== "all") {
      filtered = filtered.filter(t => t.category === selectedCategory)
    }

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(t => 
        t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    }

    // Favorites filter
    if (filterFavorites) {
      filtered = filtered.filter(t => t.favorite)
    }

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "usage":
          return b.usage - a.usage
        case "recent":
          return (b.lastUsed?.getTime() || 0) - (a.lastUsed?.getTime() || 0)
        case "name":
          return a.name.localeCompare(b.name)
        case "timeSaved":
          return b.timeSaved - a.timeSaved
        default:
          return 0
      }
    })

    return filtered
  }, [templates, selectedCategory, searchQuery, filterFavorites, sortBy])

  const handleTemplateApply = (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (template) {
      setSelectedTemplate(template)
      onTemplateApply?.(templateId)
    }
  }

  const handleTemplateCreate = (template: Partial<Template>) => {
    console.log("Creating template:", template)
    setShowBuilder(false)
    onTemplateCreate?.(template as Template)
  }

  // Calculate total time saved
  const totalTimeSaved = templates.reduce((sum, t) => sum + (t.usage * t.timeSaved), 0)
  const formatTimeSaved = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    return `${hours}h ${minutes}m`
  }

  return (
    <div className="space-y-6">
      {/* Header & Stats */}
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold">Template Library</h3>
          <p className="text-sm text-gray-600">
            Reusable templates for consistency and efficiency
          </p>
        </div>
        
        <div className="flex items-center gap-4">
          {enableAnalytics && (
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">
                {formatTimeSaved(totalTimeSaved)}
              </p>
              <p className="text-xs text-gray-500">Total time saved</p>
            </div>
          )}
          
          <Button onClick={() => setShowBuilder(true)}>
            <Plus className="h-4 w-4 mr-1" />
            Create Template
          </Button>
        </div>
      </div>

      {/* Search & Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search templates..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
              <SelectTrigger className="w-[150px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="usage">Most Used</SelectItem>
                <SelectItem value="recent">Recent</SelectItem>
                <SelectItem value="name">Name</SelectItem>
                <SelectItem value="timeSaved">Time Saved</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              variant={filterFavorites ? "default" : "outline"}
              size="sm"
              onClick={() => setFilterFavorites(!filterFavorites)}
            >
              <Star className={cn(
                "h-4 w-4 mr-1",
                filterFavorites && "fill-current"
              )} />
              Favorites
            </Button>
            
            <div className="flex items-center gap-1 border rounded-lg p-1">
              <Button
                size="sm"
                variant={viewMode === "grid" ? "default" : "ghost"}
                onClick={() => setViewMode("grid")}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                size="sm"
                variant={viewMode === "list" ? "default" : "ghost"}
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      {showBuilder ? (
        <Card>
          <CardHeader>
            <CardTitle>Template Builder</CardTitle>
            <CardDescription>
              Create a new reusable template
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TemplateBuilder
              onSave={handleTemplateCreate}
              onCancel={() => setShowBuilder(false)}
            />
          </CardContent>
        </Card>
      ) : (
        <div className="grid lg:grid-cols-4 gap-6">
          {/* Categories Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={selectedCategory === "all" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory("all")}
                >
                  <Layers className="h-4 w-4 mr-2" />
                  All Templates
                  <Badge variant="secondary" className="ml-auto">
                    {templates.length}
                  </Badge>
                </Button>
                
                {categories.map(category => {
                  const Icon = category.icon
                  const count = templates.filter(t => t.category === category.id).length
                  
                  return (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setSelectedCategory(category.id)}
                    >
                      <Icon className="h-4 w-4 mr-2" />
                      {category.name}
                      <Badge variant="secondary" className="ml-auto">
                        {count}
                      </Badge>
                    </Button>
                  )
                })}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            {enableAnalytics && (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-base">Usage Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Total Uses</span>
                      <span className="font-medium">
                        {templates.reduce((sum, t) => sum + t.usage, 0)}
                      </span>
                    </div>
                    <Progress value={75} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Avg Time Saved</span>
                      <span className="font-medium text-green-600">
                        {Math.round(totalTimeSaved / templates.reduce((sum, t) => sum + t.usage, 0))}s
                      </span>
                    </div>
                    <Progress value={60} className="h-2" />
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm text-gray-600">Favorites</span>
                      <span className="font-medium">
                        {templates.filter(t => t.favorite).length}
                      </span>
                    </div>
                    <Progress 
                      value={(templates.filter(t => t.favorite).length / templates.length) * 100} 
                      className="h-2" 
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Templates Grid/List */}
          <div className="lg:col-span-3">
            {filteredTemplates.length > 0 ? (
              <div className={cn(
                viewMode === "grid" 
                  ? "grid md:grid-cols-2 xl:grid-cols-3 gap-4"
                  : "space-y-3"
              )}>
                {filteredTemplates.map(template => (
                  <TemplateCard
                    key={template.id}
                    template={template}
                    viewMode={viewMode}
                    onApply={() => handleTemplateApply(template.id)}
                    onEdit={() => onTemplateEdit?.(template.id)}
                    onDelete={() => onTemplateDelete?.(template.id)}
                    onToggleFavorite={() => {
                      // Toggle favorite logic
                      console.log("Toggle favorite:", template.id)
                    }}
                  />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 mx-auto text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium mb-2">No templates found</h3>
                  <p className="text-gray-600 mb-4">
                    {searchQuery 
                      ? "Try adjusting your search terms" 
                      : "Create your first template to get started"}
                  </p>
                  <Button onClick={() => setShowBuilder(true)}>
                    <Plus className="h-4 w-4 mr-1" />
                    Create Template
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Template Preview Modal */}
      {selectedTemplate && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Apply Template: {selectedTemplate.name}</CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSelectedTemplate(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <TemplatePreview template={selectedTemplate} />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

// Utility functions
function formatDuration(seconds: number): string {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

// Component exports
export default TemplateSystemDesign