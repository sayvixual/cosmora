"use client";

import React, { useState, useMemo } from "react";
import { LogbookEntry, LogCategory, LogbookStats } from "../types";
import { 
  Search, 
  Plus, 
  Telescope, 
  Camera, 
  Compass, 
  FileText, 
  ArrowRight, 
  Moon, 
  MapPin,
  ShieldCheck,
  Award,
  Layers
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LogbookFeedProps {
  entries: LogbookEntry[];
  stats: LogbookStats;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onOpenCreateModal: () => void;
}

export function LogbookFeed({
  entries,
  stats,
  selectedId,
  onSelect,
  onOpenCreateModal
}: LogbookFeedProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<LogCategory | "all">("all");

  const filteredEntries = useMemo(() => {
    return entries.filter((e) => {
      const matchCat = selectedCategory === "all" || e.category === selectedCategory;
      const matchSearch =
        searchQuery.trim() === "" ||
        e.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.targetObject.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.locationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.observerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        e.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchCat && matchSearch;
    });
  }, [entries, selectedCategory, searchQuery]);

  const getCategoryBadge = (cat: LogCategory) => {
    switch (cat) {
      case "stargazing":
        return { label: "STARGAZE", icon: Moon, color: "border-sky-500/30 text-sky-400 bg-sky-500/10" };
      case "astrophotography":
        return { label: "ASTROPHOTO", icon: Camera, color: "border-purple-500/30 text-purple-400 bg-purple-500/10" };
      case "expedition":
        return { label: "EXPEDITION", icon: Compass, color: "border-amber-500/30 text-amber-400 bg-amber-500/10" };
      case "research":
        return { label: "RESEARCH", icon: FileText, color: "border-emerald-500/30 text-emerald-400 bg-emerald-500/10" };
    }
  };

  return (
    <div className="flex flex-col h-full w-full text-white overflow-hidden select-none min-h-0">

      {/* ── Header: Title + NEW LOG button ── */}
      <div className="flex items-center justify-between gap-2 px-3 pt-3 pb-2 shrink-0">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5 font-mono text-[8.5px] text-accent mb-0.5 truncate">
            <span className="size-1.5 rounded-full bg-accent animate-pulse shrink-0" />
            <span className="truncate">06 / EXPEDITION LOGBOOK</span>
            <span className="text-white/30 shrink-0">•</span>
            <span className="text-white/50 shrink-0">{entries.length} LOGS</span>
          </div>
          <h1 className="text-sm sm:text-base font-display font-bold text-white tracking-wide leading-tight">
            Observation Journal
          </h1>
        </div>

        {/* LOG NEW OBSERVATION BUTTON */}
        <button
          onClick={onOpenCreateModal}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-accent text-black font-display font-bold text-[10px] tracking-wider hover:bg-white hover:text-black transition-all active:scale-95 shadow-[0_0_10px_rgba(75,158,255,0.35)] shrink-0 cursor-pointer whitespace-nowrap"
        >
          <Plus className="size-3" />
          <span className="hidden xs:inline sm:inline">NEW LOG</span>
          <span className="xs:hidden sm:hidden inline">NEW</span>
        </button>
      </div>

      {/* ── KPI Stats Banner: always 4 cols ── */}
      <div className="grid grid-cols-4 gap-1 mx-3 mb-2 p-1.5 rounded-xl bg-white/[0.03] border border-white/10 font-mono text-center shrink-0">
        <div className="p-1 rounded-lg">
          <span className="text-[7px] uppercase tracking-wide text-white/40 block leading-none mb-0.5">SESS</span>
          <span className="text-[11px] font-bold text-white leading-none">{stats.totalSessions}</span>
        </div>
        <div className="p-1 rounded-lg">
          <span className="text-[7px] uppercase tracking-wide text-white/40 block leading-none mb-0.5">HRS</span>
          <span className="text-[11px] font-bold text-accent leading-none">{stats.totalDarkSkyHours}h</span>
        </div>
        <div className="p-1 rounded-lg">
          <span className="text-[7px] uppercase tracking-wide text-white/40 block leading-none mb-0.5">TGTS</span>
          <span className="text-[11px] font-bold text-white leading-none">{stats.targetsObserved}</span>
        </div>
        <div className="p-1 rounded-lg">
          <span className="text-[7px] uppercase tracking-wide text-white/40 block leading-none mb-0.5">BRTL</span>
          <span className="text-[11px] font-bold text-emerald-400 leading-none">C{stats.avgBortle}</span>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="relative mx-3 mb-2 shrink-0">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-white/40 pointer-events-none" />
        <input
          type="text"
          placeholder="Search logs, targets, sites..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-8 pr-10 py-1.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs text-white placeholder-white/30 focus:outline-none focus:border-accent/60 font-sans transition-all"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery("")}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[9px] font-mono text-white/40 hover:text-white"
          >
            CLEAR
          </button>
        )}
      </div>

      {/* ── Category Filter Chips: 5 cols, compact ── */}
      <div className="grid grid-cols-5 gap-1 mx-3 mb-2 shrink-0 font-mono">
        {[
          { id: "all", label: "ALL" },
          { id: "stargazing", label: "GAZE" },
          { id: "astrophotography", label: "PHOTO" },
          { id: "expedition", label: "EXPED" },
          { id: "research", label: "RES" }
        ].map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id as any)}
            className={cn(
              "py-1 px-0.5 rounded-lg border text-center transition-all cursor-pointer uppercase font-bold text-[8px] truncate",
              selectedCategory === cat.id
                ? "bg-accent text-black border-accent shadow-[0_0_8px_rgba(75,158,255,0.3)]"
                : "bg-white/[0.03] border-white/10 text-white/60 hover:text-white hover:bg-white/[0.08]"
            )}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* ── Scrollable Entry List ── */}
      <div className="flex-1 flex flex-col gap-1.5 overflow-y-auto cosmic-scrollbar px-3 pb-3 min-h-0">
        {filteredEntries.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-6 text-center border border-white/5 rounded-2xl bg-white/[0.01] mt-2">
            <Telescope className="size-7 text-white/20 mb-2 animate-pulse" />
            <p className="text-[10px] font-mono text-white/40">NO OBSERVATIONS MATCH</p>
          </div>
        ) : (
          filteredEntries.map((entry) => {
            const badge = getCategoryBadge(entry.category);
            const BadgeIcon = badge.icon;
            const isSelected = selectedId === entry.id;

            return (
              <button
                key={entry.id}
                onClick={() => onSelect(entry.id)}
                className={cn(
                  "group relative flex items-start justify-between p-3 rounded-xl border text-left transition-all active:scale-[0.99] cursor-pointer w-full gap-2 shrink-0",
                  isSelected
                    ? "bg-accent/[0.08] border-accent/60 shadow-[0_0_12px_rgba(75,158,255,0.15)]"
                    : "bg-white/[0.03] hover:bg-white/[0.07] border-white/10 hover:border-accent/40"
                )}
              >
                {/* Left info column */}
                <div className="flex flex-col gap-1 min-w-0 flex-1">
                  {/* Row 1: Badge + date */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <span className={cn(
                      "inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[7.5px] font-mono font-bold tracking-wide uppercase shrink-0",
                      badge.color
                    )}>
                      <BadgeIcon className="size-2" />
                      {badge.label}
                    </span>
                    <span className="text-[9px] font-mono text-white/50 truncate">
                      {entry.date}
                    </span>
                  </div>

                  {/* Row 2: Title */}
                  <h2 className={cn(
                    "text-xs font-display font-bold transition-colors leading-snug line-clamp-2",
                    isSelected ? "text-accent" : "text-white group-hover:text-accent"
                  )}>
                    {entry.title}
                  </h2>

                  {/* Row 3: Target */}
                  <div className="text-[9px] uppercase tracking-wide font-mono text-white/60 truncate">
                    <span className="text-accent/80 font-semibold">TARGET: </span>
                    {entry.targetObject}
                  </div>

                  {/* Row 4: Location */}
                  <div className="flex items-center gap-1 text-[8.5px] font-mono text-white/40 min-w-0">
                    <MapPin className="size-2.5 text-accent/70 shrink-0" />
                    <span className="truncate">{entry.locationName.split(',')[0]}</span>
                  </div>
                </div>

                {/* Right: Bortle + Arrow */}
                <div className="shrink-0 flex flex-col items-end gap-1.5 pt-0.5 font-mono">
                  <span className="text-[8px] px-1.5 py-0.5 rounded-full bg-white/[0.05] border border-white/10 text-emerald-400 font-bold whitespace-nowrap">
                    B{entry.skyCondition.bortleScale}
                  </span>
                  <ArrowRight className="size-3 text-white/30 group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
                </div>
              </button>
            );
          })
        )}
      </div>

    </div>
  );
}
