'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Search,
  Tag,
  Hash,
  TrendingUp,
  Star,
  Award,
  AlertTriangle,
  CheckCircle,
  Info,
  Target,
  Sparkles,
  Filter,
  Globe,
  Eye,
  Plus,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SEOScore {
  title: number;
  description: number;
  keywords: number;
  category: number;
  tags: number;
  overall: number;
}

interface ListingOptimizationProps {
  eventId: string;
  currentTitle?: string;
  currentDescription?: string;
  currentCategory?: string;
  currentTags?: string[];
  onUpdateTitle?: (title: string) => void;
  onUpdateDescription?: (description: string) => void;
  onUpdateCategory?: (category: string) => void;
  onUpdateTags?: (tags: string[]) => void;
  onUpdateKeywords?: (keywords: string[]) => void;
  onRequestFeature?: () => void;
}

export function ListingOptimization({
  eventId,
  currentTitle = '',
  currentDescription = '',
  currentCategory = '',
  currentTags = [],
  onUpdateTitle,
  onUpdateDescription,
  onUpdateCategory,
  onUpdateTags,
  onUpdateKeywords,
  onRequestFeature
}: ListingOptimizationProps) {
  const [title, setTitle] = React.useState(currentTitle);
  const [description, setDescription] = React.useState(currentDescription);
  const [category, setCategory] = React.useState(currentCategory);
  const [tags, setTags] = React.useState<string[]>(currentTags);
  const [keywords, setKeywords] = React.useState<string[]>([]);
  const [newTag, setNewTag] = React.useState('');
  const [newKeyword, setNewKeyword] = React.useState('');
  const [seoScore, setSeoScore] = React.useState<SEOScore>({
    title: 0,
    description: 0,
    keywords: 0,
    category: 0,
    tags: 0,
    overall: 0
  });

  // Categories
  const categories = [
    'Music & Concert',
    'Comedy Show',
    'Workshop & Class',
    'Conference & Talk',
    'Festival & Fair',
    'Sports & Fitness',
    'Arts & Culture',
    'Business & Networking',
    'Food & Drink',
    'Community & Social'
  ];

  // Trending tags
  const trendingTags = [
    'haitian-culture',
    'live-music',
    'kompa',
    'exclusive-event',
    'vip-experience',
    'meet-greet',
    'limited-seats',
    'early-bird',
    'networking',
    'masterclass'
  ];

  // Calculate SEO score
  React.useEffect(() => {
    const calculateScore = () => {
      let titleScore = 0;
      let descScore = 0;
      let keywordScore = 0;
      let categoryScore = 0;
      let tagScore = 0;

      // Title scoring
      if (title.length >= 10 && title.length <= 60) titleScore += 40;
      if (title.length >= 30 && title.length <= 50) titleScore += 30;
      if (/[A-Z]/.test(title[0])) titleScore += 15;
      if (keywords.some(k => title.toLowerCase().includes(k.toLowerCase()))) titleScore += 15;

      // Description scoring
      if (description.length >= 100 && description.length <= 300) descScore += 40;
      if (description.length >= 150 && description.length <= 250) descScore += 30;
      if (keywords.some(k => description.toLowerCase().includes(k.toLowerCase()))) descScore += 30;

      // Keywords scoring
      if (keywords.length >= 3 && keywords.length <= 10) keywordScore += 50;
      if (keywords.length >= 5 && keywords.length <= 8) keywordScore += 50;

      // Category scoring
      if (category) categoryScore = 100;

      // Tags scoring
      if (tags.length >= 3 && tags.length <= 10) tagScore += 50;
      if (tags.some(t => trendingTags.includes(t))) tagScore += 50;

      const overall = (titleScore + descScore + keywordScore + categoryScore + tagScore) / 5;

      setSeoScore({
        title: titleScore,
        description: descScore,
        keywords: keywordScore,
        category: categoryScore,
        tags: tagScore,
        overall
      });
    };

    calculateScore();
  }, [title, description, keywords, category, tags]);

  const handleAddTag = () => {
    if (newTag && !tags.includes(newTag)) {
      const updatedTags = [...tags, newTag];
      setTags(updatedTags);
      onUpdateTags?.(updatedTags);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    const updatedTags = tags.filter(t => t !== tag);
    setTags(updatedTags);
    onUpdateTags?.(updatedTags);
  };

  const handleAddKeyword = () => {
    if (newKeyword && !keywords.includes(newKeyword)) {
      const updatedKeywords = [...keywords, newKeyword];
      setKeywords(updatedKeywords);
      onUpdateKeywords?.(updatedKeywords);
      setNewKeyword('');
    }
  };

  const handleRemoveKeyword = (keyword: string) => {
    const updatedKeywords = keywords.filter(k => k !== keyword);
    setKeywords(updatedKeywords);
    onUpdateKeywords?.(updatedKeywords);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Needs Work';
  };

  return (
    <div className="space-y-6">
      {/* SEO Score Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              SEO & Discoverability Score
            </CardTitle>
            <div className="text-right">
              <div className={cn("text-2xl font-bold", getScoreColor(seoScore.overall))}>
                {Math.round(seoScore.overall)}%
              </div>
              <p className="text-sm text-gray-600">{getScoreLabel(seoScore.overall)}</p>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Title Optimization</span>
                <span className={cn("text-sm font-medium", getScoreColor(seoScore.title))}>
                  {Math.round(seoScore.title)}%
                </span>
              </div>
              <Progress value={seoScore.title} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Description Quality</span>
                <span className={cn("text-sm font-medium", getScoreColor(seoScore.description))}>
                  {Math.round(seoScore.description)}%
                </span>
              </div>
              <Progress value={seoScore.description} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Keywords Coverage</span>
                <span className={cn("text-sm font-medium", getScoreColor(seoScore.keywords))}>
                  {Math.round(seoScore.keywords)}%
                </span>
              </div>
              <Progress value={seoScore.keywords} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Category Selection</span>
                <span className={cn("text-sm font-medium", getScoreColor(seoScore.category))}>
                  {Math.round(seoScore.category)}%
                </span>
              </div>
              <Progress value={seoScore.category} className="h-2" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm">Tags & Metadata</span>
                <span className={cn("text-sm font-medium", getScoreColor(seoScore.tags))}>
                  {Math.round(seoScore.tags)}%
                </span>
              </div>
              <Progress value={seoScore.tags} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Title Optimization */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Event Title</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Title (10-60 characters recommended)</Label>
            <Input
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                onUpdateTitle?.(e.target.value);
              }}
              placeholder="Enter a compelling event title..."
              maxLength={60}
            />
            <div className="flex items-center justify-between mt-1">
              <span className={cn(
                "text-xs",
                title.length < 10 || title.length > 60 ? "text-red-600" : "text-gray-600"
              )}>
                {title.length}/60 characters
              </span>
              {title.length >= 30 && title.length <= 50 && (
                <Badge variant="success" className="text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Optimal length
                </Badge>
              )}
            </div>
          </div>
          {seoScore.title < 80 && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription className="text-sm">
                Tips: Start with capital letter, include main keyword, keep it concise and descriptive
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Description */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Event Description</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Description (100-300 characters recommended)</Label>
            <Textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value);
                onUpdateDescription?.(e.target.value);
              }}
              placeholder="Describe your event in detail..."
              rows={4}
              maxLength={500}
            />
            <div className="flex items-center justify-between mt-1">
              <span className={cn(
                "text-xs",
                description.length < 100 || description.length > 300 ? "text-red-600" : "text-gray-600"
              )}>
                {description.length}/500 characters
              </span>
              {description.length >= 150 && description.length <= 250 && (
                <Badge variant="success" className="text-xs">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Optimal length
                </Badge>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Keywords */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">SEO Keywords</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Add Keywords (3-10 recommended)</Label>
            <div className="flex gap-2">
              <Input
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder="Add a keyword..."
                onKeyDown={(e) => e.key === 'Enter' && handleAddKeyword()}
              />
              <Button onClick={handleAddKeyword}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {keywords.map((keyword) => (
              <Badge key={keyword} variant="secondary">
                {keyword}
                <button
                  onClick={() => handleRemoveKeyword(keyword)}
                  className="ml-2 hover:text-red-600"
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Event Category</CardTitle>
        </CardHeader>
        <CardContent>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              onUpdateCategory?.(e.target.value);
            }}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">Select a category...</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </CardContent>
      </Card>

      {/* Tags */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Tags & Hashtags</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <Label>Add Tags</Label>
            <div className="flex gap-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                placeholder="Add a tag..."
                onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
              />
              <Button onClick={handleAddTag}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div>
            <p className="text-sm text-gray-600 mb-2">Your Tags:</p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  <Hash className="h-3 w-3 mr-1" />
                  {tag}
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-2 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-2">
              <TrendingUp className="inline h-3 w-3 mr-1" />
              Trending Tags:
            </p>
            <div className="flex flex-wrap gap-2">
              {trendingTags.filter(t => !tags.includes(t)).map((tag) => (
                <Badge
                  key={tag}
                  variant="outline"
                  className="cursor-pointer hover:bg-purple-50"
                  onClick={() => {
                    const updatedTags = [...tags, tag];
                    setTags(updatedTags);
                    onUpdateTags?.(updatedTags);
                  }}
                >
                  <Plus className="h-3 w-3 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Featured Placement */}
      <Card className="border-purple-200 bg-purple-50">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Star className="h-5 w-5 text-purple-600" />
            Featured Placement
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-gray-600">
            Get your event featured on the homepage and category pages for maximum visibility
          </p>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-white rounded-lg border">
              <Award className="h-8 w-8 text-yellow-500 mx-auto mb-2" />
              <p className="font-semibold text-sm">Homepage Feature</p>
              <p className="text-xs text-gray-600">7 days</p>
              <p className="text-lg font-bold text-purple-600">$99</p>
            </div>
            <div className="text-center p-3 bg-white rounded-lg border">
              <Sparkles className="h-8 w-8 text-purple-500 mx-auto mb-2" />
              <p className="font-semibold text-sm">Category Spotlight</p>
              <p className="text-xs text-gray-600">14 days</p>
              <p className="text-lg font-bold text-purple-600">$149</p>
            </div>
          </div>
          <Button 
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600"
            onClick={onRequestFeature}
          >
            <Star className="h-4 w-4 mr-2" />
            Request Featured Placement
          </Button>
        </CardContent>
      </Card>

      {/* Search Preview */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Search Result Preview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-600 hover:underline cursor-pointer">
              {title || 'Your Event Title'}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {category && <span className="text-green-700">{category} • </span>}
              <span>{new Date().toLocaleDateString()} • Virtual Event</span>
            </p>
            <p className="text-sm mt-2">
              {description || 'Your event description will appear here...'}
            </p>
            <div className="flex flex-wrap gap-2 mt-2">
              {tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs text-gray-500">#{tag}</span>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}