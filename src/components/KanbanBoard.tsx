import { useState } from "react";
import { TrackedGrant, KANBAN_COLUMNS } from "@/types/grant";
import { Opportunity } from "@/data/opportunities";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  GripVertical, 
  Trash2, 
  ExternalLink, 
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronLeft,
  ChevronRight
} from "lucide-react";

interface KanbanBoardProps {
  trackedGrants: TrackedGrant[];
  getOpportunity: (id: string) => Opportunity | undefined;
  onUpdateStatus: (trackedId: string, status: TrackedGrant['status']) => void;
  onRemove: (trackedId: string) => void;
}

export function KanbanBoard({ 
  trackedGrants, 
  getOpportunity, 
  onUpdateStatus, 
  onRemove 
}: KanbanBoardProps) {
  const [draggedItem, setDraggedItem] = useState<string | null>(null);

  const handleDragStart = (e: React.DragEvent, trackedId: string) => {
    setDraggedItem(trackedId);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, status: TrackedGrant['status']) => {
    e.preventDefault();
    if (draggedItem) {
      onUpdateStatus(draggedItem, status);
      setDraggedItem(null);
    }
  };

  const getGrantsForColumn = (status: TrackedGrant['status']) => {
    return trackedGrants.filter(g => g.status === status);
  };

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-muted-foreground';
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const moveToNextStatus = (tracked: TrackedGrant) => {
    const currentIndex = KANBAN_COLUMNS.findIndex(c => c.id === tracked.status);
    if (currentIndex < KANBAN_COLUMNS.length - 2) {
      onUpdateStatus(tracked.id, KANBAN_COLUMNS[currentIndex + 1].id);
    }
  };

  const moveToPrevStatus = (tracked: TrackedGrant) => {
    const currentIndex = KANBAN_COLUMNS.findIndex(c => c.id === tracked.status);
    if (currentIndex > 0) {
      onUpdateStatus(tracked.id, KANBAN_COLUMNS[currentIndex - 1].id);
    }
  };

  if (trackedGrants.length === 0) {
    return (
      <div className="glass-card p-8 text-center">
        <Clock className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold mb-2">No Tracked Grants Yet</h3>
        <p className="text-muted-foreground text-sm">
          Start tracking grants by clicking the "Track" button on any opportunity card.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold gradient-text">Application Tracker</h2>
        <Badge variant="outline">{trackedGrants.length} tracked</Badge>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin">
        {KANBAN_COLUMNS.map(column => {
          const columnGrants = getGrantsForColumn(column.id);
          
          return (
            <div
              key={column.id}
              className={`min-w-[280px] flex-shrink-0 rounded-xl border border-border ${column.color} p-3`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-sm">{column.title}</h3>
                <Badge variant="secondary" className="text-xs">
                  {columnGrants.length}
                </Badge>
              </div>

              <div className="space-y-2 min-h-[200px]">
                {columnGrants.map(tracked => {
                  const opportunity = getOpportunity(tracked.opportunityId);
                  if (!opportunity) return null;

                  return (
                    <div
                      key={tracked.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, tracked.id)}
                      className={`bg-card border border-border rounded-lg p-3 cursor-grab active:cursor-grabbing hover:border-primary/50 transition-all ${
                        draggedItem === tracked.id ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <GripVertical className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-sm line-clamp-2 mb-1">
                            {opportunity.name}
                          </h4>
                          
                          {tracked.eligibilityScore && (
                            <div className={`flex items-center gap-1 text-xs ${getScoreColor(tracked.eligibilityScore)}`}>
                              <TrendingUp className="w-3 h-3" />
                              {tracked.eligibilityScore}% match
                            </div>
                          )}

                          {tracked.gaps && tracked.gaps.length > 0 && (
                            <div className="flex items-center gap-1 text-xs text-warning mt-1">
                              <AlertTriangle className="w-3 h-3" />
                              {tracked.gaps.length} gap(s)
                            </div>
                          )}

                          {opportunity.amount && (
                            <p className="text-xs text-success mt-1">{opportunity.amount}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 mt-3 pt-2 border-t border-border">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => moveToPrevStatus(tracked)}
                          disabled={column.id === 'discovered'}
                        >
                          <ChevronLeft className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7"
                          onClick={() => moveToNextStatus(tracked)}
                          disabled={column.id === 'rejected' || column.id === 'awarded'}
                        >
                          <ChevronRight className="w-4 h-4" />
                        </Button>
                        <div className="flex-1" />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-7 w-7 text-destructive hover:text-destructive"
                          onClick={() => onRemove(tracked.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
