'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import {
  FileText,
  BookOpen,
  Video,
  Users,
  Calendar,
  Clock,
  Target,
  Lightbulb,
  CheckCircle,
  Plus,
  Edit,
  Trash2,
  Upload,
  Download,
  Eye,
  Share2,
  Star,
  TrendingUp,
  MessageSquare,
  Gift,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContentModule {
  id: string;
  title: string;
  description: string;
  duration: number; // minutes
  type: 'presentation' | 'workshop' | 'qa' | 'networking' | 'bonus';
  materials: string[];
  objectives: string[];
  completed: boolean;
  order: number;
}

interface SeriesContent {
  theme: string;
  objectives: string[];
  targetAudience: string;
  modules: ContentModule[];
  totalDuration: number;
  completionRate: number;
}

interface ContentPlanningProps {
  seriesTitle?: string;
  numberOfEvents?: number;
  onSaveContent?: (content: SeriesContent) => void;
  onExportPlan?: () => void;
}

export function ContentPlanning({
  seriesTitle = "Haitian Culture & Heritage Series",
  numberOfEvents = 4,
  onSaveContent,
  onExportPlan
}: ContentPlanningProps) {
  const [seriesTheme, setSeriesTheme] = React.useState("Exploring Haitian culture, history, and modern influence");
  const [targetAudience, setTargetAudience] = React.useState("Haitian diaspora and culture enthusiasts");
  const [learningObjectives, setLearningObjectives] = React.useState<string[]>([
    "Understand Haitian history and cultural foundations",
    "Explore modern Haitian art and music",
    "Connect with the global Haitian community",
    "Appreciate Haiti's influence on world culture"
  ]);
  const [modules, setModules] = React.useState<ContentModule[]>([
    {
      id: 'module-1',
      title: 'Historical Foundations',
      description: 'Explore the rich history of Haiti from pre-Columbian times to independence',
      duration: 60,
      type: 'presentation',
      materials: ['Historical timeline', 'Photo gallery', 'Key figures presentation'],
      objectives: ['Learn about Taíno heritage', 'Understand the revolution', 'Identify key historical figures'],
      completed: true,
      order: 1
    },
    {
      id: 'module-2',
      title: 'Art & Music Traditions',
      description: 'Interactive workshop on Haitian art forms and musical traditions',
      duration: 75,
      type: 'workshop',
      materials: ['Art samples', 'Music playlist', 'Interactive exercises'],
      objectives: ['Recognize art styles', 'Understand musical influences', 'Practice traditional forms'],
      completed: false,
      order: 2
    },
    {
      id: 'module-3',
      title: 'Modern Haiti & Diaspora',
      description: 'Contemporary Haitian culture and global diaspora communities',
      duration: 90,
      type: 'presentation',
      materials: ['Modern case studies', 'Diaspora mapping', 'Success stories'],
      objectives: ['Explore current culture', 'Understand diaspora impact', 'Connect global communities'],
      completed: false,
      order: 3
    },
    {
      id: 'module-4',
      title: 'Community Q&A',
      description: 'Open discussion and community networking session',
      duration: 45,
      type: 'qa',
      materials: ['Discussion topics', 'Community guidelines', 'Contact resources'],
      objectives: ['Foster community', 'Share experiences', 'Build networks'],
      completed: false,
      order: 4
    }
  ]);

  const [newObjective, setNewObjective] = React.useState('');
  const [selectedModule, setSelectedModule] = React.useState<string | null>(null);

  // Calculate content statistics
  const contentStats = React.useMemo(() => {
    const totalDuration = modules.reduce((sum, module) => sum + module.duration, 0);
    const completedModules = modules.filter(m => m.completed).length;
    const completionRate = (completedModules / modules.length) * 100;
    
    const typeDistribution = modules.reduce((acc, module) => {
      acc[module.type] = (acc[module.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalDuration,
      completionRate,
      typeDistribution,
      avgDuration: totalDuration / modules.length
    };
  }, [modules]);

  // Content templates
  const contentTemplates = [
    {
      type: 'presentation',
      title: 'Educational Presentation',
      description: 'Structured learning content with slides and materials',
      duration: 60,
      icon: FileText
    },
    {
      type: 'workshop',
      title: 'Interactive Workshop',
      description: 'Hands-on activities and practical exercises',
      duration: 90,
      icon: Users
    },
    {
      type: 'qa',
      title: 'Q&A Session',
      description: 'Community discussion and question answering',
      duration: 45,
      icon: MessageSquare
    },
    {
      type: 'networking',
      title: 'Networking Break',
      description: 'Structured networking and community building',
      duration: 30,
      icon: Share2
    },
    {
      type: 'bonus',
      title: 'Bonus Content',
      description: 'Additional value-add content for series participants',
      duration: 30,
      icon: Gift
    }
  ];

  const handleAddObjective = () => {
    if (newObjective && !learningObjectives.includes(newObjective)) {
      setLearningObjectives([...learningObjectives, newObjective]);
      setNewObjective('');
    }
  };

  const handleRemoveObjective = (index: number) => {
    setLearningObjectives(learningObjectives.filter((_, i) => i !== index));
  };

  const handleToggleModuleCompletion = (moduleId: string) => {
    setModules(modules.map(module => 
      module.id === moduleId 
        ? { ...module, completed: !module.completed }
        : module
    ));
  };

  const handleAddModule = (template: typeof contentTemplates[0]) => {
    const newModule: ContentModule = {
      id: `module-${Date.now()}`,
      title: template.title,
      description: template.description,
      duration: template.duration,
      type: template.type as ContentModule['type'],
      materials: ['To be added'],
      objectives: ['To be defined'],
      completed: false,
      order: modules.length + 1
    };
    setModules([...modules, newModule]);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'presentation': return FileText;
      case 'workshop': return Users;
      case 'qa': return MessageSquare;
      case 'networking': return Share2;
      case 'bonus': return Gift;
      default: return BookOpen;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'presentation': return 'text-blue-600 bg-blue-50';
      case 'workshop': return 'text-purple-600 bg-purple-50';
      case 'qa': return 'text-green-600 bg-green-50';
      case 'networking': return 'text-orange-600 bg-orange-50';
      case 'bonus': return 'text-pink-600 bg-pink-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Series Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Series Content Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Series Theme</Label>
            <Textarea
              value={seriesTheme}
              onChange={(e) => setSeriesTheme(e.target.value)}
              placeholder="Describe the overarching theme and focus of your series..."
              rows={2}
              className="mt-1"
            />
          </div>

          <div>
            <Label>Target Audience</Label>
            <Input
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="Who is this series designed for?"
              className="mt-1"
            />
          </div>

          <div>
            <Label>Learning Objectives</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
                placeholder="Add a learning objective..."
                onKeyDown={(e) => e.key === 'Enter' && handleAddObjective()}
              />
              <Button onClick={handleAddObjective}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {learningObjectives.map((objective, index) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  <Target className="h-3 w-3" />
                  {objective}
                  <button
                    onClick={() => handleRemoveObjective(index)}
                    className="ml-1 hover:text-red-600"
                  >
                    ×
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Statistics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Clock className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{contentStats.totalDuration}</p>
            <p className="text-xs text-gray-600">Total Minutes</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{contentStats.completionRate.toFixed(0)}%</p>
            <p className="text-xs text-gray-600">Completion</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <FileText className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{modules.length}</p>
            <p className="text-xs text-gray-600">Modules</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="h-6 w-6 text-orange-600 mx-auto mb-2" />
            <p className="text-2xl font-bold">{contentStats.avgDuration.toFixed(0)}</p>
            <p className="text-xs text-gray-600">Avg Duration</p>
          </CardContent>
        </Card>
      </div>

      {/* Content Modules */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Content Modules</CardTitle>
            <Badge>{modules.length} modules planned</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {modules.map((module, index) => {
              const Icon = getTypeIcon(module.type);
              return (
                <div
                  key={module.id}
                  className={cn(
                    "p-4 border rounded-lg transition-all",
                    selectedModule === module.id ? "border-purple-600 bg-purple-50" : "hover:bg-gray-50"
                  )}
                  onClick={() => setSelectedModule(selectedModule === module.id ? null : module.id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3 flex-1">
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center", getTypeColor(module.type))}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-medium">{module.title}</h3>
                          <Badge variant="secondary" className="text-xs">
                            {module.duration} min
                          </Badge>
                          <Badge variant={module.type === 'presentation' ? 'default' : 'secondary'} className="text-xs capitalize">
                            {module.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{module.description}</p>
                        <div className="flex items-center gap-4 text-xs text-gray-500">
                          <span>{module.materials.length} materials</span>
                          <span>{module.objectives.length} objectives</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleModuleCompletion(module.id);
                        }}
                      >
                        <CheckCircle className={cn(
                          "h-4 w-4",
                          module.completed ? "text-green-600" : "text-gray-400"
                        )} />
                      </Button>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {selectedModule === module.id && (
                    <div className="mt-4 pt-4 border-t space-y-3">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Materials</h4>
                        <div className="space-y-1">
                          {module.materials.map((material, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <Upload className="h-3 w-3 text-gray-400" />
                              <span>{material}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Learning Objectives</h4>
                        <div className="space-y-1">
                          {module.objectives.map((objective, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm">
                              <Target className="h-3 w-3 text-green-600" />
                              <span>{objective}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Add Content Module */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Add Content Module</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {contentTemplates.map((template) => {
              const Icon = template.icon;
              return (
                <div
                  key={template.type}
                  className="p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => handleAddModule(template)}
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="h-5 w-5 text-purple-600" />
                    <h3 className="font-medium text-sm">{template.title}</h3>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{template.description}</p>
                  <Badge variant="secondary" className="text-xs">
                    {template.duration} min
                  </Badge>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Content Progression */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Series Progression
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Content Development Progress</span>
                <span className="text-sm">{contentStats.completionRate.toFixed(0)}%</span>
              </div>
              <Progress value={contentStats.completionRate} className="h-2" />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {Object.entries(contentStats.typeDistribution).map(([type, count]) => {
                const Icon = getTypeIcon(type);
                return (
                  <div key={type} className="text-center p-3 bg-gray-50 rounded-lg">
                    <Icon className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                    <p className="text-lg font-bold">{count}</p>
                    <p className="text-xs text-gray-600 capitalize">{type}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Content Quality Checklist */}
      <Card className="border-green-200 bg-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5" />
            Content Quality Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm">Clear learning objectives defined</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm">Progressive content difficulty</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm">Interactive elements included</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm">Materials and resources prepared</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-green-600" />
              <span className="text-sm">Appropriate duration for each module</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onExportPlan}>
          <Download className="h-4 w-4 mr-2" />
          Export Plan
        </Button>
        <Button 
          className="bg-gradient-to-r from-purple-600 to-pink-600"
          onClick={() => onSaveContent?.({
            theme: seriesTheme,
            objectives: learningObjectives,
            targetAudience,
            modules,
            totalDuration: contentStats.totalDuration,
            completionRate: contentStats.completionRate
          })}
        >
          <FileText className="h-4 w-4 mr-2" />
          Save Content Plan
        </Button>
      </div>
    </div>
  );
}