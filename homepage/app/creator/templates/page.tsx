"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { 
  Plus, 
  Edit2, 
  Trash2, 
  Copy, 
  Star, 
  FileText, 
  Search,
  Sparkles,
  Hash,
  Calendar,
  Heart,
  GraduationCap,
  Cake,
  Gift,
  PartyPopper,
  Baby,
  Briefcase,
  Trophy,
  Music,
  ChevronRight,
  Save,
  X
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { cn } from "@/lib/utils"

// Template categories with icons and colors
const templateCategories = [
  { id: "all", name: "All Templates", icon: FileText, color: "text-gray-600" },
  { id: "birthday", name: "Birthday", icon: Cake, color: "text-pink-600" },
  { id: "anniversary", name: "Anniversary", icon: Heart, color: "text-red-600" },
  { id: "graduation", name: "Graduation", icon: GraduationCap, color: "text-blue-600" },
  { id: "baby", name: "New Baby", icon: Baby, color: "text-green-600" },
  { id: "wedding", name: "Wedding", icon: Gift, color: "text-purple-600" },
  { id: "promotion", name: "Job/Promotion", icon: Briefcase, color: "text-orange-600" },
  { id: "achievement", name: "Achievement", icon: Trophy, color: "text-yellow-600" },
  { id: "holiday", name: "Holiday", icon: PartyPopper, color: "text-indigo-600" },
  { id: "custom", name: "Custom", icon: Sparkles, color: "text-gray-600" }
]

// Mock templates data
const mockTemplates = [
  {
    id: "1",
    name: "Birthday Celebration",
    category: "birthday",
    content: "Hey {{name}}! 🎉 Happy birthday! I hope your special day is filled with joy, laughter, and celebration. {{custom_message}} Wishing you all the best for the year ahead! May all your dreams come true! 🎂",
    variables: ["name", "custom_message"],
    usageCount: 156,
    lastUsed: new Date("2024-01-20"),
    isFavorite: true,
    language: "en"
  },
  {
    id: "2",
    name: "Fèt Anivèsè",
    category: "birthday",
    content: "Bonjou {{name}}! 🎉 Bòn fèt! Mwen swete ou yon jou espesyal plen ak kè kontan ak lanmou. {{custom_message}} Mwen swete ou tout sa ki pi bon pou ane k ap vini an! 🎂",
    variables: ["name", "custom_message"],
    usageCount: 89,
    lastUsed: new Date("2024-01-18"),
    isFavorite: true,
    language: "ht"
  },
  {
    id: "3",
    name: "Anniversary Love",
    category: "anniversary",
    content: "Congratulations {{couple_names}} on your {{years}} anniversary! 💕 This is such an amazing milestone. {{custom_message}} Here's to many more years of love, happiness, and beautiful memories together!",
    variables: ["couple_names", "years", "custom_message"],
    usageCount: 67,
    lastUsed: new Date("2024-01-15"),
    isFavorite: false,
    language: "en"
  },
  {
    id: "4",
    name: "Graduation Success",
    category: "graduation",
    content: "Congratulations {{name}} on your graduation from {{school}}! 🎓 This is such an incredible achievement. {{custom_message}} Your hard work and dedication have paid off. The future is bright for you!",
    variables: ["name", "school", "custom_message"],
    usageCount: 45,
    lastUsed: new Date("2024-01-12"),
    isFavorite: true,
    language: "en"
  },
  {
    id: "5",
    name: "Welcome Baby",
    category: "baby",
    content: "Congratulations {{parents}} on the arrival of your beautiful {{baby_gender}}! 👶 {{baby_name}} is so lucky to have you as parents. {{custom_message}} Wishing your family all the love and happiness in the world!",
    variables: ["parents", "baby_gender", "baby_name", "custom_message"],
    usageCount: 34,
    lastUsed: new Date("2024-01-10"),
    isFavorite: false,
    language: "en"
  }
]

