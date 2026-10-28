export interface GetRemainingCooldownOptions {
  /** When the cooldown started, in milliseconds. */
  startedAt: number;
  /** The current time, in milliseconds. */
  now: number;
  cooldownSeconds: number;
}

/** Whole seconds left of a cooldown (a started second counts as left), never below 0. */
export function getRemainingCooldown({
  startedAt,
  now,
  cooldownSeconds,
}: GetRemainingCooldownOptions) {
  return Math.max(0, Math.ceil(cooldownSeconds - (now - startedAt) / 1000));
}
