import { useState } from "react";
import { Opportunity } from "@/data/opportunities";
import { MatchResult, TrackedGrant } from "@/types/grant";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar, 
  DollarSign, 
  MapPin, 
  Target, 
  Users,
  Bookmark,
  BookmarkCheck,
  Plus,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  ExternalLink,
  Sparkles
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

const typeVariantMap: Record<Opportunity['type'], "grant" | "hackathon" | "accelerator" | "program"> = {
  grant: "grant",
  hackathon: "hackathon",
  accelerator: "accelerator",
  program: "program",
};

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

  const getScoreColor = (score?: number) => {
    if (!score) return 'text-muted-foreground';
    if (score >= 80) return 'text-success';
    if (score >= 60) return 'text-warning';
    return 'text-destructive';
  };

  const getScoreBg = (score?: number) => {
    if (!score) return 'bg-muted';
    if (score >= 80) return 'bg-success/20 border-success/30';
    if (score >= 60) return 'bg-warning/20 border-warning/30';
    return 'bg-destructive/20 border-destructive/30';
  };

  return (
    <>
      <div 
        className="glass-card p-5 hover:border-primary/50 transition-all duration-300 cursor-pointer group animate-fade-in relative"
        onClick={() => setShowDetails(true)}
      >
        {/* Match Score Badge */}
        {match && (
          <div className={`absolute -top-2 -right-2 px-2 py-1 rounded-full text-xs font-bold border ${getScoreBg(match.score)} ${getScoreColor(match.score)}`}>
            {match.score}%
          </div>
        )}

        {/* New Grant Indicator */}
        {(opportunity as any).isNew && (
          <div className="absolute -top-2 -left-2 px-2 py-1 rounded-full text-xs font-bold bg-primary text-primary-foreground flex items-center gap-1">
            <Sparkles className="w-3 h-3" /> New
          </div>
        )}

        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {opportunity.name}
          </h3>
          <Badge variant={typeVariantMap[opportunity.type]} className="shrink-0">
            {typeLabels[opportunity.type]}
          </Badge>
        </div>
        
        {opportunity.organization && (
          <p className="text-sm text-muted-foreground mb-3 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5" />
            {opportunity.organization}
          </p>
        )}
        
        <div className="space-y-2 text-sm">
          {opportunity.focus && (
            <div className="flex items-start gap-2 text-muted-foreground">
              <Target className="w-3.5 h-3.5 mt-0.5 shrink-0 text-primary" />
              <span className="line-clamp-2">{opportunity.focus}</span>
            </div>
          )}
          
          {opportunity.amount && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <DollarSign className="w-3.5 h-3.5 shrink-0 text-success" />
              <span className="font-medium text-success">{opportunity.amount}</span>
            </div>
          )}
          
          {opportunity.deadline && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="w-3.5 h-3.5 shrink-0 text-warning" />
              <span>{opportunity.deadline}</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border">
          <Button
            size="sm"
            variant="ghost"
            className="h-8"
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark();
            }}
          >
            {isBookmarked ? (
              <BookmarkCheck className="w-4 h-4 text-primary" />
            ) : (
              <Bookmark className="w-4 h-4" />
            )}
          </Button>
          
          {!tracked ? (
            <Button
              size="sm"
              variant="outline"
              className="flex-1 h-8"
              onClick={(e) => {
                e.stopPropagation();
                onTrack();
              }}
            >
              <Plus className="w-4 h-4 mr-1" />
              Track
            </Button>
          ) : (
            <Badge variant="secondary" className="flex-1 justify-center">
              <CheckCircle2 className="w-3 h-3 mr-1" />
              {tracked.status.replace('_', ' ')}
            </Badge>
          )}
        </div>
      </div>

      {/* Details Dialog */}
      <Dialog open={showDetails} onOpenChange={setShowDetails}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex items-start justify-between gap-4">
              <DialogTitle className="text-xl">{opportunity.name}</DialogTitle>
              <Badge variant={typeVariantMap[opportunity.type]}>
                {typeLabels[opportunity.type]}
              </Badge>
            </div>
          </DialogHeader>

          <div className="space-y-6 mt-4">
            {/* Match Analysis */}
            {match && (
              <div className={`p-4 rounded-lg border ${getScoreBg(match.score)}`}>
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className={`w-5 h-5 ${getScoreColor(match.score)}`} />
                  <span className={`font-bold text-lg ${getScoreColor(match.score)}`}>
                    {match.score}% Match
                  </span>
                </div>
                
                {match.reasons.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-foreground mb-2">Why you match:</p>
                    <ul className="space-y-1">
                      {match.reasons.map((reason, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <CheckCircle2 className="w-4 h-4 text-success shrink-0 mt-0.5" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {match.gaps.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-foreground mb-2">Gaps to address:</p>
                    <ul className="space-y-1">
                      {match.gaps.map((gap, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                          <AlertTriangle className="w-4 h-4 text-warning shrink-0 mt-0.5" />
                          {gap}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {match.recommendation && (
                  <p className="text-sm bg-background/50 p-3 rounded-lg">
                    <strong>Recommendation:</strong> {match.recommendation}
                  </p>
                )}
              </div>
            )}

            {/* Details Grid */}
            <div className="grid gap-4 md:grid-cols-2">
              {opportunity.organization && (
                <div>
                  <p className="text-sm text-muted-foreground">Organization</p>
                  <p className="font-medium">{opportunity.organization}</p>
                </div>
              )}
              {opportunity.amount && (
                <div>
                  <p className="text-sm text-muted-foreground">Amount</p>
                  <p className="font-medium text-success">{opportunity.amount}</p>
                </div>
              )}
              {opportunity.deadline && (
                <div>
                  <p className="text-sm text-muted-foreground">Deadline</p>
                  <p className="font-medium">{opportunity.deadline}</p>
                </div>
              )}
              {opportunity.level && (
                <div>
                  <p className="text-sm text-muted-foreground">Level</p>
                  <p className="font-medium">{opportunity.level}</p>
                </div>
              )}
            </div>

            {opportunity.focus && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Focus Areas</p>
                <p className="font-medium">{opportunity.focus}</p>
              </div>
            )}

            {opportunity.features && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Features</p>
                <p>{opportunity.features}</p>
              </div>
            )}

            {opportunity.eligibility && (
              <div>
                <p className="text-sm text-muted-foreground mb-1">Eligibility</p>
                <p>{opportunity.eligibility}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <Button
                variant="outline"
                onClick={() => onToggleBookmark()}
              >
                {isBookmarked ? (
                  <>
                    <BookmarkCheck className="w-4 h-4 mr-2 text-primary" />
                    Bookmarked
                  </>
                ) : (
                  <>
                    <Bookmark className="w-4 h-4 mr-2" />
                    Bookmark
                  </>
                )}
              </Button>
              
              {!tracked ? (
                <Button variant="glow" className="flex-1" onClick={onTrack}>
                  <Plus className="w-4 h-4 mr-2" />
                  Start Tracking
                </Button>
              ) : (
                <Button variant="secondary" className="flex-1" disabled>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Tracking: {tracked.status.replace('_', ' ')}
                </Button>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
