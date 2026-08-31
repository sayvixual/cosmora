"use client";

import React from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  hideTag?: boolean;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link
      href="/"
      className={cn(
        "group relative inline-flex items-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded-lg py-1 transition-all",
        className
      )}
      aria-label="COSMORA Home"
    >
      <span className="font-display font-black text-base sm:text-lg md:text-xl tracking-[0.22em] text-white leading-none group-hover:text-accent transition-colors select-none">
        COSMORA
      </span>
    </Link>
  );
}
