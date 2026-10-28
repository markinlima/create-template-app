import { Link } from "@tanstack/react-router";

import { AppLogo } from "@/components/brand/app-logo";
import { routes } from "@/core/routes";
import { useActiveSession } from "@/modules/auth/hooks/session";

export function AppHeader() {
	const { user } = useActiveSession();

	return (
		<header className="flex h-header-height w-full items-center justify-between border-b px-4">
			<Link to={routes.DEFAULT_AUTHENTICATED_URL}>
				<AppLogo>
					<AppLogo.logo />
					<AppLogo.title />
				</AppLogo>
			</Link>
			<span className="text-muted-foreground text-sm">Olá, {user.name}</span>
		</header>
	);
}
