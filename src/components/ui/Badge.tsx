"use client";

import type { ReactNode } from "react";
import clsx from "clsx";

export interface BadgeProps {
  children: ReactNode;
  variant?: "default" | "outline";
  className?: string;
}

export function Badge({
  children,
  variant = "default",
  className,
}: BadgeProps) {
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-wide",
        variant === "default" &&
          "bg-sky-600/10 text-sky-700 ring-1 ring-sky-600/40",
        variant === "outline" &&
          "bg-transparent text-zinc-300 ring-1 ring-zinc-500/60",
        className,
      )}
    >
      {children}
    </span>
  );
}

