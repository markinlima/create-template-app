import { Spinner } from "./spinner";

/** Fallback shown at the end of the list while the next page loads. */
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
