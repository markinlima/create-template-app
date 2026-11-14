// ? The addresses of the app that carry the username of someone: the profile, the share page of a profile and the collections of a user.
const USER_PATH_PATTERN = /(\/(?:profile|collections)\/)[^/?#\s]+/g;

/** Replaces the username in an address (`/app/profile/ana` becomes `/app/profile/:username`), so an error report doesn't say whose page was open. */
export function redactUserPaths(value: string) {
	return value.replace(USER_PATH_PATTERN, "$1:username");
}
