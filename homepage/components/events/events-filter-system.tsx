'use client';

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Music,
  Users,
  GraduationCap,
  MessageCircle,
  Video,
  PartyPopper,
  Mic,
  Calendar as CalendarIcon,
  DollarSign,
  Globe,
  User,
  Filter,
  X,
  ChevronDown,
  Search,
  TrendingUp,
  Clock,
  Star
} from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

export interface EventFilters {
  dateRange: {
    from: Date | undefined;
    to: Date | undefined;
  };
  priceRange: {
    min: number;
    max: number;
  };
  categories: string[];
  languages: string[];
  creators: string[];
  sortBy: 'date' | 'price' | 'popularity' | 'spots';
  showSoldOut: boolean;
  showPastEvents: boolean;
}

export interface EventCategory {
  id: string;
  name: string;
  icon: React.ElementType;
  count: number;
  color: string;
}

interface EventsFilterSystemProps {
  filters: EventFilters;
  categories: EventCategory[];
  languages: string[];
  creators: Array<{ id: string; name: string; verified: boolean }>;
  onFiltersChange: (filters: EventFilters) => void;
  onCategorySelect: (category: string) => void;
  totalEvents: number;
  filteredEvents: number;
  className?: string;
}

const defaultCategories: EventCategory[] = [
  { id: 'concerts', name: 'Concerts & Shows', icon: Music, count: 0, color: 'bg-purple-500' },
  { id: 'meetgreets', name: 'Meet & Greets', icon: Users, count: 0, color: 'bg-blue-500' },
  { id: 'workshops', name: 'Workshops & Classes', icon: GraduationCap, count: 0, color: 'bg-green-500' },
  { id: 'qa', name: 'Q&A Sessions', icon: MessageCircle, count: 0, color: 'bg-yellow-500' },
  { id: 'watch', name: 'Watch Parties', icon: Video, count: 0, color: 'bg-red-500' },
  { id: 'special', name: 'Special Occasions', icon: PartyPopper, count: 0, color: 'bg-pink-500' },
  { id: 'podcasts', name: 'Podcasts & Talks', icon: Mic, count: 0, color: 'bg-indigo-500' }
];

