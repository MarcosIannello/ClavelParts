"use client";

import { useTheme } from "@/context/ThemeContext";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      role="switch"
      aria-checked={isDark}
      aria-label="Cambiar entre modo claro y oscuro"
      title="Cambiar tema"
      className="inline-flex h-9 items-center rounded-full border border-[var(--header-control-border)] px-2 transition hover:brightness-110"
    >
      <span
        aria-hidden="true"
        className={`relative inline-flex h-5 w-10 items-center rounded-full transition ${
          isDark
            ? "bg-[var(--header-nav-active-bg)]"
            : "bg-[var(--header-control-bg)]"
        }`}
      >
        <span
          className={`inline-block h-4 w-4 transform rounded-full bg-[var(--header-nav-active-text)] shadow transition ${
            isDark ? "translate-x-5" : "translate-x-0.5"
          }`}
        />
      </span>
    </button>
  );
}
