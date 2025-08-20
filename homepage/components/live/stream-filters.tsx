'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Filter,
  Search,
  X,
  Users,
  Clock,
  Star,
  Crown,
  Sparkles,
  Settings,
  ChevronDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  StreamCategory, 
  StreamDiscoveryFilter, 
  SortOption,
  STREAM_CATEGORIES 
} from '@/lib/types/live-discovery';

interface StreamFiltersProps {
  filter: StreamDiscoveryFilter;
  sortBy: SortOption;
  searchQuery: string;
  onFilterChange: (filter: StreamDiscoveryFilter) => void;
  onSortChange: (sort: SortOption) => void;
  onSearchChange: (query: string) => void;
  onClearFilters: () => void;
  streamCount: number;
  isMobile?: boolean;
  className?: string;
}

const SORT_OPTIONS: Array<{ value: SortOption; label: string; icon: React.ElementType }> = [
  { value: 'trending', label: 'Trending', icon: Sparkles },
  { value: 'most-viewers', label: 'Most Viewers', icon: Users },
  { value: 'recently-started', label: 'Recently Started', icon: Clock },
  { value: 'following', label: 'Following', icon: Star },
  { value: 'category', label: 'By Category', icon: Filter },
  { value: 'language', label: 'By Language', icon: Settings }
];

const LANGUAGES = [
  { code: 'en', name: 'English' },
  { code: 'fr', name: 'Français' },
  { code: 'ht', name: 'Kreyòl Ayisyen' },
  { code: 'es', name: 'Español' },
  { code: 'pt', name: 'Português' }
];

const QUALITY_OPTIONS = [
  { value: 'sd', label: 'SD' },
  { value: 'hd', label: 'HD' },
  { value: '4k', label: '4K' }
];

