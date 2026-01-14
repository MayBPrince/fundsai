import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, SlidersHorizontal } from "lucide-react";

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
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search opportunities..."
          className="pl-10 bg-secondary border-border"
        />
      </div>
      
      <div className="flex items-center gap-2 flex-wrap">
        <SlidersHorizontal className="w-4 h-4 text-muted-foreground" />
        {FILTERS.map((filter) => (
          <Button
            key={filter.id}
            variant={activeFilter === filter.id ? "default" : "outline"}
            size="sm"
            onClick={() => onFilterChange(filter.id)}
            className="text-xs"
          >
            {filter.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
