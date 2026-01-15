import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Globe, Loader2, RefreshCw, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface DiscoverPanelProps {
  onScrape: (query?: string) => Promise<any>;
  isScraping: boolean;
  scrapedCount: number;
}

const SUGGESTED_QUERIES = [
  "MSME grants Maharashtra 2025",
  "Startup India seed fund scheme",
  "Technology startup grants India",
  "Construction industry funding",
  "AI cybersecurity grants",
];

export function DiscoverPanel({ onScrape, isScraping, scrapedCount }: DiscoverPanelProps) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onScrape(query || undefined);
  };

  return (
    <div className="glass-card p-6 space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl gradient-accent flex items-center justify-center">
          <Globe className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h2 className="font-semibold text-foreground">Discover New Grants</h2>
          <p className="text-xs text-muted-foreground">AI-powered web search for opportunities</p>
        </div>
        {scrapedCount > 0 && (
          <Badge variant="secondary" className="ml-auto">
            <Sparkles className="w-3 h-3 mr-1" />
            {scrapedCount} discovered
          </Badge>
        )}
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for grants (e.g., 'MSME technology grants')"
            className="pl-10 bg-secondary"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button 
          onClick={handleSearch} 
          variant="glow"
          disabled={isScraping}
        >
          {isScraping ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <RefreshCw className="w-4 h-4" />
          )}
          <span className="ml-2 hidden sm:inline">
            {isScraping ? 'Searching...' : 'Search Web'}
          </span>
        </Button>
      </div>

      <div className="space-y-2">
        <p className="text-xs text-muted-foreground">Suggested searches:</p>
        <div className="flex flex-wrap gap-2">
          {SUGGESTED_QUERIES.map((q) => (
            <button
              key={q}
              onClick={() => {
                setQuery(q);
                onScrape(q);
              }}
              disabled={isScraping}
              className="text-xs px-3 py-1.5 rounded-full bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors disabled:opacity-50"
            >
              {q}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
