"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface AdminSidebarLinkProps {
  href: string;
  label: string;
}

export function AdminSidebarLink({ href, label }: AdminSidebarLinkProps) {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <Link
      href={href}
      className={`flex items-center justify-between rounded-xl px-3 py-2 text-sm transition-colors ${
        isActive
          ? "bg-sky-500 text-white"
          : "text-zinc-200 hover:bg-zinc-800/70 hover:text-white"
      }`}
    >
      <span className="font-medium">{label}</span>
      <span className="text-[10px] uppercase tracking-wide text-zinc-400">
        {isActive ? "ACTIVO" : ""}
      </span>
    </Link>
  );
}