export function StreamFilters({
  filter,
  sortBy,
  searchQuery,
  onFilterChange,
  onSortChange,
  onSearchChange,
  onClearFilters,
  streamCount,
  isMobile = false,
  className
}: StreamFiltersProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [tempFilter, setTempFilter] = useState<StreamDiscoveryFilter>(filter);
  const [viewerRange, setViewerRange] = useState([
    filter.minViewers || 0,
    filter.maxViewers || 10000
  ]);

  useEffect(() => {
    setTempFilter(filter);
  }, [filter]);

  const applyFilters = () => {
    onFilterChange({
      ...tempFilter,
      minViewers: viewerRange[0] > 0 ? viewerRange[0] : undefined,
      maxViewers: viewerRange[1] < 10000 ? viewerRange[1] : undefined
    });
    if (isMobile) setIsOpen(false);
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filter.category && filter.category.length > 0) count++;
    if (filter.language && filter.language.length > 0) count++;
    if (filter.followedOnly) count++;
    if (filter.premiumOnly || filter.freeOnly) count++;
    if (filter.minViewers || filter.maxViewers) count++;
    if (filter.quality && filter.quality.length > 0) count++;
    return count;
  };

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Search */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Search Streams</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search by title, creator, or tags..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Sort Options */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Sort By</label>
        <Select value={sortBy} onValueChange={(value: SortOption) => onSortChange(value)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => {
              const Icon = option.icon;
              return (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {option.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      <Separator />

      {/* Categories */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Categories</label>
        <div className="grid grid-cols-2 gap-2">
          {(Object.entries(STREAM_CATEGORIES) as [StreamCategory, typeof STREAM_CATEGORIES[StreamCategory]][]).map(([key, category]) => (
            <div key={key} className="flex items-center space-x-2">
              <Checkbox
                id={key}
                checked={tempFilter.category?.includes(key) || false}
                onCheckedChange={(checked) => {
                  setTempFilter(prev => ({
                    ...prev,
                    category: checked
                      ? [...(prev.category || []), key]
                      : prev.category?.filter(c => c !== key) || []
                  }));
                }}
              />
              <label
                htmlFor={key}
                className="text-sm cursor-pointer flex items-center gap-1"
              >
                <span>{category.icon}</span>
                <span className="truncate">{category.displayName}</span>
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Languages */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Languages</label>
        <div className="space-y-2">
          {LANGUAGES.map((lang) => (
            <div key={lang.code} className="flex items-center space-x-2">
              <Checkbox
                id={lang.code}
                checked={tempFilter.language?.includes(lang.code) || false}
                onCheckedChange={(checked) => {
                  setTempFilter(prev => ({
                    ...prev,
                    language: checked
                      ? [...(prev.language || []), lang.code]
                      : prev.language?.filter(l => l !== lang.code) || []
                  }));
                }}
              />
              <label htmlFor={lang.code} className="text-sm cursor-pointer">
                {lang.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Separator />

      {/* Stream Type */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Stream Type</label>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="following"
              checked={tempFilter.followedOnly || false}
              onCheckedChange={(checked) => {
                setTempFilter(prev => ({
                  ...prev,
                  followedOnly: checked as boolean
                }));
              }}
            />
            <label htmlFor="following" className="text-sm cursor-pointer flex items-center gap-1">
              <Star className="w-4 h-4" />
              Following Only
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="premium"
              checked={tempFilter.premiumOnly || false}
              onCheckedChange={(checked) => {
                setTempFilter(prev => ({
                  ...prev,
                  premiumOnly: checked as boolean,
                  freeOnly: false
                }));
              }}
            />
            <label htmlFor="premium" className="text-sm cursor-pointer flex items-center gap-1">
              <Crown className="w-4 h-4" />
              Premium Only
            </label>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="free"
              checked={tempFilter.freeOnly || false}
              onCheckedChange={(checked) => {
                setTempFilter(prev => ({
                  ...prev,
                  freeOnly: checked as boolean,
                  premiumOnly: false
                }));
              }}
            />
            <label htmlFor="free" className="text-sm cursor-pointer">
              Free Only
            </label>
          </div>
        </div>
      </div>

      <Separator />

      {/* Viewer Count Range */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Viewer Count</label>
        <div className="px-2">
          <Slider
            value={viewerRange}
            onValueChange={setViewerRange}
            max={10000}
            min={0}
            step={100}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>{viewerRange[0]}+</span>
            <span>{viewerRange[1] === 10000 ? '10K+' : viewerRange[1]}</span>
          </div>
        </div>
      </div>

      <Separator />

      {/* Quality */}
      <div className="space-y-3">
        <label className="text-sm font-medium">Quality</label>
        <div className="flex flex-wrap gap-2">
          {QUALITY_OPTIONS.map((quality) => (
            <Button
              key={quality.value}
              variant={tempFilter.quality?.includes(quality.value as any) ? "default" : "outline"}
              size="sm"
              onClick={() => {
                setTempFilter(prev => ({
                  ...prev,
                  quality: prev.quality?.includes(quality.value as any)
                    ? prev.quality.filter(q => q !== quality.value)
                    : [...(prev.quality || []), quality.value as any]
                }));
              }}
            >
              {quality.label}
            </Button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-4">
        <Button onClick={applyFilters} className="flex-1">
          Apply Filters
        </Button>
        <Button variant="outline" onClick={onClearFilters}>
          Clear
        </Button>
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search streams..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="w-4 h-4 mr-2" />
              Filters
              {getActiveFilterCount() > 0 && (
                <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 text-xs">
                  {getActiveFilterCount()}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-md">
            <SheetHeader>
              <SheetTitle>Filter Streams</SheetTitle>
              <SheetDescription>
                {streamCount} streams found
              </SheetDescription>
            </SheetHeader>
            <ScrollArea className="h-[calc(100vh-120px)] mt-6">
              <FilterContent />
            </ScrollArea>
          </SheetContent>
        </Sheet>
      </div>
    );
  }

  return (
    <div className={cn('space-y-4', className)}>
      {/* Search and Sort Row */}
      <div className="flex gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <Input
              placeholder="Search streams by title, creator, or tags..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        
        <Select value={sortBy} onValueChange={(value: SortOption) => onSortChange(value)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SORT_OPTIONS.map((option) => {
              const Icon = option.icon;
              return (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4" />
                    {option.label}
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {/* Active Filters */}
      <AnimatePresence>
        {getActiveFilterCount() > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 flex-wrap"
          >
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Active filters:
            </span>
            
            {filter.category?.map((category) => (
              <Badge key={category} variant="secondary" className="gap-1">
                {STREAM_CATEGORIES[category].icon}
                {STREAM_CATEGORIES[category].displayName}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => {
                    onFilterChange({
                      ...filter,
                      category: filter.category?.filter(c => c !== category)
                    });
                  }}
                />
              </Badge>
            ))}

            {filter.language?.map((lang) => (
              <Badge key={lang} variant="secondary" className="gap-1">
                {LANGUAGES.find(l => l.code === lang)?.name}
                <X 
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => {
                    onFilterChange({
                      ...filter,
                      language: filter.language?.filter(l => l !== lang)
                    });
                  }}
                />
              </Badge>
            ))}

            {filter.followedOnly && (
              <Badge variant="secondary" className="gap-1">
                <Star className="w-3 h-3" />
                Following
                <X 
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => {
                    onFilterChange({ ...filter, followedOnly: false });
                  }}
                />
              </Badge>
            )}

            {(filter.premiumOnly || filter.freeOnly) && (
              <Badge variant="secondary" className="gap-1">
                {filter.premiumOnly ? (
                  <>
                    <Crown className="w-3 h-3" />
                    Premium
                  </>
                ) : (
                  'Free'
                )}
                <X 
                  className="w-3 h-3 cursor-pointer"
                  onClick={() => {
                    onFilterChange({ 
                      ...filter, 
                      premiumOnly: false,
                      freeOnly: false 
                    });
                  }}
                />
              </Badge>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-xs"
            >
              Clear all
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Results Count */}
      <div className="text-sm text-gray-600 dark:text-gray-400">
        {streamCount} streams found
      </div>
    </div>
  );
}