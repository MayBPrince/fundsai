import { useState } from "react";
import { UserProfile } from "@/types/grant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface ProfileFormProps {
  profile: UserProfile;
  onUpdate: (updates: Partial<UserProfile>) => void;
  onRunMatch: () => void;
  isMatching: boolean;
}

const BUSINESS_TYPES = [
  { value: 'construction', label: 'Construction' },
  { value: 'retail', label: 'Retail' },
  { value: 'tech', label: 'Technology' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'services', label: 'Services' },
  { value: 'other', label: 'Other' },
];

const STAGES = [
  { value: 'idea', label: 'Idea Stage' },
  { value: 'mvp', label: 'MVP Ready' },
  { value: 'early', label: 'Early Revenue' },
  { value: 'growth', label: 'Growth Stage' },
  { value: 'established', label: 'Established' },
];

const FOCUS_AREAS = [
  'AI', 'Cybersecurity', 'IoT', 'Cloud', 'Blockchain', 'Fintech', 
  'EdTech', 'HealthTech', 'AgriTech', 'CleanTech', 'E-commerce', 'SaaS'
];

export function ProfileForm({ profile, onUpdate, onRunMatch, isMatching }: ProfileFormProps) {
  const [localProfile, setLocalProfile] = useState(profile);

  const handleSave = () => {
    onUpdate(localProfile);
  };

  const toggleFocusArea = (area: string) => {
    const current = localProfile.focusAreas || [];
    const updated = current.includes(area)
      ? current.filter(a => a !== area)
      : [...current, area];
    setLocalProfile(prev => ({ ...prev, focusAreas: updated }));
  };

  const toggleRegistration = (key: keyof UserProfile['registrations']) => {
    setLocalProfile(prev => ({
      ...prev,
      registrations: {
        ...prev.registrations,
        [key]: !prev.registrations[key],
      }
    }));
  };

  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h2 className="text-xl font-semibold mb-1">Business Profile</h2>
        <p className="text-sm text-muted-foreground">Complete your profile for better grant matching</p>
      </div>

      {/* Basic Info */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="businessName">Business Name</Label>
          <Input
            id="businessName"
            value={localProfile.businessName}
            onChange={(e) => setLocalProfile(prev => ({ ...prev, businessName: e.target.value }))}
            placeholder="e.g., Mandal Construction Tech"
          />
        </div>

        <div className="space-y-2">
          <Label>Business Type</Label>
          <Select
            value={localProfile.businessType}
            onValueChange={(value: UserProfile['businessType']) => 
              setLocalProfile(prev => ({ ...prev, businessType: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {BUSINESS_TYPES.map(type => (
                <SelectItem key={type.value} value={type.value}>{type.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Location */}
      <div className="space-y-2">
        <Label>Location</Label>
        <div className="grid gap-3 sm:grid-cols-3">
          <Input
            value={localProfile.location.city}
            onChange={(e) => setLocalProfile(prev => ({ 
              ...prev, 
              location: { ...prev.location, city: e.target.value }
            }))}
            placeholder="City"
          />
          <Input
            value={localProfile.location.state}
            onChange={(e) => setLocalProfile(prev => ({ 
              ...prev, 
              location: { ...prev.location, state: e.target.value }
            }))}
            placeholder="State"
          />
          <Input
            value={localProfile.location.country}
            onChange={(e) => setLocalProfile(prev => ({ 
              ...prev, 
              location: { ...prev.location, country: e.target.value }
            }))}
            placeholder="Country"
          />
        </div>
      </div>

      {/* Stage & Revenue */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label>Business Stage</Label>
          <Select
            value={localProfile.stage}
            onValueChange={(value: UserProfile['stage']) => 
              setLocalProfile(prev => ({ ...prev, stage: value }))
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {STAGES.map(stage => (
                <SelectItem key={stage.value} value={stage.value}>{stage.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Annual Revenue (Optional)</Label>
          <Input
            value={localProfile.revenue || ''}
            onChange={(e) => setLocalProfile(prev => ({ ...prev, revenue: e.target.value }))}
            placeholder="e.g., ₹10-50 lakh"
          />
        </div>
      </div>

      {/* Registrations */}
      <div className="space-y-3">
        <Label>Registrations & Documents</Label>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { key: 'gstin' as const, label: 'GSTIN' },
            { key: 'pan' as const, label: 'PAN' },
            { key: 'msme' as const, label: 'MSME' },
            { key: 'startupIndia' as const, label: 'Startup India' },
          ].map(reg => (
            <label
              key={reg.key}
              className="flex items-center gap-2 p-3 rounded-md bg-secondary cursor-pointer hover:bg-secondary/80 transition-colors"
            >
              <Checkbox
                checked={localProfile.registrations[reg.key] || false}
                onCheckedChange={() => toggleRegistration(reg.key)}
              />
              <span className="text-sm">{reg.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Focus Areas */}
      <div className="space-y-3">
        <Label>Focus Areas</Label>
        <div className="flex flex-wrap gap-2">
          {FOCUS_AREAS.map(area => (
            <button
              key={area}
              type="button"
              onClick={() => toggleFocusArea(area)}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                localProfile.focusAreas?.includes(area)
                  ? "bg-foreground text-background"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {area}
            </button>
          ))}
        </div>
      </div>

      {/* Project Description */}
      <div className="space-y-2">
        <Label>Project Description (Optional)</Label>
        <Textarea
          value={localProfile.projectDescription || ''}
          onChange={(e) => setLocalProfile(prev => ({ ...prev, projectDescription: e.target.value }))}
          placeholder="Describe your project or business idea..."
          className="min-h-[100px]"
        />
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-4 border-t border-border">
        <Button onClick={handleSave} variant="outline">
          Save Profile
        </Button>
        <Button 
          onClick={onRunMatch}
          disabled={isMatching || !localProfile.businessName}
        >
          {isMatching ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Matching...
            </>
          ) : (
            "Run AI Matching"
          )}
        </Button>
      </div>
    </div>
  );
}
