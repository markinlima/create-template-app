import { type ReactNode, useEffect, useMemo, useState } from "react";
import { cn } from "tailwind-variants";

import { Dialog } from "@web/ui/dialog";

import { useFieldContext } from "../../../context/app-form-context";
import type { CropImageFieldSharedProps } from "../crop-image-field";
import {
  CropImageFieldContext,
  type CropImageFieldContextProps,
} from "../hooks/use-crop-image-field-context";
import { ChooseImage } from "../steps/choose-image.tsx";
import { CropImage } from "../steps/crop-image.tsx";
import { SendImage } from "../steps/send-image";

interface CropImageFieldProviderProps extends CropImageFieldSharedProps {
  children: ReactNode;
  className?: string;
  onConfirm?: () => void;
}

// choose image -> crop image -> send image

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
  // ? One address per file: made on every render it would leak, and the cropper would reload the image each time.
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
        <Dialog.content className="w-fit">
          {step === 0 && <ChooseImage />}
          {step === 1 && <CropImage />}
          {step === 2 && <SendImage />}
        </Dialog.content>
      </Dialog>
    </CropImageFieldContext>
  );
}
