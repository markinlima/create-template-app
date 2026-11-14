import type { ReactNode } from "react";

import type { CropImageFieldSharedProps } from "../../../../types/crop-image-field-shared-props";
import { CropImageFieldProvider } from "../context/crop-image-context";

interface CropImageFieldProps extends CropImageFieldSharedProps {
  /** The steps, rendered inside the dialog. */
  children: ReactNode;
  /** Runs after the user confirms the image. */
  onConfirm?: () => void;
}

/** Provider of the choose, crop and send steps of an image field. */
export function CropImageFieldRoot({
  acceptedFileTypes = [],
  imageAspectRation,
  previousImageUrl,
  uncroppableFileTypes,
  getIsFileTypeAllowed,
  onFileTypeBlocked,
  maxFileSizeInBytes,
  onConfirm,
  children,
}: CropImageFieldProps) {
  return (
    <CropImageFieldProvider
      imageAspectRation={imageAspectRation}
      acceptedFileTypes={acceptedFileTypes}
      previousImageUrl={previousImageUrl}
      onConfirm={onConfirm}
      uncroppableFileTypes={uncroppableFileTypes}
      getIsFileTypeAllowed={getIsFileTypeAllowed}
      onFileTypeBlocked={onFileTypeBlocked}
      maxFileSizeInBytes={maxFileSizeInBytes}
    >
      {children}
    </CropImageFieldProvider>
  );
}
