import React from "react";
import { Activity } from "@/features/destinations/types";
import { Badge } from "@/components/ui/badge";

export function ActivityList({ activities }: { activities: Activity[] }) {
  if (!activities || activities.length === 0) return null;

  return (
    <div className="py-12 border-t border-border/50">
      <h3 className="text-2xl font-light tracking-tight mb-8">Available Activities</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {activities.map((activity) => (
          <div 
            key={activity.id} 
            className="group flex flex-col gap-4 p-6 rounded-xl bg-card border border-border/50 hover:border-cyan-500/30 transition-colors"
          >
            <div className="flex items-center justify-between">
              <h4 className="text-lg font-medium capitalize">
                {activity.type.replace('_', ' ')}
              </h4>
              <span className="w-8 h-8 rounded-full bg-secondary/50 flex items-center justify-center text-muted-foreground group-hover:bg-cyan-500/10 group-hover:text-cyan-400 transition-colors">
                ↗
              </span>
            </div>
            
            <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
              {activity.description}
            </p>
            
            {activity.requirements && activity.requirements.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {activity.requirements.map((req, idx) => (
                  <Badge key={idx} variant="outline" className="text-xs font-mono text-muted-foreground">
                    {req}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
