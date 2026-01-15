import { useState, useMemo } from "react";
import { ChatInterface } from "@/components/ChatInterface";
import { EnhancedOpportunityCard } from "@/components/EnhancedOpportunityCard";
import { FilterBar } from "@/components/FilterBar";
import { StatsBar } from "@/components/StatsBar";
import { ProfileForm } from "@/components/ProfileForm";
import { KanbanBoard } from "@/components/KanbanBoard";
import { DiscoverPanel } from "@/components/DiscoverPanel";
import { useGrantStore } from "@/hooks/useGrantStore";
import { Shield, Sparkles, LayoutDashboard, Search, User, Kanban } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
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
    // Sort by match score if available
    return filtered.sort((a, b) => {
      const matchA = matchResults.find(m => m.id === a.id)?.score || 0;
      const matchB = matchResults.find(m => m.id === b.id)?.score || 0;
      return matchB - matchA;
    });
  }, [searchQuery, activeFilter, allOpportunities, matchResults]);

  return (
    <div className="min-h-screen bg-background cyber-grid">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center glow-primary">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">Grant AI</h1>
                <p className="text-xs text-muted-foreground">Smart Grant Discovery & Management</p>
              </div>
            </div>
            <Button variant="glow" className="hidden lg:flex" onClick={() => setIsChatOpen(!isChatOpen)}>
              <Sparkles className="w-4 h-4 mr-2" />AI Assistant
            </Button>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="glow" size="icon" className="lg:hidden">
                  <Sparkles className="w-4 h-4" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-full sm:w-96 p-0">
                <ChatInterface />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          <main className={`flex-1 space-y-6 transition-all ${isChatOpen ? "lg:mr-96" : ""}`}>
            <Tabs defaultValue="discover" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4 max-w-lg">
                <TabsTrigger value="discover"><Search className="w-4 h-4 mr-2" />Discover</TabsTrigger>
                <TabsTrigger value="tracker"><Kanban className="w-4 h-4 mr-2" />Tracker</TabsTrigger>
                <TabsTrigger value="profile"><User className="w-4 h-4 mr-2" />Profile</TabsTrigger>
                <TabsTrigger value="dashboard"><LayoutDashboard className="w-4 h-4 mr-2" />Stats</TabsTrigger>
              </TabsList>

              <TabsContent value="discover" className="space-y-6">
                <DiscoverPanel onScrape={scrapeNewGrants} isScraping={isScraping} scrapedCount={scrapedGrants.length} />
                <StatsBar />
                <FilterBar searchQuery={searchQuery} onSearchChange={setSearchQuery} activeFilter={activeFilter} onFilterChange={setActiveFilter} />
                <p className="text-sm text-muted-foreground">
                  Showing <span className="font-medium text-foreground">{filteredOpportunities.length}</span> opportunities
                  {matchResults.length > 0 && <span className="text-primary"> • Sorted by match score</span>}
                </p>
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
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
              </TabsContent>

              <TabsContent value="tracker">
                <KanbanBoard
                  trackedGrants={trackedGrants}
                  getOpportunity={(id) => allOpportunities.find(o => o.id === id)}
                  onUpdateStatus={updateTrackedStatus}
                  onRemove={removeTracked}
                />
              </TabsContent>

              <TabsContent value="profile">
                <ProfileForm profile={profile} onUpdate={setProfile} onRunMatch={runAIMatching} isMatching={isMatching} />
              </TabsContent>

              <TabsContent value="dashboard">
                <StatsBar />
                <div className="glass-card p-6 mt-6">
                  <h3 className="font-semibold mb-4">Tracking Summary</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div><p className="text-2xl font-bold text-info">{trackedGrants.length}</p><p className="text-xs text-muted-foreground">Tracked</p></div>
                    <div><p className="text-2xl font-bold text-primary">{bookmarks.length}</p><p className="text-xs text-muted-foreground">Bookmarked</p></div>
                    <div><p className="text-2xl font-bold text-warning">{trackedGrants.filter(t => t.status === 'submitted').length}</p><p className="text-xs text-muted-foreground">Submitted</p></div>
                    <div><p className="text-2xl font-bold text-success">{trackedGrants.filter(t => t.status === 'awarded').length}</p><p className="text-xs text-muted-foreground">Awarded</p></div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </main>

          {isChatOpen && (
            <aside className="hidden lg:block fixed right-0 top-[73px] w-96 h-[calc(100vh-73px)] border-l border-border bg-background/95 backdrop-blur-xl">
              <ChatInterface />
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
