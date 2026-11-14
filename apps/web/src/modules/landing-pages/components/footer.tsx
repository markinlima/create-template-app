import { APP_CONFIG } from "@/core/info";

export function Footer() {
	return (
		<footer className="text-muted-foreground mt-auto border-t p-4 text-center text-sm">
			© {new Date().getFullYear()} {APP_CONFIG.brand.name}
		</footer>
	);
}
