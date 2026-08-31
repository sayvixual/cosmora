"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { LogbookEntry, LogCategory } from "../types";
import { 
  X, 
  Sparkles, 
  Telescope, 
  Camera, 
  MapPin, 
  Moon, 
  Sliders, 
  Check, 
  Plus, 
  FileText, 
  ShieldCheck, 
  Compass, 
  Atom,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

interface LogbookEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveEntry: (entry: LogbookEntry) => void;
  initialTarget?: string;
}

export function LogbookEntryModal({
  isOpen,
  onClose,
  onSaveEntry,
  initialTarget = ""
}: LogbookEntryModalProps) {
  const [mounted, setMounted] = useState(false);

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<LogCategory>("stargazing");
  const [targetObject, setTargetObject] = useState(initialTarget || "Jupiter & Galilean Moons");
  const [targetType, setTargetType] = useState<LogbookEntry["targetType"]>("planet");
  const [observerName, setObserverName] = useState("Observer");
  const [observerRole, setObserverRole] = useState("Amateur Astronomer & Field Observer");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [timeUtc, setTimeUtc] = useState("20:30 UTC");
  const [locationName, setLocationName] = useState("Dark Sky Field Observatory");
  const [coordinates, setCoordinates] = useState("34.2000° N, 118.1700° W");
  const [altitudeM, setAltitudeM] = useState<number>(1800);

  // Sky conditions
  const [bortleScale, setBortleScale] = useState<number>(2);
  const [seeingIndex, setSeeingIndex] = useState("I (Excellent, <0.6\")");
  const [transparencyPercent, setTransparencyPercent] = useState<number>(95);
  const [moonPhase, setMoonPhase] = useState("Waxing Crescent (18%)");

  // Hardware
  const [telescopeOrLens, setTelescopeOrLens] = useState("8\" Dobsonian / 200mm f/6");
  const [cameraSensor, setCameraSensor] = useState("Sony Alpha Full-Frame / Visual Eyepiece");
  const [iso, setIso] = useState<number>(1600);
  const [exposureSeconds, setExposureSeconds] = useState<number>(30);
  const [filtersUsed, setFiltersUsed] = useState("UHC Filter, Baader Moon & Skyglow");

  // Notes
  const [summary, setSummary] = useState("");
  const [detailedNotes, setDetailedNotes] = useState("");
  const [findingsInput, setFindingsInput] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const findings = findingsInput
      .split("\n")
      .map(f => f.trim())
      .filter(f => f.length > 0);

    const newEntry: LogbookEntry = {
      id: `log_custom_${Date.now()}`,
      title: title.trim() || `Observation of ${targetObject}`,
      category,
      targetObject: targetObject.trim(),
      targetType,
      observerName: observerName.trim() || "Field Observer",
      observerRole: observerRole.trim(),
      date,
      timeUtc,
      locationName: locationName.trim() || "Dark Sky Site",
      coordinates,
      altitudeM,
      summary: summary.trim() || `Field observation and recording session targeting ${targetObject}.`,
      detailedNotes: detailedNotes.trim() || `Observation logged under Bortle ${bortleScale} sky with ${seeingIndex} atmospheric seeing.`,
      scientificFindings: findings.length > 0 ? findings : [
        `Successful visual/photographic tracking of ${targetObject}.`,
        `Atmospheric seeing measured at ${seeingIndex}.`
      ],
      skyCondition: {
        bortleScale,
        seeingIndex,
        transparencyPercent,
        moonPhase,
        temperatureC: 12,
        humidityPercent: 35
      },
      imagingHardware: {
        telescopeOrLens: telescopeOrLens.trim(),
        cameraSensor: cameraSensor.trim(),
        iso,
        exposureSeconds,
        filtersUsed: filtersUsed.split(",").map(f => f.trim()).filter(Boolean)
      },
      tags: [category.toUpperCase(), targetObject.split(" ")[0], `Bortle ${bortleScale}`],
      verified: false,
      isCustom: true
    };

    onSaveEntry(newEntry);
    onClose();
  };

  // Reusable label
  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className="text-[9px] font-mono text-white/50 uppercase block mb-1 tracking-wide">
      {children}
    </label>
  );

  // Reusable input class
  const inputCls = "w-full px-2.5 py-1.5 rounded-lg bg-black/50 border border-white/15 text-white placeholder-white/25 focus:border-accent focus:outline-none font-sans text-xs";

  const modalContent = (
    <div className="fixed inset-0 z-[99999] flex items-end sm:items-center justify-center bg-black/85 backdrop-blur-xl animate-in fade-in duration-200 select-none">
      <div
        className="w-full sm:max-w-lg md:max-w-xl bg-[#080C14] border border-white/20 rounded-t-2xl sm:rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col"
        style={{ maxHeight: "92dvh" }}
        role="dialog"
        aria-modal="true"
      >
        {/* ── Modal Header ── */}
        <div className="px-3 py-2.5 sm:px-4 sm:py-3 border-b border-white/10 bg-[#0B101B] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 font-mono min-w-0">
            <div className="size-1.5 rounded-full bg-accent animate-pulse shrink-0" />
            <span className="text-white/40 text-[8.5px] uppercase tracking-wider shrink-0">STAGE 06 //</span>
            <span className="text-accent font-bold text-[10.5px] uppercase tracking-wider truncate">LOG OBSERVATION</span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition-colors cursor-pointer shrink-0 ml-2"
          >
            <X className="size-3.5" />
          </button>
        </div>

        {/* ── Scrollable Form Body ── */}
        <form
          onSubmit={handleSubmit}
          className="p-3 space-y-3 overflow-y-auto flex-1 cosmic-scrollbar text-white font-sans text-xs"
        >

          {/* Section 1: Session Profile & Target */}
          <div className="space-y-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/10">
            <span className="text-[8.5px] font-mono text-accent uppercase font-bold flex items-center gap-1.5">
              <Telescope className="size-2.5 shrink-0" />
              1. Session Profile & Target
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <Label>Session Title</Label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Perseid Peak Burst"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={inputCls}
                />
              </div>
              <div>
                <Label>Target Object</Label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Andromeda Galaxy"
                  value={targetObject}
                  onChange={(e) => setTargetObject(e.target.value)}
                  className={inputCls}
                />
              </div>
            </div>

            {/* Category selector */}
            <div>
              <Label>Logbook Category</Label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 font-mono">
                {[
                  { id: "stargazing", label: "STARGAZE" },
                  { id: "astrophotography", label: "ASTROPHOTO" },
                  { id: "expedition", label: "EXPEDITION" },
                  { id: "research", label: "RESEARCH" }
                ].map((c) => (
                  <button
                    type="button"
                    key={c.id}
                    onClick={() => setCategory(c.id as LogCategory)}
                    className={cn(
                      "py-1.5 px-1 rounded-lg border text-center transition-all cursor-pointer uppercase font-bold text-[8px] truncate",
                      category === c.id
                        ? "bg-accent text-black border-accent shadow-[0_0_8px_rgba(75,158,255,0.3)]"
                        : "bg-white/5 border-white/10 text-white/60 hover:text-white hover:bg-white/10"
                    )}
                  >
                    {c.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <div>
                <Label>Observer Name</Label>
                <input type="text" value={observerName} onChange={(e) => setObserverName(e.target.value)} className={inputCls} />
              </div>
              <div>
                <Label>Date</Label>
                <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={inputCls} />
              </div>
              <div>
                <Label>Time (UTC)</Label>
                <input type="text" value={timeUtc} onChange={(e) => setTimeUtc(e.target.value)} className={inputCls} />
              </div>
            </div>
          </div>

          {/* Section 2: Sky Conditions & Location */}
          <div className="space-y-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/10">
            <span className="text-[8.5px] font-mono text-emerald-400 uppercase font-bold flex items-center gap-1.5">
              <Moon className="size-2.5 shrink-0" />
              2. Sky Conditions & Location
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <Label>Location / Site Name</Label>
                <input type="text" value={locationName} onChange={(e) => setLocationName(e.target.value)} className={inputCls} />
              </div>
              <div>
                <Label>Coordinates</Label>
                <input type="text" value={coordinates} onChange={(e) => setCoordinates(e.target.value)} className={inputCls} />
              </div>
            </div>

            {/* 2x2 grid on mobile, 4-col on sm+ */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <div>
                <Label>Bortle (1-9)</Label>
                <select
                  value={bortleScale}
                  onChange={(e) => setBortleScale(Number(e.target.value))}
                  className={cn(inputCls, "cursor-pointer text-accent font-bold font-mono")}
                >
                  {[1,2,3,4,5,6,7,8,9].map(v => (
                    <option key={v} value={v}>Class {v}</option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Seeing</Label>
                <input
                  type="text"
                  value={seeingIndex}
                  onChange={(e) => setSeeingIndex(e.target.value)}
                  placeholder='I (Excellent)'
                  className={cn(inputCls, "font-mono")}
                />
              </div>
              <div>
                <Label>Transparency %</Label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={transparencyPercent}
                  onChange={(e) => setTransparencyPercent(Number(e.target.value))}
                  className={cn(inputCls, "font-mono")}
                />
              </div>
              <div>
                <Label>Moon Phase</Label>
                <input
                  type="text"
                  value={moonPhase}
                  onChange={(e) => setMoonPhase(e.target.value)}
                  placeholder="Waxing Crescent"
                  className={cn(inputCls, "font-mono")}
                />
              </div>
            </div>
          </div>

          {/* Section 3: Hardware & Optics */}
          <div className="space-y-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/10">
            <span className="text-[8.5px] font-mono text-amber-400 uppercase font-bold flex items-center gap-1.5">
              <Camera className="size-2.5 shrink-0" />
              3. Optical Hardware & Imaging
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <Label>Telescope / Lens</Label>
                <input type="text" value={telescopeOrLens} onChange={(e) => setTelescopeOrLens(e.target.value)} className={inputCls} />
              </div>
              <div>
                <Label>Camera / Eyepiece</Label>
                <input type="text" value={cameraSensor} onChange={(e) => setCameraSensor(e.target.value)} className={inputCls} />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2">
              <div>
                <Label>ISO / Gain</Label>
                <input type="number" value={iso} onChange={(e) => setIso(Number(e.target.value))} className={cn(inputCls, "font-mono")} />
              </div>
              <div>
                <Label>Exposure (s)</Label>
                <input type="number" value={exposureSeconds} onChange={(e) => setExposureSeconds(Number(e.target.value))} className={cn(inputCls, "font-mono")} />
              </div>
              <div>
                <Label>Filters</Label>
                <input type="text" value={filtersUsed} onChange={(e) => setFiltersUsed(e.target.value)} className={inputCls} />
              </div>
            </div>
          </div>

          {/* Section 4: Field Notes */}
          <div className="space-y-2.5 p-3 rounded-xl bg-white/[0.02] border border-white/10">
            <span className="text-[8.5px] font-mono text-accent uppercase font-bold flex items-center gap-1.5">
              <FileText className="size-2.5 shrink-0" />
              4. Field Log & Conclusions
            </span>

            <div>
              <Label>Executive Summary</Label>
              <textarea
                rows={2}
                placeholder="Short overview of the observing run..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className={cn(inputCls, "resize-none")}
              />
            </div>
            <div>
              <Label>Detailed Observation Journal</Label>
              <textarea
                rows={3}
                placeholder="Log visual details, atmospheric shifts..."
                value={detailedNotes}
                onChange={(e) => setDetailedNotes(e.target.value)}
                className={cn(inputCls, "resize-none")}
              />
            </div>
            <div>
              <Label>Key Findings (one per line)</Label>
              <textarea
                rows={2}
                placeholder={"e.g.\nDiscovered faint dust filament\nSeeing at 0.5 arcsec"}
                value={findingsInput}
                onChange={(e) => setFindingsInput(e.target.value)}
                className={cn(inputCls, "resize-none font-mono text-[10.5px]")}
              />
            </div>
          </div>

          {/* ── Footer Actions ── */}
          <div className="flex items-center justify-end gap-2 pt-1 pb-1">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/70 font-mono text-[10.5px] cursor-pointer transition-colors"
            >
              CANCEL
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-accent text-black font-display font-bold text-[10.5px] tracking-wider hover:bg-white hover:text-black transition-all active:scale-95 shadow-[0_0_14px_rgba(75,158,255,0.3)] flex items-center gap-1.5 cursor-pointer"
            >
              <Check className="size-3 shrink-0" />
              SAVE LOG
            </button>
          </div>

        </form>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
