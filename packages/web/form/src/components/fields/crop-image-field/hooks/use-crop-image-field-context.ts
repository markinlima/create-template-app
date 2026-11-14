import { use } from "react";

import { CropImageFieldContext } from "../context/crop-image-field-context";

/**
 * Read the state of the crop image steps.
 *
 * @returns The image, its preview and the step actions.
 * @throws When used outside a `CropImageFieldProvider`.
 */
export function useCropImageFieldContext() {
  const context = use(CropImageFieldContext);
  if (!context) {
    throw new Error(
      "useCropImageFieldContext must be used within an CropImageFieldContext",
    );
  }
  return context;
}
