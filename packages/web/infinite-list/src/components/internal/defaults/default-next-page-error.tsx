/** Fallback shown when fetching the next page failed, with a button that calls `retry`. */
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
