"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { 
  X, 
  Eye, 
  Camera, 
  BookOpen, 
  MapPin, 
  Check, 
  ExternalLink,
  Sliders,
  Compass,
  Telescope,
  Bot
} from "lucide-react";
import { Button } from "@/components/ui/button";

export type ActionModalType = "observe" | "photo" | "research" | "visit" | null;

interface ActionModalProps {
  actionType: ActionModalType;
  onClose: () => void;
  objectName?: string;
  onOpenAI?: () => void;
}

export function ActionModal({
  actionType,
  onClose,
  objectName = "Mars",
  onOpenAI,
}: ActionModalProps) {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<"observe" | "photo" | "research" | "visit">(
    actionType || "observe"
  );
  const [copiedSettings, setCopiedSettings] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync active tab if actionType prop changes
  React.useEffect(() => {
    if (actionType) setActiveTab(actionType);
  }, [actionType]);

  if (!actionType || !mounted) return null;

  const handleCopySettings = () => {
    setCopiedSettings(true);
    setTimeout(() => setCopiedSettings(false), 2000);
  };

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 sm:p-6 bg-black/85 backdrop-blur-xl animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl bg-[#080B10] border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
        aria-label={`${objectName} Action Suite`}
      >
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-white/[0.08] bg-[#0D1117]/80 backdrop-blur-md flex items-center justify-between">
          <div className="flex items-center gap-3 font-mono">
            <span className="text-white/40 text-xs uppercase tracking-widest">{objectName}</span>
            <span className="text-white/30">&gt;</span>
            <span className="text-accent font-bold text-xs uppercase tracking-widest">
              ACTION LAYER: {activeTab.toUpperCase()}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex items-center justify-between border-b border-white/[0.08] px-4 sm:px-6 bg-[#0D1117]/40 font-mono text-xs overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-4 sm:gap-6">
            <button
              onClick={() => setActiveTab("observe")}
              className={`flex items-center gap-2 py-3 border-b-2 transition-colors ${
                activeTab === "observe"
                  ? "border-accent text-white font-semibold"
                  : "border-transparent text-white/50 hover:text-white/80"
              }`}
            >
              <Eye className="size-3.5" />
              <span>OBSERVE</span>
            </button>

            <button
              onClick={() => setActiveTab("photo")}
              className={`flex items-center gap-2 py-3 border-b-2 transition-colors ${
                activeTab === "photo"
                  ? "border-accent text-white font-semibold"
                  : "border-transparent text-white/50 hover:text-white/80"
              }`}
            >
              <Camera className="size-3.5" />
              <span>PHOTOGRAPH</span>
            </button>

            <button
              onClick={() => setActiveTab("research")}
              className={`flex items-center gap-2 py-3 border-b-2 transition-colors ${
                activeTab === "research"
                  ? "border-accent text-white font-semibold"
                  : "border-transparent text-white/50 hover:text-white/80"
              }`}
            >
              <BookOpen className="size-3.5" />
              <span>RESEARCH</span>
            </button>

            <button
              onClick={() => setActiveTab("visit")}
              className={`flex items-center gap-2 py-3 border-b-2 transition-colors ${
                activeTab === "visit"
                  ? "border-accent text-white font-semibold"
                  : "border-transparent text-white/50 hover:text-white/80"
              }`}
            >
              <MapPin className="size-3.5" />
              <span>VISIT</span>
            </button>
          </div>

          <button
            onClick={() => {
              onClose();
              onOpenAI?.();
            }}
            className="hidden sm:flex items-center gap-1.5 text-accent text-xs font-mono hover:underline"
          >
            <Bot className="size-3" />
            <span>AI Advice</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-7 space-y-6 scrollbar-none">
          
          {/* TAB 1: OBSERVE */}
          {activeTab === "observe" && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="font-display font-bold text-base sm:text-lg lg:text-xl text-white">
                    Live Ephemeris &amp; Observation Windows
                  </h3>
                  <p className="text-white/60 text-xs font-mono mt-0.5">
                    Real-time coordinates and visibility conditions for {objectName}.
                  </p>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Optimal Seeing Tonight</span>
                </div>
              </div>

              {/* Coordinates Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 font-mono">
                <div className="p-2.5 sm:p-3 rounded-xl bg-[#0D1117] border border-white/10 min-w-0">
                  <span className="text-[9px] sm:text-[10px] text-white/40 uppercase block truncate">Right Ascension</span>
                  <p className="text-xs sm:text-sm font-bold text-white mt-1 truncate">21h 38m 44s</p>
                </div>
                <div className="p-2.5 sm:p-3 rounded-xl bg-[#0D1117] border border-white/10 min-w-0">
                  <span className="text-[9px] sm:text-[10px] text-white/40 uppercase block truncate">Declination</span>
                  <p className="text-xs sm:text-sm font-bold text-white mt-1 truncate">-14° 22′ 08″</p>
                </div>
                <div className="p-2.5 sm:p-3 rounded-xl bg-[#0D1117] border border-white/10 min-w-0">
                  <span className="text-[9px] sm:text-[10px] text-white/40 uppercase block truncate">Apparent Mag</span>
                  <p className="text-xs sm:text-sm font-bold text-accent mt-1 truncate">-0.8 mag</p>
                </div>
                <div className="p-2.5 sm:p-3 rounded-xl bg-[#0D1117] border border-white/10 min-w-0">
                  <span className="text-[9px] sm:text-[10px] text-white/40 uppercase block truncate">Angular Diam</span>
                  <p className="text-xs sm:text-sm font-bold text-white mt-1 truncate">14.6 arcsec</p>
                </div>
              </div>

              {/* Observation Timeline */}
              <div className="p-4 rounded-xl bg-[#0D1117] border border-white/10 space-y-3 font-mono text-xs">
                <span className="text-white/50 uppercase tracking-wider text-[10px]">
                  TODAY&apos;S VISIBILITY TIMELINE
                </span>
                <div className="grid grid-cols-3 gap-3">
                  <div className="border-l border-white/10 pl-3">
                    <span className="text-white/40 text-[10px]">Rises:</span>
                    <p className="text-white font-semibold">01:24 Local</p>
                  </div>
                  <div className="border-l border-accent/40 pl-3">
                    <span className="text-accent text-[10px]">Transit (Peak 54°):</span>
                    <p className="text-white font-semibold">04:12 Local</p>
                  </div>
                  <div className="border-l border-white/10 pl-3">
                    <span className="text-white/40 text-[10px]">Sets:</span>
                    <p className="text-white font-semibold">07:05 Local</p>
                  </div>
                </div>
              </div>

              {/* Equipment Guidance */}
              <div className="space-y-2">
                <span className="font-mono text-[10px] uppercase tracking-wider text-white/40">
                  RECOMMENDED EQUIPMENT
                </span>
                <ul className="space-y-2 text-xs text-white/80 font-sans">
                  <li className="flex items-start gap-2">
                    <Telescope className="size-4 text-accent mt-0.5 shrink-0" />
                    <span><strong>Small Scopes (70–90mm):</strong> Visible as a distinct red disc; polar ice cap discernible under steady seeing.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <Telescope className="size-4 text-accent mt-0.5 shrink-0" />
                    <span><strong>Medium/Large Scopes (150mm+):</strong> Surface albedo markings (Syrtis Major, Hellas Planitia) clearly visible with 180x–250x eyepiece.</span>
                  </li>
                </ul>
              </div>
            </div>
          )}

          {/* TAB 2: PHOTOGRAPH */}
          {activeTab === "photo" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-display font-bold text-base sm:text-lg lg:text-xl text-white">
                    Astrophotography Exposure Settings
                  </h3>
                  <p className="text-white/60 text-xs font-mono mt-0.5">
                    Planetary lucky-imaging rig configuration for {objectName}.
                  </p>
                </div>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleCopySettings}
                  className="h-8 px-3 rounded-lg border-white/15 text-xs font-mono"
                >
                  {copiedSettings ? (
                    <>
                      <Check className="size-3 text-emerald-400 mr-1" />
                      COPIED
                    </>
                  ) : (
                    <>
                      <Sliders className="size-3 mr-1" />
                      EXPORT SETTINGS
                    </>
                  )}
                </Button>
              </div>

              {/* Camera Rig Preset Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 font-mono">
                <div className="p-3 rounded-xl bg-[#0D1117] border border-white/10">
                  <span className="text-[10px] text-white/40 uppercase">Optical Focal Ratio</span>
                  <p className="text-sm font-bold text-white mt-1">f/18 – f/25 (Barlow)</p>
                </div>
                <div className="p-3 rounded-xl bg-[#0D1117] border border-white/10">
                  <span className="text-[10px] text-white/40 uppercase">Shutter Exposure</span>
                  <p className="text-sm font-bold text-white mt-1">12ms – 20ms</p>
                </div>
                <div className="p-3 rounded-xl bg-[#0D1117] border border-white/10">
                  <span className="text-[10px] text-white/40 uppercase">Sensor Gain / ISO</span>
                  <p className="text-sm font-bold text-accent mt-1">Gain 220 / ISO 800</p>
                </div>
                <div className="p-3 rounded-xl bg-[#0D1117] border border-white/10">
                  <span className="text-[10px] text-white/40 uppercase">Frame Capture Rate</span>
                  <p className="text-sm font-bold text-white mt-1">60 – 120 FPS</p>
                </div>
                <div className="p-3 rounded-xl bg-[#0D1117] border border-white/10">
                  <span className="text-[10px] text-white/40 uppercase">Total Capture Time</span>
                  <p className="text-sm font-bold text-white mt-1">120 seconds max</p>
                </div>
                <div className="p-3 rounded-xl bg-[#0D1117] border border-white/10">
                  <span className="text-[10px] text-white/40 uppercase">Stacking Selection</span>
                  <p className="text-sm font-bold text-white mt-1">Best 15% in AutoStakkert</p>
                </div>
              </div>

              {/* Pro Tip Alert */}
              <div className="p-4 rounded-xl bg-accent/10 border border-accent/20 text-xs text-white/80 space-y-1">
                <span className="font-mono text-[10px] uppercase tracking-wider text-accent font-bold">
                  PLANETARY ROTATION NOTE
                </span>
                <p>
                  Because Mars rotates rapidly (1 rotation in 24h 37m), individual un-derotated video captures must not exceed 2.5 minutes to prevent planetary surface motion blur.
                </p>
              </div>
            </div>
          )}

          {/* TAB 3: RESEARCH */}
          {activeTab === "research" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg lg:text-xl text-white">
                  Scientific Datasets &amp; Literature
                </h3>
                <p className="text-white/60 text-xs font-mono mt-0.5">
                  Peer-reviewed planetary science publications and open mission telemetry.
                </p>
              </div>

              {/* Research Items */}
              <div className="space-y-3">
                <div className="p-4 rounded-xl bg-[#0D1117] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded bg-white/5 text-accent border border-white/10">
                      NASA ADS / NATURE ASTRONOMY
                    </span>
                    <span className="font-mono text-[10px] text-white/40">2024</span>
                  </div>
                  <h4 className="font-display font-semibold text-sm text-white">
                    Subsurface Water Ice Reservoirs in the Medusae Fossae Formation on Mars
                  </h4>
                  <p className="text-xs text-white/60 leading-relaxed font-sans">
                    Radar sounding datasets from Mars Express MARSIS confirming extensive equatorial ice deposits beneath dust deposits.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#0D1117] border border-white/10 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] uppercase px-2 py-0.5 rounded bg-white/5 text-accent border border-white/10">
                      ESA SCIENTIFIC ARCHIVE
                    </span>
                    <span className="font-mono text-[10px] text-white/40">2023</span>
                  </div>
                  <h4 className="font-display font-semibold text-sm text-white">
                    Atmospheric Methane and Trace Gas Seasonal Cycle Measurements by ExoMars TGO
                  </h4>
                  <p className="text-xs text-white/60 leading-relaxed font-sans">
                    High-sensitivity infrared occultation spectrometry characterizing volatile release cycles.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: VISIT */}
          {activeTab === "visit" && (
            <div className="space-y-6">
              <div>
                <h3 className="font-display font-bold text-base sm:text-lg lg:text-xl text-white">
                  Astronomy Travel &amp; Mars Analog Sites
                </h3>
                <p className="text-white/60 text-xs font-mono mt-0.5">
                  Terrestrial analog research stations and dark-sky destinations.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-[#0D1117] border border-white/10 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="font-mono text-[9px] text-amber-400 uppercase tracking-widest">
                      ANALOG HABITAT
                    </span>
                    <h4 className="font-display font-bold text-sm text-white mt-1">
                      Mars Desert Research Station (MDRS)
                    </h4>
                    <p className="text-xs text-white/60 mt-1 font-sans">
                      Hanksville, Utah, USA &bull; Extreme arid landscape mirroring Martian geology.
                    </p>
                  </div>
                  <div className="flex items-center justify-between font-mono text-[11px] text-white/50 pt-2 border-t border-white/[0.06]">
                    <span>Best Time: Oct – Apr</span>
                    <span className="text-accent">Field Tours Available</span>
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-[#0D1117] border border-white/10 flex flex-col justify-between space-y-3">
                  <div>
                    <span className="font-mono text-[9px] text-amber-400 uppercase tracking-widest">
                      PREMIER OBSERVATORY
                    </span>
                    <h4 className="font-display font-bold text-sm text-white mt-1">
                      Mauna Kea Summit Observatories
                    </h4>
                    <p className="text-xs text-white/60 mt-1 font-sans">
                      Hawaii, USA &bull; 4,207m high-altitude dark sky observatory campus.
                    </p>
                  </div>
                  <div className="flex items-center justify-between font-mono text-[11px] text-white/50 pt-2 border-t border-white/[0.06]">
                    <span>Best Time: May – Oct</span>
                    <a href="#destinations" onClick={onClose} className="text-accent hover:underline">
                      View Destination &gt;
                    </a>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-white/[0.08] bg-[#0D1117]/80 backdrop-blur-md flex items-center justify-between">
          <span className="font-mono text-[10px] text-white/40">
            COSMORA UNIFIED ASTRONOMY WORKFLOW
          </span>
          <Button
            size="sm"
            onClick={onClose}
            className="h-8 px-4 rounded-lg bg-white text-black hover:bg-white/90 font-mono text-xs"
          >
            CLOSE
          </Button>
        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
