import { useState } from "react";
import { UserProfile } from "@/types/grant";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { ArrowRight, ArrowLeft, Building2, MapPin, Briefcase, FileCheck, Target, Sparkles } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
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
  { value: 'idea', label: 'Idea Stage', desc: 'Just an idea, no product yet' },
  { value: 'mvp', label: 'MVP Ready', desc: 'Have a working prototype' },
  { value: 'early', label: 'Early Revenue', desc: 'Making some money' },
  { value: 'growth', label: 'Growth Stage', desc: 'Scaling the business' },
  { value: 'established', label: 'Established', desc: '3+ years in business' },
];

const FOCUS_AREAS = [
  'AI', 'Cybersecurity', 'IoT', 'Cloud', 'Blockchain', 'Fintech', 
  'EdTech', 'HealthTech', 'AgriTech', 'CleanTech', 'E-commerce', 'SaaS'
];

const INDIAN_STATES = [
  'Maharashtra', 'Karnataka', 'Tamil Nadu', 'Delhi', 'Gujarat', 
  'Telangana', 'Uttar Pradesh', 'West Bengal', 'Rajasthan', 'Kerala',
  'Punjab', 'Haryana', 'Madhya Pradesh', 'Bihar', 'Odisha', 'Other'
];

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>({
    id: 'user-1',
    businessName: '',
    businessType: 'tech',
    location: { city: '', state: 'Maharashtra', country: 'India' },
    stage: 'idea',
    registrations: {},
    focusAreas: [],
  });

  const totalSteps = 5;
  const progress = ((step + 1) / totalSteps) * 100;

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }));
  };

  const toggleFocusArea = (area: string) => {
    const current = profile.focusAreas || [];
    const updated = current.includes(area)
      ? current.filter(a => a !== area)
      : [...current, area];
    updateProfile({ focusAreas: updated });
  };

  const toggleRegistration = (key: keyof UserProfile['registrations']) => {
    updateProfile({
      registrations: {
        ...profile.registrations,
        [key]: !profile.registrations[key],
      }
    });
  };

  const canProceed = () => {
    switch (step) {
      case 0: return profile.businessName.trim().length > 0;
      case 1: return profile.location.state.length > 0;
      case 2: return true;
      case 3: return true;
      case 4: return true;
      default: return true;
    }
  };

  const handleNext = () => {
    if (step < totalSteps - 1) {
      setStep(step + 1);
    } else {
      onComplete(profile);
    }
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const stepIcons = [Building2, MapPin, Briefcase, FileCheck, Target];
  const StepIcon = stepIcons[step];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-lg font-semibold">Grant AI</h1>
          <span className="text-sm text-muted-foreground">~{5 - step} min left</span>
        </div>
      </header>

      {/* Progress */}
      <div className="max-w-2xl mx-auto w-full px-4 pt-6">
        <Progress value={progress} className="h-1" />
        <div className="flex justify-between mt-2 text-xs text-muted-foreground">
          <span>Step {step + 1} of {totalSteps}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
      </div>

      {/* Content */}
      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-8">
        <div className="space-y-6">
          {/* Step Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center">
              <StepIcon className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <h2 className="text-xl font-semibold">
                {step === 0 && "What's your business?"}
                {step === 1 && "Where are you located?"}
                {step === 2 && "What stage is your business?"}
                {step === 3 && "Which documents do you have?"}
                {step === 4 && "What's your focus area?"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {step === 0 && "Help us find grants tailored to your business"}
                {step === 1 && "Many grants are region-specific"}
                {step === 2 && "Different grants target different stages"}
                {step === 3 && "This helps match eligibility requirements"}
                {step === 4 && "Select technologies or sectors you work in"}
              </p>
            </div>
          </div>

          {/* Step 0: Business Info */}
          {step === 0 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="businessName">Business Name *</Label>
                <Input
                  id="businessName"
                  value={profile.businessName}
                  onChange={(e) => updateProfile({ businessName: e.target.value })}
                  placeholder="e.g., Mandal Construction Tech Pvt Ltd"
                  className="h-12"
                  autoFocus
                />
              </div>

              <div className="space-y-2">
                <Label>Business Type *</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {BUSINESS_TYPES.map(type => (
                    <button
                      key={type.value}
                      type="button"
                      onClick={() => updateProfile({ businessType: type.value as UserProfile['businessType'] })}
                      className={`p-3 rounded-lg border text-sm text-left transition-colors ${
                        profile.businessType === type.value
                          ? "border-foreground bg-foreground/5"
                          : "border-border hover:border-foreground/50"
                      }`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 1: Location */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>State *</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {INDIAN_STATES.map(state => (
                    <button
                      key={state}
                      type="button"
                      onClick={() => updateProfile({ 
                        location: { ...profile.location, state } 
                      })}
                      className={`p-3 rounded-lg border text-sm text-left transition-colors ${
                        profile.location.state === state
                          ? "border-foreground bg-foreground/5"
                          : "border-border hover:border-foreground/50"
                      }`}
                    >
                      {state}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">City (Optional)</Label>
                <Input
                  id="city"
                  value={profile.location.city}
                  onChange={(e) => updateProfile({ 
                    location: { ...profile.location, city: e.target.value } 
                  })}
                  placeholder="e.g., Mumbai, Pune, Kalyan"
                  className="h-12"
                />
              </div>
            </div>
          )}

          {/* Step 2: Stage */}
          {step === 2 && (
            <div className="space-y-3">
              {STAGES.map(stage => (
                <button
                  key={stage.value}
                  type="button"
                  onClick={() => updateProfile({ stage: stage.value as UserProfile['stage'] })}
                  className={`w-full p-4 rounded-lg border text-left transition-colors ${
                    profile.stage === stage.value
                      ? "border-foreground bg-foreground/5"
                      : "border-border hover:border-foreground/50"
                  }`}
                >
                  <div className="font-medium">{stage.label}</div>
                  <div className="text-sm text-muted-foreground">{stage.desc}</div>
                </button>
              ))}

              <div className="pt-4 space-y-2">
                <Label htmlFor="revenue">Annual Revenue (Optional)</Label>
                <Input
                  id="revenue"
                  value={profile.revenue || ''}
                  onChange={(e) => updateProfile({ revenue: e.target.value })}
                  placeholder="e.g., ₹10-50 lakh"
                  className="h-12"
                />
              </div>
            </div>
          )}

          {/* Step 3: Registrations */}
          {step === 3 && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Select all that apply. Don't worry if you don't have all of these.
              </p>
              
              {[
                { key: 'gstin' as const, label: 'GSTIN', desc: 'GST Identification Number' },
                { key: 'pan' as const, label: 'PAN', desc: 'Permanent Account Number' },
                { key: 'msme' as const, label: 'MSME Registration', desc: 'Udyam / Udyog Aadhaar' },
                { key: 'startupIndia' as const, label: 'Startup India', desc: 'DPIIT Recognition' },
              ].map(reg => (
                <label
                  key={reg.key}
                  className={`flex items-start gap-4 p-4 rounded-lg border cursor-pointer transition-colors ${
                    profile.registrations[reg.key]
                      ? "border-foreground bg-foreground/5"
                      : "border-border hover:border-foreground/50"
                  }`}
                >
                  <Checkbox
                    checked={profile.registrations[reg.key] || false}
                    onCheckedChange={() => toggleRegistration(reg.key)}
                    className="mt-0.5"
                  />
                  <div>
                    <div className="font-medium">{reg.label}</div>
                    <div className="text-sm text-muted-foreground">{reg.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          )}

          {/* Step 4: Focus Areas */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="flex flex-wrap gap-2">
                {FOCUS_AREAS.map(area => (
                  <button
                    key={area}
                    type="button"
                    onClick={() => toggleFocusArea(area)}
                    className={`px-4 py-2 rounded-lg border text-sm transition-colors ${
                      profile.focusAreas?.includes(area)
                        ? "border-foreground bg-foreground text-background"
                        : "border-border hover:border-foreground/50"
                    }`}
                  >
                    {area}
                  </button>
                ))}
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectDescription">Brief Project Description (Optional)</Label>
                <Textarea
                  id="projectDescription"
                  value={profile.projectDescription || ''}
                  onChange={(e) => updateProfile({ projectDescription: e.target.value })}
                  placeholder="Describe what you're building or your business idea..."
                  className="min-h-[100px]"
                />
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer Navigation */}
      <footer className="border-t border-border bg-background">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={handleBack}
            disabled={step === 0}
            className="gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </Button>

          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="gap-2"
          >
            {step === totalSteps - 1 ? (
              <>
                <Sparkles className="w-4 h-4" />
                Find My Grants
              </>
            ) : (
              <>
                Continue
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </footer>
    </div>
  );
}
