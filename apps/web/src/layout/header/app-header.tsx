import { Link } from "@tanstack/react-router";

import { AppLogo } from "@/components/brand/app-logo";
import { routes } from "@/core/routes";
import { useActiveSession } from "@/modules/auth/hooks/use-active-session";

export function AppHeader() {
	const { user } = useActiveSession();

	return (
		<header className="h-header-height flex w-full items-center justify-between border-b px-4">
			<Link to={routes.DEFAULT_AUTHENTICATED_URL}>
				<AppLogo>
					<AppLogo.logo />
					<AppLogo.title />
				</AppLogo>
			</Link>
			<div className="flex items-center gap-4">
				<Link to={routes.SETTINGS_URL} className="text-muted-foreground hover:text-foreground text-sm">
					Configurações
				</Link>
				<span className="text-muted-foreground text-sm">Olá, {user.name}</span>
			</div>
		</header>
	);
}
