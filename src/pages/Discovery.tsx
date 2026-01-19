import { useState, useMemo } from "react";
import { EnhancedOpportunityCard } from "@/components/EnhancedOpportunityCard";
import { FilterBar } from "@/components/FilterBar";
import { DiscoverPanel } from "@/components/DiscoverPanel";
import { useGrantStore } from "@/hooks/useGrantStore";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Discovery = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  
  const {
    trackGrant,
    bookmarks, toggleBookmark,
    matchResults,
    scrapedGrants, isScraping, scrapeNewGrants,
    getAllOpportunities, getOpportunityWithMatch,
  } = useGrantStore();

  const allOpportunities = getAllOpportunities();

  const filteredOpportunities = useMemo(() => {
    let filtered = allOpportunities;
    if (activeFilter !== "all") {
      filtered = filtered.filter((o) => o.type === activeFilter);
    }
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.name.toLowerCase().includes(query) ||
          o.organization?.toLowerCase().includes(query) ||
          o.focus?.toLowerCase().includes(query)
      );
    }
    return filtered.sort((a, b) => {
      const matchA = matchResults.find(m => m.id === a.id)?.score || 0;
      const matchB = matchResults.find(m => m.id === b.id)?.score || 0;
      return matchB - matchA;
    });
  }, [searchQuery, activeFilter, allOpportunities, matchResults]);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/")}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <h1 className="text-lg font-semibold">Discover Grants</h1>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
        <DiscoverPanel 
          onScrape={scrapeNewGrants} 
          isScraping={isScraping} 
          scrapedCount={scrapedGrants.length} 
        />
        
        <FilterBar 
          searchQuery={searchQuery} 
          onSearchChange={setSearchQuery} 
          activeFilter={activeFilter} 
          onFilterChange={setActiveFilter} 
        />

        <p className="text-sm text-muted-foreground">
          {filteredOpportunities.length} opportunities
          {matchResults.length > 0 && " · sorted by match"}
        </p>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filteredOpportunities.map((opp) => {
            const { match, tracked, isBookmarked } = getOpportunityWithMatch(opp.id);
            return (
              <EnhancedOpportunityCard
                key={opp.id}
                opportunity={opp}
                match={match}
                tracked={tracked}
                isBookmarked={isBookmarked}
                onToggleBookmark={() => toggleBookmark(opp.id)}
                onTrack={() => trackGrant(opp.id)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Discovery;
