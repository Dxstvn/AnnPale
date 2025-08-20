'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Search,
  Filter,
  SortAsc,
  SortDesc,
  Calendar,
  User,
  Hash,
  MessageSquare,
  Heart,
  Eye,
  Clock,
  Star,
  TrendingUp,
  X,
  ChevronDown,
  ChevronUp,
  History,
  Bookmark,
  Award
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

interface SearchFilters {
  query: string;
  category: string;
  threadType: string;
  author: string;
  tags: string[];
  dateRange: 'all' | 'today' | 'week' | 'month' | 'year';
  sortBy: 'relevance' | 'newest' | 'oldest' | 'replies' | 'views' | 'karma';
  sortOrder: 'asc' | 'desc';
  hasReplies: boolean | null;
  isSolved: boolean | null;
  isPinned: boolean | null;
  minKarma: number;
}

interface SearchSuggestion {
  type: 'thread' | 'user' | 'tag' | 'category';
  text: string;
  count?: number;
}

interface RelatedThread {
  id: string;
  title: string;
  replies: number;
  karma: number;
  category: string;
}

interface ForumSearchProps {
  onSearch?: (filters: SearchFilters) => void;
  onFilterChange?: (filters: SearchFilters) => void;
  suggestions?: SearchSuggestion[];
  relatedThreads?: RelatedThread[];
  recentSearches?: string[];
}

