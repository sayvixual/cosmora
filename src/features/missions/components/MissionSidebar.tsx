"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { SpaceMission, MissionCategory } from "../types";
import { 
  Rocket, 
  Search, 
  X, 
  ArrowLeft, 
  ArrowRight, 
  Telescope, 
  Globe, 
  Radio, 
  Sparkles, 
  Atom, 
  Award, 
  ShieldCheck, 
  Zap, 
  Compass, 
  Gauge, 
  Calendar, 
  Clock, 
  Layers, 
  CheckCircle2, 
  Crosshair, 
  FileText,
  Eye
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MissionSidebarProps {
  missions: SpaceMission[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onHover?: (id: string | null) => void;
  onOpenAIGuide: (missionName: string) => void;
  onView3D?: () => void;
}

const CATEGORY_TABS: { id: "all" | MissionCategory; label: string; icon: any }[] = [
  { id: "all", label: "ALL", icon: Compass },
  { id: "space_telescope", label: "TELESCOPES", icon: Telescope },
  { id: "interstellar_probe", label: "PROBES", icon: Radio },
  { id: "planetary_rover", label: "ROVERS", icon: Crosshair },
  { id: "space_station", label: "STATIONS", icon: Layers },
  { id: "lunar_exploration", label: "LUNAR", icon: Rocket },
];

type DetailTab = "profile" | "telemetry" | "hardware" | "discoveries";

export function MissionSidebar({
  missions,
  selectedId,
  onSelect,
  onHover,
  onOpenAIGuide,
  onView3D,
}: MissionSidebarProps) {
  const selectedMission = missions.find(m => m.id === selectedId);
  const [renderState, setRenderState] = useState<'list' | 'detail'>('list');
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | MissionCategory>("all");
  const [detailTab, setDetailTab] = useState<DetailTab>("profile");
  const [imgError, setImgError] = useState(false);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (selectedId) {
      setRenderState('detail');
      setDetailTab('profile');
      setImgError(false);
    } else {
      setRenderState('list');
    }
  }, [selectedId]);

  const handleCategoryWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    if (e.deltaY !== 0 && categoryScrollRef.current) {
      categoryScrollRef.current.scrollLeft += e.deltaY;
    }
  };

  // Filter missions by category and search keyword
  const filteredMissions = useMemo(() => {
    return missions.filter(m => {
      const matchesCategory = selectedCategory === "all" || m.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchesQuery = !query ||
        m.name.toLowerCase().includes(query) ||
        m.agency.toLowerCase().includes(query) ||
        m.targetBody.toLowerCase().includes(query) ||
        m.summary.toLowerCase().includes(query) ||
        (m.instruments || []).some(inst => inst.name.toLowerCase().includes(query)) ||
        (m.keyDiscoveries || []).some(disc => disc.title.toLowerCase().includes(query));
      return matchesCategory && matchesQuery;
    });
  }, [missions, selectedCategory, searchQuery]);

  const getCategoryBadge = (category: MissionCategory) => {
    switch (category) {
      case "space_telescope":
        return { label: "TELESCOPE", color: "text-[#4BA2FF] border-[#4BA2FF]/30 bg-[#4BA2FF]/10", icon: Telescope };
      case "interstellar_probe":
        return { label: "INTERSTELLAR", color: "text-purple-400 border-purple-500/30 bg-purple-500/10", icon: Radio };
      case "planetary_rover":
        return { label: "MARS ROVER", color: "text-orange-400 border-orange-500/30 bg-orange-500/10", icon: Crosshair };
      case "space_station":
        return { label: "ORBITAL LAB", color: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10", icon: Layers };
      case "lunar_exploration":
        return { label: "LUNAR CREW", color: "text-amber-400 border-amber-500/30 bg-amber-500/10", icon: Rocket };
      default:
        return { label: "SPACECRAFT", color: "text-white/60 border-white/20 bg-white/5", icon: Rocket };
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return { label: "ACTIVE // OPERATIONAL", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
      case "interstellar":
        return { label: "INTERSTELLAR", color: "text-purple-400 bg-purple-500/10 border-purple-500/20" };
      case "en_route":
        return { label: "EN ROUTE // FLIGHT", color: "text-accent bg-accent/10 border-accent/20" };
      case "extended_mission":
        return { label: "EXTENDED MISSION", color: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20" };
      case "completed":
        return { label: "COMPLETED", color: "text-white/40 bg-white/5 border-white/10" };
      default:
        return { label: "ONLINE", color: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" };
    }
  };

  return (
    <div className="h-full w-full flex flex-col p-2.5 sm:p-3.5 md:p-4 lg:p-5 overflow-hidden">
      {/* ========================================================================= */}
      {/* 1. SELECTION LIST VIEW                                                    */}
      {/* ========================================================================= */}
      {renderState === 'list' && (
        <div className="flex-1 flex flex-col gap-2 sm:gap-3 animate-in fade-in slide-in-from-right-4 duration-300 min-h-0">
          {/* Header & Subtitle */}
          <div className="space-y-1 sm:space-y-1.5 shrink-0">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-accent/10 border border-accent/20">
                <span className="size-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[9px] sm:text-[9.5px] font-mono font-bold tracking-widest text-accent uppercase">
                  05 // FLEET DIRECTORY
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                {onView3D && (
                  <button
                    type="button"
                    onClick={onView3D}
                    className="md:hidden flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 font-mono text-[9px] text-white/80"
                  >
                    <Rocket className="size-2.5 text-accent" />
                    <span>3D VIEW</span>
                  </button>
                )}
                <span className="text-[9px] sm:text-[9.5px] font-mono text-white/50">
                  {filteredMissions.length} OF {missions.length}
                </span>
              </div>
            </div>

            <div>
              <h1 className="text-base sm:text-lg md:text-xl font-display font-bold tracking-tight text-white leading-tight">
                Spacecraft & Deep Probes
              </h1>
              <p className="text-[10px] sm:text-[11px] text-white/50 font-sans leading-relaxed line-clamp-2 sm:line-clamp-none">
                Humanity&apos;s greatest robotic probes, orbiters, space telescopes, and exploration craft.
              </p>
            </div>
          </div>

          {/* Instant Search Bar */}
          <div className="relative flex items-center shrink-0">
            <Search className="absolute left-3 size-3.5 text-white/40" />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mission, agency, rover, instrument..."
              className="w-full pl-9 pr-8 py-1.5 sm:py-2 bg-white/[0.04] border border-white/10 focus:border-accent/50 rounded-xl text-xs text-white placeholder:text-white/30 outline-none transition-all font-sans"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 p-1 text-white/40 hover:text-white"
              >
                <X className="size-3" />
              </button>
            )}
          </div>

          {/* Filter Chips */}
          <div 
            ref={categoryScrollRef}
            onWheel={handleCategoryWheel}
            className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none shrink-0 font-mono text-[9px] sm:text-[10px] touch-pan-x"
          >
            {CATEGORY_TABS.map((tab) => {
              const isActive = selectedCategory === tab.id;
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id)}
                  className={cn(
                    "flex items-center gap-1 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg whitespace-nowrap transition-all uppercase tracking-wider font-semibold border cursor-pointer",
                    isActive
                      ? "bg-accent/20 border-accent text-white shadow-[0_0_12px_rgba(75,158,255,0.2)]"
                      : "bg-white/[0.02] border-white/10 text-white/50 hover:text-white hover:bg-white/[0.06]"
                  )}
                >
                  <Icon className="size-2.5 sm:size-3 text-accent shrink-0" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Compact Scannable Cards List */}
          <div className="flex flex-col gap-2 overflow-y-auto pb-6 pr-0.5 cosmic-scrollbar flex-1 min-h-0">
            {filteredMissions.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-6 sm:p-8 text-center text-white/40 space-y-2">
                <Rocket className="size-7 sm:size-8 text-white/20 animate-pulse" />
                <p className="text-xs font-mono">No matching space missions found.</p>
                <button 
                  onClick={() => { setSearchQuery(""); setSelectedCategory("all"); }}
                  className="text-[11px] text-accent hover:underline font-mono cursor-pointer"
                >
                  Reset all filters
                </button>
              </div>
            ) : (
              filteredMissions.map((m) => {
                const badge = getCategoryBadge(m.category);
                const BadgeIcon = badge.icon;

                return (
                  <button
                    key={m.id}
                    onClick={() => onSelect(m.id)}
                    onMouseEnter={() => onHover?.(m.id)}
                    onMouseLeave={() => onHover?.(null)}
                    className="group relative flex items-center justify-between p-2.5 sm:p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-accent/40 transition-all text-left active:scale-[0.99] overflow-hidden shrink-0 w-full cursor-pointer"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-accent/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                    
                    <div className="flex flex-col gap-1 min-w-0 pr-2 relative z-10 flex-1">
                      {/* Row 1: Category Badge & Agency */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={cn("inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[7.5px] sm:text-[8px] font-mono font-bold tracking-wider uppercase shrink-0", badge.color)}>
                          <BadgeIcon className="size-2.5 shrink-0" />
                          {badge.label}
                        </span>
                        <span className="text-[8px] sm:text-[9px] uppercase tracking-wider font-mono text-white/50 truncate">
                          {m.agency}
                        </span>
                      </div>

                      {/* Row 2: Mission Name */}
                      <h2 className="text-xs sm:text-[13px] md:text-sm font-display font-bold text-white group-hover:text-accent transition-colors leading-snug truncate">
                        {m.name}
                      </h2>

                      {/* Row 3: Target & Launch Date */}
                      <div className="text-[8px] sm:text-[8.5px] md:text-[9px] uppercase tracking-wide font-mono text-white/40 leading-tight truncate">
                        {m.targetBody} • {m.launchDate.split('-')[0]}
                      </div>
                    </div>

                    <div className="shrink-0 flex items-center gap-1.5 sm:gap-2 relative z-10 pl-1">
                      <span className="font-mono text-[7.5px] sm:text-[8.5px] px-1.5 sm:px-2 py-0.5 sm:py-1 rounded bg-white/[0.04] border border-white/10 text-white/70 whitespace-nowrap">
                        {m.telemetry.velocityKmS > 0 ? `${m.telemetry.velocityKmS} km/s` : "Stationary"}
                      </span>
                      <ArrowRight className="size-3 sm:size-3.5 text-white/30 group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 2. EXECUTIVE MISSION CONTROL DOSSIER & FLIGHT PROFILE VIEW                */}
      {/* ========================================================================= */}
      {renderState === 'detail' && selectedMission && (
        <div className="flex-1 flex flex-col gap-2 sm:gap-2.5 animate-in fade-in slide-in-from-right-4 duration-300 min-h-0">
          
          {/* Top Bar: Back, 3D Quick Toggle & Status */}
          <div className="flex items-center justify-between gap-1.5 shrink-0">
            <div className="flex items-center gap-1.5">
              <button 
                onClick={() => onSelect(null)}
                className="group flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer"
                title="Return to fleet directory"
              >
                <ArrowLeft className="size-3 text-white/70 group-hover:text-white transition-colors" />
                <span className="text-[9.5px] font-mono font-semibold tracking-wider text-white/70 group-hover:text-white transition-colors">
                  FLEET
                </span>
              </button>

              {onView3D && (
                <button
                  type="button"
                  onClick={onView3D}
                  className="md:hidden flex items-center gap-1 px-2.5 py-1 rounded-full bg-accent/15 border border-accent/30 text-accent font-mono text-[9px] font-bold transition-all cursor-pointer active:scale-95"
                >
                  <Rocket className="size-3 shrink-0" />
                  <span>3D MODEL</span>
                </button>
              )}
            </div>

            <div className={cn("flex items-center gap-1.5 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full font-mono text-[8px] sm:text-[8.5px] border truncate max-w-[170px] sm:max-w-none", getStatusBadge(selectedMission.status).color)}>
              <span className="size-1.5 rounded-full bg-current animate-pulse shrink-0" />
              <span className="truncate">{getStatusBadge(selectedMission.status).label}</span>
            </div>
          </div>

          {/* Mission Container Card */}
          <div className="flex-1 flex flex-col rounded-xl sm:rounded-2xl bg-white/[0.02] border border-white/10 overflow-hidden min-h-0">
            
            {/* Pinned 4-Column Segmented Control Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 sm:p-1.5 border-b border-white/10 bg-[#05070A]/80 backdrop-blur-md font-mono text-[8px] xs:text-[8.5px] sm:text-[9px] shrink-0 z-10">
              <button
                type="button"
                onClick={() => setDetailTab("profile")}
                className={cn(
                  "py-1.5 px-0.5 sm:px-1 rounded-lg transition-all text-center uppercase font-bold truncate cursor-pointer",
                  detailTab === "profile" 
                    ? "bg-accent text-black shadow-[0_0_12px_rgba(75,158,255,0.4)]" 
                    : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                )}
              >
                PROFILE
              </button>
              <button
                type="button"
                onClick={() => setDetailTab("telemetry")}
                className={cn(
                  "py-1.5 px-0.5 sm:px-1 rounded-lg transition-all text-center uppercase font-bold truncate cursor-pointer",
                  detailTab === "telemetry" 
                    ? "bg-accent text-black shadow-[0_0_12px_rgba(75,158,255,0.4)]" 
                    : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                )}
              >
                TELEMETRY
              </button>
              <button
                type="button"
                onClick={() => setDetailTab("hardware")}
                className={cn(
                  "py-1.5 px-0.5 sm:px-1 rounded-lg transition-all text-center uppercase font-bold truncate cursor-pointer",
                  detailTab === "hardware" 
                    ? "bg-accent text-black shadow-[0_0_12px_rgba(75,158,255,0.4)]" 
                    : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                )}
              >
                HARDWARE
              </button>
              <button
                type="button"
                onClick={() => setDetailTab("discoveries")}
                className={cn(
                  "py-1.5 px-0.5 sm:px-1 rounded-lg transition-all text-center uppercase font-bold truncate cursor-pointer",
                  detailTab === "discoveries" 
                    ? "bg-accent text-black shadow-[0_0_12px_rgba(75,158,255,0.4)]" 
                    : "text-white/50 hover:text-white hover:bg-white/[0.04]"
                )}
              >
                DISCOVERIES
              </button>
            </div>

            {/* Scrollable Container (Hero Banner + Flight KPI + Active Tab Content) */}
            <div className="flex-1 overflow-y-auto cosmic-scrollbar min-h-0 touch-pan-y overscroll-contain flex flex-col">
              
              {/* Header Hero Banner with Responsive Aspect */}
              <div className="h-20 xs:h-24 sm:h-28 md:h-32 relative w-full bg-[#080D1A] shrink-0 overflow-hidden border-b border-white/10">
                {!imgError ? (
                  <img 
                    src={selectedMission.imageUrl} 
                    alt={selectedMission.name}
                    onError={() => setImgError(true)}
                    className="absolute inset-0 w-full h-full object-cover opacity-50"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#0D182E] via-[#080E1D] to-[#04060A] flex items-center justify-center">
                    <Rocket className="size-8 sm:size-10 text-accent/40 animate-pulse" />
                  </div>
                )}
                
                <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/60 to-transparent" />
                
                {/* Top-Left Floating Badge: Launch Date */}
                <div className="absolute top-2 left-2.5 sm:top-2.5 sm:left-3 z-10">
                  <span className="px-2 py-0.5 rounded-full bg-black/75 border border-white/15 backdrop-blur-md text-[7.5px] sm:text-[8.5px] font-mono text-white/85 font-semibold shadow-lg flex items-center gap-1">
                    <span className="size-1 rounded-full bg-accent animate-pulse" />
                    <span>LAUNCH: {selectedMission.launchDate}</span>
                  </span>
                </div>

                {/* Bottom Details: Agency & Mission Title */}
                <div className="absolute bottom-2 left-3 right-3 sm:bottom-2.5 sm:left-4 sm:right-4 z-10">
                  <span className="text-[8px] sm:text-[9px] uppercase tracking-widest font-mono text-accent font-bold drop-shadow block truncate mb-0.5">
                    {selectedMission.agency} • {selectedMission.targetBody}
                  </span>
                  <h2 className="text-xs xs:text-sm sm:text-base md:text-lg font-display font-bold text-white leading-tight drop-shadow truncate">
                    {selectedMission.name}
                  </h2>
                </div>
              </div>

              {/* Flight Telemetry Quick KPI Strip (Responsive 4-col on all screens) */}
              <div className="grid grid-cols-4 gap-1 p-1.5 sm:p-2 bg-white/[0.02] border-b border-white/10 font-mono text-center shrink-0">
                <div className="p-1 sm:p-1.5 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-[6.5px] sm:text-[7.5px] uppercase tracking-wider text-white/40 block">VELOCITY</span>
                  <span className="text-[8.5px] sm:text-[10px] font-bold text-accent truncate block">
                    {selectedMission.telemetry.velocityKmS}k/s
                  </span>
                </div>
                <div className="p-1 sm:p-1.5 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-[6.5px] sm:text-[7.5px] uppercase tracking-wider text-white/40 block">DISTANCE</span>
                  <span className="text-[8.5px] sm:text-[10px] font-bold text-white truncate block">
                    {selectedMission.telemetry.distanceFromEarthAU ? `${selectedMission.telemetry.distanceFromEarthAU} AU` : `${(selectedMission.telemetry.distanceFromEarthKm / 1000).toLocaleString()}k km`}
                  </span>
                </div>
                <div className="p-1 sm:p-1.5 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-[6.5px] sm:text-[7.5px] uppercase tracking-wider text-white/40 block">DELAY</span>
                  <span className="text-[8.5px] sm:text-[10px] font-bold text-amber-400 truncate block">
                    {selectedMission.telemetry.roundTripLightTimeFormatted ? selectedMission.telemetry.roundTripLightTimeFormatted.split(' ')[0] + ' ' + (selectedMission.telemetry.roundTripLightTimeFormatted.split(' ')[1] || '') : "Realtime"}
                  </span>
                </div>
                <div className="p-1 sm:p-1.5 rounded-lg bg-white/[0.02] border border-white/5">
                  <span className="text-[6.5px] sm:text-[7.5px] uppercase tracking-wider text-white/40 block">DURATION</span>
                  <span className="text-[8.5px] sm:text-[10px] font-bold text-emerald-400 truncate block">
                    {selectedMission.telemetry.solCount ? `Sol ${selectedMission.telemetry.solCount}` : `${selectedMission.telemetry.missionDurationDays.toLocaleString()}d`}
                  </span>
                </div>
              </div>

              {/* Scrollable Tab Content Body */}
              <div className="p-2.5 sm:p-3.5 flex flex-col gap-2.5 sm:gap-3 flex-1 min-h-0">
              
              {/* TAB 1: MISSION PROFILE */}
              {detailTab === "profile" && (
                <div className="space-y-2.5 sm:space-y-3 animate-in fade-in duration-200">
                  {/* Highlight Callout */}
                  {selectedMission.highlight && (
                    <div className="flex items-start gap-2 p-2.5 sm:p-3 rounded-xl bg-accent/10 border border-accent/20 text-[11px] sm:text-xs text-accent leading-relaxed font-sans">
                      <Sparkles className="size-3.5 sm:size-4 shrink-0 mt-0.5" />
                      <span>{selectedMission.highlight}</span>
                    </div>
                  )}

                  {/* Summary Abstract */}
                  <div className="p-2.5 sm:p-3 rounded-xl bg-white/[0.03] border border-white/10 space-y-1">
                    <span className="text-[8.5px] sm:text-[9px] font-mono text-accent uppercase font-bold block">
                      MISSION OVERVIEW & PURPOSE
                    </span>
                    <p className="text-[11px] sm:text-xs text-white/80 font-sans leading-relaxed">
                      {selectedMission.summary}
                    </p>
                  </div>

                  {/* Launch Metadata Details */}
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-1.5 sm:gap-2 text-[9.5px] sm:text-[10px] font-mono">
                    <div className="p-2 sm:p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="text-white/40 block mb-0.5">LAUNCH VEHICLE:</span>
                      <span className="text-white/90 font-semibold truncate block">{selectedMission.launchVehicle}</span>
                    </div>
                    <div className="p-2 sm:p-2.5 rounded-xl bg-white/[0.02] border border-white/5">
                      <span className="text-white/40 block mb-0.5">LAUNCH SITE:</span>
                      <span className="text-white/90 font-semibold block leading-tight break-words">{selectedMission.launchSite.split(',')[0]}</span>
                    </div>
                  </div>

                  {/* Primary Objectives List */}
                  <div className="space-y-1.5">
                    <span className="text-[8.5px] sm:text-[9px] font-mono uppercase text-white/40 flex items-center gap-1.5">
                      <ShieldCheck className="size-3 text-emerald-400 shrink-0" />
                      <span>Primary Scientific Objectives</span>
                    </span>
                    <div className="space-y-1">
                      {selectedMission.primaryObjectives.map((obj, i) => (
                        <div key={i} className="flex items-start gap-1.5 sm:gap-2 p-1.5 sm:p-2 rounded-lg bg-white/[0.02] border border-white/5 text-[10px] sm:text-[10.5px] text-white/75 leading-relaxed">
                          <CheckCircle2 className="size-3 text-accent shrink-0 mt-0.5" />
                          <span>{obj}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: FLIGHT TELEMETRY */}
              {detailTab === "telemetry" && (
                <div className="space-y-2.5 animate-in fade-in duration-200">
                  <div className="grid grid-cols-1 xs:grid-cols-2 gap-1.5 sm:gap-2">
                    <div className="p-2.5 sm:p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-white/40">
                        <Gauge className="size-3 text-accent shrink-0" />
                        <span className="text-[8px] sm:text-[8.5px] uppercase font-mono">Current Velocity</span>
                      </div>
                      <span className="text-[11px] sm:text-[12px] font-bold text-white block font-mono">
                        {selectedMission.telemetry.velocityKmS} km/s
                      </span>
                      <span className="text-[7.5px] sm:text-[8px] font-mono text-white/40 block">
                        ~{(selectedMission.telemetry.velocityKmS * 3600).toLocaleString()} km/h
                      </span>
                    </div>

                    <div className="p-2.5 sm:p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-white/40">
                        <Radio className="size-3 text-amber-400 shrink-0" />
                        <span className="text-[8px] sm:text-[8.5px] uppercase font-mono">Signal Round-Trip</span>
                      </div>
                      <span className="text-[10px] sm:text-[11px] font-semibold text-white block font-mono truncate">
                        {selectedMission.telemetry.roundTripLightTimeFormatted || "Instantaneous"}
                      </span>
                    </div>

                    <div className="p-2.5 sm:p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-white/40">
                        <Zap className="size-3 text-yellow-400 shrink-0" />
                        <span className="text-[8px] sm:text-[8.5px] uppercase font-mono">Power System</span>
                      </div>
                      <span className="text-[9.5px] sm:text-[10px] font-semibold text-white block font-mono leading-tight truncate">
                        {selectedMission.telemetry.powerSource}
                      </span>
                    </div>

                    <div className="p-2.5 sm:p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-0.5">
                      <div className="flex items-center gap-1.5 text-white/40">
                        <Compass className="size-3 text-purple-400 shrink-0" />
                        <span className="text-[8px] sm:text-[8.5px] uppercase font-mono">Trajectory Profile</span>
                      </div>
                      <span className="text-[9.5px] sm:text-[10px] font-semibold text-white block font-mono leading-tight truncate">
                        {selectedMission.telemetry.orbitType || "Interplanetary"}
                      </span>
                    </div>
                  </div>

                  {/* Trajectory Milestone Timeline */}
                  {selectedMission.trajectoryNodes && selectedMission.trajectoryNodes.length > 0 && (
                    <div className="p-2.5 sm:p-3 rounded-xl bg-white/[0.02] border border-white/5 space-y-2">
                      <span className="text-[8.5px] sm:text-[9px] font-mono uppercase text-white/40 block">
                        TRAJECTORY FLIGHT MILESTONES
                      </span>
                      <div className="space-y-2 border-l border-white/10 pl-3 ml-1">
                        {selectedMission.trajectoryNodes.map((node, i) => (
                          <div key={i} className="relative space-y-0.5">
                            <div className="absolute -left-[16.5px] top-1 size-2 rounded-full bg-accent" />
                            <div className="flex items-center justify-between text-[8.5px] sm:text-[9px] font-mono">
                              <span className="font-bold text-white">{node.label}</span>
                              <span className="text-accent">{node.date}</span>
                            </div>
                            <p className="text-[9.5px] sm:text-[10px] text-white/60">{node.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: HARDWARE & SENSORS */}
              {detailTab === "hardware" && (
                <div className="space-y-2 sm:space-y-2.5 animate-in fade-in duration-200">
                  <span className="text-[8.5px] sm:text-[9px] font-mono uppercase text-white/40 flex items-center gap-1.5">
                    <Telescope className="size-3 text-accent shrink-0" />
                    <span>Scientific Instrument Payload ({selectedMission.instruments.length})</span>
                  </span>

                  {selectedMission.instruments.map((inst, i) => (
                    <div key={i} className="p-2.5 sm:p-3 rounded-xl border border-white/10 bg-white/[0.02] space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-white font-display truncate">
                          {inst.name}
                        </h4>
                        <span className="px-1.5 py-0.5 rounded bg-white/5 text-[7.5px] sm:text-[8px] font-mono text-accent uppercase shrink-0">
                          {inst.type.split(' ')[0]}
                        </span>
                      </div>
                      <p className="text-[10.5px] sm:text-[11px] text-white/70 leading-relaxed font-sans">
                        {inst.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* TAB 4: KEY DISCOVERIES */}
              {detailTab === "discoveries" && (
                <div className="space-y-2 sm:space-y-2.5 animate-in fade-in duration-200">
                  <span className="text-[8.5px] sm:text-[9px] font-mono uppercase text-white/40 flex items-center gap-1.5">
                    <Award className="size-3 text-amber-400 shrink-0" />
                    <span>Historical Discoveries & Scientific Impact</span>
                  </span>

                  {selectedMission.keyDiscoveries.map((disc, i) => (
                    <div key={i} className="p-2.5 sm:p-3 rounded-xl border border-white/10 bg-white/[0.02] space-y-1">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className="text-xs font-bold text-white font-display flex items-center gap-1.5 truncate">
                          <Atom className="size-3 text-accent shrink-0" />
                          <span className="truncate">{disc.title}</span>
                        </h4>
                        {disc.year && (
                          <span className="px-1.5 py-0.5 rounded bg-black/40 border border-white/10 text-[8px] font-mono text-white/60 shrink-0">
                            {disc.year}
                          </span>
                        )}
                      </div>
                      <p className="text-[10.5px] sm:text-[11px] text-white/70 leading-relaxed font-sans">
                        {disc.description}
                      </p>
                      <div className="pt-1 border-t border-white/5 text-[9.5px] sm:text-[10px] text-accent/90 font-mono">
                        <strong>IMPACT:</strong> {disc.scientificImpact}
                      </div>
                    </div>
                  ))}
                </div>
              )}

            </div>
          </div>

          {/* PINNED BOTTOM ACTION DOCK */}
            <div className="p-2.5 sm:p-3 border-t border-white/10 bg-[#080B11]/95 backdrop-blur-xl shrink-0">
              <button 
                type="button"
                onClick={() => {
                  onOpenAIGuide(selectedMission.name);
                  window.dispatchEvent(
                    new CustomEvent("cosmora:open-ai", {
                      detail: { 
                        targetName: selectedMission.name, 
                        query: `Act as a mission specialist and tell me about ${selectedMission.name}` 
                      },
                    })
                  );
                }}
                className="w-full py-2 sm:py-2.5 rounded-xl bg-accent text-black font-display font-bold text-xs tracking-wider hover:bg-white hover:text-black transition-all active:scale-95 shadow-[0_0_16px_rgba(75,158,255,0.3)] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Sparkles className="size-3.5 shrink-0" />
                <span>ASK AI MISSION SPECIALIST</span>
                <ArrowRight className="size-3.5 shrink-0" />
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
