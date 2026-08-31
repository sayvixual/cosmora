"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function DestinationsRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/#destinations");
  }, [router]);

  return (
    <div className="flex h-[calc(100dvh-5rem)] w-full items-center justify-center bg-[#05070A] text-white">
      <div className="flex flex-col items-center gap-3">
        <div className="size-8 rounded-full border-2 border-accent border-t-transparent animate-spin" />
        <span className="font-mono text-xs text-white/60 tracking-widest uppercase">
          WARPING TO STAGE 04 (DESTINATIONS)...
        </span>
      </div>
    </div>
  );
}
