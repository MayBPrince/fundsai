export interface UserProfile {
  id: string;
  businessName: string;
  businessType: 'construction' | 'retail' | 'tech' | 'manufacturing' | 'services' | 'other';
  location: {
    city: string;
    state: string;
    country: string;
  };
  stage: 'idea' | 'mvp' | 'early' | 'growth' | 'established';
  revenue?: string;
  employees?: number;
  registrations: {
    gstin?: boolean;
    pan?: boolean;
    msme?: boolean;
    startupIndia?: boolean;
  };
  focusAreas: string[];
  projectDescription?: string;
}

export interface TrackedGrant {
  id: string;
  opportunityId: string;
  status: 'discovered' | 'interested' | 'eligible' | 'applying' | 'submitted' | 'under_review' | 'awarded' | 'rejected';
  eligibilityScore?: number;
  matchReasons?: string[];
  gaps?: string[];
  notes?: string;
  appliedAt?: string;
  submittedAt?: string;
  outcomeAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface MatchResult {
  id: string;
  score: number;
  reasons: string[];
  gaps: string[];
  recommendation: string;
}

export type KanbanColumn = {
  id: TrackedGrant['status'];
  title: string;
  color: string;
};

export const KANBAN_COLUMNS: KanbanColumn[] = [
  { id: 'discovered', title: 'Discovered', color: 'bg-muted' },
  { id: 'interested', title: 'Interested', color: 'bg-info/20' },
  { id: 'eligible', title: 'Eligible', color: 'bg-primary/20' },
  { id: 'applying', title: 'Applying', color: 'bg-warning/20' },
  { id: 'submitted', title: 'Submitted', color: 'bg-accent/20' },
  { id: 'under_review', title: 'Under Review', color: 'bg-secondary' },
  { id: 'awarded', title: 'Awarded', color: 'bg-success/20' },
  { id: 'rejected', title: 'Rejected', color: 'bg-destructive/20' },
];
