"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Destination, DestinationCategory } from "@/features/destinations/types";
import { 
  MapPin, 
  ArrowLeft, 
  ArrowRight,
  Star, 
  Telescope, 
  Info, 
  CloudMoon, 
  Search, 
  Compass, 
  Rocket, 
  Building2, 
  Sparkles, 
  X, 
  Sun, 
  Droplets, 
  Award, 
  Atom, 
  Globe,
  FileText,
  ShieldCheck,
  Activity,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";

interface DestinationSidebarProps {
  destinations: Destination[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onHover?: (id: string | null) => void;
  onOpenAIGuide: (destinationName: string) => void;
  onViewOnGlobe?: () => void;
}

const CATEGORY_TABS: { id: "all" | DestinationCategory; label: string; icon: any }[] = [
  { id: "all", label: "ALL", icon: Compass },
  { id: "observatory", label: "OBSERVATORIES", icon: Telescope },
  { id: "dark_sky", label: "DARK SKY", icon: Star },
  { id: "analog_habitat", label: "SPACE ANALOGS", icon: Rocket },
];

type DetailTab = "briefing" | "telemetry" | "instruments" | "access";

export function DestinationSidebar({ 
  destinations, 
  selectedId, 
  onSelect, 
  onHover,
  onOpenAIGuide,
  onViewOnGlobe 
}: DestinationSidebarProps) {
  const selectedDestination = destinations.find(d => d.id === selectedId);
  const [renderState, setRenderState] = useState<'list' | 'detail'>('list');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | DestinationCategory>("all");
  const [detailTab, setDetailTab] = useState<DetailTab>("briefing");
  const [imgError, setImgError] = useState(false);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedId) {
      setRenderState('detail');
      setDetailTab('briefing');
      setImgError(false);
    } else {
      setRenderState('list');
    }
  }, [selectedId]);

  // Handle horizontal scrolling on wheel for category chips
  const handleCategoryWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY !== 0 && categoryScrollRef.current) {
      categoryScrollRef.current.scrollLeft += e.deltaY;
    }
  };

  // Filter destinations by category and search keyword
  const filteredDestinations = useMemo(() => {
    return destinations.filter(dest => {
      const matchesCategory = selectedCategory === "all" || dest.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery = !query || 
        dest.name.toLowerCase().includes(query) ||
        dest.region.toLowerCase().includes(query) ||
        dest.countryCode.toLowerCase().includes(query) ||
        dest.description.toLowerCase().includes(query) ||
        (dest.managedBy && dest.managedBy.toLowerCase().includes(query)) ||
        (dest.instruments || []).some(inst => inst.toLowerCase().includes(query)) ||
        (dest.keyDiscoveries || []).some(disc => disc.toLowerCase().includes(query));
      return matchesCategory && matchesQuery;
    });
  }, [destinations, selectedCategory, searchQuery]);

  const getCategoryBadge = (category?: DestinationCategory) => {
    switch (category) {
      case "observatory":
        return { label: "OBSERVATORY", color: "text-[#4BA2FF] border-[#4BA2FF]/30 bg-[#4BA2FF]/10", icon: Telescope };
      case "dark_sky":
        return { label: "DARK SKY", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10", icon: Star };
      case "analog_habitat":
        return { label: "SPACE ANALOG", color: "text-orange-400 border-orange-500/30 bg-orange-500/10", icon: Rocket };
      case "historic":
        return { label: "HERITAGE", color: "text-purple-400 border-purple-500/30 bg-purple-500/10", icon: Building2 };
      default:
        return { label: "STATION", color: "text-white/60 border-white/20 bg-white/5", icon: Compass };
    }
  };

  return (
    <div className="h-full w-full flex flex-col p-2.5 sm:p-3.5 md:p-4 overflow-hidden min-h-0">
      
      {/* ========================================================================= */}
      {/* 1. SELECTION / DIRECTORY LIST VIEW                                        */}
      {/* ========================================================================= */}
      {renderState === 'list' && (
        <div className="flex-1 flex flex-col gap-2 sm:gap-2.5 md:gap-3 animate-in fade-in slide-in-from-right-4 duration-300 min-h-0">
          
          {/* Header & Subtitle */}
          <div className="space-y-1 shrink-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-accent/10 border border-accent/20">
                <span className="size-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[9px] sm:text-[9.5px] font-mono font-bold tracking-widest text-accent uppercase">
                  04 / GLOBAL EXPEDITIONS
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-[9px] sm:text-[10px] font-mono text-white/50">
                  {filteredDestinations.length} OF {destinations.length} SITES
                </span>

                {onViewOnGlobe && (
                  <button
                    type="button"
                    onClick={onViewOnGlobe}
                    className="md:hidden flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 text-accent font-mono text-[9px] uppercase tracking-wider transition-colors"
                  >
                    <Globe className="size-3" />
                    <span>GLOBE</span>
                  </button>
                )}
              </div>
            </div>

            <div>
              <h1 className="text-base sm:text-lg md:text-xl font-display font-bold tracking-tight text-white leading-tight">
                Observatories & Habitats
              </h1>
              <p className="text-[10px] sm:text-[11px] text-white/50 font-sans leading-relaxed line-clamp-1 sm:line-clamp-2">
                Astronomical observatories, dark sky reserves, and space analog bases.
              </p>
            </div>
          </div>

          {/* Instant Search Field */}
          <div className="relative flex items-center shrink-0">
            <Search className="absolute left-3 size-3.5 text-white/40 pointer-events-none" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search observatory, country, telescope, discovery..."
              className="w-full pl-9 pr-8 py-1.5 sm:py-2 bg-white/[0.04] border border-white/10 focus:border-accent/50 focus:bg-white/[0.07] rounded-xl text-xs text-white placeholder:text-white/30 outline-none transition-all font-sans"
            />
            {searchQuery && (
              <button 
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 p-1 text-white/40 hover:text-white transition-colors cursor-pointer"
                title="Clear search"
              >
                <X className="size-3" />
              </button>
            )}
          </div>

          {/* Filter Chips (Smooth Mouse Wheel & Touch Pan Scrollable) */}
          <div 
            ref={categoryScrollRef}
            onWheel={handleCategoryWheel}
            className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none shrink-0 font-mono text-[9.5px] sm:text-[10px] touch-pan-x"
          >
            {CATEGORY_TABS.map((tab) => {
              const isActive = selectedCategory === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setSelectedCategory(tab.id)}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-lg whitespace-nowrap transition-all uppercase tracking-wider font-semibold border cursor-pointer shrink-0 select-none",
                    isActive
                      ? "bg-accent text-black border-accent shadow-[0_0_12px_rgba(75,158,255,0.3)] font-bold"
                      : "bg-white/[0.03] border-white/10 text-white/60 hover:text-white hover:bg-white/[0.07]"
                  )}
                >
                  <Icon className={cn("size-3", isActive ? "text-black" : "text-accent")} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Destination Cards List - Fully Scrollable & Proportional */}
          <div className="flex-1 flex flex-col gap-2 overflow-y-auto pr-1 cosmic-scrollbar min-h-0 touch-pan-y overscroll-contain pb-2">
            {filteredDestinations.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-6 text-center text-white/40 space-y-2 my-auto">
                <Compass className="size-8 text-white/20 animate-spin" />
                <p className="text-xs font-mono">No matching astronomical sites found.</p>
                <button 
                  type="button"
                  onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
                  className="text-[11px] text-accent hover:underline font-mono cursor-pointer"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              filteredDestinations.map((dest) => {
                const badge = getCategoryBadge(dest.category);
                const BadgeIcon = badge.icon;

                return (
                  <div
                    key={dest.id}
                    onClick={() => onSelect(dest.id)}
                    onMouseEnter={() => onHover?.(dest.id)}
                    onMouseLeave={() => onHover?.(null)}
                    className="group relative flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-accent/50 transition-all text-left active:scale-[0.99] overflow-hidden shrink-0 w-full cursor-pointer shadow-sm"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-accent/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    
                    <div className="flex flex-col gap-1 min-w-0 pr-2 relative z-10 flex-1">
                      {/* Row 1: Category Badge & Ref */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[8px] sm:text-[8.5px] font-mono font-bold tracking-wider uppercase shrink-0", badge.color)}>
                          <BadgeIcon className="size-2.5" />
                          {badge.label}
                        </span>
                        <span className="text-[8px] font-mono text-white/30 uppercase">
                          {dest.id.toUpperCase()}
                        </span>
                      </div>

                      {/* Row 2: Observatory Name */}
                      <h2 className="text-xs sm:text-[13px] md:text-sm font-display font-bold text-white group-hover:text-accent transition-colors leading-snug truncate">
                        {dest.name}
                      </h2>

                      {/* Row 3: Region & Country */}
                      <div className="text-[8.5px] sm:text-[9px] uppercase tracking-wide font-mono text-white/40 leading-tight truncate">
                        {dest.region}, {dest.countryCode}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5 sm:gap-2 relative z-10 pl-1">
                      <span className="font-mono text-[8px] sm:text-[8.5px] md:text-[9px] px-2 py-1 rounded bg-white/[0.04] border border-white/10 text-white/70 whitespace-nowrap">
                        {dest.elevationM > 0 ? `${dest.elevationM.toLocaleString()}m` : "Sea Lvl"}
                      </span>
                      <div className="size-6 sm:size-7 rounded-lg bg-white/5 group-hover:bg-accent group-hover:text-black text-white/50 flex items-center justify-center transition-all">
                        <ArrowRight className="size-3.5 group-hover:translate-x-0.5 transition-transform" />
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. EXECUTIVE SITE DOSSIER & SUMMARY VIEW                                  */}
      {/* ========================================================================= */}
      {renderState === 'detail' && selectedDestination && (
        <div className="flex-1 flex flex-col gap-2 sm:gap-2.5 animate-in fade-in slide-in-from-right-4 duration-300 min-h-0">
          
          {/* Top Bar: Back, Status & Mobile Globe Toggle */}
          <div className="flex items-center justify-between gap-2 shrink-0">
            <button 
              type="button"
              onClick={() => onSelect(null)}
              className="group flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 hover:border-white/30 transition-all cursor-pointer"
            >
              <ArrowLeft className="size-3 text-white/70 group-hover:text-white transition-colors" />
              <span className="text-[9.5px] sm:text-[10px] font-mono font-semibold tracking-wider text-white/70 group-hover:text-white transition-colors">
                DIRECTORY
              </span>
            </button>

            <div className="flex items-center gap-1.5">
              {onViewOnGlobe && (
                <button
                  type="button"
                  onClick={onViewOnGlobe}
                  className="md:hidden flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent font-mono text-[9px] uppercase tracking-wider hover:bg-accent/25 transition-colors cursor-pointer"
                  title="View this location on 3D Earth Globe"
                >
                  <Globe className="size-3" />
                  <span>3D GLOBE</span>
                </button>
              )}

              <div className="hidden xs:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[8.5px] sm:text-[9px]">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>ONLINE 24/7</span>
              </div>
            </div>
          </div>

          {/* Destination Container Card */}
          <div className="flex-1 flex flex-col rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/10 overflow-hidden min-h-0">
            
            {/* Header Hero Banner (Responsive Height) */}
            <div className="h-20 xs:h-24 sm:h-28 md:h-32 relative w-full bg-[#080D1A] shrink-0 overflow-hidden border-b border-white/10">
              {!imgError ? (
                <img 
                  src={selectedDestination.imageUrl} 
                  alt={selectedDestination.name}
                  onError={() => setImgError(true)}
                  className="absolute inset-0 w-full h-full object-cover opacity-60"
                />
              ) : (
                <div className="absolute inset-0 bg-gradient-to-br from-[#0D182E] via-[#080E1D] to-[#04060A] flex items-center justify-center">
                  <div className="relative flex items-center justify-center">
                    <div className="size-16 sm:size-20 rounded-full bg-accent/10 blur-xl absolute animate-pulse" />
                    <Telescope className="size-8 sm:size-10 text-accent/40 relative z-10" />
                  </div>
                </div>
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/60 to-transparent" />
              
              {/* Category & Verified Badge */}
              <div className="absolute top-2 left-3 right-3 sm:top-2.5 sm:left-4 sm:right-4 flex items-center justify-between z-10">
                <span className={cn("inline-flex items-center gap-1 px-1.5 sm:px-2 py-0.5 rounded-full border text-[7.5px] sm:text-[8.5px] font-mono font-bold tracking-wider uppercase", getCategoryBadge(selectedDestination.category).color)}>
                  {getCategoryBadge(selectedDestination.category).label}
                </span>
                
                <span className="px-1.5 sm:px-2 py-0.5 rounded-full bg-black/70 border border-white/10 font-mono text-[7.5px] sm:text-[8px] text-white/70">
                  REF: {selectedDestination.id.toUpperCase()}
                </span>
              </div>

              {/* Bottom Details: Region & Observatory Name */}
              <div className="absolute bottom-2 left-3 right-3 sm:bottom-2.5 sm:left-4 sm:right-4 z-10">
                <span className="text-[8.5px] sm:text-[9.5px] uppercase tracking-widest font-mono text-accent font-bold drop-shadow block leading-none mb-0.5 truncate">
                  {selectedDestination.region}, {selectedDestination.countryCode}
                </span>
                <h2 className="text-xs sm:text-sm md:text-base lg:text-lg font-display font-bold text-white leading-tight drop-shadow truncate">
                  {selectedDestination.name}
                </h2>
              </div>
            </div>

            {/* Quick KPI Metric Strip */}
            <div className="grid grid-cols-3 gap-1 p-1.5 sm:p-2 bg-white/[0.02] border-b border-white/10 font-mono text-center shrink-0">
              <div className="p-1 sm:p-1.5 rounded-lg bg-white/[0.02]">
                <span className="text-[7px] sm:text-[7.5px] uppercase tracking-wider text-white/40 block truncate">ELEVATION</span>
                <span className="text-[9.5px] sm:text-[10.5px] md:text-xs font-bold text-white block truncate mt-0.5">
                  {selectedDestination.elevationM > 0 ? `${selectedDestination.elevationM.toLocaleString()}m` : "Sea Lvl"}
                </span>
              </div>
              <div className="p-1 sm:p-1.5 rounded-lg bg-white/[0.02]">
                <span className="text-[7px] sm:text-[7.5px] uppercase tracking-wider text-white/40 block truncate">SKY RATING</span>
                <span className="text-[9.5px] sm:text-[10.5px] md:text-xs font-bold text-emerald-400 block truncate mt-0.5">
                  Bortle {selectedDestination.observationContext?.skyQuality || 1}
                </span>
              </div>
              <div className="p-1 sm:p-1.5 rounded-lg bg-white/[0.02]">
                <span className="text-[7px] sm:text-[7.5px] uppercase tracking-wider text-white/40 block truncate">CLEAR NIGHTS</span>
                <span className="text-[9.5px] sm:text-[10.5px] md:text-xs font-bold text-accent block truncate mt-0.5">
                  ~{selectedDestination.observationContext?.clearNightsPerYear || 280}/Yr
                </span>
              </div>
            </div>

            {/* Executive Dossier Tabs - Segmented Control */}
            <div className="grid grid-cols-4 gap-1 p-1 sm:p-1.5 border-b border-white/10 bg-[#05070A]/70 font-mono text-[8px] xs:text-[8.5px] sm:text-[9px] shrink-0">
              <button
                type="button"
                onClick={() => setDetailTab("briefing")}
                className={cn(
                  "py-1 sm:py-1.5 px-0.5 sm:px-1 rounded-md sm:rounded-lg transition-all text-center uppercase font-bold truncate cursor-pointer",
                  detailTab === "briefing" 
                    ? "bg-accent text-black shadow-[0_0_10px_rgba(75,158,255,0.4)]" 
                    : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                )}
              >
                DOSSIER
              </button>
              <button
                type="button"
                onClick={() => setDetailTab("telemetry")}
                className={cn(
                  "py-1 sm:py-1.5 px-0.5 sm:px-1 rounded-md sm:rounded-lg transition-all text-center uppercase font-bold truncate cursor-pointer",
                  detailTab === "telemetry" 
                    ? "bg-accent text-black shadow-[0_0_10px_rgba(75,158,255,0.4)]" 
                    : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                )}
              >
                TELEMETRY
              </button>
              <button
                type="button"
                onClick={() => setDetailTab("instruments")}
                className={cn(
                  "py-1 sm:py-1.5 px-0.5 sm:px-1 rounded-md sm:rounded-lg transition-all text-center uppercase font-bold truncate cursor-pointer",
                  detailTab === "instruments" 
                    ? "bg-accent text-black shadow-[0_0_10px_rgba(75,158,255,0.4)]" 
                    : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                )}
              >
                HARDWARE
              </button>
              <button
                type="button"
                onClick={() => setDetailTab("access")}
                className={cn(
                  "py-1 sm:py-1.5 px-0.5 sm:px-1 rounded-md sm:rounded-lg transition-all text-center uppercase font-bold truncate cursor-pointer",
                  detailTab === "access" 
                    ? "bg-accent text-black shadow-[0_0_10px_rgba(75,158,255,0.4)]" 
                    : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                )}
              >
                VISITING
              </button>
            </div>

            {/* Scrollable Tab Content Body */}
            <div className="p-2.5 sm:p-3 md:p-3.5 flex flex-col gap-2.5 sm:gap-3 overflow-y-auto flex-1 cosmic-scrollbar min-h-0 touch-pan-y overscroll-contain">
              
              {/* TAB 1: EXECUTIVE BRIEFING */}
              {detailTab === "briefing" && (
                <div className="space-y-2.5 animate-in fade-in duration-200">
                  {/* Strategic Highlight Callout */}
                  {selectedDestination.highlight && (
                    <div className="flex items-start gap-2 p-2.5 sm:p-3 rounded-xl bg-accent/10 border border-accent/20 text-[11px] sm:text-xs text-accent leading-relaxed font-sans">
                      <Sparkles className="size-3.5 sm:size-4 shrink-0 mt-0.5" />
                      <span>{selectedDestination.highlight}</span>
                    </div>
                  )}

                  {/* Executive Briefing Text */}
                  <div className="space-y-1.5 p-2.5 sm:p-3 rounded-xl bg-white/[0.03] border border-white/10">
                    <div className="flex items-center justify-between text-[8.5px] sm:text-[9px] font-mono text-white/40 pb-1 border-b border-white/5">
                      <span className="uppercase font-bold text-accent">EXECUTIVE ABSTRACT</span>
                      <span>COORD {selectedDestination.latitude.toFixed(2)}° / {selectedDestination.longitude.toFixed(2)}°</span>
                    </div>
                    <p className="text-[11px] sm:text-xs text-white/80 font-sans leading-relaxed pt-0.5">
                      {selectedDestination.description}
                    </p>
                  </div>

                  {/* Authority / Governance */}
                  {selectedDestination.managedBy && (
                    <div className="flex items-start justify-between gap-2 p-2 sm:p-2.5 rounded-xl bg-white/[0.02] border border-white/5 font-mono text-[9px] sm:text-[9.5px]">
                      <span className="text-white/40 uppercase shrink-0">OPERATIONAL AUTHORITY</span>
                      <span className="font-semibold text-white/90 text-right break-words flex-1">
                        {selectedDestination.managedBy}
                      </span>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: ATMOSPHERIC TELEMETRY */}
              {detailTab === "telemetry" && selectedDestination.observationContext && (
                <div className="space-y-2.5 animate-in fade-in duration-200">
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-2.5 sm:p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                      <div className="flex items-center gap-1.5 text-white/40">
                        <CloudMoon className="size-3 sm:size-3.5 text-accent" />
                        <span className="text-[8px] sm:text-[8.5px] uppercase font-mono">Best Season</span>
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-semibold text-white block">
                        {selectedDestination.observationContext.bestSeason}
                      </span>
                    </div>

                    <div className="p-2.5 sm:p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                      <div className="flex items-center gap-1.5 text-white/40">
                        <Star className="size-3 sm:size-3.5 text-emerald-400" />
                        <span className="text-[8px] sm:text-[8.5px] uppercase font-mono">Darkness Index</span>
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-semibold text-white block">
                        {selectedDestination.observationContext.lightPollutionClass}
                      </span>
                      {selectedDestination.observationContext.sqmRating && (
                        <span className="text-[8.5px] sm:text-[9px] font-mono text-accent">
                          SQM: {selectedDestination.observationContext.sqmRating}
                        </span>
                      )}
                    </div>

                    {selectedDestination.observationContext.clearNightsPerYear && (
                      <div className="p-2.5 sm:p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                        <div className="flex items-center gap-1.5 text-white/40">
                          <Sun className="size-3 sm:size-3.5 text-amber-400" />
                          <span className="text-[8px] sm:text-[8.5px] uppercase font-mono">Photometric Windows</span>
                        </div>
                        <span className="text-[10px] sm:text-[11px] font-semibold text-white block">
                          ~{selectedDestination.observationContext.clearNightsPerYear} Nights / Year
                        </span>
                      </div>
                    )}

                    {selectedDestination.observationContext.humidityAverage && (
                      <div className="p-2.5 sm:p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
                        <div className="flex items-center gap-1.5 text-white/40">
                          <Droplets className="size-3 sm:size-3.5 text-blue-400" />
                          <span className="text-[8px] sm:text-[8.5px] uppercase font-mono">Moisture Level</span>
                        </div>
                        <span className="text-[10px] sm:text-[11px] font-semibold text-white block">
                          {selectedDestination.observationContext.humidityAverage}
                        </span>
                      </div>
                    )}
                  </div>

                  {selectedDestination.observationContext.visibilityNotes && (
                    <div className="p-2.5 sm:p-3 rounded-xl bg-white/[0.02] border border-white/5 text-[10.5px] sm:text-[11px] text-white/70 font-sans leading-relaxed">
                      <strong className="text-white/90 font-mono text-[8.5px] sm:text-[9px] uppercase block mb-1">OPERATIONAL VISIBILITY NOTES:</strong>
                      {selectedDestination.observationContext.visibilityNotes}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: SCIENTIFIC INSTRUMENTS & DISCOVERIES */}
              {detailTab === "instruments" && (
                <div className="space-y-2.5 animate-in fade-in duration-200">
                  {/* Key Discoveries */}
                  {selectedDestination.keyDiscoveries && selectedDestination.keyDiscoveries.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[8.5px] sm:text-[9px] font-mono uppercase text-white/40 flex items-center gap-1.5">
                        <Award className="size-3 text-amber-400" />
                        <span>Major Scientific Breakthroughs</span>
                      </span>
                      <div className="space-y-1.5">
                        {selectedDestination.keyDiscoveries.map((discovery, i) => (
                          <div key={i} className="flex items-start gap-2 p-2 sm:p-2.5 rounded-xl bg-white/[0.02] border border-white/5 text-[10.5px] sm:text-[11px] text-white/80 leading-relaxed font-sans">
                            <Atom className="size-3.5 text-accent shrink-0 mt-0.5" />
                            <span>{discovery}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Primary Telescopes */}
                  {selectedDestination.instruments && selectedDestination.instruments.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="text-[8.5px] sm:text-[9px] font-mono uppercase text-white/40 flex items-center gap-1.5">
                        <Telescope className="size-3 text-accent" />
                        <span>Telescope & Instrument Inventory</span>
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {selectedDestination.instruments.map((inst, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-md sm:rounded-lg bg-white/5 border border-white/10 text-[9px] sm:text-[9.5px] font-mono text-white/85">
                            {inst}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: VISITING PROTOCOLS & ACTIVITIES */}
              {detailTab === "access" && (
                <div className="space-y-2.5 animate-in fade-in duration-200">
                  <span className="text-[8.5px] sm:text-[9px] font-mono uppercase text-white/40 flex items-center gap-1.5">
                    <ShieldCheck className="size-3 text-emerald-400" />
                    <span>Public Stargazing & Scientific Access</span>
                  </span>
                  
                  {selectedDestination.activities.map((act) => (
                    <div key={act.id} className="p-2.5 sm:p-3 rounded-xl border border-white/10 bg-white/[0.02] space-y-1">
                      <h4 className="text-[11px] sm:text-xs font-bold text-white uppercase tracking-wider font-display">
                        {act.type.replace('_', ' ')}
                      </h4>
                      <p className="text-[10.5px] sm:text-[11px] text-white/70 leading-relaxed font-sans">
                        {act.description}
                      </p>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {(act.requirements || []).map(req => (
                          <span key={req} className="px-1.5 py-0.5 rounded bg-white/10 text-[8px] sm:text-[8.5px] font-mono uppercase tracking-wider text-white/75">
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>

            {/* PINNED BOTTOM ACTION DOCK */}
            <div className="p-2 sm:p-2.5 md:p-3 border-t border-white/10 bg-[#080B11]/95 backdrop-blur-xl shrink-0">
              <button 
                type="button"
                onClick={() => {
                  onOpenAIGuide(selectedDestination.name);
                  window.dispatchEvent(
                    new CustomEvent("cosmora:open-ai", {
                      detail: { 
                        targetName: selectedDestination.name, 
                        query: `Act as a tour guide and tell me about ${selectedDestination.name}` 
                      },
                    })
                  );
                }}
                className="w-full py-2 sm:py-2.5 rounded-xl bg-accent text-black font-display font-bold text-[11px] sm:text-xs tracking-wider hover:bg-white hover:text-black transition-all active:scale-95 shadow-[0_0_16px_rgba(75,158,255,0.3)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="size-3.5" />
                <span>ASK AI TOUR GUIDE</span>
                <ArrowRight className="size-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
