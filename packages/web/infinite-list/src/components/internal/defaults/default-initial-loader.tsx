import { Spinner } from "./spinner";

/** Fallback shown instead of the items while the first page loads. */
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
