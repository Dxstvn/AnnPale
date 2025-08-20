import { 
  LiveStream, 
  StreamMetrics, 
  DiscoveryAlgorithmWeights,
  DEFAULT_ALGORITHM_WEIGHTS,
  PersonalizationData,
  SortOption,
  StreamDiscoveryFilter
} from '@/lib/types/live-discovery';

export class StreamDiscoveryAlgorithm {
  private weights: DiscoveryAlgorithmWeights;

  constructor(weights: DiscoveryAlgorithmWeights = DEFAULT_ALGORITHM_WEIGHTS) {
    this.weights = weights;
  }

  /**
   * Calculate discovery score for a stream
   */
  calculateDiscoveryScore(
    stream: LiveStream, 
    metrics: StreamMetrics, 
    personalization?: PersonalizationData
  ): number {
    let score = 0;

    // Base scoring factors
    score += this.calculateViewerScore(stream.viewerCount) * this.weights.currentViewerCount;
    score += metrics.engagementRate * this.weights.engagementRate;
    score += this.calculateCreatorScore(stream) * this.weights.creatorReputation;
    score += this.calculateQualityScore(stream) * this.weights.streamQuality;
    score += this.calculateNewnessBonus(stream) * this.weights.newnessBonus;

    // Apply personalization if available
    if (personalization) {
      score *= this.calculatePersonalizationMultiplier(stream, personalization);
    }

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate trending score based on velocity
   */
  calculateTrendingScore(
    currentViewers: number,
    previousViewers: number,
    timeWindow: number
  ): number {
    if (timeWindow <= 0 || previousViewers <= 0) return 0;
    
    const growthRate = (currentViewers - previousViewers) / previousViewers;
    const velocityScore = Math.min(100, Math.max(0, growthRate * 100));
    
    // Weight by absolute viewer count
    const viewerWeight = Math.min(1, currentViewers / 1000);
    
    return velocityScore * viewerWeight;
  }

  /**
   * Sort streams based on specified criteria
   */
  sortStreams(
    streams: LiveStream[],
    sortBy: SortOption,
    metrics: Record<string, StreamMetrics>,
    personalization?: PersonalizationData
  ): LiveStream[] {
    const sortedStreams = [...streams];

    switch (sortBy) {
      case 'trending':
        return sortedStreams.sort((a, b) => {
          const scoreA = metrics[a.id]?.trendingScore || 0;
          const scoreB = metrics[b.id]?.trendingScore || 0;
          return scoreB - scoreA;
        });

      case 'most-viewers':
        return sortedStreams.sort((a, b) => b.viewerCount - a.viewerCount);

      case 'recently-started':
        return sortedStreams.sort((a, b) => 
          new Date(b.startTime).getTime() - new Date(a.startTime).getTime()
        );

      case 'following':
        if (!personalization) return sortedStreams;
        return sortedStreams.sort((a, b) => {
          const aFollowed = personalization.followedCreators.includes(a.creatorId);
          const bFollowed = personalization.followedCreators.includes(b.creatorId);
          if (aFollowed && !bFollowed) return -1;
          if (!aFollowed && bFollowed) return 1;
          return b.viewerCount - a.viewerCount;
        });

      case 'category':
        return sortedStreams.sort((a, b) => {
          if (a.category < b.category) return -1;
          if (a.category > b.category) return 1;
          return b.viewerCount - a.viewerCount;
        });

      case 'language':
        return sortedStreams.sort((a, b) => {
          if (a.language < b.language) return -1;
          if (a.language > b.language) return 1;
          return b.viewerCount - a.viewerCount;
        });

      default:
        return sortedStreams.sort((a, b) => {
          const scoreA = this.calculateDiscoveryScore(a, metrics[a.id], personalization);
          const scoreB = this.calculateDiscoveryScore(b, metrics[b.id], personalization);
          return scoreB - scoreA;
        });
    }
  }

  /**
   * Filter streams based on criteria
   */
  filterStreams(streams: LiveStream[], filter: StreamDiscoveryFilter): LiveStream[] {
    return streams.filter(stream => {
      // Category filter
      if (filter.category && filter.category.length > 0) {
        if (!filter.category.includes(stream.category)) return false;
      }

      // Language filter
      if (filter.language && filter.language.length > 0) {
        if (!filter.language.includes(stream.language)) return false;
      }

      // Status filter
      if (filter.status && filter.status.length > 0) {
        if (!filter.status.includes(stream.status)) return false;
      }

      // Following filter
      if (filter.followedOnly && !stream.isFollowed) return false;

      // Premium filters
      if (filter.premiumOnly && !stream.isPremium) return false;
      if (filter.freeOnly && stream.isPremium) return false;

      // Viewer count filters
      if (filter.minViewers && stream.viewerCount < filter.minViewers) return false;
      if (filter.maxViewers && stream.viewerCount > filter.maxViewers) return false;

      // Quality filter
      if (filter.quality && filter.quality.length > 0) {
        if (!filter.quality.includes(stream.quality)) return false;
      }

      return true;
    });
  }

  /**
   * Get personalized recommendations
   */
  getPersonalizedRecommendations(
    streams: LiveStream[],
    metrics: Record<string, StreamMetrics>,
    personalization: PersonalizationData,
    limit: number = 10
  ): LiveStream[] {
    // Score all streams with personalization
    const scoredStreams = streams.map(stream => ({
      stream,
      score: this.calculateDiscoveryScore(stream, metrics[stream.id], personalization)
    }));

    // Sort by score and return top streams
    return scoredStreams
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)
      .map(item => item.stream);
  }

