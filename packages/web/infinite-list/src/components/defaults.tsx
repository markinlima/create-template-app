/** Minimal fallbacks, so the lists work without any slot. Pass your own slots to match the app. */

export function DefaultEmpty() {
  return (
    <div className="flex h-40 items-center justify-center text-center text-muted-foreground text-sm">
      Nada por aqui.
    </div>
  );
}

export function DefaultFooter() {
  return (
    <div className="flex w-full items-center justify-center p-4 text-muted-foreground text-sm">
      Fim da lista.
    </div>
  );
}

export function DefaultNextPageError({ retry }: { retry: () => void }) {
  return (
    <div className="flex h-20 items-center justify-center">
      <button
        type="button"
        onClick={retry}
        className="cursor-pointer rounded-md border px-3 py-1 text-sm"
      >
        Tentar novamente
      </button>
    </div>
  );
}

function Spinner() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="size-6 animate-spin text-primary"
    >
      <path d="M21 12a9 9 0 1 1-6.2-8.55" strokeLinecap="round" />
    </svg>
  );
}

export function DefaultInitialLoader() {
  return (
    <div
      role="status"
      aria-label="Carregando"
      className="flex h-40 items-center justify-center"
    >
      <Spinner />
    </div>
  );
}

export function DefaultNextPageLoader() {
  return (
    <div
      role="status"
      aria-label="Carregando mais"
      className="flex h-20 items-center justify-center"
    >
      <Spinner />
    </div>
  );
}
