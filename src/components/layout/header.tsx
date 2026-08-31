"use client";

import React, { useState, useEffect } from "react";
import { Logo } from "./logo";
import { DesktopNav } from "./desktop-nav";
import { MobileDrawer } from "./mobile-drawer";
import { SpaceSearchModal } from "./space-search-modal";
import { Menu, Bot, ShoppingCart } from "lucide-react";
import { cn } from "@/lib/utils";

interface HeaderProps {
  onOpenAI?: () => void;
  onOpenMobileMenu?: () => void;
  onSelectPlanet?: (planetId: string) => void;
}

export function Header({ onOpenAI, onOpenMobileMenu, onSelectPlanet }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState<boolean>(false);
  const [isSearchOpen, setIsSearchOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [cartCount, setCartCount] = useState<number>(0);

  // Dynamic Scroll Detection
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
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

  // Listen for custom event triggers from anywhere in the app
  useEffect(() => {
    const handleOpenSearchEvent = () => setIsSearchOpen(true);
    const handleOpenMobileMenuEvent = () => setIsMobileMenuOpen(true);

    window.addEventListener("cosmora:open-search", handleOpenSearchEvent);
    window.addEventListener("cosmora:open-mobile-menu", handleOpenMobileMenuEvent);

    return () => {
      window.removeEventListener("cosmora:open-search", handleOpenSearchEvent);
      window.removeEventListener("cosmora:open-mobile-menu", handleOpenMobileMenuEvent);
    };
  }, []);

  const handleOpenAI = () => {
    if (onOpenAI) onOpenAI();
    window.dispatchEvent(new CustomEvent("cosmora:open-ai"));
  };

  const handleOpenCart = () => {
    window.dispatchEvent(new CustomEvent("cosmora:open-cart"));
  };

  const handleOpenMobile = () => {
    if (onOpenMobileMenu) onOpenMobileMenu();
    setIsMobileMenuOpen(true);
  };

  return (
    <>
      <header className="pt-2 sm:pt-3 pb-1 sm:pb-1.5 shrink-0 z-50 w-full flex justify-center px-4 pointer-events-none transition-all duration-300">
        {/* Floating Centered Pill Navbar Box */}
        <div
          className={cn(
            "pointer-events-auto inline-flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-2 rounded-full transition-all duration-300 max-w-[95vw]",
            "bg-[#05070A]/85 backdrop-blur-2xl border border-white/15",
            isScrolled
              ? "shadow-[0_15px_40px_rgba(0,0,0,0.9),0_0_25px_rgba(75,158,255,0.18)] border-white/25 bg-[#05070A]/95 scale-[0.98]"
              : "shadow-[0_10px_30px_rgba(0,0,0,0.7),0_0_15px_rgba(75,158,255,0.08)]"
          )}
        >
          {/* Brand Logo */}
          <Logo />

          {/* Vertical Divider */}
          <div className="h-4 w-[1px] bg-white/15 shrink-0 hidden lg:block" />

          {/* Desktop Navigation Deck / Tools */}
          <DesktopNav
            onOpenAI={handleOpenAI}
            onOpenCart={handleOpenCart}
          />

          {/* Mobile & Tablet Quick HUD Actions */}
          <div className="flex items-center gap-1.5 lg:hidden">
            {/* Quick Cart Drawer Button */}
            <button
              onClick={handleOpenCart}
              className="relative flex items-center justify-center size-8 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-white active:scale-95 transition-all cursor-pointer"
              aria-label="Open Observation Cart Drawer"
            >
              <ShoppingCart className="size-3.5 text-accent" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 size-4 rounded-full bg-accent text-black font-mono text-[8px] font-bold flex items-center justify-center shadow-md animate-in zoom-in-50">
                  {cartCount}
                </span>
              )}
            </button>

            {/* AI Bot Button */}
            <button
              onClick={handleOpenAI}
              className="relative flex items-center justify-center size-8 rounded-full bg-accent/15 hover:bg-accent/30 border border-accent/40 hover:border-accent/80 text-accent active:scale-95 transition-all cursor-pointer"
              aria-label="Open COSMOS AI Companion"
            >
              <span className="absolute inset-[-2px] rounded-full border border-accent/30 animate-ping opacity-40 pointer-events-none" />
              <Bot className="size-4" />
            </button>

            {/* Mobile Sci-Fi Hamburger Toggle */}
            <button
              onClick={handleOpenMobile}
              className="flex items-center justify-center size-8 rounded-full bg-white/[0.08] hover:bg-white/[0.15] border border-white/20 text-white active:scale-95 transition-all cursor-pointer"
              aria-label="Open Navigation Menu"
            >
              <Menu className="size-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Celestial Command Palette Search Modal */}
      <SpaceSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectPlanet={onSelectPlanet}
        onOpenAI={handleOpenAI}
      />

      {/* Fullscreen Sci-Fi Mobile Holo-Deck Menu */}
      <MobileDrawer
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenAI={handleOpenAI}
        onOpenSearch={() => setIsSearchOpen(true)}
        onSelectPlanet={onSelectPlanet}
      />
    </>
  );
}