// Translations
const templatesTranslations: Record<string, Record<string, string>> = {
  message_templates: {
    en: "Message Templates",
    fr: "Modèles de messages",
    ht: "Modèl mesaj"
  },
  create_manage: {
    en: "Create and manage your video message templates",
    fr: "Créez et gérez vos modèles de messages vidéo",
    ht: "Kreye ak jere modèl mesaj videyo ou yo"
  },
  new_template: {
    en: "New Template",
    fr: "Nouveau modèle",
    ht: "Nouvo modèl"
  },
  search_templates: {
    en: "Search templates...",
    fr: "Rechercher des modèles...",
    ht: "Chèche modèl..."
  },
  template_name: {
    en: "Template Name",
    fr: "Nom du modèle",
    ht: "Non modèl"
  },
  category: {
    en: "Category",
    fr: "Catégorie",
    ht: "Kategori"
  },
  template_content: {
    en: "Template Content",
    fr: "Contenu du modèle",
    ht: "Kontni modèl"
  },
  variables: {
    en: "Variables",
    fr: "Variables",
    ht: "Varyab"
  },
  usage: {
    en: "Usage",
    fr: "Utilisation",
    ht: "Itilizasyon"
  },
  last_used: {
    en: "Last Used",
    fr: "Dernière utilisation",
    ht: "Dènye itilizasyon"
  },
  save_template: {
    en: "Save Template",
    fr: "Enregistrer le modèle",
    ht: "Anrejistre modèl"
  }
}

