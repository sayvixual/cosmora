"use client";

import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { createPortal } from "react-dom";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import { 
  Bot, 
  X, 
  Send, 
  Clock, 
  Telescope, 
  ArrowRight,
  Loader2,
  CheckCircle2,
  ShoppingCart,
  Sparkles,
  Volume2,
  VolumeX,
  Copy,
  Check,
  Trash2,
  Download,
  Share2,
  Plus,
  Compass,
  Layers,
  Flame,
  Star,
  Orbit,
  Maximize2,
  Eye,
  Camera,
  RefreshCw,
  FileText
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { 
  ObservationCartItem, 
  TargetType 
} from "@/features/ai/types";
import { 
  INITIAL_OBSERVATION_CART, 
  TARGET_PRESETS, 
  PROMPT_CATEGORIES 
} from "@/features/ai/data/astronomyKnowledge";
import { CelestialFocusSelector, CelestialTargetItem } from "./celestial-focus-selector";

interface ContextualAIPanelProps {
  isOpen: boolean;
  onClose: () => void;
  activeObject?: string;
  initialQuery?: string;
  initialTab?: "chat" | "cart" | "telemetry";
  onSelectAction?: (action: "observe" | "photo" | "research" | "visit") => void;
  onInspectObject?: (objectName: string) => void;
}

type ActiveTab = "chat" | "cart" | "telemetry";

export function ContextualAIPanel({
  isOpen,
  onClose,
  activeObject = "Mars",
  initialQuery,
  initialTab = "chat",
  onSelectAction,
  onInspectObject,
}: ContextualAIPanelProps) {
  const [mounted, setMounted] = useState(false);
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isAnimating, setIsAnimating] = useState(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>(initialTab || "chat");
  const [currentTarget, setCurrentTarget] = useState<string>(activeObject);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [cartSuccessNotice, setCartSuccessNotice] = useState<string | null>(null);
  const [cartFilter, setCartFilter] = useState<"all" | TargetType>("all");

  // Observation Cart State (Persisted in state)
  const [cartItems, setCartItems] = useState<ObservationCartItem[]>(INITIAL_OBSERVATION_CART);
  const [cartLoaded, setCartLoaded] = useState(false);

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Message history (custom streaming state) ──────────────
  type ChatMessage = {
    id: string;
    role: 'user' | 'assistant';
    content: string;
    // Optional display fields (populated from old AIMessage for backward compat)
    timestamp?: string;
    sourceDataset?: string;
    highlights?: Array<{
      name: string;
      targetType?: TargetType;
      window: string;
      magnitude: string;
      bestInstrument: string;
      altitude?: string;
      coordinates?: { ra: string; dec: string };
      filterRecommendation?: string;
    }>;
    recommendations?: string[];
    suggestedPrompts?: string[];
    actionType?: string;
  };
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "msg_init_welcome",
      role: "assistant",
      content: `Welcome to **COSMORA** — your AI-powered astronomy exploration assistant.\n\nI'm connected to a real astronomy database with celestial objects, space missions, upcoming events, and dark sky destinations.\n\nCurrently focused on: **${activeObject}**\n\nAsk me anything — what to observe tonight, details about this object, upcoming meteor showers, or where to go stargazing.`,
    },
  ]);
  const [inputQuery, setInputQuery] = useState("");
  const [loading, setLoading] = useState(false);

  // Streaming append function — calls /api/ai/chat
  const sendToGroq = useCallback(async (userContent: string, targetOverride?: string) => {
    const userMsg: ChatMessage = { id: `u_${Date.now()}`, role: 'user', content: userContent };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    const assistantId = `a_${Date.now()}`;
    setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '' }]);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          // Only send the last 6 messages to save tokens
          messages: [...messages, userMsg].slice(-6).map((m) => ({ role: m.role, content: m.content })),
          context: { objectName: targetOverride || currentTarget, activeSection: activeTab },
        }),
      });

      if (!res.ok || !res.body) {
        throw new Error(`HTTP ${res.status}`);
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let totalReceived = 0;

      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          console.log('[COSMORA] Stream done. Total chars received:', totalReceived);
          break;
        }
        const chunk = decoder.decode(value, { stream: true });
        totalReceived += chunk.length;
        console.log('[COSMORA] Raw chunk:', chunk);
        buffer += chunk;

        // Parse data stream lines (Vercel AI SDK data stream format)
        const lines = buffer.split('\n');
        buffer = lines.pop() ?? '';

        for (const line of lines) {
          if (line.startsWith('0:')) {
            // Text chunk: `0:"text content"`
            try {
              const text = JSON.parse(line.slice(2));
              console.log('[COSMORA] Parsed text chunk:', JSON.stringify(text));
              if (typeof text === 'string' && text.length > 0) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId ? { ...m, content: m.content + text } : m
                  )
                );
              }
            } catch { /* skip malformed */ }
          }
        }
      }
    } catch (err) {
      console.error('[COSMORA AI]', err);
      const errMsg = err instanceof Error ? err.message : '';
      const isRateLimit = errMsg.toLowerCase().includes('rate limit') || errMsg.includes('429');
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: isRateLimit
                ? '⚠️ **Rate limit reached.** The AI API is temporarily throttled due to too many requests. Please wait **15–30 seconds** and try again.'
                : 'I encountered an error. Please try again.'
              }
            : m
        )
      );
    } finally {
      setLoading(false);
    }
  }, [messages, currentTarget, activeTab]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync initial tab when changed
  useEffect(() => {
    if (initialTab && isOpen) {
      setActiveTab(initialTab);
    }
  }, [initialTab, isOpen]);

  // Controlled Smooth Open/Close Animation Lifecycle
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
      }, 320);
      return () => clearTimeout(timer);
    }
  }, [isOpen, isRendered]);

  const handleRequestClose = useCallback(() => {
    setIsAnimating(false);
    setTimeout(() => {
      setIsRendered(false);
      onClose();
    }, 300);
  }, [onClose]);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("cosmora_cart");
      if (saved) {
        setCartItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load cart", e);
    } finally {
      setCartLoaded(true);
    }
  }, []);

  // Save cart to localStorage when changed & broadcast event
  useEffect(() => {
    if (cartLoaded) {
      localStorage.setItem("cosmora_cart", JSON.stringify(cartItems));
      window.dispatchEvent(
        new CustomEvent("cosmora:cart-updated", { detail: { count: cartItems.length } })
      );
    }
  }, [cartItems, cartLoaded]);

  // Update target when prop changes
  useEffect(() => {
    if (activeObject) {
      setCurrentTarget(activeObject);
    }
  }, [activeObject]);

  // Handle Initial Query passed from external components
  useEffect(() => {
    if (initialQuery && isOpen) {
      const timer = setTimeout(() => {
        sendToGroq(initialQuery, activeObject);
        setActiveTab("chat");
      }, 300);
      return () => clearTimeout(timer);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery, isOpen]);

  const messageContainerRef = useRef<HTMLDivElement>(null);

  // Scroll to bottom smoothly when new messages arrive without animation fighting/jitter
  useEffect(() => {
    if (activeTab === "chat" && messageContainerRef.current) {
      const container = messageContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [messages, activeTab]);

  // Keyboard accessibility
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        handleRequestClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleRequestClose]);

  // Send Message Logic — uses custom Groq streaming fetch
  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query || loading) return;
    setInputQuery("");
    setActiveTab("chat");
    sendToGroq(query);
  };

  // Add Item to Observation Cart
  const handleAddToCart = (highlight: {
    name: string;
    targetType?: TargetType;
    window: string;
    magnitude: string;
    bestInstrument: string;
    altitude?: string;
    coordinates?: { ra: string; dec: string };
    filterRecommendation?: string;
  }) => {
    const newItem: ObservationCartItem = {
      id: `cart_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      targetName: highlight.name,
      targetType: highlight.targetType || "planet",
      windowTime: highlight.window,
      magnitude: highlight.magnitude,
      coordinates: highlight.coordinates || { ra: "06h 00m 00s", dec: "+20° 00' 00\"" },
      bestInstrument: highlight.bestInstrument,
      opticsFilter: highlight.filterRecommendation,
      altitude: highlight.altitude || "45° Zenith",
      notes: `Optimal instrument: ${highlight.bestInstrument}. Filter: ${highlight.filterRecommendation || "Broadband"}`,
      addedAt: new Date().toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }),
      completed: false
    };

    setCartItems((prev) => [newItem, ...prev]);
    setCartSuccessNotice(`Added "${highlight.name}" to Observation Cart!`);
    setTimeout(() => setCartSuccessNotice(null), 3000);
  };

  // Toggle Cart Item Completion
  const handleToggleCartItem = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  // Remove Cart Item
  const handleRemoveCartItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  // Clear Cart
  const handleClearCart = () => {
    if (window.confirm("Are you sure you want to clear all items in your Observation Cart?")) {
      setCartItems([]);
    }
  };

  // Export Cart to JSON file
  const handleExportCart = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(cartItems, null, 2));
    const downloadAnchor = document.createElement("a");
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `cosmora_stargazing_itinerary_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  // Copy Message to Clipboard
  const handleCopyMessage = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  // Browser Speech Synthesis (Audio Readout)
  const handleSpeakText = (text: string) => {
    if (typeof window === "undefined" || !('speechSynthesis' in window)) return;

    if (isPlayingAudio) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
      return;
    }

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    utterance.onend = () => setIsPlayingAudio(false);
    utterance.onerror = () => setIsPlayingAudio(false);

    setIsPlayingAudio(true);
    window.speechSynthesis.speak(utterance);
  };

  // Stop speech when modal closes
  useEffect(() => {
    if (!isOpen && typeof window !== "undefined" && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsPlayingAudio(false);
    }
  }, [isOpen]);

  // Filtered Cart items
  const filteredCartItems = useMemo(() => {
    if (cartFilter === "all") return cartItems;
    return cartItems.filter((i) => i.targetType === cartFilter);
  }, [cartItems, cartFilter]);

  if (!isRendered || !mounted) return null;

  const modalContent = (
    <div
      className={cn(
        "fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 lg:p-6 bg-black/85 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
        isAnimating
          ? "opacity-100 backdrop-blur-xl pointer-events-auto"
          : "opacity-0 backdrop-blur-none pointer-events-none"
      )}
    >
      {/* Background Clickable Overlay */}
      <div className="absolute inset-0" onClick={handleRequestClose} />

      {/* Main Futuristic HUD Modal Window / Drawer */}
      <div 
        className={cn(
          "relative w-full sm:max-w-5xl h-[92dvh] sm:h-[90vh] sm:max-h-[860px] bg-[#07090E]/98 border-0 sm:border border-white/20 rounded-t-3xl sm:rounded-3xl shadow-[0_0_80px_rgba(0,0,0,0.95),0_0_35px_rgba(75,158,255,0.18)] flex flex-col overflow-hidden z-10 will-change-transform transition-all duration-320 sm:duration-350 ease-[cubic-bezier(0.16,1,0.3,1)]",
          isAnimating
            ? "translate-y-0 opacity-100 scale-100"
            : "translate-y-full sm:translate-y-8 opacity-0 scale-[0.98] sm:scale-95 pointer-events-none"
        )}
        role="dialog"
        aria-modal="true"
        aria-label="Cosmora Centered AI Agent and Observation Cart Drawer"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Mobile Top Drag Indicator Bar */}
        <div className="sm:hidden flex justify-center items-center pt-2.5 pb-1 bg-[#0C1017] border-b border-white/5 shrink-0">
          <div className="w-10 h-1.5 rounded-full bg-white/30" />
        </div>

        {/* Ambient Top Glow Line */}
        <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-75 pointer-events-none" />
        {/* Futuristic Glowing Top Header Bar */}
        <div className="relative z-50 px-2.5 sm:px-6 py-2 sm:py-3 border-b border-white/10 bg-[#0C1017]/95 backdrop-blur-md flex items-center justify-between gap-1.5 sm:gap-4 shrink-0 w-full min-w-0 select-none">
          
          {/* Left on Desktop: Title & Status Indicator (Hidden on mobile to give full room to tabs & target lock) */}
          <div className="hidden sm:flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="relative flex items-center justify-center size-8 sm:size-9 rounded-xl bg-accent/15 border border-accent/40 text-accent shadow-[0_0_15px_rgba(75,158,255,0.3)] shrink-0">
              <Bot className="size-4 sm:size-4.5" />
              <span className="absolute -top-0.5 -right-0.5 size-2 rounded-full bg-emerald-400 border-2 border-[#07090E] animate-pulse" />
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h2 className="font-display font-bold text-xs sm:text-sm text-white tracking-wide truncate">
                  COSMORA AI
                </h2>
                <span className="hidden md:inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-mono text-[8.5px] font-semibold uppercase tracking-wider shrink-0">
                  <span className="size-1 rounded-full bg-emerald-400 animate-ping" />
                  ONLINE • DE440
                </span>
              </div>
              <p className="font-mono text-[9px] text-white/50 tracking-wider truncate hidden sm:block max-w-[160px] md:max-w-[220px]">
                Target: <span className="text-accent font-semibold">{currentTarget}</span>
              </p>
            </div>
          </div>

          {/* Mode Tabs (Left-aligned on mobile, Center on Desktop) */}
          <div className="flex items-center gap-0.5 p-0.5 rounded-lg sm:rounded-xl bg-black/60 border border-white/10 font-mono text-xs shrink-0">
            <button
              onClick={() => setActiveTab("chat")}
              className={cn(
                "flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg transition-all font-semibold text-[9.5px] sm:text-xs cursor-pointer shrink-0",
                activeTab === "chat"
                  ? "bg-accent text-black shadow-md font-bold"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <Bot className="size-3 sm:size-3.5" />
              <span>AI CHAT</span>
            </button>

            <button
              onClick={() => setActiveTab("cart")}
              className={cn(
                "relative flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md sm:rounded-lg transition-all font-semibold text-[9.5px] sm:text-xs cursor-pointer shrink-0",
                activeTab === "cart"
                  ? "bg-accent text-black shadow-md font-bold"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <ShoppingCart className="size-3 sm:size-3.5" />
              <span>CART</span>
              {cartItems.length > 0 && (
                <span className={cn(
                  "size-3.5 sm:size-4 px-1 rounded-full text-[8px] sm:text-[9px] font-bold flex items-center justify-center",
                  activeTab === "cart" ? "bg-black text-accent" : "bg-accent text-black"
                )}>
                  {cartItems.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("telemetry")}
              className={cn(
                "hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-all font-semibold text-xs cursor-pointer shrink-0",
                activeTab === "telemetry"
                  ? "bg-accent text-black shadow-md font-bold"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              )}
            >
              <Layers className="size-3.5" />
              <span>TELEMETRY</span>
            </button>
          </div>

          {/* Right: Target Selector + Close Button */}
          <div className="flex items-center gap-1 sm:gap-2 shrink-0 min-w-0">
            <CelestialFocusSelector
              currentTarget={currentTarget}
              onSelectTarget={(newTarget) => {
                setCurrentTarget(newTarget);
                handleSendMessage(`Give me ephemeris and observation parameters for ${newTarget}`);
              }}
              onAddToCart={(targetItem) => {
                handleAddToCart({
                  name: targetItem.name,
                  targetType: targetItem.type,
                  window: "Optimal Observation Window",
                  magnitude: targetItem.magnitude,
                  bestInstrument: "Astronomical Telescope / Binoculars",
                  altitude: targetItem.altitude,
                  coordinates: { ra: "06h 00m 00s", dec: "+20° 00' 00\"" },
                  filterRecommendation: "Broadband / Light Pollution Filter"
                });
              }}
            />

            <button
              onClick={handleRequestClose}
              className="flex items-center justify-center size-7 sm:size-8 rounded-lg sm:rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white/70 hover:text-white active:scale-90 transition-all cursor-pointer shrink-0"
              aria-label="Close Assistant"
            >
              <X className="size-3.5 sm:size-4" />
            </button>
          </div>
        </div>

        {/* Floating Cart Notification Toast */}
        {cartSuccessNotice && (
          <div className="absolute top-14 sm:top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-accent text-black font-mono text-xs font-bold shadow-[0_0_30px_rgba(75,158,255,0.6)] flex items-center gap-2 animate-in fade-in zoom-in-95 duration-200 border border-white/20">
            <CheckCircle2 className="size-4 animate-bounce" />
            <span>{cartSuccessNotice}</span>
          </div>
        )}

        {/* Modal Center Body */}
        <div className="flex-1 overflow-hidden relative flex flex-col min-h-0 bg-[#07090E]">
          
          {/* TAB 1: AI CHAT AGENT */}
          {activeTab === "chat" && (
            <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden animate-in fade-in slide-in-from-bottom-2 duration-200">
              
              {/* Category Prompt Chips Dock */}
              <div className="relative border-b border-white/[0.06] bg-[#090C12] shrink-0">
                <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-2 overflow-x-auto no-scrollbar flex items-center gap-2">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-white/40 shrink-0 mr-1 flex items-center gap-1">
                    <Sparkles className="size-3 text-accent" />
                    INTENTS:
                  </span>
                  {PROMPT_CATEGORIES.flatMap((c) => c.prompts).slice(0, 5).map((prompt, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSendMessage(prompt)}
                      className="shrink-0 px-3 py-1 rounded-full bg-[#111622] hover:bg-accent/20 border border-white/10 hover:border-accent/40 text-white/80 hover:text-accent font-mono text-[11px] transition-all whitespace-nowrap text-left cursor-pointer active:scale-95 shadow-sm"
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
                {/* Subtle right fade hint */}
                <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-[#090C12] to-transparent" />
              </div>

              {/* Message History Feed */}
              <div ref={messageContainerRef} className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-5 scrollbar-none">
                <div className="max-w-4xl mx-auto w-full space-y-5">
                  {messages.map((msg, index) => (
                    <div
                      key={msg.id}
                      className={cn(
                        "flex flex-col gap-1.5",
                        msg.role === "user"
                          ? "ml-auto items-end max-w-[85%] sm:max-w-[75%]"
                          : "mr-auto items-start w-full"
                      )}
                    >
                      {/* Role Header */}
                      <div className="flex items-center gap-2 px-1">
                        {msg.role === "user" ? (
                          <span className="font-mono text-[10px] text-accent/80 font-semibold uppercase">
                            OBSERVER • {msg.timestamp}
                          </span>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="size-2 rounded-full bg-accent animate-pulse" />
                            <span className="font-mono text-[10px] text-white/50 font-semibold uppercase tracking-wider">
                              COSMORA AI INTELLIGENCE • {msg.timestamp}
                            </span>
                            {msg.sourceDataset && (
                              <span className="hidden sm:inline font-mono text-[9px] text-white/30 truncate max-w-[240px]">
                                [{msg.sourceDataset}]
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Message Bubble or Loading State */}
                      {msg.role === "assistant" && msg.content === "" && index === messages.length - 1 && loading ? (
                        <div className="flex items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-accent/5 border border-accent/15 w-fit mt-1">
                          <Loader2 className="size-4 text-accent animate-spin" />
                          <span className="font-mono text-[11px] text-accent/80 uppercase tracking-wider animate-pulse">Consulting telemetry & databases...</span>
                        </div>
                      ) : (
                        <div
                          className={cn(
                            "p-4 sm:p-5 rounded-2xl transition-all shadow-lg max-w-full overflow-hidden",
                            msg.role === "user"
                              ? "bg-accent/20 border border-accent/40 text-white rounded-tr-sm"
                              : "bg-[#0C101A]/85 border border-white/10 text-white/90 rounded-tl-sm w-full"
                          )}
                        >
                          {/* Main Message Text with Markdown Support */}
                          <div className="font-sans text-sm sm:text-base leading-relaxed prose prose-invert max-w-none break-words overflow-x-auto prose-p:my-1.5 prose-a:text-accent prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:border prose-img:border-white/10 prose-img:shadow-2xl prose-img:max-h-[300px] prose-img:object-cover prose-table:w-full prose-table:border-collapse prose-th:border prose-th:border-white/20 prose-th:bg-white/5 prose-th:p-2 prose-td:border prose-td:border-white/10 prose-td:p-2 prose-tr:border-b prose-tr:border-white/5">
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                              {msg.content}
                            </ReactMarkdown>
                            {loading && index === messages.length - 1 && (
                              <span className="inline-block size-1.5 ml-1.5 rounded-full bg-accent animate-ping align-middle" />
                            )}
                          </div>

                        {/* Structured Ephemeris & Observation Cards */}
                        {msg.highlights && msg.highlights.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-white/[0.08] space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="font-mono text-[10px] uppercase tracking-wider text-accent font-bold flex items-center gap-1.5">
                                <Compass className="size-3" />
                                CELESTIAL EPHEMERIS &amp; TARGETS
                              </span>
                              <span className="font-mono text-[9px] text-white/40">
                                CLICK + TO QUEUE IN CART
                              </span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              {msg.highlights.map((h, hIdx) => (
                                <div
                                  key={hIdx}
                                  className="p-3.5 rounded-xl bg-black/50 border border-white/[0.08] hover:border-accent/40 transition-all flex flex-col justify-between group"
                                >
                                  <div>
                                    <div className="flex items-start justify-between gap-2">
                                      <div className="flex items-center gap-2">
                                        <span className="font-display font-bold text-sm text-white group-hover:text-accent transition-colors">
                                          {h.name}
                                        </span>
                                      </div>
                                      <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 font-mono text-[9px] text-accent shrink-0">
                                        {h.magnitude}
                                      </span>
                                    </div>

                                    <div className="space-y-1 mt-2.5 font-mono text-[11px] text-white/70">
                                      <div className="flex items-center gap-1.5">
                                        <Clock className="size-3 text-white/40" />
                                        <span>{h.window}</span>
                                      </div>
                                      <div className="flex items-center gap-1.5 text-white/60">
                                        <Telescope className="size-3 text-white/40" />
                                        <span className="truncate">{h.bestInstrument}</span>
                                      </div>
                                      {h.coordinates && (
                                        <div className="flex items-center gap-1.5 text-white/40 text-[10px]">
                                          <Orbit className="size-3 text-white/30" />
                                          <span>RA {h.coordinates.ra} • Dec {h.coordinates.dec}</span>
                                        </div>
                                      )}
                                    </div>
                                  </div>

                                  {/* Card Bottom Actions */}
                                  <div className="mt-3 pt-2.5 border-t border-white/[0.06] flex items-center justify-between gap-2">
                                    <button
                                      onClick={() => handleAddToCart(h)}
                                      className="flex-1 py-1.5 px-2.5 rounded-lg bg-accent/15 hover:bg-accent text-accent hover:text-black font-mono text-[11px] font-bold border border-accent/30 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                    >
                                      <ShoppingCart className="size-3" />
                                      <span>ADD TO CART</span>
                                    </button>

                                    {onInspectObject && (
                                      <button
                                        onClick={() => {
                                          onClose();
                                          onInspectObject(h.name.split(" ")[0].toLowerCase());
                                        }}
                                        className="py-1.5 px-2 rounded-lg bg-white/5 hover:bg-white/15 text-white/70 hover:text-white font-mono text-[11px] border border-white/10 transition-all flex items-center justify-center"
                                        title="Inspect 3D Planet"
                                      >
                                        <Eye className="size-3" />
                                      </button>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Scientific Recommendations List */}
                        {msg.recommendations && msg.recommendations.length > 0 && (
                          <div className="mt-3.5 pt-3 border-t border-white/[0.06] space-y-1.5 font-mono text-xs text-white/80">
                            {msg.recommendations.map((rec, rIdx) => (
                              <div key={rIdx} className="flex items-start gap-2">
                                <CheckCircle2 className="size-3.5 text-accent mt-0.5 shrink-0" />
                                <span>{rec}</span>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Message Footer Tools (Read Aloud, Copy, Action Shortcuts) */}
                        {msg.role === "assistant" && (!loading || index !== messages.length - 1) && (
                          <div className="mt-4 pt-3 border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              {/* Speech Synthesis Audio Button */}
                              <button
                                onClick={() => handleSpeakText(msg.content)}
                                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-white/70 hover:text-white font-mono text-[10px] transition-all flex items-center gap-1.5 cursor-pointer"
                              >
                                {isPlayingAudio ? (
                                  <>
                                    <VolumeX className="size-3 text-red-400" />
                                    <span>STOP AUDIO</span>
                                  </>
                                ) : (
                                  <>
                                    <Volume2 className="size-3 text-accent" />
                                    <span>AUDIO READOUT</span>
                                  </>
                                )}
                              </button>

                              {/* Copy Message */}
                              <button
                                onClick={() => handleCopyMessage(msg.content, index)}
                                className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/15 border border-white/10 text-white/70 hover:text-white font-mono text-[10px] transition-all flex items-center gap-1.5 cursor-pointer"
                              >
                                {copiedIndex === index ? (
                                  <>
                                    <Check className="size-3 text-emerald-400" />
                                    <span>COPIED</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="size-3 text-white/50" />
                                    <span>COPY</span>
                                  </>
                                )}
                              </button>
                            </div>

                            {/* Quick Action Navigation */}
                            {onSelectAction && (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => {
                                    onClose();
                                    onSelectAction("observe");
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-[10px] border border-white/15 transition-all flex items-center gap-1"
                                >
                                  <Eye className="size-3 text-accent" />
                                  <span>OBSERVE</span>
                                </button>

                                <button
                                  onClick={() => {
                                    onClose();
                                    onSelectAction("photo");
                                  }}
                                  className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-[10px] border border-white/15 transition-all flex items-center gap-1"
                                >
                                  <Camera className="size-3 text-purple-400" />
                                  <span>PHOTO RIG</span>
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                      )}
                    </div>
                  ))}

                  <div ref={chatBottomRef} />
                </div>
              </div>

              {/* Chat Input Dock Bar */}
              <div className="p-3 sm:p-4 border-t border-white/10 bg-[#0A0D15]/95 backdrop-blur-md shrink-0">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="max-w-4xl mx-auto w-full flex items-center gap-2.5"
                >
                  <div className="relative flex-1">
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputQuery ?? ""}
                      onChange={(e) => setInputQuery(e?.target?.value ?? "")}
                      placeholder={`Ask about ${currentTarget}...`}
                      className="w-full h-11 pl-4 pr-10 rounded-xl bg-black/60 border border-white/15 text-sm text-white placeholder:text-white/40 focus:outline-none focus:border-accent font-sans transition-all shadow-inner"
                      disabled={loading}
                    />
                    {inputQuery && (
                      <button
                        type="button"
                        onClick={() => setInputQuery("")}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white text-xs"
                      >
                        <X className="size-3.5" />
                      </button>
                    )}
                  </div>

                  <Button
                    type="submit"
                    disabled={loading || !inputQuery.trim()}
                    className="h-11 px-5 rounded-xl bg-accent text-black hover:bg-white hover:text-black font-display font-bold text-xs tracking-wider transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(75,158,255,0.3)] shrink-0 cursor-pointer"
                  >
                    <span>SEND</span>
                    <Send className="size-3.5 ml-1.5" />
                  </Button>
                </form>
              </div>

            </div>
          )}

          {/* TAB 2: OBSERVATION CART (KERANJANG MISI / STARGAZING PLANNER) */}
          {activeTab === "cart" && (
            <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden bg-[#07090E] animate-in fade-in slide-in-from-bottom-2 duration-200">
              
              {/* Cart Control Bar */}
              <div className="p-4 sm:px-6 py-3 border-b border-white/10 bg-[#0C1017]/80 flex flex-wrap items-center justify-between gap-3 shrink-0">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <span className="text-white/50 uppercase">TOTAL TARGETS:</span>
                    <span className="px-2 py-0.5 rounded-full bg-accent/20 border border-accent/40 text-accent font-bold">
                      {cartItems.length}
                    </span>
                    <span className="text-white/30">•</span>
                    <span className="text-emerald-400 font-bold">
                      {cartItems.filter((i) => i.completed).length} OBSERVED
                    </span>
                  </div>
                </div>

                {/* Filter Pills & Actions */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 p-0.5 rounded-lg bg-black/50 border border-white/10 font-mono text-[10px]">
                    <button
                      onClick={() => setCartFilter("all")}
                      className={cn(
                        "px-2 py-1 rounded transition-all cursor-pointer",
                        cartFilter === "all" ? "bg-white/15 text-white shadow-sm font-semibold" : "text-white/50 hover:text-white"
                      )}
                    >
                      ALL
                    </button>
                    <button
                      onClick={() => setCartFilter("planet")}
                      className={cn(
                        "px-2 py-1 rounded transition-all cursor-pointer",
                        cartFilter === "planet" ? "bg-white/15 text-white shadow-sm font-semibold" : "text-white/50 hover:text-white"
                      )}
                    >
                      PLANETS
                    </button>
                    <button
                      onClick={() => setCartFilter("meteor")}
                      className={cn(
                        "px-2 py-1 rounded transition-all cursor-pointer",
                        cartFilter === "meteor" ? "bg-white/15 text-white shadow-sm font-semibold" : "text-white/50 hover:text-white"
                      )}
                    >
                      METEORS
                    </button>
                  </div>

                  <button
                    onClick={handleExportCart}
                    disabled={cartItems.length === 0}
                    className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white font-mono text-xs border border-white/15 transition-all flex items-center gap-1.5 disabled:opacity-40 cursor-pointer active:scale-95"
                  >
                    <Download className="size-3.5 text-accent" />
                    <span className="hidden sm:inline">EXPORT ITINERARY</span>
                  </button>

                  <button
                    onClick={handleClearCart}
                    disabled={cartItems.length === 0}
                    className="p-1.5 rounded-lg bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-all disabled:opacity-30 cursor-pointer active:scale-90"
                    title="Clear All Cart Items"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-3.5 scrollbar-none">
                {filteredCartItems.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center p-8 space-y-4 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center justify-center size-16 rounded-3xl bg-white/5 border border-white/10 text-white/30 shadow-inner">
                      <ShoppingCart className="size-8 text-accent/50" />
                    </div>
                    <div className="space-y-1 max-w-sm">
                      <h3 className="font-display font-bold text-lg text-white">
                        Your Observation Cart is Empty
                      </h3>
                      <p className="text-white/50 font-sans text-xs">
                        Ask the AI Agent for tonight&apos;s celestial visibility or click &ldquo;ADD TO CART&rdquo; on any target highlight in the chat.
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        setActiveTab("chat");
                        handleSendMessage("What are the best targets to add to my observation cart tonight?");
                      }}
                      className="px-4 py-2 rounded-xl bg-accent text-black font-mono text-xs font-bold hover:bg-white transition-all shadow-[0_0_20px_rgba(75,158,255,0.4)] flex items-center gap-2 cursor-pointer active:scale-95"
                    >
                      <Sparkles className="size-3.5" />
                      <span>RECOMMEND TARGETS TO ADD</span>
                    </button>
                  </div>
                ) : (
                  filteredCartItems.map((item, idx) => (
                    <div
                      key={item.id}
                      style={{ animationDelay: `${idx * 40}ms` }}
                      className={cn(
                        "p-4 sm:p-5 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in fade-in slide-in-from-bottom-2 fill-mode-both",
                        item.completed
                          ? "bg-emerald-950/20 border-emerald-500/30 opacity-80 scale-[0.99]"
                          : "bg-[#0D121D]/90 border-white/10 hover:border-accent/40 shadow-lg hover:shadow-[0_0_20px_rgba(75,158,255,0.12)] hover:-translate-y-0.5"
                      )}
                    >
                      {/* Left: Checkbox & Target Info */}
                      <div className="flex items-start gap-3.5 flex-1">
                        <button
                          onClick={() => handleToggleCartItem(item.id)}
                          className={cn(
                            "mt-1 size-5 rounded-md border flex items-center justify-center transition-all duration-200 shrink-0 cursor-pointer active:scale-90",
                            item.completed
                              ? "bg-emerald-500 border-emerald-400 text-black scale-105 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
                              : "border-white/30 hover:border-accent bg-black/40 hover:scale-105"
                          )}
                          aria-label="Toggle Complete"
                        >
                          {item.completed && <Check className="size-3.5 stroke-[3] animate-in zoom-in-50 duration-150" />}
                        </button>

                        <div className="space-y-1.5 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={cn(
                              "font-display font-bold text-base transition-all duration-200",
                              item.completed ? "line-through text-white/50" : "text-white"
                            )}>
                              {item.targetName}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-accent/15 border border-accent/30 font-mono text-[9px] text-accent uppercase font-semibold">
                              {item.targetType}
                            </span>
                            <span className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 font-mono text-[9px] text-white/70">
                              {item.magnitude}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1 font-mono text-xs text-white/70">
                            <div className="flex items-center gap-1.5">
                              <Clock className="size-3 text-accent" />
                              <span>{item.windowTime}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Telescope className="size-3 text-purple-400" />
                              <span className="truncate">{item.bestInstrument}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <Orbit className="size-3 text-cyan-400" />
                              <span>RA {item.coordinates.ra}</span>
                            </div>
                          </div>

                          {item.notes && (
                            <p className="text-white/50 text-[11px] font-sans pt-1">
                              {item.notes}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                        {onInspectObject && (
                          <button
                            onClick={() => {
                              handleRequestClose();
                              setTimeout(() => {
                                onInspectObject(item.targetName.split(" ")[0].toLowerCase());
                              }, 200);
                            }}
                            className="p-2 rounded-xl bg-white/5 hover:bg-white/15 border border-white/10 text-white/70 hover:text-white transition-all text-xs flex items-center gap-1 cursor-pointer active:scale-95"
                            title="Inspect Target in 3D"
                          >
                            <Eye className="size-3.5" />
                            <span className="hidden md:inline font-mono text-[10px]">3D VIEW</span>
                          </button>
                        )}

                        <button
                          onClick={() => handleRemoveCartItem(item.id)}
                          className="p-2 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 transition-all cursor-pointer active:scale-90"
                          title="Remove from Cart"
                        >
                          <Trash2 className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Cart Footer */}
              <div className="p-4 sm:px-6 py-3 border-t border-white/10 bg-[#0C1017]/90 flex items-center justify-between gap-3 shrink-0">
                <span className="font-mono text-[11px] text-white/50">
                  Ready to observe? Export your mission itinerary or review parameters with the AI agent.
                </span>

                <Button
                  onClick={() => {
                    setActiveTab("chat");
                    const cartSummary = cartItems
                      .map((item, i) =>
                        `${i + 1}. ${item.targetName} (${item.targetType}) — Mag: ${item.magnitude}, Window: ${item.windowTime}, Instrument: ${item.bestInstrument}`
                      )
                      .join('\n');
                    handleSendMessage(
                      `I have ${cartItems.length} target(s) queued in my observation cart:\n\n${cartSummary}\n\nPlease give me a concise observation plan: best order to observe them, any tips per target, and what conditions to watch for.`
                    );

                  }}
                  disabled={cartItems.length === 0}
                  className="h-9 px-4 rounded-xl bg-accent text-black hover:bg-white hover:text-black font-mono text-xs font-bold transition-all shadow-[0_0_20px_rgba(75,158,255,0.3)] active:scale-95 cursor-pointer"
                >
                  <Bot className="size-3.5 mr-1.5" />
                  <span>CONSULT AI ON CART</span>
                </Button>
              </div>

            </div>
          )}

          {/* TAB 3: LIVE TELEMETRY MATRIX */}
          {activeTab === "telemetry" && (
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-none bg-[#07090E] animate-in fade-in slide-in-from-bottom-2 duration-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                
                {/* Metric 1: Seeing Index */}
                <div className="p-4 rounded-2xl bg-[#0D121D] border border-white/10 space-y-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-accent font-bold">
                    ATMOSPHERIC SEEING
                  </span>
                  <div className="text-2xl font-display font-bold text-white">0.78 arcsec</div>
                  <p className="text-xs text-white/50 font-sans">
                    Pickering Scale 8/10 (Superb laminar seeing for high-magnification planetary resolution).
                  </p>
                </div>

                {/* Metric 2: Bortle Sky Quality */}
                <div className="p-4 rounded-2xl bg-[#0D121D] border border-white/10 space-y-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-accent font-bold">
                    BORTLE DARK SKY CLASS
                  </span>
                  <div className="text-2xl font-display font-bold text-white">Class 2 (SQM 21.85)</div>
                  <p className="text-xs text-white/50 font-sans">
                    Exceptional dark sky; zodiacal light and faint galactic airglow prominently visible.
                  </p>
                </div>

                {/* Metric 3: Moon Illumination */}
                <div className="p-4 rounded-2xl bg-[#0D121D] border border-white/10 space-y-2">
                  <span className="font-mono text-[10px] uppercase tracking-wider text-accent font-bold">
                    LUNAR ILLUMINATION
                  </span>
                  <div className="text-2xl font-display font-bold text-white">14% Waning Crescent</div>
                  <p className="text-xs text-white/50 font-sans">
                    Moon sets early; minimal sky glow interference for faint nebular observation.
                  </p>
                </div>

              </div>

              {/* Target Coordinates Quick Board */}
              <div className="p-5 rounded-2xl bg-[#0D121D] border border-white/10 space-y-3">
                <h3 className="font-display font-bold text-base text-white uppercase">
                  ACTIVE SOLAR SYSTEM EPHEMERIDES (UTC)
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-mono text-xs">
                    <thead>
                      <tr className="border-b border-white/10 text-white/40 text-[10px] uppercase">
                        <th className="py-2">OBJECT</th>
                        <th className="py-2">RA (J2000)</th>
                        <th className="py-2">DEC (J2000)</th>
                        <th className="py-2">MAGNITUDE</th>
                        <th className="py-2">ALTITUDE</th>
                        <th className="py-2">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/[0.06] text-white/80">
                      <tr>
                        <td className="py-2.5 font-bold text-white">Jupiter</td>
                        <td className="py-2.5">03h 12m 44s</td>
                        <td className="py-2.5">+16° 45' 10&quot;</td>
                        <td className="py-2.5 text-accent">-2.4 mag</td>
                        <td className="py-2.5">62° Transit</td>
                        <td className="py-2.5">
                          <button
                            onClick={() => handleAddToCart({
                              name: "Jupiter",
                              targetType: "planet",
                              window: "21:15 - 03:10 UTC",
                              magnitude: "-2.4 mag",
                              bestInstrument: "100mm Reflector",
                              altitude: "62°"
                            })}
                            className="px-2 py-1 rounded bg-accent/20 text-accent hover:bg-accent hover:text-black font-bold transition-all text-[10px]"
                          >
                            + CART
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-bold text-white">Saturn</td>
                        <td className="py-2.5">22h 45m 12s</td>
                        <td className="py-2.5">-09° 15' 20&quot;</td>
                        <td className="py-2.5 text-accent">+0.6 mag</td>
                        <td className="py-2.5">48° S-SE</td>
                        <td className="py-2.5">
                          <button
                            onClick={() => handleAddToCart({
                              name: "Saturn",
                              targetType: "planet",
                              window: "19:50 - 02:40 UTC",
                              magnitude: "+0.6 mag",
                              bestInstrument: "90mm Refractor",
                              altitude: "48°"
                            })}
                            className="px-2 py-1 rounded bg-accent/20 text-accent hover:bg-accent hover:text-black font-bold transition-all text-[10px]"
                          >
                            + CART
                          </button>
                        </td>
                      </tr>
                      <tr>
                        <td className="py-2.5 font-bold text-white">Mars</td>
                        <td className="py-2.5">06h 18m 22s</td>
                        <td className="py-2.5">+24° 12' 08&quot;</td>
                        <td className="py-2.5 text-accent">-0.8 mag</td>
                        <td className="py-2.5">54° Culmination</td>
                        <td className="py-2.5">
                          <button
                            onClick={() => handleAddToCart({
                              name: "Mars",
                              targetType: "planet",
                              window: "01:20 - 05:40 UTC",
                              magnitude: "-0.8 mag",
                              bestInstrument: "100mm Reflector",
                              altitude: "54°"
                            })}
                            className="px-2 py-1 rounded bg-accent/20 text-accent hover:bg-accent hover:text-black font-bold transition-all text-[10px]"
                          >
                            + CART
                          </button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </div>

      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
