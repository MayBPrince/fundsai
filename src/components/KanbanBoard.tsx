import { useState } from "react";
import { TrackedGrant, KANBAN_COLUMNS } from "@/types/grant";
import { Opportunity } from "@/data/opportunities";
import { Button } from "@/components/ui/button";
import { 
  GripVertical, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  Inbox
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
      <div className="text-center py-16">
        <Inbox className="w-12 h-12 mx-auto mb-4 text-muted-foreground/50" />
        <h3 className="text-lg font-medium mb-2">No tracked grants</h3>
        <p className="text-sm text-muted-foreground">
          Start tracking grants from the Discover tab
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Application Tracker</h2>
        <span className="text-sm text-muted-foreground">{trackedGrants.length} tracked</span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-4">
        {KANBAN_COLUMNS.map(column => {
          const columnGrants = getGrantsForColumn(column.id);
          
          return (
            <div
              key={column.id}
              className="min-w-[260px] flex-shrink-0 bg-secondary/50 rounded-lg p-3"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, column.id)}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium">{column.title}</h3>
                <span className="text-xs text-muted-foreground bg-background px-2 py-0.5 rounded">
                  {columnGrants.length}
                </span>
              </div>

              <div className="space-y-2 min-h-[150px]">
                {columnGrants.map(tracked => {
                  const opportunity = getOpportunity(tracked.opportunityId);
                  if (!opportunity) return null;

                  return (
                    <div
                      key={tracked.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, tracked.id)}
                      className={`bg-background border border-border rounded-md p-3 cursor-grab active:cursor-grabbing hover:border-foreground/20 transition-colors ${
                        draggedItem === tracked.id ? 'opacity-50' : ''
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        <GripVertical className="w-4 h-4 text-muted-foreground shrink-0 mt-0.5" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium line-clamp-2 mb-1">
                            {opportunity.name}
                          </h4>
                          {tracked.eligibilityScore && (
                            <span className="text-xs text-muted-foreground">
                              {tracked.eligibilityScore}% match
                            </span>
                          )}
                          {opportunity.amount && (
                            <p className="text-xs text-success mt-1">{opportunity.amount}</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-1 mt-2 pt-2 border-t border-border">
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={() => moveToPrevStatus(tracked)}
                          disabled={column.id === 'discovered'}
                        >
                          <ChevronLeft className="w-3 h-3" />
                        </Button>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6"
                          onClick={() => moveToNextStatus(tracked)}
                          disabled={column.id === 'rejected' || column.id === 'awarded'}
                        >
                          <ChevronRight className="w-3 h-3" />
                        </Button>
                        <div className="flex-1" />
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-6 w-6 text-muted-foreground hover:text-destructive"
                          onClick={() => onRemove(tracked.id)}
                        >
                          <Trash2 className="w-3 h-3" />
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