export default function CreatorTemplatesPage() {
  const { language } = useLanguage()
  const [templates, setTemplates] = useState(mockTemplates)
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<typeof mockTemplates[0] | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    category: "birthday",
    content: "",
    language: "en"
  })

  const t = (key: string) => {
    return templatesTranslations[key]?.[language] || templatesTranslations[key]?.en || key
  }

  const filteredTemplates = templates.filter(template => {
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.content.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const handleCreateTemplate = () => {
    setEditingTemplate(null)
    setFormData({
      name: "",
      category: "birthday",
      content: "",
      language: "en"
    })
    setIsDialogOpen(true)
  }

  const handleEditTemplate = (template: typeof mockTemplates[0]) => {
    setEditingTemplate(template)
    setFormData({
      name: template.name,
      category: template.category,
      content: template.content,
      language: template.language
    })
    setIsDialogOpen(true)
  }

  const handleSaveTemplate = () => {
    if (editingTemplate) {
      // Update existing template
      setTemplates(templates.map(t => 
        t.id === editingTemplate.id 
          ? { ...t, ...formData }
          : t
      ))
    } else {
      // Create new template
      const newTemplate = {
        id: Date.now().toString(),
        ...formData,
        variables: extractVariables(formData.content),
        usageCount: 0,
        lastUsed: new Date(),
        isFavorite: false
      }
      setTemplates([...templates, newTemplate])
    }
    setIsDialogOpen(false)
  }

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id))
  }

  const handleDuplicateTemplate = (template: typeof mockTemplates[0]) => {
    const newTemplate = {
      ...template,
      id: Date.now().toString(),
      name: `${template.name} (Copy)`,
      usageCount: 0,
      lastUsed: new Date()
    }
    setTemplates([...templates, newTemplate])
  }

  const handleToggleFavorite = (id: string) => {
    setTemplates(templates.map(t => 
      t.id === id ? { ...t, isFavorite: !t.isFavorite } : t
    ))
  }

  const extractVariables = (content: string) => {
    const matches = content.match(/\{\{(\w+)\}\}/g)
    if (!matches) return []
    return [...new Set(matches.map(m => m.replace(/[{}]/g, '')))]
  }

  const getCategoryIcon = (categoryId: string) => {
    const category = templateCategories.find(c => c.id === categoryId)
    return category ? category.icon : FileText
  }

  const getCategoryColor = (categoryId: string) => {
    const category = templateCategories.find(c => c.id === categoryId)
    return category ? category.color : "text-gray-600"
  }

  return (
    <div className="p-6 lg:p-8 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{t('message_templates')}</h1>
            <p className="text-gray-600 mt-1">{t('create_manage')}</p>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                onClick={handleCreateTemplate}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg"
              >
                <Plus className="h-4 w-4 mr-2" />
                {t('new_template')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingTemplate ? "Edit Template" : t('new_template')}
                </DialogTitle>
                <DialogDescription>
                  Create reusable message templates with variables like {"{{name}}"} that can be personalized
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">{t('template_name')}</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g., Birthday Greeting"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">{t('category')}</Label>
                    <Select 
                      value={formData.category} 
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {templateCategories.filter(c => c.id !== "all").map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            <div className="flex items-center gap-2">
                              <category.icon className={cn("h-4 w-4", category.color)} />
                              {category.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div>
                  <Label htmlFor="content">{t('template_content')}</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Use {{name}} for recipient name, {{custom_message}} for personalized content..."
                    rows={6}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Variables detected: {extractVariables(formData.content).map(v => `{{${v}}}`).join(", ") || "None"}
                  </p>
                </div>
                <div>
                  <Label htmlFor="language">Language</Label>
                  <Select 
                    value={formData.language} 
                    onValueChange={(value) => setFormData({ ...formData, language: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="fr">Français</SelectItem>
                      <SelectItem value="ht">Kreyòl</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleSaveTemplate}>
                  <Save className="h-4 w-4 mr-2" />
                  {t('save_template')}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={t('search_templates')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Category Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader className="p-4">
              <CardTitle className="text-lg">Categories</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="space-y-1">
                {templateCategories.map((category) => {
                  const Icon = category.icon
                  const count = category.id === "all" 
                    ? templates.length 
                    : templates.filter(t => t.category === category.id).length
                  
                  return (
                    <button
                      key={category.id}
                      onClick={() => setSelectedCategory(category.id)}
                      className={cn(
                        "w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition-colors",
                        selectedCategory === category.id 
                          ? "bg-purple-100 text-purple-700" 
                          : "hover:bg-gray-100"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className={cn("h-4 w-4", category.color)} />
                        <span className="text-sm font-medium">{category.name}</span>
                      </div>
                      <span className="text-xs text-gray-500">{count}</span>
                    </button>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="mt-4">
            <CardHeader className="p-4">
              <CardTitle className="text-lg">Statistics</CardTitle>
            </CardHeader>
            <CardContent className="p-4 pt-0 space-y-3">
              <div>
                <p className="text-sm text-gray-600">Total Templates</p>
                <p className="text-2xl font-bold">{templates.length}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Usage</p>
                <p className="text-2xl font-bold">
                  {templates.reduce((sum, t) => sum + t.usageCount, 0)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Favorites</p>
                <p className="text-2xl font-bold">
                  {templates.filter(t => t.isFavorite).length}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Templates Grid */}
        <div className="lg:col-span-3">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map((template) => {
              const Icon = getCategoryIcon(template.category)
              
              return (
                <Card 
                  key={template.id}
                  className="group hover:shadow-lg transition-all"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Icon className={cn("h-5 w-5", getCategoryColor(template.category))} />
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="secondary" className="text-xs">
                              {template.language.toUpperCase()}
                            </Badge>
                            {template.variables.length > 0 && (
                              <Badge variant="outline" className="text-xs">
                                <Hash className="h-3 w-3 mr-1" />
                                {template.variables.length} variables
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleToggleFavorite(template.id)}
                        className={cn(
                          "opacity-0 group-hover:opacity-100 transition-opacity",
                          template.isFavorite && "opacity-100"
                        )}
                      >
                        <Star className={cn(
                          "h-4 w-4",
                          template.isFavorite ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
                        )} />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 rounded-lg p-3 mb-3">
                      <p className="text-sm text-gray-700 line-clamp-3 font-mono">
                        {template.content}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>Used {template.usageCount} times</span>
                      <span>Last: {new Date(template.lastUsed).toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleEditTemplate(template)}
                      >
                        <Edit2 className="h-3 w-3 mr-1" />
                        Edit
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1"
                        onClick={() => handleDuplicateTemplate(template)}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Duplicate
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTemplate(template.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
          
          {filteredTemplates.length === 0 && (
            <Card className="p-12 text-center">
              <Sparkles className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No templates found
              </h3>
              <p className="text-gray-600 mb-4">
                {searchQuery 
                  ? "Try adjusting your search terms"
                  : "Create your first template to get started"}
              </p>
              <Button onClick={handleCreateTemplate}>
                <Plus className="h-4 w-4 mr-2" />
                Create Template
              </Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}