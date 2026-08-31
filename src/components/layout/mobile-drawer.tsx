"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { 
  X, 
  Orbit, 
  Compass, 
  Telescope, 
  MapPin, 
  Layers, 
  Bot, 
  Radio, 
  Search, 
  ExternalLink,
  ChevronRight,
  Zap,
  Activity,
  ShoppingCart
} from "lucide-react";
import { Logo } from "./logo";
import { AudioAmbienceToggle } from "./audio-ambience-toggle";
import { CURATED_OBJECTS } from "@/lib/data/curated-objects";
import { cn } from "@/lib/utils";

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAI?: () => void;
  onOpenSearch?: () => void;
  onSelectPlanet?: (planetId: string) => void;
}

export function MobileDrawer({
  isOpen,
  onClose,
  onOpenAI,
  onOpenSearch,
  onSelectPlanet,
}: MobileDrawerProps) {
  const router = useRouter();
  const [currentTime, setCurrentTime] = useState<string>("");
  const [cartCount, setCartCount] = useState<number>(0);
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);

  // Live UTC Clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().slice(17, 25) + " UTC");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Track cart item count
  useEffect(() => {
    const syncCart = () => {
      try {
        const saved = localStorage.getItem("cosmora_cart");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) setCartCount(parsed.length);
        } else {
          setCartCount(0);
        }
      } catch {
        // ignore
      }
    };
    syncCart();

    const handleCartUpdated = (e: Event) => {
      const customEvent = e as CustomEvent<{ count: number }>;
      if (typeof customEvent?.detail?.count === "number") {
        setCartCount(customEvent.detail.count);
      } else {
        syncCart();
      }
    };

    window.addEventListener("cosmora:cart-updated", handleCartUpdated);
    window.addEventListener("storage", syncCart);
    return () => {
      window.removeEventListener("cosmora:cart-updated", handleCartUpdated);
      window.removeEventListener("storage", syncCart);
    };
  }, []);

  // Controlled Open/Close Lifecycle
  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
      const raf1 = requestAnimationFrame(() => {
        const raf2 = requestAnimationFrame(() => {
          setIsAnimating(true);
        });
        return () => cancelAnimationFrame(raf2);
      });
      return () => cancelAnimationFrame(raf1);
    } else if (isRendered) {
      setIsAnimating(false);
      const timer = setTimeout(() => {
        setIsRendered(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isRendered]);

  const handleRequestClose = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsRendered(false);
      onClose();
    }, 280);
  }, [onClose]);

  // Prevent background scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const navLinks = [
    { href: "#home", num: "01", label: "MISSION HOME", desc: "Observatory & Tonight's Highlights", icon: Compass },
    { href: "#explore", num: "02", label: "3D SOLAR ORBIT", desc: "Interactive Planetary Simulation", icon: Orbit },
    { href: "#deepspace", num: "03", label: "DEEP SPACE", desc: "Galaxies, Nebulae & Star Clusters", icon: Telescope },
    { href: "#destinations", num: "04", label: "DESTINATIONS", desc: "Dark Sky Observatories & Habitats", icon: MapPin },
    { href: "#missions", num: "05", label: "MISSIONS & PROBES", desc: "Spacecraft Fleet & Telescopes", icon: Zap },
    { href: "#logbook", num: "06", label: "EXPEDITION LOGBOOK", desc: "Observation Notes & Research Logs", icon: Activity },
  ];

  const quickCelestialObjects = CURATED_OBJECTS.slice(0, 4);

  const handleNavClick = (href: string) => {
    handleRequestClose();

    const targetId = href.replace("#", "");

    if (targetId === "home" || targetId === "explore" || targetId === "deepspace" || targetId === "destinations" || targetId === "missions" || targetId === "logbook") {
      window.dispatchEvent(
        new CustomEvent("cosmora:set-stage", { detail: { stage: targetId } })
      );
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    if (targetId === "object-detail") {
      window.dispatchEvent(new CustomEvent("cosmora:open-inspect"));
      return;
    }

    if (targetId === "journey") {
      window.dispatchEvent(new CustomEvent("cosmora:open-action", { detail: { actionType: "observe" } }));
      return;
    }

    const el = document.getElementById(targetId);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }
  };

  const handleCelestialSelect = (planetId: string) => {
    handleRequestClose();
    if (onSelectPlanet) {
      onSelectPlanet(planetId);
    }
    window.dispatchEvent(
      new CustomEvent("cosmora:select-planet", { detail: { planetId } })
    );
    const el = document.getElementById("explore");
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth" });
      }, 150);
    }
  };

  const handleOpenCartDrawer = () => {
    handleRequestClose();
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("cosmora:open-cart"));
    }, 150);
  };

  if (!isRendered) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 z-[90] flex flex-col bg-[#05070A]/95 backdrop-blur-2xl overflow-y-auto hud-grid-pattern transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        isAnimating ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4 pointer-events-none"
      )}
      role="dialog"
      aria-modal="true"
      aria-label="Space Navigation Holo-Deck"
    >
      {/* Top HUD Control Bar */}
      <div className="sticky top-0 z-20 flex items-center justify-between px-5 py-4 border-b border-white/[0.08] bg-[#080B10]/90 backdrop-blur-xl">
        <Logo />

        <div className="flex items-center gap-2">
          {/* Audio Ambience Toggle */}
          <AudioAmbienceToggle compact />

          {/* Close Button */}
          <button
            onClick={handleRequestClose}
            className="flex items-center justify-center size-9 rounded-full bg-white/10 hover:bg-white/20 text-white active:scale-90 transition-all cursor-pointer"
            aria-label="Close navigation menu"
          >
            <X className="size-5" />
          </button>
        </div>
      </div>

      {/* Main Drawer Body */}
      <div className="flex-1 px-4 sm:px-5 py-5 sm:py-6 pb-28 sm:pb-32 space-y-6 sm:space-y-8 max-w-lg mx-auto w-full">
        
        {/* Live Mission Status Telemetry Banner */}
        <div className="p-3.5 rounded-xl bg-[#0D1117] border border-white/10 font-mono text-xs flex items-center justify-between text-white/80">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full size-2 bg-emerald-500" />
            </span>
            <span className="text-[11px] text-emerald-400 font-semibold tracking-wider">DSN: LOCKED</span>
          </div>
          <span className="text-[11px] text-white/50">{currentTime || "LIVE UTC"}</span>
        </div>

        {/* Primary Navigation Pathways */}
        <div className="space-y-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40 block px-1">
            MISSION MODULES
          </span>
          <div className="space-y-2">
            {navLinks.map((link) => {
              const Icon = link.icon;
              return (
                <button
                  key={link.href}
                  onClick={() => handleNavClick(link.href)}
                  className="group w-full flex items-center justify-between p-3.5 rounded-xl bg-[#0D1117]/60 hover:bg-[#131924] border border-white/[0.06] hover:border-accent/40 active:scale-[0.99] transition-all text-left"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="flex items-center justify-center size-9 rounded-lg bg-white/[0.04] border border-white/10 text-accent group-hover:bg-accent group-hover:text-white transition-colors">
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] text-accent font-bold tracking-wider">
                          {link.num}
                        </span>
                        <span className="font-display font-bold text-sm text-white tracking-wide group-hover:text-accent transition-colors">
                          {link.label}
                        </span>
                      </div>
                      <p className="text-[11px] text-white/50 font-sans mt-0.5">{link.desc}</p>
                    </div>
                  </div>
                  <ChevronRight className="size-4 text-white/30 group-hover:text-accent group-hover:translate-x-1 transition-all" />
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Celestial Target Selector */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">
              QUICK CELESTIAL WARP
            </span>
            <span className="font-mono text-[10px] text-accent">SELECT &bull; INSPECT</span>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {quickCelestialObjects.map((obj) => (
              <button
                key={obj.id}
                onClick={() => handleCelestialSelect(obj.id)}
                className="group p-3 rounded-xl bg-[#0D1117] border border-white/10 hover:border-accent/50 text-left transition-all active:scale-95 flex flex-col justify-between h-20"
              >
                <div className="flex items-center justify-between">
                  <span className="font-display font-bold text-xs text-white group-hover:text-accent transition-colors">
                    {obj.name}
                  </span>
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: obj.accentColor || "#4B9EFF" }}
                  />
                </div>
                <div className="font-mono text-[9px] text-white/40 group-hover:text-white/70 transition-colors">
                  {obj.distanceValue}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Quick Cart & AI Direct Actions */}
        <div className="grid grid-cols-1 gap-3">
          {/* Observation Cart Drawer Card */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-[#131924] to-[#0D1117] border border-accent/30 space-y-2.5">
            <div className="flex items-center justify-between text-accent">
              <div className="flex items-center gap-2">
                <ShoppingCart className="size-4" />
                <span className="font-display font-bold text-xs uppercase tracking-wider">
                  OBSERVATION CART
                </span>
              </div>
              {cartCount > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-accent text-black font-mono text-[9px] font-bold">
                  {cartCount} QUEUED
                </span>
              )}
            </div>
            <p className="text-xs text-white/70 font-sans leading-relaxed">
              Review and export your celestial targets, optics parameters, and observation schedule.
            </p>
            <button
              onClick={handleOpenCartDrawer}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-accent text-black font-mono font-bold text-xs tracking-wider hover:bg-white active:scale-95 shadow-[0_0_20px_rgba(75,158,255,0.3)] transition-all cursor-pointer"
            >
              <ShoppingCart className="size-3.5" />
              <span>OPEN CART DRAWER</span>
            </button>
          </div>

          {/* COSMOS AI Direct Assistant Action */}
          <div className="p-4 rounded-2xl bg-gradient-to-b from-[#131924] to-[#0D1117] border border-white/10 space-y-2.5">
            <div className="flex items-center gap-2 text-white">
              <Bot className="size-4 text-accent" />
              <span className="font-display font-bold text-xs uppercase tracking-wider">
                COSMOS AI COMPANION
              </span>
            </div>
            <p className="text-xs text-white/70 font-sans leading-relaxed">
              Need real-time planetary ephemeris, telescope setup advice, or mission flight telemetry?
            </p>
            <button
              onClick={() => {
                handleRequestClose();
                if (onOpenAI) onOpenAI();
                setTimeout(() => {
                  window.dispatchEvent(new CustomEvent("cosmora:open-ai"));
                }, 150);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white text-black font-mono font-bold text-xs tracking-wider hover:bg-white/90 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all cursor-pointer"
            >
              <Bot className="size-3.5 text-black" />
              <span>LAUNCH AI CONSOLE</span>
            </button>
          </div>
        </div>

        {/* System Footer Diagnostics */}
        <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between font-mono text-[9px] text-white/40">
          <span>COSMORA ORBITAL ENGINE V2.4</span>
          <span>LAT: 19.82°N • LON: 155.46°W</span>
        </div>

      </div>
    </div>
  );
}
