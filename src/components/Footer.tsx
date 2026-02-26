export function Footer() {
  return (
    <footer className="border-t border-[var(--footer-border)] bg-[var(--footer-bg)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-6 text-xs text-[var(--footer-text)] md:flex-row md:items-center md:justify-between md:px-6">
        <p>
          © {new Date().getFullYear()} CLAVELPARTS. Todos los derechos
          reservados.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            type="button"
            className="text-xs text-[var(--footer-text)] hover:text-[var(--footer-link-hover)]"
          >
            Términos y condiciones
          </button>
          <button
            type="button"
            className="text-xs text-[var(--footer-text)] hover:text-[var(--footer-link-hover)]"
          >
            Política de privacidad
          </button>
          <button
            type="button"
            className="text-xs text-[var(--footer-text)] hover:text-[var(--footer-link-hover)]"
          >
            Ayuda
          </button>
        </div>
      </div>
    </footer>
  );
}