  // Private helper methods

  private calculateViewerScore(viewerCount: number): number {
    // Logarithmic scaling to prevent very high viewer counts from dominating
    return Math.min(100, Math.log10(Math.max(1, viewerCount)) * 20);
  }

  private calculateCreatorScore(stream: LiveStream): number {
    let score = 50; // Base score

    // Verified creators get a boost
    if (stream.creatorVerified) score += 20;

    // Featured streams get a boost
    if (stream.isFeatured) score += 15;

    // Premium content gets a slight boost
    if (stream.isPremium) score += 5;

    return Math.min(100, score);
  }

  private calculateQualityScore(stream: LiveStream): number {
    const qualityScores = {
      'sd': 30,
      'hd': 70,
      '4k': 100
    };

    let score = qualityScores[stream.quality] || 0;

    // Bonus for having chat
    if (stream.hasChat) score += 10;

    // Bonus for recording capability
    if (stream.isRecorded) score += 5;

    return Math.min(100, score);
  }

  private calculateNewnessBonus(stream: LiveStream): number {
    const now = new Date().getTime();
    const streamStart = new Date(stream.startTime).getTime();
    const ageInHours = (now - streamStart) / (1000 * 60 * 60);

    // Streams get a bonus for being new (first 4 hours)
    if (ageInHours < 1) return 100;
    if (ageInHours < 2) return 75;
    if (ageInHours < 4) return 50;
    if (ageInHours < 8) return 25;
    return 0;
  }

  private calculatePersonalizationMultiplier(
    stream: LiveStream,
    personalization: PersonalizationData
  ): number {
    let multiplier = 1.0;

    // Boost followed creators significantly
    if (personalization.followedCreators.includes(stream.creatorId)) {
      multiplier *= 2.0;
    }

    // Category preference boost
    const categoryPreference = personalization.categoryPreferences[stream.category] || 0;
    multiplier *= (1 + categoryPreference * 0.5);

    // Language preference boost
    if (personalization.languagePreferences.includes(stream.language)) {
      multiplier *= 1.3;
    }

    // Time preference boost (if stream matches user's preferred times)
    const streamHour = new Date(stream.startTime).getHours();
    const streamDay = new Date(stream.startTime).getDay();
    const hasTimePreference = personalization.preferredStreamTimes.some(
      pref => pref.hour === streamHour && pref.dayOfWeek === streamDay
    );
    if (hasTimePreference) {
      multiplier *= 1.2;
    }

    return Math.min(3.0, multiplier); // Cap the multiplier
  }
}

/**
 * Calculate stream metrics for discovery algorithm
 */
export function calculateStreamMetrics(
  stream: LiveStream,
  previousMetrics?: StreamMetrics
): StreamMetrics {
  const baseEngagement = Math.min(100, (stream.viewerCount / Math.max(1, stream.peakViewerCount)) * 100);
  
  return {
    trendingScore: previousMetrics 
      ? new StreamDiscoveryAlgorithm().calculateTrendingScore(
          stream.viewerCount,
          previousMetrics.engagementRate * stream.peakViewerCount / 100,
          60 // 1 hour window
        )
      : 0,
    velocityScore: 0, // Would be calculated from historical data
    engagementRate: baseEngagement,
    chatActivity: Math.min(100, Math.random() * 100), // Mock data
    retentionRate: Math.min(100, Math.random() * 100), // Mock data
    discoveryScore: 0, // Calculated by algorithm
    qualityScore: stream.quality === '4k' ? 100 : stream.quality === 'hd' ? 70 : 30
  };
}

/**
 * Generate mock personalization data for testing
 */
export function generateMockPersonalizationData(): PersonalizationData {
  return {
    viewingHistory: [],
    followedCreators: ['creator-1', 'creator-3', 'creator-7'],
    categoryPreferences: {
      'music-performance': 0.9,
      'qa-session': 0.6,
      'tutorial': 0.8,
      'special-event': 0.7,
      'behind-scenes': 0.5,
      'casual-chat': 0.3,
      'workout': 0.4,
      'cooking': 0.2,
      'gaming': 0.1,
      'news': 0.3
    },
    languagePreferences: ['en', 'fr', 'ht'],
    timeZone: 'America/New_York',
    averageSessionLength: 1800, // 30 minutes
    preferredStreamTimes: [
      { dayOfWeek: 1, hour: 19 }, // Monday 7pm
      { dayOfWeek: 3, hour: 20 }, // Wednesday 8pm
      { dayOfWeek: 6, hour: 15 }, // Saturday 3pm
      { dayOfWeek: 0, hour: 14 }  // Sunday 2pm
    ]
  };
}