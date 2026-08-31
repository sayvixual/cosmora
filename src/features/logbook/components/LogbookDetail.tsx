"use client";

import React, { useState } from "react";
import { LogbookEntry } from "../types";
import { 
  ArrowLeft, 
  Sparkles, 
  Moon, 
  Camera, 
  FileText, 
  Download, 
  ShieldCheck, 
  Telescope, 
  Atom, 
  Sliders, 
  Check, 
  ArrowRight,
  Database,
  Layers,
  MapPin,
  Clock,
  Compass
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LogbookDetailProps {
  entry: LogbookEntry;
  onBack: () => void;
  onOpenAI?: (query: string) => void;
}

export function LogbookDetail({ entry, onBack, onOpenAI }: LogbookDetailProps) {
  const [detailTab, setDetailTab] = useState<"journal" | "sky" | "hardware" | "export">("journal");
  const [copiedStatus, setCopiedStatus] = useState<string | null>(null);
  const [imgError, setImgError] = useState(false);

  React.useEffect(() => {
    setImgError(false);
  }, [entry.id]);

  const handleExportMarkdown = () => {
    const mdContent = `# Astronomical Observation Report: ${entry.title}
**Target:** ${entry.targetObject} (${entry.targetType})
**Date & Time:** ${entry.date} ${entry.timeUtc}
**Observer:** ${entry.observerName} (${entry.observerRole})
**Location:** ${entry.locationName} (${entry.coordinates || "N/A"})
**Altitude:** ${entry.altitudeM ? `${entry.altitudeM}m` : "N/A"}

---

## 1. Sky & Atmospheric Conditions
- **Bortle Dark-Sky Scale:** Class ${entry.skyCondition.bortleScale}
- **Atmospheric Seeing:** ${entry.skyCondition.seeingIndex}
- **Atmospheric Transparency:** ${entry.skyCondition.transparencyPercent}%
- **Moon Phase:** ${entry.skyCondition.moonPhase}

---

## 2. Optical Equipment & Acquisition
- **Optics:** ${entry.imagingHardware?.telescopeOrLens || "Visual Eyepiece"}
- **Sensor:** ${entry.imagingHardware?.cameraSensor || "Human Eye"}
- **ISO / Exposure:** ISO ${entry.imagingHardware?.iso || "N/A"}, ${entry.imagingHardware?.exposureSeconds || "N/A"}s
- **Filters:** ${(entry.imagingHardware?.filtersUsed || []).join(", ") || "Broadband Clear"}

---

## 3. Executive Summary
${entry.summary}

---

## 4. Field Observation Log
${entry.detailedNotes}

---

## 5. Scientific Key Findings
${(entry.scientificFindings || []).map(f => `- ${f}`).join("\n")}
`;

    const blob = new Blob([mdContent], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cosmora_log_${entry.id}.md`;
    a.click();
    URL.revokeObjectURL(url);

    setCopiedStatus("Markdown exported!");
    setTimeout(() => setCopiedStatus(null), 2500);
  };

  const handleExportJSON = () => {
    const jsonContent = JSON.stringify(entry, null, 2);
    const blob = new Blob([jsonContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cosmora_log_${entry.id}.json`;
    a.click();
    URL.revokeObjectURL(url);

    setCopiedStatus("JSON data exported!");
    setTimeout(() => setCopiedStatus(null), 2500);
  };

  return (
    <div className="flex flex-col h-full w-full text-white overflow-hidden select-none min-h-0">

      {/* ── Top Header: Back + Verification Badge ── */}
      <div className="flex items-center justify-between gap-2 px-3 pt-2.5 pb-2 shrink-0">
        {/* Back button - always visible on mobile */}
        <button
          onClick={onBack}
          className="group flex items-center gap-1.5 px-2.5 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all cursor-pointer shrink-0"
        >
          <ArrowLeft className="size-3 text-white/70 group-hover:text-white transition-colors" />
          <span className="text-[9px] font-mono font-semibold tracking-wider text-white/70 group-hover:text-white transition-colors hidden xs:inline sm:inline">
            FEED
          </span>
        </button>

        <div className={cn(
          "flex items-center gap-1 px-2 py-1 rounded-full font-mono text-[8px] border truncate max-w-[55%]",
          entry.verified
            ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
            : "bg-accent/10 border-accent/30 text-accent"
        )}>
          <ShieldCheck className="size-2.5 shrink-0" />
          <span className="truncate">{entry.verified ? "VERIFIED" : "CUSTOM LOG"}</span>
        </div>
      </div>

      {/* ── Main card container ── */}
      <div className="flex-1 flex flex-col mx-2 mb-2 rounded-xl bg-white/[0.02] border border-white/10 overflow-hidden min-h-0">

        {/* ── Hero Banner Image ── */}
        <div className="h-20 sm:h-24 relative w-full bg-[#080D1A] shrink-0 overflow-hidden border-b border-white/10">
          {!imgError && entry.imageUrl ? (
            <img
              src={entry.imageUrl}
              alt={entry.title}
              onError={() => setImgError(true)}
              className="absolute inset-0 w-full h-full object-cover opacity-50"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-[#0D182E] via-[#080E1D] to-[#04060A] flex items-center justify-center">
              <Telescope className="size-8 text-accent/40 animate-pulse" />
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F17] via-[#0B0F17]/50 to-transparent" />

          {/* Date badge */}
          <div className="absolute top-2 left-2.5 z-10">
            <span className="px-2 py-0.5 rounded-full bg-black/70 border border-white/15 backdrop-blur-md text-[7.5px] font-mono text-white/85 font-semibold flex items-center gap-1">
              <Clock className="size-2 text-accent" />
              <span className="truncate max-w-[150px]">{entry.date} • {entry.timeUtc}</span>
            </span>
          </div>

          {/* Bottom title overlay */}
          <div className="absolute bottom-2 left-3 right-3 z-10">
            <span className="text-[7.5px] uppercase tracking-widest font-mono text-accent font-bold block mb-0.5 truncate">
              TARGET // {entry.targetObject}
            </span>
            <h2 className="text-sm sm:text-base font-display font-bold text-white leading-tight line-clamp-2">
              {entry.title}
            </h2>
          </div>
        </div>

        {/* ── Quick Telemetry KPI Strip: 4 cols ── */}
        <div className="grid grid-cols-4 gap-0.5 p-1.5 bg-white/[0.02] border-b border-white/10 font-mono text-center shrink-0">
          <div className="p-1 rounded-lg bg-white/[0.02]">
            <span className="text-[6.5px] uppercase tracking-wide text-white/40 block leading-none mb-0.5">BORTLE</span>
            <span className="text-[10px] font-bold text-emerald-400 leading-none">C{entry.skyCondition.bortleScale}</span>
          </div>
          <div className="p-1 rounded-lg bg-white/[0.02]">
            <span className="text-[6.5px] uppercase tracking-wide text-white/40 block leading-none mb-0.5">SEEING</span>
            <span className="text-[10px] font-bold text-accent leading-none">{entry.skyCondition.seeingIndex.split(' ')[0]}</span>
          </div>
          <div className="p-1 rounded-lg bg-white/[0.02]">
            <span className="text-[6.5px] uppercase tracking-wide text-white/40 block leading-none mb-0.5">TRANSP</span>
            <span className="text-[10px] font-bold text-white leading-none">{entry.skyCondition.transparencyPercent}%</span>
          </div>
          <div className="p-1 rounded-lg bg-white/[0.02]">
            <span className="text-[6.5px] uppercase tracking-wide text-white/40 block leading-none mb-0.5">ALT</span>
            <span className="text-[10px] font-bold text-amber-400 leading-none">{entry.altitudeM ? `${entry.altitudeM}m` : "SL"}</span>
          </div>
        </div>

        {/* ── Tab Navigation: 4 compact tabs ── */}
        <div className="grid grid-cols-4 gap-0.5 p-1 bg-white/[0.03] border-b border-white/10 font-mono shrink-0">
          {[
            { id: "journal", label: "JOURNAL" },
            { id: "sky", label: "SKY" },
            { id: "hardware", label: "OPTICS" },
            { id: "export", label: "EXPORT" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setDetailTab(tab.id as any)}
              className={cn(
                "py-1.5 px-1 rounded-lg transition-all text-center uppercase font-bold cursor-pointer text-[8.5px] sm:text-[9px]",
                detailTab === tab.id
                  ? "bg-accent text-black shadow-[0_0_10px_rgba(75,158,255,0.35)]"
                  : "text-white/50 hover:text-white hover:bg-white/[0.04]"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── Scrollable Tab Body ── */}
        <div className="p-3 flex flex-col gap-2.5 overflow-y-auto flex-1 cosmic-scrollbar min-h-0">

          {/* TAB 1: FIELD JOURNAL */}
          {detailTab === "journal" && (
            <div className="space-y-2.5 animate-in fade-in duration-200">

              {/* Observer Profile */}
              <div className="flex flex-col gap-2 p-2.5 rounded-xl bg-white/[0.03] border border-white/10 font-mono text-[10px]">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="size-6 rounded-full bg-accent/20 border border-accent/40 flex items-center justify-center text-accent font-bold text-xs shrink-0">
                    {entry.observerName.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <span className="font-bold text-white block text-[11px] leading-tight truncate">
                      {entry.observerName}
                    </span>
                    <span className="text-[8px] text-white/50 block leading-tight mt-0.5 truncate">
                      {entry.observerRole}
                    </span>
                  </div>
                </div>

                <div className="flex items-start gap-1.5 px-2 py-1.5 rounded-lg bg-white/[0.04] border border-white/10 text-white/80 text-[9px]">
                  <MapPin className="size-2.5 text-accent shrink-0 mt-0.5" />
                  <span className="leading-snug font-medium break-words flex-1">
                    {entry.locationName}
                  </span>
                </div>
              </div>

              {/* Summary */}
              <div className="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-1.5">
                <span className="text-[8.5px] font-mono text-accent uppercase font-bold block">
                  EXECUTIVE SUMMARY
                </span>
                <p className="text-[11px] text-white/80 font-sans leading-relaxed">
                  {entry.summary}
                </p>
              </div>

              {/* Detailed Notes */}
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 space-y-1.5">
                <span className="text-[8.5px] font-mono text-white/50 uppercase font-bold block">
                  DETAILED FIELD NOTES
                </span>
                <p className="text-[11px] text-white/70 font-sans leading-relaxed">
                  {entry.detailedNotes}
                </p>
              </div>

              {/* Scientific Findings */}
              {entry.scientificFindings && entry.scientificFindings.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[8.5px] font-mono uppercase text-emerald-400 flex items-center gap-1.5">
                    <Atom className="size-3 text-emerald-400" />
                    <span>Scientific Key Findings</span>
                  </span>
                  <div className="space-y-1">
                    {entry.scientificFindings.map((finding, i) => (
                      <div key={i} className="flex items-start gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/5 text-[10.5px] text-white/80 leading-relaxed font-sans">
                        <Check className="size-3 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{finding}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SKY CONDITIONS */}
          {detailTab === "sky" && (
            <div className="space-y-2.5 animate-in fade-in duration-200">
              <div className="grid grid-cols-2 gap-2 font-mono">
                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/10">
                  <span className="text-[8px] text-white/40 block mb-1">DARK SKY SCALE</span>
                  <span className="text-sm font-bold text-emerald-400 block">Bortle {entry.skyCondition.bortleScale}</span>
                  <span className="text-[8px] text-white/40 leading-snug">
                    {entry.skyCondition.bortleScale <= 2 ? "Pristine Dark Sky" : "Suburban / Moderate"}
                  </span>
                </div>

                <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/10">
                  <span className="text-[8px] text-white/40 block mb-1">MOON PHASE</span>
                  <span className="text-sm font-bold text-accent block leading-tight">{entry.skyCondition.moonPhase.split('(')[0]}</span>
                  <span className="text-[8px] text-white/40">Illumination Index</span>
                </div>
              </div>

              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-2">
                <span className="text-[8.5px] font-mono uppercase text-white/50 block">ATMOSPHERIC PARAMETERS</span>
                <div className="space-y-1 font-mono text-[10px]">
                  <div className="flex justify-between gap-2 py-1 border-b border-white/5">
                    <span className="text-white/40 shrink-0">Seeing Stability:</span>
                    <span className="text-white font-bold text-right">{entry.skyCondition.seeingIndex}</span>
                  </div>
                  <div className="flex justify-between gap-2 py-1 border-b border-white/5">
                    <span className="text-white/40 shrink-0">Transparency:</span>
                    <span className="text-white font-bold">{entry.skyCondition.transparencyPercent}%</span>
                  </div>
                  {entry.skyCondition.temperatureC !== undefined && (
                    <div className="flex justify-between gap-2 py-1 border-b border-white/5">
                      <span className="text-white/40 shrink-0">Temperature:</span>
                      <span className="text-white font-bold">{entry.skyCondition.temperatureC}°C</span>
                    </div>
                  )}
                  {entry.skyCondition.humidityPercent !== undefined && (
                    <div className="flex justify-between gap-2 py-1">
                      <span className="text-white/40 shrink-0">Humidity:</span>
                      <span className="text-white font-bold">{entry.skyCondition.humidityPercent}%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: HARDWARE & OPTICS */}
          {detailTab === "hardware" && (
            <div className="space-y-2.5 animate-in fade-in duration-200 font-mono">
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-1.5">
                <span className="text-[8.5px] uppercase text-accent font-bold block">PRIMARY OPTICS</span>
                <span className="text-xs text-white font-bold block leading-snug">
                  {entry.imagingHardware?.telescopeOrLens || "Standard Optical System"}
                </span>
                {entry.imagingHardware?.apertureMm && (
                  <span className="text-[9px] text-white/50 block">Aperture: {entry.imagingHardware.apertureMm}mm</span>
                )}
              </div>

              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-1.5">
                <span className="text-[8.5px] uppercase text-white/50 block">IMAGING SENSOR & EXPOSURE</span>
                <div className="space-y-1 text-[10px]">
                  <div className="flex justify-between items-start gap-2 py-1 border-b border-white/5">
                    <span className="text-white/40 shrink-0">Detector:</span>
                    <span className="text-white font-bold text-right">{entry.imagingHardware?.cameraSensor || "CMOS Sensor"}</span>
                  </div>
                  {entry.imagingHardware?.iso && (
                    <div className="flex justify-between gap-2 py-1 border-b border-white/5">
                      <span className="text-white/40">ISO Gain:</span>
                      <span className="text-white font-bold">{entry.imagingHardware.iso}</span>
                    </div>
                  )}
                  {entry.imagingHardware?.exposureSeconds && (
                    <div className="flex justify-between gap-2 py-1 border-b border-white/5">
                      <span className="text-white/40">Sub-Exposure:</span>
                      <span className="text-white font-bold">{entry.imagingHardware.exposureSeconds}s</span>
                    </div>
                  )}
                  {entry.imagingHardware?.totalIntegrationMinutes && (
                    <div className="flex justify-between gap-2 py-1">
                      <span className="text-white/40">Total Integration:</span>
                      <span className="text-accent font-bold">{entry.imagingHardware.totalIntegrationMinutes} min</span>
                    </div>
                  )}
                </div>
              </div>

              {entry.imagingHardware?.filtersUsed && entry.imagingHardware.filtersUsed.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[8.5px] uppercase text-white/40 block">OPTICAL FILTERS USED</span>
                  <div className="flex flex-wrap gap-1">
                    {entry.imagingHardware.filtersUsed.map((filter, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-lg bg-white/5 border border-white/10 text-[8.5px] text-white/80">
                        {filter}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: DATA EXPORT TERMINAL */}
          {detailTab === "export" && (
            <div className="space-y-2.5 animate-in fade-in duration-200">
              <div className="p-2.5 rounded-xl bg-white/[0.02] border border-white/10 space-y-1">
                <span className="text-[8.5px] font-mono text-accent uppercase font-bold block">
                  SCIENTIFIC DATA EXPORT
                </span>
                <p className="text-[10.5px] text-white/70 leading-relaxed font-sans">
                  Export normalized observation telemetry into standard astronomical research formats.
                </p>
              </div>

              {copiedStatus && (
                <div className="p-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-mono text-[10px] text-center">
                  ✓ {copiedStatus}
                </div>
              )}

              <div className="space-y-2">
                <button
                  onClick={handleExportMarkdown}
                  className="w-full p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-accent/40 flex items-center justify-between text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <FileText className="size-4 text-accent shrink-0" />
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-white block group-hover:text-accent transition-colors leading-tight">
                        Markdown Dossier (.md)
                      </span>
                      <span className="text-[9px] font-mono text-white/40 block truncate">Full observation journal</span>
                    </div>
                  </div>
                  <Download className="size-3.5 text-white/40 group-hover:text-accent transition-colors shrink-0 ml-2" />
                </button>

                <button
                  onClick={handleExportJSON}
                  className="w-full p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-accent/40 flex items-center justify-between text-left transition-all cursor-pointer group"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <Database className="size-4 text-emerald-400 shrink-0" />
                    <div className="min-w-0">
                      <span className="text-xs font-bold text-white block group-hover:text-emerald-400 transition-colors leading-tight">
                        JSON Data Object (.json)
                      </span>
                      <span className="text-[9px] font-mono text-white/40 block truncate">Raw metadata & imaging params</span>
                    </div>
                  </div>
                  <Download className="size-3.5 text-white/40 group-hover:text-emerald-400 transition-colors shrink-0 ml-2" />
                </button>
              </div>
            </div>
          )}

        </div>

        {/* ── Pinned Bottom Action Dock ── */}
        <div className="p-2.5 border-t border-white/10 bg-[#080B11]/95 backdrop-blur-xl shrink-0">
          <button
            onClick={() => {
              const query = `Analyze my observation log on ${entry.targetObject}: "${entry.summary}". Give scientific feedback, spectral context, and future observation recommendations.`;
              if (onOpenAI) {
                onOpenAI(query);
              }
              window.dispatchEvent(
                new CustomEvent("cosmora:open-ai", {
                  detail: { 
                    targetName: entry.targetObject, 
                    query 
                  }
                })
              );
            }}
            className="w-full py-2 rounded-xl bg-accent text-black font-display font-bold text-[11px] tracking-wider hover:bg-white hover:text-black transition-all active:scale-95 shadow-[0_0_14px_rgba(75,158,255,0.3)] flex items-center justify-center gap-2 cursor-pointer"
          >
            <Sparkles className="size-3.5 shrink-0" />
            <span className="truncate">CONSULT AI ASTRONOMER</span>
            <ArrowRight className="size-3.5 shrink-0" />
          </button>
        </div>

      </div>
    </div>
  );
}