export function ForumSearch({
  onSearch,
  onFilterChange,
  suggestions = [],
  relatedThreads = [],
  recentSearches = []
}: ForumSearchProps) {
  const [filters, setFilters] = React.useState<SearchFilters>({
    query: '',
    category: 'all',
    threadType: 'all',
    author: '',
    tags: [],
    dateRange: 'all',
    sortBy: 'relevance',
    sortOrder: 'desc',
    hasReplies: null,
    isSolved: null,
    isPinned: null,
    minKarma: 0
  });

  const [showAdvanced, setShowAdvanced] = React.useState(false);
  const [currentTag, setCurrentTag] = React.useState('');
  const [showSuggestions, setShowSuggestions] = React.useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  // Sample data
  const sampleSuggestions: SearchSuggestion[] = [
    { type: 'thread', text: 'Best Haitian restaurants in Miami', count: 5 },
    { type: 'thread', text: 'Learning Kreyòl resources', count: 3 },
    { type: 'tag', text: 'kreyol', count: 45 },
    { type: 'tag', text: 'travel', count: 78 },
    { type: 'user', text: 'Marie Delacroix', count: 23 },
    { type: 'category', text: 'Culture & Heritage', count: 234 }
  ];

  const sampleRelated: RelatedThread[] = [
    { id: '1', title: 'Traditional Haitian cuisine guide', replies: 23, karma: 89, category: 'Culture' },
    { id: '2', title: 'Best language learning apps', replies: 45, karma: 156, category: 'Language' },
    { id: '3', title: 'Planning trip to Haiti', replies: 34, karma: 98, category: 'Travel' }
  ];

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'general', label: 'General Discussion' },
    { value: 'creator-spaces', label: 'Creator Spaces' },
    { value: 'fan-zones', label: 'Fan Zones' },
    { value: 'help-support', label: 'Help & Support' },
    { value: 'showcase', label: 'Showcase' },
    { value: 'culture-heritage', label: 'Culture & Heritage' },
    { value: 'off-topic', label: 'Off-Topic' }
  ];

  const threadTypes = [
    { value: 'all', label: 'All Types' },
    { value: 'discussion', label: 'Discussions' },
    { value: 'question', label: 'Questions' },
    { value: 'announcement', label: 'Announcements' },
    { value: 'poll', label: 'Polls' },
    { value: 'resource', label: 'Resources' },
    { value: 'event', label: 'Events' }
  ];

  const sortOptions = [
    { value: 'relevance', label: 'Relevance' },
    { value: 'newest', label: 'Newest First' },
    { value: 'oldest', label: 'Oldest First' },
    { value: 'replies', label: 'Most Replies' },
    { value: 'views', label: 'Most Views' },
    { value: 'karma', label: 'Highest Karma' }
  ];

  const dateRanges = [
    { value: 'all', label: 'All Time' },
    { value: 'today', label: 'Today' },
    { value: 'week', label: 'This Week' },
    { value: 'month', label: 'This Month' },
    { value: 'year', label: 'This Year' }
  ];

  const updateFilters = (updates: Partial<SearchFilters>) => {
    const newFilters = { ...filters, ...updates };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleSearch = () => {
    onSearch?.(filters);
    setShowSuggestions(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !filters.tags.includes(currentTag.trim().toLowerCase())) {
      updateFilters({
        tags: [...filters.tags, currentTag.trim().toLowerCase()]
      });
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    updateFilters({
      tags: filters.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'thread' || suggestion.type === 'user') {
      updateFilters({ query: suggestion.text });
    } else if (suggestion.type === 'tag') {
      updateFilters({
        tags: [...filters.tags, suggestion.text]
      });
    } else if (suggestion.type === 'category') {
      const categoryValue = categories.find(c => c.label === suggestion.text)?.value || 'all';
      updateFilters({ category: categoryValue });
    }
    setShowSuggestions(false);
    handleSearch();
  };

  const clearFilters = () => {
    const clearedFilters: SearchFilters = {
      query: '',
      category: 'all',
      threadType: 'all',
      author: '',
      tags: [],
      dateRange: 'all',
      sortBy: 'relevance',
      sortOrder: 'desc',
      hasReplies: null,
      isSolved: null,
      isPinned: null,
      minKarma: 0
    };
    setFilters(clearedFilters);
    onFilterChange?.(clearedFilters);
  };

  const getFilterCount = (): number => {
    let count = 0;
    if (filters.query) count++;
    if (filters.category !== 'all') count++;
    if (filters.threadType !== 'all') count++;
    if (filters.author) count++;
    if (filters.tags.length > 0) count++;
    if (filters.dateRange !== 'all') count++;
    if (filters.hasReplies !== null) count++;
    if (filters.isSolved !== null) count++;
    if (filters.isPinned !== null) count++;
    if (filters.minKarma > 0) count++;
    return count;
  };

  const getSuggestionIcon = (type: string) => {
    switch (type) {
      case 'thread': return <MessageSquare className="h-4 w-4 text-blue-600" />;
      case 'user': return <User className="h-4 w-4 text-green-600" />;
      case 'tag': return <Hash className="h-4 w-4 text-purple-600" />;
      case 'category': return <Filter className="h-4 w-4 text-orange-600" />;
      default: return <Search className="h-4 w-4 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                ref={searchInputRef}
                placeholder="Search threads, posts, users..."
                value={filters.query}
                onChange={(e) => {
                  updateFilters({ query: e.target.value });
                  setShowSuggestions(e.target.value.length > 0);
                }}
                onFocus={() => setShowSuggestions(filters.query.length > 0)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                onKeyDown={handleKeyPress}
                className="pl-10"
              />
              
              {/* Search Suggestions */}
              <AnimatePresence>
                {showSuggestions && (filters.query.length > 0 || recentSearches.length > 0) && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute z-50 top-full mt-1 w-full bg-white border rounded-md shadow-lg max-h-64 overflow-y-auto"
                  >
                    {filters.query.length > 0 ? (
                      <div>
                        {sampleSuggestions
                          .filter(s => s.text.toLowerCase().includes(filters.query.toLowerCase()))
                          .slice(0, 6)
                          .map((suggestion, index) => (
                          <div
                            key={`${suggestion.type}-${suggestion.text}`}
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                            onClick={() => handleSuggestionClick(suggestion)}
                          >
                            {getSuggestionIcon(suggestion.type)}
                            <div className="flex-1">
                              <div className="font-medium text-sm">{suggestion.text}</div>
                              <div className="text-xs text-gray-500 capitalize">
                                {suggestion.type} {suggestion.count && `(${suggestion.count})`}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div>
                        <div className="px-3 py-2 text-xs font-medium text-gray-500 border-b">
                          Recent Searches
                        </div>
                        {recentSearches.slice(0, 5).map((search, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer"
                            onClick={() => updateFilters({ query: search })}
                          >
                            <History className="h-4 w-4 text-gray-400" />
                            <span className="text-sm">{search}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button
              variant="outline"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
              {getFilterCount() > 0 && (
                <Badge variant="secondary" className="ml-1">
                  {getFilterCount()}
                </Badge>
              )}
              {showAdvanced ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>

            <Button onClick={handleSearch} className="bg-purple-600 hover:bg-purple-700">
              <Search className="h-4 w-4 mr-1" />
              Search
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Advanced Filters */}
      <AnimatePresence>
        {showAdvanced && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Advanced Filters</CardTitle>
                  <Button variant="ghost" size="sm" onClick={clearFilters}>
                    <X className="h-4 w-4 mr-1" />
                    Clear All
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Category & Type */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Category</label>
                    <Select
                      value={filters.category}
                      onValueChange={(value) => updateFilters({ category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.value} value={category.value}>
                            {category.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Thread Type</label>
                    <Select
                      value={filters.threadType}
                      onValueChange={(value) => updateFilters({ threadType: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {threadTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Author & Tags */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Author</label>
                    <Input
                      placeholder="Filter by author..."
                      value={filters.author}
                      onChange={(e) => updateFilters({ author: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Tags</label>
                    <div className="flex gap-2">
                      <Input
                        placeholder="Add tag..."
                        value={currentTag}
                        onChange={(e) => setCurrentTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            handleAddTag();
                          }
                        }}
                        className="flex-1"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={handleAddTag}
                        disabled={!currentTag.trim()}
                      >
                        <Hash className="h-4 w-4" />
                      </Button>
                    </div>
                    {filters.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {filters.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                            <Hash className="h-3 w-3" />
                            {tag}
                            <Button
                              type="button"
                              variant="ghost"
                              size="sm"
                              className="h-auto w-auto p-0 ml-1"
                              onClick={() => handleRemoveTag(tag)}
                            >
                              <X className="h-3 w-3" />
                            </Button>
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Date Range & Sort */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Date Range</label>
                    <Select
                      value={filters.dateRange}
                      onValueChange={(value) => updateFilters({ dateRange: value as any })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {dateRanges.map((range) => (
                          <SelectItem key={range.value} value={range.value}>
                            {range.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Sort By</label>
                    <div className="flex gap-2">
                      <Select
                        value={filters.sortBy}
                        onValueChange={(value) => updateFilters({ sortBy: value as any })}
                      >
                        <SelectTrigger className="flex-1">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {sortOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => updateFilters({ 
                          sortOrder: filters.sortOrder === 'asc' ? 'desc' : 'asc' 
                        })}
                      >
                        {filters.sortOrder === 'asc' ? 
                          <SortAsc className="h-4 w-4" /> : 
                          <SortDesc className="h-4 w-4" />
                        }
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Thread Status Filters */}
                <div className="space-y-3">
                  <label className="text-sm font-medium">Thread Status</label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="hasReplies"
                        checked={filters.hasReplies === true}
                        onCheckedChange={(checked) => updateFilters({ 
                          hasReplies: checked ? true : null 
                        })}
                      />
                      <label htmlFor="hasReplies" className="text-sm">Has Replies</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isSolved"
                        checked={filters.isSolved === true}
                        onCheckedChange={(checked) => updateFilters({ 
                          isSolved: checked ? true : null 
                        })}
                      />
                      <label htmlFor="isSolved" className="text-sm">Solved</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isPinned"
                        checked={filters.isPinned === true}
                        onCheckedChange={(checked) => updateFilters({ 
                          isPinned: checked ? true : null 
                        })}
                      />
                      <label htmlFor="isPinned" className="text-sm">Pinned</label>
                    </div>
                  </div>
                </div>

                {/* Minimum Karma */}
                <div className="space-y-2">
                  <label className="text-sm font-medium">Minimum Karma</label>
                  <Input
                    type="number"
                    min="0"
                    placeholder="0"
                    value={filters.minKarma || ''}
                    onChange={(e) => updateFilters({ minKarma: parseInt(e.target.value) || 0 })}
                    className="w-32"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Related Threads */}
      {relatedThreads.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Related Threads
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {sampleRelated.map((thread) => (
                <div key={thread.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="flex-1">
                    <h4 className="font-medium text-sm hover:text-purple-600">{thread.title}</h4>
                    <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                      <span>{thread.category}</span>
                      <span>•</span>
                      <span>{thread.replies} replies</span>
                      <span>•</span>
                      <span>{thread.karma} karma</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    <Bookmark className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}