export function EventCategoriesNav({
  categories = defaultCategories,
  selectedCategories,
  onCategoryToggle,
  className
}: {
  categories?: EventCategory[];
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-wrap gap-3", className)}>
      {categories.map((category) => {
        const Icon = category.icon;
        const isSelected = selectedCategories.includes(category.id);
        
        return (
          <motion.button
            key={category.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onCategoryToggle(category.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg border transition-all",
              isSelected 
                ? "bg-primary text-primary-foreground border-primary" 
                : "bg-white hover:bg-gray-50 border-gray-200"
            )}
          >
            <Icon className="h-4 w-4" />
            <span className="font-medium">{category.name}</span>
            {category.count > 0 && (
              <Badge variant="secondary" className="ml-1">
                {category.count}
              </Badge>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

export function EventsFilterSystem({
  filters,
  categories = defaultCategories,
  languages,
  creators,
  onFiltersChange,
  onCategorySelect,
  totalEvents,
  filteredEvents,
  className
}: EventsFilterSystemProps) {
  const [isExpanded, setIsExpanded] = React.useState(false);
  const [activeFilterCount, setActiveFilterCount] = React.useState(0);

  React.useEffect(() => {
    let count = 0;
    if (filters.dateRange.from || filters.dateRange.to) count++;
    if (filters.priceRange.min > 0 || filters.priceRange.max < 500) count++;
    if (filters.categories.length > 0) count++;
    if (filters.languages.length > 0) count++;
    if (filters.creators.length > 0) count++;
    if (!filters.showSoldOut) count++;
    if (!filters.showPastEvents) count++;
    setActiveFilterCount(count);
  }, [filters]);

  const handleCategoryToggle = (categoryId: string) => {
    const newCategories = filters.categories.includes(categoryId)
      ? filters.categories.filter(c => c !== categoryId)
      : [...filters.categories, categoryId];
    
    onFiltersChange({
      ...filters,
      categories: newCategories
    });
  };

  const handlePriceChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      priceRange: { min: value[0], max: value[1] }
    });
  };

  const handleLanguageToggle = (language: string) => {
    const newLanguages = filters.languages.includes(language)
      ? filters.languages.filter(l => l !== language)
      : [...filters.languages, language];
    
    onFiltersChange({
      ...filters,
      languages: newLanguages
    });
  };

  const handleCreatorToggle = (creatorId: string) => {
    const newCreators = filters.creators.includes(creatorId)
      ? filters.creators.filter(c => c !== creatorId)
      : [...filters.creators, creatorId];
    
    onFiltersChange({
      ...filters,
      creators: newCreators
    });
  };

  const handleSortChange = (value: string) => {
    onFiltersChange({
      ...filters,
      sortBy: value as EventFilters['sortBy']
    });
  };

  const clearAllFilters = () => {
    onFiltersChange({
      dateRange: { from: undefined, to: undefined },
      priceRange: { min: 0, max: 500 },
      categories: [],
      languages: [],
      creators: [],
      sortBy: 'date',
      showSoldOut: true,
      showPastEvents: false
    });
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* Categories Navigation */}
      <EventCategoriesNav
        categories={categories}
        selectedCategories={filters.categories}
        onCategoryToggle={handleCategoryToggle}
      />

      {/* Filter Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-lg border">
        <div className="flex items-center gap-4">
          <Button
            variant={isExpanded ? "default" : "outline"}
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filters
            {activeFilterCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {activeFilterCount}
              </Badge>
            )}
          </Button>

          {/* Quick Filters */}
          <div className="flex gap-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <CalendarIcon className="h-4 w-4 mr-2" />
                  Date Range
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={{
                    from: filters.dateRange.from,
                    to: filters.dateRange.to
                  }}
                  onSelect={(range) => {
                    onFiltersChange({
                      ...filters,
                      dateRange: {
                        from: range?.from,
                        to: range?.to
                      }
                    });
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" size="sm">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Price: ${filters.priceRange.min} - ${filters.priceRange.max}
                  <ChevronDown className="h-4 w-4 ml-2" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-4">
                  <div>
                    <Label>Price Range</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm">${filters.priceRange.min}</span>
                      <Slider
                        value={[filters.priceRange.min, filters.priceRange.max]}
                        onValueChange={handlePriceChange}
                        max={500}
                        step={10}
                        className="flex-1"
                      />
                      <span className="text-sm">${filters.priceRange.max}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePriceChange([0, 50])}
                    >
                      Under $50
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePriceChange([50, 100])}
                    >
                      $50-$100
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handlePriceChange([100, 500])}
                    >
                      $100+
                    </Button>
                  </div>
                </div>
              </PopoverContent>
            </Popover>

            <Select value={filters.sortBy} onValueChange={handleSortChange}>
              <SelectTrigger className="w-[180px] h-9">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="date">
                  <div className="flex items-center gap-2">
                    <CalendarIcon className="h-4 w-4" />
                    Date (Upcoming)
                  </div>
                </SelectItem>
                <SelectItem value="price">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Price (Low to High)
                  </div>
                </SelectItem>
                <SelectItem value="popularity">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Popularity
                  </div>
                </SelectItem>
                <SelectItem value="spots">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Spots Remaining
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            Showing {filteredEvents} of {totalEvents} events
          </span>
          {activeFilterCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
            >
              Clear all
              <X className="h-4 w-4 ml-1" />
            </Button>
          )}
        </div>
      </div>

      {/* Expanded Filters */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Languages */}
                  <div>
                    <Label className="mb-3 block">Language</Label>
                    <div className="space-y-2">
                      {languages.map((language) => (
                        <div key={language} className="flex items-center space-x-2">
                          <Checkbox
                            id={language}
                            checked={filters.languages.includes(language)}
                            onCheckedChange={() => handleLanguageToggle(language)}
                          />
                          <Label
                            htmlFor={language}
                            className="text-sm font-normal cursor-pointer"
                          >
                            {language}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Creators */}
                  <div>
                    <Label className="mb-3 block">Creators</Label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {creators.map((creator) => (
                        <div key={creator.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={creator.id}
                            checked={filters.creators.includes(creator.id)}
                            onCheckedChange={() => handleCreatorToggle(creator.id)}
                          />
                          <Label
                            htmlFor={creator.id}
                            className="text-sm font-normal cursor-pointer flex items-center gap-1"
                          >
                            {creator.name}
                            {creator.verified && (
                              <Star className="h-3 w-3 text-blue-500 fill-blue-500" />
                            )}
                          </Label>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Additional Options */}
                  <div>
                    <Label className="mb-3 block">Options</Label>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="show-sold-out"
                          checked={filters.showSoldOut}
                          onCheckedChange={(checked) => 
                            onFiltersChange({
                              ...filters,
                              showSoldOut: checked as boolean
                            })
                          }
                        />
                        <Label
                          htmlFor="show-sold-out"
                          className="text-sm font-normal cursor-pointer"
                        >
                          Show sold out events
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="show-past"
                          checked={filters.showPastEvents}
                          onCheckedChange={(checked) => 
                            onFiltersChange({
                              ...filters,
                              showPastEvents: checked as boolean
                            })
                          }
                        />
                        <Label
                          htmlFor="show-past"
                          className="text-sm font-normal cursor-pointer"
                        >
                          Show past events
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}