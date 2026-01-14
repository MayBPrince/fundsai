import { useState, useMemo } from "react";
import { ChatInterface } from "@/components/ChatInterface";
import { OpportunityCard } from "@/components/OpportunityCard";
import { FilterBar } from "@/components/FilterBar";
import { StatsBar } from "@/components/StatsBar";
import { allOpportunities, Opportunity } from "@/data/opportunities";
import { Shield, Sparkles, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [isChatOpen, setIsChatOpen] = useState(false);

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
          o.focus?.toLowerCase().includes(query) ||
          o.features?.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, activeFilter]);

  return (
    <div className="min-h-screen bg-background cyber-grid">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center glow-primary">
                <Shield className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">GrantAI</h1>
                <p className="text-xs text-muted-foreground">Equity Hackathon Manager</p>
              </div>
            </div>

            {/* Desktop chat toggle */}
            <Button
              variant="glow"
              className="hidden lg:flex items-center gap-2"
              onClick={() => setIsChatOpen(!isChatOpen)}
            >
              <Sparkles className="w-4 h-4" />
              AI Assistant
            </Button>

            {/* Mobile chat toggle */}
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
          {/* Main Content */}
          <main className={`flex-1 space-y-6 transition-all duration-300 ${isChatOpen ? "lg:mr-96" : ""}`}>
            {/* Hero Section */}
            <div className="glass-card p-6 md:p-8">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
                Find Your Next <span className="gradient-text">Funding Opportunity</span>
              </h2>
              <p className="text-muted-foreground max-w-2xl">
                AI-powered discovery of cybersecurity grants, hackathons, and accelerator programs. 
                Ask our AI assistant for personalized recommendations.
              </p>
            </div>

            {/* Stats */}
            <StatsBar />

            {/* Filters */}
            <FilterBar
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              activeFilter={activeFilter}
              onFilterChange={setActiveFilter}
            />

            {/* Results count */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-medium text-foreground">{filteredOpportunities.length}</span> opportunities
              </p>
            </div>

            {/* Opportunities Grid */}
            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredOpportunities.map((opportunity) => (
                <OpportunityCard key={opportunity.id} opportunity={opportunity} />
              ))}
            </div>

            {filteredOpportunities.length === 0 && (
              <div className="text-center py-12">
                <p className="text-muted-foreground">No opportunities found matching your criteria.</p>
              </div>
            )}
          </main>

          {/* Desktop Chat Sidebar */}
          {isChatOpen && (
            <aside className="hidden lg:block fixed right-0 top-[73px] w-96 h-[calc(100vh-73px)] border-l border-border bg-background/95 backdrop-blur-xl animate-slide-in">
              <ChatInterface />
            </aside>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
