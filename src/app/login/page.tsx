"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const googleClientId =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ??
  process.env.NEXT_PUBLIC_AUTH_GOOGLE_ID ??
  "";

const OAUTH_STATE_KEY = "clavelparts_oauth_state_v1";
const OAUTH_RETURN_TO_KEY = "clavelparts_oauth_return_to_v1";

const oauthErrorMessages: Record<string, string> = {
  access_denied: "Cancelaste el acceso con Google.",
  invalid_request: "La solicitud de autenticación es inválida.",
  unauthorized_client: "Este cliente de Google no está habilitado.",
  unsupported_response_type: "La app no tiene habilitado este tipo de respuesta OAuth.",
  invalid_scope: "El alcance solicitado a Google no es válido.",
  server_error: "Google devolvió un error temporal. Intentá nuevamente.",
  temporarily_unavailable: "Google está temporalmente no disponible.",
};

function randomString(length = 40): string {
  const bytes = new Uint8Array(length);
  window.crypto.getRandomValues(bytes);
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function clearOAuthHash() {
  window.history.replaceState({}, document.title, window.location.pathname + window.location.search);
}

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { status, applyGoogleIdToken } = useAuth();
  const [localErrorMessage, setLocalErrorMessage] = useState<string | null>(null);

  const pushOAuthError = useCallback(
    (message: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("oauth_error", message);
      router.replace(`/login?${params.toString()}`);
    },
    [router, searchParams],
  );

  useEffect(() => {
    if (status === "loading") return;

    const hash = window.location.hash.startsWith("#")
      ? window.location.hash.slice(1)
      : window.location.hash;
    const hashParams = new URLSearchParams(hash);

    const oauthError = hashParams.get("error");
    const idToken = hashParams.get("id_token");
    const returnedState = hashParams.get("state");

    if (oauthError) {
      clearOAuthHash();
      pushOAuthError(
        oauthErrorMessages[oauthError] ?? "No se pudo iniciar sesión con Google.",
      );
      return;
    }

    if (!idToken) {
      if (status === "authenticated") {
        const from = searchParams.get("from");
        const safeFrom = from?.startsWith("/") ? from : "/";
        router.replace(safeFrom);
        return;
      }
      return;
    }

    const expectedState = window.sessionStorage.getItem(OAUTH_STATE_KEY);
    const returnTo = window.sessionStorage.getItem(OAUTH_RETURN_TO_KEY) ?? "/";
    window.sessionStorage.removeItem(OAUTH_STATE_KEY);
    window.sessionStorage.removeItem(OAUTH_RETURN_TO_KEY);

    if (!expectedState || returnedState !== expectedState) {
      clearOAuthHash();
      pushOAuthError("No se pudo validar la sesión OAuth. Intentá nuevamente.");
      return;
    }

    const result = applyGoogleIdToken(idToken);
    clearOAuthHash();

    if (!result.ok) {
      pushOAuthError(result.error);
      return;
    }

    router.replace(returnTo.startsWith("/") ? returnTo : "/");
  }, [applyGoogleIdToken, pushOAuthError, router, searchParams, status]);

  const handleGoogleLogin = () => {
    setLocalErrorMessage(null);

    if (!googleClientId) {
      setLocalErrorMessage(
        "Falta NEXT_PUBLIC_GOOGLE_CLIENT_ID (o NEXT_PUBLIC_AUTH_GOOGLE_ID) en .env.local.",
      );
      return;
    }

    const from = searchParams.get("from");
    const returnTo = from?.startsWith("/") ? from : "/";
    const state = randomString(24);
    const nonce = randomString(24);
    const redirectUri = `${window.location.origin}/login`;

    window.sessionStorage.setItem(OAUTH_STATE_KEY, state);
    window.sessionStorage.setItem(OAUTH_RETURN_TO_KEY, returnTo);

    const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    googleAuthUrl.searchParams.set("client_id", googleClientId);
    googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
    googleAuthUrl.searchParams.set("response_type", "id_token");
    googleAuthUrl.searchParams.set("scope", "openid profile email");
    googleAuthUrl.searchParams.set("state", state);
    googleAuthUrl.searchParams.set("nonce", nonce);
    googleAuthUrl.searchParams.set("prompt", "select_account");

    window.location.assign(googleAuthUrl.toString());
  };

  const oauthErrorMessage = searchParams.get("oauth_error");
  const errorMessage = localErrorMessage ?? oauthErrorMessage;
  const missingClientConfig = !googleClientId;
  const disableButton = status === "loading" || status === "authenticated" || missingClientConfig;

  return (
    <div className="flex min-h-screen items-center justify-center bg-[var(--login-bg)] px-4">
      <div className="w-full max-w-md rounded-xl border border-[var(--login-card-border)] bg-[var(--login-card-bg)] p-8 shadow-md">
        <h1 className="mb-2 text-center text-2xl font-semibold tracking-tight text-[var(--login-title)]">
          CLAVELPARTS
        </h1>
        <p className="mb-6 text-center text-sm text-[var(--login-subtitle)]">
          Iniciá sesión para acceder a tu garage, carrito y panel.
        </p>

        {missingClientConfig ? (
          <p className="mb-4 rounded-lg border border-[var(--alert-warning-border)] bg-[var(--alert-warning-bg)] px-3 py-2 text-xs text-[var(--alert-warning-text)]">
            Falta configurar `NEXT_PUBLIC_GOOGLE_CLIENT_ID` (o `NEXT_PUBLIC_AUTH_GOOGLE_ID`) en
            tu `.env.local`.
          </p>
        ) : null}

        {errorMessage ? (
          <p className="mb-4 rounded-lg border border-[var(--alert-error-border)] bg-[var(--alert-error-bg)] px-3 py-2 text-xs text-[var(--alert-error-text)]">
            {errorMessage}
          </p>
        ) : null}

        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={disableButton}
          className="flex w-full items-center justify-center rounded-full bg-[var(--login-button-bg)] py-3 text-sm font-medium text-[var(--login-button-text)] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "loading" ? "Cargando..." : "Continuar con Google"}
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}
