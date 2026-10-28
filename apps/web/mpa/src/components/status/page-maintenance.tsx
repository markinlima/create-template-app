import { Link } from "@tanstack/react-router";

import { Button } from "@web/ui/button";

export function PageMaintenance() {
	return (
		<section className="mx-auto flex h-svh w-[90%] flex-col items-center justify-center gap-5">
			<h1 className="font-semibold text-2xl">Página em manutenção</h1>
			<Link to="/">
				<Button size="lg" className="font-semibold">
					Voltar para o início
				</Button>
			</Link>
		</section>
	);
}
