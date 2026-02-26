"use client";

import type { InputHTMLAttributes } from "react";
import clsx from "clsx";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <label className="flex w-full flex-col gap-1 text-xs font-medium text-zinc-500">
      {label && <span className="uppercase tracking-wide">{label}</span>}
      <input
        className={clsx(
          "h-10 w-full rounded-full border border-zinc-300 bg-white px-4 text-sm text-zinc-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200",
          error && "border-red-500 focus:border-red-500 focus:ring-red-200",
          className,
        )}
        {...props}
      />
      {error && (
        <span className="text-[11px] font-normal text-red-500">{error}</span>
      )}
    </label>
  );
}

