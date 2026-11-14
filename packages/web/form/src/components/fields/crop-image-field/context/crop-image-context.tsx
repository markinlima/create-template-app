import { type ReactNode, useEffect, useMemo, useState } from "react";
import { cn } from "tailwind-variants";

import { Dialog } from "@web/ui/dialog";

import { useFieldContext } from "../../../../contexts/app-form-context";
import type { CropImageFieldSharedProps } from "../../../../types/crop-image-field-shared-props";
import { CropImageFieldChooseImage } from "../components/crop-image-field-choose-image";
import { CropImageFieldCropImage } from "../components/crop-image-field-crop-image";
import { CropImageFieldSendImage } from "../components/crop-image-field-send-image";
import {
  CropImageFieldContext,
  type CropImageFieldContextProps,
} from "./crop-image-field-context";

interface CropImageFieldProviderProps extends CropImageFieldSharedProps {
  children: ReactNode;
  className?: string;
  /** Runs after the user confirms the image. */
  onConfirm?: () => void;
}

/** Keeps the state of the steps (the file, its preview, the current step) and shows them in a dialog. */
export function CropImageFieldProvider({
  children,
  className,
  imageAspectRation,
  acceptedFileTypes,
  onConfirm,
  previousImageUrl,
  uncroppableFileTypes,
  getIsFileTypeAllowed,
  onFileTypeBlocked,
  maxFileSizeInBytes,
}: CropImageFieldProviderProps) {
  const [step, setStep] = useState(0);
  const [image, setImage] = useState<File | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const field = useFieldContext<File | null>();
  // NOTE: one address per file; made on every render it would leak and reload the cropper
  const imagePreviewUrl = useMemo(
    () => (image ? URL.createObjectURL(image) : null),
    [image],
  );

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
      }
    };
  }, [imagePreviewUrl]);

  function handleNextStep() {
    if (step === 2) {
      return;
    }
    setStep((prev) => prev + 1);
  }

  function setCurrentStep(step: number) {
    setStep(step);
  }

  function handlePreviousStep() {
    if (step === 0) {
      return;
    }
    setStep((prev) => prev - 1);
  }

  function resetForm() {
    setIsDialogOpen(false);
    setImage(null);
    field.handleChange(null);
    setStep(0);
  }

  async function onSubmit(image: Blob | File) {
    if (!image || image.size <= 0 || !image) {
      return;
    }
    field.handleChange(image as File);
    setIsDialogOpen(false);
    onConfirm?.();
  }

  const values: CropImageFieldContextProps = {
    resetForm,
    handleNextStep,
    handlePreviousStep,
    setCurrentStep,
    onSubmit,
    acceptedFileTypes,
    imageAspectRation,
    previousImageUrl,
    uncroppableFileTypes,
    getIsFileTypeAllowed,
    onFileTypeBlocked,
    maxFileSizeInBytes,
    image,
    setImage,
    imagePreviewUrl,
  };

  return (
    <CropImageFieldContext value={values}>
      <Dialog
        open={isDialogOpen}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            resetForm();
          }
          setIsDialogOpen(isOpen);
        }}
      >
        <Dialog.trigger className={cn("w-full", className)}>
          {children}
        </Dialog.trigger>
        <Dialog.content className="w-[calc(100%-2rem)] max-w-120">
          {step === 0 && <CropImageFieldChooseImage />}
          {step === 1 && <CropImageFieldCropImage />}
          {step === 2 && <CropImageFieldSendImage />}
        </Dialog.content>
      </Dialog>
    </CropImageFieldContext>
  );
}
