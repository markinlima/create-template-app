import type { ReactNode } from "react";

import { CropImageFieldProvider } from "./context/crop-image-context";

export interface CropImageFieldSharedProps {
  imageAspectRation: number;
  acceptedFileTypes?: string[];
  previousImageUrl?: string;
  /**
   * File types that are sent as they are, without the crop step: the browser can't crop an animated image (a GIF)
   * without flattening it. The preview step still shows them.
   */
  uncroppableFileTypes?: string[];
  /** Whether the user can use a file type. When it says no, the file is dropped and `onFileTypeBlocked` runs. */
  getIsFileTypeAllowed?: (fileType: string) => boolean;
  /** Runs after a file of a type that isn't allowed was dropped (e.g. to explain why, or to show it). */
  onFileTypeBlocked?: (file: File) => void;
  /** The biggest file that can be sent. It is checked on the file that is really sent (an uncropped one as it came, a cropped one after the crop). */
  maxFileSizeInBytes?: number;
}

interface CropImageFieldProps extends CropImageFieldSharedProps {
  children: ReactNode;
  onConfirm?: () => void;
}

export function CropImageField({
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
