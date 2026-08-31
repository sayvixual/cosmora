"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import { Search, Compass, Orbit, Telescope, Bot, X, ArrowRight, CornerDownLeft, Globe } from "lucide-react";
import { CURATED_OBJECTS, CuratedCelestialObject } from "@/lib/data/curated-objects";

interface SpaceSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectPlanet?: (planetId: string) => void;
  onOpenAI?: () => void;
}

interface NavDestination {
  id: string;
  title: string;
  subtitle: string;
  category: "navigation" | "celestial" | "observatory" | "tool";
  icon: typeof Search;
  href?: string;
  planetId?: string;
  metadata?: string;
  badge?: string;
}

export function SpaceSearchModal({
  isOpen,
  onClose,
  onSelectPlanet,
  onOpenAI,
}: SpaceSearchModalProps) {
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [activeFilter, setActiveFilter] = useState<"all" | "celestial" | "observatory" | "navigation">("all");
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        inputRef.current?.focus();
        setQuery("");
        setSelectedIndex(0);
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Global keyboard shortcut (Cmd+K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          const searchBtn = document.getElementById("space-search-trigger");
          searchBtn?.click();
        }
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Combined searchable data pool
  const allItems = useMemo<NavDestination[]>(() => {
    const celestialItems: NavDestination[] = CURATED_OBJECTS.map((obj: CuratedCelestialObject) => ({
      id: `celestial-${obj.id}`,
      title: obj.name,
      subtitle: `${obj.subtitle} • ${obj.typeLabel}`,
      category: "celestial",
      icon: Orbit,
      planetId: obj.id,
      metadata: `${obj.distanceValue} • ${obj.magnitude}`,
      badge: obj.category.toUpperCase(),
    }));

    const staticItems: NavDestination[] = [
      {
        id: "nav-explore",
        title: "3D Solar System & Orbit View",
        subtitle: "Interactive 3D spatial simulation of planetary orbits (Stage 02)",
        category: "navigation",
        icon: Orbit,
        href: "#explore",
        badge: "ORBIT (02)",
      },
      {
        id: "nav-deepspace",
        title: "Deep Space Observatory",
        subtitle: "Galaxies, Nebulae, and Star Clusters Interactive Exploration (Stage 03)",
        category: "navigation",
        icon: Telescope,
        href: "#deepspace",
        badge: "DEEP SPACE (03)",
      },
      {
        id: "nav-ephemeris",
        title: "Planetary Ephemeris & Deep Analysis",
        subtitle: "Coordinates, transit windows, and observation specs",
        category: "navigation",
        icon: Telescope,
        href: "#object-detail",
        badge: "EPHEMERIS",
      },
      {
        id: "nav-missions",
        title: "Space Missions & Probes Fleet",
        subtitle: "James Webb, Hubble, Voyager 1 & 2, Perseverance Mars Rover (Stage 05)",
        category: "navigation",
        icon: Orbit,
        href: "#missions",
        badge: "MISSIONS (05)",
      },
      {
        id: "nav-logbook",
        title: "Expedition Logbook & Research Notes",
        subtitle: "Observation logs, seeing indexes, Bortle conditions, and findings (Stage 06)",
        category: "navigation",
        icon: Telescope,
        href: "#logbook",
        badge: "LOGBOOK (06)",
      },
      {
        id: "nav-destinations",
        title: "Dark Sky Observatories & Habitats",
        subtitle: "Mauna Kea, Atacama (ALMA), Teide, MDRS Utah (Stage 04)",
        category: "observatory",
        icon: Globe,
        href: "#destinations",
        badge: "DESTINATIONS (04)",
      },
      {
        id: "nav-ai",
        title: "Ask COSMOS AI Assistant",
        subtitle: "Ask questions regarding astronomical ephemeris or flight data",
        category: "tool",
        icon: Bot,
        badge: "AI ASSISTANT",
      },
    ];

    return [...celestialItems, ...staticItems];
  }, []);

  // Filtered results
  const filteredItems = useMemo(() => {
    const q = query.toLowerCase().trim();
    return allItems.filter((item) => {
      const matchesFilter =
        activeFilter === "all" ||
        (activeFilter === "celestial" && item.category === "celestial") ||
        (activeFilter === "observatory" && item.category === "observatory") ||
        (activeFilter === "navigation" && (item.category === "navigation" || item.category === "tool"));

      if (!matchesFilter) return false;
      if (!q) return true;

      return (
        item.title.toLowerCase().includes(q) ||
        item.subtitle.toLowerCase().includes(q) ||
        (item.metadata && item.metadata.toLowerCase().includes(q))
      );
    });
  }, [allItems, query, activeFilter]);

  // Keyboard navigation within list
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredItems.length) % (filteredItems.length || 1));
    } else if (e.key === "Enter" && filteredItems.length > 0) {
      e.preventDefault();
      const item = filteredItems[selectedIndex];
      if (item) handleSelect(item);
    }
  };

  const handleSelect = (item: NavDestination) => {
    onClose();

    if (item.href === "#missions") {
      window.dispatchEvent(new CustomEvent("cosmora:set-stage", { detail: { stage: "missions" } }));
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (item.href === "#logbook") {
      window.dispatchEvent(new CustomEvent("cosmora:set-stage", { detail: { stage: "logbook" } }));
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (item.href === "#destinations") {
      window.dispatchEvent(new CustomEvent("cosmora:set-stage", { detail: { stage: "destinations" } }));
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (item.href === "#deepspace") {
      window.dispatchEvent(new CustomEvent("cosmora:set-stage", { detail: { stage: "deepspace" } }));
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (item.href === "#explore") {
      window.dispatchEvent(new CustomEvent("cosmora:set-stage", { detail: { stage: "explore" } }));
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (item.planetId) {
      const isDeepSpace = ["andromeda", "orion", "orion-nebula", "pleiades", "alpha-centauri", "milky-way"].includes(item.planetId);
      if (isDeepSpace) {
        window.dispatchEvent(new CustomEvent("cosmora:select-deep-space", { detail: { objectId: item.planetId } }));
        window.dispatchEvent(new CustomEvent("cosmora:set-stage", { detail: { stage: "deepspace" } }));
      } else {
        if (onSelectPlanet) {
          onSelectPlanet(item.planetId);
        }
        window.dispatchEvent(
          new CustomEvent("cosmora:select-planet", { detail: { planetId: item.planetId } })
        );
        window.dispatchEvent(new CustomEvent("cosmora:set-stage", { detail: { stage: "explore" } }));
      }
      return;
    } else if (item.id === "nav-ai") {
      if (onOpenAI) onOpenAI();
      window.dispatchEvent(new CustomEvent("cosmora:open-ai"));
    } else if (item.href) {
      const targetId = item.href.replace("#", "");
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-start justify-center pt-8 sm:pt-20 lg:pt-24 px-2 sm:px-4 bg-black/80 backdrop-blur-xl animate-in fade-in duration-200"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Celestial Search Palette"
    >
      <div
        className="w-full max-w-2xl bg-[#080B10]/95 border border-white/20 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.9),0_0_40px_rgba(75,158,255,0.15)] overflow-hidden flex flex-col max-h-[88vh] sm:max-h-[80vh] cosmic-panel"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        {/* Top Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-white/10 bg-[#0D1117]/80">
          <div className="flex items-center justify-center size-8 rounded-lg bg-accent/10 border border-accent/30 text-accent mr-3 shrink-0">
            <Search className="size-4" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={query ?? ""}
            onChange={(e) => {
              setQuery(e?.target?.value ?? "");
              setSelectedIndex(0);
            }}
            placeholder="Search celestial bodies, orbits, telescopes, coordinates..."
            className="flex-1 bg-transparent text-white placeholder:text-white/40 text-sm sm:text-base outline-none font-sans"
            aria-label="Search astronomical objects"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="p-1 text-white/40 hover:text-white mr-2"
              aria-label="Clear search input"
            >
              <X className="size-4" />
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center gap-0.5 px-2 py-1 rounded bg-white/[0.06] border border-white/15 text-[10px] font-mono text-white/50">
            ESC
          </kbd>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 px-4 py-2 border-b border-white/[0.06] bg-[#05070A]/90 overflow-x-auto scrollbar-none font-mono text-[11px]">
          <span className="text-white/30 text-[10px] uppercase mr-1">FILTER:</span>
          {(
            [
              { id: "all", label: "ALL" },
              { id: "celestial", label: "PLANETS & STARS" },
              { id: "observatory", label: "OBSERVATORIES" },
              { id: "navigation", label: "MODULES" },
            ] as const
          ).map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveFilter(filter.id)}
              className={`px-2.5 py-1 rounded-full transition-colors whitespace-nowrap ${
                activeFilter === filter.id
                  ? "bg-accent text-white font-semibold shadow-sm"
                  : "bg-white/[0.04] text-white/50 hover:text-white hover:bg-white/[0.08]"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-2 sm:p-3 space-y-1.5 scrollbar-none">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Compass className="size-8 text-white/20 mx-auto animate-pulse" />
              <p className="text-sm text-white/60 font-sans">No astronomical matches found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-white/40 font-mono">Try searching &ldquo;Mars&rdquo;, &ldquo;Jupiter&rdquo;, &ldquo;Orbit&rdquo;, or &ldquo;Mauna Kea&rdquo;</p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`group flex items-center justify-between p-3 rounded-xl cursor-pointer transition-all ${
                    isSelected
                      ? "bg-accent/15 border border-accent/40 text-white shadow-[0_0_15px_rgba(75,158,255,0.15)]"
                      : "bg-[#0D1117]/40 border border-white/[0.04] text-white/70 hover:bg-white/[0.06] hover:border-white/10"
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`flex items-center justify-center size-9 rounded-lg shrink-0 transition-colors ${
                        isSelected
                          ? "bg-accent text-white"
                          : "bg-white/[0.06] text-white/70 group-hover:text-accent"
                      }`}
                    >
                      <Icon className="size-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-display font-bold text-sm text-white truncate">
                          {item.title}
                        </span>
                        {item.badge && (
                          <span className="px-1.5 py-0.5 rounded bg-white/[0.06] border border-white/10 text-[9px] font-mono tracking-wider text-accent shrink-0">
                            {item.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-white/50 truncate font-sans mt-0.5">
                        {item.subtitle}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 ml-3">
                    {item.metadata && (
                      <span className="hidden sm:inline-block font-mono text-[10px] text-white/40">
                        {item.metadata}
                      </span>
                    )}
                    <div
                      className={`flex items-center justify-center size-6 rounded-md transition-all ${
                        isSelected ? "text-accent translate-x-0.5" : "text-white/20 group-hover:text-white/60"
                      }`}
                    >
                      {isSelected ? <CornerDownLeft className="size-3.5" /> : <ArrowRight className="size-3.5" />}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Navigation Bar */}
        <div className="px-4 py-2.5 border-t border-white/[0.08] bg-[#05070A] flex items-center justify-between font-mono text-[10px] text-white/40">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-white/10 rounded">↑</kbd>
              <kbd className="px-1 py-0.5 bg-white/10 rounded">↓</kbd> Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1 py-0.5 bg-white/10 rounded">↵</kbd> Select
            </span>
          </div>
          <span className="text-accent flex items-center gap-1">
            <span className="size-1.5 rounded-full bg-accent animate-pulse" />
            DEEP SPACE INDEX: {allItems.length} TARGETS
          </span>
        </div>
      </div>
    </div>
  );
}
