"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import { ArrowRight, Bot } from "lucide-react";
import { ChapterNav } from "./chapter-nav";
import { TelemetrySpine } from "./telemetry-spine";
import { Starfield } from "./starfield";
import { SolarSystemExplorer } from "@/features/explorer/components/SolarSystemExplorer";
import { DeepSpaceStage } from "@/features/deep-space/components/DeepSpaceStage";
import { DestinationsStage } from "@/features/destinations/components/DestinationsStage";
import { MissionsStage } from "@/features/missions/components/MissionsStage";
import { LogbookStage } from "@/features/logbook/components/LogbookStage";
import { Telescope, MapPin, Rocket, BookOpen, Camera } from "lucide-react";
import { cn } from "@/lib/utils";
import { ApodViewer } from "../nasa/apod-viewer";

interface HeroSectionProps {
  activeStage?: "home" | "explore" | "deepspace" | "destinations" | "missions" | "logbook";
  onSelectStage?: (stage: "home" | "explore" | "deepspace" | "destinations" | "missions" | "logbook") => void;
  selectedPlanetId?: string;
  onSelectPlanet?: (id: string) => void;
  onOpenAI?: (targetName?: string) => void;
  onSelectHighlight?: (id: string) => void;
  onInspectObject?: (id: string) => void;
  onOpenAction?: (action: "observe" | "photo" | "research" | "visit", objectName?: string) => void;
}

