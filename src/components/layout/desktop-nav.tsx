"use client";

import React, { useState, useEffect } from "react";
import { AudioAmbienceToggle } from "./audio-ambience-toggle";
import { Bot, ShoppingCart } from "lucide-react";

interface DesktopNavProps {
  onOpenAI?: () => void;
  onOpenCart?: () => void;
}

export function DesktopNav({ onOpenAI, onOpenCart }: DesktopNavProps) {
  const [currentTime, setCurrentTime] = useState<string>("");
  const [cartCount, setCartCount] = useState<number>(0);

  // Live UTC Clock for Telemetry Chip
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toUTCString().slice(17, 22) + " UTC");
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Track live cart count from localStorage and global custom event
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

  const handleOpenAI = () => {
    if (onOpenAI) onOpenAI();
    window.dispatchEvent(new CustomEvent("cosmora:open-ai"));
  };

  const handleOpenCart = () => {
    if (onOpenCart) onOpenCart();
    window.dispatchEvent(new CustomEvent("cosmora:open-cart"));
  };

  return (
    <nav className="hidden lg:flex items-center gap-2 xl:gap-2.5" aria-label="COSMORA Telemetry & Ambience">
      {/* Ambient Cosmic Soundscape Toggle */}
      <AudioAmbienceToggle />

      {/* Live Telemetry Ticker Chip */}
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0D1117] border border-white/10 font-mono text-[10px] text-white/70 shadow-sm">
        <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>{currentTime || "UTC LIVE"}</span>
      </div>

      {/* Observation Cart Drawer Button */}
      <button
        onClick={handleOpenCart}
        className="relative flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.06] hover:bg-white/[0.12] border border-white/15 hover:border-accent/50 text-white/90 hover:text-white transition-all duration-200 cursor-pointer group active:scale-95 shadow-sm"
        aria-label="Open Observation Cart Drawer"
      >
        <ShoppingCart className="size-3.5 text-accent group-hover:scale-110 transition-transform" />
        <span className="text-[10px] font-mono font-semibold tracking-wider">CART</span>
        {cartCount > 0 && (
          <span className="px-1.5 min-w-[16px] h-4 rounded-full bg-accent text-black font-mono text-[9px] font-bold flex items-center justify-center shadow-sm animate-in zoom-in-50">
            {cartCount}
          </span>
        )}
      </button>

      {/* AI Reactor Button — Desktop Only */}
      <button
        onClick={handleOpenAI}
        className="relative flex items-center justify-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-accent/20 to-accent/5 border border-accent/40 hover:border-accent/80 hover:bg-accent/20 text-accent transition-all duration-200 cursor-pointer group active:scale-95"
        aria-label="Open COSMOS AI Companion"
      >
        <span className="absolute inset-[-2px] rounded-full border border-accent/30 animate-ping opacity-40 pointer-events-none" />
        <Bot className="size-3.5 group-hover:scale-110 transition-transform" />
        <span className="text-[10px] font-mono font-bold tracking-widest uppercase">AI</span>
      </button>
    </nav>
  );
}
