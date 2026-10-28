import { createContext, type Dispatch, type SetStateAction, use } from "react";

import type { CropImageFieldSharedProps } from "../crop-image-field";

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

export const CropImageFieldContext =
  createContext<CropImageFieldContextProps | null>(null);

export function useCropImageFieldContext() {
  const context = use(CropImageFieldContext);
  if (!context) {
    throw new Error(
      "useCropImageFieldContext must be used within an CropImageFieldContext",
    );
  }
  return context;
}
