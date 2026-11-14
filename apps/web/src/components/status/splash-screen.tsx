import { useState } from "react";

import { getRandomItem } from "@web/shared/utils";

import { AppLogo } from "@/components/brand/app-logo";
import { loadingPhrases } from "@/core/phrases";

export function SplashScreen() {
	const [phrase] = useState(() => getRandomItem(loadingPhrases));

	return (
		<section className="dark flex h-svh w-full flex-col items-center justify-center gap-2">
			<AppLogo className="flex-col">
				<AppLogo.logo className="size-16 animate-pulse" />
				<AppLogo.title className="text-3xl font-bold" />
			</AppLogo>
			<p className="text-muted-foreground text-center text-sm">{phrase}</p>
		</section>
	);
}
