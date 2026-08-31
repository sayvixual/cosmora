"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { 
  Crosshair, 
  ChevronDown, 
  Search, 
  Sparkles, 
  Check, 
  ShoppingCart, 
  Orbit, 
  Eye, 
  Telescope,
  X,
  Layers,
  Radio
} from "lucide-react";
import { cn } from "@/lib/utils";
import { TargetType } from "@/features/ai/types";

export interface CelestialTargetItem {
  id: string;
  name: string;
  shortName: string;
  designation: string;
  category: "planet" | "deep-space" | "spacecraft" | "meteor";
  type: TargetType;
  symbol: string;
  accentColor: string; // Tailwind color class or hex
  glowClass: string;
  distance: string;
  magnitude: string;
  altitude: string;
  summary: string;
  tags: string[];
}

export const CELESTIAL_TARGETS_CATALOG: CelestialTargetItem[] = [
  {
    id: "mars",
    name: "Mars",
    shortName: "Mars",
    designation: "Sol IV • Red Planet",
    category: "planet",
    type: "planet",
    symbol: "♂",
    accentColor: "from-red-500 to-amber-600",
    glowClass: "shadow-[0_0_15px_rgba(239,68,68,0.5)] border-red-500/40 text-red-400",
    distance: "1.52 AU",
    magnitude: "-0.8 mag",
    altitude: "54° Meridian",
    summary: "Iron oxide regolith, Olympus Mons volcano, and Syrtis Major basalt plateau.",
    tags: ["Opposition", "Rocky Planet", "Basalt", "Polar Ice"]
  },
  {
    id: "jupiter",
    name: "Jupiter",
    shortName: "Jupiter",
    designation: "Sol V • Jovian Giant",
    category: "planet",
    type: "planet",
    symbol: "♃",
    accentColor: "from-amber-400 to-orange-600",
    glowClass: "shadow-[0_0_15px_rgba(245,158,11,0.5)] border-amber-500/40 text-amber-400",
    distance: "5.20 AU",
    magnitude: "-2.4 mag",
    altitude: "62° Zenith",
    summary: "Great Red Spot storm, dynamic turbulent equatorial bands, 4 Galilean moons.",
    tags: ["Great Red Spot", "Galilean Moons", "Gas Giant"]
  },
  {
    id: "saturn",
    name: "Saturn",
    shortName: "Saturn",
    designation: "Sol VI • Ringed Monarch",
    category: "planet",
    type: "planet",
    symbol: "♄",
    accentColor: "from-yellow-300 to-amber-500",
    glowClass: "shadow-[0_0_15px_rgba(251,191,36,0.5)] border-yellow-500/40 text-yellow-300",
    distance: "9.58 AU",
    magnitude: "+0.6 mag",
    altitude: "48° S-SE",
    summary: "Magnificent ring system with Cassini Division and hydrocarbon moon Titan.",
    tags: ["Cassini Division", "Titan", "Ring System"]
  },
  {
    id: "moon",
    name: "Moon",
    shortName: "Moon",
    designation: "Earth I • Luna",
    category: "planet",
    type: "moon",
    symbol: "☾",
    accentColor: "from-slate-200 to-slate-400",
    glowClass: "shadow-[0_0_15px_rgba(226,232,240,0.5)] border-slate-300/40 text-slate-200",
    distance: "384,400 km",
    magnitude: "-12.7 mag",
    altitude: "76° Overhead",
    summary: "Tycho impact crater rays, Mare Tranquillitatis, and crisp terminator relief.",
    tags: ["Craters", "Terminator Line", "Lunar Maria"]
  },
  {
    id: "orion",
    name: "Orion Nebula (M42)",
    shortName: "Orion M42",
    designation: "Messier 42 • NGC 1976",
    category: "deep-space",
    type: "nebula",
    symbol: "✦",
    accentColor: "from-pink-500 to-rose-600",
    glowClass: "shadow-[0_0_15px_rgba(236,72,153,0.5)] border-pink-500/40 text-pink-400",
    distance: "1,344 ly",
    magnitude: "+4.0 mag",
    altitude: "58° Elevation",
    summary: "Active stellar nursery with Trapezium young star cluster and ionized H-Alpha glow.",
    tags: ["Star Nursery", "H-Alpha", "Messier 42", "Trapezium"]
  },
  {
    id: "pleiades",
    name: "Pleiades Cluster (M45)",
    shortName: "Pleiades M45",
    designation: "Messier 45 • Seven Sisters",
    category: "deep-space",
    type: "star-cluster",
    symbol: "✧",
    accentColor: "from-cyan-400 to-blue-600",
    glowClass: "shadow-[0_0_15px_rgba(59,130,246,0.5)] border-cyan-400/40 text-cyan-400",
    distance: "444 ly",
    magnitude: "+1.6 mag",
    altitude: "72° Elevation",
    summary: "Open cluster of hot blue B-type stars immersed in luminous reflection nebulae.",
    tags: ["Seven Sisters", "Reflection Nebula", "Open Cluster"]
  },
  {
    id: "andromeda",
    name: "Andromeda Galaxy (M31)",
    shortName: "Andromeda M31",
    designation: "Messier 31 • NGC 224",
    category: "deep-space",
    type: "galaxy",
    symbol: "⊛",
    accentColor: "from-purple-400 to-indigo-600",
    glowClass: "shadow-[0_0_15px_rgba(168,85,247,0.5)] border-purple-400/40 text-purple-400",
    distance: "2.5M ly",
    magnitude: "+3.4 mag",
    altitude: "68° Elevation",
    summary: "Grand barred spiral galaxy containing 1 trillion stars on cosmic collision course.",
    tags: ["Spiral Galaxy", "Local Group", "1 Trillion Stars"]
  },
  {
    id: "perseids",
    name: "Perseid Meteor Radiant",
    shortName: "Perseids",
    designation: "109P/Swift-Tuttle Stream",
    category: "meteor",
    type: "meteor",
    symbol: "☄",
    accentColor: "from-emerald-400 to-teal-600",
    glowClass: "shadow-[0_0_15px_rgba(16,185,129,0.5)] border-emerald-400/40 text-emerald-400",
    distance: "100 km (Atmo)",
    magnitude: "ZHR ~100",
    altitude: "65° Radiant",
    summary: "High-speed 59 km/s meteor ionization trails with vivid magnesium green fireballs.",
    tags: ["Fireballs", "ZHR 100", "Ionization Trails"]
  },
  {
    id: "jwst",
    name: "James Webb Telescope",
    shortName: "JWST",
    designation: "Sun-Earth L2 Halo Orbit",
    category: "spacecraft",
    type: "spacecraft",
    symbol: "🛰",
    accentColor: "from-amber-400 to-yellow-600",
    glowClass: "shadow-[0_0_15px_rgba(234,179,8,0.5)] border-amber-400/40 text-amber-400",
    distance: "1.5M km (L2)",
    magnitude: "Infrared",
    altitude: "Deep Space",
    summary: "Gold-beryllium 6.5m hexagonal primary mirror capturing first cosmic dawn galaxies.",
    tags: ["Infrared", "L2 Lagrange", "Early Universe"]
  },
  {
    id: "voyager1",
    name: "Voyager 1 Interstellar",
    shortName: "Voyager 1",
    designation: "Interstellar Medium • 162 AU",
    category: "spacecraft",
    type: "spacecraft",
    symbol: "🛸",
    accentColor: "from-teal-300 to-emerald-500",
    glowClass: "shadow-[0_0_15px_rgba(20,184,166,0.5)] border-teal-400/40 text-teal-400",
    distance: "24.3B km",
    magnitude: "Radio 8GHz",
    altitude: "Heliosheath",
    summary: "Farthest human-made object in deep interstellar space carrying the Golden Record.",
    tags: ["Interstellar", "Golden Record", "Deep Space Network"]
  }
];

