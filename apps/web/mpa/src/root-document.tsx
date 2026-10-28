import { HeadContent, Scripts } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { AppThemeProvider } from "@/core/themes/app-theme-provider";
import { useReactScan } from "@/lib/react-scan";

export function RootDocument({ children }: Readonly<{ children: ReactNode }>) {
	useReactScan();

	return (
		<html lang="pt">
			<head>
				<HeadContent />
			</head>
			<body>
				<AppThemeProvider>{children}</AppThemeProvider>
				<Scripts />
			</body>
		</html>
	);
}
