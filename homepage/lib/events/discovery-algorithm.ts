// Events Discovery Algorithm based on Phase 4.2.2 specifications

export interface UserPreferences {
  favoriteCategories: string[];
  favoriteCreators: string[];
  preferredLanguages: string[];
  priceRange: { min: number; max: number };
  preferredDays: string[]; // ['monday', 'tuesday', etc.]
  preferredTimes: string[]; // ['morning', 'afternoon', 'evening']
}

export interface EventDiscoveryScore {
  eventId: string;
  totalScore: number;
  breakdown: {
    userPreferences: number; // 30%
    trendingVelocity: number; // 25%
    timeProximity: number; // 20%
    creatorFollowing: number; // 15%
    priceMatch: number; // 10%
  };
  promotionalSlot?: 'featured' | 'staff_pick' | 'community_choice' | 'new_creator' | 'last_chance';
}

export class EventDiscoveryAlgorithm {
  private userPreferences: UserPreferences;
  
  constructor(userPreferences: UserPreferences) {
    this.userPreferences = userPreferences;
  }

  // Main scoring function
  calculateRelevanceScore(event: any): EventDiscoveryScore {
    const scores = {
      userPreferences: this.calculateUserPreferenceScore(event),
      trendingVelocity: this.calculateTrendingScore(event),
      timeProximity: this.calculateTimeProximityScore(event),
      creatorFollowing: this.calculateCreatorFollowingScore(event),
      priceMatch: this.calculatePriceMatchScore(event)
    };

    // Apply weights according to Phase 4.2.2 specifications
    const totalScore = 
      scores.userPreferences * 0.30 +
      scores.trendingVelocity * 0.25 +
      scores.timeProximity * 0.20 +
      scores.creatorFollowing * 0.15 +
      scores.priceMatch * 0.10;

    return {
      eventId: event.id,
      totalScore,
      breakdown: scores,
      promotionalSlot: this.determinePromotionalSlot(event)
    };
  }

  // Calculate user preference alignment (30% weight)
  private calculateUserPreferenceScore(event: any): number {
    let score = 0;
    let factors = 0;

    // Category preference
    if (this.userPreferences.favoriteCategories.includes(event.category)) {
      score += 100;
      factors++;
    } else {
      score += 50; // Neutral if not in favorites
      factors++;
    }

    // Language preference
    if (this.userPreferences.preferredLanguages.includes(event.language)) {
      score += 100;
      factors++;
    } else if (this.userPreferences.preferredLanguages.length === 0) {
      score += 75; // No preference set
      factors++;
    }

    // Day of week preference
    const eventDate = new Date(event.date);
    const dayOfWeek = eventDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
    if (this.userPreferences.preferredDays.includes(dayOfWeek)) {
      score += 100;
      factors++;
    }

    // Time of day preference
    const eventHour = new Date(event.date).getHours();
    const timeOfDay = eventHour < 12 ? 'morning' : eventHour < 17 ? 'afternoon' : 'evening';
    if (this.userPreferences.preferredTimes.includes(timeOfDay)) {
      score += 100;
      factors++;
    }

    return factors > 0 ? score / factors : 50; // Return average score
  }

  // Calculate trending velocity (25% weight)
  private calculateTrendingScore(event: any): number {
    const baseScore = 50;
    let score = baseScore;

    // Recent views velocity
    const viewsLastHour = event.viewsLastHour || 0;
    const viewsLastDay = event.viewsLastDay || 0;
    const viewsLastWeek = event.viewsLastWeek || 0;

    // Calculate velocity (acceleration of views)
    if (viewsLastDay > 0) {
      const hourlyVelocity = viewsLastHour / (viewsLastDay / 24);
      if (hourlyVelocity > 2) score += 30; // Accelerating rapidly
      else if (hourlyVelocity > 1.5) score += 20;
      else if (hourlyVelocity > 1) score += 10;
    }

    // Booking velocity
    const spotsBookedLastHour = event.spotsBookedLastHour || 0;
    if (spotsBookedLastHour > 5) score += 20;
    else if (spotsBookedLastHour > 2) score += 10;

    // Social signals
    const shares = event.recentShares || 0;
    const bookmarks = event.recentBookmarks || 0;
    score += Math.min(shares * 2, 20); // Max 20 points from shares
    score += Math.min(bookmarks, 10); // Max 10 points from bookmarks

    return Math.min(score, 100); // Cap at 100
  }

