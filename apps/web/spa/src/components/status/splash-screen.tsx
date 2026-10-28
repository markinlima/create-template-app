import { useState } from "react";

import { getRandomItem } from "@web/shared/utils/get-random-item";

import { AppLogo } from "@/components/brand/app-logo";
import { loadingPhrases } from "@/core/phrases";

export function SplashScreen() {
	const [phrase] = useState(() => getRandomItem(loadingPhrases));

	return (
		<section className="dark flex h-svh w-full flex-col items-center justify-center gap-2">
			<AppLogo className="flex-col">
				<AppLogo.logo className="size-16 animate-pulse" />
				<AppLogo.title className="font-bold text-3xl" />
			</AppLogo>
			<p className="text-center text-muted-foreground text-sm">{phrase}</p>
		</section>
	);
}
