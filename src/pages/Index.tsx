import { useState, useMemo } from "react";
import { ChatInterface } from "@/components/ChatInterface";
import { EnhancedOpportunityCard } from "@/components/EnhancedOpportunityCard";
import { KanbanBoard } from "@/components/KanbanBoard";
import { Onboarding } from "@/components/Onboarding";
import { useGrantStore } from "@/hooks/useGrantStore";
import { Search, Kanban, MessageSquare, X, Settings, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { UserProfile } from "@/types/grant";

const Index = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"home" | "tracker">("home");
  const [isChatOpen, setIsChatOpen] = useState(false);
  
  const {
    profile, setProfile,
    trackedGrants, trackGrant, updateTrackedStatus, removeTracked,
    bookmarks, toggleBookmark,
    matchResults, isMatching, runAIMatching,
    getAllOpportunities, getOpportunityWithMatch,
  } = useGrantStore();

  // Check if user has completed onboarding
  const hasCompletedOnboarding = profile.businessName.trim().length > 0;

  const allOpportunities = getAllOpportunities();

  // Get top matched opportunities for home
  const topOpportunities = useMemo(() => {
    return [...allOpportunities]
      .sort((a, b) => {
        const matchA = matchResults.find(m => m.id === a.id)?.score || 50;
        const matchB = matchResults.find(m => m.id === b.id)?.score || 50;
        return matchB - matchA;
      })
      .slice(0, 9);
  }, [allOpportunities, matchResults]);

  const handleOnboardingComplete = async (completedProfile: UserProfile) => {
    setProfile(completedProfile);
    // Automatically run AI matching after onboarding
    setTimeout(() => {
      runAIMatching();
    }, 500);
  };

  // Show onboarding if not completed
  if (!hasCompletedOnboarding) {
    return <Onboarding onComplete={handleOnboardingComplete} />;
  }

  const tabs = [
    { id: "home" as const, label: "For You", icon: Search },
    { id: "tracker" as const, label: "Tracker", icon: Kanban },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Grant AI</h1>
          <div className="flex items-center gap-2">
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
          {activeTab === "home" && (
            <>
              {/* Profile Summary */}
              <div className="flex items-center justify-between p-4 rounded-lg bg-secondary/50">
                <div>
                  <p className="font-medium">{profile.businessName}</p>
                  <p className="text-sm text-muted-foreground">
                    {profile.businessType} · {profile.location.state} · {profile.stage}
                  </p>
                </div>
                <Button variant="ghost" size="sm" onClick={() => navigate("/discover")} className="gap-2">
                  <Settings className="w-4 h-4" />
                  Edit Profile
                </Button>
              </div>

              {/* AI Matching Status */}
              {isMatching && (
                <div className="flex items-center gap-3 p-4 rounded-lg border border-border">
                  <Loader2 className="w-5 h-5 animate-spin text-muted-foreground" />
                  <div>
                    <p className="font-medium">Finding your best matches...</p>
                    <p className="text-sm text-muted-foreground">Analyzing grants based on your profile</p>
                  </div>
                </div>
              )}

              {/* Recommended Grants */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg font-semibold">Recommended for You</h2>
                  <Button variant="ghost" size="sm" onClick={() => navigate("/discover")}>
                    View All →
                  </Button>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {topOpportunities.map((opp) => {
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

              {/* Discover More CTA */}
              <div className="text-center py-8">
                <Button onClick={() => navigate("/discover")} size="lg" className="gap-2">
                  <Search className="w-4 h-4" />
                  Discover More Grants
                </Button>
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