export function HeroSection({
  activeStage = "home",
  onSelectStage,
  selectedPlanetId = "mars",
  onOpenAI,
  onSelectHighlight,
  onInspectObject,
  onOpenAction,
}: HeroSectionProps) {
  const COSMIC_PHRASES = useMemo(
    () => [
      "THE UNIVERSE",
      "THE COSMOS",
      "DEEP SPACE",
      "THE GALAXY",
      "SOLAR ORBITS",
      "EXOPLANETS",
    ],
    []
  );

  const [phraseIndex, setPhraseIndex] = useState(0);
  const [currentText, setCurrentText] = useState(COSMIC_PHRASES[0]);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isApodOpen, setIsApodOpen] = useState(false);

  // Dynamic Typewriter Headline Effect
  useEffect(() => {
    if (activeStage !== "home") return;

    let timeout: NodeJS.Timeout;
    const targetPhrase = COSMIC_PHRASES[phraseIndex];

    if (!isDeleting) {
      if (currentText.length < targetPhrase.length) {
        const nextCharSpeed = 70 + Math.random() * 35;
        timeout = setTimeout(() => {
          setCurrentText(targetPhrase.slice(0, currentText.length + 1));
        }, nextCharSpeed);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
      }
    } else {
      if (currentText.length > 0) {
        timeout = setTimeout(() => {
          setCurrentText(currentText.slice(0, -1));
        }, 40);
      } else {
        timeout = setTimeout(() => {
          setIsDeleting(false);
          setPhraseIndex((prev) => (prev + 1) % COSMIC_PHRASES.length);
        }, 200);
      }
    }

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, phraseIndex, COSMIC_PHRASES, activeStage]);

  // Keyboard shortcut listener for fast stage switching
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.key === "1") {
        onSelectStage?.("home");
      } else if (e.key === "2") {
        onSelectStage?.("explore");
      } else if (e.key === "3") {
        onSelectStage?.("deepspace");
      } else if (e.key === "4") {
        onSelectStage?.("destinations");
      } else if (e.key === "Escape" && activeStage !== "home") {
        onSelectStage?.("home");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [activeStage, onSelectStage]);

  const handleChapterSelect = (chapterId: string) => {
    if (chapterId === "home" || chapterId === "explore" || chapterId === "deepspace" || chapterId === "destinations") {
      onSelectStage?.(chapterId);
    } else if (chapterId === "object-detail") {
      onInspectObject?.(selectedPlanetId);
    }
  };

  return (
    <section
      id="home"
      className={cn(
        "relative w-full h-full flex-1 flex flex-col justify-center overflow-hidden bg-[#05070A] px-3 sm:px-6 md:px-8 lg:px-12 transition-all duration-700 select-none min-h-0",
        activeStage === "home" ? "pt-3 sm:pt-6 md:pt-8 pb-3 sm:pb-6 md:pb-7" : "pt-1 sm:pt-2 pb-1.5 sm:pb-3"
      )}
      aria-label="Cosmora Dynamic Spatial Stage"
    >
      {/* Dynamic Starfield Background Canvas */}
      <Starfield />

      {/* STAGE 01: Cosmic Spiral Galaxy Visual (Visible only in HOME mode) */}
      <div
        className={cn(
          "absolute top-0 right-0 bottom-0 w-full lg:w-[68%] xl:w-[64%] h-full pointer-events-none -z-10 overflow-hidden transition-all duration-1000",
          activeStage === "home" ? "opacity-100 scale-100" : "opacity-0 scale-105 pointer-events-none"
        )}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-[#05070A] via-[#05070A]/50 to-transparent z-10 hidden lg:block" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#05070A] via-transparent to-[#05070A]/80 z-10" />
        <div className="absolute inset-0 bg-[#05070A]/60 sm:bg-[#05070A]/40 lg:bg-transparent z-10" />

        <Image
          src="/images/hero_spiral_galaxy.jpg"
          alt="Majestic spiral galaxy with floating space asteroids in deep space"
          fill
          priority
          className="object-cover object-center lg:object-right-center opacity-85 sm:opacity-95 transform scale-100 lg:scale-105 transition-transform duration-1000"
          sizes="(max-width: 1024px) 100vw, 65vw"
        />
      </div>

      {/* Main Responsive Layout Container */}
      <div className="max-w-[1440px] w-full mx-auto flex-1 flex flex-col justify-between min-h-0 relative z-10 overflow-hidden">

        {/* ========================================================================= */}
        {/* VIEW A: STAGE 01 - HOME / EXPEDITION INTRODUCTION                         */}
        {/* ========================================================================= */}
        {activeStage === "home" && (
          <div className="flex-1 flex flex-col justify-between min-h-0 animate-in fade-in zoom-in-95 duration-500">
            {/* Top / Mid Row: Left Chapter Nav, Center Editorial Copy, Right Telemetry */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6 lg:gap-8 items-center my-auto pt-1 sm:pt-2 pb-2 sm:pb-4">

              {/* Col 1: Far Left Chapter Indicator */}
              <div className="hidden xl:block xl:col-span-1">
                <ChapterNav
                  activeChapter="home"
                  onSelectChapter={handleChapterSelect}
                />
              </div>

              {/* Col 2: Dominant Editorial Copy & CTAs */}
              <div className="col-span-1 lg:col-span-8 xl:col-span-8 flex flex-col items-start gap-3.5 sm:gap-5 md:gap-6">

                {/* Technical Eyebrow */}
                <div className="inline-flex items-center gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-white/80 font-mono text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-[0.25em]">
                  <span className="size-1.5 rounded-full bg-accent animate-pulse" />
                  <span>YOUR JOURNEY BEGINS</span>
                </div>

                {/* Dynamic Headline with Fixed 2-Line Flow & Glowing Sci-Fi Cursor */}
                <h1 className="font-display font-bold text-3xl sm:text-4xl md:text-5xl lg:text-7xl xl:text-8xl tracking-[-0.03em] text-white leading-[0.98] uppercase">
                  <span className="block">EXPLORE</span>
                  <span className="inline-flex items-center whitespace-nowrap min-h-[1.05em]">
                    {currentText && (
                      <span className="bg-gradient-to-r from-white via-white to-accent/90 bg-clip-text text-transparent">
                        {currentText}
                      </span>
                    )}
                    <span
                      className={cn(
                        "inline-block w-[3px] sm:w-[5px] h-[0.72em] bg-accent shadow-[0_0_12px_#4B9EFF,0_0_24px_rgba(75,158,255,0.7)] rounded-sm animate-pulse align-middle",
                        currentText.length > 0 ? "ml-1.5 sm:ml-2.5" : "ml-0"
                      )}
                    />
                  </span>
                </h1>

                {/* Value Proposition */}
                <p className="max-w-xl text-white/70 text-xs sm:text-sm md:text-base lg:text-lg leading-relaxed font-sans font-normal">
                  Discover planets, stars, galaxies, and cosmic events.
                  Understand them with AI. Experience them in real life.
                </p>

                {/* CTAs: Sleek, proportional sci-fi action buttons */}
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 pt-1 w-full sm:w-auto">
                  <button
                    type="button"
                    onClick={() => onSelectStage?.("explore")}
                    className="group inline-flex items-center justify-center h-9 sm:h-10 px-4 sm:px-5 bg-white text-black hover:bg-white/90 rounded-full font-mono font-bold text-[11px] sm:text-xs tracking-wider uppercase shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:scale-[1.02] active:scale-95 transition-all cursor-pointer shrink-0"
                  >
                    <span>EXPLORE SPACE</span>
                    <ArrowRight className="ml-1.5 size-3.5 group-hover:translate-x-0.5 transition-transform" />
                  </button>

                  <button
                    type="button"
                    onClick={() => onOpenAI?.("Solar System")}
                    className="group inline-flex items-center justify-center h-9 sm:h-10 px-3.5 sm:px-4.5 rounded-full border border-accent/40 bg-accent/10 hover:bg-accent/20 text-accent hover:text-white font-mono font-semibold text-[11px] sm:text-xs tracking-wider uppercase backdrop-blur-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer shrink-0"
                  >
                    <Bot className="mr-1.5 size-3.5 text-accent group-hover:scale-110 transition-all" />
                    <span>ASK AI</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setIsApodOpen(true)}
                    className="group inline-flex items-center justify-center h-9 sm:h-10 px-3.5 sm:px-4 rounded-full border border-white/15 bg-white/[0.04] hover:bg-white/10 hover:border-white/30 text-white/80 hover:text-white font-mono font-medium text-[11px] sm:text-xs tracking-wider uppercase backdrop-blur-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer shrink-0"
                  >
                    <Camera className="mr-1.5 size-3.5 text-white/60 group-hover:text-accent group-hover:scale-110 transition-all" />
                    <span>NASA DAILY</span>
                  </button>
                </div>

                {/* Mobile & Tablet Cosmic Telemetry Strip */}
                <div className="w-full max-w-xl pt-1 sm:pt-2 lg:hidden">
                  <TelemetrySpine variant="horizontal" />
                </div>

              </div>

              {/* Col 3: Right Telemetry Spine (Desktop) */}
              <div className="hidden lg:flex lg:col-span-4 xl:col-span-3 justify-end">
                <TelemetrySpine variant="vertical" />
              </div>

            </div>

          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW B: STAGE 02 - 3D UNIVERSE EXPLORATION OBSERVATORY (COCKPIT LAYOUT)    */}
        {/* ========================================================================= */}
        {activeStage === "explore" && (
          <div className="flex-1 flex flex-col lg:flex-row items-stretch gap-3 w-full h-full max-h-full min-h-0 overflow-hidden animate-in fade-in zoom-in-95 duration-500">

            {/* 1. Far Left Chapter Indicator Spine */}
            <div className="hidden xl:flex items-center justify-center shrink-0 w-20 py-2">
              <ChapterNav
                activeChapter="explore"
                onSelectChapter={handleChapterSelect}
              />
            </div>

            {/* 2. Main Three.js + R3F Solar System Explorer Cockpit & Telemetry HUD */}
            <SolarSystemExplorer
              initialObjectId={selectedPlanetId}
              onSelectStage={onSelectStage}
              onOpenAI={onOpenAI}
            />

          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW C: STAGE 03 - DEEP SPACE OBSERVATORY (GALAXIES, NEBULAE, STARS)      */}
        {/* ========================================================================= */}
        {activeStage === "deepspace" && (
          <div className="flex-1 flex flex-col lg:flex-row items-stretch gap-3 w-full h-full max-h-full min-h-0 overflow-hidden animate-in fade-in zoom-in-95 duration-500">

            {/* 1. Far Left Chapter Indicator Spine */}
            <div className="hidden xl:flex items-center justify-center shrink-0 w-20 py-2">
              <ChapterNav
                activeChapter="deepspace"
                onSelectChapter={handleChapterSelect}
              />
            </div>

            {/* 2. Main Deep Space Interactive Cockpit */}
            <DeepSpaceStage
              initialObjectId="andromeda"
              onSelectStage={onSelectStage}
              onOpenAI={onOpenAI}
              onOpenAction={onOpenAction}
            />

          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW D: STAGE 04 - DESTINATIONS OBSERVATORY (EARTH 3D + HUD COCKPIT)       */}
        {/* ========================================================================= */}
        {activeStage === "destinations" && (
          <div className="flex-1 flex flex-col lg:flex-row items-stretch gap-3 w-full h-full max-h-full min-h-0 overflow-hidden animate-in fade-in zoom-in-95 duration-500">

            {/* 1. Far Left Chapter Indicator Spine */}
            <div className="hidden xl:flex items-center justify-center shrink-0 w-20 py-2">
              <ChapterNav
                activeChapter="destinations"
                onSelectChapter={handleChapterSelect}
              />
            </div>

            {/* 2. Main Destinations Interactive Stage */}
            <DestinationsStage
              onSelectStage={onSelectStage}
              onOpenAI={onOpenAI}
            />

          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW E: STAGE 05 - SPACE MISSIONS & FLEET (SPACECRAFT 3D + HUD DOSSIER)   */}
        {/* ========================================================================= */}
        {activeStage === "missions" && (
          <div className="flex-1 flex flex-col lg:flex-row items-stretch gap-3 w-full h-full max-h-full min-h-0 overflow-hidden animate-in fade-in zoom-in-95 duration-500">

            {/* 1. Far Left Chapter Indicator Spine */}
            <div className="hidden xl:flex items-center justify-center shrink-0 w-20 py-2">
              <ChapterNav
                activeChapter="missions"
                onSelectChapter={handleChapterSelect}
              />
            </div>

            {/* 2. Main Missions Interactive Stage */}
            <MissionsStage
              onOpenAI={onOpenAI}
            />

          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW F: STAGE 06 - EXPEDITION LOGBOOK & RESEARCH NOTES (DUAL PANEL FEED)  */}
        {/* ========================================================================= */}
        {activeStage === "logbook" && (
          <div className="flex-1 flex flex-col lg:flex-row items-stretch gap-3 w-full h-full max-h-full min-h-0 overflow-hidden animate-in fade-in zoom-in-95 duration-500">

            {/* 1. Far Left Chapter Indicator Spine */}
            <div className="hidden xl:flex items-center justify-center shrink-0 w-20 py-2">
              <ChapterNav
                activeChapter="logbook"
                onSelectChapter={handleChapterSelect}
              />
            </div>

            {/* 2. Main Logbook & Research Notes Stage */}
            <LogbookStage
              onOpenAI={onOpenAI}
            />

          </div>
        )}

      </div>

      <ApodViewer isOpen={isApodOpen} onClose={() => setIsApodOpen(false)} />
    </section>
  );
}
