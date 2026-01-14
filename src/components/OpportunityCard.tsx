import { Opportunity } from "@/data/opportunities";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, MapPin, Target, Users } from "lucide-react";

interface OpportunityCardProps {
  opportunity: Opportunity;
  onClick?: () => void;
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

export function OpportunityCard({ opportunity, onClick }: OpportunityCardProps) {
  return (
    <div 
      className="glass-card p-5 hover:border-primary/50 transition-all duration-300 cursor-pointer group animate-fade-in"
      onClick={onClick}
    >
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
        
        {opportunity.eligibility && (
          <div className="flex items-start gap-2 text-muted-foreground">
            <Users className="w-3.5 h-3.5 mt-0.5 shrink-0 text-info" />
            <span className="line-clamp-2">{opportunity.eligibility}</span>
          </div>
        )}
      </div>
    </div>
  );
}
