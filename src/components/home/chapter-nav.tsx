"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

interface ChapterNavProps {
  className?: string;
  activeChapter?: string;
  onSelectChapter?: (id: string) => void;
}

export function ChapterNav({
  className,
  activeChapter: controlledActiveChapter,
  onSelectChapter,
}: ChapterNavProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [internalActiveSection, setInternalActiveSection] = useState("home");
  
  const currentActive = pathname === "/destinations" ? "destinations" : (controlledActiveChapter || internalActiveSection);

  const chapters = [
    { id: "home", num: "01", label: "HOME", href: "/", isStage: true },
    { id: "explore", num: "02", label: "ORBIT", href: "/#explore", isStage: true },
    { id: "deepspace", num: "03", label: "DEEP SPACE", href: "/#deepspace", isStage: true },
    { id: "destinations", num: "04", label: "DESTINATIONS", href: "/#destinations", isStage: true },
    { id: "missions", num: "05", label: "MISSIONS", href: "/#missions", isStage: true },
    { id: "logbook", num: "06", label: "LOGBOOK", href: "/#logbook", isStage: true },
  ];

  useEffect(() => {
    if (pathname === "/destinations") {
      setInternalActiveSection("destinations");
      return;
    }

    const handleScroll = () => {
      if (window.scrollY < 200 && controlledActiveChapter) {
        return;
      }
      const sections = chapters.map((c) => document.getElementById(c.id));
      const scrollPosition = window.scrollY + window.innerHeight / 3;

      for (let i = sections.length - 1; i >= 0; i--) {
        const sec = sections[i];
        if (sec && sec.offsetTop <= scrollPosition) {
          setInternalActiveSection(chapters[i].id);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [controlledActiveChapter, pathname]);

  const handleClick = (e: React.MouseEvent, chapter: (typeof chapters)[number]) => {
    e.preventDefault();

    if (chapter.id === "logbook") {
      if (pathname !== "/") {
        router.push("/#logbook");
      } else {
        onSelectChapter?.("logbook");
        setInternalActiveSection("logbook");
        window.dispatchEvent(new CustomEvent("cosmora:set-stage", { detail: { stage: "logbook" } }));
      }
      return;
    }

    if (chapter.id === "missions") {
      if (pathname !== "/") {
        router.push("/#missions");
      } else {
        onSelectChapter?.("missions");
        setInternalActiveSection("missions");
        window.dispatchEvent(new CustomEvent("cosmora:set-stage", { detail: { stage: "missions" } }));
      }
      return;
    }

    if (chapter.id === "destinations") {
      if (pathname !== "/") {
        router.push("/#destinations");
      } else {
        onSelectChapter?.("destinations");
        setInternalActiveSection("destinations");
        window.dispatchEvent(new CustomEvent("cosmora:set-stage", { detail: { stage: "destinations" } }));
      }
      return;
    }

    if (chapter.id === "home") {
      if (pathname !== "/") {
        router.push("/");
      } else {
        onSelectChapter?.("home");
        setInternalActiveSection("home");
        window.dispatchEvent(new CustomEvent("cosmora:set-stage", { detail: { stage: "home" } }));
      }
      return;
    }

    if (chapter.id === "explore") {
      if (pathname !== "/") {
        router.push("/#explore");
      } else {
        onSelectChapter?.("explore");
        setInternalActiveSection("explore");
        window.dispatchEvent(new CustomEvent("cosmora:set-stage", { detail: { stage: "explore" } }));
      }
      return;
    }

    if (chapter.id === "deepspace") {
      if (pathname !== "/") {
        router.push("/#deepspace");
      } else {
        onSelectChapter?.("deepspace");
        setInternalActiveSection("deepspace");
        window.dispatchEvent(new CustomEvent("cosmora:set-stage", { detail: { stage: "deepspace" } }));
      }
      return;
    }

    if (chapter.id === "object-detail") {
      onSelectChapter?.("object-detail");
      window.dispatchEvent(new CustomEvent("cosmora:open-inspect"));
      return;
    }

    if (chapter.id === "journey") {
      onSelectChapter?.("journey");
      window.dispatchEvent(new CustomEvent("cosmora:open-action", { detail: { actionType: "observe" } }));
      return;
    }
  };

  return (
    <aside 
      className={cn("hidden xl:flex flex-col items-center gap-3 font-mono select-none w-20 shrink-0", className)}
      aria-label="Section chapter navigation"
    >
      <div className="flex flex-col items-center gap-3.5 relative py-2 w-full">
        {chapters.map((chapter) => {
          const isActive = currentActive === chapter.id;
          return (
            <a
              key={chapter.id}
              href={chapter.href}
              onClick={(e) => handleClick(e, chapter)}
              className="group relative flex flex-col items-center justify-center transition-all duration-300 py-1.5 px-2 cursor-pointer w-full bg-transparent"
              title={`${chapter.num} - ${chapter.label}`}
            >
              {/* Number */}
              <span className={cn(
                "font-bold transition-all duration-300 tracking-widest font-display select-none",
                isActive
                  ? "text-white text-xs font-bold drop-shadow-[0_0_10px_rgba(75,158,255,0.7)] scale-110"
                  : "text-white/35 text-[11px] group-hover:text-white group-hover:scale-110"
              )}>
                {chapter.num}
              </span>

              {/* Dynamic Smooth Hover Stage Name */}
              <span className={cn(
                "text-[7.5px] tracking-wider whitespace-nowrap uppercase transition-all duration-300 select-none overflow-hidden",
                isActive
                  ? "text-accent font-bold opacity-100 max-h-6 translate-y-0.5 mt-0.5"
                  : "text-white/60 group-hover:text-accent font-medium opacity-0 max-h-0 -translate-y-1 group-hover:opacity-100 group-hover:max-h-6 group-hover:translate-y-0.5 group-hover:mt-0.5"
              )}>
                {chapter.label}
              </span>
            </a>
          );
        })}
      </div>
      <div className="w-[1px] h-14 bg-gradient-to-b from-white/20 via-white/10 to-transparent" />
    </aside>
  );
}
