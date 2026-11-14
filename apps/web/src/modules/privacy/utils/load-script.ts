/** Adds a `<script>` to the page, once: a second call with the same `src` does nothing. The attributes are the ones the tool asks for (`defer` and `async` are set as properties). */
export function loadScript(attributes: Record<string, string | boolean | undefined>) {
	const { src } = attributes;

	if (typeof src !== "string" || document.querySelector(`script[src="${src}"]`)) {
		return;
	}

	const script = document.createElement("script");

	for (const [name, value] of Object.entries(attributes)) {
		if (value === undefined) {
			continue;
		}

		if (name === "defer" || name === "async") {
			script[name] = value === true;
			continue;
		}

		script.setAttribute(name, String(value));
	}

	document.head.append(script);
}
