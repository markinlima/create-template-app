import { Link } from "@tanstack/react-router";

import { Button } from "@web/ui/button";

import { AppLogo } from "@/components/brand/app-logo";
import { routes } from "@/core/routes";

export function LandingHeader() {
	return (
		<header className="flex h-header-height w-full items-center justify-between border-b px-4">
			<Link to={routes.HOME_URL}>
				<AppLogo>
					<AppLogo.logo />
					<AppLogo.title />
				</AppLogo>
			</Link>
			<nav className="flex items-center gap-2">
				<Link to="/about-us">
					<Button variant="ghost">Sobre</Button>
				</Link>
				<Link to={routes.LOGIN_URL}>
					<Button>Entrar</Button>
				</Link>
			</nav>
		</header>
	);
}
