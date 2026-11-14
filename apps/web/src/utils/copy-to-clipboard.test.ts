import { describe, expect, it, mock, spyOn } from "bun:test";

import { toast } from "@web/toast";

import { copyToClipboard } from "@/utils/copy-to-clipboard";

const writeText = mock(() => Promise.resolve());

Object.assign(navigator, {
	clipboard: { writeText },
});

describe("copyToClipboard", () => {
	it("should call navigator.clipboard.writeText and toast.success", () => {
		const success = spyOn(toast, "success").mockImplementation(() => "");
		const value = "test value";
		const message = "test message";

		copyToClipboard({ value, message });

		expect(writeText).toHaveBeenCalledWith(value);
		expect(success).toHaveBeenCalledWith({ title: "Valor Copiado!", description: message });
		success.mockRestore();
	});
});
