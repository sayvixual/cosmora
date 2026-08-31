"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ExternalLink, ShieldCheck, Database } from "lucide-react";
import { SKETCHFAB_SOLAR_SYSTEM_ATTRIBUTION } from "../adapters/sketchfab-solar-system";

interface AttributionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function AttributionModal({ isOpen, onClose }: AttributionModalProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen || !mounted) return null;

  const attr = SKETCHFAB_SOLAR_SYSTEM_ATTRIBUTION;

  const modalContent = (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-lg rounded-2xl bg-[#080B10] border border-white/15 p-5 sm:p-6 shadow-2xl space-y-4 text-white select-none"
        role="dialog"
        aria-labelledby="attribution-title"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2 font-mono text-xs text-accent">
            <ShieldCheck className="size-4" />
            <span className="font-bold tracking-wider uppercase" id="attribution-title">
              LEGAL ATTRIBUTION & SCIENTIFIC SOURCES
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-white/70 hover:text-white transition-all"
            aria-label="Close modal"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* 3D Model Asset Attribution */}
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider">
              3D BASE CELESTIAL ASSET
            </span>
            <span className="px-2 py-0.5 rounded-full bg-accent/15 border border-accent/30 text-accent font-mono text-[9px] font-bold">
              CC BY 4.0
            </span>
          </div>

          <div>
            <h3 className="font-display font-bold text-base text-white">
              &quot;{attr.title}&quot;
            </h3>
            <p className="font-sans text-xs text-white/70 mt-0.5">
              Authored by <span className="text-white font-semibold">{attr.creator}</span> via Sketchfab.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 font-mono text-[10px] text-white/60">
            <div>
              <span className="text-white/30 block">Triangles:</span>
              <span className="text-white font-medium">~{attr.triangleCount.toLocaleString()}</span>
            </div>
            <div>
              <span className="text-white/30 block">Vertices:</span>
              <span className="text-white font-medium">~{attr.vertexCount.toLocaleString()}</span>
            </div>
          </div>

          <a
            href={attr.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 pt-1 text-xs text-accent hover:underline font-mono"
          >
            <span>View original model on Sketchfab</span>
            <ExternalLink className="size-3" />
          </a>
        </div>

        {/* Scientific Data Provenance */}
        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
          <div className="flex items-center gap-1.5 text-white/40 font-mono text-[10px] uppercase tracking-wider">
            <Database className="size-3 text-emerald-400" />
            <span>ASTRONOMICAL DATA PROVENANCE</span>
          </div>

          <ul className="font-sans text-xs text-white/80 space-y-1.5 list-disc list-inside">
            <li>
              <span className="font-semibold text-white">NASA Planetary Fact Sheets</span> (NASA Goddard Space Flight Center)
            </li>
            <li>
              <span className="font-semibold text-white">NASA JPL Horizons Ephemeris System</span> (Jet Propulsion Laboratory)
            </li>
            <li>
              <span className="font-semibold text-white">IAU Working Group on Cartographic Coordinates and Rotational Elements</span>
            </li>
          </ul>
        </div>

        {/* Footer info */}
        <div className="flex items-center justify-between pt-1 text-[10px] font-mono text-white/40">
          <span>COSMORA SPATIAL EXPLORER</span>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-lg bg-accent text-black font-semibold uppercase hover:bg-accent/90 transition-all"
          >
            CONFIRM & RETURN
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
