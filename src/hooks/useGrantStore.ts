import { useState, useEffect, useCallback } from 'react';
import { UserProfile, TrackedGrant, MatchResult } from '@/types/grant';
import { allOpportunities, Opportunity } from '@/data/opportunities';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const STORAGE_KEYS = {
  profile: 'grantai_profile',
  tracked: 'grantai_tracked',
  bookmarks: 'grantai_bookmarks',
};

const defaultProfile: UserProfile = {
  id: 'user-1',
  businessName: '',
  businessType: 'tech',
  location: { city: 'Kalyan', state: 'Maharashtra', country: 'India' },
  stage: 'idea',
  registrations: {},
  focusAreas: ['AI', 'Cybersecurity'],
};

export function useGrantStore() {
  const [profile, setProfileState] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.profile);
    return saved ? JSON.parse(saved) : defaultProfile;
  });

  const [trackedGrants, setTrackedGrantsState] = useState<TrackedGrant[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.tracked);
    return saved ? JSON.parse(saved) : [];
  });

  const [bookmarks, setBookmarksState] = useState<string[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.bookmarks);
    return saved ? JSON.parse(saved) : [];
  });

  const [matchResults, setMatchResults] = useState<MatchResult[]>([]);
  const [isMatching, setIsMatching] = useState(false);
  const [scrapedGrants, setScrapedGrants] = useState<Opportunity[]>([]);
  const [isScraping, setIsScraping] = useState(false);

  // Persist to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.profile, JSON.stringify(profile));
  }, [profile]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.tracked, JSON.stringify(trackedGrants));
  }, [trackedGrants]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.bookmarks, JSON.stringify(bookmarks));
  }, [bookmarks]);

  const setProfile = useCallback((updates: Partial<UserProfile>) => {
    setProfileState(prev => ({ ...prev, ...updates }));
  }, []);

  const toggleBookmark = useCallback((opportunityId: string) => {
    setBookmarksState(prev => {
      if (prev.includes(opportunityId)) {
        toast.info('Removed from bookmarks');
        return prev.filter(id => id !== opportunityId);
      } else {
        toast.success('Added to bookmarks');
        return [...prev, opportunityId];
      }
    });
  }, []);

  const trackGrant = useCallback((opportunityId: string, status: TrackedGrant['status'] = 'interested') => {
    setTrackedGrantsState(prev => {
      const existing = prev.find(g => g.opportunityId === opportunityId);
      if (existing) {
        toast.info(`Already tracking: ${status}`);
        return prev;
      }
      toast.success('Added to tracking board');
      return [...prev, {
        id: `tracked-${Date.now()}`,
        opportunityId,
        status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }];
    });
  }, []);

  const updateTrackedStatus = useCallback((trackedId: string, status: TrackedGrant['status']) => {
    setTrackedGrantsState(prev => prev.map(g => 
      g.id === trackedId 
        ? { ...g, status, updatedAt: new Date().toISOString() }
        : g
    ));
  }, []);

  const removeTracked = useCallback((trackedId: string) => {
    setTrackedGrantsState(prev => prev.filter(g => g.id !== trackedId));
    toast.info('Removed from tracking');
  }, []);

  const runAIMatching = useCallback(async () => {
    if (!profile.businessName) {
      toast.error('Please complete your profile first');
      return;
    }

    setIsMatching(true);
    try {
      const { data, error } = await supabase.functions.invoke('ai-match', {
        body: { 
          profile, 
          opportunities: allOpportunities.slice(0, 20) 
        },
      });

      if (error) throw error;
      
      const matches = data.matches || [];
      setMatchResults(matches);
      
      // Update tracked grants with eligibility scores
      setTrackedGrantsState(prev => prev.map(g => {
        const match = matches.find((m: MatchResult) => m.id === g.opportunityId);
        if (match) {
          return {
            ...g,
            eligibilityScore: match.score,
            matchReasons: match.reasons,
            gaps: match.gaps,
            updatedAt: new Date().toISOString(),
          };
        }
        return g;
      }));

      toast.success(`Analyzed ${matches.length} opportunities`);
    } catch (error) {
      console.error('Matching error:', error);
      toast.error('Failed to run AI matching');
    } finally {
      setIsMatching(false);
    }
  }, [profile]);

  const scrapeNewGrants = useCallback(async (query?: string) => {
    setIsScraping(true);
    try {
      const { data, error } = await supabase.functions.invoke('scrape-grants', {
        body: { query: query || `grants for ${profile.businessType} startups ${profile.location.state} India` },
      });

      if (error) throw error;

      const newGrants: Opportunity[] = (data.grants || []).map((g: any) => ({
        ...g,
        type: g.type || 'grant',
      }));

      setScrapedGrants(prev => [...prev, ...newGrants]);
      
      if (data.message) {
        toast.success(data.message);
      }

      return newGrants;
    } catch (error) {
      console.error('Scrape error:', error);
      toast.error('Failed to discover new grants');
      return [];
    } finally {
      setIsScraping(false);
    }
  }, [profile]);

  const getAllOpportunities = useCallback(() => {
    return [...allOpportunities, ...scrapedGrants];
  }, [scrapedGrants]);

  const getOpportunityWithMatch = useCallback((opportunityId: string) => {
    const opportunity = getAllOpportunities().find(o => o.id === opportunityId);
    const match = matchResults.find(m => m.id === opportunityId);
    const tracked = trackedGrants.find(t => t.opportunityId === opportunityId);
    const isBookmarked = bookmarks.includes(opportunityId);
    
    return { opportunity, match, tracked, isBookmarked };
  }, [getAllOpportunities, matchResults, trackedGrants, bookmarks]);

  return {
    profile,
    setProfile,
    trackedGrants,
    trackGrant,
    updateTrackedStatus,
    removeTracked,
    bookmarks,
    toggleBookmark,
    matchResults,
    isMatching,
    runAIMatching,
    scrapedGrants,
    isScraping,
    scrapeNewGrants,
    getAllOpportunities,
    getOpportunityWithMatch,
  };
}
