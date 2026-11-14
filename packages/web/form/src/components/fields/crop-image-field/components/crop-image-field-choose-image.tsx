import { ImageIcon, ImagePlusIcon, ShareIcon } from "lucide-react";
import { useId, useState } from "react";

import { beautifyBytes } from "@web/shared/utils";
import { Dialog } from "@web/ui/dialog";
import { DragAndDropFile } from "@web/ui/drag-and-drop";
import { RoundedIcon } from "@web/ui/rounded-icon";

import { useCropImageFieldContext } from "../hooks/use-crop-image-field-context";

/** Step where the user picks or drops an image file. */
export function CropImageFieldChooseImage() {
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

    // NOTE: sent whole, since the crop step would flatten it
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
    <div className="w-full space-y-6">
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
          <p className="mb-2 text-lg font-semibold">
            Arraste e solte sua imagem aqui
          </p>
          <p className="text-muted-foreground mb-4 text-sm">ou</p>
          {/* NOTE: not a button: inside a label it swallows the click and the file picker never opens */}
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
        <p role="alert" className="text-destructive text-center text-sm">
          {error}
        </p>
      )}
      <div className="text-muted-foreground mt-2 text-center text-xs">
        Formatos suportados: JPG, PNG, WEBP, GIF.
      </div>
    </div>
  );
}
