/** The `build` section of a service, as `docker compose config` resolves it. */
export interface ComposeBuild {
  context: string;
  dockerfile?: string;
  target?: string;
  pull?: boolean;
  args?: Record<string, string | null>;
  secrets?: { source: string; target?: string }[];
}

/** A resolved compose file of a test stack. */
export interface ComposeConfig {
  name: string;
  services: Record<string, { image?: string; build?: ComposeBuild }>;
  secrets?: Record<string, { file?: string }>;
}
