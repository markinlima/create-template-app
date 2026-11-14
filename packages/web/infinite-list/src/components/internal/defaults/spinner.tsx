/** Spinning arc shared by the default loaders. */
export function Spinner() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className="text-primary size-6 animate-spin"
    >
      <path d="M21 12a9 9 0 1 1-6.2-8.55" strokeLinecap="round" />
    </svg>
  );
}
