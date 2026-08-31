"use client";

import React, { useState, useEffect } from "react";
import { Compass, MapPin, Orbit, Telescope, BookOpen, Rocket } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileNavProps {}

export function MobileNav(_props: MobileNavProps = {}) {
  const [activeSection, setActiveSection] = useState<string>("home");

  // Synchronize with stage changes dispatched from anywhere
  useEffect(() => {
    const handleSetStage = (e: Event) => {
      const customEvent = e as CustomEvent<{ stage: string }>;
      if (customEvent.detail?.stage) {
        setActiveSection(customEvent.detail.stage);
      }
    };
    window.addEventListener("cosmora:set-stage", handleSetStage);
    return () => window.removeEventListener("cosmora:set-stage", handleSetStage);
  }, []);

  const triggerStage = (stage: string) => {
    setActiveSection(stage);
    window.dispatchEvent(new CustomEvent("cosmora:set-stage", { detail: { stage } }));
  };

  /** Nav items — all 6 stages */
  const navItems = [
    { id: "home",         label: "HOME",     Icon: Compass,   ariaLabel: "Home" },
    { id: "explore",      label: "ORBIT",    Icon: Orbit,     ariaLabel: "3D Solar Orbit" },
    { id: "deepspace",    label: "DEEP",     Icon: Telescope, ariaLabel: "Deep Space Observatory" },
    { id: "destinations", label: "DEST",     Icon: MapPin,    ariaLabel: "Destinations Observatory" },
    { id: "missions",     label: "MISSIONS", Icon: Rocket,    ariaLabel: "Space Missions" },
    { id: "logbook",      label: "LOG",      Icon: BookOpen,  ariaLabel: "Expedition Logbook" },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-2 sm:px-4 pb-[calc(0.6rem+env(safe-area-inset-bottom,0px))] pt-1.5 bg-gradient-to-t from-[#05070A] via-[#05070A]/95 to-transparent pointer-events-none">
      <nav
        className="pointer-events-auto max-w-lg mx-auto flex items-center justify-between px-1.5 sm:px-2 py-1.5 bg-[#0D1117]/90 backdrop-blur-2xl border border-white/15 rounded-full shadow-[0_15px_35px_rgba(0,0,0,0.9),0_0_20px_rgba(75,158,255,0.15)]"
        aria-label="Mobile Navigation Dock"
      >
        {/* 6 Stage nav items */}
        {navItems.map(({ id, label, Icon, ariaLabel }) => (
          <button
            key={id}
            onClick={() => triggerStage(id)}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 py-1 px-1.5 sm:px-2 rounded-full transition-all min-h-[44px] cursor-pointer flex-1",
              activeSection === id
                ? "text-accent font-semibold"
                : "text-white/55 hover:text-white"
            )}
            aria-label={ariaLabel}
          >
            <Icon className="size-3.5 sm:size-4" />
            <span className="text-[7px] sm:text-[8px] font-mono tracking-wide leading-none">{label}</span>
          </button>
        ))}



      </nav>
    </div>
  );
}
