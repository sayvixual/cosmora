"use client";

import React, { useState, useEffect } from "react";
import { HeroSection } from "@/components/home/hero-section";
import { ContextualAIPanel } from "@/components/ai/contextual-ai-panel";
import { ActionModal, ActionModalType } from "@/components/actions/action-modal";
import { DeepPlanetInspectorModal } from "@/features/explorer/components/DeepPlanetInspectorModal";

export default function Home() {
  const [activeStage, setActiveStage] = useState<"home" | "explore" | "deepspace" | "destinations" | "missions" | "logbook">("home");
  const [selectedPlanetId, setSelectedPlanetId] = useState<string>("mars");
  const [isAIOpen, setIsAIOpen] = useState<boolean>(false);
  const [actionModalType, setActionModalType] = useState<ActionModalType>(null);
  const [activeObjectName, setActiveObjectName] = useState<string>("Mars");
  const [deepInspectPlanetId, setDeepInspectPlanetId] = useState<string | null>(null);

  const [aiInitialQuery, setAiInitialQuery] = useState<string | undefined>(undefined);
  const [aiInitialTab, setAiInitialTab] = useState<"chat" | "cart" | "telemetry">("chat");

  const handleOpenAI = (targetNameOrQuery?: string, tab: "chat" | "cart" | "telemetry" = "chat") => {
    setAiInitialTab(tab);
    if (targetNameOrQuery) {
      if (targetNameOrQuery.includes(" ") || targetNameOrQuery.length > 20) {
        setAiInitialQuery(targetNameOrQuery);
      } else {
        setActiveObjectName(targetNameOrQuery);
        setAiInitialQuery(undefined);
      }
    } else {
      setAiInitialQuery(undefined);
    }
    setIsAIOpen(true);
  };
  const handleCloseAI = () => {
    setIsAIOpen(false);
    setAiInitialQuery(undefined);
  };

  const handleOpenAction = (actionType: "observe" | "photo" | "research" | "visit") => {
    setActionModalType(actionType);
  };

  const handleCloseAction = () => setActionModalType(null);

  const handleSelectPlanet = (planetId: string) => {
    setSelectedPlanetId(planetId);
    const capitalized = planetId.charAt(0).toUpperCase() + planetId.slice(1);
    setActiveObjectName(capitalized);
  };

  // Synchronize global custom events and URL hash on initial load
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash === "#logbook") setActiveStage("logbook");
      else if (hash === "#missions") setActiveStage("missions");
      else if (hash === "#destinations") setActiveStage("destinations");
      else if (hash === "#deepspace") setActiveStage("deepspace");
      else if (hash === "#explore") setActiveStage("explore");
    }

    const handleGlobalOpenAI = (e: Event) => {
      const customEvent = e as CustomEvent<{ query?: string; targetName?: string; tab?: "chat" | "cart" | "telemetry" }>;
      if (customEvent?.detail?.targetName) {
        setActiveObjectName(customEvent.detail.targetName);
      }
      if (customEvent?.detail?.query) {
        setAiInitialQuery(customEvent.detail.query);
      }
      setAiInitialTab(customEvent?.detail?.tab || "chat");
      setIsAIOpen(true);
    };

    const handleGlobalOpenCart = () => {
      setAiInitialTab("cart");
      setIsAIOpen(true);
    };
    
    const handleGlobalSelectPlanet = (e: Event) => {
      const customEvent = e as CustomEvent<{ planetId: string }>;
      if (customEvent.detail?.planetId) {
        handleSelectPlanet(customEvent.detail.planetId);
        setActiveStage("explore");
      }
    };

    const handleGlobalSetStage = (e: Event) => {
      const customEvent = e as CustomEvent<{ stage: "home" | "explore" | "deepspace" | "destinations" | "missions" | "logbook" }>;
      if (customEvent.detail?.stage) {
        setActiveStage(customEvent.detail.stage);
      }
    };

    const handleGlobalOpenAction = (e: Event) => {
      const customEvent = e as CustomEvent<{ actionType: "observe" | "photo" | "research" | "visit"; objectName?: string }>;
      if (customEvent.detail?.actionType) {
        if (customEvent.detail.objectName) {
          setActiveObjectName(customEvent.detail.objectName);
        }
        handleOpenAction(customEvent.detail.actionType);
      }
    };

    const handleGlobalOpenInspect = (e: Event) => {
      const customEvent = e as CustomEvent<{ planetId?: string }>;
      const targetPlanet = customEvent.detail?.planetId || selectedPlanetId || "mars";
      setDeepInspectPlanetId(targetPlanet);
    };

    window.addEventListener("cosmora:open-ai", handleGlobalOpenAI);
    window.addEventListener("cosmora:open-cart", handleGlobalOpenCart);
    window.addEventListener("cosmora:select-planet", handleGlobalSelectPlanet);
    window.addEventListener("cosmora:set-stage", handleGlobalSetStage);
    window.addEventListener("cosmora:open-action", handleGlobalOpenAction);
    window.addEventListener("cosmora:open-inspect", handleGlobalOpenInspect);

    return () => {
      window.removeEventListener("cosmora:open-ai", handleGlobalOpenAI);
      window.removeEventListener("cosmora:open-cart", handleGlobalOpenCart);
      window.removeEventListener("cosmora:select-planet", handleGlobalSelectPlanet);
      window.removeEventListener("cosmora:set-stage", handleGlobalSetStage);
      window.removeEventListener("cosmora:open-action", handleGlobalOpenAction);
      window.removeEventListener("cosmora:open-inspect", handleGlobalOpenInspect);
    };
  }, [selectedPlanetId]);

  const handleSelectHighlight = (highlightId: string) => {
    if (highlightId === "moon" || highlightId === "jupiter") {
      handleSelectPlanet(highlightId);
      setDeepInspectPlanetId(highlightId);
    } else {
      setActiveStage("explore");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <div className="flex flex-col w-full h-full flex-1 min-h-0 bg-[#05070A] text-white selection:bg-accent/30 selection:text-white overflow-hidden">
      {/* Dynamic Single-Viewport Command Stage: 01 HOME ↔ 02 3D UNIVERSE EXPLORATION */}
      <HeroSection
        activeStage={activeStage}
        onSelectStage={setActiveStage}
        selectedPlanetId={selectedPlanetId}
        onSelectPlanet={handleSelectPlanet}
        onOpenAI={handleOpenAI}
        onSelectHighlight={handleSelectHighlight}
        onInspectObject={(id) => {
          handleSelectPlanet(id);
          setDeepInspectPlanetId(id);
        }}
        onOpenAction={(action, objName) => {
          if (objName) setActiveObjectName(objName);
          handleOpenAction(action);
        }}
      />

      {/* Deep Planet 3D Inspector Modal */}
      <DeepPlanetInspectorModal
        planetId={deepInspectPlanetId}
        onClose={() => setDeepInspectPlanetId(null)}
        onOpenAI={handleOpenAI}
      />

      {/* Contextual AI Assistant & Observation Cart Modal (Centered) */}
      <ContextualAIPanel
        isOpen={isAIOpen}
        onClose={handleCloseAI}
        activeObject={activeObjectName}
        initialQuery={aiInitialQuery}
        initialTab={aiInitialTab}
        onSelectAction={handleOpenAction}
        onInspectObject={(id) => {
          handleSelectPlanet(id);
          setDeepInspectPlanetId(id);
        }}
      />

      {/* Action Layer Continuation Modal (Observe, Photo, Research, Visit) */}
      <ActionModal
        actionType={actionModalType}
        onClose={handleCloseAction}
        objectName={activeObjectName}
        onOpenAI={handleOpenAI}
      />
    </div>
  );
}
