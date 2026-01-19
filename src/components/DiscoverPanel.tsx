import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Loader2 } from "lucide-react";

interface DiscoverPanelProps {
  onScrape: (query?: string) => Promise<any>;
  isScraping: boolean;
  scrapedCount: number;
}

const SUGGESTED_QUERIES = [
  "MSME grants Maharashtra",
  "Startup India fund",
  "Tech startup grants",
  "Construction funding",
];

export function DiscoverPanel({ onScrape, isScraping, scrapedCount }: DiscoverPanelProps) {
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    onScrape(query || undefined);
  };

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold mb-1">Find Grants</h2>
        <p className="text-sm text-muted-foreground">
          Search the web for new funding opportunities
          {scrapedCount > 0 && ` · ${scrapedCount} discovered`}
        </p>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search for grants..."
            className="pl-9"
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          />
        </div>
        <Button onClick={handleSearch} disabled={isScraping}>
          {isScraping ? <Loader2 className="w-4 h-4 animate-spin" /> : "Search"}
        </Button>
      </div>

      <div className="flex flex-wrap gap-2">
        {SUGGESTED_QUERIES.map((q) => (
          <button
            key={q}
            onClick={() => {
              setQuery(q);
              onScrape(q);
            }}
            disabled={isScraping}
            className="text-sm px-3 py-1.5 rounded-md bg-secondary hover:bg-secondary/80 text-secondary-foreground transition-colors disabled:opacity-50"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