  // Calculate time proximity (20% weight)
  private calculateTimeProximityScore(event: any): number {
    const now = new Date();
    const eventDate = new Date(event.date);
    const hoursUntilEvent = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (hoursUntilEvent < 0) return 0; // Past event
    if (hoursUntilEvent < 24) return 100; // Within 24 hours
    if (hoursUntilEvent < 48) return 90; // Within 2 days
    if (hoursUntilEvent < 72) return 80; // Within 3 days
    if (hoursUntilEvent < 168) return 70; // Within a week
    if (hoursUntilEvent < 336) return 50; // Within 2 weeks
    if (hoursUntilEvent < 720) return 30; // Within a month
    return 10; // More than a month away
  }

  // Calculate creator following score (15% weight)
  private calculateCreatorFollowingScore(event: any): number {
    // Check if user follows this creator
    if (this.userPreferences.favoriteCreators.includes(event.creator.id)) {
      return 100;
    }

    // Check creator popularity
    const followerCount = event.creator.followers || 0;
    if (followerCount > 10000) return 60;
    if (followerCount > 5000) return 50;
    if (followerCount > 1000) return 40;
    if (followerCount > 500) return 30;
    return 20;
  }

  // Calculate price match score (10% weight)
  private calculatePriceMatchScore(event: any): number {
    const { min, max } = this.userPreferences.priceRange;
    const eventPrice = event.price;

    if (eventPrice >= min && eventPrice <= max) {
      // Perfect match - calculate how centered it is in the range
      const rangeCenter = (min + max) / 2;
      const deviation = Math.abs(eventPrice - rangeCenter) / ((max - min) / 2);
      return 100 - (deviation * 20); // Slightly penalize edges of range
    }

    // Outside preferred range
    if (eventPrice < min) {
      // Below range - might still be acceptable
      const percentBelow = ((min - eventPrice) / min) * 100;
      return Math.max(70 - percentBelow, 30); // Min 30 points if below range
    } else {
      // Above range - less acceptable
      const percentAbove = ((eventPrice - max) / max) * 100;
      return Math.max(50 - percentAbove * 2, 0); // Penalize more heavily
    }
  }

  // Determine promotional slot
  private determinePromotionalSlot(event: any): EventDiscoveryScore['promotionalSlot'] | undefined {
    if (event.isFeatured) return 'featured';
    if (event.isStaffPick) return 'staff_pick';
    if (event.isCommunityChoice) return 'community_choice';
    if (event.creator.isNew && event.creator.eventsHosted < 3) return 'new_creator';
    
    // Last chance - event starting soon with spots available
    const hoursUntilEvent = (new Date(event.date).getTime() - new Date().getTime()) / (1000 * 60 * 60);
    if (hoursUntilEvent < 24 && hoursUntilEvent > 0 && event.spotsRemaining > 0) {
      return 'last_chance';
    }
    
    return undefined;
  }

  // Sort events by score and promotional priority
  sortEvents(events: any[]): any[] {
    const scoredEvents = events.map(event => ({
      event,
      score: this.calculateRelevanceScore(event)
    }));

    return scoredEvents.sort((a, b) => {
      // Promotional slots get priority
      if (a.score.promotionalSlot && !b.score.promotionalSlot) return -1;
      if (!a.score.promotionalSlot && b.score.promotionalSlot) return 1;
      
      // Within promotional slots, maintain this order
      const slotPriority = {
        'featured': 5,
        'staff_pick': 4,
        'community_choice': 3,
        'new_creator': 2,
        'last_chance': 1
      };
      
      if (a.score.promotionalSlot && b.score.promotionalSlot) {
        const aPriority = slotPriority[a.score.promotionalSlot] || 0;
        const bPriority = slotPriority[b.score.promotionalSlot] || 0;
        if (aPriority !== bPriority) return bPriority - aPriority;
      }
      
      // Sort by total score
      return b.score.totalScore - a.score.totalScore;
    }).map(item => item.event);
  }

  // Get personalized recommendations
  getRecommendations(events: any[], limit: number = 20): any[] {
    const sorted = this.sortEvents(events);
    return sorted.slice(0, limit);
  }

  // Get events by promotional slot
  getPromotionalEvents(events: any[], slot: EventDiscoveryScore['promotionalSlot']): any[] {
    return events.filter(event => {
      const score = this.calculateRelevanceScore(event);
      return score.promotionalSlot === slot;
    });
  }
}