import { useState } from "react";
import { Opportunity } from "@/data/opportunities";
import { MatchResult, TrackedGrant } from "@/types/grant";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  DollarSign, 
  Building2,
  Bookmark,
  BookmarkCheck,
  Plus,
  Check,
  ArrowUpRight
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface EnhancedOpportunityCardProps {
  opportunity: Opportunity;
  match?: MatchResult;
  tracked?: TrackedGrant;
  isBookmarked: boolean;
  onToggleBookmark: () => void;
  onTrack: () => void;
}

const typeLabels: Record<Opportunity['type'], string> = {
  grant: "Grant",
  hackathon: "Hackathon",
  accelerator: "Accelerator",
  program: "Program",
};

export function EnhancedOpportunityCard({ 
  opportunity, 
  match, 
  tracked,
  isBookmarked,
  onToggleBookmark,
  onTrack
}: EnhancedOpportunityCardProps) {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <>
      <div 
        className="notion-card p-4 cursor-pointer group animate-fade-in"
        onClick={() => setShowDetails(true)}
      >
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-medium text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {opportunity.name}
          </h3>
          {match && (
            <span className={`text-xs font-medium px-2 py-0.5 rounded ${
              match.score >= 80 ? 'bg-green-100 text-green-700' :
              match.score >= 60 ? 'bg-yellow-100 text-yellow-700' :
              'bg-gray-100 text-gray-600'
            }`}>
              {match.score}%
            </span>
          )}
        </div>
        
        <div className="space-y-1.5 text-sm text-muted-foreground mb-3">
          {opportunity.organization && (
            <div className="flex items-center gap-2">
              <Building2 className="w-3.5 h-3.5" />
              <span className="truncate">{opportunity.organization}</span>
            </div>
          )}
          {opportunity.amount && (
            <div className="flex items-center gap-2">
              <DollarSign className="w-3.5 h-3.5 text-success" />
              <span className="text-success font-medium">{opportunity.amount}</span>
            </div>
          )}
          {opportunity.deadline && (
            <div className="flex items-center gap-2">
              <Calendar className="w-3.5 h-3.5" />
              <span>{opportunity.deadline}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-border">
          <span className="text-xs text-muted-foreground">
            {typeLabels[opportunity.type]}
          </span>
          <div className="flex items-center gap-1">
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={(e) => {
                e.stopPropagation();
                onToggleBookmark();
              }}
            >
              {isBookmarked ? (
                <BookmarkCheck className="w-4 h-4 text-foreground" />
              ) : (
                <Bookmark className="w-4 h-4" />
              )}
            </Button>
            {!tracked ? (
              <Button
                size="sm"
                variant="secondary"
                className="h-7 text-xs"
                onClick={(e) => {
                  e.stopPropagation();
                  onTrack();
                }}
              >
                <Plus className="w-3 h-3 mr-1" />
                Track
              </Button>
            ) : (
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Check className="w-3 h-3" />
                Tracking
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="pr-8">{opportunity.name}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Match Score */}
            {match && (
              <div className={`p-3 rounded-lg ${
                match.score >= 80 ? 'bg-green-50 border border-green-200' :
                match.score >= 60 ? 'bg-yellow-50 border border-yellow-200' :
                'bg-gray-50 border border-gray-200'
              }`}>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-lg font-semibold ${
                    match.score >= 80 ? 'text-green-700' :
                    match.score >= 60 ? 'text-yellow-700' :
                    'text-gray-700'
                  }`}>
                    {match.score}% Match
                  </span>
                </div>
                {match.reasons.length > 0 && (
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {match.reasons.slice(0, 3).map((reason, i) => (
                      <li key={i}>✓ {reason}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* Details */}
            <div className="grid gap-3 text-sm">
              {opportunity.organization && (
                <div>
                  <span className="text-muted-foreground">Organization</span>
                  <p className="font-medium">{opportunity.organization}</p>
                </div>
              )}
              {opportunity.amount && (
                <div>
                  <span className="text-muted-foreground">Amount</span>
                  <p className="font-medium text-success">{opportunity.amount}</p>
                </div>
              )}
              {opportunity.deadline && (
                <div>
                  <span className="text-muted-foreground">Deadline</span>
                  <p className="font-medium">{opportunity.deadline}</p>
                </div>
              )}
              {opportunity.focus && (
                <div>
                  <span className="text-muted-foreground">Focus</span>
                  <p>{opportunity.focus}</p>
                </div>
              )}
              {opportunity.eligibility && (
                <div>
                  <span className="text-muted-foreground">Eligibility</span>
                  <p>{opportunity.eligibility}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => onToggleBookmark()}
              >
                {isBookmarked ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 mr-2" />
                    Saved
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4 mr-2" />
                    Save
                  </>
                )}
              </Button>
              {!tracked ? (
                <Button className="flex-1" onClick={onTrack}>
                  <Plus className="w-4 h-4 mr-2" />
                  Start Tracking
                </Button>
              ) : (
                <Button variant="secondary" className="flex-1" disabled>
                  <Check className="w-4 h-4 mr-2" />
                  Tracking
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