interface CelestialFocusSelectorProps {
  currentTarget: string;
  onSelectTarget: (targetName: string) => void;
  onAddToCart?: (target: CelestialTargetItem) => void;
}

export function CelestialFocusSelector({
  currentTarget,
  onSelectTarget,
  onAddToCart
}: CelestialFocusSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<"all" | "planet" | "deep-space" | "spacecraft" | "meteor">("all");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Identify currently active item
  const activeItem = useMemo(() => {
    const found = CELESTIAL_TARGETS_CATALOG.find(
      (item) => item.name.toLowerCase() === currentTarget.toLowerCase() ||
                item.shortName.toLowerCase() === currentTarget.toLowerCase() ||
                currentTarget.toLowerCase().includes(item.id.toLowerCase())
    );
    if (found) return found;

    return {
      id: currentTarget.toLowerCase().replace(/\s+/g, '-'),
      name: currentTarget,
      shortName: currentTarget,
      designation: "Custom Target",
      category: "deep-space",
      type: "deep-space",
      symbol: "✧",
      accentColor: "from-slate-400 to-slate-600",
      glowClass: "shadow-[0_0_15px_rgba(148,163,184,0.5)] border-slate-400/40 text-slate-400",
      distance: "Variable",
      magnitude: "Varies",
      altitude: "Varies",
      summary: "A dynamically selected celestial object.",
      tags: ["Custom"]
    } as CelestialTargetItem;
  }, [currentTarget]);

  // Outside click handler to close dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      // Focus search input on open
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Filter items based on category and search query
  const filteredItems = useMemo(() => {
    return CELESTIAL_TARGETS_CATALOG.filter((item) => {
      const matchCat = selectedCategory === "all" || item.category === selectedCategory;
      const query = searchQuery.toLowerCase().trim();
      const matchQuery = !query ||
        item.name.toLowerCase().includes(query) ||
        item.designation.toLowerCase().includes(query) ||
        item.summary.toLowerCase().includes(query) ||
        item.tags.some((t) => t.toLowerCase().includes(query));
      return matchCat && matchQuery;
    });
  }, [selectedCategory, searchQuery]);

  const handleChoose = (item: CelestialTargetItem) => {
    onSelectTarget(item.name);
    setIsOpen(false);
    setSearchQuery("");
  };

  return (
    <div className="relative z-50" ref={dropdownRef}>
      {/* Sleek Interactive Sci-Fi Trigger Pill */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "group flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1 sm:py-1.5 rounded-lg sm:rounded-full transition-all duration-300 font-mono text-[10px] sm:text-xs cursor-pointer select-none max-w-[125px] xs:max-w-[150px] sm:max-w-[240px] min-w-0 shrink-0",
          "bg-[#0A0E17] hover:bg-[#121927] border",
          isOpen 
            ? "border-accent shadow-[0_0_20px_rgba(75,158,255,0.35)] bg-[#121927]" 
            : "border-white/15 hover:border-white/30 shadow-md"
        )}
        aria-label="Select AI Celestial Focal Target"
        aria-expanded={isOpen}
      >
        {/* Animated Radar Pulse Mini Orb */}
        <div className="relative flex items-center justify-center size-3.5 sm:size-4.5 rounded-full bg-black/60 border border-white/20 overflow-hidden shrink-0">
          <div className={cn(
            "size-2 sm:size-2.5 rounded-full bg-gradient-to-tr transition-transform duration-300 group-hover:scale-110",
            activeItem.accentColor
          )} />
          <span className="absolute inset-0 rounded-full border border-white/30 animate-ping opacity-40" />
        </div>

        {/* Target Details Header Label */}
        <div className="flex flex-col text-left leading-tight min-w-0 flex-1">
          <div className="flex items-center gap-0.5 sm:gap-1 min-w-0">
            <span className="text-[7.5px] sm:text-[9px] uppercase tracking-wider text-white/40 group-hover:text-white/60 shrink-0">
              LOCK:
            </span>
            <span className="font-display font-bold text-white text-[10px] sm:text-xs tracking-wide group-hover:text-accent transition-colors truncate max-w-[55px] xs:max-w-[75px] sm:max-w-[130px]">
              {activeItem.name}
            </span>
          </div>
        </div>

        {/* Chevron Flip */}
        <ChevronDown className={cn(
          "size-2.5 sm:size-3.5 text-white/50 group-hover:text-white transition-transform duration-300 shrink-0",
          isOpen && "rotate-180 text-accent"
        )} />
      </button>

      {/* Holographic Tactical Command Popover Dropdown */}
      {isOpen && (
        <div className={cn(
          "absolute right-0 top-full mt-2 z-[100] w-[min(420px,calc(100vw-36px))] rounded-2xl overflow-hidden",
          "bg-[#080B14] border border-cyan-500/40 shadow-[0_25px_70px_rgba(0,0,0,0.98),0_0_40px_rgba(75,158,255,0.25)]",
          "animate-in fade-in zoom-in-95 duration-200"
        )}>
          
          {/* Header & Quick Search Bar */}
          <div className="p-3.5 border-b border-white/10 bg-[#0C111C] space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Crosshair className="size-4 text-accent animate-spin-slow" />
                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-accent font-bold">
                  CELESTIAL RADAR TARGET LOCK
                </span>
              </div>
              <span className="font-mono text-[9px] text-white/40">
                {filteredItems.length} TARGETS AVAILABLE
              </span>
            </div>

            {/* Tactical Search Field */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-white/40" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery ?? ""}
                onChange={(e) => setSearchQuery(e?.target?.value ?? "")}
                placeholder="Search planet, nebula, M42, JWST, rings, coordinates..."
                className="w-full h-9 pl-9 pr-8 rounded-xl bg-black/60 border border-white/15 text-xs text-white placeholder:text-white/35 focus:outline-none focus:border-accent font-sans transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1 overflow-x-auto scrollbar-none font-mono text-[10px]">
              {[
                { id: "all", label: "ALL TARGETS" },
                { id: "planet", label: "PLANETS & MOON" },
                { id: "deep-space", label: "DEEP SPACE" },
                { id: "meteor", label: "METEORS" },
                { id: "spacecraft", label: "SPACECRAFT" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setSelectedCategory(tab.id as any)}
                  className={cn(
                    "px-2.5 py-1 rounded-lg transition-all whitespace-nowrap",
                    selectedCategory === tab.id
                      ? "bg-accent text-black font-bold shadow-sm"
                      : "bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
                  )}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {/* Target Items List */}
          <div className="max-h-[340px] overflow-y-auto p-2.5 space-y-1.5 scrollbar-none divide-y divide-white/[0.04]">
            {filteredItems.length === 0 ? (
              <div className="py-8 text-center space-y-2">
                <Telescope className="size-6 text-white/20 mx-auto" />
                <p className="font-mono text-xs text-white/50">No celestial target found for &ldquo;{searchQuery}&rdquo;</p>
              </div>
            ) : (
              filteredItems.map((item) => {
                const isSelected = activeItem.id === item.id;
                return (
                  <div
                    key={item.id}
                    className={cn(
                      "group relative p-2.5 rounded-xl transition-all flex items-center justify-between gap-3 border",
                      isSelected
                        ? "bg-accent/15 border-accent/40 shadow-[0_0_15px_rgba(75,158,255,0.15)]"
                        : "bg-black/30 hover:bg-white/[0.06] border-transparent hover:border-white/10"
                    )}
                  >
                    {/* Left: Avatar & Info */}
                    <button
                      onClick={() => handleChoose(item)}
                      className="flex items-start gap-3 flex-1 text-left cursor-pointer"
                    >
                      {/* Celestial Orb Glyph */}
                      <div className={cn(
                        "relative size-9 rounded-xl flex items-center justify-center border shrink-0 mt-0.5 overflow-hidden",
                        item.glowClass,
                        "bg-gradient-to-tr",
                        item.accentColor
                      )}>
                        <span className="text-sm font-bold text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                          {item.symbol}
                        </span>
                      </div>

                      {/* Name & Subtext */}
                      <div className="space-y-0.5 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className={cn(
                            "font-display font-bold text-sm truncate",
                            isSelected ? "text-accent" : "text-white group-hover:text-white"
                          )}>
                            {item.name}
                          </span>
                          <span className="font-mono text-[9px] px-1.5 py-0.2 rounded bg-white/10 text-white/60">
                            {item.magnitude}
                          </span>
                        </div>

                        <div className="font-mono text-[10px] text-white/40 truncate">
                          {item.designation} • {item.distance}
                        </div>

                        <p className="font-sans text-[11px] text-white/60 line-clamp-1 group-hover:text-white/80 transition-colors">
                          {item.summary}
                        </p>
                      </div>
                    </button>

                    {/* Right: Quick Action Buttons */}
                    <div className="flex items-center gap-1 shrink-0">
                      {isSelected ? (
                        <span className="px-2 py-1 rounded-md bg-accent text-black font-mono text-[9px] font-bold flex items-center gap-1 shadow-sm">
                          <Check className="size-3 stroke-[3]" />
                          LOCKED
                        </span>
                      ) : (
                        <button
                          onClick={() => handleChoose(item)}
                          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-accent hover:text-black text-white/80 font-mono text-[10px] font-semibold transition-all border border-white/10 hover:border-transparent cursor-pointer"
                        >
                          FOCUS
                        </button>
                      )}

                      {onAddToCart && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onAddToCart(item);
                          }}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-accent/20 border border-white/10 hover:border-accent/40 text-white/60 hover:text-accent transition-all cursor-pointer"
                          title={`Add ${item.name} to Observation Cart`}
                        >
                          <ShoppingCart className="size-3" />
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer Telemetry Banner */}
          <div className="p-2.5 px-3.5 border-t border-white/10 bg-[#090D16] flex items-center justify-between font-mono text-[10px] text-white/40">
            <div className="flex items-center gap-1.5 text-accent">
              <Radio className="size-3 animate-pulse" />
              <span>NASA JPL HORIZONS SYNCHRONIZED</span>
            </div>
            <span>J2000 EPOCH</span>
          </div>

        </div>
      )}
    </div>
  );
}
