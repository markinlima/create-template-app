import type { ImageTypes } from "@/types/images-types.generated";

declare module "@web/ui/image" {
	interface ImageRegistry {
		src: ImageTypes;
	}
}
