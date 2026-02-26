"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  picture?: string;
};

type ApplyTokenResult =
  | { ok: true; user: AuthUser }
  | { ok: false; error: string };

type AuthContextValue = {
  user: AuthUser | null;
  status: "loading" | "authenticated" | "unauthenticated";
  applyGoogleIdToken: (idToken: string) => ApplyTokenResult;
  signOut: () => void;
};

const STORAGE_KEY = "clavelparts_auth_user_v1";
const AUTH_COOKIE_NAME = "clavelparts_auth";
const AUTH_COOKIE_VALUE = "1";
const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 dias

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

function setAuthCookie() {
  document.cookie = `${AUTH_COOKIE_NAME}=${AUTH_COOKIE_VALUE}; path=/; max-age=${AUTH_COOKIE_MAX_AGE}; samesite=lax`;
}

function clearAuthCookie() {
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; samesite=lax`;
}

function decodeJwtPayload(token: string): Record<string, unknown> | null {
  const parts = token.split(".");
  if (parts.length < 2) return null;

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");
    const binary = window.atob(padded);
    const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
    const json = new TextDecoder().decode(bytes);
    return JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }
}

function readStoredUser(): AuthUser | null {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as AuthUser;
    if (!parsed?.id || !parsed?.email || !parsed?.name) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [status, setStatus] = useState<"loading" | "authenticated" | "unauthenticated">(
    "loading",
  );

  useEffect(() => {
    const storedUser = readStoredUser();
    setUser(storedUser);
    setStatus(storedUser ? "authenticated" : "unauthenticated");
  }, []);

  const applyGoogleIdToken = useCallback((idToken: string): ApplyTokenResult => {
    const payload = decodeJwtPayload(idToken);
    if (!payload) {
      return { ok: false, error: "No se pudo leer la respuesta de Google." };
    }

    const sub = typeof payload.sub === "string" ? payload.sub : "";
    const name = typeof payload.name === "string" ? payload.name : "";
    const email = typeof payload.email === "string" ? payload.email : "";
    const picture = typeof payload.picture === "string" ? payload.picture : undefined;
    const exp = typeof payload.exp === "number" ? payload.exp : null;

    if (!sub || !name || !email) {
      return { ok: false, error: "Google no devolvió los datos mínimos del perfil." };
    }

    if (exp && Date.now() / 1000 >= exp) {
      return { ok: false, error: "La respuesta de Google expiró. Intentá nuevamente." };
    }

    const nextUser: AuthUser = { id: sub, name, email, picture };

    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextUser));
    } catch {
      return { ok: false, error: "No se pudo guardar la sesión local." };
    }

    setAuthCookie();
    setUser(nextUser);
    setStatus("authenticated");
    return { ok: true, user: nextUser };
  }, []);

  const signOut = useCallback(() => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } finally {
      clearAuthCookie();
      setUser(null);
      setStatus("unauthenticated");
    }
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({ user, status, applyGoogleIdToken, signOut }),
    [applyGoogleIdToken, signOut, status, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
