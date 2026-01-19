import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  activeFilter: string;
  onFilterChange: (filter: string) => void;
}

const FILTERS = [
  { id: "all", label: "All" },
  { id: "grant", label: "Grants" },
  { id: "hackathon", label: "Hackathons" },
  { id: "accelerator", label: "Accelerators" },
  { id: "program", label: "Programs" },
];

export function FilterBar({ searchQuery, onSearchChange, activeFilter, onFilterChange }: FilterBarProps) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Filter opportunities..."
          className="pl-9"
        />
      </div>
      
      <div className="flex flex-wrap gap-1">
        {FILTERS.map((filter) => (
          <button
            key={filter.id}
            onClick={() => onFilterChange(filter.id)}
            className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
              activeFilter === filter.id
                ? "bg-foreground text-background"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
}
