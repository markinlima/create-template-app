/**
 * Levels a theme can require. A user can use every theme whose level is at most their own level
 * (for example, the level of their subscription).
 */
export const themeLevels = {
	free: 0,
	basic: 1,
	pro: 2,
	premium: 3,
} as const;
