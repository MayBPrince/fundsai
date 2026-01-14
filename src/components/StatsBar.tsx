import { allOpportunities } from "@/data/opportunities";
import { Award, Trophy, Rocket, Briefcase } from "lucide-react";

export function StatsBar() {
  const stats = [
    { 
      label: "Grants", 
      value: allOpportunities.filter(o => o.type === "grant").length,
      icon: Award,
      color: "text-success"
    },
    { 
      label: "Hackathons", 
      value: allOpportunities.filter(o => o.type === "hackathon").length,
      icon: Trophy,
      color: "text-info"
    },
    { 
      label: "Accelerators", 
      value: allOpportunities.filter(o => o.type === "accelerator").length,
      icon: Rocket,
      color: "text-accent"
    },
    { 
      label: "Programs", 
      value: allOpportunities.filter(o => o.type === "program").length,
      icon: Briefcase,
      color: "text-warning"
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="glass-card p-4 text-center">
          <stat.icon className={`w-6 h-6 mx-auto mb-2 ${stat.color}`} />
          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
          <p className="text-xs text-muted-foreground">{stat.label}</p>
        </div>
      ))}
    </div>
  );
}
