import { useState, useMemo } from "react";
import { ChatInterface } from "@/components/ChatInterface";
import { EnhancedOpportunityCard } from "@/components/EnhancedOpportunityCard";
import { FilterBar } from "@/components/FilterBar";
import { ProfileForm } from "@/components/ProfileForm";
import { KanbanBoard } from "@/components/KanbanBoard";
import { DiscoverPanel } from "@/components/DiscoverPanel";
import { useGrantStore } from "@/hooks/useGrantStore";
import { Search, Kanban, User, MessageSquare, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeTab, setActiveTab] = useState<"discover" | "tracker" | "profile">("discover");
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const {
    profile, setProfile,
    trackedGrants, trackGrant, updateTrackedStatus, removeTracked,
    bookmarks, toggleBookmark,
    matchResults, isMatching, runAIMatching,
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

  const tabs = [
    { id: "discover" as const, label: "Discover", icon: Search },
    { id: "tracker" as const, label: "Tracker", icon: Kanban },
    { id: "profile" as const, label: "Profile", icon: User },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Grant AI</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsChatOpen(!isChatOpen)}
            className="gap-2"
          >
            <MessageSquare className="w-4 h-4" />
            <span className="hidden sm:inline">Ask AI</span>
          </Button>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Tab Navigation */}
        <nav className="flex gap-1 mb-6 border-b border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px ${
                activeTab === tab.id
                  ? "border-foreground text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
              {tab.id === "tracker" && trackedGrants.length > 0 && (
                <span className="text-xs bg-secondary px-1.5 py-0.5 rounded">
                  {trackedGrants.length}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* Content */}
        <main className="space-y-6">
          {activeTab === "discover" && (
            <>
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
            </>
          )}

          {activeTab === "tracker" && (
            <KanbanBoard
              trackedGrants={trackedGrants}
              getOpportunity={(id) => allOpportunities.find(o => o.id === id)}
              onUpdateStatus={updateTrackedStatus}
              onRemove={removeTracked}
            />
          )}

          {activeTab === "profile" && (
            <ProfileForm 
              profile={profile} 
              onUpdate={setProfile} 
              onRunMatch={runAIMatching} 
              isMatching={isMatching} 
            />
          )}
        </main>
      </div>

      {/* Chat Slide-over */}
      {isChatOpen && (
        <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-background border-l border-border z-50 flex flex-col">
          <div className="flex items-center justify-between px-4 h-14 border-b border-border">
            <span className="font-medium">AI Assistant</span>
            <Button variant="ghost" size="icon" onClick={() => setIsChatOpen(false)}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <ChatInterface />
        </div>
      )}
    </div>
  );
};

export default Index;
