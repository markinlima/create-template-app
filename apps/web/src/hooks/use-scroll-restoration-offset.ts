import { useElementScrollRestoration } from "@tanstack/react-router";

import { useInfiniteListScrollContext } from "@web/infinite-list";

/**
 * Scroll offset the router saved for the closest `InfiniteListScroll` (the one with a
 * `scrollRestorationId`), to pass to a list's `initialScrollOffset` so it resumes where the user
 * stopped. It is `0` when the container has no id. Must be used inside an `InfiniteListScroll`.
 *
 * Only lists that should resume need it; quick access lists (dialogs, pickers) don't.
 */
export function useScrollRestorationOffset() {
	const { scrollContainerRef, scrollRestorationId } = useInfiniteListScrollContext();

	const scrollEntry = useElementScrollRestoration({
		id: scrollRestorationId || "",
		getElement: () => scrollContainerRef.current,
	});

	return scrollRestorationId ? scrollEntry?.scrollY : 0;
}
