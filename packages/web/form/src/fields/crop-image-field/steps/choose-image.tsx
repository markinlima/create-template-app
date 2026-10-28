import { ImageIcon, ImagePlusIcon, ShareIcon } from "lucide-react";
import { useId, useState } from "react";

import { beautifyBytes } from "@web/shared/utils/formatters/beautify-bytes";
import { Dialog } from "@web/ui/dialog";
import { DragAndDropFile } from "@web/ui/drag-and-drop";
import { RoundedIcon } from "@web/ui/rounded-icon";

import { useCropImageFieldContext } from "../hooks/use-crop-image-field-context";

export function ChooseImage() {
  const {
    handleNextStep,
    setImage,
    setCurrentStep,
    acceptedFileTypes,
    uncroppableFileTypes,
    getIsFileTypeAllowed,
    onFileTypeBlocked,
    maxFileSizeInBytes,
    resetForm,
  } = useCropImageFieldContext();

  const inputId = useId();
  const [error, setError] = useState<string | null>(null);

  function handleFileChange(file: File) {
    if (!file || file.size <= 0) {
      return;
    }

    if (!acceptedFileTypes?.includes(file.type)) {
      setError("Esse formato não é aceito. Escolha um JPG, PNG, WEBP ou GIF.");
      return;
    }

    setError(null);

    if (getIsFileTypeAllowed && !getIsFileTypeAllowed(file.type)) {
      resetForm();
      onFileTypeBlocked?.(file);
      return;
    }

    // ? Sent whole: the crop step would flatten it, so it goes straight to the confirmation.
    if (uncroppableFileTypes?.includes(file.type)) {
      if (maxFileSizeInBytes && file.size > maxFileSizeInBytes) {
        setError(
          `Essa imagem passa de ${beautifyBytes(maxFileSizeInBytes, 0)}.`,
        );
        return;
      }

      setImage(file);
      setCurrentStep(2);
      return;
    }

    setImage(file);
    handleNextStep();
  }

  return (
    <div className="w-md max-w-full space-y-6">
      <Dialog.header>
        <Dialog.title>
          <RoundedIcon>
            <ImageIcon className="size-5" />
          </RoundedIcon>
          Fazer Upload de Imagem
        </Dialog.title>
      </Dialog.header>
      <label htmlFor={inputId}>
        <DragAndDropFile
          onDropFile={(file) => handleFileChange(file)}
          className="flex cursor-pointer flex-col items-center justify-center p-8"
        >
          <ShareIcon className="mb-4 size-16" />
          <p className="mb-2 font-semibold text-lg">
            Arraste e solte sua imagem aqui
          </p>
          <p className="mb-4 text-muted-foreground text-sm">ou</p>
          {/* ? Not a button: a button inside a label swallows the click and never opens the file picker. The label does it. */}
          <div className="flex cursor-pointer items-center gap-2">
            <ImagePlusIcon className="size-5" />
            <span>Selecionar Arquivo</span>
          </div>
          <input
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) {
                return;
              }
              handleFileChange(file);
            }}
            id={inputId}
            accept={acceptedFileTypes?.join(",") || "*"}
            className="hidden"
          />
        </DragAndDropFile>
      </label>
      {!!error && (
        <p role="alert" className="text-center text-destructive text-sm">
          {error}
        </p>
      )}
      <div className="mt-2 text-center text-muted-foreground text-xs">
        Formatos suportados: JPG, PNG, WEBP, GIF.
      </div>
    </div>
  );
}
