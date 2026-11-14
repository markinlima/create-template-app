import { createContext, type Dispatch, type SetStateAction } from "react";

import type { CropImageFieldSharedProps } from "../../../../types/crop-image-field-shared-props";

/** What the crop image provider shares with its steps. */
export interface CropImageFieldContextProps extends CropImageFieldSharedProps {
  image: File | null;
  imagePreviewUrl: string | null;
  setImage: Dispatch<SetStateAction<File | null>>;
  setCurrentStep: (step: number) => void;
  handleNextStep: () => void;
  handlePreviousStep: () => void;
  resetForm: () => void;
  onSubmit: (image: Blob) => void;
}

/** Context of the crop image steps; read it through `useCropImageFieldContext`. */
export const CropImageFieldContext =
  createContext<CropImageFieldContextProps | null>(null);
