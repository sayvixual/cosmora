import React from "react";
import Image from "next/image";
import { Destination } from "@/features/destinations/types";

export function DestinationHero({ destination }: { destination: Destination }) {
  return (
    <section className="relative w-full min-h-[60vh] lg:min-h-[80vh] flex flex-col justify-end overflow-hidden pb-12 lg:pb-24">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <Image
          src={destination.imageUrl}
          alt={destination.name}
          fill
          className="object-cover"
          priority
        />
        {/* Gradient Overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-6 lg:px-12 flex flex-col items-start gap-4">
        <div className="flex items-center gap-3 text-sm font-mono tracking-widest text-muted-foreground uppercase">
          <span>{destination.countryCode}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
          <span>{destination.region}</span>
        </div>
        
        <h1 className="text-4xl lg:text-7xl font-bold tracking-tight max-w-4xl leading-[1.1]">
          {destination.name}
        </h1>
        
        <div className="flex flex-wrap items-center gap-6 mt-4 font-mono text-sm text-primary/80">
          <div className="flex flex-col">
            <span className="text-muted-foreground text-xs uppercase">Elevation</span>
            <span>{destination.elevationM.toLocaleString()} m</span>
          </div>
          <div className="flex flex-col">
            <span className="text-muted-foreground text-xs uppercase">Coordinates</span>
            <span>{destination.latitude.toFixed(4)}°, {destination.longitude.toFixed(4)}°</span>
          </div>
        </div>
      </div>
    </section>
  );
}
