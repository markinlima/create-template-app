import { Link } from "@tanstack/react-router";
import { ArrowBigLeft, SearchIcon } from "lucide-react";
import { cn } from "tailwind-variants";

import { Button } from "@web/ui/button";

import { routes } from "@/core/routes";

export function PageNotFound() {
	return (
		<div className={cn("bg-background flex h-full items-center justify-center p-4")}>
			<div className="w-full max-w-md">
				<div className="space-y-6 text-center">
					<div className="relative">
						<div className="text-primary/70 text-8xl font-bold select-none">404</div>
						<div className="absolute inset-0 flex items-center justify-center">
							<SearchIcon className="text-primary size-16" />
						</div>
					</div>

					<div className="space-y-3">
						<h1 className="text-2xl font-bold">Oops! Página não encontrada</h1>
						<p className="text-muted-foreground leading-relaxed">
							A página que você está procurando não existe ou foi movida para outro local.
						</p>
					</div>

					<div className="flex flex-col gap-3">
						<Link to={routes.HOME_URL}>
							<Button raised className="w-full">
								<ArrowBigLeft />
								Voltar para o início
							</Button>
						</Link>
					</div>
				</div>
			</div>
		</div>
	);
}
