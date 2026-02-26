"use client";

import type { SelectHTMLAttributes, ReactNode } from "react";
import clsx from "clsx";

export interface SelectProps
  extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  startIcon?: ReactNode;
}

export function Select({
  label,
  error,
  startIcon,
  className,
  children,
  ...props
}: SelectProps) {
  return (
    <label className="flex w-full flex-col gap-1 text-xs font-medium text-zinc-500">
      {label && <span className="uppercase tracking-wide">{label}</span>}
      <div
        className={clsx(
          "flex h-10 w-full items-center overflow-hidden rounded-full border border-zinc-300 bg-white px-3 text-sm text-zinc-900 transition focus-within:border-sky-500 focus-within:ring-2 focus-within:ring-sky-200",
          error && "border-red-500 focus-within:border-red-500 focus-within:ring-red-200",
        )}
      >
        {startIcon && (
          <span className="mr-2 flex items-center text-zinc-400">
            {startIcon}
          </span>
        )}
        <select
          className={clsx(
            "h-full w-full bg-transparent pr-6 text-sm outline-none",
            className,
          )}
          {...props}
        >
          {children}
        </select>
      </div>
      {error && (
        <span className="text-[11px] font-normal text-red-500">{error}</span>
      )}
    </label>
  );
}

