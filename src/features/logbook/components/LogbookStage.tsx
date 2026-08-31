"use client";

import React, { useState, useEffect } from "react";
import { LogbookEntry, LogbookStats } from "../types";
import { INITIAL_LOGBOOK_ENTRIES, INITIAL_LOGBOOK_STATS } from "@/lib/data/mock/logbook";
import { LogbookFeed } from "./LogbookFeed";
import { LogbookDetail } from "./LogbookDetail";
import { LogbookEntryModal } from "./LogbookEntryModal";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "cosmora_logbook_custom_entries";

interface LogbookStageProps {
  onOpenAI?: (query?: string) => void;
}

export function LogbookStage({ onOpenAI }: LogbookStageProps) {
  const [entries, setEntries] = useState<LogbookEntry[]>(INITIAL_LOGBOOK_ENTRIES);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>("log_perseids_mauna_kea");
  const [mobileViewingDetail, setMobileViewingDetail] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Load custom entries from localStorage on initial mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const customEntries: LogbookEntry[] = JSON.parse(saved);
        if (Array.isArray(customEntries) && customEntries.length > 0) {
          setEntries([...customEntries, ...INITIAL_LOGBOOK_ENTRIES]);
        }
      }
    } catch (e) {
      console.warn("Failed to load custom logbook entries from localStorage", e);
    }
  }, []);

  const handleSelectEntry = (id: string) => {
    setSelectedEntryId(id);
    setMobileViewingDetail(true);
  };

  const handleBackToFeed = () => {
    setMobileViewingDetail(false);
  };

  const handleSaveEntry = (newEntry: LogbookEntry) => {
    const updated = [newEntry, ...entries];
    setEntries(updated);
    setSelectedEntryId(newEntry.id);
    setMobileViewingDetail(true);

    try {
      const customOnly = updated.filter(e => e.isCustom);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(customOnly));
    } catch (e) {
      console.warn("Failed to save custom entry to localStorage", e);
    }
  };

  const selectedEntry = entries.find(e => e.id === selectedEntryId) || entries[0];

  const currentStats: LogbookStats = {
    totalSessions: entries.length,
    totalDarkSkyHours: entries.reduce((sum, e) => sum + (e.imagingHardware?.totalIntegrationMinutes ? Math.round(e.imagingHardware.totalIntegrationMinutes / 60) : 3), 0),
    targetsObserved: new Set(entries.map(e => e.targetObject)).size,
    avgBortle: Number((entries.reduce((sum, e) => sum + e.skyCondition.bortleScale, 0) / (entries.length || 1)).toFixed(1)),
    verifiedDiscoveries: entries.filter(e => e.verified).length
  };

  return (
    <div className="flex-1 flex flex-col md:flex-row items-stretch gap-2 md:gap-3 w-full h-full max-h-full min-h-0 overflow-hidden select-none">

      {/* LEFT COLUMN: LOGBOOK FEED & SEARCH */}
      {/* Mobile: show feed OR detail (mutually exclusive); md+: always show feed */}
      <div className={cn(
        "md:w-[380px] lg:w-[420px] xl:w-[480px] md:flex-shrink-0 h-full relative z-10 flex-col rounded-xl md:rounded-2xl border border-white/15 bg-[#0B0F17]/90 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden min-h-0",
        // mobile: full-width; when detail is shown, hide feed
        mobileViewingDetail ? "hidden md:flex w-full" : "flex w-full"
      )}>
        <LogbookFeed
          entries={entries}
          stats={currentStats}
          selectedId={selectedEntryId}
          onSelect={handleSelectEntry}
          onOpenCreateModal={() => setIsCreateModalOpen(true)}
        />
      </div>

      {/* RIGHT COLUMN: EXECUTIVE LOGBOOK DOSSIER & SCIENTIFIC EXPORT */}
      {/* Mobile: full-width when viewing detail; md+: always flex-1 */}
      <div className={cn(
        "flex-1 h-full relative z-10 flex-col rounded-xl md:rounded-2xl border border-white/15 bg-[#0B0F17]/90 backdrop-blur-2xl shadow-[0_8px_30px_rgba(0,0,0,0.5)] overflow-hidden min-h-0 w-full",
        !mobileViewingDetail ? "hidden md:flex" : "flex"
      )}>
        {selectedEntry && (
          <LogbookDetail
            entry={selectedEntry}
            onBack={handleBackToFeed}
            onOpenAI={onOpenAI}
          />
        )}
      </div>

      {/* CREATE NEW LOG MODAL STUDIO */}
      <LogbookEntryModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSaveEntry={handleSaveEntry}
      />

    </div>
  );
}
