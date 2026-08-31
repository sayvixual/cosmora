import React from "react";
import { Destination } from "@/features/destinations/types";

export function DestinationInfo({ destination }: { destination: Destination }) {
  const { observationContext } = destination;
  
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 py-12">
      {/* Editorial Content */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <h2 className="text-2xl lg:text-3xl font-light tracking-tight">Overview</h2>
        <p className="text-lg text-muted-foreground leading-relaxed">
          {destination.description}
        </p>
        
        {destination.websiteUrl && (
          <div className="mt-4">
            <a 
              href={destination.websiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-cyan-400 hover:text-cyan-300 transition-colors font-mono text-sm uppercase tracking-wider"
            >
              Official Website ↗
            </a>
          </div>
        )}
      </div>

      {/* Observation Metadata */}
      <div className="lg:col-span-5 flex flex-col gap-8">
        <div>
          <h3 className="text-sm font-mono tracking-widest text-muted-foreground uppercase mb-6">
            Observation Context
          </h3>
          
          <div className="flex flex-col gap-4">
            <div className="flex justify-between items-start border-b border-border/50 pb-4">
              <span className="text-muted-foreground">Best Season</span>
              <span className="font-medium text-right max-w-[60%]">{observationContext.bestSeason}</span>
            </div>
            
            <div className="flex justify-between items-start border-b border-border/50 pb-4">
              <span className="text-muted-foreground">Sky Quality</span>
              <span className="font-medium">Class {observationContext.skyQuality}</span>
            </div>
            
            <div className="flex justify-between items-start border-b border-border/50 pb-4">
              <span className="text-muted-foreground">Light Pollution</span>
              <span className="font-medium text-right max-w-[60%]">{observationContext.lightPollutionClass}</span>
            </div>
          </div>
        </div>

        <div className="bg-secondary/30 p-6 rounded-lg border border-border/50">
          <h4 className="text-sm font-mono tracking-wider text-primary uppercase mb-3">
            Visibility Notes
          </h4>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {observationContext.visibilityNotes}
          </p>
        </div>
      </div>
    </div>
  );
}
